import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";

interface DayCategoriesProps {
  selectedDay: string;
  onCategorySelect: (category: string) => void;
}

const categoryInfo: Record<string, { icon: string; gradient: string; description: string }> = {
  "Mantras": {
    icon: "🙏",
    gradient: "from-amber-400 to-orange-500",
    description: "Sacred chants for peace"
  },
  "Chalisas": {
    icon: "📖",
    gradient: "from-purple-500 to-purple-400",
    description: "Devotional hymns"
  },
  "Aartis": {
    icon: "🔥",
    gradient: "from-pink-400 to-blue-400",
    description: "Lamp worship songs"
  },
  "Stotrams": {
    icon: "📜",
    gradient: "from-blue-400 to-purple-500",
    description: "Praise verses"
  },
  "Kathas": {
    icon: "📚",
    gradient: "from-green-400 to-teal-500",
    description: "Divine stories"
  },
  "Vrat Vidhi": {
    icon: "🕯️",
    gradient: "from-red-400 to-pink-500",
    description: "Fasting procedures"
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
              icon: "🔮",
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
                  <span className="text-white text-2xl">{info.icon}</span>
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