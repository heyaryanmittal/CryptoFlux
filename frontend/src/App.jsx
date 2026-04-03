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
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // While loading, we still show the layout (Navbar) but no content yet
  // This satisfies the "silent" loading requirement.
  if (loading) {
    return null;
  }
  
  return user ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <Navbar />
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
    </div>
  );
};
export default App;
