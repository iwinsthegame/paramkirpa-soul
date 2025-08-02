import { useLanguage } from "@/hooks/use-language";
import LanguageToggle from "@/components/language-toggle";

export default function Header() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="relative z-10 glass-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">🕉️</span>
          </div>
          <h1 className="text-2xl text-white font-extrabold">{t('appName')}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Switch Toggle */}
          <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/20">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                language === 'en' 
                  ? 'bg-amber-400 text-black shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                language === 'hi' 
                  ? 'bg-amber-400 text-black shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
