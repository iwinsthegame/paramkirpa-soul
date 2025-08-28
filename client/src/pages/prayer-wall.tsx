import Header from "@/components/header";
import FloatingBackground from "@/components/floating-background";
import PrayerInput from "@/components/prayer-input";
import PrayerFeed from "@/components/prayer-feed";
import { useLanguage } from "@/hooks/use-language";
import { motion } from "framer-motion";

export default function PrayerWall() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <FloatingBackground />
      <Header />
      
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <motion.div 
          className="glass-card rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center space-x-3">
            <span className="text-primary">🙏</span>
            <span>{t('prayerWall')}</span>
          </h1>
          
          <PrayerInput />
          <PrayerFeed />
        </motion.div>
      </main>
    </div>
  );
}
