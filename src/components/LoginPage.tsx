import { ArrowLeft, Package, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { UserType } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface LoginPageProps {
  userType: UserType;
  onLoginSuccess: () => void;
  onBack: () => void;
  onGoToRegister: () => void;
  onForgotPassword?: () => void;
}

interface RejectionInfo {
  rejection_reason: string;
  rejected_documents: string[];
  reviewed_at: string | null;
}

export function LoginPage({ userType, onLoginSuccess, onBack, onGoToRegister, onForgotPassword }: LoginPageProps) {
  const { login } = useAuth();
  const { showDevelopmentToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectionInfo, setRejectionInfo] = useState<RejectionInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRejectionInfo(null);
    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      // Check if it's a rejection error
      try {
        const detail = typeof err.message === 'string' ? JSON.parse(err.message) : err.message;
        if (detail?.type === 'account_rejected') {
          setRejectionInfo(detail.rejection_info);
          setError(detail.message);
        } else {
          setError(typeof detail === 'string' ? detail : (detail?.message || 'Échec de la connexion.'));
        }
      } catch {
        setError(err.message || 'Échec de la connexion. Vérifiez vos identifiants.');
      }
    } finally {
      setLoading(false);
    }
  };

  const title = userType === 'pharmacy' ? 'Connexion Pharmacie' : 'Connexion Fournisseur';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #00BBA7 0%, #009689 100%)' }}
              >
                <Package className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl text-[#00786F]">DawaDzLink</h1>
                <p className="text-xs text-gray-500">Votre partenaire B2B</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 mb-8 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.67} />
            <span className="text-base">Retour</span>
          </button>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl text-gray-900 mb-6">{title}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@exemple.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                  data-testid="login-email-input"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                  data-testid="login-password-input"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => onForgotPassword ? onForgotPassword() : showDevelopmentToast()}
                  className="text-sm hover:underline"
                  style={{ color: '#009689' }}
                  data-testid="forgot-password-btn"
                >
                  Mot de passe oublié?
                </button>
              </div>

              {/* Error Message */}
              {error && !rejectionInfo && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Rejection Info */}
              {rejectionInfo && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3" data-testid="rejection-info">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Compte rejeté</p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                  {rejectionInfo.rejection_reason && (
                    <div className="bg-white/60 rounded-md p-3">
                      <p className="text-xs font-medium text-red-800">Raison :</p>
                      <p className="text-sm text-red-700">{rejectionInfo.rejection_reason}</p>
                    </div>
                  )}
                  {rejectionInfo.rejected_documents && rejectionInfo.rejected_documents.length > 0 && (
                    <div className="bg-white/60 rounded-md p-3">
                      <p className="text-xs font-medium text-red-800">Document(s) concerné(s) :</p>
                      <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                        {rejectionInfo.rejected_documents.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={onGoToRegister}
                    className="w-full py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    data-testid="re-register-btn"
                  >
                    Se réinscrire avec de nouveaux documents
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white rounded-lg text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#009689' }}
                data-testid="login-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onGoToRegister}
                  className="text-sm text-gray-600 hover:text-[#009689] transition-colors"
                >
                  Vous n'avez pas de compte? <span className="underline">S'inscrire</span>
                </button>
              </div>
            </form>
          </div>


        </div>
      </div>
    </div>
  );
}
