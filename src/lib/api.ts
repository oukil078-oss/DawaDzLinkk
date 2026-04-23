// Use relative URL for API calls - the ingress routes /api to the backend
const API_URL = '';

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Une erreur est survenue' }));
    const detail = error.detail || error.message || 'Une erreur est survenue';
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }

  return response.json();
}

// ==========================================
// AUTH API
// ==========================================

export const authApi = {
  async registerPharmacy(data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    pharmacy_name: string;
    registry_number: string;
    address: string;
    wilaya: string;
    document_ids?: string[];
  }) {
    return fetchApi<{ message: string; user_id?: string }>('/api/auth/register/pharmacy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async registerSupplier(data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    company_name: string;
    registry_number: string;
    address: string;
    wilaya: string;
    document_ids?: string[];
  }) {
    return fetchApi<{ message: string; user_id?: string }>('/api/auth/register/supplier', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(email: string, password: string) {
    const data = await fetchApi<{ token: string; user: any; details: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.details) {
      localStorage.setItem('userDetails', JSON.stringify(data.details));
    }
    
    return data;
  },

  async getMe() {
    return fetchApi<{ user: any; details: any }>('/api/auth/me');
  },

  async updateProfile(data: { full_name?: string; phone?: string }) {
    return fetchApi<any>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async forgotPassword(email: string) {
    return fetchApi<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyResetCode(email: string, code: string) {
    return fetchApi<{ reset_token: string; message: string }>('/api/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async resetPassword(resetToken: string, newPassword: string) {
    return fetchApi<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ reset_token: resetToken, new_password: newPassword }),
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userDetails');
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    const details = localStorage.getItem('userDetails');
    return {
      user: user ? JSON.parse(user) : null,
      details: details ? JSON.parse(details) : null,
    };
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  },
};

// ==========================================
// ADMIN API
// ==========================================

export const adminApi = {
  async getStats() {
    return fetchApi<any>('/api/admin/stats');
  },

  async getAllUsers() {
    return fetchApi<any[]>('/api/admin/users');
  },

  async getPendingUsers() {
    return fetchApi<any[]>('/api/admin/users/pending');
  },

  async getAllPharmacies() {
    return fetchApi<any[]>('/api/admin/pharmacies');
  },

  async getAllSuppliers() {
    return fetchApi<any[]>('/api/admin/suppliers');
  },

  async getUserDetails(userId: string) {
    return fetchApi<any>(`/api/admin/users/${userId}`);
  },

  async getUserDocuments(userId: string) {
    return fetchApi<any[]>(`/api/admin/users/${userId}/documents`);
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'rejected') {
    return fetchApi<{ message: string }>(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async reviewUser(userId: string, decision: 'approved' | 'rejected', rejectionReason?: string, rejectedDocuments?: string[]) {
    return fetchApi<{ message: string }>(`/api/admin/users/${userId}/review`, {
      method: 'PUT',
      body: JSON.stringify({
        decision,
        rejection_reason: rejectionReason,
        rejected_documents: rejectedDocuments,
      }),
    });
  },

  async approveUser(userId: string) {
    return this.reviewUser(userId, 'approved');
  },

  async rejectUser(userId: string, reason?: string, rejectedDocuments?: string[]) {
    return this.reviewUser(userId, 'rejected', reason, rejectedDocuments);
  },

  async suspendUser(userId: string) {
    return this.updateUserStatus(userId, 'suspended');
  },

  async deleteUser(userId: string) {
    return fetchApi<{ message: string }>(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  async changeAdminPassword(currentPassword: string, newPassword: string) {
    return fetchApi<{ message: string }>('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  async requestEmailChange(newEmail: string) {
    return fetchApi<{ message: string }>('/api/admin/request-email-change', {
      method: 'POST',
      body: JSON.stringify({ new_email: newEmail }),
    });
  },

  async confirmEmailChange(code: string) {
    return fetchApi<{ message: string }>('/api/admin/confirm-email-change', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  async getAllOrders() {
    return fetchApi<any[]>('/api/admin/orders');
  },

  async getAllDocuments() {
    return fetchApi<any[]>('/api/admin/documents');
  },

  async updateDocumentStatus(docId: string, status: 'approved' | 'rejected', rejectionReason?: string) {
    const params = new URLSearchParams({ status });
    if (rejectionReason) params.append('rejection_reason', rejectionReason);
    return fetchApi<{ message: string }>(`/api/admin/documents/${docId}/status?${params}`, {
      method: 'PUT',
    });
  },

  async listAdmins() {
    return fetchApi<any[]>('/api/admin/admins');
  },

  async createAdmin(data: { email: string; password: string; full_name: string; phone?: string }) {
    return fetchApi<{ message: string; admin_id: string }>('/api/admin/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdmin(adminId: string, data: { full_name?: string; phone?: string; password?: string }) {
    return fetchApi<{ message: string }>(`/api/admin/admins/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAdmin(adminId: string) {
    return fetchApi<{ message: string }>(`/api/admin/admins/${adminId}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// PRODUCTS API
// ==========================================

export const productsApi = {
  async getAll(params?: {
    search?: string;
    supplier_id?: string;
    available?: boolean;
    category?: string;
    min_price?: number;
    max_price?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.supplier_id) searchParams.append('supplier_id', params.supplier_id);
    if (params?.available !== undefined) searchParams.append('available', String(params.available));
    if (params?.category) searchParams.append('category', params.category);
    if (params?.min_price !== undefined) searchParams.append('min_price', String(params.min_price));
    if (params?.max_price !== undefined) searchParams.append('max_price', String(params.max_price));
    
    const query = searchParams.toString();
    return fetchApi<any[]>(`/api/products${query ? `?${query}` : ''}`);
  },

  async getById(id: string) {
    return fetchApi<any>(`/api/products/${id}`);
  },

  async create(data: {
    name: string;
    reference: string;
    dci: string;
    description?: string;
    category?: string;
    product_type?: 'medical' | 'paramedical' | 'other';
    expiry_date?: string | null;
    price: number;
    ug?: number;
    stock_quantity?: number;
    min_order_quantity?: number;
    available?: boolean;
  }) {
    return fetchApi<any>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<{
    name: string;
    reference: string;
    dci: string;
    description: string;
    category: string;
    product_type: 'medical' | 'paramedical' | 'other';
    expiry_date: string | null;
    price: number;
    ug: number;
    stock_quantity: number;
    min_order_quantity: number;
    available: boolean;
  }>) {
    return fetchApi<any>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchApi<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  async getSupplierProducts() {
    return fetchApi<any[]>('/api/supplier/products');
  },
};

// ==========================================
// AGENTS API
// ==========================================

export const agentsApi = {
  async getAll(supplierId?: string) {
    const query = supplierId ? `?supplier_id=${supplierId}` : '';
    return fetchApi<any[]>(`/api/agents${query}`);
  },

  async getMy() {
    return fetchApi<any[]>('/api/agents/my');
  },

  async create(data: {
    name: string;
    phone: string;
    email: string;
    whatsapp?: string;
    facebook?: string;
    linkedin?: string;
    region: string;
  }) {
    return fetchApi<any>('/api/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<{
    name: string;
    phone: string;
    email: string;
    whatsapp: string;
    facebook: string;
    linkedin: string;
    region: string;
    is_active: boolean;
  }>) {
    return fetchApi<any>(`/api/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchApi<{ message: string }>(`/api/agents/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// ORDERS API
// ==========================================

export const ordersApi = {
  async getAll() {
    return fetchApi<any[]>('/api/orders');
  },

  async getById(id: string) {
    return fetchApi<any>(`/api/orders/${id}`);
  },

  async create(data: {
    supplier_id: string;
    items: Array<{ product_id: string; quantity: number }>;
    notes?: string;
    payment_method?: 'payment_on_delivery' | 'baridimob' | 'ccp';
    delivery_address?: string;
  }) {
    return fetchApi<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, status: string, cancellationReason?: string) {
    return fetchApi<any>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, cancellation_reason: cancellationReason }),
    });
  },
};

// ==========================================
// CART API
// ==========================================

export const cartApi = {
  async get() {
    return fetchApi<any[]>('/api/cart');
  },

  async add(productId: string, quantity: number = 1) {
    return fetchApi<any>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  async update(itemId: string, quantity: number) {
    return fetchApi<any>(`/api/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  async remove(itemId: string) {
    return fetchApi<{ message: string }>(`/api/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  async clear() {
    return fetchApi<{ message: string }>('/api/cart', {
      method: 'DELETE',
    });
  },
};

// ==========================================
// REVIEWS API
// ==========================================

export const reviewsApi = {
  async getAll(supplierId?: string) {
    const query = supplierId ? `?supplier_id=${supplierId}` : '';
    return fetchApi<any[]>(`/api/reviews${query}`);
  },

  async create(data: {
    supplier_id: string;
    rating: number;
    title?: string;
    comment?: string;
    order_id?: string;
  }) {
    return fetchApi<any>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: {
    supplier_id: string;
    rating: number;
    title?: string;
    comment?: string;
  }) {
    return fetchApi<any>(`/api/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return fetchApi<{ message: string }>(`/api/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// SUPPLIERS API
// ==========================================

export const suppliersApi = {
  async getAll() {
    return fetchApi<any[]>('/api/suppliers');
  },

  async getById(id: string) {
    return fetchApi<any>(`/api/suppliers/${id}`);
  },

  async getStats() {
    return fetchApi<any>('/api/supplier/stats');
  },

  async getProducts() {
    return fetchApi<any[]>('/api/supplier/products');
  },

  async getOrders() {
    return fetchApi<any[]>('/api/supplier/orders');
  },

  async getReviews() {
    return fetchApi<any[]>('/api/supplier/reviews');
  },
};

// ==========================================
// UTILITY API
// ==========================================

export const utilityApi = {
  async seedDatabase() {
    return fetchApi<any>('/api/seed', { method: 'POST' });
  },

  async healthCheck() {
    return fetchApi<{ status: string; database: string }>('/api/health');
  },
};

// ==========================================
// DOCUMENT UPLOAD API
// ==========================================

export const documentsApi = {
  async uploadDocument(file: File, docType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);
    
    const response = await fetch(`${API_URL}/api/upload/temp-document`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erreur lors du téléchargement' }));
      throw new Error(error.detail || 'Erreur lors du téléchargement');
    }
    
    return response.json() as Promise<{
      doc_id: string;
      temp_id: string;
      file_name: string;
      doc_type: string;
      stored_name: string;
    }>;
  },

  getFileUrl(storedName: string) {
    return `${API_URL}/api/documents/file/${storedName}`;
  },
};

export default {
  auth: authApi,
  admin: adminApi,
  products: productsApi,
  agents: agentsApi,
  orders: ordersApi,
  cart: cartApi,
  reviews: reviewsApi,
  suppliers: suppliersApi,
  utility: utilityApi,
  documents: documentsApi,
};
