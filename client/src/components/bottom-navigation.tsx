import { Home, PlayCircle, Calendar, Users, User, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'reels', label: 'Reels', icon: PlayCircle, path: '/reels' },
  { id: 'pooja', label: 'Pooja', icon: Calendar, path: '/pooja' },
  { id: 'community', label: 'Community', icon: Users, path: '/community' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <>
      {/* Top Right Controls - Desktop only */}
      <div className="hidden md:flex fixed top-6 right-6 z-50 gap-3">
        <Link href="/store">
          <motion.div
            className="glass-card rounded-xl p-3 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            data-testid="cart-button-desktop"
          >
            <ShoppingCart className="h-5 w-5 text-primary" />
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs h-5 w-5 flex items-center justify-center rounded-full">
              0
            </Badge>
          </motion.div>
        </Link>
      </div>

      {/* Enhanced Glassmorphism Bottom Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      >
        <div className="glass-card border border-white/20 px-2 py-3 mx-auto max-w-md rounded-2xl shadow-2xl">
          <div className="flex justify-around items-center relative">
            {/* Mobile Cart Button */}
            <div className="absolute -top-16 -right-4 md:hidden">
              <Link href="/store">
                <motion.div
                  className="glass-card rounded-xl p-3 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid="cart-button-mobile"
                >
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs h-5 w-5 flex items-center justify-center rounded-full">
                    0
                  </Badge>
                </motion.div>
              </Link>
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location === tab.path || 
                (tab.path !== '/' && location.startsWith(tab.path));

              return (
                <Link key={tab.id} href={tab.path}>
                  <motion.div
                    className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-primary hover:bg-white/10'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    data-testid={`nav-${tab.id}`}
                  >
                    <motion.div
                      className={`${isActive ? 'sakura-glow p-2 rounded-xl shadow-lg' : ''}`}
                      initial={false}
                      animate={isActive ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                    </motion.div>
                    <span className={`text-xs mt-1 font-medium ${
                      isActive ? 'font-semibold text-primary' : ''
                    }`}>
                      {tab.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}