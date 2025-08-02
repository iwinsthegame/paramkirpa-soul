export type EmojiType = "🙏" | "❤️" | "🌟";

export interface Content {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  category: "Mantras" | "Chalisas" | "Aartis" | "Stotrams" | "Kathas" | "Vrat Vidhi";
  title: string;
  textEnglish: string;
  textHindi: string;
  translation?: string;
  deity?: string;
  duration?: string;
  emojiCounts: Record<string, number>;
}

export interface Prayer {
  id: string;
  message: string;
  createdAt: Date;
  isAnonymous: boolean;
  emojiCounts: Record<string, number>;
}

export interface InsertPrayer {
  message: string;
  isAnonymous?: boolean;
}

export interface InsertContent {
  day: Content['day'];
  category: Content['category'];
  title: string;
  textEnglish: string;
  textHindi: string;
  translation?: string;
  deity?: string;
  duration?: string;
}