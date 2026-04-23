import { useState, useEffect } from 'react';
import { Package, Search, LogOut, ListFilter as Filter, Star, Phone, Mail, ShoppingCart, X, Loader as Loader2, MessageCircle, Warehouse, ClipboardList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productsApi, cartApi, suppliersApi } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { PharmacyInventoryPage } from './pharmacy/PharmacyInventoryPage';
import { PharmacyOrdersPage } from './pharmacy/PharmacyOrdersPage';
import { CartModal } from './pharmacy/CartModal';

interface PharmacyDashboardProps {
  onLogout: () => void;
}

interface Product {
  id: string;
  name: string;
  reference: string;
  dci: string;
  category: string;
  price: number;
  ug: number;
  available: boolean;
  supplier?: {
    id: string;
    company_name: string;
    wilaya?: string;
    rating?: number;
    review_count?: number;
  };
}

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsapp?: string;
  region: string;
}

export function PharmacyDashboard({ onLogout }: PharmacyDashboardProps) {
  const { user, details } = useAuth();
  const { showToast, showDevelopmentToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Filter states
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
  const [filterSupplier, setFilterSupplier] = useState<string>('');
  const [suppliers, setSuppliers] = useState<{id: string; company_name: string}[]>([]);

  useEffect(() => {
    loadProducts();
    loadCart();
    loadSuppliers();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll({
        search: searchQuery || undefined,
        available: filterAvailable ?? undefined,
        supplier_id: filterSupplier || undefined,
      });
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger les produits' });
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll();
      setSuppliers(data.map((s: any) => ({ id: s.id, company_name: s.company_name })));
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const loadCart = async () => {
    try {
      const cart = await cartApi.get();
      setCartCount(cart.length);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadAgentsForProduct = async (product: Product) => {
    if (!product.supplier?.id) return;
    try {
      setLoadingAgents(true);
      const data = await productsApi.getById(product.id);
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleSearch = () => {
    loadProducts();
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    loadAgentsForProduct(product);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      await cartApi.add(productId, 1);
      setCartCount(prev => prev + 1);
      showToast({ type: 'success', title: 'Ajouté au panier', message: 'Produit ajouté avec succès' });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      showToast({ type: 'error', title: 'Erreur', message: error.message || 'Impossible d\'ajouter au panier' });
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products
    .filter(product => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.reference.toLowerCase().includes(query) ||
          product.dci?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // newest - default order from API
    });

  const pharmacyName = details?.pharmacy_name || user?.full_name || 'Pharmacie';

  // Get stored token
  const token = localStorage.getItem('token') || '';

  // If showing inventory page, render it instead
  if (showInventory) {
    return <PharmacyInventoryPage onBack={() => setShowInventory(false)} token={token} />;
  }

  // If showing orders page, render it
  if (showOrders) {
    return <PharmacyOrdersPage onBack={() => setShowOrders(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-teal-700">DawaDzLink</h1>
                <p className="text-xs text-gray-500">{pharmacyName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                data-testid="cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                data-testid="logout-btn"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Search className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Trouvez vos médicaments</h2>
          </div>
          <p className="text-teal-100 text-sm">
            Recherchez parmi des milliers de produits pharmaceutiques et contactez directement les agents commerciaux
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                data-testid="product-search-input"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                showFilters ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              data-testid="filter-toggle-btn"
            >
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              data-testid="sort-select"
            >
              <option value="newest">Nouveaux</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                <select
                  value={filterAvailable === null ? '' : filterAvailable ? 'available' : 'unavailable'}
                  onChange={(e) => {
                    if (e.target.value === '') setFilterAvailable(null);
                    else setFilterAvailable(e.target.value === 'available');
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Tous</option>
                  <option value="available">Disponible</option>
                  <option value="unavailable">Indisponible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Tous les fournisseurs</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.company_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadProducts}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">{filteredProducts.length} produits trouvés</p>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product)}
                data-testid={`product-card-${product.id}`}
              >
                <div className={`h-1 ${product.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.available 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.reference}</p>
                      <p className="text-xs text-gray-400 mt-1">{product.dci}</p>
                    </div>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                      UG {product.ug}%
                    </span>
                  </div>

                  <p className="text-lg font-semibold text-teal-600 mb-2">
                    {product.price.toFixed(2)} DZD
                  </p>

                  {/* Expiry Date */}
                  {product.expiry_date && (
                    <p className={`text-xs mb-3 ${
                      new Date(product.expiry_date) < new Date() 
                        ? 'text-red-600 font-medium' 
                        : new Date(product.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                        ? 'text-orange-600'
                        : 'text-gray-500'
                    }`}>
                      Exp: {new Date(product.expiry_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Fournisseur</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {product.supplier?.company_name || 'N/A'}
                      </p>
                      {product.supplier?.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{product.supplier.rating}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-gray-500">{selectedProduct.reference}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Prix</p>
                  <p className="text-2xl font-bold text-teal-600">{selectedProduct.price.toFixed(2)} DZD</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">UG (Unité Gratuite)</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedProduct.ug}%</p>
                </div>
              </div>

              {/* Expiry Date in Modal */}
              {selectedProduct.expiry_date && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Date d'expiration</p>
                  <p className={`font-medium ${
                    new Date(selectedProduct.expiry_date) < new Date() 
                      ? 'text-red-600' 
                      : new Date(selectedProduct.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                      ? 'text-orange-600'
                      : 'text-gray-900'
                  }`}>
                    {new Date(selectedProduct.expiry_date).toLocaleDateString('fr-FR', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                    {new Date(selectedProduct.expiry_date) < new Date() && ' (Expiré)'}
                    {new Date(selectedProduct.expiry_date) >= new Date() && 
                     new Date(selectedProduct.expiry_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && 
                     ' (Expire bientôt)'}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">DCI</p>
                <p className="text-gray-900">{selectedProduct.dci}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Catégorie</p>
                <p className="text-gray-900">{selectedProduct.category || 'Non spécifié'}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Fournisseur</p>
                <p className="font-medium text-gray-900">{selectedProduct.supplier?.company_name || 'N/A'}</p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(selectedProduct.id)}
                disabled={!selectedProduct.available || addingToCart === selectedProduct.id}
                className={`w-full py-3 rounded-lg font-medium mb-6 flex items-center justify-center gap-2 ${
                  selectedProduct.available
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                data-testid="add-to-cart-btn"
              >
                {addingToCart === selectedProduct.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                {selectedProduct.available ? 'Ajouter au panier' : 'Produit indisponible'}
              </button>

              {/* Agents Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Agents commerciaux</h3>
                
                {loadingAgents ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  </div>
                ) : agents.length > 0 ? (
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div key={agent.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-teal-700">
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <p className="text-sm text-gray-500">{agent.region}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`tel:${agent.phone}`}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Phone className="w-4 h-4" />
                            {agent.phone}
                          </a>
                          <a
                            href={`mailto:${agent.email}`}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                          {agent.whatsapp && (
                            <a
                              href={`https://wa.me/${agent.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Aucun agent disponible pour ce produit</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <CartModal 
          onClose={() => setShowCart(false)} 
          onOrderPlaced={() => loadCart()}
        />
      )}
    </div>
  );
}
