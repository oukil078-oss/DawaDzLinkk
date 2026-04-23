import { Building2, Store, CheckCircle, Users, Package, Star, Search, FileCheck, TrendingUp, Shield, Zap, Clock } from 'lucide-react';
import { UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: (type: UserType) => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg text-teal-700">DawaLink</h1>
                <p className="text-[10px] sm:text-xs text-gray-500">Votre partenaire B2B</p>
              </div>
            </div>
            <button className="px-3 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base text-teal-700 hover:bg-teal-50 rounded-xl transition-all border border-teal-200 hover:border-teal-300">
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-sky-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-8">
              <img
                src="/container.png"
                alt="Contact info"
                className="h-auto max-w-full animate-slide-left"
              />

              <div className="space-y-3 sm:space-y-4 animate-slide-left animate-delay-100">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
                  Connectez <span className="text-teal-600">Fournisseurs</span> et <span className="text-sky-600">Pharmacies</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  La plateforme qui simplifie l'approvisionnement en médicaments en Algérie.
                  Trouvez vos produits, contactez les agents commerciaux directement.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-slide-left animate-delay-200">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-teal-600 mb-1">500+</p>
                  <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-sky-600 mb-1">150+</p>
                  <p className="text-xs sm:text-sm text-gray-600">Pharmacies</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl text-purple-600 mb-1">4.8★</p>
                  <p className="text-xs sm:text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-left animate-delay-300">
                <button
                  onClick={() => onGetStarted('pharmacy')}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-sky-700 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl hover:from-sky-700 hover:to-sky-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Je suis Pharmacie</span>
                  </div>
                </button>
                <button
                  onClick={() => onGetStarted('supplier')}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Je suis Fournisseur</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-sky-400 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1765031092161-a9ebe556117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwc2hlbHZlc3xlbnwxfHx8fDE3NjY4NTEwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy shelves with medicine"
                  className="rounded-2xl shadow-2xl w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-900">Vérification</p>
                      <p className="text-[10px] sm:text-xs text-gray-600">100% Sécurisée</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose DawaLink - Card Style */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4 px-4">
              Pourquoi choisir DawaLink ?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Une plateforme complète conçue pour faciliter les échanges entre professionnels de la santé
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Card 1 - Security */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-teal-200">
              <div className="h-36 sm:h-40 lg:h-48 overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518730384-be3d205838e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjY3NDQ5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Business handshake"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h4 className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-900">Vérification Sécurisée</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Tous les fournisseurs et pharmacies sont minutieusement vérifiés par nos administrateurs pour garantir la sécurité et la conformité.
                </p>
              </div>
            </div>

            {/* Card 2 - Direct Contact */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-sky-200">
              <div className="h-36 sm:h-40 lg:h-48 overflow-hidden bg-gradient-to-br from-sky-50 to-sky-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzY2ODUxMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Medical professionals"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h4 className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-900">Contact Direct & Rapide</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Contactez directement les agents commerciaux via téléphone, email, WhatsApp ou réseaux sociaux. Communication instantanée.
                </p>
              </div>
            </div>

            {/* Card 3 - Rating System */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 sm:col-span-2 lg:col-span-1">
              <div className="h-36 sm:h-40 lg:h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1695048441368-e913925d1e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzY2ODUxMDYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Digital healthcare"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
                  <Star className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h4 className="mb-2 sm:mb-3 text-base sm:text-lg text-gray-900">Système de Notation</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Évaluez les fournisseurs et consultez les avis vérifiés des autres pharmacies pour prendre les meilleures décisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Can You Do Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4 px-4">
              Des fonctionnalités adaptées à vos besoins
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Découvrez ce que DawaLink peut faire pour vous
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Pharmacies */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-sky-100 hover:shadow-2xl transition-all">
              <div className="h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-sky-100 to-sky-200 relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1715810491182-725428245fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMGN1c3RvbWVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjY4NTEwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                    <Store className="w-6 h-6 sm:w-8 sm:h-8 text-sky-700" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-base sm:text-lg mb-1">Pour les Pharmacies</h3>
                    <p className="text-xs sm:text-sm text-sky-100">Trouvez et commandez facilement</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                <ul className="space-y-4 sm:space-y-5">
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Recherche intelligente</p>
                      <p className="text-xs sm:text-sm text-gray-600">Trouvez instantanément vos médicaments par nom, référence ou catégorie avec filtres avancés</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Disponibilité en temps réel</p>
                      <p className="text-xs sm:text-sm text-gray-600">Consultez les stocks et prix actualisés instantanément pour éviter les ruptures</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Contact direct simplifié</p>
                      <p className="text-xs sm:text-sm text-gray-600">Accédez aux coordonnées complètes et contactez via WhatsApp, téléphone ou email</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Système d'évaluation</p>
                      <p className="text-xs sm:text-sm text-gray-600">Consultez et partagez des avis pour choisir les meilleurs fournisseurs</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Suppliers */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-teal-100 hover:shadow-2xl transition-all">
              <div className="h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-teal-100 to-teal-200 relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1739204618173-3e89def7140f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjZXV0aWNhbCUyMHdhcmVob3VzZSUyMGRpc3RyaWJ1dGlvbnxlbnwxfHx8fDE3NjY4NTEwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Warehouse"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-teal-700" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-base sm:text-lg mb-1">Pour les Fournisseurs</h3>
                    <p className="text-xs sm:text-sm text-teal-100">Gérez et développez votre activité</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                <ul className="space-y-4 sm:space-y-5">
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Gestion de catalogue simplifiée</p>
                      <p className="text-xs sm:text-sm text-gray-600">Ajoutez vos produits manuellement ou importez votre catalogue complet via Excel</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Mises à jour instantanées</p>
                      <p className="text-xs sm:text-sm text-gray-600">Modifiez prix, stocks et disponibilités en temps réel pour informer vos clients</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Réseau d'agents commerciaux</p>
                      <p className="text-xs sm:text-sm text-gray-600">Gérez vos agents avec coordonnées complètes et liens réseaux sociaux</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-900 mb-1">Analyses et statistiques</p>
                      <p className="text-xs sm:text-sm text-gray-600">Suivez vos performances, consultez les avis et améliorez votre service</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-teal-100 transition-colors">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
              </div>
              <p className="text-2xl sm:text-3xl text-gray-900 mb-1 sm:mb-2">24/7</p>
              <p className="text-xs sm:text-sm text-gray-600">Disponibilité</p>
            </div>
            <div className="group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-sky-100 transition-colors">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" />
              </div>
              <p className="text-2xl sm:text-3xl text-gray-900 mb-1 sm:mb-2">100%</p>
              <p className="text-xs sm:text-sm text-gray-600">Sécurisé</p>
            </div>
            <div className="group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-purple-100 transition-colors">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl text-gray-900 mb-1 sm:mb-2">150+</p>
              <p className="text-xs sm:text-sm text-gray-600">Partenaires</p>
            </div>
            <div className="group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-emerald-100 transition-colors">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl text-gray-900 mb-1 sm:mb-2">&lt;2h</p>
              <p className="text-xs sm:text-sm text-gray-600">Temps de réponse</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-sky-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-3 sm:mb-4">
            Prêt à commencer ?
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-teal-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Rejoignez DawaLink aujourd'hui et découvrez une nouvelle façon de gérer votre activité pharmaceutique
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xl mx-auto px-4">
            <button
              onClick={() => onGetStarted('pharmacy')}
              className="flex-1 bg-white text-sky-700 py-3 px-6 sm:py-4 sm:px-8 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-2">
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Inscription Pharmacie</span>
              </div>
            </button>
            <button
              onClick={() => onGetStarted('supplier')}
              className="flex-1 bg-white text-teal-700 py-3 px-6 sm:py-4 sm:px-8 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Inscription Fournisseur</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <span className="text-white text-lg sm:text-xl">DawaLink</span>
                  <p className="text-[10px] sm:text-xs text-gray-500">Votre partenaire B2B</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4">
                La plateforme B2B qui connecte fournisseurs et pharmacies en Algérie pour un approvisionnement simplifié et sécurisé.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm sm:text-base mb-3 sm:mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="hover:text-teal-400 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm sm:text-base mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm">© 2025 DawaLink. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}