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
              <stop offset="30%" stopColor="#6366F1" />
              <stop offset="70%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="paper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <filter id="scroll-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.4"/>
              <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#3B82F6" floodOpacity="0.3"/>
            </filter>
            <radialGradient id="rod-highlight" cx="30%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </radialGradient>
          </defs>
          
          {/* Scroll shadow */}
          <ellipse cx="32" cy="54" rx="22" ry="4" fill="#000000" opacity="0.2" />
          
          {/* Main scroll body */}
          <rect x="12" y="16" width="40" height="32" rx="3" fill="url(#scroll-gradient)" filter="url(#scroll-shadow)" />
          <rect x="13" y="17" width="38" height="30" rx="2" fill="url(#scroll-gradient)" opacity="0.8" />
          
          {/* Parchment paper */}
          <rect x="14" y="18" width="36" height="28" rx="1" fill="url(#paper-gradient)" />
          <rect x="15" y="19" width="34" height="26" fill="#F8FAFC" opacity="0.9" />
          
          {/* Sanskrit-style text lines */}
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <line x1="18" y1={24 + i * 2.5} x2={18 + (28 - i * 0.8)} y2={24 + i * 2.5} 
                    stroke="#3B82F6" strokeWidth="0.8" opacity={0.7 - i * 0.05} />
              {/* Decorative Sanskrit marks */}
              <circle cx={20 + i * 1.8} cy={24 + i * 2.5} r="0.4" fill="#6366F1" opacity="0.6" />
            </g>
          ))}
          
          {/* Scroll handles with enhanced 3D effect */}
          <g>
            <ellipse cx="12" cy="32" rx="5" ry="4" fill="url(#scroll-gradient)" filter="url(#scroll-shadow)" />
            <ellipse cx="12" cy="31" rx="3.5" ry="2.5" fill="url(#rod-highlight)" />
            <rect x="10" y="18" width="4" height="28" fill="url(#scroll-gradient)" />
            <rect x="10.5" y="18" width="3" height="26" fill="url(#rod-highlight)" />
          </g>
          
          <g>
            <ellipse cx="52" cy="32" rx="5" ry="4" fill="url(#scroll-gradient)" filter="url(#scroll-shadow)" />
            <ellipse cx="52" cy="31" rx="3.5" ry="2.5" fill="url(#rod-highlight)" />
            <rect x="50" y="18" width="4" height="28" fill="url(#scroll-gradient)" />
            <rect x="50.5" y="18" width="3" height="26" fill="url(#rod-highlight)" />
          </g>
          
          {/* Decorative seal/stamp */}
          <circle cx="32" cy="40" r="2.5" fill="#DC2626" opacity="0.8" />
          <circle cx="32" cy="40" r="1.5" fill="#FBBF24" opacity="0.6" />
          <path d="M31 40 L33 40 M32 39 L32 41" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.8" />
        </svg>
      );
      
    case "Kathas":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="book-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="30%" stopColor="#14B8A6" />
              <stop offset="70%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
            <linearGradient id="book-cover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
            <filter id="book-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.4"/>
              <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#10B981" floodOpacity="0.3"/>
            </filter>
            <radialGradient id="page-highlight" cx="30%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </radialGradient>
          </defs>
          
          {/* Book shadow */}
          <ellipse cx="32" cy="56" rx="18" ry="3" fill="#000000" opacity="0.2" />
          
          {/* Book cover background */}
          <rect x="16" y="12" width="32" height="40" rx="3" fill="url(#book-cover)" opacity="0.3" />
          
          {/* Main book body */}
          <rect x="18" y="14" width="28" height="36" rx="2" fill="url(#book-gradient)" filter="url(#book-shadow)" />
          <rect x="19" y="15" width="26" height="34" rx="1" fill="url(#book-gradient)" opacity="0.9" />
          
          {/* Book pages with depth */}
          <rect x="20" y="16" width="24" height="32" fill="#F8FAFC" />
          <rect x="21" y="17" width="22" height="30" fill="#FFFFFF" opacity="0.9" />
          
          {/* Text lines with varying lengths for story effect */}
          <rect x="23" y="20" width="18" height="1.5" fill="#059669" opacity="0.8" />
          <rect x="23" y="23" width="16" height="1.5" fill="#059669" opacity="0.7" />
          <rect x="23" y="26" width="17" height="1.5" fill="#059669" opacity="0.8" />
          <rect x="23" y="29" width="14" height="1.5" fill="#059669" opacity="0.7" />
          <rect x="23" y="32" width="19" height="1.5" fill="#059669" opacity="0.8" />
          <rect x="23" y="35" width="15" height="1.5" fill="#059669" opacity="0.7" />
          <rect x="23" y="38" width="12" height="1.5" fill="#059669" opacity="0.6" />
          <rect x="23" y="41" width="16" height="1.5" fill="#059669" opacity="0.7" />
          
          {/* Book spine with 3D effect */}
          <rect x="14" y="12" width="4" height="40" rx="1" fill="url(#book-cover)" filter="url(#book-shadow)" />
          <rect x="15" y="13" width="2" height="38" fill="url(#page-highlight)" />
          
          {/* Decorative bookmark */}
          <rect x="42" y="12" width="2" height="25" fill="#DC2626" opacity="0.8" />
          <path d="M42 37 L44 37 L43 40 Z" fill="#DC2626" opacity="0.8" />
          
          {/* Page corners turned */}
          <path d="M40 18 L42 16 L42 18 Z" fill="#E2E8F0" opacity="0.6" />
          <ellipse cx="32" cy="32" rx="20" ry="16" fill="url(#page-highlight)" />
        </svg>
      );
      
    case "Vrat Vidhi":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="candle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="30%" stopColor="#F97316" />
              <stop offset="70%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <radialGradient id="flame-gradient" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </radialGradient>
            <filter id="candle-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.4"/>
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#FBBF24" floodOpacity="0.6"/>
            </filter>
            <filter id="flame-glow">
              <feGaussianBlur stdDeviation="3"/>
              <feColorMatrix values="1 0.8 0 0 0  0 0.6 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
            </filter>
            <radialGradient id="wax-highlight" cx="30%" cy="20%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </radialGradient>
          </defs>
          
          {/* Candle base shadow */}
          <ellipse cx="32" cy="56" rx="8" ry="2.5" fill="#000000" opacity="0.2" />
          
          {/* Candle body with 3D effect */}
          <rect x="28" y="30" width="8" height="24" rx="2" fill="url(#candle-gradient)" filter="url(#candle-shadow)" />
          <rect x="29" y="31" width="6" height="22" rx="1" fill="url(#candle-gradient)" opacity="0.9" />
          
          {/* Wax highlight for 3D depth */}
          <rect x="29" y="32" width="2" height="20" rx="1" fill="url(#wax-highlight)" />
          
          {/* Melted wax drips */}
          <ellipse cx="30" cy="35" rx="1" ry="3" fill="url(#candle-gradient)" opacity="0.6" />
          <ellipse cx="34" cy="38" rx="0.8" ry="2.5" fill="url(#candle-gradient)" opacity="0.6" />
          
          {/* Candle base/holder */}
          <ellipse cx="32" cy="52" rx="7" ry="3" fill="url(#candle-gradient)" opacity="0.8" />
          <ellipse cx="32" cy="51" rx="6" ry="2" fill="url(#candle-gradient)" />
          <ellipse cx="32" cy="50" rx="4" ry="1" fill="url(#wax-highlight)" />
          
          {/* Wick */}
          <rect x="31.5" y="28" width="1" height="3" fill="#8B4513" />
          
          {/* Enhanced flame with multiple layers */}
          <path d="M32 12 Q28 18 32 28 Q36 18 32 12" fill="url(#flame-gradient)" filter="url(#flame-glow)" />
          <path d="M32 15 Q29 20 32 26 Q35 20 32 15" fill="#FEF3C7" opacity="0.8" />
          <path d="M32 17 Q30 21 32 24 Q34 21 32 17" fill="#FFFFFF" opacity="0.6" />
          
          {/* Flame core */}
          <ellipse cx="32" cy="20" rx="1.5" ry="3" fill="#FBBF24" opacity="0.8" />
          <circle cx="32" cy="18" r="1" fill="#F59E0B" />
        </svg>
      );
      
    case "Extras":
      return (
        <svg className={iconProps} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="30%" stopColor="#7C3AED" />
              <stop offset="70%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <radialGradient id="crystal-inner" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#DDD6FE" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
            </radialGradient>
            <filter id="crystal-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.4"/>
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#6366F1" floodOpacity="0.5"/>
            </filter>
            <filter id="crystal-glow">
              <feGaussianBlur stdDeviation="2"/>
              <feColorMatrix values="0.3 0.3 1 0 0  0.3 0.3 1 0 0  0.8 0.8 1 0 0  0 0 0 1 0"/>
            </filter>
          </defs>
          
          {/* Crystal base shadow */}
          <ellipse cx="32" cy="54" rx="16" ry="4" fill="#000000" opacity="0.2" />
          
          {/* Main crystal body - hexagonal with depth */}
          <polygon points="32,8 44,18 44,46 32,56 20,46 20,18" 
                   fill="url(#crystal-gradient)" opacity="0.9" filter="url(#crystal-shadow)" />
          
          {/* Inner crystal layers for 3D effect */}
          <polygon points="32,12 40,20 40,44 32,52 24,44 24,20" 
                   fill="url(#crystal-gradient)" opacity="0.7" />
          <polygon points="32,16 36,22 36,42 32,48 28,42 28,22" 
                   fill="url(#crystal-inner)" />
          
          {/* Crystal facets for realistic look */}
          <polygon points="32,8 44,18 32,32" fill="#FFFFFF" opacity="0.6" />
          <polygon points="32,8 20,18 32,32" fill="#DDD6FE" opacity="0.4" />
          <polygon points="44,18 44,46 32,32" fill="#E0E7FF" opacity="0.3" />
          <polygon points="20,18 20,46 32,32" fill="#F3F4F6" opacity="0.5" />
          <polygon points="32,32 44,46 32,56" fill="#DDD6FE" opacity="0.2" />
          <polygon points="32,32 20,46 32,56" fill="#E0E7FF" opacity="0.3" />
          
          {/* Central core with sparkle effect */}
          <circle cx="32" cy="32" r="8" fill="url(#crystal-gradient)" opacity="0.8" />
          <circle cx="32" cy="32" r="5" fill="url(#crystal-inner)" />
          <circle cx="32" cy="32" r="2" fill="#FFFFFF" opacity="0.9" />
          
          {/* Sparkle highlights */}
          <circle cx="28" cy="24" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="40" cy="28" r="0.8" fill="#FFFFFF" opacity="0.6" />
          <circle cx="24" cy="36" r="0.6" fill="#FFFFFF" opacity="0.7" />
          <circle cx="38" cy="44" r="0.7" fill="#FFFFFF" opacity="0.5" />
          
          {/* Magical glow aura */}
          <circle cx="32" cy="32" r="24" fill="url(#crystal-gradient)" opacity="0.1" filter="url(#crystal-glow)" />
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