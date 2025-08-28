import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-md rounded-full text-white hover:from-primary/30 hover:to-secondary/30 transition-all duration-300 border border-white/20"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="font-medium">
          {language === 'hi' ? 'हिंदी' : 'English'}
        </span>
        <ChevronDown className="w-3 h-3" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-32 glass-card rounded-xl shadow-xl overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as 'en' | 'hi');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-white/20 transition-all ${
                  language === lang.code ? 'bg-white/10' : ''
                } text-white`}
              >
                {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}