import {
  Building2,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Star,
  Settings,
  Search,
  ChevronRight,
  Eye,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Check,
  X as XIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

interface AdminPagesProps {
  currentPage: string;
  getStatusBadge: (status: string) => JSX.Element;
  recentOrders: any[];
  recentDocuments: any[];
  setCurrentPage: (page: string) => void;
  stats: any[];
  navItems: any[];
}

export function AdminPages({ 
  currentPage, 
  getStatusBadge, 
  recentOrders, 
  recentDocuments, 
  setCurrentPage,
  stats,
  navItems 
}: AdminPagesProps) {
  const [documentFilter, setDocumentFilter] = useState<'all' | 'pharmacy' | 'supplier'>('all');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);

  // Sample grouped documents data by user
  const allUsers = [
    // Pharmacies
    { 
      id: 'PHAR-001', 
      userName: 'Pharmacie Centrale', 
      userType: 'pharmacy', 
      agrement: 'AGR-2024-001',
      phone: '+213 555 123 456',
      location: 'Alger Centre',
      documents: [
        { id: 'DOC-001', documentType: 'Agrément de pharmacie', uploadDate: '2026-01-12', status: 'pending', fileUrl: '#' },
        { id: 'DOC-002', documentType: 'Registre de Commerce', uploadDate: '2026-01-12', status: 'pending', fileUrl: '#' },
        { id: 'DOC-003', documentType: "Inscription à l'ordre des pharmaciens", uploadDate: '2026-01-12', status: 'pending', fileUrl: '#' },
      ]
    },
    { 
      id: 'PHAR-002', 
      userName: 'Pharmacie du Centre', 
      userType: 'pharmacy', 
      agrement: 'AGR-2024-002',
      phone: '+213 555 234 567',
      location: 'Oran',
      documents: [
        { id: 'DOC-004', documentType: 'Agrément de pharmacie', uploadDate: '2026-01-11', status: 'approved', fileUrl: '#' },
        { id: 'DOC-005', documentType: 'Registre de Commerce', uploadDate: '2026-01-11', status: 'approved', fileUrl: '#' },
        { id: 'DOC-006', documentType: "Inscription à l'ordre des pharmaciens", uploadDate: '2026-01-11', status: 'rejected', fileUrl: '#' },
      ]
    },
    { 
      id: 'PHAR-003', 
      userName: 'Pharmacie El Harrach', 
      userType: 'pharmacy', 
      agrement: 'AGR-2024-003',
      phone: '+213 555 345 678',
      location: 'El Harrach',
      documents: [
        { id: 'DOC-007', documentType: 'Agrément de pharmacie', uploadDate: '2026-01-10', status: 'pending', fileUrl: '#' },
        { id: 'DOC-008', documentType: 'Registre de Commerce', uploadDate: '2026-01-10', status: 'pending', fileUrl: '#' },
        { id: 'DOC-009', documentType: "Inscription à l'ordre des pharmaciens", uploadDate: '2026-01-10', status: 'approved', fileUrl: '#' },
      ]
    },
    { 
      id: 'PHAR-004', 
      userName: 'Pharmacie Hydra', 
      userType: 'pharmacy', 
      agrement: 'AGR-2024-004',
      phone: '+213 555 456 789',
      location: 'Hydra',
      documents: [
        { id: 'DOC-010', documentType: 'Agrément de pharmacie', uploadDate: '2026-01-09', status: 'approved', fileUrl: '#' },
        { id: 'DOC-011', documentType: 'Registre de Commerce', uploadDate: '2026-01-09', status: 'approved', fileUrl: '#' },
        { id: 'DOC-012', documentType: "Inscription à l'ordre des pharmaciens", uploadDate: '2026-01-09', status: 'approved', fileUrl: '#' },
      ]
    },
    // Suppliers
    { 
      id: 'SUPP-001', 
      userName: 'Pharma Distribution SA', 
      userType: 'supplier', 
      registry: 'RC-2023-456',
      phone: '+213 555 111 222',
      location: 'Alger',
      documents: [
        { id: 'DOC-013', documentType: 'Registre de commerce', uploadDate: '2026-01-12', status: 'approved', fileUrl: '#' },
        { id: 'DOC-014', documentType: "Autorisation d'exploitation", uploadDate: '2026-01-12', status: 'approved', fileUrl: '#' },
        { id: 'DOC-015', documentType: 'Certificat fiscal', uploadDate: '2026-01-12', status: 'approved', fileUrl: '#' },
      ]
    },
    { 
      id: 'SUPP-002', 
      userName: 'MediSupply Pro', 
      userType: 'supplier', 
      registry: 'RC-2023-789',
      phone: '+213 555 222 333',
      location: 'Oran',
      documents: [
        { id: 'DOC-016', documentType: 'Registre de commerce', uploadDate: '2026-01-11', status: 'pending', fileUrl: '#' },
        { id: 'DOC-017', documentType: "Autorisation d'exploitation", uploadDate: '2026-01-11', status: 'pending', fileUrl: '#' },
        { id: 'DOC-018', documentType: 'Certificat fiscal', uploadDate: '2026-01-11', status: 'pending', fileUrl: '#' },
      ]
    },
    { 
      id: 'SUPP-003', 
      userName: 'HealthCare Solutions', 
      userType: 'supplier', 
      registry: 'RC-2024-012',
      phone: '+213 555 333 444',
      location: 'Constantine',
      documents: [
        { id: 'DOC-019', documentType: 'Registre de commerce', uploadDate: '2026-01-10', status: 'approved', fileUrl: '#' },
        { id: 'DOC-020', documentType: "Autorisation d'exploitation", uploadDate: '2026-01-10', status: 'pending', fileUrl: '#' },
        { id: 'DOC-021', documentType: 'Certificat fiscal', uploadDate: '2026-01-10', status: 'rejected', fileUrl: '#' },
      ]
    },
    { 
      id: 'SUPP-004', 
      userName: 'Algeria Pharma Co', 
      userType: 'supplier', 
      registry: 'RC-2024-045',
      phone: '+213 555 444 555',
      location: 'Blida',
      documents: [
        { id: 'DOC-022', documentType: 'Registre de commerce', uploadDate: '2026-01-09', status: 'approved', fileUrl: '#' },
        { id: 'DOC-023', documentType: "Autorisation d'exploitation", uploadDate: '2026-01-09', status: 'approved', fileUrl: '#' },
        { id: 'DOC-024', documentType: 'Certificat fiscal', uploadDate: '2026-01-09', status: 'rejected', fileUrl: '#' },
      ]
    },
  ];

  const filteredUsers = documentFilter === 'all' 
    ? allUsers 
    : allUsers.filter(user => user.userType === documentFilter);

  const toggleUserExpand = (userId: string) => {
    if (expandedUsers.includes(userId)) {
      setExpandedUsers(expandedUsers.filter(id => id !== userId));
    } else {
      setExpandedUsers([...expandedUsers, userId]);
    }
  };

  const getDocumentSummary = (documents: any[]) => {
    const approved = documents.filter(d => d.status === 'approved').length;
    const pending = documents.filter(d => d.status === 'pending').length;
    const rejected = documents.filter(d => d.status === 'rejected').length;
    return { approved, pending, rejected, total: documents.length };
  };

  const handleApprove = (docId: string) => {
    alert(`Document ${docId} approuvé!`);
    setSelectedDocument(null);
  };

  const handleReject = (docId: string) => {
    alert(`Document ${docId} rejeté!`);
    setSelectedDocument(null);
  };

  return (
    <>
      {/* Overview Dashboard */}
      {currentPage === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <div style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  {stat.trend && (
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? '↑' : '↓'} {stat.trendValue}
                    </span>
                  )}
                </div>
                <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</p>
                {stat.subtext && <p className="text-xs text-gray-500">{stat.subtext}</p>}
              </div>
            ))}
          </div>

          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Commandes Récentes</h3>
                <button 
                  onClick={() => setCurrentPage('orders')}
                  className="text-[#009689] hover:text-[#00786F] text-sm font-medium flex items-center gap-1"
                >
                  Voir Tout
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{order.pharmacyName}</p>
                        <p className="text-xs text-gray-500">{order.product}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Qté: {order.quantity}</span>
                      <span className="font-medium text-gray-900">{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Documents Récents</h3>
                <button 
                  onClick={() => setCurrentPage('documents')}
                  className="text-[#009689] hover:text-[#00786F] text-sm font-medium flex items-center gap-1"
                >
                  Voir Tout
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {recentDocuments.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          doc.userType === 'pharmacy' ? 'bg-[#E0F7F4]' : 'bg-blue-50'
                        }`}>
                          <FileText className="w-4 h-4 text-[#009689]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.userName}</p>
                          <p className="text-xs text-gray-500 truncate">{doc.documentType}</p>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pharmacies, Suppliers, Products Pages */}
      {(currentPage === 'pharmacies' || currentPage === 'suppliers' || currentPage === 'products') && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            {currentPage === 'pharmacies' && <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
            {currentPage === 'suppliers' && <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
            {currentPage === 'products' && <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gestion des {navItems.find((item: any) => item.id === currentPage)?.label}
            </h3>
            <p className="text-gray-600 mb-6">
              Cette section est en cours de développement. Plus de fonctionnalités seront bientôt disponibles.
            </p>
            <button className="px-6 py-2 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors">
              Bientôt Disponible
            </button>
          </div>
        </div>
      )}

      {/* Orders, Agents, Reviews, Settings Pages */}
      {(currentPage === 'orders' || currentPage === 'agents' || currentPage === 'reviews' || currentPage === 'settings') && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            {currentPage === 'orders' && <FileCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
            {currentPage === 'agents' && <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
            {currentPage === 'reviews' && <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
            {currentPage === 'settings' && <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gestion des {navItems.find((item: any) => item.id === currentPage)?.label}
            </h3>
            <p className="text-gray-600 mb-6">
              Cette section est en cours de développement. Plus de fonctionnalités seront bientôt disponibles.
            </p>
            <button className="px-6 py-2 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors">
              Bientôt Disponible
            </button>
          </div>
        </div>
      )}

      {/* Document Management Page */}
      {currentPage === 'documents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Documents</h2>
              <p className="text-sm text-gray-600 mt-1">Vérifier et approuver les documents soumis</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => setDocumentFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  documentFilter === 'all' 
                    ? 'bg-[#009689] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous ({allUsers.length})
              </button>
              <button 
                onClick={() => setDocumentFilter('pharmacy')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  documentFilter === 'pharmacy' 
                    ? 'bg-[#009689] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pharmacies ({allUsers.filter(u => u.userType === 'pharmacy').length})
              </button>
              <button 
                onClick={() => setDocumentFilter('supplier')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  documentFilter === 'supplier' 
                    ? 'bg-[#009689] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fournisseurs ({allUsers.filter(u => u.userType === 'supplier').length})
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des utilisateurs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user: any) => {
                const summary = getDocumentSummary(user.documents);
                const isExpanded = expandedUsers.includes(user.id);
                
                return (
                  <div key={user.id} className="hover:bg-gray-50 transition-colors">
                    {/* User Header Row */}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            user.userType === 'pharmacy' ? 'bg-[#E0F7F4]' : 'bg-blue-50'
                          }`}>
                            {user.userType === 'pharmacy' ? (
                              <Building2 className="w-6 h-6 text-[#009689]" />
                            ) : (
                              <Package className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{user.userName}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                              <p className="text-xs text-gray-500">
                                {user.userType === 'pharmacy' ? user.agrement : user.registry}
                              </p>
                              <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {user.location}
                              </div>
                              <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                                <Phone className="w-3 h-3" />
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Document Summary */}
                          <div className="hidden sm:flex items-center gap-1">
                            {summary.approved > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                                {summary.approved} ✓
                              </span>
                            )}
                            {summary.pending > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium">
                                {summary.pending} ⏳
                              </span>
                            )}
                            {summary.rejected > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">
                                {summary.rejected} ✗
                              </span>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => toggleUserExpand(user.id)}
                            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                              isExpanded 
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                : 'bg-[#009689] text-white hover:bg-[#00786F]'
                            }`}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                <span className="hidden sm:inline">Masquer</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                <span className="hidden sm:inline">Voir ({user.documents.length})</span>
                                <span className="sm:hidden">{user.documents.length}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Mobile Document Summary */}
                      <div className="sm:hidden flex items-center gap-1 mt-3">
                        {summary.approved > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                            {summary.approved} Approuvés
                          </span>
                        )}
                        {summary.pending > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium">
                            {summary.pending} En attente
                          </span>
                        )}
                        {summary.rejected > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">
                            {summary.rejected} Rejetés
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded Documents */}
                    {isExpanded && (
                      <div className="px-4 pb-4 bg-gray-50">
                        <div className="space-y-2">
                          {user.documents.map((doc: any) => (
                            <div 
                              key={doc.id} 
                              className="bg-white rounded-lg border border-gray-200 p-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{doc.documentType}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Téléchargé le {doc.uploadDate}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3 justify-between sm:justify-end">
                                  <div>{getStatusBadge(doc.status)}</div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => setSelectedDocument({ 
                                        ...doc, 
                                        userName: user.userName, 
                                        userType: user.userType, 
                                        agrement: user.agrement, 
                                        registry: user.registry 
                                      })}
                                      className="p-2 text-[#009689] hover:bg-[#E0F7F4] rounded-lg transition-colors" 
                                      title="Voir Document"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    {doc.status === 'pending' && (
                                      <>
                                        <button 
                                          onClick={() => handleApprove(doc.id)}
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                                          title="Approuver"
                                        >
                                          <Check className="w-5 h-5" />
                                        </button>
                                        <button 
                                          onClick={() => handleReject(doc.id)}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                          title="Rejeter"
                                        >
                                          <XIcon className="w-5 h-5" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDocument(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.documentType}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDocument.userName}</p>
              </div>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {selectedDocument.userType === 'pharmacy' ? 'Pharmacie' : 'Fournisseur'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">N° {selectedDocument.userType === 'pharmacy' ? 'Agrément' : 'Registre'}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDocument.userType === 'pharmacy' ? selectedDocument.agrement : selectedDocument.registry}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date de téléchargement</p>
                  <p className="text-sm font-medium text-gray-900">{selectedDocument.uploadDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Statut</p>
                  <div>{getStatusBadge(selectedDocument.status)}</div>
                </div>
              </div>

              {/* Document Preview Placeholder */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Aperçu du document</p>
                <p className="text-sm text-gray-500">{selectedDocument.documentType}</p>
              </div>
            </div>

            {selectedDocument.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button 
                  onClick={() => handleReject(selectedDocument.id)}
                  className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Rejeter le document
                </button>
                <button 
                  onClick={() => handleApprove(selectedDocument.id)}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Approuver le document
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}