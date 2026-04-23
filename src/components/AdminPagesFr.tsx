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
  X as XIcon
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
      {/* Page Vue d'ensemble */}
      {currentPage === 'overview' && (
        <>
          {/* Grille de statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat: any) => (
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

          {/* Commandes et Documents Récents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Commandes Récentes */}
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

              {/* Vue tableau Desktop/Tablet */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Commande</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pharmacie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.pharmacyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-[#009689] hover:text-[#00786F] text-sm font-medium">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vue carte Mobile */}
              <div className="sm:hidden divide-y divide-gray-200">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{order.id}</p>
                        <p className="text-sm text-gray-600 mb-1">{order.pharmacyName}</p>
                        <p className="text-sm font-medium text-gray-900">{order.total}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <button className="w-full min-h-[44px] px-4 py-2.5 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      Voir Détails
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Récents */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Documents Récents</h2>
                <button 
                  onClick={() => setCurrentPage('documents')}
                  className="text-sm text-[#009689] hover:text-[#00786F] flex items-center gap-1"
                >
                  Voir Tout
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Vue tableau Desktop/Tablet */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentDocuments.map((doc: any) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.userName}</p>
                            <p className="text-xs text-gray-500 capitalize">{doc.userType}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.documentType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.uploadDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(doc.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-[#009689] hover:text-[#00786F] text-sm font-medium">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vue carte Mobile */}
              <div className="sm:hidden divide-y divide-gray-200">
                {recentDocuments.map((doc: any) => (
                  <div key={doc.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{doc.userName}</p>
                        <p className="text-sm text-gray-600 mb-1 capitalize">{doc.userType}</p>
                        <p className="text-sm text-gray-600 mb-1">{doc.documentType}</p>
                        <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                    <button className="w-full min-h-[44px] px-4 py-2.5 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      Voir Détails
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Page Pharmacies */}
      {currentPage === 'pharmacies' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Toutes les Pharmacies</h2>
              <p className="text-sm text-gray-600 mt-1">Gérer et vérifier les comptes pharmacies</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Ajouter Pharmacie
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des pharmacies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtrer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Pharmacie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agrément</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { id: 1, name: 'Pharmacie Centrale', agrement: 'AGR-2024-001', location: 'Alger Centre', phone: '+213 555 123 456', status: 'approved' },
                    { id: 2, name: 'Pharmacie du Centre', agrement: 'AGR-2024-002', location: 'Oran', phone: '+213 555 234 567', status: 'approved' },
                    { id: 3, name: 'Pharmacie El Harrach', agrement: 'AGR-2024-003', location: 'El Harrach', phone: '+213 555 345 678', status: 'pending' },
                    { id: 4, name: 'Pharmacie Hydra', agrement: 'AGR-2024-004', location: 'Hydra', phone: '+213 555 456 789', status: 'approved' },
                    { id: 5, name: 'Pharmacie Bab Ezzouar', agrement: 'AGR-2024-005', location: 'Bab Ezzouar', phone: '+213 555 567 890', status: 'pending' },
                    { id: 6, name: 'Pharmacie Sétif', agrement: 'AGR-2024-006', location: 'Sétif', phone: '+213 555 678 901', status: 'approved' },
                    { id: 7, name: 'Pharmacie Constantine', agrement: 'AGR-2024-007', location: 'Constantine', phone: '+213 555 789 012', status: 'rejected' },
                    { id: 8, name: 'Pharmacie Blida', agrement: 'AGR-2024-008', location: 'Blida', phone: '+213 555 890 123', status: 'approved' }
                  ].map((pharmacy) => (
                    <tr key={pharmacy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E0F7F4] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[#009689]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{pharmacy.name}</p>
                            <p className="text-xs text-gray-500">ID: {pharmacy.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{pharmacy.agrement}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {pharmacy.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {pharmacy.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(pharmacy.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-[#009689] hover:text-[#00786F]" title="Voir Détails">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-700" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700" title="Supprimer">
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
        </div>
      )}

      {/* Page Fournisseurs */}
      {currentPage === 'suppliers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tous les Fournisseurs</h2>
              <p className="text-sm text-gray-600 mt-1">Gérer et vérifier les comptes fournisseurs</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Ajouter Fournisseur
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des fournisseurs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtrer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Entreprise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Registre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { id: 1, name: 'Pharma Distribution SA', registry: 'RC-2023-456', products: 234, phone: '+213 555 111 222', rating: 4.8, status: 'approved' },
                    { id: 2, name: 'MediSupply Pro', registry: 'RC-2023-789', products: 156, phone: '+213 555 222 333', rating: 4.5, status: 'approved' },
                    { id: 3, name: 'HealthCare Solutions', registry: 'RC-2024-012', products: 89, phone: '+213 555 333 444', rating: 4.2, status: 'pending' },
                    { id: 4, name: 'Algeria Pharma Co', registry: 'RC-2024-045', products: 312, phone: '+213 555 444 555', rating: 4.9, status: 'approved' },
                    { id: 5, name: 'Global Med Supplies', registry: 'RC-2024-078', products: 178, phone: '+213 555 555 666', rating: 4.6, status: 'approved' },
                    { id: 6, name: 'MedTech Algeria', registry: 'RC-2024-089', products: 145, phone: '+213 555 666 777', rating: 4.3, status: 'pending' },
                    { id: 7, name: 'BioPharm Industries', registry: 'RC-2024-123', products: 267, phone: '+213 555 777 888', rating: 4.7, status: 'approved' }
                  ].map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                            <p className="text-xs text-gray-500">ID: {supplier.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.registry}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{supplier.products} produits</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {supplier.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(supplier.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-[#009689] hover:text-[#00786F]" title="Voir Détails">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-700" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700" title="Supprimer">
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
        </div>
      )}

      {/* Page Produits */}
      {currentPage === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Catalogue Produits</h2>
              <p className="text-sm text-gray-600 mt-1">Gérer tous les produits de la plateforme</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Exporter Catalogue
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtrer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Produit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { id: 1, name: 'Paracétamol 500mg', category: 'Analgésique', supplier: 'Pharma Distribution SA', price: '150 DZD', stock: 2500, status: 'En stock' },
                    { id: 2, name: 'Amoxicilline 1g', category: 'Antibiotique', supplier: 'MediSupply Pro', price: '170 DZD', stock: 1800, status: 'En stock' },
                    { id: 3, name: 'Ibuprofène 400mg', category: 'Anti-inflammatoire', supplier: 'Algeria Pharma Co', price: '164 DZD', stock: 3200, status: 'En stock' },
                    { id: 4, name: 'Doliprane 1000mg', category: 'Analgésique', supplier: 'HealthCare Solutions', price: '150 DZD', stock: 89, status: 'Stock bas' },
                    { id: 5, name: 'Aspirine 100mg', category: 'Antiagrégant', supplier: 'Global Med Supplies', price: '109 DZD', stock: 4100, status: 'En stock' },
                    { id: 6, name: 'Oméprazole 20mg', category: 'Anti-acide', supplier: 'MedTech Algeria', price: '185 DZD', stock: 1200, status: 'En stock' },
                    { id: 7, name: 'Metformine 850mg', category: 'Antidiabétique', supplier: 'BioPharm Industries', price: '95 DZD', stock: 45, status: 'Stock bas' }
                  ].map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">SKU: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock.toLocaleString()} unités</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs ${product.status === 'En stock' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-[#009689] hover:text-[#00786F]" title="Voir Détails">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-700" title="Modifier">
                            <Edit className="w-4 h-4" />
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

      {/* Pages Commandes, Agents, Documents, Avis, Paramètres avec contenu temporaire */}
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

      {/* Page Documents - Gestion des Documents */}
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

          {/* Documents Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                />
              </div>
            </div>

            {/* Desktop/Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.userType === 'pharmacy' ? 'bg-[#E0F7F4]' : 'bg-blue-50'
                          }`}>
                            {user.userType === 'pharmacy' ? (
                              <Building2 className="w-5 h-5 text-[#009689]" />
                            ) : (
                              <Package className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                            <p className="text-xs text-gray-500">
                              {user.userType === 'pharmacy' ? user.agrement : user.registry}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {user.documents.length} documents
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {user.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {getDocumentSummary(user.documents).approved}/{getDocumentSummary(user.documents).total}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleUserExpand(user.id)}
                            className="text-[#009689] hover:text-[#00786F]" 
                            title="Voir Documents"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredUsers.map((user: any) => (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.userType === 'pharmacy' ? 'bg-[#E0F7F4]' : 'bg-blue-50'
                      }`}>
                        {user.userType === 'pharmacy' ? (
                          <Building2 className="w-5 h-5 text-[#009689]" />
                        ) : (
                          <Package className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                        <p className="text-xs text-gray-500">
                          {user.userType === 'pharmacy' ? user.agrement : user.registry}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {getDocumentSummary(user.documents).approved}/{getDocumentSummary(user.documents).total}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {user.documents.length} documents
                      </div>
                    </p>
                    <p className="text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {user.location}
                      </div>
                    </p>
                    <p className="text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {user.phone}
                      </div>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleUserExpand(user.id)}
                      className="flex-1 px-4 py-2 bg-[#009689] hover:bg-[#00786F] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Expanded User Documents */}
            {expandedUsers.map((userId: string) => {
              const user = allUsers.find(u => u.id === userId);
              if (!user) return null;
              return (
                <div key={userId} className="p-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Documents de {user.userName}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Document</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {user.documents.map((doc: any) => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-600">{doc.documentType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.uploadDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(doc.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setSelectedDocument(doc)}
                                  className="text-[#009689] hover:text-[#00786F]" 
                                  title="Voir Document"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {doc.status === 'pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleApprove(doc.id)}
                                      className="text-green-600 hover:text-green-700" 
                                      title="Approuver"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleReject(doc.id)}
                                      className="text-red-600 hover:text-red-700" 
                                      title="Rejeter"
                                    >
                                      <XIcon className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
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