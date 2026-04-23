import { useState, useEffect } from 'react';
import {
  Package, Search, Plus, Edit2, Trash2, AlertTriangle, Calendar,
  ArrowUpCircle, ArrowDownCircle, Loader2, X, Filter
} from 'lucide-react';
import { productsApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface Product {
  id: string;
  name: string;
  reference: string;
  dci?: string;
  category?: string;
  product_type?: 'medical' | 'paramedical' | 'other';
  expiry_date?: string;
  price: number;
  ug: number;
  stock_quantity: number;
  min_order_quantity?: number;
  available: boolean;
  created_at: string;
}

export function SupplierStockTab() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [showStockModal, setShowStockModal] = useState<Product | null>(null);
  const [updatingStock, setUpdatingStock] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getSupplierProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger les produits' });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newQuantity: number, reason: string) => {
    try {
      setUpdatingStock(true);
      await productsApi.update(productId, { stock_quantity: newQuantity });
      showToast({ type: 'success', title: 'Mis à jour', message: 'Stock mis à jour avec succès' });
      loadProducts();
      setShowStockModal(null);
    } catch (error) {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de mettre à jour le stock' });
    } finally {
      setUpdatingStock(false);
    }
  };

  const getProductTypeLabel = (type?: string) => {
    switch (type) {
      case 'medical': return 'Médical';
      case 'paramedical': return 'Paramédical';
      case 'other': return 'Autre';
      default: return 'N/A';
    }
  };

  const getProductTypeColor = (type?: string) => {
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

  const isLowStock = (product: Product) => {
    const minQty = product.min_order_quantity || 10;
    return product.stock_quantity <= minQty;
  };

  const filteredProducts = products.filter(p => {
    if (filterLowStock && !isLowStock(p)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(query) || 
             p.reference.toLowerCase().includes(query) ||
             (p.dci && p.dci.toLowerCase().includes(query));
    }
    return true;
  });

  // Stats
  const stats = {
    total: products.length,
    lowStock: products.filter(p => isLowStock(p)).length,
    expiringSoon: products.filter(p => isExpiringSoon(p.expiry_date)).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total produits</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Stock faible</p>
          <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Expire bientôt</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Rupture</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
          <p className="text-sm text-gray-500">Valeur totale</p>
          <p className="text-xl font-bold text-teal-600">{stats.totalValue.toLocaleString()} DZD</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, référence ou DCI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              filterLowStock 
                ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Stock faible</span>
          </button>
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
          <p className="text-gray-500">Aucun produit trouvé</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valeur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 ${!product.available ? 'opacity-60' : ''}`}>
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
                        <span className={`font-medium ${
                          product.stock_quantity === 0 ? 'text-red-600' :
                          isLowStock(product) ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {product.stock_quantity}
                        </span>
                        {product.stock_quantity === 0 && (
                          <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">Rupture</span>
                        )}
                        {product.stock_quantity > 0 && isLowStock(product) && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-900">{product.price.toFixed(2)} DZD</td>
                    <td className="px-4 py-4 font-medium text-teal-600">
                      {(product.price * product.stock_quantity).toLocaleString()} DZD
                    </td>
                    <td className="px-4 py-4">
                      {product.expiry_date ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${
                            isExpired(product.expiry_date) ? 'text-red-600 font-medium' : 
                            isExpiringSoon(product.expiry_date) ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
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
                          title="Gérer le stock"
                        >
                          <ArrowUpCircle className="w-4 h-4" />
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

      {/* Stock Management Modal */}
      {showStockModal && (
        <StockManagementModal
          product={showStockModal}
          onClose={() => setShowStockModal(null)}
          onUpdate={updateStock}
          updating={updatingStock}
        />
      )}
    </div>
  );
}

// Stock Management Modal
function StockManagementModal({ 
  product, 
  onClose, 
  onUpdate, 
  updating 
}: { 
  product: Product; 
  onClose: () => void; 
  onUpdate: (id: string, qty: number, reason: string) => void;
  updating: boolean;
}) {
  const [movementType, setMovementType] = useState<'add' | 'remove' | 'set'>('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newQuantity: number;
    const qty = parseInt(quantity);
    
    if (movementType === 'add') {
      newQuantity = product.stock_quantity + qty;
    } else if (movementType === 'remove') {
      newQuantity = Math.max(0, product.stock_quantity - qty);
    } else {
      newQuantity = qty;
    }
    
    onUpdate(product.id, newQuantity, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Gérer le stock</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">{product.reference}</p>
            <p className="text-sm text-gray-600 mt-2">
              Stock actuel: <span className="font-bold text-teal-600">{product.stock_quantity}</span>
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Type de mouvement</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMovementType('add')}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  movementType === 'add' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ArrowDownCircle className="w-5 h-5" />
                <span className="text-sm">Entrée</span>
              </button>
              <button
                type="button"
                onClick={() => setMovementType('remove')}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  movementType === 'remove' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ArrowUpCircle className="w-5 h-5" />
                <span className="text-sm">Sortie</span>
              </button>
              <button
                type="button"
                onClick={() => setMovementType('set')}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  movementType === 'set' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Edit2 className="w-5 h-5" />
                <span className="text-sm">Définir</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {movementType === 'set' ? 'Nouveau stock' : 'Quantité'}
            </label>
            <input
              type="number"
              required
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder={movementType === 'set' ? 'Ex: 100' : 'Ex: 50'}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Raison (optionnel)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Ex: Réception livraison, Vente, Inventaire..."
            />
          </div>

          {quantity && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Nouveau stock après modification:{' '}
                <span className="font-bold text-teal-600">
                  {movementType === 'add' 
                    ? product.stock_quantity + parseInt(quantity || '0')
                    : movementType === 'remove'
                    ? Math.max(0, product.stock_quantity - parseInt(quantity || '0'))
                    : parseInt(quantity || '0')
                  }
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={updating || !quantity}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
