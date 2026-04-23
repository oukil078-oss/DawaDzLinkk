import { Building2, Store, Shield, Users, Star, Search, Zap, Package, FileCheck, TrendingUp, CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react';
import { UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfessionalLandingPageProps {
  onGetStarted: (type: UserType) => void;
}

export function ProfessionalLandingPage({ onGetStarted }: ProfessionalLandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f0] via-[#f0f9f5] to-[#e3f4ed]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-r from-emerald-50/95 via-teal-50/95 to-cyan-50/95 border-b border-emerald-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse shadow-lg shadow-emerald-400/50" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent tracking-tight">DawaLink</h1>
                <p className="text-[10px] sm:text-xs text-emerald-600/80">Votre partenaire pharmaceutique</p>
              </div>
            </div>
            <button className="px-3 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base text-emerald-700 hover:text-emerald-800 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 border border-emerald-200/60 hover:border-emerald-300 shadow-sm hover:shadow">
              Se connecter
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-24">
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-gradient-radial from-emerald-300/20 via-teal-200/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-gradient-radial from-cyan-300/20 via-sky-200/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-conic from-emerald-200/10 via-teal-200/10 to-cyan-200/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-8 lg:pr-8">
              <img
                src="/container.png"
                alt="Contact info"
                className="h-auto max-w-full animate-slide-left"
              />

              {/* Main Heading */}
              <div className="space-y-4 sm:space-y-6 animate-slide-left animate-delay-100">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
                  <span className="text-gray-900">Connectez </span>
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent block">
                    Fournisseurs
                  </span>
                  <span className="text-gray-900">et </span>
                  <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 bg-clip-text text-transparent block">
                    Pharmacies
                  </span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
                  La plateforme qui simplifie l'approvisionnement en médicaments en Algérie.
                  Trouvez vos produits, contactez les agents commerciaux directement.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 py-2 sm:py-4 animate-slide-left animate-delay-200">
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Produits</div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-br from-cyan-600 to-sky-600 bg-clip-text text-transparent">150+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Pharmacies</div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-2xl sm:text-3xl lg:text-4xl text-amber-600">4.8★</div>
                  <div className="text-xs sm:text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 animate-slide-left animate-delay-300">
                <button
                  onClick={() => onGetStarted('pharmacy')}
                  className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-white rounded-2xl shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center space-x-2">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    <span className="text-sm sm:text-base lg:text-lg">Je suis Pharmacie</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                <button
                  onClick={() => onGetStarted('supplier')}
                  className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 text-white rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center space-x-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    <span className="text-sm sm:text-base lg:text-lg">Je suis Fournisseur</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mt-8 lg:mt-0 animate-slide-right">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-2xl sm:rounded-[3rem] blur-3xl" />
              <div className="relative h-full rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-emerald-200/50 hover:shadow-3xl transition-shadow duration-500">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1582146804102-b4a01b0a51ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHByb2Zlc3Npb25hbCUyMGNsZWFufGVufDF8fHx8MTc2Njg1MjgxNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy professional"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 via-transparent to-transparent" />

                {/* Floating Stats Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-emerald-100">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600">Vérification</div>
                        <div className="text-base sm:text-lg text-gray-900">100% Sécurisée</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs sm:text-sm text-emerald-600">En ligne</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 sm:py-16 lg:py-24 relative bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4 px-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 tracking-tight">
              Pourquoi choisir DawaLink ?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Une plateforme complète conçue pour faciliter les échanges entre professionnels de la santé
            </p>
          </div>

          {/* Feature Cards with Images */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-emerald-200/50">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image Header */}
              <div className="relative h-36 sm:h-40 lg:h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518730384-be3d205838e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjY3NDQ5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Secure verification"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
              </div>

              <div className="p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 -mt-10 sm:-mt-12 lg:-mt-14 mb-4">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-base sm:text-lg lg:text-xl text-gray-900">Vérification Sécurisée</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Tous les fournisseurs et pharmacies sont minutieusement vérifiés par nos administrateurs pour garantir la sécurité et la conformité.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-white/90 to-cyan-50/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-cyan-200/50">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image Header */}
              <div className="relative h-36 sm:h-40 lg:h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzY2ODUxMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Direct contact"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
              </div>

              <div className="p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 -mt-10 sm:-mt-12 lg:-mt-14 mb-4">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-base sm:text-lg lg:text-xl text-gray-900">Contact Direct & Rapide</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Contactez directement les agents commerciaux via téléphone, email, WhatsApp ou réseaux sociaux. Communication instantanée.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-200/50 sm:col-span-2 lg:col-span-1">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image Header */}
              <div className="relative h-36 sm:h-40 lg:h-48 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1695048441368-e913925d1e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzY2ODUxMDYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Rating system"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent" />
              </div>

              <div className="p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 -mt-10 sm:-mt-12 lg:-mt-14 mb-4">
                  <Star className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-base sm:text-lg lg:text-xl text-gray-900">Système de Notation</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Évaluez les fournisseurs et consultez les avis vérifiés des autres pharmacies pour prendre les meilleures décisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4 px-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 tracking-tight">
              Des fonctionnalités adaptées à vos besoins
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Découvrez ce que DawaLink peut faire pour vous
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Pharmacies Card */}
            <div className="group relative bg-gradient-to-br from-white/90 to-cyan-50/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-cyan-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Header with Image */}
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1715810491182-725428245fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMGN1c3RvbWVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjY4NTEwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-cyan-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-xl flex items-center justify-center shadow-xl">
                    <Store className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" strokeWidth={2.5} />
                  </div>
                  <div className="text-white">
                    <div className="text-lg sm:text-xl lg:text-2xl mb-1">Pour les Pharmacies</div>
                    <div className="text-xs sm:text-sm text-cyan-100">Trouvez et commandez facilement</div>
                  </div>
                </div>
              </div>

              <div className="relative p-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-6">
                {[
                  { icon: Search, title: 'Recherche intelligente', desc: 'Trouvez instantanément vos médicaments par nom, référence ou catégorie avec filtres avancés' },
                  { icon: Zap, title: 'Disponibilité en temps réel', desc: 'Consultez les stocks et prix actualisés instantanément pour éviter les ruptures' },
                  { icon: Phone, title: 'Contact direct simplifié', desc: 'Accédez aux coordonnées complètes et contactez via WhatsApp, téléphone ou email' },
                  { icon: Star, title: "Système d'évaluation", desc: 'Consultez et partagez des avis pour choisir les meilleurs fournisseurs' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm sm:text-base text-gray-900">{feature.title}</div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suppliers Card */}
            <div className="group relative bg-gradient-to-br from-white/90 to-emerald-50/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-emerald-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Header with Image */}
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1739204618173-3e89def7140f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjZXV0aWNhbCUyMHdhcmVob3VzZSUyMGRpc3RyaWJ1dGlvbnxlbnwxfHx8fDE3NjY4NTEwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Warehouse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-xl flex items-center justify-center shadow-xl">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div className="text-white">
                    <div className="text-lg sm:text-xl lg:text-2xl mb-1">Pour les Fournisseurs</div>
                    <div className="text-xs sm:text-sm text-emerald-100">Gérez et développez votre activité</div>
                  </div>
                </div>
              </div>

              <div className="relative p-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-6">
                {[
                  { icon: Package, title: 'Gestion de catalogue simplifiée', desc: 'Ajoutez vos produits manuellement ou importez votre catalogue complet via Excel' },
                  { icon: FileCheck, title: 'Mises à jour instantanées', desc: 'Modifiez prix, stocks et disponibilités en temps réel pour informer vos clients' },
                  { icon: Mail, title: 'Réseau d\'agents commerciaux', desc: 'Gérez vos agents avec coordonnées complètes et liens réseaux sociaux' },
                  { icon: TrendingUp, title: 'Analyses et statistiques', desc: 'Suivez vos performances, consultez les avis et améliorez votre service' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 group/item">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm sm:text-base text-gray-900">{feature.title}</div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { value: '24/7', label: 'Disponibilité', gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-100 to-teal-100' },
              { value: '100%', label: 'Sécurisé', gradient: 'from-cyan-500 to-sky-500', bg: 'from-cyan-100 to-sky-100' },
              { value: '150+', label: 'Partenaires', gradient: 'from-purple-500 to-violet-500', bg: 'from-purple-100 to-violet-100' },
              { value: '<2h', label: 'Temps de réponse', gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-100 to-orange-100' },
            ].map((stat, index) => (
              <div key={index} className={`group relative bg-gradient-to-br ${stat.bg} rounded-2xl p-5 sm:p-6 lg:p-8 text-center space-y-2 sm:space-y-3 hover:shadow-xl transition-all duration-300`}>
                <div className={`text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-teal-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-cyan-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white tracking-tight">
            Prêt à commencer ?
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-emerald-50 max-w-2xl mx-auto px-4">
            Rejoignez DawaLink aujourd'hui et découvrez une nouvelle façon de gérer votre activité pharmaceutique
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
            <button
              onClick={() => onGetStarted('pharmacy')}
              className="group px-6 py-3 sm:px-8 sm:py-4 bg-white/95 backdrop-blur-sm text-cyan-700 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <Store className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                <span className="text-sm sm:text-base lg:text-lg">Inscription Pharmacie</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            <button
              onClick={() => onGetStarted('supplier')}
              className="group px-6 py-3 sm:px-8 sm:py-4 bg-white/95 backdrop-blur-sm text-emerald-700 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                <span className="text-sm sm:text-base lg:text-lg">Inscription Fournisseur</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-400 py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-white text-lg sm:text-xl">DawaLink</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Votre partenaire pharmaceutique</div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-md">
                La plateforme B2B qui connecte fournisseurs et pharmacies en Algérie pour un approvisionnement simplifié et sécurisé.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-white text-sm sm:text-base">Liens rapides</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                {['À propos', 'Fonctionnalités', 'Tarifs', 'Contact'].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-emerald-400 transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-white text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                {['Centre d\'aide', 'Documentation', 'CGU', 'Confidentialité'].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-emerald-400 transition-colors duration-200">{link}</a>
                  </li>
                ))}
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
