import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import type { Pooja, PoojaContent } from '@shared/schema';

export function PoojaPage() {
  const { data: poojas = [], isLoading } = useQuery({
    queryKey: ['/api/v1/poojas'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white">Loading poojas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 pb-20">
      <div className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          🪔 Sacred Poojas 🪔
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {poojas.map((pooja: Pooja) => (
            <Link key={pooja.id} href={`/pooja/${pooja.id}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Card className="glass-card border-purple-400/30 overflow-hidden">
                  <CardContent className="p-0">
                    {pooja.imageUrl && (
                      <img
                        src={pooja.imageUrl}
                        alt={pooja.name}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm mb-2">
                        {pooja.name}
                      </h3>
                      {pooja.description && (
                        <p className="text-white/70 text-xs line-clamp-2">
                          {pooja.description}
                        </p>
                      )}
                      {pooja.featured === 1 && (
                        <Badge className="absolute top-2 right-2 bg-amber-500">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {poojas.length === 0 && (
          <div className="text-center text-white mt-8">
            <h2 className="text-xl font-bold mb-4">No Poojas Available</h2>
            <p className="text-white/70">Check back later for spiritual content</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PoojaDetailPage() {
  const [match, params] = useRoute('/pooja/:id');
  const [selectedType, setSelectedType] = useState<string>('aarti');
  const { language } = useLanguage();

  const { data: pooja } = useQuery({
    queryKey: [`/api/v1/poojas/${params?.id}`],
    enabled: !!params?.id,
  });

  const { data: content = [] } = useQuery({
    queryKey: [`/api/v1/poojas/${params?.id}/content`, selectedType],
    enabled: !!params?.id,
  });

  const contentTypes = [
    { id: 'aarti', label: 'Aarti', icon: '🪔' },
    { id: 'mantra', label: 'Mantra', icon: '🕉️' },
    { id: 'kavach', label: 'Kavach', icon: '🛡️' },
    { id: 'siddhi', label: 'Siddhi', icon: '✨' },
    { id: 'kunjika', label: 'Kunjika', icon: '🔑' },
    { id: 'adhyaya', label: 'Adhyaya', icon: '📖' },
  ];

  if (!match) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 pb-20">
      <div className="pt-8 px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/pooja">
            <Button variant="ghost" size="sm" className="text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {pooja && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">{pooja.name}</h1>
              {pooja.description && (
                <p className="text-white/70">{pooja.description}</p>
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
                      ? 'bg-amber-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
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
                    {content.map((item: PoojaContent, index: number) => (
                      <Card key={item.id} className="glass-card border-purple-400/30">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white">
                              {item.title}
                            </h3>
                            {selectedType === 'adhyaya' && (
                              <Badge variant="outline" className="border-amber-500 text-amber-500">
                                Chapter {item.order}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="prose prose-invert max-w-none">
                            <div className="text-white/90 leading-relaxed whitespace-pre-line">
                              {language === 'hindi' ? item.textHindi : item.textEnglish}
                            </div>
                            
                            {item.translation && language === 'hindi' && (
                              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                <h4 className="text-white/80 font-medium mb-2">Translation:</h4>
                                <p className="text-white/70 text-sm">{item.translation}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
    </div>
  );
}