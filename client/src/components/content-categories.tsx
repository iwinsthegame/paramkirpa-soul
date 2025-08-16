import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import type { CategoryInfo } from "@/types";

interface ContentCategoriesProps {
  onCategorySelect: (category: string) => void;
}

const categories: CategoryInfo[] = [
  {
    name: "Mantras",
    icon: "🙏",
    description: "Sacred chants for peace",
    gradient: "from-amber-400 to-orange-500"
  },
  {
    name: "Chalisas",
    icon: "📖",
    description: "Devotional hymns",
    gradient: "from-purple-500 to-purple-400"
  },
  {
    name: "Aartis",
    icon: "🔥",
    description: "Lamp worship songs",
    gradient: "from-amber-400 to-yellow-400"
  },
  {
    name: "Stotrams",
    icon: "📜",
    description: "Praise verses",
    gradient: "from-blue-400 to-purple-500"
  }
];

export default function ContentCategories({ onCategorySelect }: ContentCategoriesProps) {
  const { t } = useLanguage();

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className="glass-card rounded-2xl p-6 shadow-xl hover:bg-white/20 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl mb-4 mx-auto shadow-lg`}>
              <span className="text-white text-2xl">{category.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-white text-center mb-2">
              {t(category.name.toLowerCase())}
            </h3>
            <p className="text-white/80 text-sm text-center">{category.description}</p>
            <div className="mt-4 text-center">
              <span className="text-xs text-white/60">12 items</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
