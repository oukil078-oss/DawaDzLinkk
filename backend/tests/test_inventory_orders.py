"""
Test module for DawaLink B2B Pharmaceutical Platform - New Features
Testing: Pharmacy Inventory (CRUD + Stock Movement), Product Types, Expiry Dates, Order Payment Methods

Test Credentials:
- Pharmacy: pharmacy1@madina.dz / pharmacy123
- Supplier: supplier1@pharmaplus.dz / supplier123
- Admin: admin@dawalink.dz / admin123456
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://verify-email-reset.preview.emergentagent.com').rstrip('/')

# Test data prefix for cleanup
TEST_PREFIX = "TEST_INV_"


class TestAuthentication:
    """Test login for different user roles"""
    
    def test_pharmacy_login(self, api_client):
        """Login as pharmacy user"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "pharmacy1@madina.dz",
            "password": "pharmacy123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "pharmacy"
        assert data["user"]["email"] == "pharmacy1@madina.dz"
        print("✓ Pharmacy login successful")
    
    def test_supplier_login(self, api_client):
        """Login as supplier user"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "supplier1@pharmaplus.dz",
            "password": "supplier123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "supplier"
        assert data["user"]["email"] == "supplier1@pharmaplus.dz"
        print("✓ Supplier login successful")


class TestPharmacyInventory:
    """Test pharmacy private inventory CRUD operations"""
    
    def test_get_inventory_empty(self, pharmacy_client):
        """Get pharmacy inventory (may be empty initially)"""
        response = pharmacy_client.get(f"{BASE_URL}/api/pharmacy/inventory")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Get inventory successful - {len(data)} products found")
    
    def test_get_inventory_stats(self, pharmacy_client):
        """Get pharmacy inventory statistics"""
        response = pharmacy_client.get(f"{BASE_URL}/api/pharmacy/inventory/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_products" in data
        assert "low_stock_count" in data
        assert "expiring_soon_count" in data
        assert "expired_count" in data
        assert "total_inventory_value" in data
        print(f"✓ Inventory stats: {data}")
    
    def test_add_inventory_product_medical(self, pharmacy_client):
        """Add a new medical product to inventory with product_type and expiry_date"""
        product_data = {
            "name": f"{TEST_PREFIX}Doliprane 500mg",
            "reference": f"{TEST_PREFIX}DOL-500-{uuid.uuid4().hex[:6]}",
            "dci": "Paracétamol",
            "category": "Antalgique",
            "product_type": "medical",
            "expiry_date": "2027-06-15",
            "purchase_price": 200.00,
            "selling_price": 250.00,
            "stock_quantity": 100,
            "min_stock_alert": 20,
            "supplier_name": "Pharma Plus Distribution"
        }
        
        response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert response.status_code == 200
        data = response.json()
        
        # Verify returned data
        assert data["name"] == product_data["name"]
        assert data["product_type"] == "medical"
        assert data["expiry_date"] == "2027-06-15"
        assert data["purchase_price"] == 200.00
        assert data["selling_price"] == 250.00
        assert "id" in data
        
        print(f"✓ Added medical product: {data['name']} (ID: {data['id']})")
        return data["id"]
    
    def test_add_inventory_product_paramedical(self, pharmacy_client):
        """Add a paramedical product to inventory"""
        product_data = {
            "name": f"{TEST_PREFIX}Bandage Élastique 10cm",
            "reference": f"{TEST_PREFIX}BAND-10-{uuid.uuid4().hex[:6]}",
            "category": "Pansements",
            "product_type": "paramedical",
            "expiry_date": "2028-12-31",
            "purchase_price": 150.00,
            "selling_price": 200.00,
            "stock_quantity": 50,
            "min_stock_alert": 10
        }
        
        response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert response.status_code == 200
        data = response.json()
        
        assert data["product_type"] == "paramedical"
        print(f"✓ Added paramedical product: {data['name']}")
        return data["id"]
    
    def test_add_inventory_product_other(self, pharmacy_client):
        """Add a product of type 'other' to inventory"""
        product_data = {
            "name": f"{TEST_PREFIX}Gel Désinfectant 500ml",
            "reference": f"{TEST_PREFIX}GEL-500-{uuid.uuid4().hex[:6]}",
            "category": "Hygiène",
            "product_type": "other",
            "purchase_price": 300.00,
            "selling_price": 400.00,
            "stock_quantity": 30,
            "min_stock_alert": 5
        }
        
        response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert response.status_code == 200
        data = response.json()
        
        assert data["product_type"] == "other"
        print(f"✓ Added 'other' type product: {data['name']}")
        return data["id"]
    
    def test_edit_inventory_product(self, pharmacy_client):
        """Edit an existing inventory product"""
        # First add a product
        product_data = {
            "name": f"{TEST_PREFIX}Edit Test Product",
            "reference": f"{TEST_PREFIX}EDIT-{uuid.uuid4().hex[:6]}",
            "product_type": "medical",
            "purchase_price": 100.00,
            "selling_price": 150.00,
            "stock_quantity": 20
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        
        # Now edit the product
        update_data = {
            "name": f"{TEST_PREFIX}Edit Test Product UPDATED",
            "selling_price": 180.00,
            "product_type": "paramedical",
            "expiry_date": "2027-01-01"
        }
        
        update_response = pharmacy_client.put(f"{BASE_URL}/api/pharmacy/inventory/{product_id}", json=update_data)
        assert update_response.status_code == 200
        updated = update_response.json()
        
        assert "UPDATED" in updated["name"]
        assert updated["selling_price"] == 180.00
        assert updated["product_type"] == "paramedical"
        assert updated["expiry_date"] == "2027-01-01"
        
        print(f"✓ Successfully edited product: {updated['name']}")
        return product_id
    
    def test_delete_inventory_product(self, pharmacy_client):
        """Delete an inventory product"""
        # First add a product to delete
        product_data = {
            "name": f"{TEST_PREFIX}Delete Test Product",
            "reference": f"{TEST_PREFIX}DEL-{uuid.uuid4().hex[:6]}",
            "product_type": "other",
            "purchase_price": 50.00,
            "selling_price": 75.00,
            "stock_quantity": 5
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        
        # Delete the product
        delete_response = pharmacy_client.delete(f"{BASE_URL}/api/pharmacy/inventory/{product_id}")
        assert delete_response.status_code == 200
        
        # Verify it's deleted - try to access again
        get_response = pharmacy_client.get(f"{BASE_URL}/api/pharmacy/inventory")
        assert get_response.status_code == 200
        products = get_response.json()
        deleted_found = any(p["id"] == product_id for p in products)
        assert not deleted_found, "Product should be deleted"
        
        print(f"✓ Successfully deleted product ID: {product_id}")


class TestStockMovement:
    """Test stock movement operations (in/out/adjustment)"""
    
    def test_stock_movement_in(self, pharmacy_client):
        """Test stock IN movement"""
        # First create a product
        product_data = {
            "name": f"{TEST_PREFIX}Stock IN Test",
            "reference": f"{TEST_PREFIX}STIN-{uuid.uuid4().hex[:6]}",
            "product_type": "medical",
            "purchase_price": 100.00,
            "selling_price": 150.00,
            "stock_quantity": 10
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        initial_stock = create_response.json()["stock_quantity"]
        
        # Record stock IN movement
        movement_data = {
            "product_id": product_id,
            "movement_type": "in",
            "quantity": 25,
            "reason": "Réception commande fournisseur"
        }
        
        movement_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory/stock-movement", json=movement_data)
        assert movement_response.status_code == 200
        result = movement_response.json()
        
        expected_stock = initial_stock + 25
        assert result["new_stock"] == expected_stock, f"Expected {expected_stock}, got {result['new_stock']}"
        
        print(f"✓ Stock IN successful: {initial_stock} + 25 = {result['new_stock']}")
        return product_id
    
    def test_stock_movement_out(self, pharmacy_client):
        """Test stock OUT movement"""
        # First create a product with sufficient stock
        product_data = {
            "name": f"{TEST_PREFIX}Stock OUT Test",
            "reference": f"{TEST_PREFIX}STOUT-{uuid.uuid4().hex[:6]}",
            "product_type": "medical",
            "purchase_price": 100.00,
            "selling_price": 150.00,
            "stock_quantity": 50
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        
        # Record stock OUT movement
        movement_data = {
            "product_id": product_id,
            "movement_type": "out",
            "quantity": 15,
            "reason": "Vente"
        }
        
        movement_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory/stock-movement", json=movement_data)
        assert movement_response.status_code == 200
        result = movement_response.json()
        
        assert result["new_stock"] == 35, f"Expected 35, got {result['new_stock']}"
        
        print(f"✓ Stock OUT successful: 50 - 15 = {result['new_stock']}")
    
    def test_stock_movement_adjustment(self, pharmacy_client):
        """Test stock ADJUSTMENT movement"""
        # First create a product
        product_data = {
            "name": f"{TEST_PREFIX}Stock Adjust Test",
            "reference": f"{TEST_PREFIX}STADJ-{uuid.uuid4().hex[:6]}",
            "product_type": "medical",
            "purchase_price": 100.00,
            "selling_price": 150.00,
            "stock_quantity": 30
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        
        # Record stock ADJUSTMENT movement
        movement_data = {
            "product_id": product_id,
            "movement_type": "adjustment",
            "quantity": 42,
            "reason": "Inventaire physique"
        }
        
        movement_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory/stock-movement", json=movement_data)
        assert movement_response.status_code == 200
        result = movement_response.json()
        
        # Adjustment sets stock to exact value
        assert result["new_stock"] == 42, f"Expected 42, got {result['new_stock']}"
        
        print(f"✓ Stock ADJUSTMENT successful: set to {result['new_stock']}")
    
    def test_stock_movement_out_insufficient(self, pharmacy_client):
        """Test stock OUT with insufficient stock should fail"""
        # First create a product with low stock
        product_data = {
            "name": f"{TEST_PREFIX}Low Stock Test",
            "reference": f"{TEST_PREFIX}LOW-{uuid.uuid4().hex[:6]}",
            "product_type": "medical",
            "purchase_price": 100.00,
            "selling_price": 150.00,
            "stock_quantity": 5
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory", json=product_data)
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        
        # Try to remove more than available
        movement_data = {
            "product_id": product_id,
            "movement_type": "out",
            "quantity": 10,  # More than available
            "reason": "Test insufficient stock"
        }
        
        movement_response = pharmacy_client.post(f"{BASE_URL}/api/pharmacy/inventory/stock-movement", json=movement_data)
        assert movement_response.status_code == 400  # Should fail
        
        print("✓ Stock OUT correctly rejected when insufficient stock")


class TestSupplierProductTypes:
    """Test supplier products with product_type and expiry_date fields"""
    
    def test_add_supplier_product_with_type_and_expiry(self, supplier_client):
        """Add product with product_type and expiry_date as supplier"""
        product_data = {
            "name": f"{TEST_PREFIX}Supplier Product Medical",
            "reference": f"{TEST_PREFIX}SUP-MED-{uuid.uuid4().hex[:6]}",
            "dci": "Test DCI",
            "price": 500.00,
            "ug": 10,
            "product_type": "medical",
            "expiry_date": "2027-12-31",
            "category": "Test Category",
            "stock_quantity": 100
        }
        
        response = supplier_client.post(f"{BASE_URL}/api/products", json=product_data)
        assert response.status_code == 200
        data = response.json()
        
        assert data["product_type"] == "medical"
        assert data["expiry_date"] == "2027-12-31"
        
        print(f"✓ Supplier product added with type and expiry: {data['name']}")
        return data["id"]
    
    def test_add_supplier_product_paramedical(self, supplier_client):
        """Add paramedical product as supplier"""
        product_data = {
            "name": f"{TEST_PREFIX}Supplier Paramedical Product",
            "reference": f"{TEST_PREFIX}SUP-PARA-{uuid.uuid4().hex[:6]}",
            "dci": "N/A",
            "price": 300.00,
            "ug": 5,
            "product_type": "paramedical",
            "expiry_date": "2028-06-30",
            "category": "Medical Devices"
        }
        
        response = supplier_client.post(f"{BASE_URL}/api/products", json=product_data)
        assert response.status_code == 200
        data = response.json()
        
        assert data["product_type"] == "paramedical"
        print(f"✓ Paramedical supplier product added: {data['name']}")


class TestOrderPaymentMethod:
    """Test order creation with payment_method field"""
    
    def test_create_order_payment_on_delivery(self, pharmacy_client, get_supplier_and_product):
        """Create order with payment_on_delivery method"""
        supplier_id, product_id = get_supplier_and_product
        
        order_data = {
            "supplier_id": supplier_id,
            "items": [
                {"product_id": product_id, "quantity": 5}
            ],
            "payment_method": "payment_on_delivery",
            "notes": "Test order with payment on delivery"
        }
        
        response = pharmacy_client.post(f"{BASE_URL}/api/orders", json=order_data)
        assert response.status_code == 200
        data = response.json()
        
        assert data["payment_method"] == "payment_on_delivery"
        assert data["status"] == "pending"
        assert "order_number" in data
        
        print(f"✓ Order created with payment_on_delivery: {data['order_number']}")
        return data["id"]
    
    def test_update_order_status_to_confirmed(self, pharmacy_client, supplier_client, get_supplier_and_product):
        """Update order status from pending to confirmed"""
        supplier_id, product_id = get_supplier_and_product
        
        # Create an order
        order_data = {
            "supplier_id": supplier_id,
            "items": [{"product_id": product_id, "quantity": 2}],
            "payment_method": "payment_on_delivery"
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/orders", json=order_data)
        assert create_response.status_code == 200
        order_id = create_response.json()["id"]
        
        # Update status to confirmed (as supplier)
        status_update = {"status": "confirmed"}
        update_response = supplier_client.put(f"{BASE_URL}/api/orders/{order_id}/status", json=status_update)
        assert update_response.status_code == 200
        updated = update_response.json()
        
        assert updated["status"] == "confirmed"
        assert "confirmed_at" in updated
        
        print(f"✓ Order status updated to confirmed: {order_id}")
        return order_id
    
    def test_update_order_status_to_delivered(self, pharmacy_client, supplier_client, get_supplier_and_product):
        """Update order status from confirmed to delivered"""
        supplier_id, product_id = get_supplier_and_product
        
        # Create an order
        order_data = {
            "supplier_id": supplier_id,
            "items": [{"product_id": product_id, "quantity": 3}],
            "payment_method": "payment_on_delivery"
        }
        
        create_response = pharmacy_client.post(f"{BASE_URL}/api/orders", json=order_data)
        assert create_response.status_code == 200
        order_id = create_response.json()["id"]
        
        # Update to confirmed first
        supplier_client.put(f"{BASE_URL}/api/orders/{order_id}/status", json={"status": "confirmed"})
        
        # Update to delivered
        update_response = supplier_client.put(f"{BASE_URL}/api/orders/{order_id}/status", json={"status": "delivered"})
        assert update_response.status_code == 200
        updated = update_response.json()
        
        assert updated["status"] == "delivered"
        assert "delivered_at" in updated
        # Payment status should be paid when delivered (for payment on delivery)
        assert updated["payment_status"] == "paid"
        
        print(f"✓ Order status updated to delivered with payment_status=paid: {order_id}")


# ==========================================
# PYTEST FIXTURES
# ==========================================

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def pharmacy_token(api_client):
    """Get pharmacy authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "pharmacy1@madina.dz",
        "password": "pharmacy123"
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Pharmacy authentication failed")


@pytest.fixture
def supplier_token(api_client):
    """Get supplier authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "supplier1@pharmaplus.dz",
        "password": "supplier123"
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip("Supplier authentication failed")


@pytest.fixture
def pharmacy_client(api_client, pharmacy_token):
    """Session with pharmacy auth header"""
    api_client.headers.update({"Authorization": f"Bearer {pharmacy_token}"})
    return api_client


@pytest.fixture
def supplier_client(api_client, supplier_token):
    """Session with supplier auth header"""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {supplier_token}"
    })
    return session


@pytest.fixture
def get_supplier_and_product(api_client):
    """Get an existing supplier and product for order tests"""
    # Login as pharmacy to get products
    login_response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "pharmacy1@madina.dz",
        "password": "pharmacy123"
    })
    token = login_response.json()["token"]
    
    # Get products
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    products_response = requests.get(f"{BASE_URL}/api/products", headers=headers)
    products = products_response.json()
    
    if not products:
        pytest.skip("No products available for order test")
    
    # Return first product's supplier_id and product_id
    product = products[0]
    supplier_id = product.get("supplier", {}).get("id") or product.get("supplier_id")
    return supplier_id, product["id"]


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_data():
    """Cleanup test data after all tests complete"""
    yield
    # Cleanup logic would go here if needed
    print("\n✓ Test cleanup completed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
