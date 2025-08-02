import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";

interface DayCategoriesProps {
  selectedDay: string;
  onCategorySelect: (category: string) => void;
}

// Enhanced 3D SVG Icons for Categories
const getSvgIcon = (category: string) => {
  const iconProps = "w-12 h-12";
  
  switch (category) {
    case "Mantras":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="om-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="30%" stopColor="#FFA500" />
              <stop offset="70%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
            <radialGradient id="om-radial" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </radialGradient>
            <filter id="om-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.4"/>
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#FFD700" floodOpacity="0.6"/>
            </filter>
          </defs>
          <circle cx="32" cy="32" r="30" fill="url(#om-gradient)" opacity="0.1" />
          
          {/* Om Symbol - Enhanced 3D version */}
          <g filter="url(#om-shadow)">
            <path d="M18 28c-3 0-6 3-6 6s3 6 6 6c2 0 4-1 5-2.5 0 3 2 6 5 6s6-3 6-6-3-6-6-6c-1 0-2 0.5-3 1-1-2.5-3.5-4.5-7-4.5z" 
                  fill="url(#om-gradient)" stroke="#FF4500" strokeWidth="0.5"/>
            <path d="M32 40c3 0 6-3 6-6s-3-6-6-6-6 3-6 6 3 6 6 6z" 
                  fill="url(#om-gradient)" stroke="#FF4500" strokeWidth="0.5"/>
            <path d="M28 48c0-3 3-6 6-6s6 3 6 6-3 6-6 6-6-3-6-6z" 
                  fill="url(#om-gradient)" stroke="#FF4500" strokeWidth="0.5"/>
            <circle cx="34" cy="52" r="2.5" fill="url(#om-gradient)" stroke="#FF4500" strokeWidth="0.3"/>
          </g>
          
          <ellipse cx="32" cy="32" rx="25" ry="20" fill="url(#om-radial)" />
        </svg>
      );
      
    case "Chalisas":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="mala-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="30%" stopColor="#A855F7" />
              <stop offset="70%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <radialGradient id="bead-highlight" cx="30%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </radialGradient>
            <filter id="mala-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.4"/>
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#8B5CF6" floodOpacity="0.5"/>
            </filter>
          </defs>
          
          <ellipse cx="32" cy="32" rx="26" ry="22" fill="url(#mala-gradient)" opacity="0.1" />
          
          {/* Prayer beads in circular pattern */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 22.5) * Math.PI / 180;
            const x = 32 + 18 * Math.cos(angle);
            const y = 32 + 15 * Math.sin(angle);
            const size = i % 4 === 0 ? 3.5 : 2.8; // Varying bead sizes
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={size} fill="url(#mala-gradient)" filter="url(#mala-shadow)" />
                <circle cx={x} cy={y} r={size * 0.6} fill="url(#bead-highlight)" />
              </g>
            );
          })}
          
          {/* Central guru bead */}
          <circle cx="32" cy="52" r="5" fill="url(#mala-gradient)" filter="url(#mala-shadow)" />
          <circle cx="32" cy="52" r="3" fill="url(#bead-highlight)" />
          <circle cx="30" cy="50" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );
      
    case "Aartis":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="diya-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <radialGradient id="flame-gradient" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
            <filter id="diya-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.4"/>
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#FBBF24" floodOpacity="0.6"/>
            </filter>
            <filter id="flame-glow">
              <feGaussianBlur stdDeviation="2"/>
              <feColorMatrix values="1 0.8 0 0 0  0 0.6 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
            </filter>
          </defs>
          
          {/* Diya base shadow */}
          <ellipse cx="32" cy="50" rx="22" ry="6" fill="#000000" opacity="0.2" />
          
          {/* Diya bowl */}
          <ellipse cx="32" cy="46" rx="18" ry="7" fill="url(#diya-gradient)" filter="url(#diya-shadow)" />
          <ellipse cx="32" cy="44" rx="15" ry="5" fill="url(#diya-gradient)" opacity="0.8" />
          
          {/* Diya spout */}
          <ellipse cx="44" cy="42" rx="4" ry="2.5" fill="url(#diya-gradient)" />
          <ellipse cx="46" cy="41" rx="2" ry="1.5" fill="url(#diya-gradient)" />
          
          {/* Wick */}
          <rect x="46" y="38" width="1" height="4" fill="#8B4513" />
          
          {/* Flame */}
          <path d="M47 25 Q50 30 47 35 Q44 30 47 25" fill="url(#flame-gradient)" filter="url(#flame-glow)" />
          <path d="M47 28 Q49 31 47 34 Q45 31 47 28" fill="#FEF3C7" opacity="0.8" />
          
          {/* Oil surface */}
          <ellipse cx="32" cy="43" rx="12" ry="3" fill="#F59E0B" opacity="0.6" />
          <ellipse cx="32" cy="42" rx="8" ry="2" fill="#FBBF24" opacity="0.4" />
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