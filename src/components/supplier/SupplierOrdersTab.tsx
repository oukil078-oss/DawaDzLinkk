import { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, Eye, 
  Loader2, Search, Filter, CreditCard, Calendar
} from 'lucide-react';
import { ordersApi, suppliersApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface OrderItem {
  product_id: string;
  product_name: string;
  product_reference: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Order {
  id: string;
  order_number: string;
  pharmacy_id: string;
  supplier_id: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  confirmed_at?: string;
  delivered_at?: string;
  pharmacy?: {
    pharmacy_name: string;
    address: string;
    wilaya: string;
  };
}

export function SupplierOrdersTab() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await suppliersApi.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger les commandes' });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await ordersApi.updateStatus(orderId, newStatus);
      showToast({ type: 'success', title: 'Mis à jour', message: `Commande ${newStatus === 'confirmed' ? 'confirmée' : newStatus === 'delivered' ? 'livrée' : 'mise à jour'}` });
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message || 'Impossible de mettre à jour le statut' });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'En attente', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-700', label: 'Confirmée', icon: CheckCircle },
      processing: { color: 'bg-indigo-100 text-indigo-700', label: 'En préparation', icon: Package },
      shipped: { color: 'bg-purple-100 text-purple-700', label: 'Expédiée', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-700', label: 'Livrée', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Annulée', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      payment_on_delivery: 'Paiement à la livraison',
      baridimob: 'BaridiMob',
      ccp: 'CCP',
    };
    return methods[method] || method;
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'paid') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Payé</span>;
    }
    return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">En attente</span>;
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus && order.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(query) ||
        order.pharmacy?.pharmacy_name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total commandes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Confirmées</p>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Livrées</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par n° commande ou pharmacie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="delivered">Livrées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pharmacie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{order.pharmacy?.pharmacy_name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.pharmacy?.wilaya || ''}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-teal-600">{order.total.toFixed(2)} DZD</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">{getPaymentMethodLabel(order.payment_method)}</p>
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            disabled={updatingStatus === order.id}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmer'}
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            disabled={updatingStatus === order.id}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Marquer livrée'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          updatingStatus={updatingStatus}
          isSupplier={true}
        />
      )}
    </div>
  );
}

// Order Detail Modal Component
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  updatingStatus: string | null;
  isSupplier: boolean;
}

function OrderDetailModal({ order, onClose, onUpdateStatus, updatingStatus, isSupplier }: OrderDetailModalProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-700', label: 'Confirmée' },
      delivered: { color: 'bg-green-100 text-green-700', label: 'Livrée' },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Annulée' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {isSupplier ? 'Pharmacie' : 'Fournisseur'}
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{order.pharmacy?.pharmacy_name || 'N/A'}</p>
              <p className="text-sm text-gray-600">{order.pharmacy?.address}</p>
              <p className="text-sm text-gray-600">{order.pharmacy?.wilaya}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Paiement</h4>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span>{order.payment_method === 'payment_on_delivery' ? 'Paiement à la livraison' : order.payment_method}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Articles ({order.items.length})</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Produit</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Qté</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Prix</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-500">{item.product_reference}</p>
                      </td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{item.unit_price.toFixed(2)} DZD</td>
                      <td className="px-4 py-3 text-right font-medium">{item.total.toFixed(2)} DZD</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right font-bold text-teal-600">{order.total.toFixed(2)} DZD</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
                {order.notes}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Historique</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Commande créée</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              {order.confirmed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Commande confirmée</p>
                    <p className="text-sm text-gray-500">{new Date(order.confirmed_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              )}
              {order.delivered_at && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Commande livrée</p>
                    <p className="text-sm text-gray-500">{new Date(order.delivered_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
          
          {isSupplier && (
            <div className="flex gap-3">
              {order.status === 'pending' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                  disabled={updatingStatus === order.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Confirmer la commande
                </button>
              )}
              {order.status === 'confirmed' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'delivered')}
                  disabled={updatingStatus === order.id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingStatus === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  Marquer comme livrée
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
