import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

interface DayTabsProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
}

const daysOfWeek = [
  { en: "Monday", hi: "सोमवार", short: "Mon" },
  { en: "Tuesday", hi: "मंगलवार", short: "Tue" },
  { en: "Wednesday", hi: "बुधवार", short: "Wed" },
  { en: "Thursday", hi: "गुरुवार", short: "Thu" },
  { en: "Friday", hi: "शुक्रवार", short: "Fri" },
  { en: "Saturday", hi: "शनिवार", short: "Sat" },
  { en: "Sunday", hi: "रविवार", short: "Sun" }
];

export default function DayTabs({ selectedDay, onDaySelect }: DayTabsProps) {
  const { t, language } = useLanguage();

  return (
    <section className="mb-8">
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">
          {t('dailyDevotions')}
        </h2>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {daysOfWeek.map((day) => (
            <motion.button
              key={day.en}
              onClick={() => onDaySelect(day.en)}
              className={`px-4 py-2 rounded-full border border-white/30 text-white transition-all duration-300 ${
                selectedDay === day.en 
                  ? 'bg-white/30 border-white/50' 
                  : 'hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'hi' ? day.hi : day.short}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
