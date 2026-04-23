import { useState } from 'react';
import { Package, Users, ChartBar as BarChart3, LogOut, Plus, Menu, X, ShoppingCart, Warehouse } from 'lucide-react';
import { ProductsTab } from './supplier/ProductsTab';
import { AgentsTab } from './supplier/AgentsTab';
import { AnalyticsTab } from './supplier/AnalyticsTab';
import { SupplierOrdersTab } from './supplier/SupplierOrdersTab';
import { SupplierStockTab } from './supplier/SupplierStockTab';
import { useAuth } from '../contexts/AuthContext';

interface SupplierDashboardProps {
  onLogout: () => void;
}

type TabType = 'products' | 'orders' | 'stock' | 'agents' | 'analytics';

export function SupplierDashboard({ onLogout }: SupplierDashboardProps) {
  const { user, details } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const companyName = details?.company_name || user?.full_name || 'Fournisseur';

  const tabs = [
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'agents' as TabType, label: 'Agents', icon: Users },
    { id: 'analytics' as TabType, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' }}
              >
                <Package className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-medium" style={{ color: '#0D9488' }}>DawaDzLink</h1>
                <p className="text-xs sm:text-sm text-gray-600">{companyName}</p>
              </div>
            </div>
            
            {/* Desktop Logout Button */}
            <button
              onClick={onLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 sm:top-20 left-0 right-0 bg-white shadow-lg z-40 md:hidden border-t border-gray-200">
          <nav className="py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 sm:px-6 py-3 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              );
            })}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 sm:px-6 py-3 text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm sm:text-base">Déconnexion</span>
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-teal-600 text-teal-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 text-teal-700">
          {tabs.find(tab => tab.id === activeTab)?.icon && (
            (() => {
              const Icon = tabs.find(tab => tab.id === activeTab)!.icon;
              return <Icon className="w-5 h-5" />;
            })()
          )}
          <span className="font-medium text-sm sm:text-base">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <SupplierOrdersTab />}
        {activeTab === 'stock' && <SupplierStockTab />}
        {activeTab === 'agents' && <AgentsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  );
}