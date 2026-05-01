import { useState, useEffect } from 'react';
import { LayoutDashboard, Building2, Package, ShoppingCart, Users, FileText, Star, Settings, Search, ChevronRight, ChevronLeft, Eye, Menu, X, Clock, CircleCheck as CheckCircle, Circle as XCircle, LogOut, Phone, MapPin, CreditCard as Edit, Trash2, Plus, ListFilter as Filter, Download, Check, Loader as Loader2, Store, TrendingUp, PanelLeftClose, PanelLeft, TriangleAlert as AlertTriangle, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi, productsApi, ordersApi, documentsApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { AdminEmailPage } from './AdminEmailPage';
import { AdminSettingsPage } from './AdminSettingsPage';
import { AdminManagementPage } from './AdminManagementPage';

interface NewAdminDashboardProps {
  onLogout: () => void;
}

interface Stats {
  total_users: number;
  pending_users: number;
  pharmacies: number;
  active_pharmacies: number;
  suppliers: number;
  active_suppliers: number;
  total_products: number;
  available_products: number;
  total_orders: number;
  pending_orders: number;
  total_agents: number;
  pending_documents: number;
  average_rating: number;
  total_reviews: number;
  total_revenue: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'pharmacy' | 'supplier';
  status: string;
  created_at: string;
  details?: {
    pharmacy_name?: string;
    company_name?: string;
    registry_number?: string;
    address?: string;
    wilaya?: string;
  };
  documents?: Array<{
    id?: string;
    doc_type: string;
    file_name: string;
    stored_name: string;
    status: string;
    uploaded_at: string;
  }>;
}

export function NewAdminDashboard({ onLogout }: NewAdminDashboardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default on desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop collapse
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserDocs, setSelectedUserDocs] = useState<User['documents']>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalUser, setRejectModalUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectedDocTypes, setRejectedDocTypes] = useState<string[]>([]);

  // Detect if we're on desktop (lg breakpoint = 1024px)
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, pendingData, pharmaciesData, suppliersData, productsData, ordersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingUsers(),
        adminApi.getAllPharmacies().catch(() => []),
        adminApi.getAllSuppliers().catch(() => []),
        productsApi.getAll().catch(() => []),
        adminApi.getAllOrders().catch(() => []),
      ]);
      setStats(statsData);
      setPendingUsers(pendingData);
      // Combine pharmacies and suppliers into allUsers with details
      const usersWithDetails = [...pharmaciesData, ...suppliersData];
      setAllUsers(usersWithDetails);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger les données' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (user: User) => {
    setSelectedUser(user);
    setSelectedUserDocs(user.documents || []);
    // Always fetch fresh documents from API
    setLoadingDocs(true);
    try {
      const docs = await adminApi.getUserDocuments(user.id);
      setSelectedUserDocs(docs);
    } catch (e) {
      console.error('Failed to load documents:', e);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);
      await adminApi.reviewUser(userId, 'approved');
      showToast({ type: 'success', title: 'Succès', message: 'Utilisateur approuvé. Un email de confirmation a été envoyé.' });
      loadData();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    // Open reject modal
    const user = pendingUsers.find(u => u.id === userId) || allUsers.find(u => u.id === userId);
    if (user) {
      setRejectModalUser(user);
      setRejectReason('');
      setRejectedDocTypes([]);
    }
  };

  const handleSubmitReject = async () => {
    if (!rejectModalUser) return;
    if (!rejectReason.trim()) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez indiquer la raison du rejet' });
      return;
    }
    try {
      setActionLoading(rejectModalUser.id);
      await adminApi.rejectUser(rejectModalUser.id, rejectReason, rejectedDocTypes.length > 0 ? rejectedDocTypes : undefined);
      showToast({ type: 'success', title: 'Succès', message: 'Utilisateur rejeté. Un email a été envoyé.' });
      setRejectModalUser(null);
      loadData();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir suspendre cet utilisateur ?')) return;
    try {
      setActionLoading(userId);
      await adminApi.suspendUser(userId);
      showToast({ type: 'success', title: 'Succès', message: 'Utilisateur suspendu' });
      loadData();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${userName}" ? Cette action est irréversible.`)) return;
    try {
      setActionLoading(userId);
      await adminApi.deleteUser(userId);
      showToast({ type: 'success', title: 'Succès', message: 'Utilisateur supprimé définitivement' });
      setSelectedUser(null);
      loadData();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ? Cette action est irréversible.`)) return;
    try {
      setActionLoading(productId);
      await productsApi.delete(productId);
      showToast({ type: 'success', title: 'Succès', message: 'Produit supprimé' });
      loadData();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const SUPER_ADMIN_EMAIL = 'admin@dawalink.dz';
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'pending', label: 'En attente', icon: <Clock className="w-5 h-5" />, badge: pendingUsers.length },
    { id: 'pharmacies', label: 'Pharmacies', icon: <Store className="w-5 h-5" /> },
    { id: 'suppliers', label: 'Fournisseurs', icon: <Building2 className="w-5 h-5" /> },
    { id: 'products', label: 'Produits', icon: <Package className="w-5 h-5" /> },
    { id: 'orders', label: 'Commandes', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'users', label: 'Tous les utilisateurs', icon: <Users className="w-5 h-5" /> },
    { id: 'admins', label: 'Administrateurs', icon: <ShieldCheck className="w-5 h-5" />, superAdminOnly: true },
    { id: 'emails', label: 'Emails', icon: <Mail className="w-5 h-5" /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
  ].filter(item => !item.superAdminOnly || isSuperAdmin);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <span className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded-full">Actif</span>;
      case 'pending':
        return <span className="px-2.5 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">En attente</span>;
      case 'suspended':
        return <span className="px-2.5 py-1 text-xs bg-red-100 text-red-700 rounded-full">Suspendu</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Rejeté</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Confirmé</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">Expédié</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded-full">Terminé</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs bg-red-100 text-red-700 rounded-full">Annulé</span>;
      default:
        return <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{status}</span>;
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pharmacies = allUsers.filter(u => u.role === 'pharmacy');
  const suppliers = allUsers.filter(u => u.role === 'supplier');

  // Stats for display
  const statsDisplay = [
    { 
      id: 'pharmacies',
      title: 'Pharmacies', 
      value: stats?.pharmacies || 0, 
      subtext: `${stats?.active_pharmacies || 0} actives`,
      icon: <Store className="w-6 h-6" />,
      color: '#009689',
      trend: 'up',
      trendValue: `+${stats?.active_pharmacies || 0}`
    },
    { 
      id: 'suppliers',
      title: 'Fournisseurs', 
      value: stats?.suppliers || 0, 
      subtext: `${stats?.active_suppliers || 0} actifs`,
      icon: <Building2 className="w-6 h-6" />,
      color: '#6366F1',
      trend: 'up',
      trendValue: `+${stats?.active_suppliers || 0}`
    },
    { 
      id: 'products',
      title: 'Produits', 
      value: stats?.total_products || 0, 
      subtext: `${stats?.available_products || 0} disponibles`,
      icon: <Package className="w-6 h-6" />,
      color: '#10B981',
      trend: null
    },
    { 
      id: 'orders',
      title: 'Commandes', 
      value: stats?.total_orders || 0, 
      subtext: `${stats?.pending_orders || 0} en attente`,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: '#F59E0B',
      trend: null
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#009689]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                data-testid="mobile-menu-btn"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {/* Desktop sidebar toggle button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="sidebar-toggle-btn"
                title={sidebarCollapsed ? "Ouvrir le menu" : "Fermer le menu"}
              >
                {sidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-[#009689] to-[#00786F] rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#009689]">DawaDzLink Admin</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar - sticky in flex flow, never overlays content */}
        <aside className={`hidden lg:block flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto sticky top-16 self-start transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`} style={{ height: 'calc(100vh - 4rem)' }}>
          <nav className={`p-4 space-y-1 ${sidebarCollapsed ? 'p-2' : ''}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#E0F7F4] text-[#009689]'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${sidebarCollapsed ? 'px-2' : ''}`}
                data-testid={`nav-${item.id}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'gap-0' : ''}`}>
                  <div className="relative">
                    {item.icon}
                    {item.badge !== undefined && item.badge > 0 && sidebarCollapsed && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </div>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {item.badge !== undefined && item.badge > 0 && !sidebarCollapsed && (
                  <span className="px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar - fixed overlay, only on small screens */}
        <aside className={`fixed top-16 left-0 bottom-0 z-30 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out overflow-y-auto w-64 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={`mobile-${item.id}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`relative w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#E0F7F4] text-[#009689]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                data-testid={`nav-mobile-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Overview Page */}
          {currentPage === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {statsDisplay.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: stat.color }}
                      >
                        {stat.icon}
                      </div>
                      {stat.trend && (
                        <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend === 'up' ? '↑' : '↓'}
                          <span className="font-medium">{stat.trendValue}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                      {stat.subtext && <p className="text-xs text-gray-500">{stat.subtext}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Approvals & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Pending Approvals */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">En attente d'approbation</h2>
                    <button 
                      onClick={() => setCurrentPage('pending')}
                      className="text-sm text-[#009689] hover:text-[#00786F] flex items-center gap-1"
                    >
                      Voir Tout
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {pendingUsers.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                        <p>Aucune inscription en attente</p>
                      </div>
                    ) : (
                      pendingUsers.slice(0, 4).map((u) => (
                        <div key={u.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                u.role === 'pharmacy' ? 'bg-[#E0F7F4]' : 'bg-indigo-100'
                              }`}>
                                {u.role === 'pharmacy' 
                                  ? <Store className="w-5 h-5 text-[#009689]" />
                                  : <Building2 className="w-5 h-5 text-indigo-600" />
                                }
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {u.details?.pharmacy_name || u.details?.company_name || u.full_name}
                                </p>
                                <p className="text-sm text-gray-500">{u.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(u.id)}
                                disabled={actionLoading === u.id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                                title="Approuver"
                              >
                                {actionLoading === u.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(u.id)}
                                disabled={actionLoading === u.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                title="Rejeter"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Commandes Récentes</h2>
                    <button 
                      onClick={() => setCurrentPage('orders')}
                      className="text-sm text-[#009689] hover:text-[#00786F] flex items-center gap-1"
                    >
                      Voir Tout
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {orders.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>Aucune commande</p>
                      </div>
                    ) : (
                      orders.slice(0, 4).map((order) => (
                        <div key={order.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{order.order_number || order.id}</p>
                              <p className="text-sm text-gray-500">{order.pharmacy?.pharmacy_name || 'Pharmacie'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{order.total?.toLocaleString()} DZD</p>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agents commerciaux</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#E0F7F4] flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#009689]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{stats?.total_agents || 0}</p>
                      <p className="text-gray-500">Total des agents</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis clients</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{stats?.average_rating || 0}</p>
                      <p className="text-gray-500">Note moyenne ({stats?.total_reviews || 0} avis)</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Pending Page */}
          {currentPage === 'pending' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Inscriptions en attente</h2>
                  <p className="text-sm text-gray-600 mt-1">Approuver ou rejeter les nouvelles inscriptions</p>
                </div>
              </div>
              
              {pendingUsers.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tout est à jour!</h3>
                  <p className="text-gray-500">Aucune inscription en attente d'approbation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map(u => (
                    <div key={u.id} className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            u.role === 'pharmacy' ? 'bg-[#E0F7F4]' : 'bg-indigo-100'
                          }`}>
                            {u.role === 'pharmacy' 
                              ? <Store className="w-6 h-6 text-[#009689]" />
                              : <Building2 className="w-6 h-6 text-indigo-600" />
                            }
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {u.details?.pharmacy_name || u.details?.company_name || u.full_name}
                            </h3>
                            <p className="text-sm text-gray-500">{u.email}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                u.role === 'pharmacy' ? 'bg-[#E0F7F4] text-[#009689]' : 'bg-indigo-100 text-indigo-700'
                              }`}>
                                {u.role === 'pharmacy' ? 'Pharmacie' : 'Fournisseur'}
                              </span>
                              {u.details?.registry_number && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                  {u.details.registry_number}
                                </span>
                              )}
                              {u.details?.wilaya && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                  {u.details.wilaya}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                              Inscrit le {new Date(u.created_at).toLocaleDateString('fr-FR')}
                            </p>

                            {/* Documents Section */}
                            {u.documents && u.documents.length > 0 && (
                              <div className="mt-4 border-t pt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  Documents soumis ({u.documents.length})
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {u.documents.map((doc, idx) => (
                                    <a
                                      key={idx}
                                      href={documentsApi.getFileUrl(doc.stored_name)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                      data-testid={`doc-link-${u.id}-${idx}`}
                                    >
                                      <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-gray-700 truncate">{doc.doc_type}</p>
                                        <p className="text-xs text-gray-500 truncate">{doc.file_name}</p>
                                      </div>
                                      <Download className="w-3 h-3 text-gray-400 group-hover:text-teal-600 flex-shrink-0" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {(!u.documents || u.documents.length === 0) && (
                              <div className="mt-4 border-t pt-3">
                                <p className="text-sm text-amber-600 flex items-center gap-1">
                                  <AlertTriangle className="w-4 h-4" />
                                  Aucun document soumis
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 lg:flex-shrink-0">
                          <button
                            onClick={() => handleOpenDetails(u)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Détails
                          </button>
                          <button
                            onClick={() => handleApprove(u.id)}
                            disabled={actionLoading === u.id}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50"
                            data-testid={`approve-btn-${u.id}`}
                          >
                            {actionLoading === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approuver
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            disabled={actionLoading === u.id}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 disabled:opacity-50"
                            data-testid={`reject-btn-${u.id}`}
                          >
                            <XCircle className="w-4 h-4" />
                            Rejeter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pharmacies Page */}
          {currentPage === 'pharmacies' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Toutes les Pharmacies</h2>
                  <p className="text-sm text-gray-600 mt-1">Gérer et vérifier les comptes pharmacies</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des pharmacies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Nom Pharmacie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Registre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pharmacies.filter(u => 
                        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.details?.pharmacy_name?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((pharmacy) => (
                        <tr key={pharmacy.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#E0F7F4] flex items-center justify-center">
                                <Store className="w-5 h-5 text-[#009689]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{pharmacy.details?.pharmacy_name || pharmacy.full_name}</p>
                                <p className="text-xs text-gray-500">{pharmacy.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pharmacy.details?.registry_number || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {pharmacy.details?.wilaya || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {pharmacy.phone || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(pharmacy.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenDetails(pharmacy)}
                                className="text-[#009689] hover:text-[#00786F]"
                                title="Voir Détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {pharmacy.status === 'active' && (
                                <button
                                  onClick={() => handleSuspend(pharmacy.id)}
                                  className="text-orange-600 hover:text-orange-700"
                                  title="Suspendre"
                                  disabled={actionLoading === pharmacy.id}
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              {pharmacy.status === 'suspended' && (
                                <button
                                  onClick={() => handleApprove(pharmacy.id)}
                                  className="text-green-600 hover:text-green-700"
                                  title="Réactiver"
                                  disabled={actionLoading === pharmacy.id}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(pharmacy.id, pharmacy.details?.pharmacy_name || pharmacy.full_name)}
                                className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                title="Supprimer définitivement"
                                disabled={actionLoading === pharmacy.id}
                              >
                                {actionLoading === pharmacy.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Suppliers Page */}
          {currentPage === 'suppliers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tous les Fournisseurs</h2>
                  <p className="text-sm text-gray-600 mt-1">Gérer et vérifier les comptes fournisseurs</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des fournisseurs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Nom Entreprise</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Registre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {suppliers.filter(u => 
                        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.details?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{supplier.details?.company_name || supplier.full_name}</p>
                                <p className="text-xs text-gray-500">{supplier.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.details?.registry_number || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {supplier.details?.wilaya || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {supplier.phone || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(supplier.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenDetails(supplier)}
                                className="text-[#009689] hover:text-[#00786F]"
                                title="Voir Détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {supplier.status === 'active' && (
                                <button
                                  onClick={() => handleSuspend(supplier.id)}
                                  className="text-orange-600 hover:text-orange-700"
                                  title="Suspendre"
                                  disabled={actionLoading === supplier.id}
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              {supplier.status === 'suspended' && (
                                <button
                                  onClick={() => handleApprove(supplier.id)}
                                  className="text-green-600 hover:text-green-700"
                                  title="Réactiver"
                                  disabled={actionLoading === supplier.id}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(supplier.id, supplier.details?.company_name || supplier.full_name)}
                                className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                title="Supprimer définitivement"
                                disabled={actionLoading === supplier.id}
                              >
                                {actionLoading === supplier.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Page */}
          {currentPage === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Catalogue Produits</h2>
                  <p className="text-sm text-gray-600 mt-1">Gérer tous les produits de la plateforme</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des produits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Produit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.filter(p => 
                        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.reference?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <Package className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.dci || product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.reference}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.supplier?.company_name || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price?.toLocaleString()} DZD</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock_quantity || 0} unités</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs ${product.available ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                              {product.available ? 'Disponible' : 'Indisponible'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="text-red-600 hover:text-red-700 disabled:opacity-50"
                              title="Supprimer le produit"
                              disabled={actionLoading === product.id}
                            >
                              {actionLoading === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Page */}
          {currentPage === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Toutes les Commandes</h2>
                  <p className="text-sm text-gray-600 mt-1">Suivre et gérer les commandes</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Commande</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pharmacie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>Aucune commande pour le moment</p>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_number || order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.pharmacy?.pharmacy_name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.supplier?.company_name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.total?.toLocaleString()} DZD</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* All Users Page */}
          {currentPage === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Tous les utilisateurs ({allUsers.length})</h2>
                  <p className="text-sm text-gray-600 mt-1">Liste complète des utilisateurs</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{u.full_name}</p>
                          <p className="text-sm text-gray-500">{u.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' :
                            u.role === 'pharmacy' ? 'bg-[#E0F7F4] text-[#009689]' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {u.role === 'admin' ? 'Admin' : u.role === 'pharmacy' ? 'Pharmacie' : 'Fournisseur'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(u.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenDetails(u)}
                              className="text-[#009689] hover:text-[#00786F]"
                              title="Voir Détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.full_name)}
                                className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                title="Supprimer définitivement"
                                disabled={actionLoading === u.id}
                              >
                                {actionLoading === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

          {/* Emails Page */}
          {currentPage === 'emails' && (
            <AdminEmailPage allUsers={allUsers} />
          )}

          {/* Admins Management Page */}
          {currentPage === 'admins' && (
            <AdminManagementPage />
          )}

          {/* Settings Page */}
          {currentPage === 'settings' && (
            <AdminSettingsPage />
          )}
        </main>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Détails de l'utilisateur</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium text-gray-900">
                  {selectedUser.details?.pharmacy_name || selectedUser.details?.company_name || selectedUser.full_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium text-gray-900">{selectedUser.phone}</p>
              </div>
              {selectedUser.details?.registry_number && (
                <div>
                  <p className="text-sm text-gray-500">Numéro de registre</p>
                  <p className="font-medium text-gray-900">{selectedUser.details.registry_number}</p>
                </div>
              )}
              {selectedUser.details?.address && (
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-900">{selectedUser.details.address}</p>
                </div>
              )}
              {selectedUser.details?.wilaya && (
                <div>
                  <p className="text-sm text-gray-500">Wilaya</p>
                  <p className="font-medium text-gray-900">{selectedUser.details.wilaya}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Statut actuel</p>
                <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
              </div>
            </div>

            {/* Documents Section */}
            {loadingDocs ? (
              <div className="mt-6 border-t pt-5 flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Chargement des documents...</span>
              </div>
            ) : selectedUserDocs && selectedUserDocs.length > 0 ? (
              <div className="mt-6 border-t pt-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Documents soumis ({selectedUserDocs.length})
                </h4>
                <div className="space-y-3">
                  {selectedUserDocs.map((doc, idx) => {
                    const fileUrl = documentsApi.getFileUrl(doc.stored_name);
                    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(doc.file_name);
                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`user-doc-${idx}`}>
                        <div className="flex items-center justify-between p-3 bg-gray-50">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800">{doc.doc_type}</p>
                              <p className="text-xs text-gray-500 truncate">{doc.file_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-xs font-medium bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100 transition-colors flex items-center gap-1"
                              data-testid={`view-doc-btn-${idx}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Voir
                            </a>
                            <a
                              href={fileUrl}
                              download={doc.file_name}
                              className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                              data-testid={`download-doc-btn-${idx}`}
                            >
                              <Download className="w-3.5 h-3.5" />
                              Télécharger
                            </a>
                          </div>
                        </div>
                        {isImage && (
                          <div className="p-2 bg-white border-t border-gray-100">
                            <img
                              src={fileUrl}
                              alt={doc.doc_type}
                              className="max-h-48 mx-auto rounded object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-6 border-t pt-5">
                <p className="text-sm text-amber-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Aucun document soumis par cet utilisateur
                </p>
              </div>
            )}

            {selectedUser.status === 'pending' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleApprove(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Approuver
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Rejeter
                </button>
              </div>
            )}

            {selectedUser.status === 'active' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleSuspend(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Suspendre
                </button>
              </div>
            )}

            {selectedUser.status === 'suspended' && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleApprove(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Réactiver
                </button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleDeleteUser(
                  selectedUser.id,
                  selectedUser.details?.pharmacy_name || selectedUser.details?.company_name || selectedUser.full_name
                )}
                disabled={actionLoading === selectedUser.id}
                className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                {actionLoading === selectedUser.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" data-testid="reject-modal">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Rejeter l'inscription</h3>
                <button onClick={() => setRejectModalUser(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {rejectModalUser.details?.pharmacy_name || rejectModalUser.details?.company_name || rejectModalUser.full_name} - {rejectModalUser.email}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du rejet <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Ex: Document illisible, informations non conformes..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  data-testid="reject-reason-input"
                />
              </div>

              {rejectModalUser.documents && rejectModalUser.documents.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document(s) concerné(s)
                  </label>
                  <div className="space-y-2">
                    {rejectModalUser.documents.map((doc, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rejectedDocTypes.includes(doc.doc_type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRejectedDocTypes(prev => [...prev, doc.doc_type]);
                            } else {
                              setRejectedDocTypes(prev => prev.filter(d => d !== doc.doc_type));
                            }
                          }}
                          className="w-4 h-4 text-red-600 rounded border-gray-300"
                          data-testid={`reject-doc-checkbox-${idx}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700">{doc.doc_type}</p>
                          <p className="text-xs text-gray-500 truncate">{doc.file_name}</p>
                        </div>
                        <a
                          href={documentsApi.getFileUrl(doc.stored_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setRejectModalUser(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitReject}
                disabled={!rejectReason.trim() || actionLoading === rejectModalUser.id}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="submit-reject-btn"
              >
                {actionLoading === rejectModalUser.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
