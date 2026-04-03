import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, FileText, X } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [showTerms, setShowTerms] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20 selection:bg-green-500 selection:text-black transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32 max-w-4xl">
                <h1 className="text-2xl sm:text-4xl font-bold mb-8">My Profile</h1>

                <div className="glass p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center gap-6 sm:gap-10 mb-8 relative overflow-hidden bg-white dark:bg-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-3xl sm:text-6xl font-bold text-black shadow-2xl flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="relative z-10 text-center md:text-left flex-1">
                        <h2 className="text-xl sm:text-3xl font-bold mb-2">{user?.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">{user?.email}</p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <div className="px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center md:items-start min-w-[120px]">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Watchlist</span>
                                <span className="font-bold text-2xl text-green-600 dark:text-green-400">{user?.watchlist?.length || 0}</span>
                            </div>
                            <div className="px-6 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center md:items-start min-w-[120px]">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Portfolio</span>
                                <span className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">{user?.portfolio?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    <button
                        onClick={() => setShowTerms(true)}
                        className="glass p-6 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-6 hover:bg-gray-100 dark:hover:bg-white/5 transition-all group text-left bg-white dark:bg-white/5"
                    >
                        <div className="p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={28} /></div>
                        <div>
                            <h3 className="font-bold text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Terms & Conditions</h3>
                            <p className="text-gray-500 dark:text-gray-400">Read our terms of service and usage policies.</p>
                        </div>
                    </button>
                </div>

                {showTerms && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4">
                        <div className="glass w-full max-w-2xl bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-gray-200 dark:border-white/10 relative shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <button onClick={() => setShowTerms(false)} className="absolute top-6 right-6 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-6 flex-shrink-0">Terms & Conditions</h2>
                            <div className="overflow-y-auto pr-2 space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed custom-scrollbar">
                                <p className="text-black dark:text-white font-semibold">Welcome to CryptoFlux.</p>
                                <p>1. <strong>Use of Service:</strong> CryptoFlux provides cryptocurrency market data for informational purposes only. We are not financial advisors. Any investment decisions you make are solely your own.</p>
                                <p>2. <strong>Data Accuracy:</strong> While we strive for accuracy, market data is volatile and may be subject to delays, interruptions, or errors provided by third-party APIs (CoinGecko).</p>
                                <p>3. <strong>Privacy:</strong> We respect your privacy. Your portfolio data is encrypted and stored securely. We do not sell your personal data to third parties.</p>
                                <p>4. <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials. CryptoFlux is not liable for unauthorized access to your account.</p>
                                <p>5. <strong>Limitation of Liability:</strong> CryptoFlux is not liable for any financial losses, damages, or lost profits incurred based on the use of our platform or data inaccuracies.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">Last updated: February 2026</p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end flex-shrink-0">
                                <button onClick={() => setShowTerms(false)} className="px-8 py-3 bg-green-500 text-white dark:text-black font-bold rounded-xl hover:bg-green-600 dark:hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20">I Understand</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Profile;
