import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";

interface DayCategoriesProps {
  selectedDay: string;
  onCategorySelect: (category: string) => void;
}

// 3D SVG Icons for Categories
const getSvgIcon = (category: string) => {
  const iconProps = "w-12 h-12";
  
  switch (category) {
    case "Mantras":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="om-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
            <filter id="om-shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#om-gradient)" opacity="0.2" />
          <path d="M20 25c-2 0-4 2-4 4s2 4 4 4c1 0 2-.5 3-1 0 2 1 4 3 4s4-2 4-4-2-4-4-4h-6zm12 8c2 0 4-2 4-4s-2-4-4-4-4 2-4 4 2 4 4 4zm-8 8c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" fill="url(#om-gradient)" filter="url(#om-shadow)" />
          <circle cx="32" cy="45" r="2" fill="url(#om-gradient)" />
        </svg>
      );
      
    case "Chalisas":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="mala-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <filter id="mala-shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <ellipse cx="32" cy="32" rx="24" ry="20" fill="url(#mala-gradient)" opacity="0.1" />
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x = 32 + 18 * Math.cos(angle);
            const y = 32 + 15 * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="3" fill="url(#mala-gradient)" filter="url(#mala-shadow)" />;
          })}
          <circle cx="32" cy="50" r="4" fill="url(#mala-gradient)" filter="url(#mala-shadow)" />
        </svg>
      );
      
    case "Aartis":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="diya-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <filter id="diya-shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <ellipse cx="32" cy="45" rx="20" ry="8" fill="url(#diya-gradient)" opacity="0.3" />
          <ellipse cx="32" cy="42" rx="16" ry="6" fill="url(#diya-gradient)" filter="url(#diya-shadow)" />
          <ellipse cx="40" cy="40" rx="3" ry="2" fill="url(#diya-gradient)" />
          <path d="M32 15 Q35 20 32 30 Q29 20 32 15" fill="#FEF3C7" filter="url(#diya-shadow)" />
          <ellipse cx="32" cy="35" rx="2" ry="1" fill="#FBBF24" />
        </svg>
      );
      
    case "Stotrams":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="scroll-shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <rect x="12" y="16" width="40" height="32" rx="2" fill="url(#scroll-gradient)" opacity="0.2" />
          <rect x="14" y="18" width="36" height="28" rx="1" fill="url(#scroll-gradient)" filter="url(#scroll-shadow)" />
          <rect x="18" y="24" width="28" height="2" fill="white" opacity="0.8" />
          <rect x="18" y="28" width="24" height="2" fill="white" opacity="0.8" />
          <rect x="18" y="32" width="26" height="2" fill="white" opacity="0.8" />
          <rect x="18" y="36" width="20" height="2" fill="white" opacity="0.8" />
          <circle cx="12" cy="32" r="4" fill="url(#scroll-gradient)" filter="url(#scroll-shadow)" />
          <circle cx="52" cy="32" r="4" fill="url(#scroll-gradient)" filter="url(#scroll-shadow)" />
        </svg>
      );
      
    case "Kathas":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="book-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="book-shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <rect x="16" y="12" width="32" height="40" rx="2" fill="url(#book-gradient)" opacity="0.3" />
          <rect x="18" y="14" width="28" height="36" rx="1" fill="url(#book-gradient)" filter="url(#book-shadow)" />
          <rect x="22" y="20" width="20" height="2" fill="white" opacity="0.9" />
          <rect x="22" y="25" width="18" height="2" fill="white" opacity="0.9" />
          <rect x="22" y="30" width="16" height="2" fill="white" opacity="0.9" />
          <rect x="22" y="35" width="20" height="2" fill="white" opacity="0.9" />
          <rect x="22" y="40" width="14" height="2" fill="white" opacity="0.9" />
          <rect x="14" y="12" width="4" height="40" fill="url(#book-gradient)" opacity="0.7" />
        </svg>
      );
      
    case "Vrat Vidhi":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="candle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="candle-shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <rect x="28" y="30" width="8" height="24" rx="1" fill="url(#candle-gradient)" filter="url(#candle-shadow)" />
          <ellipse cx="32" cy="54" rx="6" ry="2" fill="url(#candle-gradient)" opacity="0.3" />
          <path d="M32 20 Q28 25 32 30 Q36 25 32 20" fill="#FEF3C7" filter="url(#candle-shadow)" />
          <ellipse cx="32" cy="30" rx="1" ry="0.5" fill="#FBBF24" />
          <circle cx="32" cy="18" r="1" fill="#F59E0B" />
        </svg>
      );
      
    case "Extras":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="crystal-shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <circle cx="32" cy="32" r="20" fill="url(#crystal-gradient)" opacity="0.2" />
          <polygon points="32,12 42,22 42,42 32,52 22,42 22,22" fill="url(#crystal-gradient)" opacity="0.8" filter="url(#crystal-shadow)" />
          <polygon points="32,16 38,22 38,38 32,44 26,38 26,22" fill="white" opacity="0.3" />
          <circle cx="32" cy="32" r="6" fill="url(#crystal-gradient)" />
          <circle cx="32" cy="32" r="2" fill="white" opacity="0.8" />
        </svg>
      );
      
    default:
      return <div className={`${iconProps} bg-gray-400 rounded`} />;
  }
};

const categoryInfo: Record<string, { gradient: string; description: string }> = {
  "Mantras": {
    gradient: "from-amber-400 to-orange-500",
    description: "Sacred chants for peace"
  },
  "Chalisas": {
    gradient: "from-purple-500 to-purple-400",
    description: "Devotional hymns"
  },
  "Aartis": {
    gradient: "from-pink-400 to-blue-400",
    description: "Lamp worship songs"
  },
  "Stotrams": {
    gradient: "from-blue-400 to-purple-500",
    description: "Praise verses"
  },
  "Kathas": {
    gradient: "from-green-400 to-teal-500",
    description: "Divine stories"
  },
  "Vrat Vidhi": {
    gradient: "from-red-400 to-pink-500",
    description: "Fasting procedures"
  },
  "Extras": {
    gradient: "from-indigo-400 to-cyan-500",
    description: "Special spiritual items"
  }
};

export default function DayCategories({ selectedDay, onCategorySelect }: DayCategoriesProps) {
  const { t } = useLanguage();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/v1/content/categories', selectedDay],
    queryFn: async () => {
      const response = await fetch(`/api/v1/content/categories?day=${selectedDay}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json() as Promise<string[]>;
    }
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            Categories for {selectedDay}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card-dark rounded-xl p-6">
                <Skeleton className="h-16 w-16 rounded-2xl mx-auto mb-4" />
                <Skeleton className="h-6 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.length) {
    return (
      <section className="mb-8">
        <div className="glass-card rounded-2xl p-8 shadow-xl text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Categories for {selectedDay}
          </h3>
          <p className="text-white/70">No content available for this day.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <motion.div 
        className="glass-card rounded-2xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          Categories for {selectedDay}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const info = categoryInfo[category] || {
              gradient: "from-gray-400 to-gray-500",
              description: "Spiritual content"
            };
            
            return (
              <motion.div
                key={category}
                onClick={() => onCategorySelect(category)}
                className="glass-card-dark rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl mb-4 mx-auto shadow-lg`}>
                  {getSvgIcon(category)}
                </div>
                <h4 className="text-lg font-semibold text-white text-center mb-2">
                  {t(category.toLowerCase().replace(' ', ''))}
                </h4>
                <p className="text-white/70 text-sm text-center">{info.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}