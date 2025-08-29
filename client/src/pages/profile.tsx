import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bookmark, 
  Settings, 
  ShoppingBag, 
  Coins, 
  Languages,
  Moon,
  Sun,
  LogOut,
  Edit,
  Bell
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/useAuth';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const { data: savedContent = [] } = useQuery({
    queryKey: ['/api/v1/user/saved'],
    enabled: !!user,
  });

  const { data: orderHistory = [] } = useQuery({
    queryKey: ['/api/v1/user/orders'],
    enabled: !!user,
  });

  const { data: coinBalance } = useQuery({
    queryKey: ['/api/v1/user/coins'],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen spiritual-gradient pb-20">
      <div className="pt-8 px-4 max-w-6xl mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="glass-card border-purple-400/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {user?.firstName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">
                    {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest User'}
                  </h2>
                  <p className="text-white/70">{user?.email || 'Not signed in'}</p>
                  
                  {coinBalance && (
                    <div className="flex items-center mt-2 space-x-2">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium">{coinBalance.balance} Sacred Coins</span>
                    </div>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="border-purple-400/30 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 glass-card border-purple-400/30">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary">
                Overview
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-primary">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orders */}
                <Card className="glass-card border-purple-400/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Recent Orders</h3>
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    
                    {orderHistory.length > 0 ? (
                      <div className="space-y-3">
                        {orderHistory.slice(0, 3).map((order: any) => (
                          <div key={order.id} className="flex justify-between items-center">
                            <div>
                              <p className="text-white text-sm font-medium">{order.item}</p>
                              <p className="text-white/60 text-xs">{order.date}</p>
                            </div>
                            <span className="text-primary font-medium">₹{order.amount}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/70 text-sm">No orders yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Activity Stats */}
                <Card className="glass-card border-purple-400/30">
                  <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-4">Activity</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-white/70">Prayers Shared</span>
                        <span className="text-white font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Games Played</span>
                        <span className="text-white font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Days Active</span>
                        <span className="text-white font-medium">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Devotion Streak</span>
                        <span className="text-primary font-medium">🔥 5 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <Card className="glass-card border-purple-400/30">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Saved Content</h3>
                  
                  {savedContent.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedContent.map((item: any) => (
                        <div
                          key={item.id}
                          className="p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <h4 className="text-white font-medium mb-1">{item.title}</h4>
                          <p className="text-white/60 text-sm">{item.type}</p>
                          <p className="text-white/50 text-xs mt-2">
                            Saved {new Date(item.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bookmark className="h-16 w-16 mx-auto mb-4 text-white/50" />
                      <h4 className="text-white font-medium mb-2">No saved content</h4>
                      <p className="text-white/70 text-sm">
                        Start bookmarking your favorite prayers and content
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                {/* App Settings */}
                <Card className="glass-card border-purple-400/30">
                  <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-4">App Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Languages className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-white font-medium">Language</p>
                            <p className="text-white/60 text-sm">
                              Current: {language === 'english' ? 'English' : 'Hindi'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={language === 'hindi'}
                          onCheckedChange={toggleLanguage}
                          data-testid="language-toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-white font-medium">Notifications</p>
                            <p className="text-white/60 text-sm">Prayer reminders & updates</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications}
                          onCheckedChange={setNotifications}
                          data-testid="notifications-toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {darkMode ? (
                            <Moon className="h-5 w-5 text-primary" />
                          ) : (
                            <Sun className="h-5 w-5 text-primary" />
                          )}
                          <div>
                            <p className="text-white font-medium">Dark Mode</p>
                            <p className="text-white/60 text-sm">Switch theme appearance</p>
                          </div>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                          data-testid="dark-mode-toggle"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account */}
                <Card className="glass-card border-purple-400/30">
                  <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-4">Account</h3>
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-purple-400/30 text-white">
                        <User className="h-4 w-4 mr-2" />
                        Manage Account
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start border-purple-400/30 text-white">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Order History
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full justify-start border-red-400/30 text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}