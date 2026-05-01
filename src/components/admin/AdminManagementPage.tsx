import { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard as Edit, Shield, ShieldCheck, Eye, EyeOff, X, Loader as Loader2, Crown } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const SUPER_ADMIN_EMAIL = 'admin@dawalink.dz';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  status: string;
  created_at: string;
  is_super: boolean;
}

interface AddAdminForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

interface EditAdminForm {
  full_name: string;
  phone: string;
  password: string;
}

export function AdminManagementPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddAdminForm>({ full_name: '', email: '', phone: '', password: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);

  const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<EditAdminForm>({ full_name: '', phone: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listAdmins();
      setAdmins(data);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.full_name.trim() || !addForm.email.trim() || !addForm.password.trim()) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }
    try {
      setAddLoading(true);
      await adminApi.createAdmin(addForm);
      showToast({ type: 'success', title: 'Succès', message: 'Administrateur créé. Les identifiants ont été envoyés par email.' });
      setShowAddModal(false);
      setAddForm({ full_name: '', email: '', phone: '', password: '' });
      loadAdmins();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    } finally {
      setAddLoading(false);
    }
  };

  const openEdit = (admin: AdminUser) => {
    setEditAdmin(admin);
    setEditForm({ full_name: admin.full_name, phone: admin.phone || '', password: '' });
    setShowEditPassword(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdmin) return;
    const payload: any = {};
    if (editForm.full_name.trim()) payload.full_name = editForm.full_name;
    if (editForm.phone.trim()) payload.phone = editForm.phone;
    if (editForm.password.trim()) {
      if (editForm.password.length < 6) {
        showToast({ type: 'error', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 6 caractères' });
        return;
      }
      payload.password = editForm.password;
    }
    try {
      setEditLoading(true);
      await adminApi.updateAdmin(editAdmin.id, payload);
      showToast({ type: 'success', title: 'Succès', message: 'Administrateur mis à jour' });
      setEditAdmin(null);
      loadAdmins();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Supprimer l'administrateur "${admin.full_name}" (${admin.email}) ? Cette action est irréversible.`)) return;
    try {
      setActionLoading(admin.id);
      await adminApi.deleteAdmin(admin.id);
      showToast({ type: 'success', title: 'Succès', message: 'Administrateur supprimé' });
      loadAdmins();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Erreur', message: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#009689]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des Administrateurs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isSuperAdmin
              ? 'Gérez les comptes administrateurs de la plateforme'
              : 'Consultez la liste des administrateurs'}
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter un admin
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Seul le Super Administrateur peut ajouter, modifier ou supprimer des administrateurs.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">{admins.length} administrateur{admins.length !== 1 ? 's' : ''}</p>
        </div>

        {admins.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun administrateur trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    admin.is_super ? 'bg-amber-100' : 'bg-[#E0F7F4]'
                  }`}>
                    {admin.is_super
                      ? <Crown className="w-5 h-5 text-amber-600" />
                      : <ShieldCheck className="w-5 h-5 text-[#009689]" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{admin.full_name}</p>
                      {admin.is_super && (
                        <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">
                          Super Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                    {admin.phone && (
                      <p className="text-xs text-gray-400">{admin.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-2 hidden sm:block">
                    <p className="text-xs text-gray-400">
                      Ajouté le {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      Actif
                    </span>
                  </div>

                  {isSuperAdmin && !admin.is_super && (
                    <>
                      <button
                        onClick={() => openEdit(admin)}
                        className="p-2 text-gray-400 hover:text-[#009689] hover:bg-[#E0F7F4] rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
                        disabled={actionLoading === admin.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {actionLoading === admin.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ajouter un administrateur</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.full_name}
                  onChange={(e) => setAddForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Prénom Nom"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@example.com"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={addForm.phone}
                  onChange={(e) => setAddForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+213 5XX XXX XXX"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    value={addForm.password}
                    onChange={(e) => setAddForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 6 caractères"
                    required
                    minLength={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Les identifiants seront envoyés par email à admin@dawadzlink.com</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 px-4 py-2.5 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Créer l'admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Modifier l'administrateur</h3>
              <button onClick={() => setEditAdmin(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editAdmin.email}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe <span className="text-gray-400 font-normal">(laisser vide pour ne pas changer)</span>
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editForm.password}
                    onChange={(e) => setEditForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 6 caractères"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditAdmin(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2.5 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
