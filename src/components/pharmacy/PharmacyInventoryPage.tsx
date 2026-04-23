import { useState, useEffect } from 'react';
import {
  Package, Search, Plus, Edit2, Trash2, AlertTriangle, Calendar,
  ArrowUpCircle, ArrowDownCircle, Loader2, X, ChevronLeft
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

// Use empty string for API calls - the ingress routes /api to the backend
const API_URL = '';

interface InventoryProduct {
  id: string;
  name: string;
  reference: string;
  dci?: string;
  category?: string;
  product_type: 'medical' | 'paramedical' | 'other';
  expiry_date?: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  supplier_name?: string;
  created_at: string;
}

interface InventoryStats {
  total_products: number;
  low_stock_count: number;
  expiring_soon_count: number;
  expired_count: number;
  total_inventory_value: number;
}

interface PharmacyInventoryPageProps {
  onBack: () => void;
  token: string;
}

export function PharmacyInventoryPage({ onBack, token }: PharmacyInventoryPageProps) {
  const { showToast } = useToast();
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<InventoryProduct | null>(null);
  const [showStockModal, setShowStockModal] = useState<InventoryProduct | null>(null);

  useEffect(() => {
    loadInventory();
    loadStats();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterType) params.append('product_type', filterType);
      
      const response = await fetch(`${API_URL}/api/pharmacy/inventory?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load inventory');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger l\'inventaire' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pharmacy/inventory/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/pharmacy/inventory/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete');
      
      showToast({ type: 'success', title: 'Supprimé', message: 'Produit supprimé avec succès' });
      loadInventory();
      loadStats();
    } catch (error) {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de supprimer le produit' });
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'medical': return 'Médical';
      case 'paramedical': return 'Paramédical';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-blue-100 text-blue-700';
      case 'paramedical': return 'bg-purple-100 text-purple-700';
      case 'other': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const expiry = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  const isExpired = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const filteredProducts = products.filter(p => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(query) || 
             p.reference.toLowerCase().includes(query) ||
             (p.dci && p.dci.toLowerCase().includes(query));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="back-btn"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Gestion de Stock</h1>
                <p className="text-xs text-gray-500">Inventaire de votre pharmacie</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              data-testid="add-product-btn"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Produits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Stock faible</p>
              <p className="text-2xl font-bold text-orange-600">{stats.low_stock_count}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Expire bientôt</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.expiring_soon_count}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Expirés</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired_count}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500">Valeur inventaire</p>
              <p className="text-xl font-bold text-teal-600">{stats.total_inventory_value.toLocaleString()} DZD</p>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, référence ou DCI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                data-testid="inventory-search-input"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); loadInventory(); }}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              data-testid="type-filter-select"
            >
              <option value="">Tous les types</option>
              <option value="medical">Médical</option>
              <option value="paramedical">Paramédical</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun produit dans votre inventaire</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Ajouter votre premier produit
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix achat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix vente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50" data-testid={`inventory-row-${product.id}`}>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.reference}</p>
                          {product.dci && <p className="text-xs text-gray-400">{product.dci}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getProductTypeColor(product.product_type)}`}>
                          {getProductTypeLabel(product.product_type)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${product.stock_quantity <= product.min_stock_alert ? 'text-orange-600' : 'text-gray-900'}`}>
                            {product.stock_quantity}
                          </span>
                          {product.stock_quantity <= product.min_stock_alert && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{product.purchase_price.toFixed(2)} DZD</td>
                      <td className="px-4 py-4 font-medium text-teal-600">{product.selling_price.toFixed(2)} DZD</td>
                      <td className="px-4 py-4">
                        {product.expiry_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm ${isExpired(product.expiry_date) ? 'text-red-600 font-medium' : isExpiringSoon(product.expiry_date) ? 'text-yellow-600' : 'text-gray-600'}`}>
                              {new Date(product.expiry_date).toLocaleDateString('fr-FR')}
                            </span>
                            {isExpired(product.expiry_date) && <span className="text-xs text-red-600">(Expiré)</span>}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setShowStockModal(product)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Mouvement de stock"
                            data-testid={`stock-btn-${product.id}`}
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowEditModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                            data-testid={`edit-btn-${product.id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                            data-testid={`delete-btn-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddInventoryProductModal
          token={token}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { loadInventory(); loadStats(); setShowAddModal(false); }}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <EditInventoryProductModal
          token={token}
          product={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSuccess={() => { loadInventory(); loadStats(); setShowEditModal(null); }}
        />
      )}

      {/* Stock Movement Modal */}
      {showStockModal && (
        <StockMovementModal
          token={token}
          product={showStockModal}
          onClose={() => setShowStockModal(null)}
          onSuccess={() => { loadInventory(); loadStats(); setShowStockModal(null); }}
        />
      )}
    </div>
  );
}

// Add Product Modal Component
function AddInventoryProductModal({ token, onClose, onSuccess }: { token: string; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    dci: '',
    category: '',
    product_type: 'medical' as 'medical' | 'paramedical' | 'other',
    expiry_date: '',
    purchase_price: '',
    selling_price: '',
    stock_quantity: '',
    min_stock_alert: '10',
    supplier_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/pharmacy/inventory`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          purchase_price: parseFloat(formData.purchase_price),
          selling_price: parseFloat(formData.selling_price),
          stock_quantity: parseInt(formData.stock_quantity) || 0,
          min_stock_alert: parseInt(formData.min_stock_alert) || 10,
          expiry_date: formData.expiry_date || null,
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add product');
      }
      
      showToast({ type: 'success', title: 'Ajouté', message: 'Produit ajouté à l\'inventaire' });
      onSuccess();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter un produit</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nom du produit *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="inv-name-input"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Référence *</label>
              <input
                type="text"
                required
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="inv-reference-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">DCI</label>
              <input
                type="text"
                value={formData.dci}
                onChange={(e) => setFormData({ ...formData, dci: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Catégorie</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Type de produit *</label>
              <select
                required
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="inv-type-select"
              >
                <option value="medical">Médical</option>
                <option value="paramedical">Paramédical</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Date d'expiration</label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="inv-expiry-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Prix d'achat (DZD) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="inv-purchase-price-input"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Prix de vente (DZD) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="inv-selling-price-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Quantité en stock</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                data-testid="inv-stock-input"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Alerte stock minimum</label>
              <input
                type="number"
                value={formData.min_stock_alert}
                onChange={(e) => setFormData({ ...formData, min_stock_alert: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Nom du fournisseur</label>
            <input
              type="text"
              value={formData.supplier_name}
              onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Optionnel"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Product Modal Component
function EditInventoryProductModal({ token, product, onClose, onSuccess }: { token: string; product: InventoryProduct; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    reference: product.reference,
    dci: product.dci || '',
    category: product.category || '',
    product_type: product.product_type,
    expiry_date: product.expiry_date || '',
    purchase_price: product.purchase_price.toString(),
    selling_price: product.selling_price.toString(),
    stock_quantity: product.stock_quantity.toString(),
    min_stock_alert: product.min_stock_alert.toString(),
    supplier_name: product.supplier_name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/pharmacy/inventory/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          purchase_price: parseFloat(formData.purchase_price),
          selling_price: parseFloat(formData.selling_price),
          stock_quantity: parseInt(formData.stock_quantity) || 0,
          min_stock_alert: parseInt(formData.min_stock_alert) || 10,
          expiry_date: formData.expiry_date || null,
        })
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      
      showToast({ type: 'success', title: 'Mis à jour', message: 'Produit mis à jour avec succès' });
      onSuccess();
    } catch (error) {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de mettre à jour le produit' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Modifier le produit</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nom du produit *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Référence *</label>
              <input
                type="text"
                required
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Type de produit *</label>
              <select
                required
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="medical">Médical</option>
                <option value="paramedical">Paramédical</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Date d'expiration</label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Prix d'achat (DZD) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Prix de vente (DZD) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Quantité en stock</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Alerte stock minimum</label>
              <input
                type="number"
                value={formData.min_stock_alert}
                onChange={(e) => setFormData({ ...formData, min_stock_alert: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Stock Movement Modal Component
function StockMovementModal({ token, product, onClose, onSuccess }: { token: string; product: InventoryProduct; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/pharmacy/inventory/stock-movement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.id,
          movement_type: movementType,
          quantity: parseInt(quantity),
          reason: reason || null,
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to record movement');
      }
      
      showToast({ type: 'success', title: 'Enregistré', message: 'Mouvement de stock enregistré' });
      onSuccess();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mouvement de stock</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">Stock actuel: <span className="font-medium">{product.stock_quantity}</span></p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Type de mouvement</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMovementType('in')}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  movementType === 'in' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ArrowDownCircle className="w-5 h-5" />
                <span className="text-sm">Entrée</span>
              </button>
              <button
                type="button"
                onClick={() => setMovementType('out')}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  movementType === 'out' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ArrowUpCircle className="w-5 h-5" />
                <span className="text-sm">Sortie</span>
              </button>
              <button
                type="button"
                onClick={() => setMovementType('adjustment')}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  movementType === 'adjustment' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Edit2 className="w-5 h-5" />
                <span className="text-sm">Ajustement</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Quantité *</label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              data-testid="movement-quantity-input"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Raison</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Ex: Vente, Réception commande, Périmé..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
