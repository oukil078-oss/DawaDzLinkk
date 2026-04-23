import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, CircleCheck as CheckCircle, Loader as Loader2, ShieldCheck } from 'lucide-react';
import { adminApi } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

type Tab = 'password' | 'email';

export function AdminSettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('password');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailStep, setEmailStep] = useState<'form' | 'verify'>('form');
  const [emailLoading, setEmailLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast({ type: 'error', title: 'Erreur', message: 'Les mots de passe ne correspondent pas' });
      return;
    }
    if (newPassword.length < 8) {
      showToast({ type: 'error', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }
    try {
      setPasswordLoading(true);
      await adminApi.changeAdminPassword(currentPassword, newPassword);
      showToast({ type: 'success', title: 'Succès', message: 'Mot de passe modifié avec succès' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez entrer une adresse email valide' });
      return;
    }
    try {
      setEmailLoading(true);
      await adminApi.requestEmailChange(newEmail);
      setEmailStep('verify');
      showToast({ type: 'success', title: 'Code envoyé', message: `Un code de vérification a été envoyé à ${newEmail}` });
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCode.trim()) {
      showToast({ type: 'error', title: 'Erreur', message: 'Veuillez entrer le code de vérification' });
      return;
    }
    try {
      setEmailLoading(true);
      await adminApi.confirmEmailChange(emailCode);
      showToast({ type: 'success', title: 'Succès', message: 'Adresse email modifiée avec succès. Veuillez vous reconnecter.' });
      setNewEmail('');
      setEmailCode('');
      setEmailStep('form');
    } catch (error: any) {
      showToast({ type: 'error', title: 'Erreur', message: error.message });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Paramètres du compte</h2>
        <p className="text-sm text-gray-600 mt-1">Gérer votre mot de passe et votre adresse email</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-[#009689] border-b-2 border-[#009689] bg-[#E0F7F4]/30'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            Changer le mot de passe
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'email'
                ? 'text-[#009689] border-b-2 border-[#009689] bg-[#E0F7F4]/30'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Mail className="w-4 h-4" />
            Changer l'email
          </button>
        </div>

        <div className="p-6 max-w-lg">
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Compte actuel : <span className="font-medium">{user?.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <PasswordRule met={newPassword.length >= 8} label="Au moins 8 caractères" />
                    <PasswordRule met={/[A-Z]/.test(newPassword)} label="Au moins une majuscule" />
                    <PasswordRule met={/[0-9]/.test(newPassword)} label="Au moins un chiffre" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pr-10 pl-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-300 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-[#009689]'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-600 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full py-2.5 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-colors"
              >
                {passwordLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Modifier le mot de passe
              </button>
            </form>
          )}

          {activeTab === 'email' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Email actuel : <span className="font-medium">{user?.email}</span>
                </p>
              </div>

              {emailStep === 'form' ? (
                <form onSubmit={handleRequestEmailChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nouvelle adresse email
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent"
                      placeholder="nouvelle@email.com"
                    />
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-sm text-amber-700">
                      Un code de vérification sera envoyé à la nouvelle adresse email. Vous devrez le confirmer pour finaliser le changement.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={emailLoading || !newEmail}
                    className="w-full py-2.5 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    {emailLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    Envoyer le code de vérification
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmEmailChange} className="space-y-5">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">
                      Un code de vérification a été envoyé à <span className="font-medium">{newEmail}</span>. Vérifiez votre boîte de réception.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Code de vérification
                    </label>
                    <input
                      type="text"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      required
                      maxLength={6}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689] focus:border-transparent text-center text-lg font-mono tracking-widest"
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setEmailStep('form'); setEmailCode(''); }}
                      className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={emailLoading || !emailCode}
                      className="flex-1 py-2.5 bg-[#009689] text-white rounded-lg hover:bg-[#00786F] disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-colors"
                    >
                      {emailLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Confirmer
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRequestEmailChange}
                    disabled={emailLoading}
                    className="w-full text-sm text-[#009689] hover:text-[#00786F] text-center"
                  >
                    Renvoyer le code
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
      <CheckCircle className={`w-3.5 h-3.5 ${met ? 'text-green-500' : 'text-gray-300'}`} />
      {label}
    </div>
  );
}
