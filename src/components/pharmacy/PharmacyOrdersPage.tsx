import { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle, Truck, XCircle, Eye, 
  Loader2, Search, Star, ChevronLeft, Calendar, CreditCard
} from 'lucide-react';
import { ordersApi, reviewsApi } from '../../lib/api';
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
  supplier?: {
    id: string;
    company_name: string;
    address: string;
    wilaya: string;
  };
}

interface PharmacyOrdersPageProps {
  onBack: () => void;
}

export function PharmacyOrdersPage({ onBack }: PharmacyOrdersPageProps) {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRatingModal, setShowRatingModal] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger les commandes' });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;
    
    try {
      await ordersApi.updateStatus(orderId, 'cancelled');
      showToast({ type: 'success', title: 'Annulée', message: 'Commande annulée avec succès' });
      loadOrders();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message || 'Impossible d\'annuler la commande' });
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

  const filteredOrders = orders.filter(order => {
    if (filterStatus && order.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(query) ||
        order.supplier?.company_name?.toLowerCase().includes(query)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Mes Commandes</h1>
                <p className="text-xs text-gray-500">Historique de vos commandes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
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
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par n° commande ou fournisseur..."
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
            <p className="text-gray-500 mb-2">Aucune commande trouvée</p>
            <p className="text-sm text-gray-400">Vos commandes apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Fournisseur</p>
                      <p className="font-medium text-gray-900">{order.supplier?.company_name || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-teal-600">{order.total.toFixed(2)} DZD</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                    >
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </button>

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                        >
                          Annuler
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => setShowRatingModal(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm"
                        >
                          <Star className="w-4 h-4" />
                          Noter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRate={() => {
            setSelectedOrder(null);
            setShowRatingModal(selectedOrder);
          }}
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          order={showRatingModal}
          onClose={() => setShowRatingModal(null)}
          onSuccess={() => {
            setShowRatingModal(null);
            showToast({ type: 'success', title: 'Merci !', message: 'Votre avis a été enregistré' });
          }}
        />
      )}
    </div>
  );
}

// Order Detail Modal
function OrderDetailModal({ order, onClose, onRate }: { order: Order; onClose: () => void; onRate: () => void }) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'En attente' },
      confirmed: { color: 'bg-blue-100 text-blue-700', label: 'Confirmée' },
      delivered: { color: 'bg-green-100 text-green-700', label: 'Livrée' },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Annulée' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.label}</span>;
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
          {/* Supplier Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Fournisseur</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{order.supplier?.company_name || 'N/A'}</p>
              <p className="text-sm text-gray-600">{order.supplier?.address}</p>
              <p className="text-sm text-gray-600">{order.supplier?.wilaya}</p>
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

          {/* Timeline */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Historique</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Commande passée</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              {order.confirmed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confirmée par le fournisseur</p>
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
                    <p className="font-medium text-gray-900">Livrée</p>
                    <p className="text-sm text-gray-500">{new Date(order.delivered_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
          {order.status === 'delivered' && (
            <button
              onClick={onRate}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <Star className="w-4 h-4" />
              Noter ce fournisseur
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Rating Modal
function RatingModal({ order, onClose, onSuccess }: { order: Order; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order.supplier?.id) {
      showToast({ type: 'error', title: 'Erreur', message: 'Fournisseur non trouvé' });
      return;
    }

    try {
      setSubmitting(true);
      await reviewsApi.create({
        supplier_id: order.supplier.id,
        rating,
        title: title || undefined,
        comment: comment || undefined,
        order_id: order.id,
      });
      onSuccess();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message || 'Impossible d\'envoyer l\'avis' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Noter le fournisseur</h3>
          <p className="text-sm text-gray-500">{order.supplier?.company_name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-2 text-lg font-medium text-gray-700">{rating}/5</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre (optionnel)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Excellent service"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire (optionnel)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce fournisseur..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Star className="w-4 h-4" />
              )}
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
