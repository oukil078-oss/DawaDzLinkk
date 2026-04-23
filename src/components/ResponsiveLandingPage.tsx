import { Building2, Store, Shield, Users, Star, Search, Zap, Package, FileCheck, TrendingUp, CheckCircle, ArrowRight, Phone, Mail, Clock, Award, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { UserType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ResponsiveLandingPageProps {
  onGetStarted: (type: UserType) => void;
}

export function ResponsiveLandingPage({ onGetStarted }: ResponsiveLandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}>
                <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl text-gray-900 tracking-tight">DawaLink</h1>
                <p className="text-xs" style={{ color: '#4B7F52' }}>B2B Pharmaceutique</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <button 
              className="hidden md:block px-5 py-2 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm lg:text-base"
              style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}
            >
              Se connecter
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              style={{ color: '#4B7F52' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4">
            <button 
              className="w-full px-4 py-3 text-white rounded-lg transition-all duration-200 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}
            >
              Se connecter
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 rounded-full blur-3xl" style={{ backgroundColor: '#A8D5BA' }} />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 rounded-full blur-3xl" style={{ backgroundColor: '#A8D5BA' }} />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 md:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start animate-slide-left">
                <img
                  src="/container.png"
                  alt="Contact info"
                  className="h-auto max-w-full"
                />
              </div>

              {/* Heading */}
              <div className="space-y-4 lg:space-y-6 animate-slide-left animate-delay-100">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-gray-900 leading-tight tracking-tight">
                  Connectez{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10">Fournisseurs</span>
                    <span className="absolute bottom-1 left-0 w-full h-2 lg:h-3 -z-0" style={{ backgroundColor: '#A8D5BA', opacity: 0.5 }} />
                  </span>
                  {' '}et{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10">Pharmacies</span>
                    <span className="absolute bottom-1 left-0 w-full h-2 lg:h-3 -z-0" style={{ backgroundColor: '#A8D5BA', opacity: 0.5 }} />
                  </span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Simplifiez votre approvisionnement en médicaments avec notre plateforme sécurisée.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 animate-slide-left animate-delay-200">
                <button
                  onClick={() => onGetStarted('pharmacy')}
                  className="group w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 bg-white border-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
                  style={{ borderColor: '#4B7F52' }}
                >
                  <div className="flex items-center justify-center space-x-2" style={{ color: '#4B7F52' }}>
                    <Store className="w-5 h-5" strokeWidth={2.5} />
                    <span className="text-sm lg:text-lg">Je suis Pharmacie</span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                <button
                  onClick={() => onGetStarted('supplier')}
                  className="group w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Building2 className="w-5 h-5" strokeWidth={2.5} />
                    <span className="text-sm lg:text-lg">Je suis Fournisseur</span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Stats - Mobile Optimized */}
              <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-6 lg:pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl lg:text-4xl mb-1 lg:mb-2" style={{ color: '#4B7F52' }}>500+</div>
                  <div className="text-xs lg:text-sm text-gray-600">Produits</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-4xl mb-1 lg:mb-2" style={{ color: '#4B7F52' }}>150+</div>
                  <div className="text-xs lg:text-sm text-gray-600">Pharmacies</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-4xl text-amber-500 mb-1 lg:mb-2">4.8★</div>
                  <div className="text-xs lg:text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Image - Hidden on small mobile */}
            <div className="hidden sm:block relative">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1582146804102-b4a01b0a51ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHByb2Zlc3Npb25hbCUyMGNsZWFufGVufDF8fHx8MTc2Njg1MjgxNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy professional"
                  className="w-full h-64 sm:h-80 lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 bg-white/95 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-xl">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}>
                      <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-xs lg:text-sm text-gray-600">Vérification</div>
                      <div className="text-sm lg:text-lg text-gray-900">100% Sécurisée</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 lg:py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-16">
            <h3 className="text-2xl lg:text-4xl text-gray-900 mb-3 lg:mb-4 tracking-tight">
              Pourquoi choisir DawaLink ?
            </h3>
            <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète pour les professionnels de la santé
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-40 lg:h-56 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758518730384-be3d205838e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjY3NDQ5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Secure verification"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 lg:bottom-4 lg:left-4 w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}>
                  <Shield className="w-5 h-5 lg:w-7 lg:h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-4 lg:p-8">
                <h4 className="text-base lg:text-xl text-gray-900 mb-2 lg:mb-3">Vérification Sécurisée</h4>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Tous les professionnels sont vérifiés pour garantir la sécurité et la conformité.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-40 lg:h-56 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1589104759909-e355f8999f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJvZmVzc2lvbmFsJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzY2ODUxMDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Direct contact"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 lg:bottom-4 lg:left-4 w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}>
                  <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-4 lg:p-8">
                <h4 className="text-base lg:text-xl text-gray-900 mb-2 lg:mb-3">Contact Direct</h4>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Contactez les agents via téléphone, email ou WhatsApp instantanément.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="relative h-40 lg:h-56 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1695048441368-e913925d1e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzY2ODUxMDYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Rating system"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 lg:bottom-4 lg:left-4 w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}>
                  <Star className="w-5 h-5 lg:w-7 lg:h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="p-4 lg:p-8">
                <h4 className="text-base lg:text-xl text-gray-900 mb-2 lg:mb-3">Système de Notation</h4>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Consultez les avis vérifiés pour prendre les meilleures décisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-24 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-16">
            <h3 className="text-2xl lg:text-4xl text-gray-900 mb-3 lg:mb-4 tracking-tight">
              Des fonctionnalités adaptées
            </h3>
            <p className="text-base lg:text-xl text-gray-600">
              Découvrez ce que DawaLink peut faire pour vous
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Pharmacies Card */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="relative h-48 lg:h-64">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1715810491182-725428245fe2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMGN1c3RvbWVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjY4NTEwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
                <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 flex items-center space-x-3 lg:space-x-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white flex items-center justify-center shadow-xl">
                    <Store className="w-6 h-6 lg:w-8 lg:h-8" style={{ color: '#4B7F52' }} strokeWidth={2.5} />
                  </div>
                  <div className="text-white">
                    <div className="text-lg lg:text-2xl mb-1">Pour les Pharmacies</div>
                    <div className="text-xs lg:text-sm text-gray-200">Trouvez et commandez</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 lg:p-8 space-y-4 lg:space-y-6">
                {[
                  { icon: Search, title: 'Recherche intelligente', desc: 'Trouvez vos médicaments rapidement' },
                  { icon: Zap, title: 'Temps réel', desc: 'Stocks et prix actualisés' },
                  { icon: Phone, title: 'Contact direct', desc: 'WhatsApp, téléphone, email' },
                  { icon: Star, title: 'Évaluations', desc: 'Avis des pharmacies' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 lg:space-x-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A8D5BA' }}>
                      <feature.icon className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#2E5B3C' }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-sm lg:text-base text-gray-900 mb-1">{feature.title}</div>
                      <p className="text-xs lg:text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suppliers Card */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="relative h-48 lg:h-64">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1739204618173-3e89def7140f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjZXV0aWNhbCUyMHdhcmVob3VzZSUyMGRpc3RyaWJ1dGlvbnxlbnwxfHx8fDE3NjY4NTEwNTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Warehouse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
                <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 flex items-center space-x-3 lg:space-x-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white flex items-center justify-center shadow-xl">
                    <Building2 className="w-6 h-6 lg:w-8 lg:h-8" style={{ color: '#4B7F52' }} strokeWidth={2.5} />
                  </div>
                  <div className="text-white">
                    <div className="text-lg lg:text-2xl mb-1">Pour les Fournisseurs</div>
                    <div className="text-xs lg:text-sm text-gray-200">Gérez votre activité</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 lg:p-8 space-y-4 lg:space-y-6">
                {[
                  { icon: Package, title: 'Gestion catalogue', desc: 'Manuel ou import Excel' },
                  { icon: FileCheck, title: 'Mises à jour', desc: 'Prix et stocks en temps réel' },
                  { icon: Mail, title: 'Agents commerciaux', desc: 'Gérez vos contacts' },
                  { icon: TrendingUp, title: 'Statistiques', desc: 'Suivez vos performances' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 lg:space-x-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A8D5BA' }}>
                      <feature.icon className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#2E5B3C' }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-sm lg:text-base text-gray-900 mb-1">{feature.title}</div>
                      <p className="text-xs lg:text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 lg:py-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Clock, value: '24/7', label: 'Disponibilité' },
              { icon: Shield, value: '100%', label: 'Sécurisé' },
              { icon: Users, value: '150+', label: 'Partenaires' },
              { icon: Award, value: '<2h', label: 'Réponse' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mx-auto mb-3 lg:mb-4 flex items-center justify-center" style={{ backgroundColor: '#A8D5BA' }}>
                  <stat.icon className="w-6 h-6 lg:w-8 lg:h-8" style={{ color: '#2E5B3C' }} strokeWidth={2.5} />
                </div>
                <div className="text-2xl lg:text-4xl mb-1 lg:mb-2" style={{ color: '#4B7F52' }}>{stat.value}</div>
                <div className="text-xs lg:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #2E5B3C 0%, #4B7F52 50%, #6B9A6D 100%)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-48 h-48 lg:w-96 lg:h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 lg:w-96 lg:h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6 lg:space-y-8">
          <h3 className="text-2xl lg:text-4xl xl:text-5xl text-white tracking-tight">
            Prêt à commencer ?
          </h3>
          <p className="text-base lg:text-xl text-white/90">
            Rejoignez DawaLink et simplifiez votre activité pharmaceutique
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center pt-4">
            <button
              onClick={() => onGetStarted('pharmacy')}
              className="group px-6 lg:px-8 py-3 lg:py-4 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <Store className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-sm lg:text-lg">Pharmacie</span>
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <button
              onClick={() => onGetStarted('supplier')}
              className="group px-6 lg:px-8 py-3 lg:py-4 bg-white text-gray-900 rounded-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-sm lg:text-lg">Fournisseur</span>
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="sm:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4B7F52 0%, #6B9A6D 100%)' }}>
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-white text-lg lg:text-xl">DawaLink</div>
                  <div className="text-xs text-gray-500">B2B Pharmaceutique</div>
                </div>
              </div>
              <p className="text-sm lg:text-base text-gray-400 leading-relaxed max-w-md">
                La plateforme qui connecte fournisseurs et pharmacies en Algérie.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white text-sm lg:text-base">Liens rapides</h4>
              <ul className="space-y-2 text-sm lg:text-base">
                {['À propos', 'Fonctionnalités', 'Tarifs', 'Contact'].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white text-sm lg:text-base">Support</h4>
              <ul className="space-y-2 text-sm lg:text-base">
                {['Centre d\'aide', 'Documentation', 'CGU', 'Confidentialité'].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm lg:text-base">
            <p>© 2025 DawaLink. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
