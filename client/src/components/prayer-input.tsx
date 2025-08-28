import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { createEmojiRain, createFloatingSphere } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";

export default function PrayerInput() {
  const [prayerText, setPrayerText] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitPrayerMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/v1/prayers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to submit prayer');
      return response.json();
    },
    onSuccess: () => {
      // Show success animations
      const container = document.body;
      createFloatingSphere(container);
      createEmojiRain(container);
      
      // Reset form and show toast
      setPrayerText("");
      toast({
        title: "Prayer Shared",
        description: "Your prayer has been shared with the community 🙏",
      });
      
      // Invalidate prayers cache to refresh the feed
      queryClient.invalidateQueries({ queryKey: ['/api/v1/prayers'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share your prayer. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    if (!prayerText.trim()) return;
    submitPrayerMutation.mutate(prayerText.trim());
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative">
        <textarea
          value={prayerText}
          onChange={(e) => setPrayerText(e.target.value)}
          placeholder={t('sharePrayer')}
          className="w-full h-32 p-4 glass-card rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
          disabled={submitPrayerMutation.isPending}
        />
        <div className="absolute bottom-4 right-4">
          <motion.button
            onClick={handleSubmit}
            disabled={!prayerText.trim() || submitPrayerMutation.isPending}
            className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4 mr-2 inline" />
            {submitPrayerMutation.isPending ? "Posting..." : t('postPrayer')}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
