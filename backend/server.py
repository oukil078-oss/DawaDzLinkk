from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Literal
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import jwt
import os
import secrets
import json
import uuid
import asyncio
import urllib.request
import urllib.error
import smtplib
import email.mime.multipart
import email.mime.text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ==========================================
# APP CONFIGURATION
# ==========================================

app = FastAPI(title="DawaLink API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
JWT_SECRET = os.environ.get("JWT_SECRET", secrets.token_hex(32))
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# MongoDB Configuration
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "dawalink")

# File Upload Configuration
UPLOAD_DIR = "/app/uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Email Configuration — Resend SMTP relay (bypasses Cloudflare HTTP blocking)
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.resend.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "465"))
SMTP_USER = os.environ.get("SMTP_USER", "resend")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", RESEND_API_KEY)
SMTP_FROM = os.environ.get("SMTP_FROM", "DawaDzLink <orders@dawadzlink.com>")

# Security
security = HTTPBearer()

# ==========================================
# DATABASE CONNECTION
# ==========================================

client = None
db = None

@app.on_event("startup")
async def startup_db():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Create indexes for better performance
    await db.users.create_index("email", unique=True)
    await db.pharmacies.create_index("user_id", unique=True)
    await db.pharmacies.create_index("registry_number", unique=True)
    await db.suppliers.create_index("user_id", unique=True)
    await db.suppliers.create_index("registry_number", unique=True)
    await db.products.create_index("supplier_id")
    await db.products.create_index([("name", "text"), ("reference", "text"), ("dci", "text")])
    await db.agents.create_index("supplier_id")
    await db.orders.create_index("pharmacy_id")
    await db.orders.create_index("supplier_id")
    await db.orders.create_index("status")
    await db.documents.create_index("user_id")
    await db.reviews.create_index("supplier_id")
    await db.cart_items.create_index([("pharmacy_id", 1), ("product_id", 1)], unique=True)
    await db.password_reset_tokens.create_index("email", unique=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.email_change_tokens.create_index("admin_id", unique=True)
    await db.email_change_tokens.create_index("expires_at", expireAfterSeconds=0)

    print("✅ Connected to MongoDB")
    
    # Auto-seed admin account if not exists
    admin_exists = await db.users.find_one({"email": "admin@dawalink.dz"})
    if not admin_exists:
        admin_doc = {
            "email": "admin@dawalink.dz",
            "password": hash_password("admin123456"),
            "full_name": "Admin Principal",
            "phone": "+213 555 000 001",
            "role": "admin",
            "status": "active",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(admin_doc)
        print("✅ Admin account created (admin@dawalink.dz)")
    else:
        print("✅ Admin account already exists")

@app.on_event("shutdown")
async def shutdown_db():
    global client
    if client:
        client.close()

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                result["id"] = str(value)
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    return doc

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token invalide")
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
        
        return serialize_doc(user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

async def require_admin(user = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    return user

async def require_active(user = Depends(get_current_user)):
    if user.get("status") != "active" and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Votre compte n'est pas encore activé")
    return user

# ==========================================
# PYDANTIC MODELS
# ==========================================

class RegisterPharmacyRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    phone: str
    pharmacy_name: str
    registry_number: str
    address: str
    wilaya: str
    document_ids: Optional[List[str]] = None

class RegisterSupplierRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    phone: str
    company_name: str
    registry_number: str
    address: str
    wilaya: str
    document_ids: Optional[List[str]] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UpdateUserStatusRequest(BaseModel):
    status: Literal["active", "suspended", "rejected"]

class ProductCreate(BaseModel):
    name: str
    reference: str
    dci: str
    description: Optional[str] = None
    category: Optional[str] = None
    product_type: Literal["medical", "paramedical", "other"] = "medical"
    expiry_date: Optional[str] = None  # Format: YYYY-MM-DD
    price: float
    ug: int = 0
    stock_quantity: int = 0
    min_order_quantity: int = 1
    available: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    reference: Optional[str] = None
    dci: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    product_type: Optional[Literal["medical", "paramedical", "other"]] = None
    expiry_date: Optional[str] = None
    price: Optional[float] = None
    ug: Optional[int] = None
    stock_quantity: Optional[int] = None
    min_order_quantity: Optional[int] = None
    available: Optional[bool] = None

class AgentCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    whatsapp: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    region: str

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    whatsapp: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    region: Optional[str] = None
    is_active: Optional[bool] = None

class OrderCreate(BaseModel):
    supplier_id: str
    items: List[dict]  # [{product_id, quantity}]
    notes: Optional[str] = None
    payment_method: Literal["payment_on_delivery", "baridimob", "ccp"] = "payment_on_delivery"
    delivery_address: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: Literal["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    cancellation_reason: Optional[str] = None

class ReviewCreate(BaseModel):
    supplier_id: str
    rating: int = Field(ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None
    order_id: Optional[str] = None

class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

# Pharmacy Inventory Models
class PharmacyProductCreate(BaseModel):
    name: str
    reference: str
    dci: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    product_type: Literal["medical", "paramedical", "other"] = "medical"
    expiry_date: Optional[str] = None  # Format: YYYY-MM-DD
    purchase_price: float  # Prix d'achat
    selling_price: float  # Prix de vente
    stock_quantity: int = 0
    min_stock_alert: int = 10  # Alerte stock minimum
    supplier_name: Optional[str] = None  # Nom du fournisseur (texte libre)

class PharmacyProductUpdate(BaseModel):
    name: Optional[str] = None
    reference: Optional[str] = None
    dci: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    product_type: Optional[Literal["medical", "paramedical", "other"]] = None
    expiry_date: Optional[str] = None
    purchase_price: Optional[float] = None
    selling_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    min_stock_alert: Optional[int] = None
    supplier_name: Optional[str] = None

class StockMovement(BaseModel):
    product_id: str
    movement_type: Literal["in", "out", "adjustment"]
    quantity: int
    reason: Optional[str] = None

# Excel AI Analysis Model
class ExcelAnalysisRequest(BaseModel):
    columns: List[str]  # Column names from Excel
    sample_data: List[dict]  # First few rows as sample

# Admin Review Model
class ReviewUserRequest(BaseModel):
    decision: Literal["approved", "rejected"]
    rejection_reason: Optional[str] = None
    rejected_documents: Optional[List[str]] = None  # List of doc_type names that were rejected

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyResetCodeRequest(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str = Field(min_length=6)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)

class RequestEmailChangeRequest(BaseModel):
    new_email: EmailStr

class ConfirmEmailChangeRequest(BaseModel):
    code: str

# ==========================================
# AUTH ENDPOINTS
# ==========================================

@app.post("/api/auth/register/pharmacy")
async def register_pharmacy(data: RegisterPharmacyRequest):
    # Check if email exists
    existing = await db.users.find_one({"email": data.email})
    if existing:
        # Allow re-registration if previously rejected
        if existing.get("status") == "rejected":
            # Delete old user data
            old_id = str(existing["_id"])
            await db.users.delete_one({"_id": existing["_id"]})
            await db.pharmacies.delete_many({"user_id": old_id})
            await db.documents.delete_many({"user_id": old_id})
        else:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    # Check registry number (exclude rejected)
    existing_reg = await db.pharmacies.find_one({"registry_number": data.registry_number})
    if existing_reg:
        # Check if the user is rejected
        reg_user = await db.users.find_one({"_id": ObjectId(existing_reg["user_id"]) if ObjectId.is_valid(existing_reg.get("user_id", "")) else None})
        if not reg_user or reg_user.get("status") != "rejected":
            raise HTTPException(status_code=400, detail="Ce numéro de registre est déjà utilisé")
        else:
            await db.pharmacies.delete_one({"_id": existing_reg["_id"]})
    
    # Create user
    user_doc = {
        "email": data.email,
        "password": hash_password(data.password),
        "full_name": data.full_name,
        "phone": data.phone,
        "role": "pharmacy",
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create pharmacy profile
    pharmacy_doc = {
        "user_id": user_id,
        "pharmacy_name": data.pharmacy_name,
        "registry_number": data.registry_number,
        "address": data.address,
        "wilaya": data.wilaya,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await db.pharmacies.insert_one(pharmacy_doc)
    
    # Link uploaded documents to user
    if data.document_ids:
        valid_ids = [ObjectId(did) for did in data.document_ids if ObjectId.is_valid(did)]
        if valid_ids:
            await db.documents.update_many(
                {"_id": {"$in": valid_ids}},
                {"$set": {"user_id": user_id}}
            )

    asyncio.create_task(send_registration_pending_email(
        to_email=data.email,
        full_name=data.full_name,
        entity_name=data.pharmacy_name,
        role="pharmacy"
    ))
    asyncio.create_task(send_admin_new_signup_notification_email(
        entity_name=data.pharmacy_name,
        full_name=data.full_name,
        email=data.email,
        role="pharmacy"
    ))

    return {"message": "Inscription réussie. Votre compte est en attente d'approbation.", "user_id": user_id}

@app.post("/api/auth/register/supplier")
async def register_supplier(data: RegisterSupplierRequest):
    # Check if email exists
    existing = await db.users.find_one({"email": data.email})
    if existing:
        # Allow re-registration if previously rejected
        if existing.get("status") == "rejected":
            old_id = str(existing["_id"])
            await db.users.delete_one({"_id": existing["_id"]})
            await db.suppliers.delete_many({"user_id": old_id})
            await db.documents.delete_many({"user_id": old_id})
        else:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    # Check registry number (exclude rejected)
    existing_reg = await db.suppliers.find_one({"registry_number": data.registry_number})
    if existing_reg:
        reg_user = await db.users.find_one({"_id": ObjectId(existing_reg["user_id"]) if ObjectId.is_valid(existing_reg.get("user_id", "")) else None})
        if not reg_user or reg_user.get("status") != "rejected":
            raise HTTPException(status_code=400, detail="Ce numéro de registre est déjà utilisé")
        else:
            await db.suppliers.delete_one({"_id": existing_reg["_id"]})
    
    # Create user
    user_doc = {
        "email": data.email,
        "password": hash_password(data.password),
        "full_name": data.full_name,
        "phone": data.phone,
        "role": "supplier",
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create supplier profile
    supplier_doc = {
        "user_id": user_id,
        "company_name": data.company_name,
        "registry_number": data.registry_number,
        "address": data.address,
        "wilaya": data.wilaya,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await db.suppliers.insert_one(supplier_doc)
    
    # Link uploaded documents to user
    if data.document_ids:
        valid_ids = [ObjectId(did) for did in data.document_ids if ObjectId.is_valid(did)]
        if valid_ids:
            await db.documents.update_many(
                {"_id": {"$in": valid_ids}},
                {"$set": {"user_id": user_id}}
            )

    asyncio.create_task(send_registration_pending_email(
        to_email=data.email,
        full_name=data.full_name,
        entity_name=data.company_name,
        role="supplier"
    ))
    asyncio.create_task(send_admin_new_signup_notification_email(
        entity_name=data.company_name,
        full_name=data.full_name,
        email=data.email,
        role="supplier"
    ))

    return {"message": "Inscription réussie. Votre compte est en attente d'approbation.", "user_id": user_id}

@app.post("/api/auth/login")
async def login(data: LoginRequest):
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    # Check if user is rejected - return specific error with info
    if user.get("status") == "rejected":
        rejection_info = {
            "rejection_reason": user.get("rejection_reason", "Documents non conformes"),
            "rejected_documents": user.get("rejected_documents", []),
            "reviewed_at": user.get("reviewed_at").isoformat() if user.get("reviewed_at") else None
        }
        raise HTTPException(
            status_code=403,
            detail={
                "type": "account_rejected",
                "message": "Votre compte a été rejeté. Veuillez vous réinscrire avec des documents conformes.",
                "rejection_info": rejection_info
            }
        )
    
    # Get additional details based on role
    details = None
    if user["role"] == "pharmacy":
        details = await db.pharmacies.find_one({"user_id": str(user["_id"])})
    elif user["role"] == "supplier":
        details = await db.suppliers.find_one({"user_id": str(user["_id"])})
    
    token = create_token(str(user["_id"]), user["role"])
    
    user_data = serialize_doc(user)
    del user_data["password"]
    
    return {
        "token": token,
        "user": user_data,
        "details": serialize_doc(details) if details else None
    }

@app.get("/api/auth/me")
async def get_me(user = Depends(get_current_user)):
    user_data = dict(user)
    if "password" in user_data:
        del user_data["password"]
    
    details = None
    if user["role"] == "pharmacy":
        details = await db.pharmacies.find_one({"user_id": user["id"]})
    elif user["role"] == "supplier":
        details = await db.suppliers.find_one({"user_id": user["id"]})
    
    return {
        "user": user_data,
        "details": serialize_doc(details) if details else None
    }

@app.put("/api/auth/profile")
async def update_profile(data: UpdateProfileRequest, user = Depends(get_current_user)):
    updates = {k: v for k, v in data.dict().items() if v is not None}
    if updates:
        updates["updated_at"] = datetime.now(timezone.utc)
        await db.users.update_one({"_id": ObjectId(user["id"])}, {"$set": updates})
    
    updated_user = await db.users.find_one({"_id": ObjectId(user["id"])})
    user_data = serialize_doc(updated_user)
    del user_data["password"]
    return user_data

@app.post("/api/auth/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    user = await db.users.find_one({"email": data.email})
    # Always return success to avoid email enumeration
    if not user:
        return {"message": "Si cet email est enregistré, un code de vérification a été envoyé."}

    # Generate 6-digit code
    code = str(secrets.randbelow(1000000)).zfill(6)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    await db.password_reset_tokens.update_one(
        {"email": data.email},
        {"$set": {"code": code, "expires_at": expires_at, "reset_token": None, "used": False}},
        upsert=True
    )

    asyncio.create_task(send_password_reset_email(
        to_email=data.email,
        full_name=user.get("full_name", ""),
        code=code
    ))

    return {"message": "Si cet email est enregistré, un code de vérification a été envoyé."}

@app.post("/api/auth/verify-reset-code")
async def verify_reset_code(data: VerifyResetCodeRequest):
    token_doc = await db.password_reset_tokens.find_one({"email": data.email})
    if not token_doc:
        raise HTTPException(status_code=400, detail="Code invalide ou expiré")

    expires_at = token_doc.get("expires_at")
    if expires_at:
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Code expiré. Veuillez demander un nouveau code.")

    if token_doc.get("code") != data.code:
        raise HTTPException(status_code=400, detail="Code incorrect. Vérifiez le code reçu par email.")

    reset_token = secrets.token_urlsafe(32)
    await db.password_reset_tokens.update_one(
        {"email": data.email},
        {"$set": {"reset_token": reset_token, "code": None}}
    )

    return {"reset_token": reset_token, "message": "Code vérifié avec succès"}

@app.post("/api/auth/reset-password")
async def reset_password_endpoint(data: ResetPasswordRequest):
    token_doc = await db.password_reset_tokens.find_one({"reset_token": data.reset_token})
    if not token_doc:
        raise HTTPException(status_code=400, detail="Token invalide ou expiré")

    expires_at = token_doc.get("expires_at")
    if expires_at:
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Session expirée. Veuillez recommencer.")

    email = token_doc.get("email")
    await db.users.update_one(
        {"email": email},
        {"$set": {"password": hash_password(data.new_password), "updated_at": datetime.now(timezone.utc)}}
    )
    await db.password_reset_tokens.delete_one({"reset_token": data.reset_token})

    return {"message": "Mot de passe réinitialisé avec succès"}

# ==========================================
# ADMIN ENDPOINTS
# ==========================================

@app.get("/api/admin/stats")
async def get_admin_stats(admin = Depends(require_admin)):
    stats = {
        "total_users": await db.users.count_documents({}),
        "pending_users": await db.users.count_documents({"status": "pending", "role": {"$ne": "admin"}}),
        "pharmacies": await db.users.count_documents({"role": "pharmacy"}),
        "active_pharmacies": await db.users.count_documents({"role": "pharmacy", "status": "active"}),
        "suppliers": await db.users.count_documents({"role": "supplier"}),
        "active_suppliers": await db.users.count_documents({"role": "supplier", "status": "active"}),
        "total_products": await db.products.count_documents({}),
        "available_products": await db.products.count_documents({"available": True}),
        "total_orders": await db.orders.count_documents({}),
        "pending_orders": await db.orders.count_documents({"status": "pending"}),
        "total_agents": await db.agents.count_documents({}),
        "pending_documents": await db.documents.count_documents({"status": "pending"}),
        "total_reviews": await db.reviews.count_documents({})
    }
    
    # Calculate average rating
    pipeline = [{"$group": {"_id": None, "avg": {"$avg": "$rating"}}}]
    result = await db.reviews.aggregate(pipeline).to_list(1)
    stats["average_rating"] = round(result[0]["avg"], 1) if result and result[0]["avg"] else 0
    
    # Calculate total revenue
    pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    result = await db.orders.aggregate(pipeline).to_list(1)
    stats["total_revenue"] = result[0]["total"] if result and result[0]["total"] else 0
    
    return stats

@app.get("/api/admin/users")
async def get_all_users(admin = Depends(require_admin)):
    users = await db.users.find({}, {"password": 0}).sort("created_at", -1).to_list(1000)
    result = []
    for user in users:
        user_data = serialize_doc(user)
        user_id = str(user["_id"])
        if user["role"] == "pharmacy":
            details = await db.pharmacies.find_one({"user_id": user_id})
            user_data["details"] = serialize_doc(details)
        elif user["role"] == "supplier":
            details = await db.suppliers.find_one({"user_id": user_id})
            user_data["details"] = serialize_doc(details)
        documents = await db.documents.find({"user_id": user_id}).to_list(100)
        user_data["documents"] = serialize_doc(documents)
        result.append(user_data)
    return result

@app.get("/api/admin/users/pending")
async def get_pending_users(admin = Depends(require_admin)):
    users = await db.users.find(
        {"status": "pending", "role": {"$ne": "admin"}},
        {"password": 0}
    ).sort("created_at", -1).to_list(1000)
    
    # Enrich with details and documents
    result = []
    for user in users:
        user_data = serialize_doc(user)
        user_id = str(user["_id"])
        if user["role"] == "pharmacy":
            details = await db.pharmacies.find_one({"user_id": user_id})
            user_data["details"] = serialize_doc(details)
        elif user["role"] == "supplier":
            details = await db.suppliers.find_one({"user_id": user_id})
            user_data["details"] = serialize_doc(details)
        # Include documents
        documents = await db.documents.find({"user_id": user_id}).to_list(100)
        user_data["documents"] = serialize_doc(documents)
        result.append(user_data)
    
    return result

@app.get("/api/admin/pharmacies")
async def get_all_pharmacies(admin = Depends(require_admin)):
    users = await db.users.find({"role": "pharmacy"}, {"password": 0}).sort("created_at", -1).to_list(1000)
    
    # Batch fetch all pharmacy details in one query
    user_ids = [str(user["_id"]) for user in users]
    pharmacies_details = await db.pharmacies.find({"user_id": {"$in": user_ids}}).to_list(1000)
    details_map = {d["user_id"]: d for d in pharmacies_details}
    
    result = []
    for user in users:
        user_data = serialize_doc(user)
        user_data["details"] = serialize_doc(details_map.get(str(user["_id"])))
        result.append(user_data)
    return result

@app.get("/api/admin/suppliers")
async def get_all_suppliers(admin = Depends(require_admin)):
    users = await db.users.find({"role": "supplier"}, {"password": 0}).sort("created_at", -1).to_list(1000)
    
    # Batch fetch all supplier details in one query
    user_ids = [str(user["_id"]) for user in users]
    suppliers_details = await db.suppliers.find({"user_id": {"$in": user_ids}}).to_list(1000)
    details_map = {d["user_id"]: d for d in suppliers_details}
    
    result = []
    for user in users:
        user_data = serialize_doc(user)
        user_data["details"] = serialize_doc(details_map.get(str(user["_id"])))
        result.append(user_data)
    return result

@app.get("/api/admin/users/{user_id}")
async def get_user_details(user_id: str, admin = Depends(require_admin)):
    user = await db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    user_data = serialize_doc(user)
    
    if user["role"] == "pharmacy":
        details = await db.pharmacies.find_one({"user_id": user_id})
        user_data["details"] = serialize_doc(details)
    elif user["role"] == "supplier":
        details = await db.suppliers.find_one({"user_id": user_id})
        user_data["details"] = serialize_doc(details)
    
    # Get documents
    documents = await db.documents.find({"user_id": user_id}).to_list(100)
    user_data["documents"] = serialize_doc(documents)
    
    return user_data

@app.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: str, admin = Depends(require_admin)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    await db.documents.delete_many({"user_id": user_id})

    if user["role"] == "pharmacy":
        await db.pharmacies.delete_one({"user_id": user_id})
    elif user["role"] == "supplier":
        await db.suppliers.delete_one({"user_id": user_id})

    await db.users.delete_one({"_id": ObjectId(user_id)})

    return {"message": "Utilisateur supprimé avec succès"}

@app.put("/api/admin/users/{user_id}/status")
async def update_user_status(user_id: str, data: UpdateUserStatusRequest, admin = Depends(require_admin)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": data.status, "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    details = None
    if user["role"] == "pharmacy":
        details = await db.pharmacies.find_one({"user_id": user_id})
    elif user["role"] == "supplier":
        details = await db.suppliers.find_one({"user_id": user_id})
    entity_name = ""
    if details:
        entity_name = details.get("pharmacy_name") or details.get("company_name") or user.get("full_name", "")

    if data.status == "suspended":
        asyncio.create_task(send_account_suspended_email(
            to_email=user["email"],
            full_name=user.get("full_name", ""),
            entity_name=entity_name,
            role=user["role"]
        ))
    elif data.status == "active":
        asyncio.create_task(send_account_reactivated_email(
            to_email=user["email"],
            full_name=user.get("full_name", ""),
            entity_name=entity_name,
            role=user["role"]
        ))

    return {"message": f"Statut mis à jour: {data.status}"}

@app.get("/api/admin/orders")
async def get_all_orders(admin = Depends(require_admin)):
    orders = await db.orders.find().sort("created_at", -1).to_list(1000)
    
    if not orders:
        return []
    
    # Collect all unique pharmacy and supplier IDs
    pharmacy_ids = set()
    supplier_ids = set()
    for order in orders:
        if order.get("pharmacy_id"):
            pharmacy_ids.add(order["pharmacy_id"])
        if order.get("supplier_id"):
            supplier_ids.add(order["supplier_id"])
    
    # Batch fetch pharmacies and suppliers
    pharmacies = await db.pharmacies.find({
        "$or": [
            {"_id": {"$in": [ObjectId(pid) for pid in pharmacy_ids if ObjectId.is_valid(pid)]}},
            {"user_id": {"$in": list(pharmacy_ids)}}
        ]
    }).to_list(1000) if pharmacy_ids else []
    
    suppliers = await db.suppliers.find({
        "$or": [
            {"_id": {"$in": [ObjectId(sid) for sid in supplier_ids if ObjectId.is_valid(sid)]}},
            {"user_id": {"$in": list(supplier_ids)}}
        ]
    }).to_list(1000) if supplier_ids else []
    
    # Create lookup maps
    pharmacy_map = {}
    for p in pharmacies:
        pharmacy_map[str(p["_id"])] = p
        if p.get("user_id"):
            pharmacy_map[p["user_id"]] = p
    
    supplier_map = {}
    for s in suppliers:
        supplier_map[str(s["_id"])] = s
        if s.get("user_id"):
            supplier_map[s["user_id"]] = s
    
    result = []
    for order in orders:
        order_data = serialize_doc(order)
        order_data["pharmacy"] = serialize_doc(pharmacy_map.get(order.get("pharmacy_id")))
        order_data["supplier"] = serialize_doc(supplier_map.get(order.get("supplier_id")))
        result.append(order_data)
    return result

@app.get("/api/admin/documents")
async def get_all_documents(admin = Depends(require_admin)):
    documents = await db.documents.find().sort("uploaded_at", -1).to_list(1000)
    
    if not documents:
        return []
    
    # Batch fetch all users in one query
    user_ids = list(set(doc.get("user_id") for doc in documents if doc.get("user_id")))
    valid_user_ids = [ObjectId(uid) for uid in user_ids if ObjectId.is_valid(uid)]
    
    users = await db.users.find({"_id": {"$in": valid_user_ids}}, {"password": 0}).to_list(1000) if valid_user_ids else []
    user_map = {str(u["_id"]): u for u in users}
    
    result = []
    for doc in documents:
        doc_data = serialize_doc(doc)
        doc_data["user"] = serialize_doc(user_map.get(doc.get("user_id")))
        result.append(doc_data)
    return result

@app.put("/api/admin/documents/{doc_id}/status")
async def update_document_status(
    doc_id: str,
    doc_status: Literal["approved", "rejected"],
    rejection_reason: Optional[str] = None,
    admin = Depends(require_admin)
):
    doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Document non trouvé")

    updates = {
        "status": doc_status,
        "reviewed_at": datetime.now(timezone.utc),
        "reviewed_by": admin["id"]
    }
    if rejection_reason:
        updates["rejection_reason"] = rejection_reason

    result = await db.documents.update_one({"_id": ObjectId(doc_id)}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Document non trouvé")

    if doc.get("user_id"):
        user = await db.users.find_one({"_id": ObjectId(doc["user_id"])})
        if user:
            asyncio.create_task(send_document_status_email(
                to_email=user["email"],
                full_name=user.get("full_name", ""),
                doc_type=doc.get("doc_type", "Document"),
                doc_status=doc_status,
                rejection_reason=rejection_reason
            ))

    return {"message": f"Document {doc_status}"}

# ==========================================
# DOCUMENT UPLOAD & REVIEW ENDPOINTS
# ==========================================

@app.post("/api/upload/temp-document")
async def upload_temp_document(
    file: UploadFile = File(...),
    doc_type: str = Form(...)
):
    """Upload a document during registration (no auth required)"""
    allowed_extensions = {'.pdf', '.jpg', '.jpeg', '.png', '.webp'}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Format non supporté. Utilisez PDF, JPG ou PNG.")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Le fichier est trop volumineux (max 10 Mo)")
    
    file_id = str(uuid.uuid4())
    safe_name = (file.filename or "document").replace(" ", "_")
    stored_name = f"{file_id}_{safe_name}"
    file_path = os.path.join(UPLOAD_DIR, stored_name)
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    doc = {
        "temp_id": file_id,
        "file_name": file.filename,
        "stored_name": stored_name,
        "doc_type": doc_type,
        "file_size": len(contents),
        "content_type": file.content_type,
        "user_id": None,
        "status": "pending",
        "uploaded_at": datetime.now(timezone.utc)
    }
    result = await db.documents.insert_one(doc)
    
    return {
        "doc_id": str(result.inserted_id),
        "temp_id": file_id,
        "file_name": file.filename,
        "doc_type": doc_type,
        "stored_name": stored_name
    }

@app.get("/api/documents/file/{stored_name}")
async def serve_document_file(stored_name: str):
    """Serve an uploaded document file"""
    file_path = os.path.join(UPLOAD_DIR, stored_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    return FileResponse(file_path)

@app.get("/api/admin/users/{user_id}/documents")
async def get_user_documents(user_id: str, admin = Depends(require_admin)):
    """Get all documents for a specific user"""
    documents = await db.documents.find({"user_id": user_id}).sort("uploaded_at", -1).to_list(100)
    return serialize_doc(documents)

@app.put("/api/admin/users/{user_id}/review")
async def review_user(user_id: str, data: ReviewUserRequest, admin = Depends(require_admin)):
    """Admin reviews a user's registration - approve or reject with reasons"""
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    new_status = "active" if data.decision == "approved" else "rejected"
    
    update_data = {
        "status": new_status,
        "updated_at": datetime.now(timezone.utc),
        "reviewed_at": datetime.now(timezone.utc),
        "reviewed_by": admin["id"]
    }
    
    if data.decision == "rejected":
        update_data["rejection_reason"] = data.rejection_reason or "Documents non conformes"
        update_data["rejected_documents"] = data.rejected_documents or []
    else:
        # Clear any previous rejection data
        update_data["rejection_reason"] = None
        update_data["rejected_documents"] = None
    
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    
    # Update document statuses
    if data.decision == "approved":
        await db.documents.update_many(
            {"user_id": user_id},
            {"$set": {"status": "approved", "reviewed_at": datetime.now(timezone.utc)}}
        )
    elif data.rejected_documents:
        for doc_type in data.rejected_documents:
            await db.documents.update_many(
                {"user_id": user_id, "doc_type": doc_type},
                {"$set": {"status": "rejected", "reviewed_at": datetime.now(timezone.utc)}}
            )
        await db.documents.update_many(
            {"user_id": user_id, "doc_type": {"$nin": data.rejected_documents}},
            {"$set": {"status": "approved", "reviewed_at": datetime.now(timezone.utc)}}
        )
    
    # Get user details for email
    details = None
    if user["role"] == "pharmacy":
        details = await db.pharmacies.find_one({"user_id": user_id})
    elif user["role"] == "supplier":
        details = await db.suppliers.find_one({"user_id": user_id})
    
    entity_name = ""
    if details:
        entity_name = details.get("pharmacy_name") or details.get("company_name") or user.get("full_name", "")
    
    # Send email notification (non-blocking)
    asyncio.create_task(send_review_email(
        to_email=user["email"],
        full_name=user.get("full_name", ""),
        entity_name=entity_name,
        role=user["role"],
        decision=data.decision,
        rejection_reason=data.rejection_reason,
        rejected_documents=data.rejected_documents
    ))
    
    return {"message": f"Utilisateur {'approuvé' if data.decision == 'approved' else 'rejeté'} avec succès"}


class AdminSendEmailRequest(BaseModel):
    to: List[str]
    subject: str
    html: str
    attachments: Optional[List[dict]] = None


@app.post("/api/admin/send-email")
async def admin_send_email(data: AdminSendEmailRequest, admin = Depends(require_admin)):
    """Admin sends a custom email via SMTP relay."""
    from_address = SMTP_FROM
    results = []
    errors = []

    async def _send_one(to_email: str):
        sent, error_detail = await asyncio.to_thread(_smtp_send, to_email, data.subject, data.html, from_address)
        if sent:
            results.append(to_email)
        else:
            errors.append({"email": to_email, "error": error_detail})
            print(f"[admin_send_email FAILED] -> {to_email}: {error_detail}")

    await asyncio.gather(*[_send_one(email) for email in data.to])

    sent_count = len(results)
    failed_count = len(errors)

    try:
        await db.notifications.insert_one({
            "type": "admin_custom_email",
            "subject": data.subject,
            "to_emails": data.to,
            "sent_count": sent_count,
            "failed_count": failed_count,
            "sent_by_admin": str(admin["id"]),
            "created_at": datetime.now(timezone.utc),
        })
    except Exception as db_err:
        print(f"[admin_send_email DB log error]: {db_err}")

    if failed_count > 0 and sent_count == 0:
        first_error = errors[0]["error"] if errors else "Erreur inconnue"
        raise HTTPException(
            status_code=500,
            detail=f"Échec d'envoi: {first_error}"
        )

    return {"message": f"Email envoyé à {sent_count} destinataire(s)", "sent_count": sent_count, "sent_to": sent_count, "errors": errors}


@app.post("/api/admin/change-password")
async def admin_change_password(data: ChangePasswordRequest, admin = Depends(require_admin)):
    user = await db.users.find_one({"_id": ObjectId(admin["id"])})
    if not user or not verify_password(data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")
    await db.users.update_one(
        {"_id": ObjectId(admin["id"])},
        {"$set": {"password": hash_password(data.new_password), "updated_at": datetime.now(timezone.utc)}}
    )
    asyncio.create_task(send_admin_password_changed_email(
        to_email=admin["email"],
        full_name=user.get("full_name", "Administrateur")
    ))
    return {"message": "Mot de passe modifié avec succès"}


@app.post("/api/admin/request-email-change")
async def admin_request_email_change(data: RequestEmailChangeRequest, admin = Depends(require_admin)):
    existing = await db.users.find_one({"email": data.new_email})
    if existing:
        raise HTTPException(status_code=400, detail="Cette adresse email est déjà utilisée")

    code = str(secrets.randbelow(1000000)).zfill(6)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    await db.email_change_tokens.update_one(
        {"admin_id": admin["id"]},
        {"$set": {
            "admin_id": admin["id"],
            "new_email": data.new_email,
            "code": code,
            "expires_at": expires_at,
            "used": False
        }},
        upsert=True
    )

    if RESEND_API_KEY:
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #009689;">Changement d'adresse email</h2>
          <p>Votre code de vérification pour changer l'adresse email du compte administrateur est :</p>
          <div style="background: #f0fdf4; border: 2px solid #009689; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #009689;">{code}</span>
          </div>
          <p style="color: #666;">Ce code expire dans <strong>15 minutes</strong>.</p>
          <p style="color: #666;">Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
        </div>
        """
        payload_bytes = json.dumps({
            "from": "DawaDzLink <orders@dawadzlink.com>",
            "to": [data.new_email],
            "subject": "Code de vérification - Changement d'email DawaDzLink Admin",
            "html": html_body
        }).encode("utf-8")
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=payload_bytes,
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
        )
        try:
            await asyncio.to_thread(lambda: urllib.request.urlopen(req, timeout=30))
        except Exception as e:
            print(f"Email send error: {e}")

    return {"message": f"Un code de vérification a été envoyé à {data.new_email}"}


@app.post("/api/admin/confirm-email-change")
async def admin_confirm_email_change(data: ConfirmEmailChangeRequest, admin = Depends(require_admin)):
    token_doc = await db.email_change_tokens.find_one({"admin_id": admin["id"]})
    if not token_doc:
        raise HTTPException(status_code=400, detail="Aucune demande de changement d'email en cours")

    expires_at = token_doc.get("expires_at")
    if expires_at:
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Code expiré. Veuillez recommencer.")

    if token_doc.get("code") != data.code:
        raise HTTPException(status_code=400, detail="Code incorrect. Vérifiez le code reçu par email.")

    new_email = token_doc["new_email"]
    await db.users.update_one(
        {"_id": ObjectId(admin["id"])},
        {"$set": {"email": new_email, "updated_at": datetime.now(timezone.utc)}}
    )
    await db.email_change_tokens.delete_one({"admin_id": admin["id"]})

    return {"message": "Adresse email modifiée avec succès"}


# ==========================================
# EMAIL NOTIFICATION HELPERS
# ==========================================

EMAIL_HEADER = """
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#009689 0%,#00786F 100%);padding:32px 40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">DawaDzLink</h1>
    <p style="color:#b2ede7;margin:6px 0 0;font-size:13px;letter-spacing:0.3px;">Marketplace pharmaceutique B2B</p>
  </div>
"""

EMAIL_FOOTER = """
  <div style="background:#f8fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">DawaDzLink &mdash; Votre partenaire B2B pharmaceutique en Algérie</p>
    <p style="color:#9ca3af;font-size:12px;margin:0;">
      Pour toute question : <a href="mailto:support@dawadzlink.com" style="color:#009689;text-decoration:none;">support@dawadzlink.com</a>
    </p>
    <p style="color:#d1d5db;font-size:11px;margin:12px 0 0;">&copy; 2026 DawaDzLink. Tous droits réservés.</p>
  </div>
</div>
"""

def email_wrap(icon_html, badge_color, badge_text, body_html):
    return f"""{EMAIL_HEADER}
  <div style="padding:40px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:72px;height:72px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;background:{badge_color}22;border:2px solid {badge_color}33;">{icon_html}</div>
    </div>
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:{badge_color};color:#fff;padding:5px 18px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.3px;">{badge_text}</span>
    </div>
    {body_html}
  </div>
{EMAIL_FOOTER}"""

async def send_review_email(to_email, full_name, entity_name, role, decision, rejection_reason=None, rejected_documents=None):
    """Send email notification when admin reviews a user's registration"""
    role_label = "Pharmacie" if role == "pharmacy" else "Fournisseur"

    if decision == "approved":
        subject = "DawaDzLink - Votre compte a été approuvé ✓"
        body = f"""
        <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Compte Approuvé</h2>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Nous sommes ravis de vous informer que votre compte <strong>{role_label}</strong>
          « <strong style="color:#009689;">{entity_name}</strong> » a été vérifié et <strong style="color:#009689;">approuvé</strong>.
        </p>
        <div style="background:#f0fdf9;border:1px solid #6ee7d9;border-radius:10px;padding:20px;margin:24px 0;">
          <p style="color:#065f46;font-size:14px;margin:0;font-weight:600;">Vous pouvez maintenant :</p>
          <ul style="color:#047857;font-size:14px;margin:8px 0 0;padding-left:20px;line-height:2;">
            <li>Accéder à votre espace professionnel</li>
            <li>{'Parcourir le catalogue et passer des commandes' if role == 'pharmacy' else 'Gérer vos produits et traiter les commandes'}</li>
            <li>Profiter de toutes les fonctionnalités de DawaDzLink</li>
          </ul>
        </div>
        <div style="text-align:center;margin:32px 0;">
          <a href="https://dawadzlink.com" style="background:#009689;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">Se connecter maintenant</a>
        </div>
        <div style="background:#f8fafb;border-radius:8px;padding:14px 16px;margin-top:8px;">
          <p style="color:#6b7280;font-size:13px;margin:0;"><strong>Email :</strong> {to_email}</p>
        </div>"""
        html = email_wrap("&#10003;", "#009689", "Compte Approuvé", body)
    else:
        rejected_docs_html = ""
        if rejected_documents:
            items = "".join(f'<li style="margin:4px 0;color:#b91c1c;">{doc}</li>' for doc in rejected_documents)
            rejected_docs_html = f"""
            <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:16px;margin:16px 0;">
              <p style="color:#991b1b;font-weight:700;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Documents à revoir :</p>
              <ul style="margin:0;padding-left:20px;font-size:14px;">{items}</ul>
            </div>"""

        subject = "DawaDzLink - Votre inscription nécessite des corrections"
        body = f"""
        <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Inscription Non Approuvée</h2>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Nous avons examiné votre demande d'inscription pour le compte <strong>{role_label}</strong>
          « <strong>{entity_name}</strong> ». Nous ne pouvons malheureusement pas approuver votre compte pour le moment.
        </p>
        <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:20px;margin:20px 0;">
          <p style="color:#991b1b;font-weight:700;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Motif du rejet :</p>
          <p style="color:#dc2626;font-size:15px;margin:0;line-height:1.6;">{rejection_reason or 'Documents non conformes'}</p>
        </div>
        {rejected_docs_html}
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:20px 0 8px;">
          Vous pouvez soumettre une nouvelle demande avec des documents conformes. Notre équipe reste à votre disposition pour vous accompagner.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="https://dawadzlink.com" style="background:#009689;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">Soumettre une nouvelle demande</a>
        </div>"""
        html = email_wrap("&#10007;", "#dc2626", "Inscription Rejetée", body)

    await _send_email(to_email, subject, html, f"review_{decision}", {
        "decision": decision,
        "rejection_reason": rejection_reason,
        "rejected_documents": rejected_documents
    })

def _smtp_send(to_email: str, subject: str, html: str, from_address: str) -> tuple[bool, str]:
    """Send email via SMTP (uses Resend SMTP relay on port 465 — bypasses Cloudflare HTTP blocking)."""
    msg = email.mime.multipart.MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_address
    msg["To"] = to_email
    msg.attach(email.mime.text.MIMEText(html, "html", "utf-8"))
    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.sendmail(from_address, [to_email], msg.as_string())
        return True, ""
    except smtplib.SMTPAuthenticationError as e:
        return False, f"SMTP auth failed: {e}"
    except smtplib.SMTPRecipientsRefused as e:
        return False, f"Recipient refused: {e}"
    except Exception as e:
        return False, str(e)


async def _send_email(to_email: str, subject: str, html: str, notification_type: str, extra_data: dict = None, from_address: str = "DawaDzLink <orders@dawadzlink.com>"):
    """Generic email sender via SMTP relay."""
    sent, error_detail = await asyncio.to_thread(_smtp_send, to_email, subject, html, from_address or SMTP_FROM)

    if sent:
        print(f"[Email OK] [{notification_type}] -> {to_email}")
    else:
        print(f"[Email FAILED] [{notification_type}] -> {to_email}. Error: {error_detail}")

    try:
        await db.notifications.insert_one({
            "to_email": to_email,
            "type": notification_type,
            "subject": subject,
            "sent_via_email": sent,
            "error": error_detail if not sent else None,
            "created_at": datetime.now(timezone.utc),
            **(extra_data or {})
        })
    except Exception as db_err:
        print(f"[Email DB log error]: {db_err}")


def _order_items_table(items: list) -> str:
    if not items:
        return ""
    rows = "".join(
        f"<tr><td style='padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;'>{item.get('product_name','')}</td>"
        f"<td style='padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:center;'>{item.get('quantity','')}</td>"
        f"<td style='padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:right;'>{item.get('unit_price',0):,.2f} DA</td></tr>"
        for item in items[:8]
    )
    return f"""<table style="width:100%;border-collapse:collapse;margin-top:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <thead><tr style="background:#f9fafb;">
        <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Produit</th>
        <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Qté</th>
        <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Prix unit.</th>
      </tr></thead>
      <tbody>{rows}</tbody>
    </table>"""


def _order_summary_box(rows_html: str) -> str:
    return f"""<div style="background:#f8fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">{rows_html}</table>
    </div>"""


def _summary_row(label: str, value: str, bold_value: bool = False, color: str = "#111827") -> str:
    val_style = f"color:{color};font-size:14px;font-weight:{'700' if bold_value else '500'};text-align:right;padding:5px 0;"
    return f"<tr><td style='color:#6b7280;font-size:14px;padding:5px 0;'>{label}</td><td style='{val_style}'>{value}</td></tr>"


async def send_admin_password_changed_email(to_email: str, full_name: str):
    subject = "DawaDzLink - Votre mot de passe administrateur a été modifié"
    now_str = datetime.now(timezone.utc).strftime("%d/%m/%Y à %H:%M UTC")
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Mot de passe modifié</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre mot de passe administrateur a été modifié avec succès le <strong>{now_str}</strong>.
    </p>
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:20px;margin:20px 0;">
      <p style="color:#92400e;font-size:14px;margin:0;line-height:1.6;">
        Si vous n'avez pas effectué cette modification, veuillez contacter immédiatement l'équipe technique et changer votre mot de passe.
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="mailto:support@dawadzlink.com" style="background:#374151;color:#fff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Contacter le support</a>
    </div>"""
    html = email_wrap("&#128274;", "#009689", "Sécurité du compte", body)
    await _send_email(to_email, subject, html, "admin_password_changed", {"full_name": full_name})


async def send_admin_new_signup_notification_email(entity_name: str, full_name: str, email: str, role: str):
    role_label = "Pharmacie" if role == "pharmacy" else "Fournisseur"
    admin_url = "https://dawadzlink.com"
    subject = f"DawaDzLink - Nouvelle inscription {role_label} : {entity_name}"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Nouvelle Inscription</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Un nouveau compte <strong>{role_label}</strong> vient d'être soumis et attend votre vérification.
    </p>
    <div style="background:#f8fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#6b7280;font-size:14px;padding:6px 0;width:40%;">Entité</td><td style="color:#111827;font-size:14px;font-weight:600;padding:6px 0;">{entity_name}</td></tr>
        <tr><td style="color:#6b7280;font-size:14px;padding:6px 0;">Responsable</td><td style="color:#111827;font-size:14px;padding:6px 0;">{full_name}</td></tr>
        <tr><td style="color:#6b7280;font-size:14px;padding:6px 0;">Email</td><td style="color:#111827;font-size:14px;padding:6px 0;">{email}</td></tr>
        <tr><td style="color:#6b7280;font-size:14px;padding:6px 0;">Type</td><td style="color:#111827;font-size:14px;padding:6px 0;">{role_label}</td></tr>
      </table>
    </div>
    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Connectez-vous au panneau d'administration pour examiner les documents soumis et approuver ou rejeter cette demande.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="{admin_url}" style="background:#009689;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">Examiner la demande</a>
    </div>"""
    html = email_wrap("&#128196;", "#2563EB", "Nouvelle inscription en attente", body)

    # Fetch all active admin emails from MongoDB and notify each one
    admin_cursor = db.users.find({"role": "admin", "status": "active"}, {"email": 1})
    admin_emails = [u["email"] async for u in admin_cursor]

    extra = {"entity_name": entity_name, "full_name": full_name, "registrant_email": email, "role": role}
    await asyncio.gather(*[
        _send_email(admin_email, subject, html, "admin_new_signup_notification", extra)
        for admin_email in admin_emails
    ])


async def send_registration_pending_email(to_email: str, full_name: str, entity_name: str, role: str):
    role_label = "Pharmacie" if role == "pharmacy" else "Fournisseur"
    docs_list = "<li>Agrément de pharmacie</li><li>Registre de Commerce</li><li>Inscription à l'ordre des pharmaciens</li>" if role == "pharmacy" else "<li>Registre de commerce</li><li>Autorisation d'exploitation</li><li>Certificat fiscal</li>"
    subject = "DawaDzLink - Demande d'inscription reçue"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Demande Reçue</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Nous avons bien reçu votre demande d'inscription pour le compte <strong>{role_label}</strong>
      « <strong style="color:#009689;">{entity_name}</strong> » sur DawaDzLink.
    </p>
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:20px;margin:20px 0;">
      <p style="color:#92400e;font-weight:700;font-size:14px;margin:0 0 8px;">Délai de traitement : 24 à 48 heures</p>
      <p style="color:#78350f;font-size:14px;margin:0;line-height:1.6;">
        Notre équipe va examiner vos documents et vous notifier par email dès que votre compte sera traité.
      </p>
    </div>
    <div style="background:#f8fafb;border-radius:10px;padding:16px 20px;margin:16px 0;">
      <p style="color:#374151;font-size:14px;font-weight:600;margin:0 0 8px;">Documents soumis pour vérification :</p>
      <ul style="color:#6b7280;font-size:14px;margin:0;padding-left:20px;line-height:2;">{docs_list}</ul>
    </div>"""
    html = email_wrap("&#9203;", "#D97706", "En attente de vérification", body)
    await _send_email(to_email, subject, html, "registration_pending", {"full_name": full_name, "entity_name": entity_name, "role": role})


async def send_account_suspended_email(to_email: str, full_name: str, entity_name: str, role: str):
    role_label = "Pharmacie" if role == "pharmacy" else "Fournisseur"
    subject = "DawaDzLink - Votre compte a été suspendu"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Compte Suspendu</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Nous vous informons que votre compte <strong>{role_label}</strong>
      « <strong>{entity_name}</strong> » a été <strong style="color:#dc2626;">suspendu</strong> par notre équipe d'administration.
    </p>
    <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:20px;margin:20px 0;">
      <p style="color:#991b1b;font-size:14px;margin:0;line-height:1.6;">
        Votre accès à la plateforme est temporairement désactivé. Si vous pensez que cette décision est une erreur ou pour obtenir des informations supplémentaires, veuillez contacter notre support.
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="mailto:support@dawadzlink.com" style="background:#374151;color:#fff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Contacter le support</a>
    </div>"""
    html = email_wrap("&#9888;", "#dc2626", "Compte Suspendu", body)
    await _send_email(to_email, subject, html, "account_suspended", {"entity_name": entity_name, "role": role})


async def send_account_reactivated_email(to_email: str, full_name: str, entity_name: str, role: str):
    role_label = "Pharmacie" if role == "pharmacy" else "Fournisseur"
    subject = "DawaDzLink - Votre compte a été réactivé"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Compte Réactivé</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Nous avons le plaisir de vous informer que votre compte <strong>{role_label}</strong>
      « <strong style="color:#009689;">{entity_name}</strong> » a été <strong style="color:#009689;">réactivé</strong>.
    </p>
    <div style="background:#f0fdf9;border:1px solid #6ee7d9;border-radius:10px;padding:20px;margin:20px 0;">
      <p style="color:#065f46;font-size:14px;margin:0;line-height:1.6;">
        Vous pouvez dès maintenant vous reconnecter et accéder à toutes les fonctionnalités de la plateforme.
      </p>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://dawadzlink.com" style="background:#009689;color:#fff;padding:14px 36px;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;display:inline-block;">Se connecter</a>
    </div>"""
    html = email_wrap("&#10003;", "#009689", "Compte Réactivé", body)
    await _send_email(to_email, subject, html, "account_reactivated", {"entity_name": entity_name, "role": role})


async def send_document_status_email(to_email: str, full_name: str, doc_type: str, doc_status: str, rejection_reason: str = None):
    if doc_status == "approved":
        subject = f"DawaDzLink - Document approuvé : {doc_type}"
        body = f"""
        <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Document Approuvé</h2>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Votre document <strong style="color:#009689;">« {doc_type} »</strong> a été examiné et <strong style="color:#009689;">approuvé</strong> par notre équipe.
        </p>
        <div style="background:#f0fdf9;border:1px solid #6ee7d9;border-radius:10px;padding:16px 20px;margin:20px 0;">
          <p style="color:#065f46;font-size:14px;margin:0;">Ce document est désormais validé dans votre dossier DawaDzLink.</p>
        </div>"""
        html = email_wrap("&#10003;", "#009689", "Document Approuvé", body)
    else:
        subject = f"DawaDzLink - Document à corriger : {doc_type}"
        reason_block = ""
        if rejection_reason:
            reason_block = f"""<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:16px 20px;margin:16px 0;">
              <p style="color:#991b1b;font-weight:700;font-size:13px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">Motif :</p>
              <p style="color:#dc2626;font-size:14px;margin:0;line-height:1.6;">{rejection_reason}</p>
            </div>"""
        body = f"""
        <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Document à Corriger</h2>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
        <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
          Votre document <strong>« {doc_type} »</strong> n'a pas pu être accepté et nécessite une correction.
        </p>
        {reason_block}
        <p style="color:#374151;font-size:14px;line-height:1.7;margin:16px 0 0;">
          Veuillez soumettre une version corrigée de ce document depuis votre espace DawaDzLink.
        </p>
        <div style="text-align:center;margin:28px 0;">
          <a href="https://dawadzlink.com" style="background:#009689;color:#fff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Mettre à jour mes documents</a>
        </div>"""
        html = email_wrap("&#10007;", "#dc2626", "Document Rejeté", body)
    await _send_email(to_email, subject, html, f"document_{doc_status}", {"doc_type": doc_type, "rejection_reason": rejection_reason})


async def send_password_reset_email(to_email: str, full_name: str, code: str):
    subject = "DawaDzLink - Code de réinitialisation de mot de passe"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Réinitialisation du mot de passe</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte DawaDzLink.
    </p>
    <div style="background:#f0fdf9;border:2px solid #009689;border-radius:12px;padding:32px;margin:24px 0;text-align:center;">
      <p style="color:#065f46;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Votre code de vérification</p>
      <div style="background:#ffffff;border:2px solid #00BBA7;border-radius:10px;padding:18px 40px;display:inline-block;box-shadow:0 4px 12px rgba(0,150,137,0.15);">
        <span style="font-size:42px;font-weight:800;color:#009689;letter-spacing:12px;font-family:'Courier New',monospace;">{code}</span>
      </div>
      <p style="color:#6b7280;font-size:13px;margin:20px 0 0;">Ce code expire dans <strong style="color:#009689;">10 minutes</strong></p>
    </div>
    <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px 20px;margin:16px 0;">
      <p style="color:#92400e;font-size:13px;margin:0;line-height:1.6;">
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
      </p>
    </div>"""
    html = email_wrap("&#128274;", "#009689", "Réinitialisation Mot de Passe", body)
    await _send_email(to_email, subject, html, "password_reset", {"full_name": full_name})


ORDER_STATUS_LABELS = {
    "pending": "En attente",
    "confirmed": "Confirmée",
    "processing": "En préparation",
    "shipped": "Expédiée",
    "delivered": "Livrée",
    "cancelled": "Annulée"
}

ORDER_STATUS_COLORS = {
    "confirmed": "#009689",
    "processing": "#2563EB",
    "shipped": "#0891b2",
    "delivered": "#16A34A",
    "cancelled": "#DC2626"
}

ORDER_STATUS_ICONS = {
    "confirmed": "&#10003;",
    "processing": "&#9881;",
    "shipped": "&#128666;",
    "delivered": "&#127873;",
    "cancelled": "&#10007;"
}

ORDER_STATUS_MESSAGES = {
    "confirmed": "Votre commande a été confirmée par le fournisseur et sera préparée prochainement.",
    "processing": "Votre commande est actuellement en cours de préparation par le fournisseur.",
    "shipped": "Votre commande a été expédiée et est en route vers votre pharmacie.",
    "delivered": "Votre commande a été livrée avec succès. Merci pour votre confiance !",
    "cancelled": "Votre commande a été annulée."
}


async def send_order_status_email_to_pharmacy(to_email: str, full_name: str, pharmacy_name: str,
                                               order_number: str, order_id: str, new_status: str,
                                               supplier_name: str, total: float, items: list,
                                               cancellation_reason: str = None):
    status_label = ORDER_STATUS_LABELS.get(new_status, new_status)
    color = ORDER_STATUS_COLORS.get(new_status, "#009689")
    icon = ORDER_STATUS_ICONS.get(new_status, "&#8226;")
    message = ORDER_STATUS_MESSAGES.get(new_status, "")
    if new_status == "cancelled" and cancellation_reason:
        message += f" Motif : {cancellation_reason}"

    summary_rows = (
        _summary_row("Numéro de commande", order_number, bold_value=True) +
        _summary_row("Fournisseur", supplier_name) +
        _summary_row("Total", f"{total:,.2f} DA", bold_value=True, color=color)
    )

    subject = f"DawaDzLink - Commande {order_number} : {status_label}"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 8px;text-align:center;">Mise à jour de commande</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">{message}</p>
    {_order_summary_box(summary_rows)}
    {_order_items_table(items)}
    <div style="text-align:center;margin:28px 0;">
      <a href="https://dawadzlink.com" style="background:#009689;color:#fff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Voir ma commande</a>
    </div>"""
    html = email_wrap(icon, color, status_label, body)
    await _send_email(to_email, subject, html, f"order_{new_status}",
                      {"order_number": order_number, "order_id": order_id, "new_status": new_status},
                      from_address="DawaDzLink Commandes <orders@dawadzlink.com>")


async def send_pharmacy_order_confirmation_email(to_email: str, full_name: str, pharmacy_name: str,
                                                  order_number: str, order_id: str, supplier_name: str,
                                                  total: float, items: list, payment_method: str):
    payment_labels = {
        "payment_on_delivery": "Paiement à la livraison",
        "baridimob": "BaridiMob",
        "ccp": "CCP"
    }
    payment_label = payment_labels.get(payment_method, payment_method)

    summary_rows = (
        _summary_row("Numéro de commande", order_number, bold_value=True) +
        _summary_row("Fournisseur", supplier_name) +
        _summary_row("Mode de paiement", payment_label) +
        _summary_row("Total", f"{total:,.2f} DA", bold_value=True, color="#009689")
    )

    subject = f"DawaDzLink - Confirmation de commande {order_number}"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 8px;text-align:center;">Commande Confirmée</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre commande a bien été transmise au fournisseur <strong style="color:#009689;">{supplier_name}</strong>. Vous recevrez une notification dès qu'elle sera confirmée.
    </p>
    {_order_summary_box(summary_rows)}
    {_order_items_table(items)}
    <div style="text-align:center;margin:28px 0;">
      <a href="https://dawadzlink.com" style="background:#009689;color:#fff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Suivre ma commande</a>
    </div>"""
    html = email_wrap("&#10003;", "#009689", "Commande Envoyée", body)
    await _send_email(to_email, subject, html, "order_created_pharmacy",
                      {"order_number": order_number, "order_id": order_id},
                      from_address="DawaDzLink Commandes <orders@dawadzlink.com>")


async def send_new_order_email_to_supplier(to_email: str, supplier_contact_name: str, supplier_name: str,
                                            order_number: str, order_id: str, pharmacy_name: str,
                                            total: float, items: list, payment_method: str):
    payment_labels = {
        "payment_on_delivery": "Paiement a la livraison",
        "baridimob": "BaridiMob",
        "ccp": "CCP"
    }
    payment_label = payment_labels.get(payment_method, payment_method)

    summary_rows = (
        _summary_row("Numéro de commande", order_number, bold_value=True) +
        _summary_row("Pharmacie", pharmacy_name) +
        _summary_row("Mode de paiement", payment_label) +
        _summary_row("Total", f"{total:,.2f} DA", bold_value=True, color="#009689")
    )

    subject = f"DawaDzLink - Nouvelle commande {order_number} de {pharmacy_name}"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 8px;text-align:center;">Nouvelle Commande</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{supplier_contact_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      La pharmacie <strong style="color:#009689;">{pharmacy_name}</strong> vient de passer une commande sur DawaDzLink. Veuillez la traiter dans les meilleurs délais.
    </p>
    {_order_summary_box(summary_rows)}
    {_order_items_table(items)}
    <div style="text-align:center;margin:28px 0;">
      <a href="https://dawadzlink.com" style="background:#009689;color:#fff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Gérer cette commande</a>
    </div>"""
    html = email_wrap("&#128230;", "#009689", "Nouvelle Commande", body)
    await _send_email(to_email, subject, html, "new_order_supplier",
                      {"order_number": order_number, "order_id": order_id, "pharmacy_name": pharmacy_name},
                      from_address="DawaDzLink Commandes <orders@dawadzlink.com>")


# ==========================================
# SUPER ADMIN - ADMIN MANAGEMENT ENDPOINTS
# ==========================================

SUPER_ADMIN_EMAIL = "zakaryaoukil2003@gmail.com"
SUPER_ADMIN_PASSWORD = "oukil2003"  # Only for reference, do not use in code except for credential checks if needed

class CreateAdminRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    phone: Optional[str] = ""

class UpdateAdminRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

async def require_super_admin(user = Depends(require_admin)):
    if user.get("email") != SUPER_ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Accès réservé au Super Administrateur uniquement")
    return user

@app.get("/api/admin/admins")
async def list_admins(user = Depends(require_admin)):
    admins = await db.users.find({"role": "admin"}).sort("created_at", 1).to_list(100)
    result = []
    for a in admins:
        doc = serialize_doc(a)
        doc.pop("password", None)
        doc["is_super"] = doc.get("email") == SUPER_ADMIN_EMAIL
        result.append(doc)
    return result

@app.post("/api/admin/admins")
async def create_admin(data: CreateAdminRequest, user = Depends(require_super_admin)):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    admin_doc = {
        "email": data.email,
        "password": hash_password(data.password),
        "full_name": data.full_name,
        "phone": data.phone or "",
        "role": "admin",
        "status": "active",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(admin_doc)
    admin_id = str(result.inserted_id)

    asyncio.create_task(send_admin_invite_email(
        to_email=data.email,
        full_name=data.full_name,
        password=data.password
    ))

    return {"message": "Administrateur créé avec succès", "admin_id": admin_id}

@app.put("/api/admin/admins/{admin_id}")
async def update_admin(admin_id: str, data: UpdateAdminRequest, user = Depends(require_super_admin)):
    if not ObjectId.is_valid(admin_id):
        raise HTTPException(status_code=400, detail="ID invalide")

    target = await db.users.find_one({"_id": ObjectId(admin_id), "role": "admin"})
    if not target:
        raise HTTPException(status_code=404, detail="Administrateur non trouvé")

    if target.get("email") == SUPER_ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Impossible de modifier le Super Administrateur via cette API")

    update = {"updated_at": datetime.now(timezone.utc)}
    if data.full_name is not None:
        update["full_name"] = data.full_name
    if data.phone is not None:
        update["phone"] = data.phone
    if data.password is not None and len(data.password) >= 6:
        update["password"] = hash_password(data.password)

    await db.users.update_one({"_id": ObjectId(admin_id)}, {"$set": update})
    return {"message": "Administrateur mis à jour"}

@app.delete("/api/admin/admins/{admin_id}")
async def delete_admin(admin_id: str, user = Depends(require_super_admin)):
    if not ObjectId.is_valid(admin_id):
        raise HTTPException(status_code=400, detail="ID invalide")

    target = await db.users.find_one({"_id": ObjectId(admin_id), "role": "admin"})
    if not target:
        raise HTTPException(status_code=404, detail="Administrateur non trouvé")

    if target.get("email") == SUPER_ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Impossible de supprimer le Super Administrateur")

    await db.users.delete_one({"_id": ObjectId(admin_id)})
    return {"message": "Administrateur supprimé"}


async def send_admin_invite_email(to_email: str, full_name: str, password: str):
    subject = "DawaDzLink - Vos identifiants administrateur"
    body = f"""
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 16px;text-align:center;">Accès Administrateur</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 12px;">Bonjour <strong>{full_name}</strong>,</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Un accès administrateur à la plateforme <strong style="color:#009689;">DawaDzLink</strong> vous a été accordé.
      Voici vos identifiants de connexion :
    </p>
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:20px;margin:20px 0;">
      <p style="color:#166534;font-size:14px;margin:0 0 8px;"><strong>Email :</strong> {to_email}</p>
      <p style="color:#166534;font-size:14px;margin:0;"><strong>Mot de passe :</strong> {password}</p>
    </div>
    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:16px 20px;margin:16px 0;">
      <p style="color:#92400e;font-size:13px;margin:0;line-height:1.6;">
        <strong>Important :</strong> Veuillez changer votre mot de passe dès votre première connexion via les Paramètres du compte.
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="https://admin.dawadzlink.com" style="background:#009689;color:#fff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">Accéder au panneau admin</a>
    </div>"""
    html = email_wrap("&#128737;", "#009689", "Nouvel Accès Admin", body)
    await _send_email(to_email, subject, html, "admin_invite", {"full_name": full_name})


# ==========================================
# PRODUCTS ENDPOINTS
# ==========================================

@app.get("/api/products")
async def get_products(
    search: Optional[str] = None,
    supplier_id: Optional[str] = None,
    available: Optional[bool] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    user = Depends(get_current_user)
):
    query = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"reference": {"$regex": search, "$options": "i"}},
            {"dci": {"$regex": search, "$options": "i"}}
        ]
    
    if supplier_id:
        query["supplier_id"] = supplier_id
    
    if available is not None:
        query["available"] = available
    
    if category:
        query["category"] = category
    
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    
    if max_price is not None:
        if "price" in query:
            query["price"]["$lte"] = max_price
        else:
            query["price"] = {"$lte": max_price}
    
    products = await db.products.find(query).sort("created_at", -1).to_list(1000)
    
    if not products:
        return []
    
    # Batch fetch all suppliers in one query
    supplier_ids = list(set(p.get("supplier_id") for p in products if p.get("supplier_id")))
    valid_supplier_ids = [ObjectId(sid) for sid in supplier_ids if ObjectId.is_valid(sid)]
    
    suppliers = await db.suppliers.find({"_id": {"$in": valid_supplier_ids}}).to_list(1000) if valid_supplier_ids else []
    supplier_map = {str(s["_id"]): s for s in suppliers}
    
    # Batch fetch all ratings with aggregation
    rating_pipeline = [
        {"$match": {"supplier_id": {"$in": [str(sid) for sid in valid_supplier_ids]}}},
        {"$group": {"_id": "$supplier_id", "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]
    ratings = await db.reviews.aggregate(rating_pipeline).to_list(1000)
    rating_map = {r["_id"]: {"avg": r["avg"], "count": r["count"]} for r in ratings}
    
    # Enrich products with supplier info
    result = []
    for product in products:
        product_data = serialize_doc(product)
        supplier = supplier_map.get(product.get("supplier_id"))
        if supplier:
            supplier_id_str = str(supplier["_id"])
            rating_data = rating_map.get(supplier_id_str, {"avg": 0, "count": 0})
            product_data["supplier"] = {
                "id": supplier_id_str,
                "company_name": supplier.get("company_name", ""),
                "wilaya": supplier.get("wilaya", ""),
                "rating": round(rating_data["avg"], 1) if rating_data["avg"] else 0,
                "review_count": rating_data["count"]
            }
        result.append(product_data)
    
    return result

@app.get("/api/products/{product_id}")
async def get_product(product_id: str, user = Depends(get_current_user)):
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    product_data = serialize_doc(product)
    
    # Get supplier info
    supplier = await db.suppliers.find_one({"_id": ObjectId(product["supplier_id"])})
    if supplier:
        product_data["supplier"] = serialize_doc(supplier)
        
        # Get agents for this supplier
        agents = await db.agents.find({"supplier_id": str(supplier["_id"]), "is_active": True}).to_list(100)
        product_data["agents"] = serialize_doc(agents)
    
    return product_data

@app.post("/api/products")
async def create_product(data: ProductCreate, user = Depends(require_active)):
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Seuls les fournisseurs peuvent créer des produits")
    
    # Get supplier ID
    supplier = await db.suppliers.find_one({"user_id": user["id"]})
    if not supplier:
        raise HTTPException(status_code=404, detail="Profil fournisseur non trouvé")
    
    product_doc = {
        **data.dict(),
        "supplier_id": str(supplier["_id"]),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    result = await db.products.insert_one(product_doc)
    product_doc["_id"] = result.inserted_id
    
    return serialize_doc(product_doc)

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, user = Depends(require_active)):
    if user["role"] not in ["supplier", "admin"]:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    # Verify ownership if supplier
    if user["role"] == "supplier":
        supplier = await db.suppliers.find_one({"user_id": user["id"]})
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        if not product or product["supplier_id"] != str(supplier["_id"]):
            raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que vos propres produits")
    
    updates = {k: v for k, v in data.dict().items() if v is not None}
    if updates:
        updates["updated_at"] = datetime.now(timezone.utc)
        await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": updates})
    
    product = await db.products.find_one({"_id": ObjectId(product_id)})
    return serialize_doc(product)

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, user = Depends(require_active)):
    if user["role"] not in ["supplier", "admin"]:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    # Verify ownership if supplier
    if user["role"] == "supplier":
        supplier = await db.suppliers.find_one({"user_id": user["id"]})
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        if not product or product["supplier_id"] != str(supplier["_id"]):
            raise HTTPException(status_code=403, detail="Vous ne pouvez supprimer que vos propres produits")
    
    await db.products.delete_one({"_id": ObjectId(product_id)})
    return {"message": "Produit supprimé"}

# ==========================================
# AGENTS ENDPOINTS
# ==========================================

@app.get("/api/agents")
async def get_agents(supplier_id: Optional[str] = None, user = Depends(get_current_user)):
    query = {}
    if supplier_id:
        query["supplier_id"] = supplier_id
    
    agents = await db.agents.find(query).sort("created_at", -1).to_list(1000)
    
    # Enrich with supplier info
    result = []
    for agent in agents:
        agent_data = serialize_doc(agent)
        supplier = await db.suppliers.find_one({"_id": ObjectId(agent["supplier_id"])})
        if supplier:
            agent_data["supplier"] = {"id": str(supplier["_id"]), "company_name": supplier.get("company_name", "")}
        result.append(agent_data)
    
    return result

@app.get("/api/agents/my")
async def get_my_agents(user = Depends(require_active)):
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    supplier = await db.suppliers.find_one({"user_id": user["id"]})
    if not supplier:
        raise HTTPException(status_code=404, detail="Profil fournisseur non trouvé")
    
    agents = await db.agents.find({"supplier_id": str(supplier["_id"])}).sort("created_at", -1).to_list(100)
    return serialize_doc(agents)

@app.post("/api/agents")
async def create_agent(data: AgentCreate, user = Depends(require_active)):
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Seuls les fournisseurs peuvent créer des agents")
    
    supplier = await db.suppliers.find_one({"user_id": user["id"]})
    if not supplier:
        raise HTTPException(status_code=404, detail="Profil fournisseur non trouvé")
    
    agent_doc = {
        **data.dict(),
        "supplier_id": str(supplier["_id"]),
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    result = await db.agents.insert_one(agent_doc)
    agent_doc["_id"] = result.inserted_id
    
    return serialize_doc(agent_doc)

@app.put("/api/agents/{agent_id}")
async def update_agent(agent_id: str, data: AgentUpdate, user = Depends(require_active)):
    if user["role"] not in ["supplier", "admin"]:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    # Verify ownership if supplier
    if user["role"] == "supplier":
        supplier = await db.suppliers.find_one({"user_id": user["id"]})
        agent = await db.agents.find_one({"_id": ObjectId(agent_id)})
        if not agent or agent["supplier_id"] != str(supplier["_id"]):
            raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que vos propres agents")
    
    updates = {k: v for k, v in data.dict().items() if v is not None}
    if updates:
        updates["updated_at"] = datetime.now(timezone.utc)
        await db.agents.update_one({"_id": ObjectId(agent_id)}, {"$set": updates})
    
    agent = await db.agents.find_one({"_id": ObjectId(agent_id)})
    return serialize_doc(agent)

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str, user = Depends(require_active)):
    if user["role"] not in ["supplier", "admin"]:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    # Verify ownership if supplier
    if user["role"] == "supplier":
        supplier = await db.suppliers.find_one({"user_id": user["id"]})
        agent = await db.agents.find_one({"_id": ObjectId(agent_id)})
        if not agent or agent["supplier_id"] != str(supplier["_id"]):
            raise HTTPException(status_code=403, detail="Vous ne pouvez supprimer que vos propres agents")
    
    await db.agents.delete_one({"_id": ObjectId(agent_id)})
    return {"message": "Agent supprimé"}

# ==========================================
# ORDERS ENDPOINTS
# ==========================================

@app.get("/api/orders")
async def get_orders(user = Depends(require_active)):
    if user["role"] == "pharmacy":
        pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
        if not pharmacy:
            return []
        query = {"pharmacy_id": str(pharmacy["_id"])}
    elif user["role"] == "supplier":
        supplier = await db.suppliers.find_one({"user_id": user["id"]})
        if not supplier:
            return []
        query = {"supplier_id": str(supplier["_id"])}
    else:
        query = {}
    
    orders = await db.orders.find(query).sort("created_at", -1).to_list(1000)
    
    result = []
    for order in orders:
        order_data = serialize_doc(order)
        
        # Get pharmacy info
        if order.get("pharmacy_id"):
            pharmacy = await db.pharmacies.find_one({"_id": ObjectId(order["pharmacy_id"])})
            order_data["pharmacy"] = serialize_doc(pharmacy) if pharmacy else None
        
        # Get supplier info
        if order.get("supplier_id"):
            supplier = await db.suppliers.find_one({"_id": ObjectId(order["supplier_id"])})
            order_data["supplier"] = serialize_doc(supplier) if supplier else None
        
        result.append(order_data)
    
    return result

@app.get("/api/orders/{order_id}")
async def get_order(order_id: str, user = Depends(require_active)):
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    
    # Verify access
    if user["role"] == "pharmacy":
        pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
        if not pharmacy or order["pharmacy_id"] != str(pharmacy["_id"]):
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    elif user["role"] == "supplier":
        supplier = await db.suppliers.find_one({"user_id": user["id"]})
        if not supplier or order["supplier_id"] != str(supplier["_id"]):
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    order_data = serialize_doc(order)
    
    # Get pharmacy info
    pharmacy = await db.pharmacies.find_one({"_id": ObjectId(order["pharmacy_id"])})
    order_data["pharmacy"] = serialize_doc(pharmacy) if pharmacy else None
    
    # Get supplier info
    supplier = await db.suppliers.find_one({"_id": ObjectId(order["supplier_id"])})
    order_data["supplier"] = serialize_doc(supplier) if supplier else None
    
    return order_data

@app.post("/api/orders")
async def create_order(data: OrderCreate, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Seules les pharmacies peuvent passer des commandes")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    # Calculate totals
    items_with_details = []
    subtotal = 0
    
    for item in data.items:
        product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
        if not product:
            raise HTTPException(status_code=404, detail=f"Produit {item['product_id']} non trouvé")
        
        item_total = product["price"] * item["quantity"]
        items_with_details.append({
            "product_id": item["product_id"],
            "product_name": product["name"],
            "product_reference": product["reference"],
            "quantity": item["quantity"],
            "unit_price": product["price"],
            "total": item_total
        })
        subtotal += item_total
    
    # Generate order number
    order_count = await db.orders.count_documents({})
    order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(order_count + 1).zfill(4)}"
    
    order_doc = {
        "order_number": order_number,
        "pharmacy_id": str(pharmacy["_id"]),
        "supplier_id": data.supplier_id,
        "items": items_with_details,
        "subtotal": subtotal,
        "discount_amount": 0,
        "total": subtotal,
        "status": "pending",
        "payment_method": data.payment_method,
        "payment_status": "pending",
        "delivery_address": data.delivery_address,
        "notes": data.notes,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    result = await db.orders.insert_one(order_doc)
    order_doc["_id"] = result.inserted_id
    
    # Clear cart for this supplier
    await db.cart_items.delete_many({
        "pharmacy_id": str(pharmacy["_id"]),
        "supplier_id": data.supplier_id
    })

    # Load supplier doc for email notifications
    _supplier_doc = None
    if ObjectId.is_valid(data.supplier_id):
        _supplier_doc = await db.suppliers.find_one({"_id": ObjectId(data.supplier_id)})

    # Notify supplier about new order
    if _supplier_doc:
        supplier_user = await db.users.find_one({"_id": ObjectId(_supplier_doc["user_id"])})
        if supplier_user:
            asyncio.create_task(send_new_order_email_to_supplier(
                to_email=supplier_user["email"],
                supplier_contact_name=supplier_user.get("full_name", ""),
                supplier_name=_supplier_doc.get("company_name", ""),
                order_number=order_number,
                order_id=str(result.inserted_id),
                pharmacy_name=pharmacy.get("pharmacy_name", ""),
                total=subtotal,
                items=items_with_details,
                payment_method=data.payment_method
            ))

    # Send order confirmation email to pharmacy
    pharmacy_user_doc = await db.users.find_one({"_id": ObjectId(pharmacy["user_id"])})
    if pharmacy_user_doc:
        asyncio.create_task(send_pharmacy_order_confirmation_email(
            to_email=pharmacy_user_doc["email"],
            full_name=pharmacy_user_doc.get("full_name", ""),
            pharmacy_name=pharmacy.get("pharmacy_name", ""),
            order_number=order_number,
            order_id=str(result.inserted_id),
            supplier_name=_supplier_doc.get("company_name", "") if _supplier_doc else "",
            total=subtotal,
            items=items_with_details,
            payment_method=data.payment_method
        ))

    return serialize_doc(order_doc)

@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, data: OrderStatusUpdate, user = Depends(require_active)):
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Commande non trouvée")
    
    # Verify access
    if user["role"] == "supplier":
        supplier = await db.suppliers.find_one({"user_id": user["id"]})
        if not supplier or order["supplier_id"] != str(supplier["_id"]):
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    elif user["role"] == "pharmacy":
        pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
        if not pharmacy or order["pharmacy_id"] != str(pharmacy["_id"]):
            raise HTTPException(status_code=403, detail="Accès non autorisé")
        # Pharmacies can only cancel pending orders
        if data.status != "cancelled" or order["status"] != "pending":
            raise HTTPException(status_code=403, detail="Vous ne pouvez annuler que les commandes en attente")
    elif user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    updates = {
        "status": data.status,
        "updated_at": datetime.now(timezone.utc)
    }
    
    # Set timestamps based on status
    if data.status == "confirmed":
        updates["confirmed_at"] = datetime.now(timezone.utc)
    elif data.status == "shipped":
        updates["shipped_at"] = datetime.now(timezone.utc)
    elif data.status == "delivered":
        updates["delivered_at"] = datetime.now(timezone.utc)
        updates["payment_status"] = "paid"  # Mark as paid when delivered (for payment on delivery)
    elif data.status == "cancelled":
        updates["cancelled_at"] = datetime.now(timezone.utc)
        if data.cancellation_reason:
            updates["cancellation_reason"] = data.cancellation_reason
    
    await db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": updates})

    # Send email notification to pharmacy about status change
    if data.status in ("confirmed", "processing", "shipped", "delivered", "cancelled"):
        pharmacy_doc = await db.pharmacies.find_one({"_id": ObjectId(order["pharmacy_id"])})
        supplier_doc = await db.suppliers.find_one({"_id": ObjectId(order["supplier_id"])})
        if pharmacy_doc:
            pharmacy_user = await db.users.find_one({"_id": ObjectId(pharmacy_doc["user_id"])})
            if pharmacy_user:
                asyncio.create_task(send_order_status_email_to_pharmacy(
                    to_email=pharmacy_user["email"],
                    full_name=pharmacy_user.get("full_name", ""),
                    pharmacy_name=pharmacy_doc.get("pharmacy_name", ""),
                    order_number=order.get("order_number", ""),
                    order_id=order_id,
                    new_status=data.status,
                    supplier_name=supplier_doc.get("company_name", "") if supplier_doc else "",
                    total=order.get("total", 0),
                    items=order.get("items", []),
                    cancellation_reason=data.cancellation_reason
                ))

    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    return serialize_doc(order)

# ==========================================
# CART ENDPOINTS
# ==========================================

@app.get("/api/cart")
async def get_cart(user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        return []
    
    cart_items = await db.cart_items.find({"pharmacy_id": str(pharmacy["_id"])}).to_list(100)
    
    result = []
    for item in cart_items:
        item_data = serialize_doc(item)
        product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
        if product:
            item_data["product"] = serialize_doc(product)
            supplier = await db.suppliers.find_one({"_id": ObjectId(product["supplier_id"])})
            if supplier:
                item_data["product"]["supplier"] = {"id": str(supplier["_id"]), "company_name": supplier.get("company_name", "")}
        result.append(item_data)
    
    return result

@app.post("/api/cart")
async def add_to_cart(data: CartItemAdd, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    # Check if product exists
    product = await db.products.find_one({"_id": ObjectId(data.product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    # Check if already in cart
    existing = await db.cart_items.find_one({
        "pharmacy_id": str(pharmacy["_id"]),
        "product_id": data.product_id
    })
    
    if existing:
        # Update quantity
        new_quantity = existing["quantity"] + data.quantity
        await db.cart_items.update_one(
            {"_id": existing["_id"]},
            {"$set": {"quantity": new_quantity, "updated_at": datetime.now(timezone.utc)}}
        )
        cart_item = await db.cart_items.find_one({"_id": existing["_id"]})
    else:
        # Create new cart item
        cart_doc = {
            "pharmacy_id": str(pharmacy["_id"]),
            "product_id": data.product_id,
            "supplier_id": product["supplier_id"],
            "quantity": data.quantity,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db.cart_items.insert_one(cart_doc)
        cart_item = await db.cart_items.find_one({"_id": result.inserted_id})
    
    return serialize_doc(cart_item)

@app.put("/api/cart/{item_id}")
async def update_cart_item(item_id: str, data: CartItemUpdate, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    cart_item = await db.cart_items.find_one({"_id": ObjectId(item_id)})
    if not cart_item or cart_item["pharmacy_id"] != str(pharmacy["_id"]):
        raise HTTPException(status_code=404, detail="Article non trouvé dans le panier")
    
    if data.quantity <= 0:
        await db.cart_items.delete_one({"_id": ObjectId(item_id)})
        return {"message": "Article supprimé du panier"}
    
    await db.cart_items.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": {"quantity": data.quantity, "updated_at": datetime.now(timezone.utc)}}
    )
    
    cart_item = await db.cart_items.find_one({"_id": ObjectId(item_id)})
    return serialize_doc(cart_item)

@app.delete("/api/cart/{item_id}")
async def remove_from_cart(item_id: str, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    cart_item = await db.cart_items.find_one({"_id": ObjectId(item_id)})
    if not cart_item or cart_item["pharmacy_id"] != str(pharmacy["_id"]):
        raise HTTPException(status_code=404, detail="Article non trouvé dans le panier")
    
    await db.cart_items.delete_one({"_id": ObjectId(item_id)})
    return {"message": "Article supprimé du panier"}

@app.delete("/api/cart")
async def clear_cart(user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        return {"message": "Panier vidé"}
    
    await db.cart_items.delete_many({"pharmacy_id": str(pharmacy["_id"])})
    return {"message": "Panier vidé"}

# ==========================================
# REVIEWS ENDPOINTS
# ==========================================

@app.get("/api/reviews")
async def get_reviews(supplier_id: Optional[str] = None, user = Depends(get_current_user)):
    query = {}
    if supplier_id:
        query["supplier_id"] = supplier_id
    
    reviews = await db.reviews.find(query).sort("created_at", -1).to_list(1000)
    
    result = []
    for review in reviews:
        review_data = serialize_doc(review)
        pharmacy = await db.pharmacies.find_one({"_id": ObjectId(review["pharmacy_id"])})
        if pharmacy:
            review_data["pharmacy"] = {"id": str(pharmacy["_id"]), "pharmacy_name": pharmacy.get("pharmacy_name", "")}
        result.append(review_data)
    
    return result

@app.post("/api/reviews")
async def create_review(data: ReviewCreate, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Seules les pharmacies peuvent laisser des avis")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    # Check if already reviewed
    existing = await db.reviews.find_one({
        "pharmacy_id": str(pharmacy["_id"]),
        "supplier_id": data.supplier_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà laissé un avis pour ce fournisseur")
    
    review_doc = {
        "pharmacy_id": str(pharmacy["_id"]),
        "supplier_id": data.supplier_id,
        "rating": data.rating,
        "title": data.title,
        "comment": data.comment,
        "order_id": data.order_id,
        "is_verified": data.order_id is not None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    result = await db.reviews.insert_one(review_doc)
    review_doc["_id"] = result.inserted_id
    
    return serialize_doc(review_doc)

@app.put("/api/reviews/{review_id}")
async def update_review(review_id: str, data: ReviewCreate, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    if not review or review["pharmacy_id"] != str(pharmacy["_id"]):
        raise HTTPException(status_code=404, detail="Avis non trouvé")
    
    updates = {
        "rating": data.rating,
        "title": data.title,
        "comment": data.comment,
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db.reviews.update_one({"_id": ObjectId(review_id)}, {"$set": updates})
    
    review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    return serialize_doc(review)

@app.delete("/api/reviews/{review_id}")
async def delete_review(review_id: str, user = Depends(require_active)):
    if user["role"] not in ["pharmacy", "admin"]:
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    if user["role"] == "pharmacy":
        pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
        review = await db.reviews.find_one({"_id": ObjectId(review_id)})
        if not review or review["pharmacy_id"] != str(pharmacy["_id"]):
            raise HTTPException(status_code=404, detail="Avis non trouvé")
    
    await db.reviews.delete_one({"_id": ObjectId(review_id)})
    return {"message": "Avis supprimé"}

# ==========================================
# SUPPLIERS ENDPOINTS (for pharmacy view)
# ==========================================

@app.get("/api/suppliers")
async def get_suppliers(user = Depends(get_current_user)):
    # Get all active suppliers
    users = await db.users.find({"role": "supplier", "status": "active"}, {"password": 0}).to_list(1000)
    
    result = []
    for u in users:
        supplier = await db.suppliers.find_one({"user_id": str(u["_id"])})
        if supplier:
            supplier_data = serialize_doc(supplier)
            supplier_data["user"] = serialize_doc(u)
            
            # Get stats
            product_count = await db.products.count_documents({"supplier_id": str(supplier["_id"])})
            supplier_data["product_count"] = product_count
            
            # Get rating
            pipeline = [
                {"$match": {"supplier_id": str(supplier["_id"])}},
                {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
            ]
            rating_result = await db.reviews.aggregate(pipeline).to_list(1)
            if rating_result:
                supplier_data["rating"] = round(rating_result[0]["avg"], 1) if rating_result[0]["avg"] else 0
                supplier_data["review_count"] = rating_result[0]["count"]
            else:
                supplier_data["rating"] = 0
                supplier_data["review_count"] = 0
            
            result.append(supplier_data)
    
    return result

@app.get("/api/suppliers/{supplier_id}")
async def get_supplier(supplier_id: str, user = Depends(get_current_user)):
    supplier = await db.suppliers.find_one({"_id": ObjectId(supplier_id)})
    if not supplier:
        raise HTTPException(status_code=404, detail="Fournisseur non trouvé")
    
    supplier_data = serialize_doc(supplier)
    
    # Get user info
    user_doc = await db.users.find_one({"_id": ObjectId(supplier["user_id"])}, {"password": 0})
    supplier_data["user"] = serialize_doc(user_doc) if user_doc else None
    
    # Get products
    products = await db.products.find({"supplier_id": supplier_id}).to_list(100)
    supplier_data["products"] = serialize_doc(products)
    
    # Get agents
    agents = await db.agents.find({"supplier_id": supplier_id, "is_active": True}).to_list(100)
    supplier_data["agents"] = serialize_doc(agents)
    
    # Get reviews
    reviews = await db.reviews.find({"supplier_id": supplier_id}).to_list(100)
    supplier_data["reviews"] = serialize_doc(reviews)
    
    return supplier_data

# ==========================================
# SUPPLIER DASHBOARD ENDPOINTS
# ==========================================

@app.get("/api/supplier/stats")
async def get_supplier_stats(user = Depends(require_active)):
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    supplier = await db.suppliers.find_one({"user_id": user["id"]})
    if not supplier:
        raise HTTPException(status_code=404, detail="Profil fournisseur non trouvé")
    
    supplier_id = str(supplier["_id"])
    
    stats = {
        "total_products": await db.products.count_documents({"supplier_id": supplier_id}),
        "available_products": await db.products.count_documents({"supplier_id": supplier_id, "available": True}),
        "total_agents": await db.agents.count_documents({"supplier_id": supplier_id}),
        "active_agents": await db.agents.count_documents({"supplier_id": supplier_id, "is_active": True}),
        "total_orders": await db.orders.count_documents({"supplier_id": supplier_id}),
        "pending_orders": await db.orders.count_documents({"supplier_id": supplier_id, "status": "pending"}),
        "total_reviews": await db.reviews.count_documents({"supplier_id": supplier_id})
    }
    
    # Calculate average rating
    pipeline = [
        {"$match": {"supplier_id": supplier_id}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}}}
    ]
    result = await db.reviews.aggregate(pipeline).to_list(1)
    stats["average_rating"] = round(result[0]["avg"], 1) if result and result[0]["avg"] else 0
    
    # Calculate total revenue
    pipeline = [
        {"$match": {"supplier_id": supplier_id, "status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    result = await db.orders.aggregate(pipeline).to_list(1)
    stats["total_revenue"] = result[0]["total"] if result and result[0]["total"] else 0
    
    return stats

@app.get("/api/supplier/products")
async def get_supplier_products(user = Depends(require_active)):
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    supplier = await db.suppliers.find_one({"user_id": user["id"]})
    if not supplier:
        return []
    
    products = await db.products.find({"supplier_id": str(supplier["_id"])}).sort("created_at", -1).to_list(1000)
    return serialize_doc(products)

@app.get("/api/supplier/orders")
async def get_supplier_orders(user = Depends(require_active)):
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    supplier = await db.suppliers.find_one({"user_id": user["id"]})
    if not supplier:
        return []
    
    orders = await db.orders.find({"supplier_id": str(supplier["_id"])}).sort("created_at", -1).to_list(1000)
    
    result = []
    for order in orders:
        order_data = serialize_doc(order)
        pharmacy = await db.pharmacies.find_one({"_id": ObjectId(order["pharmacy_id"])})
        order_data["pharmacy"] = serialize_doc(pharmacy) if pharmacy else None
        result.append(order_data)
    
    return result

@app.get("/api/supplier/reviews")
async def get_supplier_reviews(user = Depends(require_active)):
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    supplier = await db.suppliers.find_one({"user_id": user["id"]})
    if not supplier:
        return []
    
    reviews = await db.reviews.find({"supplier_id": str(supplier["_id"])}).sort("created_at", -1).to_list(1000)
    
    result = []
    for review in reviews:
        review_data = serialize_doc(review)
        pharmacy = await db.pharmacies.find_one({"_id": ObjectId(review["pharmacy_id"])})
        review_data["pharmacy"] = serialize_doc(pharmacy) if pharmacy else None
        result.append(review_data)
    
    return result

# ==========================================
# AI EXCEL ANALYSIS ENDPOINT
# ==========================================

@app.post("/api/analyze-excel")
async def analyze_excel_with_ai(data: ExcelAnalysisRequest, user = Depends(require_active)):
    """Use AI to intelligently map Excel columns to product fields"""
    if user["role"] != "supplier":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    try:
        import httpx

        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Clé API Gemini non configurée")

        prompt = f"""Tu es un assistant spécialisé dans l'analyse de fichiers Excel pour l'import de produits pharmaceutiques.
Tu dois analyser les colonnes d'un fichier Excel et créer un mapping vers les champs produits suivants:
- name: Nom du produit (obligatoire)
- reference: Référence/Code produit (obligatoire)
- dci: Dénomination Commune Internationale
- description: Description du produit
- category: Catégorie du produit
- product_type: Type (medical, paramedical, other)
- expiry_date: Date d'expiration (format YYYY-MM-DD)
- price: Prix unitaire (obligatoire)
- ug: UG/Unité gratuite en %
- stock_quantity: Quantité en stock
- min_order_quantity: Quantité minimum de commande
- available: Disponible (true/false)

Tu dois répondre UNIQUEMENT avec un JSON valide sans aucun texte avant ou après.

Voici les colonnes du fichier Excel et quelques lignes d'exemple:

Colonnes: {json.dumps(data.columns, ensure_ascii=False)}

Données d'exemple:
{json.dumps(data.sample_data[:3], ensure_ascii=False, indent=2)}

Réponds avec un JSON contenant:
1. "mapping": un objet associant chaque colonne Excel (clé) au champ produit correspondant (valeur), ou null si la colonne ne correspond à rien
2. "products": un tableau avec les produits extraits des données d'exemple, avec les valeurs manquantes remplies par "N/A" pour le texte et 0 pour les nombres

Exemple de réponse:
{{
  "mapping": {{
    "Nom": "name",
    "Réf": "reference",
    "Prix": "price"
  }},
  "products": [
    {{
      "name": "Doliprane 500mg",
      "reference": "DOL-500",
      "dci": "Paracétamol",
      "description": "N/A",
      "category": "Antalgique",
      "product_type": "medical",
      "expiry_date": "2025-12-31",
      "price": 250.00,
      "ug": 10,
      "stock_quantity": 100,
      "min_order_quantity": 5,
      "available": true
    }}
  ]
}}"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.1}
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            resp_data = resp.json()

        response_text = resp_data["candidates"][0]["content"]["parts"][0]["text"]

        try:
            cleaned = response_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            result = json.loads(cleaned)
            return result
        except json.JSONDecodeError:
            return {
                "error": "La réponse AI n'est pas un JSON valide",
                "raw_response": response_text[:500],
                "mapping": {},
                "products": []
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse: {str(e)}")

# ==========================================
# SEED DATABASE ENDPOINT (for development)
# ==========================================

@app.post("/api/seed")
async def seed_database():
    """Seed the database with test data"""
    
    # Check if already seeded
    admin_exists = await db.users.find_one({"email": "admin@dawalink.dz"})
    if admin_exists:
        return {"message": "La base de données a déjà été initialisée"}
    
    # Create admin users
    admins = [
        {"email": "admin@dawalink.dz", "password": "admin123456", "full_name": "Admin Principal", "phone": "+213 555 000 001"},
        {"email": "admin2@dawalink.dz", "password": "admin123456", "full_name": "Admin Secondaire", "phone": "+213 555 000 002"}
    ]
    
    for admin in admins:
        user_doc = {
            "email": admin["email"],
            "password": hash_password(admin["password"]),
            "full_name": admin["full_name"],
            "phone": admin["phone"],
            "role": "admin",
            "status": "active",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(user_doc)
    
    # Create suppliers
    suppliers_data = [
        {"email": "supplier1@pharmaplus.dz", "password": "supplier123", "full_name": "Mohamed Benamara", "phone": "+213 555 111 111",
         "company_name": "Pharma Plus Distribution", "registry_number": "RC-2023-1234", "address": "Zone Industrielle Rouiba, Lot 45", "wilaya": "Alger", "status": "active"},
        {"email": "supplier2@medipharm.dz", "password": "supplier123", "full_name": "Yasmine Khelifi", "phone": "+213 555 222 222",
         "company_name": "MediPharm Solutions", "registry_number": "RC-2023-5678", "address": "Zone Industrielle Es Senia, Bloc B", "wilaya": "Oran", "status": "active"},
        {"email": "supplier3@healthplus.dz", "password": "supplier123", "full_name": "Karim Boudiaf", "phone": "+213 555 333 333",
         "company_name": "HealthPlus Algeria", "registry_number": "RC-2024-1001", "address": "Nouvelle Ville Ali Mendjeli, UV3", "wilaya": "Constantine", "status": "active"},
        {"email": "supplier4@newpharma.dz", "password": "supplier123", "full_name": "Samir Hadj", "phone": "+213 555 444 444",
         "company_name": "NewPharma Distribution", "registry_number": "RC-2024-2001", "address": "Zone Industrielle Blida", "wilaya": "Blida", "status": "pending"},
    ]
    
    supplier_ids = {}
    for s in suppliers_data:
        user_doc = {
            "email": s["email"],
            "password": hash_password(s["password"]),
            "full_name": s["full_name"],
            "phone": s["phone"],
            "role": "supplier",
            "status": s["status"],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db.users.insert_one(user_doc)
        user_id = result.inserted_id
        
        supplier_doc = {
            "user_id": str(user_id),
            "company_name": s["company_name"],
            "registry_number": s["registry_number"],
            "address": s["address"],
            "wilaya": s["wilaya"],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db.suppliers.insert_one(supplier_doc)
        supplier_ids[s["email"]] = str(result.inserted_id)
    
    # Create pharmacies
    pharmacies_data = [
        {"email": "pharmacy1@madina.dz", "password": "pharmacy123", "full_name": "Dr. Ahmed Bennani", "phone": "+213 555 600 001",
         "pharmacy_name": "Pharmacie El Madina", "registry_number": "AGR-2024-156", "address": "Rue Didouche Mourad, Centre-ville", "wilaya": "Alger", "status": "active"},
        {"email": "pharmacy2@oran.dz", "password": "pharmacy123", "full_name": "Dr. Karim Mansouri", "phone": "+213 555 600 002",
         "pharmacy_name": "Pharmacie El Amir", "registry_number": "AGR-2024-157", "address": "Boulevard de la Révolution", "wilaya": "Oran", "status": "active"},
        {"email": "pharmacy3@constantine.dz", "password": "pharmacy123", "full_name": "Dr. Leila Bouaziz", "phone": "+213 555 600 003",
         "pharmacy_name": "Pharmacie du Centre", "registry_number": "AGR-2024-158", "address": "Place des Martyrs", "wilaya": "Constantine", "status": "active"},
        {"email": "pharmacy4@blida.dz", "password": "pharmacy123", "full_name": "Dr. Omar Belkacem", "phone": "+213 555 600 004",
         "pharmacy_name": "Pharmacie Rose des Sables", "registry_number": "AGR-2024-200", "address": "Rue Principale, Centre", "wilaya": "Blida", "status": "pending"},
    ]
    
    for p in pharmacies_data:
        user_doc = {
            "email": p["email"],
            "password": hash_password(p["password"]),
            "full_name": p["full_name"],
            "phone": p["phone"],
            "role": "pharmacy",
            "status": p["status"],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        result = await db.users.insert_one(user_doc)
        user_id = result.inserted_id
        
        pharmacy_doc = {
            "user_id": str(user_id),
            "pharmacy_name": p["pharmacy_name"],
            "registry_number": p["registry_number"],
            "address": p["address"],
            "wilaya": p["wilaya"],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        await db.pharmacies.insert_one(pharmacy_doc)
    
    # Create products for suppliers
    products_data = [
        {"supplier_email": "supplier1@pharmaplus.dz", "products": [
            {"name": "Doliprane 500mg", "reference": "DOL-500", "dci": "Paracétamol", "price": 250.00, "ug": 10, "available": True, "category": "Antalgique", "product_type": "medical", "expiry_date": "2026-06-15"},
            {"name": "Doliprane 1000mg", "reference": "DOL-1000", "dci": "Paracétamol", "price": 350.00, "ug": 10, "available": True, "category": "Antalgique", "product_type": "medical", "expiry_date": "2026-08-20"},
            {"name": "Clamoxyl 500mg", "reference": "CLA-500", "dci": "Amoxicilline", "price": 650.00, "ug": 15, "available": True, "category": "Antibiotique", "product_type": "medical", "expiry_date": "2025-12-31"},
            {"name": "Augmentin 1g", "reference": "AUG-1G", "dci": "Amoxicilline + Acide clavulanique", "price": 1250.00, "ug": 20, "available": True, "category": "Antibiotique", "product_type": "medical", "expiry_date": "2026-03-10"},
            {"name": "Voltarène 75mg", "reference": "VOL-75", "dci": "Diclofénac", "price": 420.00, "ug": 12, "available": True, "category": "Anti-inflammatoire", "product_type": "medical", "expiry_date": "2026-09-25"},
        ]},
        {"supplier_email": "supplier2@medipharm.dz", "products": [
            {"name": "Antalfène 400mg", "reference": "ANT-400", "dci": "Ibuprofène", "price": 350.00, "ug": 12, "available": True, "category": "Anti-inflammatoire", "product_type": "medical", "expiry_date": "2026-05-18"},
            {"name": "Suprax 200mg", "reference": "SUP-200", "dci": "Céfixime", "price": 1450.00, "ug": 25, "available": True, "category": "Antibiotique", "product_type": "medical", "expiry_date": "2025-11-30"},
            {"name": "Daflon 500mg", "reference": "DAF-500", "dci": "Flavonoïdes", "price": 950.00, "ug": 10, "available": True, "category": "Veinotonique", "product_type": "medical", "expiry_date": "2026-12-01"},
            {"name": "Glucophage 850mg", "reference": "GLU-850", "dci": "Metformine", "price": 320.00, "ug": 15, "available": True, "category": "Antidiabétique", "product_type": "medical", "expiry_date": "2026-07-22"},
        ]},
        {"supplier_email": "supplier3@healthplus.dz", "products": [
            {"name": "Ventoline Spray", "reference": "VEN-SPR", "dci": "Salbutamol", "price": 750.00, "ug": 18, "available": True, "category": "Pneumologie"},
            {"name": "Aerius 5mg", "reference": "AER-5", "dci": "Desloratadine", "price": 650.00, "ug": 15, "available": True, "category": "Antihistaminique"},
            {"name": "Nasonex Spray", "reference": "NAS-SPR", "dci": "Mométasone", "price": 1100.00, "ug": 18, "available": True, "category": "ORL"},
            {"name": "Betadine 10%", "reference": "BET-10", "dci": "Povidone iodée", "price": 280.00, "ug": 8, "available": True, "category": "Antiseptique"},
        ]},
    ]
    
    for catalog in products_data:
        supplier_id = supplier_ids.get(catalog["supplier_email"])
        if supplier_id:
            for product in catalog["products"]:
                product_doc = {
                    **product,
                    "supplier_id": supplier_id,
                    "stock_quantity": 100,
                    "min_order_quantity": 1,
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                }
                await db.products.insert_one(product_doc)
    
    # Create agents
    agents_data = [
        {"supplier_email": "supplier1@pharmaplus.dz", "agents": [
            {"name": "Ahmed Bennani", "phone": "+213 555 123 001", "email": "ahmed.b@pharmaplus.dz", "whatsapp": "+213555123001", "region": "Alger"},
            {"name": "Fatima Alaoui", "phone": "+213 555 123 002", "email": "fatima.a@pharmaplus.dz", "whatsapp": "+213555123002", "region": "Oran"},
        ]},
        {"supplier_email": "supplier2@medipharm.dz", "agents": [
            {"name": "Rania Belkacem", "phone": "+213 555 456 001", "email": "rania.b@medipharm.dz", "whatsapp": "+213555456001", "region": "Alger"},
            {"name": "Said Mansouri", "phone": "+213 555 456 002", "email": "said.m@medipharm.dz", "whatsapp": "+213555456002", "region": "Oran"},
        ]},
        {"supplier_email": "supplier3@healthplus.dz", "agents": [
            {"name": "Kamel Bensalem", "phone": "+213 555 789 001", "email": "kamel.b@healthplus.dz", "whatsapp": "+213555789001", "region": "Constantine"},
            {"name": "Nadia Ferhat", "phone": "+213 555 789 002", "email": "nadia.f@healthplus.dz", "whatsapp": "+213555789002", "region": "Sétif"},
        ]},
    ]
    
    for catalog in agents_data:
        supplier_id = supplier_ids.get(catalog["supplier_email"])
        if supplier_id:
            for agent in catalog["agents"]:
                agent_doc = {
                    **agent,
                    "supplier_id": supplier_id,
                    "is_active": True,
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                }
                await db.agents.insert_one(agent_doc)
    
    return {
        "message": "Base de données initialisée avec succès!",
        "accounts": {
            "admin": "admin@dawalink.dz / admin123456",
            "suppliers_active": ["supplier1@pharmaplus.dz", "supplier2@medipharm.dz", "supplier3@healthplus.dz"],
            "suppliers_pending": ["supplier4@newpharma.dz"],
            "pharmacies_active": ["pharmacy1@madina.dz", "pharmacy2@oran.dz", "pharmacy3@constantine.dz"],
            "pharmacies_pending": ["pharmacy4@blida.dz"],
            "password_all": "supplier123 ou pharmacy123"
        }
    }

# ==========================================
# PHARMACY INVENTORY ENDPOINTS
# ==========================================

@app.get("/api/pharmacy/inventory")
async def get_pharmacy_inventory(
    search: Optional[str] = None,
    product_type: Optional[str] = None,
    low_stock: Optional[bool] = None,
    user = Depends(require_active)
):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    query = {"pharmacy_id": str(pharmacy["_id"])}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"reference": {"$regex": search, "$options": "i"}},
            {"dci": {"$regex": search, "$options": "i"}}
        ]
    
    if product_type:
        query["product_type"] = product_type
    
    products = await db.pharmacy_inventory.find(query).sort("created_at", -1).to_list(1000)
    
    result = []
    for product in products:
        product_data = serialize_doc(product)
        # Check if low stock
        product_data["is_low_stock"] = product.get("stock_quantity", 0) <= product.get("min_stock_alert", 10)
        # Check if expired or expiring soon
        if product.get("expiry_date"):
            try:
                expiry = datetime.strptime(product["expiry_date"], "%Y-%m-%d")
                days_until_expiry = (expiry - datetime.now()).days
                product_data["days_until_expiry"] = days_until_expiry
                product_data["is_expired"] = days_until_expiry < 0
                product_data["is_expiring_soon"] = 0 <= days_until_expiry <= 30
            except:
                pass
        result.append(product_data)
    
    if low_stock:
        result = [p for p in result if p.get("is_low_stock")]
    
    return result

@app.post("/api/pharmacy/inventory")
async def add_pharmacy_product(data: PharmacyProductCreate, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    # Check if reference already exists for this pharmacy
    existing = await db.pharmacy_inventory.find_one({
        "pharmacy_id": str(pharmacy["_id"]),
        "reference": data.reference
    })
    if existing:
        raise HTTPException(status_code=400, detail="Un produit avec cette référence existe déjà dans votre inventaire")
    
    product_doc = {
        "pharmacy_id": str(pharmacy["_id"]),
        "name": data.name,
        "reference": data.reference,
        "dci": data.dci,
        "description": data.description,
        "category": data.category,
        "product_type": data.product_type,
        "expiry_date": data.expiry_date,
        "purchase_price": data.purchase_price,
        "selling_price": data.selling_price,
        "stock_quantity": data.stock_quantity,
        "min_stock_alert": data.min_stock_alert,
        "supplier_name": data.supplier_name,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    result = await db.pharmacy_inventory.insert_one(product_doc)
    product_doc["_id"] = result.inserted_id
    
    return serialize_doc(product_doc)

@app.put("/api/pharmacy/inventory/{product_id}")
async def update_pharmacy_product(product_id: str, data: PharmacyProductUpdate, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    product = await db.pharmacy_inventory.find_one({
        "_id": ObjectId(product_id),
        "pharmacy_id": str(pharmacy["_id"])
    })
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    updates = {k: v for k, v in data.dict().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)
    
    await db.pharmacy_inventory.update_one({"_id": ObjectId(product_id)}, {"$set": updates})
    
    product = await db.pharmacy_inventory.find_one({"_id": ObjectId(product_id)})
    return serialize_doc(product)

@app.delete("/api/pharmacy/inventory/{product_id}")
async def delete_pharmacy_product(product_id: str, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    product = await db.pharmacy_inventory.find_one({
        "_id": ObjectId(product_id),
        "pharmacy_id": str(pharmacy["_id"])
    })
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    await db.pharmacy_inventory.delete_one({"_id": ObjectId(product_id)})
    return {"message": "Produit supprimé de l'inventaire"}

@app.post("/api/pharmacy/inventory/stock-movement")
async def record_stock_movement(data: StockMovement, user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    product = await db.pharmacy_inventory.find_one({
        "_id": ObjectId(data.product_id),
        "pharmacy_id": str(pharmacy["_id"])
    })
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    current_stock = product.get("stock_quantity", 0)
    
    if data.movement_type == "in":
        new_stock = current_stock + data.quantity
    elif data.movement_type == "out":
        new_stock = current_stock - data.quantity
        if new_stock < 0:
            raise HTTPException(status_code=400, detail="Stock insuffisant")
    else:  # adjustment
        new_stock = data.quantity
    
    # Record the movement
    movement_doc = {
        "pharmacy_id": str(pharmacy["_id"]),
        "product_id": data.product_id,
        "movement_type": data.movement_type,
        "quantity": data.quantity,
        "previous_stock": current_stock,
        "new_stock": new_stock,
        "reason": data.reason,
        "created_at": datetime.now(timezone.utc)
    }
    await db.stock_movements.insert_one(movement_doc)
    
    # Update product stock
    await db.pharmacy_inventory.update_one(
        {"_id": ObjectId(data.product_id)},
        {"$set": {"stock_quantity": new_stock, "updated_at": datetime.now(timezone.utc)}}
    )
    
    return {"message": "Mouvement de stock enregistré", "new_stock": new_stock}

@app.get("/api/pharmacy/inventory/stats")
async def get_pharmacy_inventory_stats(user = Depends(require_active)):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    pharmacy_id = str(pharmacy["_id"])
    
    total_products = await db.pharmacy_inventory.count_documents({"pharmacy_id": pharmacy_id})
    
    # Count low stock products
    products = await db.pharmacy_inventory.find({"pharmacy_id": pharmacy_id}).to_list(1000)
    low_stock_count = 0
    expiring_soon_count = 0
    expired_count = 0
    total_value = 0
    
    for p in products:
        if p.get("stock_quantity", 0) <= p.get("min_stock_alert", 10):
            low_stock_count += 1
        if p.get("expiry_date"):
            try:
                expiry = datetime.strptime(p["expiry_date"], "%Y-%m-%d")
                days = (expiry - datetime.now()).days
                if days < 0:
                    expired_count += 1
                elif days <= 30:
                    expiring_soon_count += 1
            except:
                pass
        total_value += (p.get("purchase_price", 0) * p.get("stock_quantity", 0))
    
    return {
        "total_products": total_products,
        "low_stock_count": low_stock_count,
        "expiring_soon_count": expiring_soon_count,
        "expired_count": expired_count,
        "total_inventory_value": total_value
    }

@app.get("/api/pharmacy/stock-movements")
async def get_stock_movements(
    product_id: Optional[str] = None,
    limit: int = 50,
    user = Depends(require_active)
):
    if user["role"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Non autorisé")
    
    pharmacy = await db.pharmacies.find_one({"user_id": user["id"]})
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Profil pharmacie non trouvé")
    
    query = {"pharmacy_id": str(pharmacy["_id"])}
    if product_id:
        query["product_id"] = product_id
    
    movements = await db.stock_movements.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    return serialize_doc(movements)

# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "database": "connected" if db is not None else "disconnected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
