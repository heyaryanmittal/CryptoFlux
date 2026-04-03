import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Shield, TrendingUp, ArrowRight, BarChart3, Globe, Star, Github, Twitter, Mail } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white overflow-hidden relative selection:bg-green-500 selection:text-black transition-colors duration-300 flex flex-col">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px]" />
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-yellow-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 flex-1">
                {/* Hero Section */}
                <section className="container mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
                            Crypto<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-400">Flux</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed"
                    >
                        Experience the future of cryptocurrency tracking. <br className="hidden md:block" />
                        Real-time data, advanced analytics, and a seamless interface designed for the modern investor.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link to="/auth?mode=signup" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-400 text-white dark:text-black font-bold text-lg rounded-full hover:shadow-[0_0_40px_rgba(74,222,128,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">
                            Get Started Free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 font-medium text-lg">
                            Sign In
                        </Link>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 py-8 border-t border-b border-gray-200 dark:border-white/10 w-full max-w-3xl"
                    >
                        <StatItem value="150+" label="Cryptocurrencies" />
                        <StatItem value="50+" label="Exchanges" />
                        <StatItem value="24/7" label="Real-Time Data" />
                        <StatItem value="100%" label="Free to Use" />
                    </motion.div>
                </section>

                {/* Feature Cards */}
                <section className="container mx-auto px-6 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-400">stay ahead</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
                            Professional-grade tools built for traders, investors, and enthusiasts.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                        <FeatureCard
                            icon={<Activity className="text-green-600 dark:text-green-400" size={28} />}
                            title="Real-Time Data"
                            desc="Live price updates from global markets delivered with sub-second latency."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Shield className="text-yellow-600 dark:text-yellow-400" size={28} />}
                            title="Secure Tracking"
                            desc="Your portfolio, protected and private. Bank-grade encryption for your data."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<TrendingUp className="text-purple-600 dark:text-purple-400" size={28} />}
                            title="Advanced Analytics"
                            desc="Deep dive into market trends with professional-grade charting tools."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-green-600 dark:text-green-400" size={28} />}
                            title="Portfolio Tracking"
                            desc="Monitor your entire crypto portfolio in one dashboard with profit/loss analysis."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Globe className="text-blue-600 dark:text-blue-400" size={28} />}
                            title="Global Exchanges"
                            desc="Compare trading volumes and prices across 200+ exchanges worldwide."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={<Star className="text-orange-600 dark:text-orange-400" size={28} />}
                            title="Watchlist Alerts"
                            desc="Create custom watchlists and get notified when prices hit your targets."
                            delay={0.6}
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-6 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-white/[0.06] dark:via-white/[0.03] dark:to-white/[0.06] p-12 md:p-16 text-center max-w-4xl mx-auto border border-gray-800 dark:border-white/10"
                    >
                        {/* Glow effects */}
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/15 rounded-full blur-[80px] pointer-events-none" />

                        <h2 className="relative text-3xl md:text-4xl font-bold mb-4 text-white dark:text-white">Ready to start tracking?</h2>
                        <p className="relative text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of traders who trust CryptoFlux for their daily market analysis.
                        </p>
                        <Link to="/auth?mode=signup" className="relative group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold text-lg rounded-full hover:shadow-[0_0_50px_rgba(74,222,128,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
                            Create Free Account
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] backdrop-blur-sm transition-colors duration-300">
                <div className="container mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        {/* Brand */}
                        <div className="flex flex-col gap-3">
                            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                                <TrendingUp className="text-green-600 dark:text-green-400" size={22} />
                                <span className="bg-gradient-to-r from-green-600 to-yellow-600 dark:from-green-400 dark:to-yellow-400 bg-clip-text text-transparent">CryptoFlux</span>
                            </Link>
                            <p className="text-gray-500 dark:text-gray-500 text-sm max-w-xs leading-relaxed">
                                Your trusted platform for real-time cryptocurrency tracking and portfolio management.
                            </p>
                        </div>

                        {/* Links */}
                        <div className="flex gap-16">
                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-300">Product</h4>
                                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                                    <li><Link to="/auth?mode=signup" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Dashboard</Link></li>
                                    <li><Link to="/auth?mode=signup" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Portfolio</Link></li>
                                    <li><Link to="/auth?mode=signup" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Watchlist</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-300">Company</h4>
                                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                                    <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Terms</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-3">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200">
                                <Github size={18} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200">
                                <Twitter size={18} />
                            </a>
                            <a href="mailto:contact@cryptoflux.app" className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="text-gray-400 dark:text-gray-600 text-xs">
                            &copy; {new Date().getFullYear()} CryptoFlux. All rights reserved.
                        </p>
                        <p className="text-gray-400 dark:text-gray-600 text-xs">
                            Market data provided by CoinGecko API
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const StatItem = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{value}</span>
        <span className="text-sm text-gray-500 dark:text-gray-500 mt-1">{label}</span>
    </div>
);

const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-7 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-green-500/30 group bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm"
    >
        <div className="mb-5 p-3.5 bg-gray-100 dark:bg-white/5 rounded-xl w-fit group-hover:scale-110 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-all duration-300">{icon}</div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);

export default Landing;
