#!/usr/bin/env python3
"""
DawaLink Backend API Testing Suite
Tests all authentication flows, admin operations, and core functionality
"""

import requests
import sys
import json
from datetime import datetime

class DawaLinkAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.tokens = {}
        self.user_data = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def run_test(self, name, method, endpoint, expected_status, data=None, token=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
        
        self.tests_run += 1
        self.log(f"Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    self.log(f"   Error: {error_detail}")
                except:
                    self.log(f"   Response: {response.text}")
                
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "endpoint": endpoint
                })
                return False, {}
                
        except Exception as e:
            self.log(f"❌ {name} - Exception: {str(e)}", "ERROR")
            self.failed_tests.append({
                "test": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}
    
    def test_health_check(self):
        """Test basic health check"""
        return self.run_test("Health Check", "GET", "api/health", 200)
    
    def test_seed_database(self):
        """Seed database with test data"""
        return self.run_test("Seed Database", "POST", "api/seed", 200)
    
    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST", 
            "api/auth/login",
            200,
            data={"email": "admin@dawalink.dz", "password": "admin123456"}
        )
        
        if success and 'token' in response:
            self.tokens['admin'] = response['token']
            self.user_data['admin'] = response['user']
            self.log("✅ Admin token stored successfully")
            return True
        return False
    
    def test_supplier_login(self):
        """Test supplier login"""
        success, response = self.run_test(
            "Supplier Login",
            "POST",
            "api/auth/login", 
            200,
            data={"email": "supplier1@pharmaplus.dz", "password": "supplier123"}
        )
        
        if success and 'token' in response:
            self.tokens['supplier'] = response['token']
            self.user_data['supplier'] = response['user']
            self.log("✅ Supplier token stored successfully")
            return True
        return False
    
    def test_pharmacy_login(self):
        """Test pharmacy login"""
        success, response = self.run_test(
            "Pharmacy Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": "pharmacy1@madina.dz", "password": "pharmacy123"}
        )
        
        if success and 'token' in response:
            self.tokens['pharmacy'] = response['token']
            self.user_data['pharmacy'] = response['user']
            self.log("✅ Pharmacy token stored successfully")
            return True
        return False
    
    def test_admin_endpoints(self):
        """Test admin-specific endpoints"""
        if 'admin' not in self.tokens:
            self.log("❌ Admin token not available, skipping admin tests", "ERROR")
            return False
        
        admin_token = self.tokens['admin']
        
        # Test admin stats
        self.run_test("Admin Stats", "GET", "api/admin/stats", 200, token=admin_token)
        
        # Test get all users
        self.run_test("Get All Users", "GET", "api/admin/users", 200, token=admin_token)
        
        # Test get pending users
        self.run_test("Get Pending Users", "GET", "api/admin/users/pending", 200, token=admin_token)
        
        # Test get all pharmacies
        self.run_test("Get All Pharmacies", "GET", "api/admin/pharmacies", 200, token=admin_token)
        
        # Test get all suppliers
        self.run_test("Get All Suppliers", "GET", "api/admin/suppliers", 200, token=admin_token)
        
        return True
    
    def test_supplier_endpoints(self):
        """Test supplier-specific endpoints"""
        if 'supplier' not in self.tokens:
            self.log("❌ Supplier token not available, skipping supplier tests", "ERROR")
            return False
        
        supplier_token = self.tokens['supplier']
        
        # Test supplier stats
        self.run_test("Supplier Stats", "GET", "api/supplier/stats", 200, token=supplier_token)
        
        # Test get supplier products
        self.run_test("Get Supplier Products", "GET", "api/supplier/products", 200, token=supplier_token)
        
        # Test get supplier orders
        self.run_test("Get Supplier Orders", "GET", "api/supplier/orders", 200, token=supplier_token)
        
        # Test get supplier reviews
        self.run_test("Get Supplier Reviews", "GET", "api/supplier/reviews", 200, token=supplier_token)
        
        # Test get my agents
        self.run_test("Get My Agents", "GET", "api/agents/my", 200, token=supplier_token)
        
        return True
    
    def test_pharmacy_endpoints(self):
        """Test pharmacy-specific endpoints"""
        if 'pharmacy' not in self.tokens:
            self.log("❌ Pharmacy token not available, skipping pharmacy tests", "ERROR")
            return False
        
        pharmacy_token = self.tokens['pharmacy']
        
        # Test get products (search functionality)
        self.run_test("Get All Products", "GET", "api/products", 200, token=pharmacy_token)
        
        # Test search products
        self.run_test("Search Products", "GET", "api/products", 200, 
                     token=pharmacy_token, params={"search": "Doliprane"})
        
        # Test get suppliers
        self.run_test("Get Suppliers", "GET", "api/suppliers", 200, token=pharmacy_token)
        
        # Test get cart
        self.run_test("Get Cart", "GET", "api/cart", 200, token=pharmacy_token)
        
        # Test get orders
        self.run_test("Get Orders", "GET", "api/orders", 200, token=pharmacy_token)
        
        return True
    
    def test_public_endpoints(self):
        """Test endpoints that don't require authentication"""
        # Test invalid login
        self.run_test(
            "Invalid Login",
            "POST",
            "api/auth/login",
            401,
            data={"email": "invalid@test.com", "password": "wrongpass"}
        )
        
        return True
    
    def test_auth_me_endpoints(self):
        """Test /me endpoints for all user types"""
        for user_type, token in self.tokens.items():
            self.run_test(f"Get Me ({user_type})", "GET", "api/auth/me", 200, token=token)
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log("🚀 Starting DawaLink API Tests", "INFO")
        self.log("=" * 50)
        
        # Basic connectivity
        if not self.test_health_check()[0]:
            self.log("❌ Health check failed, aborting tests", "ERROR")
            return False
        
        # Seed database
        self.test_seed_database()
        
        # Authentication tests
        self.log("\n📝 Testing Authentication...")
        self.test_admin_login()
        self.test_supplier_login() 
        self.test_pharmacy_login()
        
        # Test /me endpoints
        self.log("\n👤 Testing User Profile Endpoints...")
        self.test_auth_me_endpoints()
        
        # Role-specific tests
        self.log("\n🔐 Testing Admin Endpoints...")
        self.test_admin_endpoints()
        
        self.log("\n🏭 Testing Supplier Endpoints...")
        self.test_supplier_endpoints()
        
        self.log("\n🏥 Testing Pharmacy Endpoints...")
        self.test_pharmacy_endpoints()
        
        # Public endpoints
        self.log("\n🌐 Testing Public Endpoints...")
        self.test_public_endpoints()
        
        # Print summary
        self.print_summary()
        
        return self.tests_passed == self.tests_run
    
    def print_summary(self):
        """Print test summary"""
        self.log("\n" + "=" * 50)
        self.log("📊 TEST SUMMARY")
        self.log("=" * 50)
        self.log(f"Total Tests: {self.tests_run}")
        self.log(f"Passed: {self.tests_passed}")
        self.log(f"Failed: {len(self.failed_tests)}")
        self.log(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            self.log("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
                self.log(f"  - {test['test']}: {error_msg}")
        
        self.log("\n🔑 TEST CREDENTIALS USED:")
        self.log("  Admin: admin@dawalink.dz / admin123456")
        self.log("  Supplier: supplier1@pharmaplus.dz / supplier123")
        self.log("  Pharmacy: pharmacy1@madina.dz / pharmacy123")

def main():
    tester = DawaLinkAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())