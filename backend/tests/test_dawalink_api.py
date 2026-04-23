"""
DawaLink API Tests - Comprehensive backend testing
Tests: Authentication, Admin Dashboard, Products, Orders, Users
"""
import pytest
import requests
import os

# Use localhost for testing since we're inside the container
BASE_URL = "http://localhost:8001"

# Test credentials
ADMIN_CREDS = {"email": "admin@dawalink.dz", "password": "admin123456"}
PHARMACY_CREDS = {"email": "pharmacy1@madina.dz", "password": "pharmacy123"}
SUPPLIER_CREDS = {"email": "supplier1@pharmaplus.dz", "password": "supplier123"}


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_endpoint(self):
        """Test API health check"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["database"] == "connected"


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDS
        )
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_CREDS["email"]
        assert data["user"]["role"] == "admin"
        assert data["user"]["status"] == "active"
    
    def test_pharmacy_login_success(self):
        """Test pharmacy login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=PHARMACY_CREDS
        )
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == PHARMACY_CREDS["email"]
        assert data["user"]["role"] == "pharmacy"
        assert "details" in data
        assert data["details"]["pharmacy_name"] == "Pharmacie El Madina"
    
    def test_supplier_login_success(self):
        """Test supplier login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=SUPPLIER_CREDS
        )
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == SUPPLIER_CREDS["email"]
        assert data["user"]["role"] == "supplier"
        assert "details" in data
        assert data["details"]["company_name"] == "Pharma Plus Distribution"
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@email.com", "password": "wrongpass"}
        )
        assert response.status_code == 401
    
    def test_login_missing_fields(self):
        """Test login with missing fields"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "test@test.com"}
        )
        assert response.status_code == 422


class TestAdminDashboard:
    """Admin dashboard endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDS
        )
        return response.json()["token"]
    
    def test_admin_stats(self, admin_token):
        """Test admin stats endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        # Verify all expected stats fields
        assert "total_users" in data
        assert "pending_users" in data
        assert "pharmacies" in data
        assert "active_pharmacies" in data
        assert "suppliers" in data
        assert "active_suppliers" in data
        assert "total_products" in data
        assert "available_products" in data
        assert "total_orders" in data
        assert "pending_orders" in data
        assert "total_agents" in data
        # Verify expected values from seed data
        assert data["pharmacies"] == 4
        assert data["suppliers"] == 4
        assert data["total_products"] == 13
    
    def test_admin_pharmacies(self, admin_token):
        """Test admin pharmacies list endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/pharmacies",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 4  # At least 4 pharmacies from seed
        # Verify pharmacy structure
        pharmacy = data[0]
        assert "id" in pharmacy
        assert "email" in pharmacy
        assert "full_name" in pharmacy
        assert "role" in pharmacy
        assert pharmacy["role"] == "pharmacy"
        assert "details" in pharmacy
        assert "pharmacy_name" in pharmacy["details"]
        assert "registry_number" in pharmacy["details"]
        assert "wilaya" in pharmacy["details"]
    
    def test_admin_suppliers(self, admin_token):
        """Test admin suppliers list endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/suppliers",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 4  # At least 4 suppliers from seed
        # Verify supplier structure
        supplier = data[0]
        assert "id" in supplier
        assert "email" in supplier
        assert "full_name" in supplier
        assert "role" in supplier
        assert supplier["role"] == "supplier"
        assert "details" in supplier
        assert "company_name" in supplier["details"]
        assert "registry_number" in supplier["details"]
        assert "wilaya" in supplier["details"]
    
    def test_admin_pending_users(self, admin_token):
        """Test admin pending users endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/users/pending",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_admin_orders(self, admin_token):
        """Test admin orders list endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/orders",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_admin_stats_unauthorized(self):
        """Test admin stats without authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        # API returns 403 for missing auth (could be 401 or 403)
        assert response.status_code in [401, 403]


class TestProducts:
    """Products endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDS
        )
        return response.json()["token"]
    
    @pytest.fixture
    def pharmacy_token(self):
        """Get pharmacy authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=PHARMACY_CREDS
        )
        return response.json()["token"]
    
    def test_get_all_products(self, admin_token):
        """Test get all products"""
        response = requests.get(
            f"{BASE_URL}/api/products",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 13  # At least 13 products from seed
        # Verify product structure
        product = data[0]
        assert "id" in product
        assert "name" in product
        assert "reference" in product
        assert "price" in product
        assert "available" in product
        assert "supplier" in product
    
    def test_get_products_with_search(self, admin_token):
        """Test product search"""
        response = requests.get(
            f"{BASE_URL}/api/products?search=Doliprane",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should find Doliprane products
        for product in data:
            assert "doliprane" in product["name"].lower() or "doliprane" in product.get("dci", "").lower()
    
    def test_pharmacy_can_view_products(self, pharmacy_token):
        """Test pharmacy can view products"""
        response = requests.get(
            f"{BASE_URL}/api/products",
            headers={"Authorization": f"Bearer {pharmacy_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 13


class TestUserManagement:
    """User management tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=ADMIN_CREDS
        )
        return response.json()["token"]
    
    def test_get_all_users(self, admin_token):
        """Test get all users"""
        response = requests.get(
            f"{BASE_URL}/api/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 10  # At least 10 users from seed


class TestSupplierEndpoints:
    """Supplier-specific endpoint tests"""
    
    @pytest.fixture
    def supplier_token(self):
        """Get supplier authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=SUPPLIER_CREDS
        )
        return response.json()["token"]
    
    def test_supplier_stats(self, supplier_token):
        """Test supplier stats endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/supplier/stats",
            headers={"Authorization": f"Bearer {supplier_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_products" in data
        assert "available_products" in data
        assert "total_orders" in data
    
    def test_supplier_products(self, supplier_token):
        """Test supplier products endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/supplier/products",
            headers={"Authorization": f"Bearer {supplier_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Supplier 1 has 5 products
        assert len(data) >= 5


class TestPharmacyEndpoints:
    """Pharmacy-specific endpoint tests"""
    
    @pytest.fixture
    def pharmacy_token(self):
        """Get pharmacy authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=PHARMACY_CREDS
        )
        return response.json()["token"]
    
    def test_pharmacy_cart(self, pharmacy_token):
        """Test pharmacy cart endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/cart",
            headers={"Authorization": f"Bearer {pharmacy_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_pharmacy_orders(self, pharmacy_token):
        """Test pharmacy orders endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/orders",
            headers={"Authorization": f"Bearer {pharmacy_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_suppliers_list(self, pharmacy_token):
        """Test get suppliers list for pharmacy"""
        response = requests.get(
            f"{BASE_URL}/api/suppliers",
            headers={"Authorization": f"Bearer {pharmacy_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3  # At least 3 active suppliers


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
