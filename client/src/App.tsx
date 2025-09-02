import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingBackground } from "@/components/floating-background";
import { BottomNavigation } from "@/components/bottom-navigation";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { PWADebug } from "@/components/pwa-debug";

// Pages
import Home from "@/pages/home";
import { ReelsPage } from "@/pages/reels";
import { PoojaPage, PoojaDetailPage } from "@/pages/pooja";
import { CommunityPage } from "@/pages/community";
import { ProfilePage } from "@/pages/profile";
import { StorePage } from "@/pages/store";
import DevotionalGamePage from "@/pages/devotional-game";
import DigitalMalaPage from "@/pages/digital-mala";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen spiritual-gradient">
      <FloatingBackground />
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/reels" component={ReelsPage} />
        <Route path="/pooja" component={PoojaPage} />
        <Route path="/pooja/:id" component={PoojaDetailPage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/store" component={StorePage} />
        <Route path="/game" component={DevotionalGamePage} />
        <Route path="/mala" component={DigitalMalaPage} />
        <Route component={NotFound} />
      </Switch>
      
      <BottomNavigation />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === 'development' && <PWADebug />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
