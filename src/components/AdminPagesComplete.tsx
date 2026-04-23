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
  onViewProfile?: (user: any) => void;
}

export function AdminPages({ 
  currentPage, 
  getStatusBadge, 
  recentOrders, 
  recentDocuments, 
  setCurrentPage,
  stats,
  navItems,
  onViewProfile
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
                    { id: 1, name: 'Pharmacie Centrale', agrement: 'AGR-2024-001', location: 'Alger Centre', phone: '+213 555 123 456', status: 'approved', email: 'centrale@pharmacy.dz', joinDate: '2025-12-15' },
                    { id: 2, name: 'Pharmacie du Centre', agrement: 'AGR-2024-002', location: 'Oran', phone: '+213 555 234 567', status: 'approved', email: 'centre@pharmacy.dz', joinDate: '2025-12-20' },
                    { id: 3, name: 'Pharmacie El Harrach', agrement: 'AGR-2024-003', location: 'El Harrach', phone: '+213 555 345 678', status: 'pending', email: 'harrach@pharmacy.dz', joinDate: '2026-01-02' },
                    { id: 4, name: 'Pharmacie Hydra', agrement: 'AGR-2024-004', location: 'Hydra', phone: '+213 555 456 789', status: 'approved', email: 'hydra@pharmacy.dz', joinDate: '2025-11-10' },
                    { id: 5, name: 'Pharmacie Bab Ezzouar', agrement: 'AGR-2024-005', location: 'Bab Ezzouar', phone: '+213 555 567 890', status: 'pending', email: 'bez@pharmacy.dz', joinDate: '2026-01-05' },
                    { id: 6, name: 'Pharmacie Sétif', agrement: 'AGR-2024-006', location: 'Sétif', phone: '+213 555 678 901', status: 'approved', email: 'setif@pharmacy.dz', joinDate: '2025-10-22' },
                    { id: 7, name: 'Pharmacie Constantine', agrement: 'AGR-2024-007', location: 'Constantine', phone: '+213 555 789 012', status: 'rejected', email: 'constantine@pharmacy.dz', joinDate: '2026-01-08' },
                    { id: 8, name: 'Pharmacie Blida', agrement: 'AGR-2024-008', location: 'Blida', phone: '+213 555 890 123', status: 'approved', email: 'blida@pharmacy.dz', joinDate: '2025-12-01' }
                  ].map((pharmacy) => (
                    <tr key={pharmacy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E0F7F4] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[#009689]" />
                          </div>
                          <div>
                            <button
                              onClick={() => onViewProfile?.({
                                id: `PHAR-00${pharmacy.id}`,
                                name: pharmacy.name,
                                type: 'pharmacy',
                                email: pharmacy.email,
                                phone: pharmacy.phone,
                                address: pharmacy.location,
                                registryNumber: pharmacy.agrement,
                                joinDate: pharmacy.joinDate,
                                status: pharmacy.status === 'approved' ? 'active' : pharmacy.status,
                                documents: [
                                  { name: 'Agrément de pharmacie', status: pharmacy.status },
                                  { name: 'Registre de Commerce', status: pharmacy.status },
                                  { name: "Inscription a l'ordre des pharmaciens", status: pharmacy.status }
                                ],
                                stats: { orders: Math.floor(Math.random() * 100) }
                              })}
                              className="text-sm font-medium text-[#009689] hover:text-[#00786F] hover:underline text-left"
                            >
                              {pharmacy.name}
                            </button>
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
                    { id: 1, name: 'Pharma Distribution SA', registry: 'RC-2023-456', products: 234, phone: '+213 555 111 222', rating: 4.8, status: 'approved', email: 'contact@pharma-dist.dz', location: 'Alger', joinDate: '2023-06-15' },
                    { id: 2, name: 'MediSupply Pro', registry: 'RC-2023-789', products: 156, phone: '+213 555 222 333', rating: 4.5, status: 'approved', email: 'info@medisupply.dz', location: 'Oran', joinDate: '2023-08-20' },
                    { id: 3, name: 'HealthCare Solutions', registry: 'RC-2024-012', products: 89, phone: '+213 555 333 444', rating: 4.2, status: 'pending', email: 'contact@healthcare.dz', location: 'Constantine', joinDate: '2024-01-10' },
                    { id: 4, name: 'Algeria Pharma Co', registry: 'RC-2024-045', products: 312, phone: '+213 555 444 555', rating: 4.9, status: 'approved', email: 'info@algeria-pharma.dz', location: 'Blida', joinDate: '2024-02-15' },
                    { id: 5, name: 'Global Med Supplies', registry: 'RC-2024-078', products: 178, phone: '+213 555 555 666', rating: 4.6, status: 'approved', email: 'contact@globalmed.dz', location: 'Annaba', joinDate: '2024-03-22' },
                    { id: 6, name: 'MedTech Algeria', registry: 'RC-2024-089', products: 145, phone: '+213 555 666 777', rating: 4.3, status: 'pending', email: 'info@medtech.dz', location: 'Sétif', joinDate: '2024-04-05' },
                    { id: 7, name: 'BioPharm Industries', registry: 'RC-2024-123', products: 267, phone: '+213 555 777 888', rating: 4.7, status: 'approved', email: 'contact@biopharm.dz', location: 'Tlemcen', joinDate: '2024-05-12' }
                  ].map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <button
                              onClick={() => onViewProfile?.({
                                id: `SUPP-00${supplier.id}`,
                                name: supplier.name,
                                type: 'supplier',
                                email: supplier.email,
                                phone: supplier.phone,
                                address: supplier.location,
                                registryNumber: supplier.registry,
                                joinDate: supplier.joinDate,
                                status: supplier.status === 'approved' ? 'active' : supplier.status,
                                documents: [
                                  { name: 'Registre de commerce', status: supplier.status },
                                  { name: "Autorisation d'exploitation", status: supplier.status },
                                  { name: 'Certificat fiscal', status: supplier.status }
                                ],
                                stats: { products: supplier.products, revenue: `${(supplier.products * 1250).toLocaleString()} DZD` }
                              })}
                              className="text-sm font-medium text-[#009689] hover:text-[#00786F] hover:underline text-left"
                            >
                              {supplier.name}
                            </button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Commercial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DCI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix (DZD)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UG (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { id: 'MED-001', reference: 'MED-001', name: 'Doliprane 500mg', dci: 'Paracétamol', supplier: 'Pharma Distribution SA', price: '25.50', ug: 10, status: 'Disponible' },
                    { id: 'MED-002', reference: 'MED-002', name: 'Clamoxyl 1g', dci: 'Amoxicilline', supplier: 'MediSupply Pro', price: '85.00', ug: 15, status: 'Indisponible' },
                    { id: 'MED-003', reference: 'MED-003', name: 'Antalfene 400mg', dci: 'Ibuprofène', supplier: 'Algeria Pharma Co', price: '35.00', ug: 0, status: 'Disponible' },
                    { id: 'MED-004', reference: 'MED-004', name: 'Efferalgan 1000mg', dci: 'Paracétamol', supplier: 'HealthCare Solutions', price: '28.50', ug: 12, status: 'Disponible' },
                    { id: 'MED-005', reference: 'MED-005', name: 'Aspirine 100mg', dci: 'Acide acétylsalicylique', supplier: 'Global Med Supplies', price: '15.00', ug: 8, status: 'Disponible' },
                    { id: 'MED-006', reference: 'MED-006', name: 'Mopral 20mg', dci: 'Oméprazole', supplier: 'MedTech Algeria', price: '185.00', ug: 18, status: 'Disponible' },
                    { id: 'MED-007', reference: 'MED-007', name: 'Glucophage 850mg', dci: 'Metformine', supplier: 'BioPharm Industries', price: '95.00', ug: 5, status: 'Indisponible' }
                  ].map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.dci}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price} DZD</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.ug}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.status === 'Disponible' 
                            ? 'bg-[#d0fae5] text-[#006045]' 
                            : 'bg-[#ffe2e2] text-[#9f0712]'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-[#009689] hover:text-[#00786F]" title="Modifier">
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