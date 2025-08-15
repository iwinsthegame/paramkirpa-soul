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
      {/* Cart Floating Button */}
      <Link href="/store">
        <motion.div
          className="fixed top-4 right-4 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="glass-card rounded-full p-3 shadow-lg border border-purple-400/30">
            <ShoppingCart className="h-6 w-6 text-white" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
              0
            </Badge>
          </div>
        </motion.div>
      </Link>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="glass-card border-t border-purple-400/20 px-2 py-2">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location === tab.path || 
                (tab.path !== '/' && location.startsWith(tab.path));

              return (
                <Link key={tab.id} href={tab.path}>
                  <motion.div
                    className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
                      isActive
                        ? 'text-amber-400'
                        : 'text-white/70 hover:text-white'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`nav-${tab.id}`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-amber-400' : ''}`} />
                    <span className="text-xs mt-1 font-medium">{tab.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}