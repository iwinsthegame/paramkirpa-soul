import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Star, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';
import ContentViewer from '@/components/content-viewer';
import type { Pooja, PoojaContent } from '@shared/schema';

export function PoojaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ['/api/v1/pooja/categories'],
  });

  const { data: poojas = [], isLoading: poojasLoading } = useQuery<Pooja[]>({
    queryKey: ['/api/v1/poojas', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === 'all' 
        ? '/api/v1/poojas' 
        : `/api/v1/poojas?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch poojas');
      return response.json();
    }
  });

  const isLoading = categoriesLoading || poojasLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen spiritual-gradient flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-foreground font-medium">Loading Sacred Poojas...</div>
          <div className="w-full bg-border rounded-full h-2 mt-4 overflow-hidden">
            <div className="sakura-glow h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen spiritual-gradient pb-24">
      <div className="pt-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-4">
            <img src="/festival-om-black-logo.png" alt="Om Symbol" className="w-16 object-contain" />
            <span>Festivals</span>
            <img src="/festival-om-black-logo.png" alt="Om Symbol" className="w-16 object-contain" />
          </h1>
          <p className="text-muted-foreground text-lg">Devotional Guide</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
          <motion.button
            key="all"
            onClick={() => setSelectedCategory('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'glass-card border-primary/50 text-primary shadow-lg'
                : 'glass-card border-white/20 text-foreground/70 hover:text-primary hover:border-primary/30'
            }`}
            data-testid={`category-all`}
          >
            <div className="flex items-center gap-2">
              <span>All Festivals</span>
            </div>
          </motion.button>
          
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'glass-card border-primary/50 text-primary shadow-lg'
                  : 'glass-card border-white/20 text-foreground/70 hover:text-primary hover:border-primary/30'
              }`}
              data-testid={`category-${category.id}`}
            >
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.name.replace(/^[🕉️🌸🌿🪔]\s*/, '')}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected Category Description */}
        {selectedCategory !== 'all' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl mb-8 max-w-2xl mx-auto text-center"
          >
            {categories.find(cat => cat.id === selectedCategory) && (
              <>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <p className="text-muted-foreground">
                  {categories.find(cat => cat.id === selectedCategory)?.description}
                </p>
              </>
            )}
          </motion.div>
        )}

        {/* Poojas Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {poojas.map((pooja: Pooja) => (
              <Link key={pooja.id} href={`/pooja/${pooja.id}`}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group"
                  data-testid={`pooja-card-${pooja.id}`}
                >
                  <Card className="glass-card border-purple-400/30 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <CardContent className="p-0">
                      {pooja.imageUrl && (
                        <div className="relative overflow-hidden">
                          <img
                            src={pooja.imageUrl}
                            alt={pooja.name}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-foreground font-bold text-base mb-2 group-hover:text-primary transition-colors">
                          {(pooja as any).name}
                        </h3>
                        {(pooja as any).description && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                            {(pooja as any).description}
                          </p>
                        )}
                        
                        {/* Category Badge */}
                        {(pooja as any).category && (
                          <Badge 
                            variant="outline" 
                            className="mb-2 text-xs border-primary/30 text-primary/80"
                          >
                            {categories.find(cat => cat.id === (pooja as any).category)?.icon} {' '}
                            {categories.find(cat => cat.id === (pooja as any).category)?.name.replace(/^[🕉️🌸🌿🪔]\s*/, '').split(' ')[0]}
                          </Badge>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-muted-foreground text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            <span>Read More</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                      
                      {(pooja as any).featured === 1 && (
                        <Badge className="absolute top-3 right-3 bg-primary/90 hover:bg-primary">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {poojas.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl text-center mt-8 max-w-md mx-auto"
          >
            <h2 className="text-xl font-bold mb-4 text-foreground">No Poojas Found</h2>
            <p className="text-muted-foreground">
              {selectedCategory === 'all' 
                ? 'Check back later for spiritual content' 
                : 'No festivals found in this category'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function PoojaDetailPage() {
  const [match, params] = useRoute('/pooja/:id');
  const [selectedType, setSelectedType] = useState<string>('aarti');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<Record<string, string>>({});
  const { language } = useLanguage();

  const { data: pooja } = useQuery<Pooja>({
    queryKey: [`/api/v1/poojas/${params?.id}`],
    enabled: !!params?.id,
  });

  const { data: content = [] } = useQuery<PoojaContent[]>({
    queryKey: [`/api/v1/poojas/${params?.id}/content/${selectedType}`],
    enabled: !!params?.id,
  });

  // Define content types based on pooja type
  const getContentTypes = (poojaId: string) => {
    if (poojaId === 'durga-pooja') {
      return [
        { id: 'aarti', label: 'Aarti', icon: '🪔' },
        { id: 'chalisa', label: 'Chalisa', icon: '📿' },
        { id: 'mantra', label: 'Mantra', icon: '🕉️' },
        { id: 'kavach', label: 'Kavach', icon: '🛡️' },
        { id: 'siddhi', label: 'Siddhi', icon: '✨' },
        { id: 'kunjika', label: 'Kunjika', icon: '🔑' },
        { id: 'adhyaya', label: 'Adhyaya', icon: '📖' },
      ];
    } else if (poojaId === 'chhath-pooja') {
      return [
        { id: 'aarti', label: 'Aarti', icon: '🪔' },
        { id: 'chalisa', label: 'Chalisa', icon: '📿' },
        { id: 'geet', label: 'Geet', icon: '🎵' },
        { id: 'mantra', label: 'Mantra', icon: '🕉️' },
      ];
    } else {
      // Default content types for other festivals
      return [
        { id: 'aarti', label: 'Aarti', icon: '🪔' },
        { id: 'chalisa', label: 'Chalisa', icon: '📿' },
        { id: 'mantra', label: 'Mantra', icon: '🕉️' },
        { id: 'geet', label: 'Geet', icon: '🎵' },
      ];
    }
  };
  
  const contentTypes = getContentTypes(params?.id || '');

  if (!match) return null;

  return (
    <div className="min-h-screen spiritual-gradient pb-20">
      <div className="pt-8 px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/pooja">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card px-4 py-2 rounded-xl cursor-pointer"
              data-testid="back-button"
            >
              <div className="flex items-center text-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="font-medium">Back</span>
              </div>
            </motion.div>
          </Link>
        </div>

        {pooja && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{(pooja as any).name}</h1>
              {(pooja as any).description && (
                <p className="text-muted-foreground">{(pooja as any).description}</p>
              )}
            </div>

            {/* Content Type Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type.id
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-card text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  data-testid={`tab-${type.id}`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                {content.length > 0 ? (
                  <div className="space-y-6">
                    {selectedType === 'adhyaya' ? (
                      // Special display for Adhyaya chapters
                      (<div className="grid gap-4">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-foreground mb-2">
                            दुर्गा सप्तशती - 13 अध्याय
                          </h2>
                          <p className="text-muted-foreground">
                            Sacred chapters of Goddess Durga's divine glory
                          </p>
                        </div>
                        <div className="grid gap-3">
                          {content
                            .sort((a: any, b: any) => (a.adhyaya || 0) - (b.adhyaya || 0))
                            .map((item: PoojaContent, index: number) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="glass-card rounded-xl p-4 cursor-pointer hover:bg-accent/20 transition-colors"
                              data-testid={`adhyaya-${(item as any).adhyaya}`}
                              onClick={() => setSelectedContentId(item.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                                      अध्याय {(item as any).adhyaya || index + 1}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {item.title}
                                  </h3>
                                  <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.translation}
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>)
                    ) : (
                      // Regular display for other content types
                      (content.map((item: PoojaContent, index: number) => {
                        const currentView = selectedView[item.id] || 'hindi';
                        
                        const getViewOptions = () => {
                          const options = [];
                          if (item.textHindi) options.push({ value: 'hindi', label: 'Hindi Text' });
                          if (item.textHindi) options.push({ value: 'sanskrit', label: 'Sanskrit Text' });
                          if (item.textEnglish) options.push({ value: 'english', label: 'English Transliteration' });
                          if (item.translation) options.push({ value: 'translation', label: 'Translation & Meaning' });
                          return options;
                        };
                        
                        const renderContent = () => {
                          // Function to detect and style Sanskrit verses vs Hindi explanations
                          const formatHindiContent = (text: string) => {
                            const lines = text.split('\n');
                            return lines.map((line, index) => {
                              // Detect Sanskrit lines (contain specific Sanskrit characters or patterns)
                              const isSanskrit = /[॥।]/.test(line) || 
                                               /^[ॐ]/.test(line) || 
                                               /॥\d+॥$/.test(line) ||
                                               /^[प्रअअसनयतमकगदशहरजभवलसिचएवध]/.test(line) ||
                                               /[्]/.test(line) && !/[है|की|में|से|को|का|के|और|तथा|जो|वह|यह|इस|उस|एक]/.test(line);
                              
                              // Apply white color for kavach content
                              const textColor = selectedType === 'kavach' ? '#ffffff' : '';
                              
                              if (isSanskrit) {
                                return (
                                  <div key={index} className={`${selectedType === 'kavach' ? '' : 'text-amber-400'} font-medium leading-relaxed mb-1`} style={selectedType === 'kavach' ? { color: textColor } : {}}>
                                    {line}
                                  </div>
                                );
                              } else {
                                return (
                                  <div key={index} className={`${selectedType === 'kavach' ? '' : 'text-foreground'} leading-relaxed mb-1`} style={selectedType === 'kavach' ? { color: textColor } : {}}>
                                    {line}
                                  </div>
                                );
                              }
                            });
                          };

                          switch (currentView) {
                            case 'hindi':
                              return item.textHindi ? (
                                <div className="text-lg">
                                  {formatHindiContent(item.textHindi)}
                                </div>
                              ) : null;
                            case 'sanskrit':
                              return item.textHindi ? (
                                <div className="text-lg">
                                  {item.textHindi.split('\n').map((line, index) => (
                                    <div key={index} className={`${selectedType === 'kavach' ? '' : 'text-amber-400'} font-medium leading-relaxed mb-1`} style={selectedType === 'kavach' ? { color: '#ffffff' } : {}}>
                                      {line}
                                    </div>
                                  ))}
                                </div>
                              ) : null;
                            case 'english':
                              return item.textEnglish ? (
                                <div className={`${selectedType === 'kavach' ? '' : 'text-foreground'} leading-relaxed whitespace-pre-line text-lg`} style={{ fontFamily: 'Open Sans, sans-serif', ...(selectedType === 'kavach' ? { color: '#ffffff' } : {}) }}>
                                  {item.textEnglish}
                                </div>
                              ) : null;
                            case 'translation':
                              return item.translation ? (
                                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                  <p className={`${selectedType === 'kavach' ? '' : 'text-muted-foreground'} text-base`} style={{ fontFamily: 'Open Sans, sans-serif', ...(selectedType === 'kavach' ? { color: '#ffffff' } : {}) }}>{item.translation}</p>
                                </div>
                              ) : null;
                            default:
                              return null;
                          }
                        };
                        
                        return (
                        <Card key={item.id} className="glass-card border-purple-400/30">
                          <CardContent className="p-6">
                            <div className="text-center mb-6">
                              <h3 className="text-xl font-semibold text-foreground mb-4">
                                {item.title}
                              </h3>
                              
                              {/* Content Type Selector */}
                              <div className="flex justify-center mb-4">
                                <Select
                                  value={currentView}
                                  onValueChange={(value) => 
                                    setSelectedView(prev => ({ ...prev, [item.id]: value }))
                                  }
                                  data-testid={`content-selector-${item.id}`}
                                >
                                  <SelectTrigger className="w-64">
                                    <SelectValue placeholder="Select content type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getViewOptions().map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="prose prose-invert max-w-none text-center">
                              {renderContent()}
                            </div>
                            
                            {item.audioUrl && (
                              <div className="mt-6">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  data-testid={`audio-${item.id}`}
                                >
                                  <span className="mr-2">🎵</span>
                                  Play Audio
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        );
                      }))
                    )}
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-white/50" />
                    <h3 className="text-lg font-semibold mb-2">No {selectedType} content available</h3>
                    <p className="text-white/70">Check back later for updates</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
      {/* Content Viewer Modal */}
      {selectedContentId && (
        <ContentViewer
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
        />
      )}
    </div>
  );
}