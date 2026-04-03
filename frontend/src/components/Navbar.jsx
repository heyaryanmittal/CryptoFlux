import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, LogOut, LayoutDashboard, Star, PieChart, Sun, Moon, Coins, ArrowLeftRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

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

    const applyTheme = useCallback((isDark) => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    }, []);

    // Apply theme on mount and whenever darkMode changes
    useEffect(() => {
        applyTheme(darkMode);
    }, [darkMode, applyTheme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
                setDarkMode(e.matches);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    const handleLogout = () => {
        navigate('/');
        setTimeout(() => logout(), 0);
    };

    return (
        <nav className="fixed top-0 w-full z-50 px-6 py-3.5 flex justify-between items-center text-gray-900 dark:text-white transition-colors duration-300 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                <TrendingUp className="text-green-600 dark:text-green-400" size={22} />
                <span className="bg-gradient-to-r from-green-600 to-yellow-600 dark:from-green-400 dark:to-yellow-400 bg-clip-text text-transparent">CryptoFlux</span>
            </Link>

            <div className="flex items-center gap-5">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="relative p-2 rounded-full text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 active:scale-90"
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    <div className="relative w-5 h-5">
                        <Sun
                            size={20}
                            className={`absolute inset-0 transition-all duration-300 ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
                        />
                        <Moon
                            size={20}
                            className={`absolute inset-0 transition-all duration-300 text-gray-600 ${darkMode ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                        />
                    </div>
                </button>

                {user ? (
                    <>
                        <Link to="/dashboard" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <LayoutDashboard size={18} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                        <Link to="/dashboard" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <Coins size={18} />
                            <span className="font-medium text-sm">Cryptos</span>
                        </Link>
                        <Link to="/exchanges" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <ArrowLeftRight size={18} />
                            <span className="font-medium text-sm">Exchanges</span>
                        </Link>
                        <Link to="/watchlist" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <Star size={18} />
                            <span className="font-medium text-sm">Watchlist</span>
                        </Link>
                        <Link to="/portfolio" className="hidden lg:flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                            <PieChart size={18} />
                            <span className="font-medium text-sm">Portfolio</span>
                        </Link>

                        <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-300 dark:border-white/20">
                            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center font-bold text-black text-sm shadow-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="text-gray-500 dark:text-white/60 hover:text-red-600 dark:hover:text-red-400 transition transform hover:rotate-90 duration-300">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <Link to="/auth" className="px-5 py-2 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium">Log In</Link>
                        <Link to="/auth?mode=signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white dark:text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all duration-300">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
