import { Building2, Store, Shield, Users, Star, CheckCircle, ArrowRight, Clock, TrendingUp, Search, Phone } from 'lucide-react';
import { UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import containerImg from '../assets/container.png';

interface DawaDzLinkLandingPageProps {
  onGetStarted: (type: UserType) => void;
  onLogin?: (type: UserType) => void;
}

export function DawaDzLinkLandingPage({ onGetStarted, onLogin }: DawaDzLinkLandingPageProps) {
  const [showLoginChoice, setShowLoginChoice] = useState(false);

  const handleLoginClick = (type: UserType) => {
    setShowLoginChoice(false);
    if (onLogin) {
      onLogin(type);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Login Choice Modal */}
      {showLoginChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLoginChoice(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Choisissez votre profil</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleLoginClick('pharmacy')}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
                data-testid="login-pharmacy-btn"
              >
                <Store className="w-6 h-6 text-teal-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Je suis Pharmacie</p>
                  <p className="text-sm text-gray-500">Commander des produits</p>
                </div>
              </button>
              <button
                onClick={() => handleLoginClick('supplier')}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all"
                data-testid="login-supplier-btn"
              >
                <Building2 className="w-6 h-6 text-teal-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Je suis Fournisseur</p>
                  <p className="text-sm text-gray-500">Gérer mes produits</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowLoginChoice(false)}
              className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0D9488' }}>
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <div>
                <span className="text-lg text-gray-900">DawaDzLink</span>
                <p className="text-xs text-gray-500">Plateforme B2B</p>
              </div>
            </div>
            <button 
              onClick={() => setShowLoginChoice(true)} 
              className="text-sm" 
              style={{ color: '#0D9488' }}
              data-testid="login-header-btn"
            >
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Contact Info with Image */}
              <img
                src={containerImg}
                alt="Contact info"
                className="h-auto max-w-full animate-slide-left"
              />

              <div className="animate-slide-left animate-delay-100">
                <h1 className="text-3xl lg:text-5xl text-gray-900 mb-4 leading-tight">
                  Connectez Fournisseurs et Pharmacies
                </h1>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  La plateforme qui vous simplifie la gestion d'approvisionnement en médicaments en Algérie. Trouvez vos produits, consultez les disponibilités en temps réel, et contactez directement vos fournisseurs.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 lg:gap-8 animate-slide-left animate-delay-200">
                <div>
                  <div className="text-2xl lg:text-4xl mb-1" style={{ color: '#0D9488' }}>500+</div>
                  <p className="text-xs lg:text-sm text-gray-600">Produits disponibles</p>
                </div>
                <div>
                  <div className="text-2xl lg:text-4xl mb-1" style={{ color: '#3B82F6' }}>150+</div>
                  <p className="text-xs lg:text-sm text-gray-600">Pharmacies actives</p>
                </div>
                <div>
                  <div className="text-2xl lg:text-4xl mb-1" style={{ color: '#A855F7' }}>4.8★</div>
                  <p className="text-xs lg:text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 animate-slide-left animate-delay-300">
                <button
                  onClick={() => onGetStarted('pharmacy')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-lg transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  <Store className="w-5 h-5" strokeWidth={2} />
                  <span>Je suis Pharmacie</span>
                </button>
                <button
                  onClick={() => onGetStarted('supplier')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-lg transition-all hover:shadow-lg"
                  style={{ backgroundColor: '#0D9488' }}
                >
                  <Building2 className="w-5 h-5" strokeWidth={2} />
                  <span>Je suis Fournisseur</span>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-slide-right">
              <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
                <img
                  src="https://i.ibb.co/8nCcykpk/Image-With-Fallback.jpg"
                  alt="Pharmacy"
                  className="w-full h-64 lg:h-96 object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-8 lg:left-8 lg:translate-x-0 bg-white rounded-2xl shadow-xl px-6 py-3 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DEF7EC' }}>
                  <CheckCircle className="w-6 h-6" style={{ color: '#0D9488' }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">100% Sécurisée</p>
                  <p className="text-sm font-medium text-gray-900">Vérification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12 animate-slide-up">
            <h2 className="text-2xl lg:text-4xl text-gray-900 mb-3">
              Pourquoi choisir DawaDzLink ?
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              Une plateforme complète intuitive pour lier et faciliter les échanges entre professionnels de la santé
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Teal */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 animate-scale-in">
              <div className="relative h-40 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://i.ibb.co/ZzMsxHpG/Container.jpg"
                  alt="Verification"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#0D9488' }}>
                <Shield className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Vérification sécurisée</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tous les fournisseurs et pharmacies sont vérifiés par nos administrateurs pour garantir la sécurité et la conformité
              </p>
            </div>

            {/* Card 2 - Blue */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 animate-scale-in animate-delay-100">
              <div className="relative h-40 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://i.ibb.co/JWkBLCBL/Container-1.jpg"
                  alt="Contact"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#3B82F6' }}>
                <Users className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Contact direct & Soutien</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Contactez directement les agents commerciaux grâce aux différents moyens de communication proposés sur la plateforme (Téléphone, Email, WhatsApp...)
              </p>
            </div>

            {/* Card 3 - Purple */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sm:col-span-2 lg:col-span-1 hover:shadow-xl transition-all duration-300 animate-scale-in animate-delay-200">
              <div className="relative h-40 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://i.ibb.co/N6gXM9v3/Container-2.jpg"
                  alt="Rating"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#A855F7' }}>
                <Star className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Système de notation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Evaluez les services des fournisseurs en donnant votre avis. Choisissez parmi les mieux notés et consultez leurs avis et notes disponibles sur la plateforme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl text-gray-900 mb-3">
              Des fonctionnalités adaptées à vos besoins
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              Différentes options sont offertes selon le type de votre rôle
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pharmacies Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="relative h-48 lg:h-56">
                <ImageWithFallback
                  src="https://i.ibb.co/mrYY2FHB/Container-3.jpg"
                  alt="Pharmacies"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3 shadow-xl flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3B82F6' }}>
                    <Store className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Gérez les Pharmacies</p>
                    <p className="text-xs text-gray-500">Trouvez facilement vos produits</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {[
                  { icon: Search, title: 'Recherche intelligente', desc: 'Cherchez vos produits par nom, référence, catégorie, fabricant et description' },
                  { icon: Clock, title: 'Disponibilité temps réel', desc: 'Consultez la disponibilité des produits en temps réel' },
                  { icon: Phone, title: 'Contact et coordination', desc: 'Coordonnées complètes des fournisseurs avec plusieurs options' },
                  { icon: Star, title: 'Avis sur les fournisseurs', desc: 'Donnez votre avis sur les fournisseurs après chaque transaction' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#DBEAFE' }}>
                      <feature.icon className="w-4 h-4" style={{ color: '#3B82F6' }} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suppliers Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="relative h-48 lg:h-56">
                <ImageWithFallback
                  src="https://i.ibb.co/FL4cwX3X/Container-4.jpg"
                  alt="Suppliers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3 shadow-xl flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0D9488' }}>
                    <Building2 className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pour les Fournisseurs</p>
                    <p className="text-xs text-gray-500">Gérez vos produits et commandes</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {[
                  { icon: Building2, title: 'Gestion du catalogue de produits', desc: 'Ajouter et gérer vos produits en saisissant soit manuellement, soit par importation excel' },
                  { icon: TrendingUp, title: 'Mise à jour en temps réel', desc: 'Modifiez les prix, les quantités et la disponibilité en temps réel' },
                  { icon: Users, title: 'Gestion des agents commerciaux', desc: 'Gérez vos agents en ajoutant leurs contacts et leurs réseaux sociaux' },
                  { icon: Star, title: 'Avis sur les fournisseurs', desc: 'Consultez les avis et notes des pharmacies sur vos produits et votre service' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#DEF7EC' }}>
                      <feature.icon className="w-4 h-4" style={{ color: '#0D9488' }} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, value: '24/7', label: 'Disponibilité', color: '#0D9488' },
              { icon: Shield, value: '100%', label: 'Sécurisé', color: '#3B82F6' },
              { icon: Users, value: '150+', label: 'Partenaires', color: '#A855F7' },
              { icon: TrendingUp, value: '<2h', label: 'Temps de réponse', color: '#10B981' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-6 h-6 lg:w-8 lg:h-8" style={{ color: stat.color }} strokeWidth={2} />
                </div>
                <div className="text-2xl lg:text-3xl mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-4xl text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-sm lg:text-base text-white/90 mb-8">
            Rejoignez DawaDzLink aujourd'hui et découvrez une nouvelle façon de gérer vos échanges pharmaceutiques en Algérie (pas besoin d'aller à l'étranger)
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onGetStarted('pharmacy')}
              className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Store className="w-5 h-5" strokeWidth={2} />
              <span>Inscription Pharmacie</span>
            </button>
            <button
              onClick={() => onGetStarted('supplier')}
              className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Building2 className="w-5 h-5" strokeWidth={2} />
              <span>Inscription Fournisseur</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0D9488' }}>
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <span className="text-lg text-white">DawaDzLink</span>
              </div>
              <p className="text-sm leading-relaxed">
                La plateforme algérienne B2B pour les Fournisseurs Pharmaceutiques en Algérie qui facilite et simplifie la gestion des échanges entre professionnels de la santé
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-sm mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-sm">
                {['À propos', 'Fonctionnalités', 'Tarification', 'Contact'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                {['Contact d\'aide', 'Aide Pharmacies', 'Aide Fournisseurs', 'Conditions d\'utilisation'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 DawaDzLink. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}