import { X, Mail, Phone, MapPin, FileText, Calendar, CheckCircle, Ban, Trash2, AlertTriangle } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  type: 'pharmacy' | 'supplier';
  email: string;
  phone: string;
  address: string;
  registryNumber: string;
  joinDate: string;
  status: 'active' | 'pending' | 'suspended' | 'banned';
  documents: {
    name: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  stats?: {
    orders?: number;
    products?: number;
    revenue?: string;
  };
}

interface UserProfileModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onBan: (userId: string) => void;
  onSuspend: (userId: string) => void;
  onRemove: (userId: string) => void;
}

export function UserProfileModal({ user, onClose, onBan, onSuspend, onRemove }: UserProfileModalProps) {
  if (!user) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      suspended: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Suspendu' },
      banned: { bg: 'bg-red-100', text: 'text-red-800', label: 'Banni' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approuvé' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeté' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {user.type === 'pharmacy' ? 'Pharmacie' : 'Fournisseur'} • ID: {user.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Statut</span>
            {getStatusBadge(user.status)}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations de Contact</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Téléphone</p>
                  <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-600">Adresse</p>
                  <p className="text-sm font-medium text-gray-900">{user.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Détails d'Inscription</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {user.type === 'pharmacy' ? "Numéro d'agrément" : 'Numéro de registre'}
                </span>
                <span className="text-sm font-medium text-gray-900">{user.registryNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Date d'inscription</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{user.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Documents Soumis</h3>
            <div className="space-y-2">
              {user.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          {user.stats && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
              <div className="grid grid-cols-3 gap-4">
                {user.stats.orders !== undefined && (
                  <div className="bg-[#E0F7F4] rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Commandes</p>
                    <p className="text-2xl font-semibold text-[#009689]">{user.stats.orders}</p>
                  </div>
                )}
                {user.stats.products !== undefined && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Produits</p>
                    <p className="text-2xl font-semibold text-blue-600">{user.stats.products}</p>
                  </div>
                )}
                {user.stats.revenue && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Revenus</p>
                    <p className="text-xl font-semibold text-green-600">{user.stats.revenue}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Actions Administrateur</h3>
            <div className="flex flex-wrap gap-3">
              {user.status !== 'suspended' && user.status !== 'banned' && (
                <button
                  onClick={() => {
                    if (window.confirm(`Êtes-vous sûr de vouloir suspendre ${user.name}?`)) {
                      onSuspend(user.id);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Suspendre
                </button>
              )}
              {user.status !== 'banned' && (
                <button
                  onClick={() => {
                    if (window.confirm(`Êtes-vous sûr de vouloir bannir ${user.name}? Cette action est irréversible.`)) {
                      onBan(user.id);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Bannir
                </button>
              )}
              <button
                onClick={() => {
                  if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${user.name}? Cette action est irréversible.`)) {
                    onRemove(user.id);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
