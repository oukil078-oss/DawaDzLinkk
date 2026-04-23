"""
Test suite for DawaLink Document Upload and User Review Feature
Tests document upload, registration with documents, admin review, login rejection, re-registration
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://verify-email-reset.preview.emergentagent.com')

# Test credentials
ADMIN_EMAIL = "admin@dawalink.dz"
ADMIN_PASSWORD = "admin123456"


class TestDocumentUploadEndpoints:
    """Test document upload functionality"""
    
    def test_upload_temp_document(self):
        """Test POST /api/upload/temp-document with file + doc_type returns doc_id, stored_name"""
        url = f"{BASE_URL}/api/upload/temp-document"
        
        # Create a test file
        file_content = b"Test PDF content for document upload"
        files = {'file': ('test_document.pdf', file_content, 'application/pdf')}
        data = {'doc_type': 'Agrément de pharmacie'}
        
        response = requests.post(url, files=files, data=data)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        result = response.json()
        
        # Verify response has required fields
        assert 'doc_id' in result, "Response should contain doc_id"
        assert 'stored_name' in result, "Response should contain stored_name"
        assert 'file_name' in result, "Response should contain file_name"
        assert 'doc_type' in result, "Response should contain doc_type"
        
        assert result['doc_type'] == 'Agrément de pharmacie'
        assert result['file_name'] == 'test_document.pdf'
        
        print(f"✅ Document uploaded successfully: doc_id={result['doc_id']}")
        return result

    def test_upload_document_invalid_format(self):
        """Test that invalid file formats are rejected"""
        url = f"{BASE_URL}/api/upload/temp-document"
        
        file_content = b"Invalid file content"
        files = {'file': ('test_document.exe', file_content, 'application/octet-stream')}
        data = {'doc_type': 'Test Document'}
        
        response = requests.post(url, files=files, data=data)
        
        assert response.status_code == 400, f"Expected 400 for invalid format, got {response.status_code}"
        print("✅ Invalid file format correctly rejected")


class TestDocumentFileServing:
    """Test document file serving endpoint"""
    
    def test_serve_document_file(self):
        """Test GET /api/documents/file/{stored_name} returns the file"""
        # First upload a document
        upload_url = f"{BASE_URL}/api/upload/temp-document"
        file_content = b"Test PDF content for retrieval test"
        files = {'file': ('retrieval_test.pdf', file_content, 'application/pdf')}
        data = {'doc_type': 'Test Document'}
        
        upload_response = requests.post(upload_url, files=files, data=data)
        assert upload_response.status_code == 200
        stored_name = upload_response.json()['stored_name']
        
        # Now retrieve the document
        retrieve_url = f"{BASE_URL}/api/documents/file/{stored_name}"
        response = requests.get(retrieve_url)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert len(response.content) > 0, "File content should not be empty"
        print(f"✅ Document file retrieved successfully: {stored_name}")
    
    def test_serve_nonexistent_file(self):
        """Test 404 for non-existent file"""
        url = f"{BASE_URL}/api/documents/file/nonexistent_file_12345.pdf"
        response = requests.get(url)
        
        assert response.status_code == 404, f"Expected 404 for non-existent file, got {response.status_code}"
        print("✅ Non-existent file correctly returns 404")


class TestRegistrationWithDocuments:
    """Test registration endpoints with document_ids"""
    
    @pytest.fixture
    def uploaded_docs(self):
        """Upload test documents and return their IDs"""
        doc_ids = []
        doc_types = ['Agrément de pharmacie', 'Registre de Commerce', "Inscription à l'ordre des pharmaciens"]
        
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"Test content for {doc_type}".encode()
            files = {'file': (f'{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            doc_ids.append(response.json()['doc_id'])
        
        return doc_ids
    
    def test_register_pharmacy_with_documents(self, uploaded_docs):
        """Test POST /api/auth/register/pharmacy accepts document_ids array"""
        unique_id = str(uuid.uuid4())[:8]
        url = f"{BASE_URL}/api/auth/register/pharmacy"
        
        payload = {
            "email": f"test_pharmacy_{unique_id}@test.dz",
            "password": "testpassword123",
            "full_name": "Test Pharmacy",
            "phone": "0555123456",
            "pharmacy_name": f"Pharmacie Test {unique_id}",
            "registry_number": f"REG-PHARM-{unique_id}",
            "address": "123 Rue Test, Alger",
            "wilaya": "Alger",
            "document_ids": uploaded_docs
        }
        
        response = requests.post(url, json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        result = response.json()
        
        assert 'message' in result, "Response should contain message"
        assert 'user_id' in result, "Response should contain user_id"
        print(f"✅ Pharmacy registered with documents: user_id={result['user_id']}")
        
        return result['user_id'], payload['email']
    
    def test_register_supplier_with_documents(self):
        """Test POST /api/auth/register/supplier accepts document_ids array"""
        # Upload supplier docs
        doc_ids = []
        doc_types = ['Registre de commerce', "Autorisation d'exploitation", 'Certificat fiscal']
        
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"Test content for {doc_type}".encode()
            files = {'file': (f'{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            doc_ids.append(response.json()['doc_id'])
        
        unique_id = str(uuid.uuid4())[:8]
        url = f"{BASE_URL}/api/auth/register/supplier"
        
        payload = {
            "email": f"test_supplier_{unique_id}@test.dz",
            "password": "testpassword123",
            "full_name": "Test Supplier",
            "phone": "0555789012",
            "company_name": f"Supplier Test {unique_id}",
            "registry_number": f"REG-SUPP-{unique_id}",
            "address": "456 Rue Test, Oran",
            "wilaya": "Oran",
            "document_ids": doc_ids
        }
        
        response = requests.post(url, json=payload)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        result = response.json()
        
        assert 'message' in result
        assert 'user_id' in result
        print(f"✅ Supplier registered with documents: user_id={result['user_id']}")


class TestAdminPendingUsers:
    """Test admin pending users endpoint"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        url = f"{BASE_URL}/api/auth/login"
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        response = requests.post(url, json=payload)
        
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json()['token']
    
    def test_get_pending_users_with_documents(self, admin_token):
        """Test GET /api/admin/users/pending - each user includes 'documents' array"""
        url = f"{BASE_URL}/api/admin/users/pending"
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = requests.get(url, headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        users = response.json()
        
        assert isinstance(users, list), "Response should be a list"
        
        # Check structure of users
        for user in users:
            assert 'id' in user, "User should have id"
            assert 'email' in user, "User should have email"
            assert 'documents' in user, "User should have documents array"
            assert isinstance(user['documents'], list), "Documents should be a list"
            
            # If user has documents, check structure
            for doc in user.get('documents', []):
                assert 'doc_type' in doc, "Document should have doc_type"
                assert 'file_name' in doc, "Document should have file_name"
                assert 'stored_name' in doc, "Document should have stored_name"
                assert 'status' in doc, "Document should have status"
        
        print(f"✅ Got {len(users)} pending users with documents structure verified")


class TestAdminReviewUser:
    """Test admin user review functionality"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        url = f"{BASE_URL}/api/auth/login"
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        response = requests.post(url, json=payload)
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json()['token']
    
    @pytest.fixture
    def test_user_for_review(self, admin_token):
        """Create a test user for review testing"""
        # First upload documents
        doc_ids = []
        doc_types = ['Agrément de pharmacie', 'Registre de Commerce', "Inscription à l'ordre des pharmaciens"]
        
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"Test content for review test - {doc_type}".encode()
            files = {'file': (f'{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            doc_ids.append(response.json()['doc_id'])
        
        # Register user
        unique_id = str(uuid.uuid4())[:8]
        url = f"{BASE_URL}/api/auth/register/pharmacy"
        
        payload = {
            "email": f"test_review_{unique_id}@test.dz",
            "password": "testpassword123",
            "full_name": "Test Review User",
            "phone": "0555999888",
            "pharmacy_name": f"Pharmacie Review Test {unique_id}",
            "registry_number": f"REG-REVIEW-{unique_id}",
            "address": "789 Rue Test, Constantine",
            "wilaya": "Constantine",
            "document_ids": doc_ids
        }
        
        response = requests.post(url, json=payload)
        assert response.status_code == 200
        
        return response.json()['user_id'], payload['email'], doc_ids
    
    def test_approve_user(self, admin_token, test_user_for_review):
        """Test PUT /api/admin/users/{user_id}/review with decision: approved"""
        user_id, email, _ = test_user_for_review
        
        url = f"{BASE_URL}/api/admin/users/{user_id}/review"
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {"decision": "approved"}
        
        response = requests.put(url, json=payload, headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        result = response.json()
        assert 'message' in result
        
        # Verify user can now login
        login_url = f"{BASE_URL}/api/auth/login"
        login_response = requests.post(login_url, json={"email": email, "password": "testpassword123"})
        assert login_response.status_code == 200, "Approved user should be able to login"
        
        print(f"✅ User approved successfully and can login")
    
    def test_reject_user_with_reason(self, admin_token):
        """Test PUT /api/admin/users/{user_id}/review with rejection_reason and rejected_documents"""
        # Create a new user for rejection test
        doc_ids = []
        doc_types = ['Agrément de pharmacie', 'Registre de Commerce', "Inscription à l'ordre des pharmaciens"]
        
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"Test content for rejection test - {doc_type}".encode()
            files = {'file': (f'{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            doc_ids.append(response.json()['doc_id'])
        
        unique_id = str(uuid.uuid4())[:8]
        reg_url = f"{BASE_URL}/api/auth/register/pharmacy"
        
        payload = {
            "email": f"test_reject_{unique_id}@test.dz",
            "password": "testpassword123",
            "full_name": "Test Reject User",
            "phone": "0555777666",
            "pharmacy_name": f"Pharmacie Reject Test {unique_id}",
            "registry_number": f"REG-REJECT-{unique_id}",
            "address": "111 Rue Test, Blida",
            "wilaya": "Blida",
            "document_ids": doc_ids
        }
        
        reg_response = requests.post(reg_url, json=payload)
        assert reg_response.status_code == 200
        user_id = reg_response.json()['user_id']
        
        # Now reject the user
        url = f"{BASE_URL}/api/admin/users/{user_id}/review"
        headers = {"Authorization": f"Bearer {admin_token}"}
        reject_payload = {
            "decision": "rejected",
            "rejection_reason": "Document illisible - photo floue",
            "rejected_documents": ["Agrément de pharmacie"]
        }
        
        response = requests.put(url, json=reject_payload, headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        print(f"✅ User rejected with reason and rejected documents")
        
        return payload['email']


class TestRejectedUserLogin:
    """Test login behavior for rejected users"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        url = f"{BASE_URL}/api/auth/login"
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        response = requests.post(url, json=payload)
        assert response.status_code == 200
        return response.json()['token']
    
    def test_rejected_user_login_returns_403_with_info(self, admin_token):
        """Test that rejected user login returns 403 with rejection_info"""
        # Create and reject a user
        doc_ids = []
        doc_types = ['Agrément de pharmacie', 'Registre de Commerce', "Inscription à l'ordre des pharmaciens"]
        
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"Test content for login test - {doc_type}".encode()
            files = {'file': (f'{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            doc_ids.append(response.json()['doc_id'])
        
        unique_id = str(uuid.uuid4())[:8]
        test_email = f"test_loginreject_{unique_id}@test.dz"
        reg_url = f"{BASE_URL}/api/auth/register/pharmacy"
        
        payload = {
            "email": test_email,
            "password": "testpassword123",
            "full_name": "Test Login Reject User",
            "phone": "0555333222",
            "pharmacy_name": f"Pharmacie Login Reject {unique_id}",
            "registry_number": f"REG-LOGINREJ-{unique_id}",
            "address": "222 Rue Test, Setif",
            "wilaya": "Setif",
            "document_ids": doc_ids
        }
        
        reg_response = requests.post(reg_url, json=payload)
        assert reg_response.status_code == 200
        user_id = reg_response.json()['user_id']
        
        # Reject the user
        reject_url = f"{BASE_URL}/api/admin/users/{user_id}/review"
        headers = {"Authorization": f"Bearer {admin_token}"}
        reject_payload = {
            "decision": "rejected",
            "rejection_reason": "Registre de commerce expiré",
            "rejected_documents": ["Registre de Commerce"]
        }
        
        reject_response = requests.put(reject_url, json=reject_payload, headers=headers)
        assert reject_response.status_code == 200
        
        # Try to login with rejected user
        login_url = f"{BASE_URL}/api/auth/login"
        login_response = requests.post(login_url, json={"email": test_email, "password": "testpassword123"})
        
        assert login_response.status_code == 403, f"Expected 403 for rejected user, got {login_response.status_code}"
        
        error_data = login_response.json()
        detail = error_data.get('detail', {})
        
        assert detail.get('type') == 'account_rejected', "Should have type 'account_rejected'"
        assert 'rejection_info' in detail, "Should contain rejection_info"
        
        rejection_info = detail['rejection_info']
        assert 'rejection_reason' in rejection_info, "Should have rejection_reason"
        assert 'rejected_documents' in rejection_info, "Should have rejected_documents"
        assert 'reviewed_at' in rejection_info, "Should have reviewed_at"
        
        print(f"✅ Rejected user login returns 403 with proper rejection info: {rejection_info['rejection_reason']}")
        
        return test_email


class TestReRegistration:
    """Test re-registration after rejection"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        url = f"{BASE_URL}/api/auth/login"
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        response = requests.post(url, json=payload)
        assert response.status_code == 200
        return response.json()['token']
    
    def test_reregister_rejected_user(self, admin_token):
        """Test that re-registration with same email after rejection works"""
        # Create and reject a user
        doc_ids = []
        doc_types = ['Agrément de pharmacie', 'Registre de Commerce', "Inscription à l'ordre des pharmaciens"]
        
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"Test content for re-reg - {doc_type}".encode()
            files = {'file': (f'{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            doc_ids.append(response.json()['doc_id'])
        
        unique_id = str(uuid.uuid4())[:8]
        test_email = f"test_rereg_{unique_id}@test.dz"
        reg_url = f"{BASE_URL}/api/auth/register/pharmacy"
        
        payload = {
            "email": test_email,
            "password": "testpassword123",
            "full_name": "Test Re-Reg User",
            "phone": "0555444333",
            "pharmacy_name": f"Pharmacie Re-Reg {unique_id}",
            "registry_number": f"REG-REREG-{unique_id}",
            "address": "333 Rue Test, Annaba",
            "wilaya": "Annaba",
            "document_ids": doc_ids
        }
        
        reg_response = requests.post(reg_url, json=payload)
        assert reg_response.status_code == 200
        user_id = reg_response.json()['user_id']
        
        # Reject the user
        reject_url = f"{BASE_URL}/api/admin/users/{user_id}/review"
        headers = {"Authorization": f"Bearer {admin_token}"}
        reject_payload = {
            "decision": "rejected",
            "rejection_reason": "Documents non conformes",
            "rejected_documents": ["Agrément de pharmacie"]
        }
        
        reject_response = requests.put(reject_url, json=reject_payload, headers=headers)
        assert reject_response.status_code == 200
        
        # Now re-register with the same email
        new_doc_ids = []
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"NEW Test content for re-reg - {doc_type}".encode()
            files = {'file': (f'NEW_{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            new_doc_ids.append(response.json()['doc_id'])
        
        rereg_payload = {
            "email": test_email,  # Same email
            "password": "newpassword456",
            "full_name": "Test Re-Reg User Updated",
            "phone": "0555444333",
            "pharmacy_name": f"Pharmacie Re-Reg Updated {unique_id}",
            "registry_number": f"REG-REREG-NEW-{unique_id}",
            "address": "333 Rue Test Updated, Annaba",
            "wilaya": "Annaba",
            "document_ids": new_doc_ids
        }
        
        rereg_response = requests.post(reg_url, json=rereg_payload)
        
        assert rereg_response.status_code == 200, f"Re-registration should succeed, got {rereg_response.status_code}: {rereg_response.text}"
        new_user_id = rereg_response.json()['user_id']
        
        assert new_user_id != user_id, "New user ID should be different from rejected user ID"
        
        print(f"✅ Re-registration successful: old_id={user_id}, new_id={new_user_id}")


class TestAdminGetUserDocuments:
    """Test admin endpoint to get user documents"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin auth token"""
        url = f"{BASE_URL}/api/auth/login"
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        response = requests.post(url, json=payload)
        assert response.status_code == 200
        return response.json()['token']
    
    def test_get_user_documents(self, admin_token):
        """Test GET /api/admin/users/{user_id}/documents returns user's documents"""
        # First create a user with documents
        doc_ids = []
        doc_types = ['Agrément de pharmacie', 'Registre de Commerce', "Inscription à l'ordre des pharmaciens"]
        
        for doc_type in doc_types:
            url = f"{BASE_URL}/api/upload/temp-document"
            file_content = f"Test content for get docs - {doc_type}".encode()
            files = {'file': (f'{doc_type.replace(" ", "_")}.pdf', file_content, 'application/pdf')}
            data = {'doc_type': doc_type}
            
            response = requests.post(url, files=files, data=data)
            assert response.status_code == 200
            doc_ids.append(response.json()['doc_id'])
        
        unique_id = str(uuid.uuid4())[:8]
        reg_url = f"{BASE_URL}/api/auth/register/pharmacy"
        
        payload = {
            "email": f"test_getdocs_{unique_id}@test.dz",
            "password": "testpassword123",
            "full_name": "Test Get Docs User",
            "phone": "0555111999",
            "pharmacy_name": f"Pharmacie Get Docs {unique_id}",
            "registry_number": f"REG-GETDOCS-{unique_id}",
            "address": "444 Rue Test, Tlemcen",
            "wilaya": "Tlemcen",
            "document_ids": doc_ids
        }
        
        reg_response = requests.post(reg_url, json=payload)
        assert reg_response.status_code == 200
        user_id = reg_response.json()['user_id']
        
        # Get user documents
        url = f"{BASE_URL}/api/admin/users/{user_id}/documents"
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = requests.get(url, headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        docs = response.json()
        
        assert isinstance(docs, list), "Response should be a list"
        assert len(docs) == 3, f"Expected 3 documents, got {len(docs)}"
        
        for doc in docs:
            assert 'doc_type' in doc
            assert 'file_name' in doc
            assert 'stored_name' in doc
            assert 'status' in doc
        
        print(f"✅ Retrieved {len(docs)} documents for user {user_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
