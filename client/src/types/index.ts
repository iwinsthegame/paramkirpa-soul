export interface Content {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  category: "Mantras" | "Chalisas" | "Aartis" | "Stotrams";
  title: string;
  textEnglish: string;
  textHindi: string;
  translation?: string;
}

export interface Prayer {
  id: string;
  text: string;
  emojiCounts: Record<string, number>;
  createdAt: Date;
}

export interface InsertPrayer {
  text: string;
}

export type Language = 'en' | 'hi';
export type EmojiType = '❤️' | '🌟' | '🙏';

export interface CategoryInfo {
  name: string;
  icon: string;
  description: string;
  gradient: string;
}
