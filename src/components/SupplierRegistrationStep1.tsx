import { ArrowLeft, Package } from 'lucide-react';
import { useState } from 'react';

interface SupplierRegistrationStep1Props {
  onNext: (data: SupplierStep1Data) => void;
  onBack: () => void;
  onGoToLogin?: () => void;
}

export interface SupplierStep1Data {
  companyName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export function SupplierRegistrationStep1({ onNext, onBack, onGoToLogin }: SupplierRegistrationStep1Props) {
  const [formData, setFormData] = useState<SupplierStep1Data>({
    companyName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const updateField = (field: keyof SupplierStep1Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            <button 
              className="px-6 py-2.5 text-sm border rounded-2xl transition-all"
              style={{ borderColor: '#96F7E4', color: '#00786F' }}
            >
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 mb-8 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.67} />
            <span className="text-base">Retour</span>
          </button>

          {/* Progress Stepper */}
          <div className="flex items-center justify-center mb-8 px-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Step 1 - Active */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: '#009689' }}
                >
                  <span className="text-sm sm:text-base">1</span>
                </div>
                <span className="text-xs sm:text-base" style={{ color: '#00786F' }}>Informations</span>
              </div>

              {/* Divider */}
              <div className="w-3 sm:w-6 h-0.5 bg-gray-300 mx-1 sm:mx-2" />

              {/* Step 2 - Inactive */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white bg-gray-300">
                  <span className="text-sm sm:text-base">2</span>
                </div>
                <span className="text-xs sm:text-base text-gray-400">Documents</span>
              </div>

              {/* Divider */}
              <div className="w-3 sm:w-6 h-0.5 bg-gray-300 mx-1 sm:mx-2" />

              {/* Step 3 - Inactive */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white bg-gray-300">
                  <span className="text-sm sm:text-base">3</span>
                </div>
                <span className="text-xs sm:text-base text-gray-400">Vérification</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl text-gray-900 mb-6">Inscription Fournisseur</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="Pharma Distribution SA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Registration Number */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Numéro de registre
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => updateField('registrationNumber', e.target.value)}
                  placeholder="RC123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contact@exemple.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+213 XXX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Adresse complète"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-base text-gray-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                  minLength={8}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 text-white rounded-lg text-base transition-all hover:shadow-lg"
                style={{ backgroundColor: '#009689' }}
              >
                Continuer
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="text-sm text-gray-600 hover:text-[#009689] transition-colors"
                >
                  Vous avez déjà un compte? <span className="underline">Se connecter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}