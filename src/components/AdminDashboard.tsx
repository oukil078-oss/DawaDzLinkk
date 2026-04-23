import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Store,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Star,
  LogOut,
  Search,
  Menu,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

interface AdminDashboardProps {
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

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'pharmacy' | 'supplier';
  status: string;
  created_at: string;
  details?: {
    pharmacy_name?: string;
    company_name?: string;
    registry_number?: string;
    address?: string;
    wilaya?: string;
  };
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [allUsers, setAllUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, pendingData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingUsers(),
        adminApi.getAllUsers(),
      ]);
      setStats(statsData);
      setPendingUsers(pendingData);
      setAllUsers(usersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger les données' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);
      await adminApi.approveUser(userId);
      showToast({ type: 'success', title: 'Succès', message: 'Utilisateur approuvé' });
      loadData();
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cet utilisateur ?')) return;
    try {
      setActionLoading(userId);
      await adminApi.rejectUser(userId);
      showToast({ type: 'success', title: 'Succès', message: 'Utilisateur rejeté' });
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

  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'pending', label: 'En attente', icon: <Clock className="w-5 h-5" />, badge: pendingUsers.length },
    { id: 'pharmacies', label: 'Pharmacies', icon: <Store className="w-5 h-5" /> },
    { id: 'suppliers', label: 'Fournisseurs', icon: <Building2 className="w-5 h-5" /> },
    { id: 'users', label: 'Tous les utilisateurs', icon: <Users className="w-5 h-5" /> },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Actif</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">En attente</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Suspendu</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Rejeté</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{status}</span>;
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pharmacies = allUsers.filter(u => u.role === 'pharmacy');
  const suppliers = allUsers.filter(u => u.role === 'supplier');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-purple-700">DawaDzLink Admin</h1>
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
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <nav className="p-4 pt-20 lg:pt-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                data-testid={`nav-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          {/* Overview Page */}
          {currentPage === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vue d'ensemble</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Store className="w-8 h-8 text-blue-500" />
                    <span className="text-sm text-green-600">+{stats?.active_pharmacies || 0} actives</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats?.pharmacies || 0}</p>
                  <p className="text-gray-500">Pharmacies</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 className="w-8 h-8 text-purple-500" />
                    <span className="text-sm text-green-600">+{stats?.active_suppliers || 0} actifs</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats?.suppliers || 0}</p>
                  <p className="text-gray-500">Fournisseurs</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 text-teal-500" />
                    <span className="text-sm text-gray-500">{stats?.available_products || 0} disponibles</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total_products || 0}</p>
                  <p className="text-gray-500">Produits</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart className="w-8 h-8 text-orange-500" />
                    <span className="text-sm text-orange-600">{stats?.pending_orders || 0} en attente</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total_orders || 0}</p>
                  <p className="text-gray-500">Commandes</p>
                </div>
              </div>

              {/* Pending Approvals */}
              {pendingUsers.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">En attente d'approbation</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {pendingUsers.length} en attente
                    </span>
                  </div>
                  <div className="space-y-3">
                    {pendingUsers.slice(0, 5).map(u => (
                      <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            u.role === 'pharmacy' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {u.role === 'pharmacy' 
                              ? <Store className="w-5 h-5 text-blue-600" />
                              : <Building2 className="w-5 h-5 text-purple-600" />
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
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm flex items-center gap-1 disabled:opacity-50"
                            data-testid={`approve-${u.id}`}
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
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-1 disabled:opacity-50"
                            data-testid={`reject-${u.id}`}
                          >
                            <XCircle className="w-4 h-4" />
                            Rejeter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agents commerciaux</h3>
                  <div className="flex items-center gap-4">
                    <Users className="w-12 h-12 text-teal-500" />
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{stats?.total_agents || 0}</p>
                      <p className="text-gray-500">Total des agents</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis clients</h3>
                  <div className="flex items-center gap-4">
                    <Star className="w-12 h-12 text-yellow-500" />
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{stats?.average_rating || 0}</p>
                      <p className="text-gray-500">Note moyenne ({stats?.total_reviews || 0} avis)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Page */}
          {currentPage === 'pending' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Inscriptions en attente</h2>
              
              {pendingUsers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tout est à jour!</h3>
                  <p className="text-gray-500">Aucune inscription en attente d'approbation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map(u => (
                    <div key={u.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            u.role === 'pharmacy' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {u.role === 'pharmacy' 
                              ? <Store className="w-6 h-6 text-blue-600" />
                              : <Building2 className="w-6 h-6 text-purple-600" />
                            }
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {u.details?.pharmacy_name || u.details?.company_name || u.full_name}
                            </h3>
                            <p className="text-sm text-gray-500">{u.email}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                u.role === 'pharmacy' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
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
                          </div>
                        </div>
                        <div className="flex gap-2 lg:flex-shrink-0">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Détails
                          </button>
                          <button
                            onClick={() => handleApprove(u.id)}
                            disabled={actionLoading === u.id}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50"
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
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pharmacies ({pharmacies.length})</h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Pharmacie</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Wilaya</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pharmacies.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{u.details?.pharmacy_name || u.full_name}</p>
                          <p className="text-sm text-gray-500">{u.details?.registry_number}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4 text-gray-600">{u.details?.wilaya || '-'}</td>
                        <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                        <td className="px-6 py-4">
                          {u.status === 'active' && (
                            <button
                              onClick={() => handleSuspend(u.id)}
                              disabled={actionLoading === u.id}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Suspendre
                            </button>
                          )}
                          {u.status === 'suspended' && (
                            <button
                              onClick={() => handleApprove(u.id)}
                              disabled={actionLoading === u.id}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Réactiver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suppliers Page */}
          {currentPage === 'suppliers' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fournisseurs ({suppliers.length})</h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Entreprise</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Wilaya</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {suppliers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{u.details?.company_name || u.full_name}</p>
                          <p className="text-sm text-gray-500">{u.details?.registry_number}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4 text-gray-600">{u.details?.wilaya || '-'}</td>
                        <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                        <td className="px-6 py-4">
                          {u.status === 'active' && (
                            <button
                              onClick={() => handleSuspend(u.id)}
                              disabled={actionLoading === u.id}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Suspendre
                            </button>
                          )}
                          {u.status === 'suspended' && (
                            <button
                              onClick={() => handleApprove(u.id)}
                              disabled={actionLoading === u.id}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Réactiver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All Users Page */}
          {currentPage === 'users' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Tous les utilisateurs ({allUsers.length})</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
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
                            u.role === 'pharmacy' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {u.role === 'admin' ? 'Admin' : u.role === 'pharmacy' ? 'Pharmacie' : 'Fournisseur'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(u.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
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
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
}
