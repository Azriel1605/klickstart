import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types';
import { CropChainService } from './services/mockDatabase';
import Login from './pages/Login';
import BuyerMarketplace from './pages/buyer/Marketplace';
import AgentDashboard from './pages/agent/Dashboard';
import AgentProductManager from './pages/agent/ProductManager';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex h-screen bg-stone-50 text-slate-900 font-sans">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: UserRole[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    const loggedInUser = await CropChainService.login(email);
    if (loggedInUser) setUser(loggedInUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Buyer Routes */}
            <Route 
              path="/" 
              element={
                user?.role === UserRole.AGENT ? <Navigate to="/agent/dashboard" /> :
                <ProtectedRoute allowedRoles={[UserRole.BUYER]}>
                  <BuyerMarketplace />
                </ProtectedRoute>
              } 
            />

            {/* Agent Routes */}
            <Route 
              path="/agent/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.AGENT]}>
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/products" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.AGENT]}>
                  <AgentProductManager />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}