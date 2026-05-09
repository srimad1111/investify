import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { FloatingAIChat } from './components/ui/FloatingAIChat';
import { SEBIDisclosure } from './components/Compliance/SEBIDisclosure';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { StockDetail } from './pages/StockDetail';
import { Portfolio } from './pages/Portfolio';
import { Orders } from './pages/Orders';
import { AIChatPage } from './pages/AIChatPage';

function AppLayout() {
  const location = useLocation();
  const isAIChatPage = location.pathname === '/ai-chat';

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md overflow-x-hidden">
      <Navbar />
      <SEBIDisclosure />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAIChatPage && <FloatingAIChat />}
      {!isAIChatPage && <Footer />}
    </div>
  );
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
