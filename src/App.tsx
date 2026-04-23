import { useState, useEffect } from 'react';
import { DawaDzLinkLandingPage } from './components/DawaLinkLandingPage';
import { SupplierDashboard } from './components/SupplierDashboard';
import { PharmacyDashboard } from './components/PharmacyDashboard';
import { NewAdminDashboard } from './components/admin/NewAdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { RegistrationFlow } from './components/RegistrationFlow';
import { LoginPage } from './components/LoginPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { useAuth } from './contexts/AuthContext';

export type UserType = 'supplier' | 'pharmacy' | 'admin' | null;
export type AuthState = 'landing' | 'registration' | 'login' | 'dashboard' | 'admin-login' | 'forgot-password';

type SubdomainType = 'main' | 'admin' | 'pharmacy' | 'supplier';

function detectSubdomain(): SubdomainType {
  const hostname = window.location.hostname;
  if (hostname.startsWith('admin.')) return 'admin';
  if (hostname.startsWith('pharmacy.') || hostname.startsWith('pharmacie.')) return 'pharmacy';
  if (hostname.startsWith('supplier.') || hostname.startsWith('fournisseur.')) return 'supplier';
  return 'main';
}

function App() {
  const { user, loading, logout: authLogout } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [userType, setUserType] = useState<UserType>(null);
  const subdomain = detectSubdomain();
  const isAdmin = subdomain === 'admin';
  const isPharmacySubdomain = subdomain === 'pharmacy';
  const isSupplierSubdomain = subdomain === 'supplier';

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.status === 'active' || user.role === 'admin') {
          const role = user.role as UserType;
          setUserType(role);
          if (isPharmacySubdomain && role !== 'pharmacy') {
            setAuthState('login');
          } else if (isSupplierSubdomain && role !== 'supplier') {
            setAuthState('login');
          } else {
            setAuthState('dashboard');
          }
        } else if (user.status === 'pending') {
          if (isAdmin) {
            setAuthState('admin-login');
          } else if (isPharmacySubdomain) {
            setUserType('pharmacy');
            setAuthState('login');
          } else if (isSupplierSubdomain) {
            setUserType('supplier');
            setAuthState('login');
          } else {
            setAuthState('landing');
          }
        }
      } else {
        if (isAdmin) {
          setAuthState('admin-login');
          setUserType('admin');
        } else if (isPharmacySubdomain) {
          setUserType('pharmacy');
          setAuthState('login');
        } else if (isSupplierSubdomain) {
          setUserType('supplier');
          setAuthState('login');
        } else {
          setAuthState('landing');
        }
      }
    }
  }, [user, loading, isAdmin, isPharmacySubdomain, isSupplierSubdomain]);

  const handleForgotPassword = () => {
    setAuthState('forgot-password');
  };

  const handleGetStarted = (type: UserType) => {
    setUserType(type);
    setAuthState('registration');
  };

  const handleGoToLogin = (type: UserType) => {
    setUserType(type);
    setAuthState('login');
  };

  const handleRegistrationComplete = () => {
    setAuthState('dashboard');
  };

  const handleLoginSuccess = () => {
    setAuthState('dashboard');
  };

  const handleLogout = async () => {
    await authLogout();
    if (isAdmin) {
      setAuthState('admin-login');
      setUserType('admin');
    } else if (isPharmacySubdomain) {
      setUserType('pharmacy');
      setAuthState('login');
    } else if (isSupplierSubdomain) {
      setUserType('supplier');
      setAuthState('login');
    } else {
      setAuthState('landing');
      setUserType(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Admin subdomain: only show admin login and dashboard
  if (isAdmin) {
    if (authState === 'dashboard' && userType === 'admin') {
      return (
        <div className="page-transition">
          <NewAdminDashboard onLogout={handleLogout} />
        </div>
      );
    }
    return (
      <div className="page-transition">
        <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={() => {}} isSubdomain />
      </div>
    );
  }

  // Pharmacy subdomain: show pharmacy login/registration/dashboard only
  if (isPharmacySubdomain) {
    if (authState === 'dashboard' && userType === 'pharmacy') {
      return (
        <div className="page-transition">
          <PharmacyDashboard onLogout={handleLogout} />
        </div>
      );
    }
    if (authState === 'registration') {
      return (
        <div className="page-transition">
          <RegistrationFlow
            userType="pharmacy"
            onComplete={handleRegistrationComplete}
            onBack={() => setAuthState('login')}
            onGoToLogin={() => handleGoToLogin('pharmacy')}
          />
        </div>
      );
    }
    if (authState === 'forgot-password') {
      return (
        <div className="page-transition">
          <ForgotPasswordPage
            userType="pharmacy"
            onBack={() => setAuthState('login')}
            onGoToLogin={() => handleGoToLogin('pharmacy')}
          />
        </div>
      );
    }
    return (
      <div className="page-transition">
        <LoginPage
          userType="pharmacy"
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setAuthState('login')}
          onGoToRegister={() => setAuthState('registration')}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    );
  }

  // Supplier subdomain: show supplier login/registration/dashboard only
  if (isSupplierSubdomain) {
    if (authState === 'dashboard' && userType === 'supplier') {
      return (
        <div className="page-transition">
          <SupplierDashboard onLogout={handleLogout} />
        </div>
      );
    }
    if (authState === 'registration') {
      return (
        <div className="page-transition">
          <RegistrationFlow
            userType="supplier"
            onComplete={handleRegistrationComplete}
            onBack={() => setAuthState('login')}
            onGoToLogin={() => handleGoToLogin('supplier')}
          />
        </div>
      );
    }
    if (authState === 'forgot-password') {
      return (
        <div className="page-transition">
          <ForgotPasswordPage
            userType="supplier"
            onBack={() => setAuthState('login')}
            onGoToLogin={() => handleGoToLogin('supplier')}
          />
        </div>
      );
    }
    return (
      <div className="page-transition">
        <LoginPage
          userType="supplier"
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setAuthState('login')}
          onGoToRegister={() => setAuthState('registration')}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    );
  }

  // Main domain: landing page with registration/login flows
  return (
    <div className="min-h-screen">
      {authState === 'landing' && (
        <div className="page-transition">
          <DawaDzLinkLandingPage
            onGetStarted={handleGetStarted}
            onLogin={handleGoToLogin}
          />
        </div>
      )}

      {authState === 'registration' && userType && (
        <div className="page-transition">
          <RegistrationFlow
            userType={userType}
            onComplete={handleRegistrationComplete}
            onBack={() => setAuthState('landing')}
            onGoToLogin={() => handleGoToLogin(userType)}
          />
        </div>
      )}

      {authState === 'login' && userType && (
        <div className="page-transition">
          <LoginPage
            userType={userType}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setAuthState('landing')}
            onGoToRegister={() => setAuthState('registration')}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      )}

      {authState === 'forgot-password' && userType && (
        <div className="page-transition">
          <ForgotPasswordPage
            userType={userType}
            onBack={() => setAuthState('login')}
            onGoToLogin={() => handleGoToLogin(userType)}
          />
        </div>
      )}

      {authState === 'dashboard' && userType === 'supplier' && (
        <div className="page-transition">
          <SupplierDashboard onLogout={handleLogout} />
        </div>
      )}

      {authState === 'dashboard' && userType === 'pharmacy' && (
        <div className="page-transition">
          <PharmacyDashboard onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
}

export default App;
