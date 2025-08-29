import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Star, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import ContentViewer from '@/components/content-viewer';
import type { Pooja, PoojaContent } from '@shared/schema';

export function PoojaPage() {
  const { data: poojas = [], isLoading } = useQuery<Pooja[]>({
    queryKey: ['/api/v1/poojas'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen spiritual-gradient flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-foreground font-medium">Loading poojas...</div>
          <div className="w-full bg-border rounded-full h-2 mt-4 overflow-hidden">
            <div className="sakura-glow h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen spiritual-gradient pb-20">
      <div className="pt-8 px-4">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
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
                        className="w-full h-32 object-cover mt-[0px] mb-[0px] pl-[0px] pr-[0px]"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-foreground font-semibold text-sm mb-2">
                        {(pooja as any).name}
                      </h3>
                      {(pooja as any).description && (
                        <p className="text-muted-foreground text-xs line-clamp-2">
                          {(pooja as any).description}
                        </p>
                      )}
                      {(pooja as any).featured === 1 && (
                        <Badge className="absolute top-2 right-2 bg-primary">
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

        {(poojas as any[]).length === 0 && (
          <div className="glass-card p-8 rounded-2xl text-center mt-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-foreground">No Poojas Available</h2>
            <p className="text-muted-foreground">Check back later for spiritual content</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PoojaDetailPage() {
  const [match, params] = useRoute('/pooja/:id');
  const [selectedType, setSelectedType] = useState<string>('aarti');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const { language } = useLanguage();

  const { data: pooja } = useQuery<Pooja>({
    queryKey: [`/api/v1/poojas/${params?.id}`],
    enabled: !!params?.id,
  });

  const { data: content = [] } = useQuery<PoojaContent[]>({
    queryKey: [`/api/v1/poojas/${params?.id}/content/${selectedType}`],
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
                        return (
                        <Card key={item.id} className="glass-card border-purple-400/30">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-semibold text-foreground">
                                {item.title}
                              </h3>
                            </div>
                            
                            <div className="prose prose-invert max-w-none text-center">
                              {item.textHindi && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                    Hindi Text
                                  </h4>
                                  <div className="text-foreground leading-relaxed whitespace-pre-line">
                                    {item.textHindi}
                                  </div>
                                </div>
                              )}
                              
                              {item.textEnglish && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                    English Transliteration
                                  </h4>
                                  <div className="text-foreground leading-relaxed whitespace-pre-line italic">
                                    {item.textEnglish}
                                  </div>
                                </div>
                              )}
                              
                              {item.translation && (
                                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                                  <h4 className="text-muted-foreground font-medium mb-2">
                                    Translation & Meaning
                                  </h4>
                                  <p className="text-muted-foreground text-sm">{item.translation}</p>
                                </div>
                              )}
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