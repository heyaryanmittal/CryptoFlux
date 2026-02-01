import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, LogOut, LayoutDashboard, Star, PieChart, Sun, Moon, Coins, ArrowLeftRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = () => {
        navigate('/');
        setTimeout(() => logout(), 0);
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex justify-between items-center text-gray-900 dark:text-white transition-colors duration-300 bg-white/60 dark:bg-black/60">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
                <TrendingUp className="text-green-600 dark:text-green-400" />
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 dark:from-green-400 dark:to-yellow-400 bg-clip-text text-transparent">CryptoFlux</span>
            </Link>

            <div className="flex items-center gap-6">
                {/* Theme Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full text-gray-700 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} className="text-gray-700 dark:text-gray-200" />}
                </button>

                {user ? (
                    <>
                        <Link to="/dashboard" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link to="/dashboard" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <Coins size={20} />
                            <span className="font-medium">Cryptos</span>
                        </Link>
                        <Link to="/exchanges" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <ArrowLeftRight size={20} />
                            <span className="font-medium">Exchanges</span>
                        </Link>
                        <Link to="/watchlist" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <Star size={20} />
                            <span className="font-medium">Watchlist</span>
                        </Link>
                        <Link to="/portfolio" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <PieChart size={20} />
                            <span className="font-medium">Portfolio</span>
                        </Link>

                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300 dark:border-white/20">
                            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center font-bold text-black text-lg shadow-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="text-gray-500 dark:text-white/60 hover:text-red-600 dark:hover:text-red-400 transition transform hover:rotate-90">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/auth" className="px-6 py-2 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition backdrop-blur-md">Log In</Link>
                        <Link to="/auth?mode=signup" className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white dark:text-black font-bold hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] transition duration-300">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
