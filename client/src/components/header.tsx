import { useLanguage } from "@/hooks/use-language";
import LanguageToggle from "./language-toggle";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="relative z-10 glass-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">🕉️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{t('appName')}</h1>
        </div>
        
        <LanguageToggle />
      </div>
    </header>
  );
}
