import { ArrowLeft, Package, AlertCircle, Loader2, CheckCircle, Eye, EyeOff, Mail, KeyRound, Lock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { UserType } from '../App';
import { authApi } from '../lib/api';

interface ForgotPasswordPageProps {
  userType: UserType;
  onBack: () => void;
  onGoToLogin: () => void;
}

type Step = 1 | 2 | 3 | 4;

export function ForgotPasswordPage({ userType, onBack, onGoToLogin }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);

  const title = userType === 'admin' ? 'Administrateur' : userType === 'pharmacy' ? 'Pharmacie' : 'Fournisseur';

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Step 1: Request reset code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setStep(2);
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres.');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.verifyResetCode(email, code);
      setResetToken(data.reset_token);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setCode('');
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(resetToken, newPassword);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // OTP individual digit inputs
  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newCode = code.split('');
    newCode[index] = digit;
    const updated = newCode.join('').slice(0, 6);
    setCode(updated);
    // Auto-focus next
    if (digit && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        const newCode = code.split('');
        newCode[index - 1] = '';
        setCode(newCode.join(''));
        codeInputs.current[index - 1]?.focus();
      } else {
        const newCode = code.split('');
        newCode[index] = '';
        setCode(newCode.join(''));
      }
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    setCode(pasted);
    const lastFilledIndex = Math.min(pasted.length, 5);
    codeInputs.current[lastFilledIndex]?.focus();
  };

  const stepLabels = ['Email', 'Vérification', 'Nouveau mot de passe'];

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

      <div className="flex-1 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 mb-8 hover:text-gray-900 transition-colors"
            data-testid="forgot-password-back-btn"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.67} />
            <span className="text-base">Retour à la connexion</span>
          </button>

          {/* Success State */}
          {step === 4 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center" data-testid="reset-success-card">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #00BBA7 0%, #009689 100%)' }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Mot de passe réinitialisé !</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <button
                onClick={onGoToLogin}
                className="w-full py-3 text-white rounded-lg text-base transition-all hover:shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#009689' }}
                data-testid="go-to-login-btn"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              {/* Title */}
              <div className="mb-6">
                <h2 className="text-xl text-gray-900 mb-1">Mot de passe oublié</h2>
                <p className="text-sm text-gray-500">{title}</p>
              </div>

              {/* Step Progress */}
              <div className="flex items-center gap-2 mb-8">
                {stepLabels.map((label, i) => {
                  const stepNum = (i + 1) as Step;
                  const isActive = step === stepNum;
                  const isDone = step > stepNum;
                  return (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                            isDone
                              ? 'bg-[#009689] text-white'
                              : isActive
                              ? 'bg-[#009689] text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isDone ? '✓' : stepNum}
                        </div>
                        <span
                          className={`text-xs truncate ${
                            isActive ? 'text-[#009689] font-medium' : isDone ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      {i < 2 && <div className={`h-px flex-1 ${step > stepNum ? 'bg-[#009689]' : 'bg-gray-200'}`} />}
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Email */}
              {step === 1 && (
                <form onSubmit={handleRequestCode} className="space-y-5" data-testid="step1-form">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-7 h-7 text-[#009689]" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Entrez votre adresse email. Nous vous enverrons un code de vérification à 6 chiffres.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Adresse email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@exemple.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                      data-testid="forgot-email-input"
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-white rounded-lg text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#009689' }}
                    data-testid="send-code-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le code'
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Code Verification */}
              {step === 2 && (
                <form onSubmit={handleVerifyCode} className="space-y-5" data-testid="step2-form">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                      <KeyRound className="w-7 h-7 text-[#009689]" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Un code à 6 chiffres a été envoyé à <br />
                      <strong className="text-gray-900">{email}</strong>
                    </p>
                  </div>

                  {/* OTP Digit Inputs */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 text-center">Code de vérification</label>
                    <div className="flex justify-center gap-2" onPaste={handleDigitPaste} data-testid="otp-inputs">
                      {Array.from({ length: 6 }, (_, i) => (
                        <input
                          key={i}
                          ref={(el) => { codeInputs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={code[i] || ''}
                          onChange={(e) => handleDigitChange(i, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(i, e)}
                          className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                            code[i]
                              ? 'border-[#009689] bg-teal-50 text-[#009689]'
                              : 'border-gray-300 bg-white text-gray-900 focus:border-[#009689]'
                          }`}
                          data-testid={`otp-digit-${i}`}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.length < 6}
                    className="w-full py-3 text-white rounded-lg text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#009689' }}
                    data-testid="verify-code-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      'Vérifier le code'
                    )}
                  </button>

                  {/* Resend */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Vous n'avez pas reçu le code?{' '}
                      {resendCooldown > 0 ? (
                        <span className="text-gray-400">
                          Renvoyer dans <strong>{resendCooldown}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={loading}
                          className="text-[#009689] hover:underline font-medium disabled:opacity-50"
                          data-testid="resend-code-btn"
                        >
                          Renvoyer le code
                        </button>
                      )}
                    </p>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5" data-testid="step3-form">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-7 h-7 text-[#009689]" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Choisissez un nouveau mot de passe sécurisé.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        data-testid="new-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Au moins 6 caractères</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        data-testid="confirm-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Password match indicator */}
                    {confirmPassword && (
                      <p className={`text-xs flex items-center gap-1 ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                        {newPassword === confirmPassword ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-white rounded-lg text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#009689' }}
                    data-testid="reset-password-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Réinitialisation...
                      </>
                    ) : (
                      'Réinitialiser le mot de passe'
                    )}
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
