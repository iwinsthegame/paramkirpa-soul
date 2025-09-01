import { useState, useContext, createContext, ReactNode } from "react";

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    appName: "Kirpa",
    dailyDevotions: "Daily Devotions",
    prayerWall: "Prayer Wall",
    mantras: "Mantras",
    chalisas: "Chalisas",
    aartis: "Aartis",
    stotrams: "Stotrams",
    featuredDevotion: "Today's Featured Devotion",
    sharePrayer: "Share your prayer anonymously...",
    postPrayer: "Post Prayer",
    loadMore: "Load More Prayers",
    comingSoon: "Coming Soon",
    rudrakshStore: "Rudraksh Store",
    kidsReels: "Kids Devotional Reels",
    language: "Language",
    listen: "Listen",
    share: "Share",
    hoursAgo: "hours ago",
    dayAgo: "day ago",
    authenticItems: "Authentic spiritual items",
    spiritualContent: "Spiritual content for children"
  },
  hi: {
    appName: "कृपा",
    dailyDevotions: "दैनिक भक्ति",
    prayerWall: "प्रार्थना दीवार",
    mantras: "मंत्र",
    chalisas: "चालीसा",
    aartis: "आरती",
    stotrams: "स्तोत्र",
    featuredDevotion: "आज की विशेष भक्ति",
    sharePrayer: "अपनी प्रार्थना गुमनाम रूप से साझा करें...",
    postPrayer: "प्रार्थना पोस्ट करें",
    loadMore: "और प्रार्थनाएं लोड करें",
    comingSoon: "जल्द आ रहा है",
    rudrakshStore: "रुद्राक्ष स्टोर",
    kidsReels: "बच्चों के लिए भक्ति रील्स",
    language: "भाषा",
    listen: "सुनें",
    share: "साझा करें",
    hoursAgo: "घंटे पहले",
    dayAgo: "दिन पहले",
    authenticItems: "प्रामाणिक आध्यात्मिक वस्तुएं",
    spiritualContent: "बच्चों के लिए आध्यात्मिक सामग्री"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
