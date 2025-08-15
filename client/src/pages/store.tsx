import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Filter } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const poojaKits = [
  {
    id: '1',
    name: 'Durga Pooja Kit',
    description: 'Complete kit for Durga Pooja with all essential items',
    price: 599,
    originalPrice: 799,
    image: '/api/placeholder/300/200',
    rating: 4.8,
    reviews: 234,
    items: ['Diya', 'Incense', 'Flowers', 'Prasad', 'Sacred Thread'],
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Lakshmi Pooja Kit',
    description: 'Sacred items for Lakshmi worship and prosperity prayers',
    price: 449,
    originalPrice: 599,
    image: '/api/placeholder/300/200',
    rating: 4.6,
    reviews: 156,
    items: ['Gold Diya', 'Lotus', 'Coins', 'Red Cloth', 'Kumkum'],
    inStock: true,
    featured: false,
  },
  {
    id: '3',
    name: 'Ganesha Pooja Kit',
    description: 'Traditional items for Lord Ganesha worship',
    price: 379,
    originalPrice: 499,
    image: '/api/placeholder/300/200',
    rating: 4.9,
    reviews: 342,
    items: ['Modak', 'Red Flowers', 'Durva Grass', 'Sindoor', 'Coconut'],
    inStock: false,
    featured: true,
  },
];

export function StorePage() {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, count]) => {
      const item = poojaKits.find(kit => kit.id === itemId);
      return total + (item?.price || 0) * count;
    }, 0);
  };

  const filteredKits = poojaKits.filter(kit =>
    kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kit.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 pb-20">
      <div className="pt-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <h1 className="text-2xl font-bold text-white">🛍️ Pooja Store</h1>
          
          <div className="relative">
            <Button variant="outline" size="sm" className="border-purple-400/30 text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
            </Button>
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                {getTotalItems()}
              </Badge>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6 max-w-2xl mx-auto">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pooja kits..."
            className="flex-1 bg-white/5 border-white/20 text-white placeholder-white/50"
            data-testid="search-input"
          />
          <Button variant="outline" size="sm" className="border-purple-400/30 text-white">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Featured Banner */}
        <Card className="glass-card border-amber-400/30 mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-amber-400 mb-2">✨ Special Offer ✨</h2>
            <p className="text-white/80 mb-4">Get 25% off on all Durga Pooja kits this week!</p>
            <Badge className="bg-amber-500 text-white">Limited Time</Badge>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AnimatePresence>
            {filteredKits.map((kit) => (
              <motion.div
                key={kit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <Card className="glass-card border-purple-400/30 overflow-hidden h-full">
                  {kit.featured && (
                    <Badge className="absolute top-2 left-2 z-10 bg-amber-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  {!kit.inStock && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-0">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg mb-1">{kit.name}</h3>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {kit.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(kit.rating)
                                  ? 'text-amber-400 fill-current'
                                  : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-white/70 text-sm">
                          {kit.rating} ({kit.reviews})
                        </span>
                      </div>
                      
                      {/* Items included */}
                      <div className="mb-4">
                        <p className="text-white/70 text-xs mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {kit.items.slice(0, 3).map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-purple-400/30 text-purple-300"
                            >
                              {item}
                            </Badge>
                          ))}
                          {kit.items.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-purple-400/30 text-purple-300"
                            >
                              +{kit.items.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-amber-400">
                            ₹{kit.price}
                          </span>
                          <span className="text-white/50 text-sm line-through ml-2">
                            ₹{kit.originalPrice}
                          </span>
                        </div>
                        <Badge className="bg-green-500">
                          {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}% OFF
                        </Badge>
                      </div>
                      
                      {/* Add to Cart */}
                      {kit.inStock ? (
                        <div className="flex items-center space-x-2">
                          {cart[kit.id] > 0 ? (
                            <div className="flex items-center space-x-2 flex-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(kit.id)}
                                className="border-purple-400/30 text-white w-8 h-8 p-0"
                                data-testid={`decrease-${kit.id}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-white font-medium px-3">
                                {cart[kit.id]}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addToCart(kit.id)}
                                className="border-purple-400/30 text-white w-8 h-8 p-0"
                                data-testid={`increase-${kit.id}`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(kit.id)}
                              className="w-full bg-amber-500 hover:bg-amber-600"
                              data-testid={`add-to-cart-${kit.id}`}
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button disabled className="w-full">
                          Out of Stock
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredKits.length === 0 && (
          <div className="text-center text-white py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-white/70">Try adjusting your search or browse all categories</p>
          </div>
        )}

        {/* Cart Summary (if items in cart) */}
        {getTotalItems() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 left-4 right-4 z-30"
          >
            <Card className="glass-card border-amber-400/30 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} in cart
                    </p>
                    <p className="text-amber-400 font-bold text-lg">₹{getTotalPrice()}</p>
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600" data-testid="checkout-button">
                    Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}