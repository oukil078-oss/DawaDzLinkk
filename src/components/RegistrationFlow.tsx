import { useState, useRef } from 'react';
import { ArrowLeft, Upload, CircleCheck as CheckCircle, Clock, Loader as Loader2, CircleAlert as AlertCircle, FileText, X, File as FileIcon } from 'lucide-react';
import { UserType } from '../App';
import { PharmacyRegistrationStep1, PharmacyStep1Data } from './PharmacyRegistrationStep1';
import { SupplierRegistrationStep1, SupplierStep1Data } from './SupplierRegistrationStep1';
import { authApi, documentsApi } from '../lib/api';

interface RegistrationFlowProps {
  userType: UserType;
  onComplete: () => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

interface UploadedDoc {
  doc_id: string;
  file_name: string;
  doc_type: string;
  stored_name: string;
}

export function RegistrationFlow({ userType, onComplete, onBack, onGoToLogin }: RegistrationFlowProps) {
  const [step, setStep] = useState<'form' | 'documents' | 'pending'>('form');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDoc>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [pharmacyData, setPharmacyData] = useState<PharmacyStep1Data | null>(null);
  const [supplierData, setSupplierData] = useState<SupplierStep1Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePharmacyStep1Complete = (data: PharmacyStep1Data) => {
    setPharmacyData(data);
    setStep('documents');
  };

  const handleSupplierStep1Complete = (data: SupplierStep1Data) => {
    setSupplierData(data);
    setStep('documents');
  };

  const handleFileSelect = async (docType: string, file: File) => {
    setUploadingDoc(docType);
    setError('');
    try {
      const result = await documentsApi.uploadDocument(file, docType);
      setUploadedDocs(prev => ({
        ...prev,
        [docType]: {
          doc_id: result.doc_id,
          file_name: result.file_name,
          doc_type: result.doc_type,
          stored_name: result.stored_name,
        }
      }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors du téléchargement du fichier');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleRemoveDoc = (docType: string) => {
    setUploadedDocs(prev => {
      const updated = { ...prev };
      delete updated[docType];
      return updated;
    });
  };

  const handleSubmitRegistration = async () => {
    setLoading(true);
    setError('');

    try {
      const documentIds = Object.values(uploadedDocs).map(d => d.doc_id);

      if (userType === 'pharmacy' && pharmacyData) {
        const addressParts = pharmacyData.address.split(',');
        const wilaya = addressParts.length > 1 
          ? addressParts[addressParts.length - 1].trim() 
          : 'Alger';

        await authApi.registerPharmacy({
          email: pharmacyData.email,
          password: pharmacyData.password,
          full_name: pharmacyData.pharmacyName,
          phone: pharmacyData.phone,
          pharmacy_name: pharmacyData.pharmacyName,
          registry_number: pharmacyData.agreementNumber,
          address: pharmacyData.address,
          wilaya: wilaya,
          document_ids: documentIds,
        });
      } else if (userType === 'supplier' && supplierData) {
        const addressParts = supplierData.address.split(',');
        const wilaya = addressParts.length > 1 
          ? addressParts[addressParts.length - 1].trim() 
          : 'Alger';

        await authApi.registerSupplier({
          email: supplierData.email,
          password: supplierData.password,
          full_name: supplierData.companyName,
          phone: supplierData.phone,
          company_name: supplierData.companyName,
          registry_number: supplierData.registrationNumber,
          address: supplierData.address,
          wilaya: wilaya,
          document_ids: documentIds,
        });
      }

      setStep('pending');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const requiredDocs = userType === 'supplier'
    ? ['Registre de commerce']
    : ['Agrément de pharmacie', 'Registre de Commerce'];

  const optionalDocs = userType === 'pharmacy'
    ? ["Inscription à l'ordre des pharmaciens"]
    : ['Agrément', 'Certificat fiscal'];

  const allDocs = [...requiredDocs, ...optionalDocs];

  const allDocsUploaded = requiredDocs.every(doc => uploadedDocs[doc]);

  if (userType === 'pharmacy' && step === 'form') {
    return <PharmacyRegistrationStep1 onNext={handlePharmacyStep1Complete} onBack={onBack} onGoToLogin={onGoToLogin} />;
  }

  if (userType === 'supplier' && step === 'form') {
    return <SupplierRegistrationStep1 onNext={handleSupplierStep1Complete} onBack={onBack} onGoToLogin={onGoToLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => setStep('form')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-teal-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-600 text-white">
                {step !== 'form' ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="hidden sm:inline">Informations</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${
              step === 'documents' ? 'text-teal-700' : step === 'pending' ? 'text-teal-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'documents' ? 'bg-teal-600 text-white' : 
                step === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-white'
              }`}>
                {step === 'pending' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="hidden sm:inline">Documents</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 'pending' ? 'text-teal-700' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-white'
              }`}>
                3
              </div>
              <span className="hidden sm:inline">Vérification</span>
            </div>
          </div>
        </div>

        {/* Documents Step */}
        {step === 'documents' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Documents de vérification
            </h2>
            <p className="text-gray-600 mb-6">
              Veuillez télécharger les documents suivants pour vérification.
              <span className="text-sm text-gray-500 block mt-1">
                Formats acceptés : PDF, JPG, PNG (max 10 Mo par fichier)
              </span>
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-4 mb-8">
              {allDocs.map((doc) => {
                const uploaded = uploadedDocs[doc];
                const isUploading = uploadingDoc === doc;
                const isOptional = optionalDocs.includes(doc);

                return (
                  <div key={doc} className={`border rounded-lg p-4 transition-colors ${
                    uploaded ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {isUploading ? (
                          <Loader2 className="w-6 h-6 text-teal-500 animate-spin flex-shrink-0" />
                        ) : uploaded ? (
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <FileText className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-gray-900 font-medium">{doc}</p>
                            {isOptional && (
                              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                                Optionnel
                              </span>
                            )}
                          </div>
                          {uploaded && (
                            <div className="flex items-center gap-2 mt-1">
                              <FileIcon className="w-3 h-3 text-green-600" />
                              <p className="text-sm text-green-600 truncate">{uploaded.file_name}</p>
                              <button
                                onClick={() => handleRemoveDoc(doc)}
                                className="ml-1 text-red-400 hover:text-red-600"
                                title="Supprimer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          ref={el => { fileInputRefs.current[doc] = el; }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          data-testid={`file-input-${doc.replace(/\s+/g, '-').toLowerCase()}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(doc, file);
                            e.target.value = '';
                          }}
                        />
                        <button
                          onClick={() => fileInputRefs.current[doc]?.click()}
                          disabled={isUploading}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                            uploaded
                              ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                              : 'bg-teal-600 text-white hover:bg-teal-700'
                          } disabled:opacity-50`}
                          data-testid={`upload-btn-${doc.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              {uploaded ? 'Modifier' : 'Télécharger'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep('form')}
                disabled={loading}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Retour
              </button>
              <button
                onClick={handleSubmitRegistration}
                disabled={!allDocsUploaded || loading}
                className={`flex-1 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                  allDocsUploaded && !loading
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                data-testid="submit-registration-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  "Soumettre l'inscription"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Pending Step */}
        {step === 'pending' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Inscription réussie !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre compte a été créé avec succès. Nos administrateurs vont examiner 
              vos documents et activer votre compte.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Statut:</strong> En attente d'approbation<br />
                La vérification prend généralement 24-48 heures. 
                Vous recevrez un email une fois votre compte activé.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onGoToLogin}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                data-testid="go-to-login-btn"
              >
                Se connecter
              </button>
              <button
                onClick={onBack}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
