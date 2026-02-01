import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CoinDetails from './pages/CoinDetails';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import Exchanges from './pages/Exchanges';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/exchanges" element={<PrivateRoute><Exchanges /></PrivateRoute>} />
      <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
      <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/coin/:id" element={<PrivateRoute><CoinDetails /></PrivateRoute>} />
    </Routes>
  );
};
export default App;
