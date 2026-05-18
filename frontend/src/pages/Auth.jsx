import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, signup } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (searchParams.get('mode') === 'signup') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.name, formData.email, formData.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />


            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass w-full max-w-md p-10 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative z-10"
                >
                    <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    {error && <div className="bg-red-500/20 text-red-500 dark:text-red-400 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 pr-12 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none flex items-center justify-center"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white dark:text-black font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 mt-4 text-lg"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '' });
                                setShowPassword(false);
                                navigate(isLogin ? '/auth?mode=signup' : '/auth');
                            }}
                            className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 font-semibold transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default Auth;
