import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart, Loader2, CreditCard, Truck, AlertCircle } from 'lucide-react';
import { cartApi, ordersApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    reference: string;
    price: number;
    ug: number;
    available: boolean;
    supplier?: {
      id: string;
      company_name: string;
    };
  };
}

interface CartModalProps {
  onClose: () => void;
  onOrderPlaced: () => void;
}

export function CartModal({ onClose, onOrderPlaced }: CartModalProps) {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'payment_on_delivery' | 'baridimob' | 'ccp'>('payment_on_delivery');
  const [notes, setNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartApi.get();
      setCartItems(data);
    } catch (error) {
      console.error('Error loading cart:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger le panier' });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(itemId);
      await cartApi.update(itemId, newQuantity);
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de mettre à jour la quantité' });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      await cartApi.remove(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      showToast({ type: 'success', title: 'Supprimé', message: 'Article retiré du panier' });
    } catch (error) {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de supprimer l\'article' });
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider le panier ?')) return;
    
    try {
      setLoading(true);
      await cartApi.clear();
      setCartItems([]);
      showToast({ type: 'success', title: 'Panier vidé', message: 'Tous les articles ont été supprimés' });
    } catch (error) {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de vider le panier' });
    } finally {
      setLoading(false);
    }
  };

  // Group items by supplier
  const itemsBySupplier = cartItems.reduce((acc, item) => {
    const supplierId = item.product?.supplier?.id || 'unknown';
    const supplierName = item.product?.supplier?.company_name || 'Fournisseur inconnu';
    
    if (!acc[supplierId]) {
      acc[supplierId] = {
        supplierName,
        items: [],
        total: 0
      };
    }
    
    acc[supplierId].items.push(item);
    acc[supplierId].total += (item.product?.price || 0) * item.quantity;
    
    return acc;
  }, {} as Record<string, { supplierName: string; items: CartItem[]; total: number }>);

  const grandTotal = Object.values(itemsBySupplier).reduce((sum, group) => sum + group.total, 0);

  const placeOrder = async (supplierId: string, items: CartItem[]) => {
    try {
      setPlacingOrder(true);
      
      await ordersApi.create({
        supplier_id: supplierId,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        notes: notes || undefined,
        payment_method: paymentMethod,
      });

      showToast({ 
        type: 'success', 
        title: 'Commande envoyée', 
        message: `Votre commande a été envoyée au fournisseur` 
      });
      
      // Reload cart after order
      await loadCart();
      onOrderPlaced();
      
      if (cartItems.length === 0) {
        onClose();
      } else {
        setShowCheckout(false);
      }
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message || 'Impossible de passer la commande' });
    } finally {
      setPlacingOrder(false);
    }
  };

  const placeAllOrders = async () => {
    setPlacingOrder(true);
    
    for (const [supplierId, group] of Object.entries(itemsBySupplier)) {
      if (supplierId === 'unknown') continue;
      
      try {
        await ordersApi.create({
          supplier_id: supplierId,
          items: group.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          })),
          notes: notes || undefined,
          payment_method: paymentMethod,
        });
      } catch (error: any) {
        showToast({ type: 'error', title: 'Erreur', message: `Erreur pour ${group.supplierName}: ${error.message}` });
      }
    }

    showToast({ 
      type: 'success', 
      title: 'Commandes envoyées', 
      message: 'Toutes vos commandes ont été envoyées aux fournisseurs' 
    });
    
    await loadCart();
    onOrderPlaced();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Mon Panier</h2>
            {cartItems.length > 0 && (
              <span className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-full">
                {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            data-testid="close-cart-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Votre panier est vide</p>
              <p className="text-sm text-gray-400">Ajoutez des produits depuis le catalogue</p>
            </div>
          ) : !showCheckout ? (
            <div className="space-y-6">
              {Object.entries(itemsBySupplier).map(([supplierId, group]) => (
                <div key={supplierId} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{group.supplierName}</p>
                    <p className="text-sm text-gray-500">{group.items.length} produit{group.items.length > 1 ? 's' : ''}</p>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4" data-testid={`cart-item-${item.id}`}>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.product?.name}</p>
                          <p className="text-sm text-gray-500">{item.product?.reference}</p>
                          <p className="text-sm font-medium text-teal-600">{item.product?.price?.toFixed(2)} DZD</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                            data-testid={`decrease-qty-${item.id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                            data-testid={`increase-qty-${item.id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {((item.product?.price || 0) * item.quantity).toFixed(2)} DZD
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          data-testid={`remove-item-${item.id}`}
                        >
                          {updating === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sous-total</span>
                    <span className="font-semibold text-gray-900">{group.total.toFixed(2)} DZD</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Checkout View */
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Mode de paiement</h3>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'payment_on_delivery' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="payment_on_delivery"
                      checked={paymentMethod === 'payment_on_delivery'}
                      onChange={() => setPaymentMethod('payment_on_delivery')}
                      className="w-4 h-4 text-teal-600"
                    />
                    <Truck className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="font-medium text-gray-900">Paiement à la livraison</p>
                      <p className="text-sm text-gray-500">Payez en espèces lors de la réception</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-not-allowed opacity-50 ${
                    paymentMethod === 'baridimob' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="baridimob"
                      disabled
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-500">BaridiMob</p>
                      <p className="text-sm text-gray-400">Bientôt disponible</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-not-allowed opacity-50 ${
                    paymentMethod === 'ccp' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="ccp"
                      disabled
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-500">CCP</p>
                      <p className="text-sm text-gray-400">Bientôt disponible</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instructions spéciales pour la livraison..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={3}
                  data-testid="order-notes-input"
                />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800">Note importante</p>
                  <p className="text-sm text-orange-700">
                    {Object.keys(itemsBySupplier).length > 1 
                      ? `Vous allez passer ${Object.keys(itemsBySupplier).length} commandes séparées (une par fournisseur).`
                      : 'Votre commande sera envoyée au fournisseur pour confirmation.'
                    }
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900">Récapitulatif</p>
                </div>
                <div className="p-4 space-y-2">
                  {Object.entries(itemsBySupplier).map(([supplierId, group]) => (
                    <div key={supplierId} className="flex justify-between text-sm">
                      <span className="text-gray-600">{group.supplierName}</span>
                      <span className="font-medium">{group.total.toFixed(2)} DZD</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-teal-600">{grandTotal.toFixed(2)} DZD</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {!showCheckout ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-teal-600">{grandTotal.toFixed(2)} DZD</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    data-testid="clear-cart-btn"
                  >
                    Vider
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    data-testid="proceed-checkout-btn"
                  >
                    Commander
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={placeAllOrders}
                  disabled={placingOrder}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="confirm-order-btn"
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>Confirmer la commande</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
