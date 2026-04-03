import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Shield, TrendingUp, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white overflow-hidden relative selection:bg-green-500 selection:text-black transition-colors duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            <main className="relative z-10 container mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mt-12 md:mt-20"
                >
                    <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tight leading-tight">
                        Crypto<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-400">Flux</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mb-12 leading-relaxed"
                >
                    Experience the future of cryptocurrency tracking. <br className="hidden md:block" />
                    Real-time data, advanced analytics, and a seamless interface designed for the modern investor.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/auth?mode=signup" className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-green-400 text-white dark:text-black font-bold text-xl rounded-full hover:shadow-[0_0_40px_rgba(74,222,128,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                        Get Started
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8 mt-40 w-full text-left">
                    <FeatureCard
                        icon={<Activity className="text-green-600 dark:text-green-400" size={32} />}
                        title="Real-Time Data"
                        desc="Live price updates from global markets delivered with sub-second latency."
                        delay={0.6}
                    />
                    <FeatureCard
                        icon={<Shield className="text-yellow-600 dark:text-yellow-400" size={32} />}
                        title="Secure Tracking"
                        desc="Your portfolio, protected and private. Bank-grade encryption for your data."
                        delay={0.8}
                    />
                    <FeatureCard
                        icon={<TrendingUp className="text-purple-600 dark:text-purple-400" size={32} />}
                        title="Advanced Analytics"
                        desc="Deep dive into market trends and stats with professional-grade charting tools."
                        delay={1.0}
                    />
                </div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="glass p-8 rounded-3xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-green-500/30 group bg-white/60 dark:bg-white/5"
    >
        <div className="mb-6 p-4 bg-gray-200 dark:bg-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">{desc}</p>
    </motion.div>
);

export default Landing;
