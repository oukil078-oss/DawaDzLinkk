import { useState } from 'react';
import { X, Star, Phone, Mail, MessageCircle, Facebook, Linkedin, CheckCircle } from 'lucide-react';
import { Product } from '../PharmacyDashboard';
import { RatingModal } from './RatingModal';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsapp?: string;
  facebook?: string;
  linkedin?: string;
  region: string;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);

  const agents: Agent[] = [
    {
      id: '1',
      name: 'Ahmed Bennani',
      phone: '+213 XXX XXX XX1',
      email: 'ahmed.bennani@pharma.com',
      whatsapp: '+213 XXX XXX XX1',
      facebook: 'ahmed.bennani',
      linkedin: 'ahmed-bennani',
      region: 'Alger'
    },
    {
      id: '2',
      name: 'Fatima Alaoui',
      phone: '+213 XXX XXX XX2',
      email: 'fatima.alaoui@pharma.com',
      whatsapp: '+213 XXX XXX XX2',
      region: 'Oran'
    },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-gray-900">{product.name}</h2>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  product.available 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.available ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                  <span>{product.available ? 'Disponible' : 'Indisponible'}</span>
                </div>
              </div>
              <p className="text-gray-600">{product.reference} • {product.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Product Info */}
            <div className="mb-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-gray-600 mb-1">Prix</p>
                  <p className="text-4xl text-sky-700">{product.price.toFixed(2)} DZD</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 mb-1">Fournisseur</p>
                  <p className="text-xl text-gray-900">{product.supplier}</p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900">{product.supplierRating}</span>
                    </div>
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Donner un avis
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Agents Section */}
            {product.available && (
              <div>
                <h3 className="mb-4 text-gray-900">
                  Agents commerciaux disponibles
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sky-700">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-gray-900">{agent.name}</h4>
                          <p className="text-sm text-gray-600">{agent.region}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <a
                          href={`tel:${agent.phone}`}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-sky-700"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{agent.phone}</span>
                        </a>
                        <a
                          href={`mailto:${agent.email}`}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-sky-700"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{agent.email}</span>
                        </a>
                      </div>

                      {/* Social Links */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        {agent.whatsapp && (
                          <a
                            href={`https://wa.me/${agent.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">WhatsApp</span>
                          </a>
                        )}
                        {agent.facebook && (
                          <a
                            href={`https://facebook.com/${agent.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                        )}
                        {agent.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${agent.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!product.available && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800">
                  Ce produit n'est actuellement pas disponible. Veuillez réessayer plus tard 
                  ou contacter le fournisseur pour plus d'informations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRatingModal && (
        <RatingModal
          supplierName={product.supplier}
          onClose={() => setShowRatingModal(false)}
          onSubmit={() => {
            setShowRatingModal(false);
            // Handle rating submission
          }}
        />
      )}
    </>
  );
}