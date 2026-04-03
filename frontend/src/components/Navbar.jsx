import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, LogOut, LayoutDashboard, Star, PieChart, Sun, Moon, Coins, ArrowLeftRight, Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
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

    useEffect(() => {
        applyTheme(darkMode);
    }, [darkMode, applyTheme]);

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

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    const handleLogout = () => {
        setMobileOpen(false);
        navigate('/');
        setTimeout(() => logout(), 0);
    };

    const navLinks = [
        { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/dashboard', icon: <Coins size={18} />, label: 'Cryptos' },
        { to: '/exchanges', icon: <ArrowLeftRight size={18} />, label: 'Exchanges' },
        { to: '/watchlist', icon: <Star size={18} />, label: 'Watchlist' },
        { to: '/portfolio', icon: <PieChart size={18} />, label: 'Portfolio' },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 py-3 flex justify-between items-center text-gray-900 dark:text-white transition-colors duration-300 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10">
                <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold shrink-0">
                    <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                    <span className="bg-gradient-to-r from-green-600 to-yellow-600 dark:from-green-400 dark:to-yellow-400 bg-clip-text text-transparent">CryptoFlux</span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-5">
                    {/* Theme Toggle — always visible */}
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
                            {/* Desktop nav links */}
                            <div className="hidden lg:flex items-center gap-5">
                                {navLinks.map((link, i) => (
                                    <Link key={i} to={link.to} className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition hover:scale-105">
                                        {link.icon}
                                        <span className="font-medium text-sm">{link.label}</span>
                                    </Link>
                                ))}
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
                            </div>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Desktop auth buttons */}
                            <div className="hidden sm:flex gap-3">
                                <Link to="/auth" className="px-5 py-2 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium">Log In</Link>
                                <Link to="/auth?mode=signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white dark:text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all duration-300">Get Started</Link>
                            </div>
                            {/* Mobile auth — compact */}
                            <div className="flex sm:hidden gap-2">
                                <Link to="/auth" className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-white/20 text-xs font-medium">Log In</Link>
                                <Link to="/auth?mode=signup" className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white dark:text-black font-bold text-xs">Sign Up</Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {user && mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-[57px] right-0 w-64 max-h-[calc(100vh-57px)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto">
                        <div className="p-4 space-y-1">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={i}
                                    to={link.to}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300"
                                >
                                    {link.icon}
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                            <div className="border-t border-gray-200 dark:border-white/10 my-3" />
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center font-bold text-black text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-600 dark:text-red-400 w-full"
                            >
                                <LogOut size={18} />
                                <span className="font-medium">Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Navbar;
