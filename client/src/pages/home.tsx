import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import FloatingBackground from "@/components/floating-background";
import DayTabs from "@/components/day-tabs";
import ContentCategories from "@/components/content-categories";
import FeaturedContent from "@/components/featured-content";
import PrayerInput from "@/components/prayer-input";
import PrayerFeed from "@/components/prayer-feed";
import { useLanguage } from "@/hooks/use-language";

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  });
  
  const { t } = useLanguage();

  const handleCategorySelect = (category: string) => {
    // Future implementation: Navigate to category view or filter content
    console.log(`Selected category: ${category} for ${selectedDay}`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <FloatingBackground />
      <Header />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <DayTabs 
          selectedDay={selectedDay} 
          onDaySelect={setSelectedDay} 
        />
        
        <ContentCategories onCategorySelect={handleCategorySelect} />
        
        <FeaturedContent selectedDay={selectedDay} />
        
        {/* Prayer Wall Section */}
        <section className="mb-8">
          <motion.div 
            className="glass-card rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-6 text-center flex items-center justify-center space-x-2">
              <span className="text-amber-400">🙏</span>
              <span>{t('prayerWall')}</span>
            </h3>
            
            <PrayerInput />
            <PrayerFeed />
          </motion.div>
        </section>

        {/* Coming Soon Section */}
        <section className="mb-8">
          <motion.div 
            className="glass-card rounded-2xl p-8 shadow-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">{t('comingSoon')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <motion.div 
                className="bg-white/5 rounded-xl p-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-amber-400 text-3xl mb-3">💎</div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('rudrakshStore')}</h4>
                <p className="text-white/70 text-sm">{t('authenticItems')}</p>
              </motion.div>
              <motion.div 
                className="bg-white/5 rounded-xl p-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-pink-400 text-3xl mb-3">👶</div>
                <h4 className="text-lg font-semibold text-white mb-2">{t('kidsReels')}</h4>
                <p className="text-white/70 text-sm">{t('spiritualContent')}</p>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
