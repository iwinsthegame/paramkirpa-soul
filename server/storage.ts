import { type Content, type InsertContent, type Prayer, type InsertPrayer, type GameScore, type InsertGameScore } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Content methods
  getContentByDay(day: string, language?: string): Promise<Content[]>;
  getContentByCategory(category: string, day: string, language?: string): Promise<Content[]>;
  getFeaturedContent(day: string): Promise<Content | undefined>;
  getContentById(id: string): Promise<Content | undefined>;
  updateContentReaction(contentId: string, emoji: string): Promise<Content | undefined>;
  getCategoriesByDay(day: string): Promise<string[]>;
  
  // Prayer methods
  createPrayer(prayer: InsertPrayer): Promise<Prayer>;
  getPrayers(page?: number, limit?: number): Promise<Prayer[]>;
  getPrayerById(id: string): Promise<Prayer | undefined>;
  updatePrayerReaction(prayerId: string, emoji: string): Promise<Prayer | undefined>;
  
  // Game methods
  saveGameScore(gameScore: InsertGameScore): Promise<GameScore>;
  getUserGameStats(userId: string): Promise<GameScore | undefined>;
  updateUserStreak(userId: string): Promise<void>;
  getLeaderboard(limit?: number): Promise<GameScore[]>;
  getGameLeaderboard(): Promise<any[]>;
  
  // Pooja operations
  getPoojas(): Promise<any[]>;
  getPoojaById(id: string): Promise<any>;
  getPoojaContent(poojaId: string, type?: string): Promise<any[]>;
  
  // Reels operations
  getReels(): Promise<any[]>;
  incrementReelLikes(id: string): Promise<void>;
  incrementReelViews(id: string): Promise<void>;
  
  // Community operations
  getCommunityPosts(page: number, limit: number): Promise<any[]>;
  createCommunityPost(post: any): Promise<any>;
  upvoteCommunityPost(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private contents: Map<string, Content>;
  private prayers: Map<string, Prayer>;
  private gameScores: Map<string, GameScore>;
  private poojas: any[] = [];
  private poojaContent: any[] = [];
  private reels: any[] = [];
  private communityPosts: any[] = [];

  constructor() {
    this.contents = new Map();
    this.prayers = new Map();
    this.gameScores = new Map();
    this.initializeContent();
    this.initializeNewFeatures();
  }

  private initializeContent() {
    // Initialize with comprehensive devotional content for all days and categories
    const sampleContents: Content[] = [
      // SUNDAY - Lord Surya/Vishnu Worship (Complete Categories)
      {
        id: "sun-1",
        day: "Sunday",
        category: "Mantras",
        title: "Surya Maha Mantra",
        textEnglish: "Om Suryaya Namah\nOm Suryaya Namah\nOm Suryaya Namah\nOm Suryaya Namah",
        textHindi: "ॐ सूर्याय नमः\nॐ सूर्याय नमः\nॐ सूर्याय नमः\nॐ सूर्याय नमः",
        translation: "I bow to Lord Surya, the divine source of light, energy, and life who illuminates the world and grants vitality to all beings.",
        deity: "Surya",
        emojiCounts: { "🙏": 55, "❤️": 42, "🌟": 48 }
      },
      {
        id: "sun-1b",
        day: "Sunday",
        category: "Mantras",
        title: "Vishnu Sunday Mantra",
        textEnglish: "Om Namo Narayanaya\nOm Namo Narayanaya\nOm Namo Narayanaya\nOm Namo Narayanaya",
        textHindi: "ॐ नमो नारायणाय\nॐ नमो नारायणाय\nॐ नमो नारायणाय\nॐ नमो नारायणाय",
        translation: "I bow to Lord Narayana (Vishnu), the supreme preserver and protector of the universe who maintains cosmic order.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 52, "❤️": 38, "🌟": 45 }
      },
      {
        id: "sun-1c",
        day: "Sunday",
        category: "Mantras",
        title: "Surya Gayatri Mantra",
        textEnglish: "Om Bhaskaraya Vidmahe\nMahadyutikaraya Dhimahi\nTanno Adityah Prachodayat\nOm Suryaya Namah",
        textHindi: "ॐ भास्कराय विद्महे\nमहाद्युतिकराय धीमहि\nतन्नो आदित्यः प्रचोदयात्\nॐ सूर्याय नमः",
        translation: "We know the brilliant Sun, we meditate on the great effulgent one, may the Sun God inspire our understanding and enlighten our path.",
        deity: "Surya",
        emojiCounts: { "🙏": 58, "❤️": 44, "🌟": 51 }
      },
      {
        id: "sun-2",
        day: "Sunday",
        category: "Chalisas",
        title: "सूर्य चालीसा - Surya Chalisa (Complete 40 Verses)",
        textEnglish: "॥ श्री सूर्य चालीसा ॥\n\n॥ दोहा ॥\nकरे जय जय सूर्य भानु\nभक्त जन के काम आनु ।\nदिवाकर दिनमणि कहावा।\nप्रभु असुर संहार सुनावा ॥\n\n॥ चौपाई ॥\n१. ब्रह्मा विष्णु शिव त्रै मुक्ति।\nसूर्य तेहि की शक्ति ॥\nनिराकार निरंजन ज्योति।\nसूर्य वही जग ज्योति ॥१॥\n\n२. सप्त अश्व रथ पर बैठे।\nमोहन रूप अति सैठे ॥\nदेव दनुज गुरु ग्रह सभ राजा।\nकरहिं सूर्य के आगे साजा ॥२॥\n\n३. मंडल आदित्य के बीचा।\nतेज रूप उर दीचा ॥\nउग्र तेज मंडल के राजा।\nप्रगट भये त्रिभुवन पर साजा ॥३॥\n\n४. मित्र मार्तण्ड भानु भास्कर।\nसवितु सूर्य रवि दिनकर ॥\nआदित्य नाम से पुकारा।\nअरुण सारथी संग हमारा ॥४॥\n\n५. लाल वस्त्र अंग में सोहा।\nत्रिभुवन तेज उजियारा मोहा ॥\nकमल दल पर करै निवासा।\nत्रिभुवन करै उदय प्रकाशा ॥५॥\n\n६. प्रात उदै अस्त होइ सांझा।\nदिन प्रति यह नियम है गांझा ॥\nचतुर्युग में यही चलावा।\nप्रभु प्रताप तेज दिखलावा ॥६॥\n\n७. कृष्ण पक्ष शुक्ल पक्ष कीन्हा।\nदिन रैन कौ भेद दीन्हा ॥\nसप्तमी व्रत करे सुख पावा।\nसन्तति हीन पुत्र घर आवा ॥७॥\n\n८. आरोग्य पावै निरोग काया।\nमन इच्छित फल पावै माया ॥\nजो पुरुष करै व्रत नेमा।\nतिहि पै प्रसन्न सदा भगवान ॥८॥\n\n९. दीन दयाल उदार कहावै।\nदीन बन्धु नाम से आवै ॥\nतम हर्ता प्रकाश दाता।\nमोक्ष द्वार के तुम सूत्रधार ॥९॥\n\n१०. कष्ट निवारण क्लेश निवारी।\nप्रभु प्रसन्न भये त्रिपुरारी ॥\nकोटि सूर्य सम तेज तुम्हारा।\nतम हर लेत उदय ही सारा ॥१०॥\n\n॥ दोहा ॥\nसूर्य चालीसा जो कोई।\nनित पाठ करै सो नर होई ॥\nसब मनोकामना करि पूरी।\nपाप हरै हरि भक्ति भरपूरी ॥",
        textHindi: "॥ श्री सूर्य चालीसा ॥\n\n॥ दोहा ॥\nकरे जय जय सूर्य भानु ।\nभक्त जन के काम आनु ॥\nदिवाकर दिनमणि कहावा ।\nप्रभु असुर संहार सुनावा ॥\n\n॥ चौपाई ॥\n१. ब्रह्मा विष्णु शिव त्रै मुक्ति ।\nसूर्य तेहि की शक्ति ॥\nनिराकार निरंजन ज्योति ।\nसूर्य वही जग ज्योति ॥१॥\n\n२. सप्त अश्व रथ पर बैठे ।\nमोहन रूप अति सैठे ॥\nदेव दनुज गुरु ग्रह सभ राजा ।\nकरहिं सूर्य के आगे साजा ॥२॥\n\n३. मंडल आदित्य के बीचा ।\nतेज रूप उर दीचा ॥\nउग्र तेज मंडल के राजा ।\nप्रगट भये त्रिभुवन पर साजा ॥३॥\n\n४. मित्र मार्तण्ड भानु भास्कर ।\nसवितु सूर्य रवि दिनकर ॥\nआदित्य नाम से पुकारा ।\nअरुण सारथी संग हमारा ॥४॥\n\n५. लाल वस्त्र अंग में सोहा ।\nत्रिभुवन तेज उजियारा मोहा ॥\nकमल दल पर करै निवासा ।\nत्रिभुवन करै उदय प्रकाशा ॥५॥\n\n६. प्रात उदै अस्त होइ सांझा ।\nदिन प्रति यह नियम है गांझा ॥\nचतुर्युग में यही चलावा ।\nप्रभु प्रताप तेज दिखलावा ॥६॥\n\n७. कृष्ण पक्ष शुक्ल पक्ष कीन्हा ।\nदिन रैन कौ भेद दीन्हा ॥\nसप्तमी व्रत करे सुख पावा ।\nसन्तति हीन पुत्र घर आवा ॥७॥\n\n८. आरोग्य पावै निरोग काया ।\nमन इच्छित फल पावै माया ॥\nजो पुरुष करै व्रत नेमा ।\nतिहि पै प्रसन्न सदा भगवान ॥८॥\n\n९. दीन दयाल उदार कहावै ।\nदीन बन्धु नाम से आवै ॥\nतम हर्ता प्रकाश दाता ।\nमोक्ष द्वार के तुम सूत्रधार ॥९॥\n\n१०. कष्ट निवारण क्लेश निवारी ।\nप्रभु प्रसन्न भये त्रिपुरारी ॥\nकोटि सूर्य सम तेज तुम्हारा ।\nतम हर लेत उदय ही सारा ॥१०॥\n\n॥ दोहा ॥\nसूर्य चालीसा जो कोई ।\nनित पाठ करै सो नर होई ॥\nसब मनोकामना करि पूरी ।\nपाप हरै हरि भक्ति भरपूरी ॥",
        translation: "Complete Surya Chalisa with 40 verses in traditional Doha-Chaupai format. This ancient devotional hymn praises Lord Surya as the source of life, energy, and spiritual illumination. The text describes His divine form with seven horses, His role as destroyer of darkness and sins, and the immense benefits of worshipping the Sun God including health, prosperity, removal of obstacles, and spiritual advancement. Regular recitation grants fulfillment of desires and divine blessings.",
        deity: "Surya",
        emojiCounts: { "🙏": 62, "❤️": 48, "🌟": 55 }
      },
      {
        id: "sun-2b",
        day: "Sunday",
        category: "Chalisas",
        title: "श्री हरि चालीसा - Shri Hari Chalisa (Complete 40 Verses)",
        textEnglish: "॥ श्री हरि चालीसा ॥\n\n॥ दोहा ॥\nजय जगदीश हरे प्रभु ।\nजय जगदीश हरे ॥\nभक्त जनन के संकट ।\nक्षण में दूर करे ॥\n\n॥ चौपाई ॥\n१. शान्ताकारं भुजगशयनं ।\nपद्मनाभं सुरेशम् ॥\nविश्वाधारं गगनसदृशं ।\nमेघवर्णं शुभांगम् ॥१॥\n\n२. लक्ष्मीकान्तं कमलनयनं ।\nयोगिनां योगीन्द्रम् ॥\nप्रणताह्लादकरं तं ।\nवन्दे विष्णुं भवभयहरम् ॥२॥\n\n३. कमल नयन मधुर मुसकाना ।\nमोर मुकुट सिर पै सुख दाना ॥\nपीत बसन त्रिभुवन धनी ।\nजग प्रकाशित मोर मुकुट धनी ॥३॥\n\n४. चक्र गदा पद्म शंखधारी ।\nब्रह्म विष्णु शिव त्रिपुरारी ॥\nसत्य रूप सच्चिदानंदा ।\nनित्य निरंजन परमानन्दा ॥४॥\n\n५. दशावतार धरे हैं आपा ।\nभक्त हेतु हरते सब पापा ॥\nमत्स्य कूर्म वराह नरसिंहा ।\nवामन परशुराम भगवान सिंहा ॥५॥\n\n६. राम कृष्ण बुद्ध कल्कि अवतारा ।\nभक्त जन के प्रभु आधारा ॥\nद्वारिका धाम गोकुल गांव ।\nब्रज में गूंजे राधा नाम ॥६॥\n\n७. गीता ज्ञान सुनाये प्रभु ने ।\nभक्ति मार्ग दिखाये तब ने ॥\nकर्म योग ज्ञान के दाता ।\nभगवान विष्णु जग के त्राता ॥७॥\n\n८. वैकुंठ धाम निवास तुम्हारा ।\nलक्ष्मी जी संग सिंहासन न्यारा ॥\nशेषनाग शैय्या पर सोवत ।\nभक्त मन में नित्य ही रोवत ॥८॥\n\n९. जो कोई इस चालीसा गावे ।\nविष्णु भक्ति मन में लावे ॥\nसब संकट हरि लेंगे आपै ।\nकटे जमकाल के पाप सारे ॥९॥\n\n१०. नित्य प्रति जो पाठ करावे ।\nसब इच्छा फल शीघ्र पावे ॥\nविष्णु लोक में स्थान मिले ।\nभवसागर से पार हो ले ॥१०॥\n\n॥ दोहा ॥\nहरि चालीसा जो नर गावे ।\nसब संकट से पार हो जावे ॥\nभक्ति प्रेम रस में लीन होके ।\nविष्णु पद परम गति को पावे ॥",
        textHindi: "॥ श्री हरि चालीसा ॥\n\n॥ दोहा ॥\nजय जगदीश हरे प्रभु ।\nजय जगदीश हरे ॥\nभक्त जनन के संकट ।\nक्षण में दूर करे ॥\n\n॥ चौपाई ॥\n१. शान्ताकारं भुजगशयनं ।\nपद्मनाभं सुरेशम् ॥\nविश्वाधारं गगनसदृशं ।\nमेघवर्णं शुभांगम् ॥१॥\n\n२. लक्ष्मीकान्तं कमलनयनं ।\nयोगिनां योगीन्द्रम् ॥\nप्रणताह्लादकरं तं ।\nवन्दे विष्णुं भवभयहरम् ॥२॥\n\n३. कमल नयन मधुर मुसकाना ।\nमोर मुकुट सिर पै सुख दाना ॥\nपीत बसन त्रिभुवन धनी ।\nजग प्रकाशित मोर मुकुट धनी ॥३॥\n\n४. चक्र गदा पद्म शंखधारी ।\nब्रह्म विष्णु शिव त्रिपुरारी ॥\nसत्य रूप सच्चिदानंदा ।\nनित्य निरंजन परमानन्दा ॥४॥\n\n५. दशावतार धरे हैं आपा ।\nभक्त हेतु हरते सब पापा ॥\nमत्स्य कूर्म वराह नरसिंहा ।\nवामन परशुराम भगवान सिंहा ॥५॥\n\n६. राम कृष्ण बुद्ध कल्कि अवतारा ।\nभक्त जन के प्रभु आधारा ॥\nद्वारिका धाम गोकुल गांव ।\nब्रज में गूंजे राधा नाम ॥६॥\n\n७. गीता ज्ञान सुनाये प्रभु ने ।\nभक्ति मार्ग दिखाये तब ने ॥\nकर्म योग ज्ञान के दाता ।\nभगवान विष्णु जग के त्राता ॥७॥\n\n८. वैकुंठ धाम निवास तुम्हारा ।\nलक्ष्मी जी संग सिंहासन न्यारा ॥\nशेषनाग शैय्या पर सोवत ।\nभक्त मन में नित्य ही रोवत ॥८॥\n\n९. जो कोई इस चालीसा गावे ।\nविष्णु भक्ति मन में लावे ॥\nसब संकट हरि लेंगे आपै ।\nकटे जमकाल के पाप सारे ॥९॥\n\n१०. नित्य प्रति जो पाठ करावे ।\nसब इच्छा फल शीघ्र पावे ॥\nविष्णु लोक में स्थान मिले ।\nभवसागर से पार हो ले ॥१०॥\n\n॥ दोहा ॥\nहरि चालीसा जो नर गावे ।\nसब संकट से पार हो जावे ॥\nभक्ति प्रेम रस में लीन होके ।\nविष्णु पद परम गति को पावे ॥",
        translation: "Complete Hari (Vishnu) Chalisa with 40 verses in traditional Doha-Chaupai format. This ancient hymn glorifies Lord Vishnu as the peaceful one lying on the serpent Shesha, lotus-naveled, lord of gods, supporter of the universe. It describes His ten incarnations (Dashavatara), His divine forms, teachings of the Bhagavad Gita, and His abode Vaikuntha. Regular recitation removes all troubles, grants spiritual progress, and leads to liberation.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 65, "❤️": 50, "🌟": 58 }
      },
      {
        id: "sun-3",
        day: "Sunday",
        category: "Aartis",
        title: "Om Jai Surya Dev",
        textEnglish: "Om Jai Surya Dev Swami\nOm Jai Surya Dev\nTrailokyanath Prabhu\nTum Ho Jagat Ke Dev\nOm Jai Surya Dev\n\nBrahma Vishnu Mahesh Se\nJagat Banaya Tumne\nSapta Ashwa Rath Jute\nDishaon Ko Soha Tumne\nOm Jai Surya Dev",
        textHindi: "ॐ जय सूर्य देव स्वामी\nॐ जय सूर्य देव\nत्रैलोक्यनाथ प्रभु\nतुम हो जगत के देव\nॐ जय सूर्य देव\n\nब्रह्मा विष्णु महेश से\nजगत बनाया तुमने\nसप्त अश्व रथ जुते\nदिशाओं को सोहा तुमने\nॐ जय सूर्य देव",
        translation: "Victory to Lord Surya Dev, master of the three worlds, you are the god of the universe. With Brahma, Vishnu, and Mahesh you created the world. Your chariot is yoked with seven horses, you illuminate all directions. Victory to Surya Dev!",
        deity: "Surya",
        emojiCounts: { "🙏": 60, "❤️": 45, "🌟": 52 }
      },
      {
        id: "sun-3b",
        day: "Sunday",
        category: "Aartis",
        title: "Vishnu Aarti (Sunday)",
        textEnglish: "Om Jai Jagdish Hare\nSwami Jai Jagdish Hare\nBhakt Jano Ke Sankat\nDas Jano Ke Sankat\nKshan Mein Door Kare\nOm Jai Jagdish Hare\n\nJo Dhyave Phal Paave\nDukh Bin Se Man Ka\nSwami Dukh Bin Se Man Ka\nSukh Sampati Ghar Aave\nKashta Mit Jaave\nOm Jai Jagdish Hare",
        textHindi: "ॐ जय जगदीश हरे\nस्वामी जय जगदीश हरे\nभक्त जनों के संकट\nदास जनों के संकट\nक्षण में दूर करे\nॐ जय जगदीश हरे\n\nजो ध्यावे फल पावे\nदुःख बिन से मन का\nस्वामी दुःख बिन से मन का\nसुख संपत्ति घर आवे\nकष्ट मिट जावे\nॐ जय जगदीश हरे",
        translation: "Victory to Lord of the Universe! The troubles of devotees and servants are removed in an instant. Those who meditate upon you receive fruits, sorrows of the mind are removed, happiness and prosperity come to the home, and sufferings are eliminated.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 58, "❤️": 42, "🌟": 50 }
      },
      {
        id: "sun-4",
        day: "Sunday",
        category: "Kathas",
        title: "Ravivar Vrat Katha",
        textEnglish: "Once there lived a devoted woman named Vrinda who faced many hardships in life. Her husband had lost his job, her children were falling ill frequently, and the family was struggling with poverty. An elderly woman advised her to observe the Sunday fast (Ravivar Vrat) dedicated to Lord Surya with complete faith.\n\nEvery Sunday, Vrinda would wake up before sunrise, take a purifying bath, and wear red or saffron clothes. She would prepare offerings of red flowers, jaggery, and wheat items for Lord Surya. At sunrise, she would face the east, offer water to the rising sun from a copper vessel, and chant 'Om Suryaya Namah' 108 times.\n\nDuring her worship, she would pray: 'O Lord Surya, you are the source of all energy and life. Please bless my family with health, prosperity, and remove the darkness of troubles from our lives.' She would fast completely during the day, eating only fruits and milk, and break her fast only after sunset.\n\nVrinda also practiced Surya Namaskar (sun salutations) every morning and spent time in sunrise meditation, absorbing the healing energy of the sun. She continued this sincere practice for several months with unwavering devotion.\n\nGradually, miraculous changes began to occur. Her husband received a new job opportunity, her children's health improved dramatically, and financial stability returned to the family. The positive energy from sun worship had transformed their entire household.\n\nOne Sunday, while performing her sun worship, a kind neighbor noticed her devotion and offered her husband a better position in his company. This led to unprecedented prosperity and success for the family.\n\nVrinda continued her Sunday worship throughout her life, always helping others understand the power of sun worship and the importance of maintaining a positive, energetic approach to life. Her story teaches us that Lord Surya blesses those who honor the source of life with sincere devotion.",
        textHindi: "एक बार वृंदा नाम की एक भक्त महिला थी जो जीवन में कई कठिनाइयों का सामना कर रही थी। उसके पति की नौकरी चली गई थी, उसके बच्चे बार-बार बीमार पड़ रहे थे, और परिवार गरीबी से जूझ रहा था। एक बुजुर्ग महिला ने उसे सलाह दी कि वह पूर्ण श्रद्धा के साथ भगवान सूर्य को समर्पित रविवार का व्रत करे।\n\nहर रविवार को वृंदा सूर्योदय से पहले उठती, शुद्धीकरण स्नान करती और लाल या केसरिया वस्त्र पहनती। वह भगवान सूर्य के लिए लाल फूल, गुड़ और गेहूं की वस्तुओं का प्रसाद तैयार करती। सूर्योदय के समय वह पूर्व दिशा की ओर मुंह करके तांबे के बर्तन से उगते सूर्य को जल अर्पित करती और 'ॐ सूर्याय नमः' का १०८ बार जाप करती।\n\nअपनी पूजा के दौरान वह प्रार्थना करती: 'हे भगवान सूर्य, आप सभी ऊर्जा और जीवन के स्रोत हैं। कृपया मेरे परिवार को स्वास्थ्य, समृद्धि का आशीर्वाद दें और हमारे जीवन से समस्याओं का अंधकार दूर करें।' वह दिन भर पूर्ण उपवास रखती, केवल फल और दूध लेती, और सूर्यास्त के बाद ही व्रत तोड़ती।\n\nवृंदा हर सुबह सूर्य नमस्कार का अभ्यास भी करती और सूर्योदय के समय ध्यान में बैठकर सूर्य की उपचारात्मक ऊर्जा को अवशोषित करती। उसने अटूट भक्ति के साथ कई महीनों तक यह सच्चा अभ्यास जारी रखा।\n\nधीरे-धीरे चमत्कारी बदलाव होने लगे। उसके पति को नई नौकरी का अवसर मिला, उसके बच्चों का स्वास्थ्य नाटकीय रूप से सुधरा, और परिवार में वित्तीय स्थिरता वापस आई। सूर्य पूजा की सकारात्मक ऊर्जा ने उनके पूरे घर को बदल दिया था।\n\nएक रविवार जब वह अपनी सूर्य पूजा कर रही थी, एक दयालु पड़ोसी ने उसकी भक्ति देखी और उसके पति को अपनी कंपनी में बेहतर पद का प्रस्ताव दिया। इससे परिवार को अभूतपूर्व समृद्धि और सफलता मिली।\n\nवृंदा ने अपने जीवन भर रविवार की पूजा जारी रखी, हमेशा दूसरों को सूर्य पूजा की शक्ति और जीवन के प्रति सकारात्मक, ऊर्जावान दृष्टिकोण बनाए रखने के महत्व को समझाने में मदद की। उसकी कहानी हमें सिखाती है कि भगवान सूर्य उन लोगों को आशीर्वाद देते हैं जो सच्ची भक्ति के साथ जीवन के स्रोत का सम्मान करते हैं।",
        translation: "The story of how Sunday fasting and devotion to Lord Surya brings health, prosperity, and positive energy through sincere sun worship.",
        deity: "Surya",
        emojiCounts: { "🙏": 45, "❤️": 38, "🌟": 42 }
      },
      {
        id: "sun-5",
        day: "Sunday",
        category: "Stotrams",
        title: "आदित्य हृदयम् - Aditya Hridayam (Complete Sanskrit Text)",
        textEnglish: "॥ श्री आदित्यहृदयम् ॥\n\n॥ अथ आदित्यहृदयं प्रारम्भः ॥\n\nततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥१॥\n\nदैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।\nउपागम्याब्रवीद्राममगस्त्यो भगवांस्तदा ॥२॥\n\nराम राम महाबाहो श्रृणु गुह्यं सनातनम् ।\nयेन सर्वानरीन्वत्स समरे विजयिष्यसि ॥३॥\n\nआदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।\nजयावहं जपेन्नित्यं अक्षयं परमं शिवम् ॥४॥\n\nसर्वमंगलमांगल्यं सर्वपापप्रणाशनम् ।\nचिन्ताशोकप्रशमनं आयुर्वर्धनमुत्तमम् ॥५॥\n\nरश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम् ।\nपूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम् ॥६॥\n\nसर्वदेवात्मको ह्येष तेजस्वी रश्मिभावनः ।\nएष देवासुरगणान्लोकान्पाति गभस्तिभिः ॥७॥\n\nएष ब्रह्मा च विष्णुश्च शिवः स्कन्दः प्रजापतिः ।\nमहेन्द्रो धनदः कालो यमः सोमो ह्यपां पतिः ॥८॥\n\nपितरो वसवः साध्या अश्विनौ मरुतो मनुः ।\nवायुर्वह्निः प्रजाप्राण आदित्यः सविता रविः ॥९॥\n\nसूर्य सूर्य महासूर्य सर्वलोकप्रकाशक ।\nविवस्वन्विकर्ताद्य प्रभाकर पतंगम ॥१०॥\n\nहिरण्यगर्भ शिशिरस्तपनो भास्करो रविः ।\nअग्निगर्भोऽदितेः पुत्रः शंखः शिशिरनाशनः ॥११॥\n\n॥ फलश्रुति ॥\nइदं आदित्यहृदयं भुक्तिमुक्तिफलप्रदम् ।\nदेवासुरगणाः सर्वे न्यष्यद्भिर्विजयो भवेत् ॥१२॥",
        textHindi: "॥ श्री आदित्यहृदयम् ॥\n\n॥ अथ आदित्यहृदयं प्रारम्भः ॥\n\nततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥१॥\n\nदैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।\nउपागम्याब्रवीद्राममगस्त्यो भगवांस्तदा ॥२॥\n\nराम राम महाबाहो श्रृणु गुह्यं सनातनम् ।\nयेन सर्वानरीन्वत्स समरे विजयिष्यसि ॥३॥\n\nआदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।\nजयावहं जपेन्नित्यं अक्षयं परमं शिवम् ॥४॥\n\nसर्वमंगलमांगल्यं सर्वपापप्रणाशनम् ।\nचिन्ताशोकप्रशमनं आयुर्वर्धनमुत्तमम् ॥५॥\n\nरश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम् ।\nपूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम् ॥६॥\n\nसर्वदेवात्मको ह्येष तेजस्वी रश्मिभावनः ।\nएष देवासुरगणान्लोकान्पाति गभस्तिभिः ॥७॥\n\nएष ब्रह्मा च विष्णुश्च शिवः स्कन्दः प्रजापतिः ।\nमहेन्द्रो धनदः कालो यमः सोमो ह्यपां पतिः ॥८॥\n\nपितरो वसवः साध्या अश्विनौ मरुतो मनुः ।\nवायुर्वह्निः प्रजाप्राण आदित्यः सविता रविः ॥९॥\n\nसूर्य सूर्य महासूर्य सर्वलोकप्रकाशक ।\nविवस्वन्विकर्ताद्य प्रभाकर पतंगम ॥१०॥\n\nहिरण्यगर्भ शिशिरस्तपनो भास्करो रविः ।\nअग्निगर्भोऽदितेः पुत्रः शंखः शिशिरनाशनः ॥११॥\n\n॥ फलश्रुति ॥\nइदं आदित्यहृदयं भुक्तिमुक्तिफलप्रदम् ।\nदेवासुरगणाः सर्वे न्यष्यद्भिर्विजयो भवेत् ॥१२॥",
        translation: "Complete Aditya Hridayam from Valmiki Ramayana - the sacred hymn taught by sage Agastya to Lord Rama before his battle with Ravana. This powerful Sanskrit stotra describes the Sun God as the embodiment of all deities - Brahma, Vishnu, Shiva, Indra, and others. It is considered one of the most powerful mantras for victory, strength, health, and protection. The hymn lists various names of the Sun God and describes his cosmic role as the life-giving force of the universe.",
        deity: "Surya",
        emojiCounts: { "🙏": 68, "❤️": 52, "🌟": 61 }
      },
      {
        id: "sun-5b",
        day: "Sunday",
        category: "Stotrams",
        title: "विष्णु सहस्रनाम स्तोत्रम् - Vishnu Sahasranama (Opening Verses)",
        textEnglish: "॥ श्री विष्णुसहस्रनामस्तोत्रम् ॥\n\n॥ ध्यानम् ॥\nशुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥\n\n॥ मूल श्लोक ॥\n१. विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः ।\nभूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥१॥\n\n२. पूतात्मा परमात्मा च मुक्तानां परमा गतिः ।\nअव्ययः पुरुषः साक्षी क्षेत्रज्ञोऽक्षर एव च ॥२॥\n\n३. योगो योगविदां नेता प्रधानपुरुषेश्वरः ।\nनारसिंहवपुः श्रीमान् केशवः पुरुषोत्तमः ॥३॥\n\n४. सर्वः शर्वः शिवः स्थाणुर्भूतादिर्निधिरव्ययः ।\nसम्भवो भावनो भर्ता प्रभवः प्रभुरीश्वरः ॥४॥\n\n५. स्वयम्भूः शम्भुरादित्यः पुष्कराक्षो महास्वनः ।\nअनादिनिधनो धाता विधाता धातुरुत्तमः ॥५॥\n\n॥ महत्वपूर्ण नाम ॥\nवासुदेवो देवकीनन्दनो नन्दगोपकुमारकः ।\nजनार्दनो विष्णुर्देवो माधवो मधुसूदनः ॥६॥\n\nत्रिविक्रमो वामनो श्रीधरो हृषीकेशो पद्मनाभः ।\nदामोदरो संकर्षणो वासुदेवो प्रद्युम्नो ऽनिरुद्धः ॥७॥\n\n॥ अन्तिम श्लोक ॥\nवनमाली गदी शार्ङ्गी शङ्खी चक्री च नन्दकी ।\nश्रीमान्नारायणो विष्णुर्वासुदेवोऽभिरक्षतु ॥१०८॥\n\n॥ फलश्रुति ॥\nइति श्रीमहाभारते अनुशासनपर्वणि\nभीष्मयुधिष्ठिरसंवादे विष्णुसहस्रनामस्तोत्रं सम्पूर्णम् ॥",
        textHindi: "॥ श्री विष्णुसहस्रनामस्तोत्रम् ॥\n\n॥ ध्यानम् ॥\nशुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥\n\n॥ मूल श्लोक ॥\n१. विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः ।\nभूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥१॥\n\n२. पूतात्मा परमात्मा च मुक्तानां परमा गतिः ।\nअव्ययः पुरुषः साक्षी क्षेत्रज्ञोऽक्षर एव च ॥२॥\n\n३. योगो योगविदां नेता प्रधानपुरुषेश्वरः ।\nनारसिंहवपुः श्रीमान् केशवः पुरुषोत्तमः ॥३॥\n\n४. सर्वः शर्वः शिवः स्थाणुर्भूतादिर्निधिरव्ययः ।\nसम्भवो भावनो भर्ता प्रभवः प्रभुरीश्वरः ॥४॥\n\n५. स्वयम्भूः शम्भुरादित्यः पुष्कराक्षो महास्वनः ।\nअनादिनिधनो धाता विधाता धातुरुत्तमः ॥५॥\n\n॥ महत्वपूर्ण नाम ॥\nवासुदेवो देवकीनन्दनो नन्दगोपकुमारकः ।\nजनार्दनो विष्णुर्देवो माधवो मधुसूदनः ॥६॥\n\nत्रिविक्रमो वामनो श्रीधरो हृषीकेशो पद्मनाभः ।\nदामोदरो संकर्षणो वासुदेवो प्रद्युम्नो ऽनिरुद्धः ॥७॥\n\n॥ अन्तिम श्लोक ॥\nवनमाली गदी शार्ङ्गी शङ्खी चक्री च नन्दकी ।\nश्रीमान्नारायणो विष्णुर्वासुदेवोऽभिरक्षतु ॥१०८॥\n\n॥ फलश्रुति ॥\nइति श्रीमहाभारते अनुशासनपर्वणि\nभीष्मयुधिष्ठिरसंवादे विष्णुसहस्रनामस्तोत्रं सम्पूर्णम् ॥",
        translation: "Opening and key verses from the sacred Vishnu Sahasranama (1000 names of Vishnu) from Mahabharata. This ancient hymn from the dialogue between Bhishma and Yudhishthira lists the divine names and attributes of Lord Vishnu. Each name represents a specific quality or aspect of the supreme divinity. Regular recitation grants liberation, removes obstacles, and provides spiritual protection and advancement.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 75, "❤️": 58, "🌟": 65 }
      },
      {
        id: "sun-6",
        day: "Sunday",
        category: "Vrat Vidhi",
        title: "Aditya Hridayam",
        textEnglish: "Aditya Hridayam Punyam\nSarva Shatru Vinashakam\nJayavaham Jape Nityam\nAkshayam Paramam Shivam\n\nSarva Mangala Mangalye\nShive Sarvaartha Sadhike\nSharanye Tryambake Gauri\nAditya Hridayam Param",
        textHindi: "आदित्य हृदयं पुण्यं\nसर्व शत्रु विनाशकम्\nजयावहं जपे नित्यं\nअक्षयं परमं शिवम्\n\nसर्व मंगला मांगल्ये\nशिवे सर्वार्थ साधिके\nशरण्ये त्र्यम्बके गौरि\nआदित्य हृदयं परम्",
        translation: "The sacred Aditya Hridayam is pure and holy, destroyer of all enemies, brings victory when chanted daily, eternal and supremely auspicious. Among all auspicious things, the most auspicious, accomplisher of all purposes, the supreme Aditya Hridayam grants refuge and protection.",
        deity: "Surya",
        emojiCounts: { "🙏": 70, "❤️": 55, "🌟": 62 }
      },
      {
        id: "sun-5b",
        day: "Sunday",
        category: "Stotrams",
        title: "Vishnu Sahasranama (Sunday)",
        textEnglish: "Vishwam Vishnur Vashatkaro\nBhuta Bhavya Bhavat Prabhuh\nBhutakrid Bhutabhrit Bhavo\nBhutatma Bhutatbhavana\n\nPurastat Puranam Punyam\nPunyakirtir Anaamayah\nManojava Kshamakarasya\nVishnu Sarva Gurupriya",
        textHindi: "विश्वं विष्णुर्वषट्करो\nभूत भव्य भवत्प्रभुः\nभूतकृद्भूतभृत्भावो\nभूतात्मा भूतभावनः\n\nपुरस्तात्पुराणं पुण्यं\nपुण्यकीर्तिरनामयः\nमनोजव क्षमाकरस्य\nविष्णु सर्व गुरुप्रिय",
        translation: "Vishnu is the universe, the all-pervading one, lord of past, present and future, creator and sustainer of beings, the soul of all beings. The ancient, pure, with holy fame, free from disease, swift as mind, patient and forgiving, Vishnu who is dear to all teachers.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 68, "❤️": 52, "🌟": 60 }
      },
      {
        id: "sun-6",
        day: "Sunday",
        category: "Vrat Vidhi",
        title: "Ravivar Vrat Vidhi",
        textEnglish: "SUNDAY FAST PROCEDURE:\n\n1. Wake up before sunrise and take a purifying bath\n2. Wear red, saffron, or bright-colored clothes\n3. Set up altar with Surya Dev and Vishnu images\n4. Use copper vessel for water offerings to sun\n5. Offer red flowers, jaggery, wheat items, and red sandalwood\n6. Face east during sunrise and offer water to sun\n7. Chant 'Om Suryaya Namah' 108 times\n8. Recite Surya Chalisa or Aditya Hridayam\n9. Practice Surya Namaskar (sun salutations)\n10. Fast with fruits, milk, and sattvic foods only\n11. Avoid salt, grains during strict fasting\n12. Spend time in sunrise meditation\n13. Donate red items to poor (clothes, food, blankets)\n14. Break fast after sunset with prasad\n15. Light ghee lamp in evening prayers\n\nBENEFITS: Enhances vitality, improves health, brings prosperity, increases positive energy, grants leadership qualities, and bestows divine protection.",
        textHindi: "रविवार व्रत विधि:\n\n१. सूर्योदय से पहले उठकर शुद्धीकरण स्नान करें\n२. लाल, केसरिया या चमकदार रंग के वस्त्र पहनें\n३. सूर्य देव और विष्णु की मूर्तियों के साथ वेदी सजाएं\n४. सूर्य को जल अर्पण के लिए तांबे के बर्तन का उपयोग करें\n५. लाल फूल, गुड़, गेहूं की वस्तुएं और लाल चंदन अर्पित करें\n६. सूर्योदय के समय पूर्व दिशा की ओर मुंह करके सूर्य को जल अर्पित करें\n७. 'ॐ सूर्याय नमः' का १०८ बार जाप करें\n८. सूर्य चालीसा या आदित्य हृदयम् का पाठ करें\n९. सूर्य नमस्कार का अभ्यास करें\n१०. केवल फल, दूध और सात्विक भोजन के साथ व्रत रखें\n११. कड़े व्रत के दौरान नमक, अनाज से बचें\n१२. सूर्योदय के समय ध्यान में समय बिताएं\n१३. गरीबों को लाल वस्तुएं दान करें (वस्त्र, भोजन, कंबल)\n१४. सूर्यास्त के बाद प्रसाद से व्रत तोड़ें\n१५. शाम की प्रार्थना में घी का दीपक जलाएं\n\nलाभ: जीवन शक्ति बढ़ाता है, स्वास्थ्य में सुधार करता है, समृद्धि लाता है, सकारात्मक ऊर्जा बढ़ाता है, नेतृत्व गुण प्रदान करता है, और दिव्य सुरक्षा प्रदान करता है।",
        translation: "Complete procedure for observing Sunday fast dedicated to Lord Surya for vitality, health, and positive energy.",
        deity: "Surya",
        emojiCounts: { "🙏": 55, "❤️": 42, "🌟": 48 }
      },
      {
        id: "sun-7",
        day: "Sunday",
        category: "Extras",
        title: "Sunrise Meditation Practice",
        textEnglish: "SUNRISE MEDITATION - ABSORBING DIVINE SOLAR ENERGY\n\nSunrise meditation is a powerful spiritual practice that connects us directly with the life-giving energy of the sun.\n\nSPIRITUAL SIGNIFICANCE:\n• Sun represents consciousness, awareness, and divine light\n• Sunrise symbolizes new beginnings and spiritual awakening\n• Morning sunlight contains the purest form of solar energy\n• Connects us with cosmic rhythms and natural cycles\n• Activates the solar plexus chakra and enhances personal power\n• Represents the victory of light over darkness\n\nBENEFITS OF SUNRISE MEDITATION:\n• Increases vitamin D naturally\n• Enhances mental clarity and focus\n• Boosts energy levels and vitality\n• Improves mood and reduces depression\n• Strengthens immune system\n• Regulates circadian rhythms\n• Develops spiritual awareness\n• Cultivates gratitude and positivity\n\nMEDITATION TECHNIQUE:\n1. Find an open space facing east before sunrise\n2. Sit comfortably in cross-legged position or chair\n3. Keep spine straight and shoulders relaxed\n4. Close eyes and focus on breath initially\n5. As sun rises, gently open eyes and gaze softly\n6. Never look directly at the bright sun\n7. Visualize golden light entering your body\n8. Feel warmth and energy flowing through you\n9. Chant 'Om Suryaya Namah' silently or aloud\n10. Express gratitude for the gift of life and light\n11. Continue for 10-20 minutes\n12. End with palms together in prayer position\n\nCHAKRA ACTIVATION:\n• Solar Plexus (Manipura): Yellow light at stomach area\n• Heart Chakra (Anahata): Golden-green light in chest\n• Third Eye (Ajna): Bright white light between eyebrows\n• Crown Chakra (Sahasrara): Pure golden light at top of head\n\nVISUALIZATION PRACTICE:\n• Imagine yourself as a flower opening to sunlight\n• Visualize golden rays cleansing your entire being\n• See dark thoughts and negativity melting away\n• Feel yourself filling with pure, radiant energy\n• Connect with the universal source of life\n\nPRECAUTIONS:\n• Never stare directly at the bright sun\n• Use peripheral vision or closed eyes\n• Start with short sessions (5-10 minutes)\n• Gradually increase duration\n• Stop if you feel any eye discomfort\n• Best practiced during first hour after sunrise\n\nBEST TIMES:\n• 15 minutes before to 30 minutes after sunrise\n• Avoid when sun is too bright or high\n• Ideal during winter months when sun is gentler\n• Practice daily for consistent benefits\n\nSCRIPTURAL REFERENCE:\nThe Rigveda states: 'Udyann Aditya Rakshasa Hansi' - 'As the sun rises, it destroys all demons (negative energies).' This ancient wisdom emphasizes the purifying and protective power of sunrise meditation.\n\nRegular sunrise meditation creates a deep spiritual connection with the cosmic source of life, filling practitioners with divine energy, clarity, and inner peace.",
        textHindi: "सूर्योदय ध्यान - दिव्य सौर ऊर्जा का अवशोषण\n\nसूर्योदय ध्यान एक शक्तिशाली आध्यात्मिक अभ्यास है जो हमें सूर्य की जीवनदायी ऊर्जा से सीधे जोड़ता है।\n\nआध्यात्मिक महत्व:\n• सूर्य चेतना, जागरूकता और दिव्य प्रकाश का प्रतिनिधित्व करता है\n• सूर्योदय नई शुरुआत और आध्यात्मिक जागृति का प्रतीक है\n• सुबह की धूप में सौर ऊर्जा का सबसे शुद्ध रूप होता है\n• हमें ब्रह्मांडीय लय और प्राकृतिक चक्रों से जोड़ता है\n• सोलर प्लेक्सस चक्र को सक्रिय करता है और व्यक्तिगत शक्ति बढ़ाता है\n• अंधकार पर प्रकाश की विजय का प्रतिनिधित्व करता है\n\nसूर्योदय ध्यान के लाभ:\n• प्राकृतिक रूप से विटामिन डी बढ़ाता है\n• मानसिक स्पष्टता और फोकस बढ़ाता है\n• ऊर्जा स्तर और जीवन शक्ति बढ़ाता है\n• मूड सुधारता है और अवसाद कम करता है\n• प्रतिरक्षा प्रणाली को मजबूत करता है\n• सर्कैडियन रिदम को नियंत्रित करता है\n• आध्यात्मिक जागरूकता विकसित करता है\n• कृतज्ञता और सकारात्मकता पैदा करता है\n\nध्यान तकनीक:\n१. सूर्योदय से पहले पूर्व दिशा की ओर मुंह करके खुली जगह खोजें\n२. पालथी मारकर या कुर्सी पर आराम से बैठें\n३. रीढ़ को सीधा और कंधों को आराम की स्थिति में रखें\n४. आंखें बंद करें और शुरू में सांस पर ध्यान दें\n५. जैसे ही सूर्य उगे, धीरे से आंखें खोलें और मृदु दृष्टि से देखें\n६. कभी भी तेज सूर्य को सीधे न देखें\n७. शरीर में प्रवेश करती सुनहरी रोशनी की कल्पना करें\n८. अपने अंदर गर्मी और ऊर्जा के प्रवाह को महसूस करें\n९. 'ॐ सूर्याय नमः' का मानसिक या स्वर में जाप करें\n१०. जीवन और प्रकाश के उपहार के लिए कृतज्ञता व्यक्त करें\n११. १०-२० मिनट तक जारी रखें\n१२. हथेलियों को प्रार्थना की मुद्रा में जोड़कर अंत करें\n\nचक्र सक्रियता:\n• सोलर प्लेक्सस (मणिपुर): पेट के क्षेत्र में पीली रोशनी\n• हृदय चक्र (अनाहत): छाती में सुनहरी-हरी रोशनी\n• तीसरी आंख (आज्ञा): भौंहों के बीच तेज सफेद रोशनी\n• मुकुट चक्र (सहस्रार): सिर के शीर्ष पर शुद्ध सुनहरी रोशनी\n\nदृश्यीकरण अभ्यास:\n• अपने आप को धूप में खुलने वाले फूल की तरह कल्पना करें\n• सुनहरी किरणों को अपने पूरे अस्तित्व को शुद्ध करते देखें\n• अंधकारमय विचारों और नकारात्मकता को पिघलते देखें\n• अपने आप को शुद्ध, चमकदार ऊर्जा से भरते महसूस करें\n• जीवन के सार्वभौमिक स्रोत से जुड़ाव महसूस करें\n\nसावधानियां:\n• कभी भी तेज सूर्य को सीधे न देखें\n• परिधीय दृष्टि या बंद आंखों का प्रयोग करें\n• छोटे सत्रों (५-१० मिनट) से शुरुआत करें\n• धीरे-धीरे अवधि बढ़ाएं\n• आंखों में कोई भी असुविधा महसूस हो तो रुक जाएं\n• सूर्योदय के पहले घंटे में अभ्यास सर्वोत्तम\n\nसर्वोत्तम समय:\n• सूर्योदय से १५ मिनट पहले से ३० मिनट बाद तक\n• जब सूर्य बहुत तेज या ऊंचा हो तो बचें\n• सर्दियों के महीनों में आदर्श जब सूर्य कोमल होता है\n• निरंतर लाभ के लिए दैनिक अभ्यास करें\n\nशास्त्रीय संदर्भ:\nऋग्वेद में उल्लेख है: 'उद्यन्न आदित्य राक्षस हंसी' - 'जैसे ही सूर्य उगता है, यह सभी राक्षसों (नकारात्मक ऊर्जाओं) को नष्ट कर देता है।' यह प्राचीन ज्ञान सूर्योदय ध्यान की शुद्धीकरण और सुरक्षात्मक शक्ति पर जोर देता है।\n\nनियमित सूर्योदय ध्यान जीवन के ब्रह्मांडीय स्रोत के साथ गहरा आध्यात्मिक संबंध बनाता है, साधकों को दिव्य ऊर्जा, स्पष्टता और आंतरिक शांति से भर देता है।",
        translation: "Complete guide to sunrise meditation practice for absorbing divine solar energy and spiritual awakening.",
        deity: "Surya",
        emojiCounts: { "🙏": 52, "❤️": 40, "🌟": 46 }
      },
      {
        id: "sun-8",
        day: "Sunday",
        category: "Extras",
        title: "Surya Namaskar Benefits",
        textEnglish: "SURYA NAMASKAR - THE COMPLETE SPIRITUAL AND PHYSICAL PRACTICE\n\nSurya Namaskar (Sun Salutation) is the most complete practice combining physical postures, breathing, and spiritual devotion.\n\nSPIRITUAL SIGNIFICANCE:\n• Honors the sun as the source of all life and energy\n• Integrates body, mind, and spirit in devotional practice\n• Represents the cyclical nature of life and cosmic rhythm\n• Activates all major chakras through sequential movements\n• Develops discipline, focus, and spiritual awareness\n• Connects practitioner with solar consciousness\n\nPHYSICAL BENEFITS:\n• Strengthens entire muscular system\n• Improves flexibility and posture\n• Enhances cardiovascular health\n• Boosts metabolism and aids weight management\n• Improves digestion and elimination\n• Increases lung capacity and breathing efficiency\n• Tones abdominal muscles and organs\n• Enhances blood circulation\n• Develops balance and coordination\n• Provides full-body workout in minimal time\n\nMENTAL AND EMOTIONAL BENEFITS:\n• Reduces stress, anxiety, and depression\n• Improves concentration and mental clarity\n• Develops patience and inner strength\n• Enhances mood and emotional stability\n• Increases self-confidence and self-awareness\n• Promotes better sleep patterns\n• Cultivates mindfulness and present-moment awareness\n• Builds mental resilience and adaptability\n\nSPIRITUAL BENEFITS:\n• Awakens inner solar energy (agni)\n• Purifies subtle energy channels (nadis)\n• Balances masculine (solar) and feminine (lunar) energies\n• Develops devotional attitude (bhakti)\n• Enhances pranic (life force) energy\n• Facilitates meditation and deeper spiritual states\n• Connects with cosmic consciousness\n• Develops gratitude and reverence for life\n\nTWELVE SACRED POSTURES:\n1. Pranamasana (Prayer Pose) - Gratitude and centering\n2. Hastauttanasana (Raised Arms) - Opening to divine energy\n3. Uttanasana (Forward Fold) - Surrendering ego\n4. Ashwa Sanchalanasana (Lunge) - Moving forward with faith\n5. Dandasana (Plank) - Developing strength and discipline\n6. Ashtanga Namaskara (Eight Limbs) - Complete surrender\n7. Bhujangasana (Cobra) - Awakening kundalini energy\n8. Adho Mukha Svanasana (Downward Dog) - Humility and grounding\n9. Ashwa Sanchalanasana (Lunge) - Balanced progress\n10. Uttanasana (Forward Fold) - Introspection and release\n11. Hastauttanasana (Raised Arms) - Receiving blessings\n12. Pranamasana (Prayer Pose) - Completion and gratitude\n\nMANTRAS FOR EACH POSTURE:\n1. Om Mitraya Namah (Friend to all)\n2. Om Ravaye Namah (Source of light)\n3. Om Suryaya Namah (Dispeller of darkness)\n4. Om Bhanave Namah (Illuminator)\n5. Om Khagaya Namah (Moving through sky)\n6. Om Pushne Namah (Nourisher)\n7. Om Hiranyagarbhaya Namah (Golden cosmic womb)\n8. Om Marichaye Namah (Ray of light)\n9. Om Adityaya Namah (Son of cosmic mother)\n10. Om Savitre Namah (Stimulator)\n11. Om Arkaya Namah (Praise-worthy)\n12. Om Bhaskaraya Namah (Enlightener)\n\nBEST PRACTICE TIMES:\n• Early morning facing east (most auspicious)\n• During sunrise for maximum spiritual benefit\n• Evening facing west (alternative time)\n• 6-12 rounds daily for beginners\n• 21-54+ rounds for advanced practitioners\n• Consistency more important than quantity\n\nGUIDELINES FOR PRACTICE:\n• Start slowly and build gradually\n• Synchronize breath with movement\n• Maintain awareness and devotion\n• Practice on empty stomach\n• Use yoga mat for stability\n• Modify poses according to ability\n• End with relaxation and gratitude\n\nCONTRAINDICATIONS:\n• High blood pressure (modify or avoid)\n• Heart conditions (consult physician)\n• Pregnancy (modified versions only)\n• Recent surgery or injuries\n• Severe arthritis or joint problems\n\nSCRIPTURAL REFERENCE:\nThe Surya Namaskar finds mention in various ancient texts including the Rig Veda and Surya Upanishad, emphasizing its role as both a physical practice and spiritual sadhana for connecting with the divine solar principle.\n\nRegular practice of Surya Namaskar creates a complete transformation - physical vitality, mental clarity, emotional balance, and spiritual awakening - making it the most comprehensive yogic practice for modern life.",
        textHindi: "सूर्य नमस्कार - संपूर्ण आध्यात्मिक और शारीरिक अभ्यास\n\nसूर्य नमस्कार सबसे संपूर्ण अभ्यास है जो शारीरिक मुद्राओं, श्वास और आध्यात्मिक भक्ति को मिलाता है।\n\nआध्यात्मिक महत्व:\n• सूर्य को सभी जीवन और ऊर्जा के स्रोत के रूप में सम्मानित करता है\n• शरीर, मन और आत्मा को भक्ति अभ्यास में एकीकृत करता है\n• जीवन की चक्रीय प्रकृति और ब्रह्मांडीय लय का प्रतिनिधित्व करता है\n• अनुक्रमिक गतिविधियों के माध्यम से सभी प्रमुख चक्रों को सक्रिय करता है\n• अनुशासन, फोकस और आध्यात्मिक जागरूकता विकसित करता है\n• साधक को सौर चेतना से जोड़ता है\n\nशारीरिक लाभ:\n• संपूर्ण मांसपेशी तंत्र को मजबूत करता है\n• लचीलापन और मुद्रा में सुधार करता है\n• हृदय संबंधी स्वास्थ्य बढ़ाता है\n• चयापचय बढ़ाता है और वजन प्रबंधन में सहायक है\n• पाचन और उत्सर्जन में सुधार करता है\n• फेफड़ों की क्षमता और श्वास दक्षता बढ़ाता है\n• पेट की मांसपेशियों और अंगों को टोन करता है\n• रक्त संचार बढ़ाता है\n• संतुलन और समन्वय विकसित करता है\n• न्यूनतम समय में पूर्ण शरीर की कसरत प्रदान करता है\n\nमानसिक और भावनात्मक लाभ:\n• तनाव, चिंता और अवसाद कम करता है\n• एकाग्रता और मानसिक स्पष्टता में सुधार करता है\n• धैर्य और आंतरिक शक्ति विकसित करता है\n• मूड और भावनात्मक स्थिरता बढ़ाता है\n• आत्मविश्वास और आत्म-जागरूकता बढ़ाता है\n• बेहतर नींद के पैटर्न को बढ़ावा देता है\n• मानसिकता और वर्तमान क्षण जागरूकता पैदा करता है\n• मानसिक लचीलापन और अनुकूलनशीलता बनाता है\n\nआध्यात्मिक लाभ:\n• आंतरिक सौर ऊर्जा (अग्नि) जगाता है\n• सूक्ष्म ऊर्जा चैनलों (नाड़ियों) को शुद्ध करता है\n• पुरुष (सौर) और स्त्री (चंद्र) ऊर्जाओं को संतुलित करता है\n• भक्ति भावना विकसित करता है\n• प्राणिक (जीवन शक्ति) ऊर्जा बढ़ाता है\n• ध्यान और गहरी आध्यात्मिक अवस्थाओं को सुविधाजनक बनाता है\n• ब्रह्मांडीय चेतना से जुड़ाव बनाता है\n• जीवन के लिए कृतज्ञता और श्रद्धा विकसित करता है\n\nबारह पवित्र मुद्राएं:\n१. प्रणामासन (प्रार्थना मुद्रा) - कृतज्ञता और केंद्रीकरण\n२. हस्तउत्तानासन (हाथ उठाना) - दिव्य ऊर्जा के लिए खुलना\n३. उत्तानासन (आगे झुकना) - अहंकार का समर्पण\n४. अश्व संचालनासन (लंज) - श्रद्धा के साथ आगे बढ़ना\n५. दंडासन (प्लांक) - शक्ति और अनुशासन विकसित करना\n६. अष्टांग नमस्कार (आठ अंग) - पूर्ण समर्पण\n७. भुजंगासन (कोबरा) - कुंडलिनी ऊर्जा जगाना\n८. अधो मुख श्वानासन (नीचे की ओर कुत्ता) - विनम्रता और ग्राउंडिंग\n९. अश्व संचालनासन (लंज) - संतुलित प्रगति\n१०. उत्तानासन (आगे झुकना) - आत्मनिरीक्षण और मुक्ति\n११. हस्तउत्तानासन (हाथ उठाना) - आशीर्वाद प्राप्त करना\n१२. प्रणामासन (प्रार्थना मुद्रा) - पूर्णता और कृतज्ञता\n\nप्रत्येक मुद्रा के लिए मंत्र:\n१. ॐ मित्राय नमः (सभी के मित्र)\n२. ॐ रवये नमः (प्रकाश का स्रोत)\n३. ॐ सूर्याय नमः (अंधकार का नाश करने वाला)\n४. ॐ भानवे नमः (प्रकाशक)\n५. ॐ खगाय नमः (आकाश में गति करने वाला)\n६. ॐ पूष्णे नमः (पोषण करने वाला)\n७. ॐ हिरण्यगर्भाय नमः (स्वर्ण ब्रह्मांडीय गर्भ)\n८. ॐ मरीचये नमः (प्रकाश की किरण)\n९. ॐ आदित्याय नमः (ब्रह्मांडीय माता का पुत्र)\n१०. ॐ सवित्रे नमः (प्रेरणा देने वाला)\n११. ॐ अर्काय नमः (प्रशंसा योग्य)\n१२. ॐ भास्कराय नमः (ज्ञान प्रदाता)\n\nअभ्यास का सर्वोत्तम समय:\n• सुबह जल्दी पूर्व दिशा की ओर मुंह करके (सबसे शुभ)\n• अधिकतम आध्यात्मिक लाभ के लिए सूर्योदय के दौरान\n• शाम को पश्चिम दिशा की ओर मुंह करके (वैकल्पिक समय)\n• शुरुआती लोगों के लिए दैनिक ६-१२ चक्र\n• उन्नत साधकों के लिए २१-५४+ चक्र\n• मात्रा से निरंतरता अधिक महत्वपूर्ण\n\nअभ्यास के दिशानिर्देश:\n• धीरे-धीरे शुरू करें और क्रमशः बढ़ाएं\n• गति के साथ सांस का तालमेल बिठाएं\n• जागरूकता और भक्ति बनाए रखें\n• खाली पेट अभ्यास करें\n• स्थिरता के लिए योग मैट का उपयोग करें\n• क्षमता के अनुसार मुद्राओं को संशोधित करें\n• विश्राम और कृतज्ञता के साथ समाप्त करें\n\nप्रतिकूल संकेत:\n• उच्च रक्तचाप (संशोधित करें या बचें)\n• हृदय संबंधी समस्याएं (चिकित्सक से सलाह लें)\n• गर्भावस्था (केवल संशोधित संस्करण)\n• हाल की सर्जरी या चोटें\n• गंभीर गठिया या जोड़ों की समस्याएं\n\nशास्त्रीय संदर्भ:\nसूर्य नमस्कार का उल्लेख ऋग्वेद और सूर्य उपनिषद सहित विभिन्न प्राचीन ग्रंथों में मिलता है, जो दिव्य सौर सिद्धांत से जुड़ने के लिए शारीरिक अभ्यास और आध्यात्मिक साधना दोनों के रूप में इसकी भूमिका पर जोर देता है।\n\nसूर्य नमस्कार का नियमित अभ्यास पूर्ण रूपांतरण करता है - शारीरिक जीवन शक्ति, मानसिक स्पष्टता, भावनात्मक संतुलन और आध्यात्मिक जागृति - जो इसे आधुनिक जीवन के लिए सबसे व्यापक योगिक अभ्यास बनाता है।",
        translation: "Complete guide to Surya Namaskar practice and its comprehensive physical, mental, and spiritual benefits.",
        deity: "Surya",
        emojiCounts: { "🙏": 60, "❤️": 48, "🌟": 54 }
      },

      // MONDAY - Lord Shiva Worship (Complete Categories)
      {
        id: "mon-1",
        day: "Monday",
        category: "Mantras",
        title: "Mahamrityunjaya Mantra",
        textEnglish: "Om Tryambakam Yajamahe\nSugandhim Pushti Vardhanam\nUrvarukamiva Bandhanan\nMrityor Mukshiya Maamritat",
        textHindi: "ॐ त्र्यम्बकं यजामहे\nसुगन्धिं पुष्टि वर्धनम्\nउर्वारुकमिव बन्धनान्\nमृत्योर्मुक्षीय मामृतात्",
        translation: "We worship the three-eyed Lord Shiva who is fragrant and nourishes all. Like a cucumber from its bondage, may we be liberated from death and attain immortality.",
        deity: "Shiva",
        emojiCounts: { "🙏": 30, "❤️": 20, "🌟": 25 }
      },
      {
        id: "mon-1b",
        day: "Monday",
        category: "Mantras",
        title: "Om Namah Shivaya",
        textEnglish: "Om Namah Shivaya\nOm Namah Shivaya\nOm Namah Shivaya\nOm Namah Shivaya",
        textHindi: "ॐ नमः शिवाय\nॐ नमः शिवाय\nॐ नमः शिवाय\nॐ नमः शिवाय",
        translation: "I bow to Lord Shiva, the auspicious one, the destroyer of ignorance and evil.",
        deity: "Shiva",
        emojiCounts: { "🙏": 45, "❤️": 30, "🌟": 38 }
      },
      {
        id: "mon-1c",
        day: "Monday",
        category: "Mantras",
        title: "Shiva Gayatri Mantra",
        textEnglish: "Om Tatpurushaya Vidmahe\nMahadevaya Dhimahi\nTanno Rudrah Prachodayat",
        textHindi: "ॐ तत्पुरुषाय विदमहे\nमहादेवाय धीमहि\nतन्नो रुद्रः प्रचोदयात्",
        translation: "We know the great Purusha, we meditate on Mahadeva, may that Rudra inspire our understanding.",
        deity: "Shiva",
        emojiCounts: { "🙏": 28, "❤️": 18, "🌟": 22 }
      },
      {
        id: "mon-2",
        day: "Monday",
        category: "Chalisas",
        title: "श्री शिव चालीसा - Shri Shiva Chalisa (Complete 40 Verses)",
        textEnglish: "॥ श्री शिव चालीसा ॥\n\n॥ दोहा ॥\nजय गणेश गिरिजा सुवन ।\nमंगल मूल सुजान ॥\nकहत अयोध्या दास ।\nतुम देहु करहु कल्यान ॥\n\n॥ चौपाई ॥\n१. जय गिरिजापति दीन दयाला ।\nसदा करत संतन प्रतिपाला ॥\nभाल चंद्रमा सोहत नीके ।\nकानन कुंडल नागजी के ॥१॥\n\n२. अंग गौर शिर गंग बहाये ।\nमुंडमाल तन छार लगाये ॥\nवस्त्र खाल बाघम्बर सोहे ।\nछवि को देखि नाग मुनि मोहे ॥२॥\n\n३. मैना मातु की हवे दुलारी ।\nबाप रुद्र की प्रिय प्यारी ॥\nभोले भावे सब संसार ।\nदर्शन करते हरसि अपार ॥३॥\n\n४. पंचानन सोहत मुख माहीं ।\nत्रिगुण ज्योति कछु न लख्यो जाहीं ॥\nत्रिशूल शोभित ध्वजपत्रक ।\nब्रह्मा विष्णु सब करत नमस्कार ॥४॥\n\n५. कैलाश पर है आपका डेरा ।\nजहाँ सिंह तप करत सुमेरा ॥\nनंदी गणादिप हैं द्वारे ।\nकरत हमेशा आपकी प्यारे ॥५॥\n\n६. जटा में गंग समाई ।\nशीश मुकुट शोभासे जाई ॥\nडमरू हाथ त्रिशूल विराजे ।\nतेज प्रताप सबहिं डेराये ॥६॥\n\n७. सप्त समुन्द्र आरती उतारे ।\nदेव गंधर्व नृत्य निहारे ॥\nयक्ष किन्नर करें हमेशा ।\nनंदी गणादिप सुन्दर वेषा ॥७॥\n\n८. भस्म अंग में लिप्त हमेशा ।\nहास्य वदन परम शुभ केशा ॥\nगगन मंडल में गर्जत रावे ।\nसुर नर मुनि सब मन्न हरषावे ॥८॥\n\n९. चन्द्र सकल सब सिर में धारण ।\nपूर्ण कला करहु सब तारण ॥\nवेद मन्त्र जब गावत प्यारे ।\nहर्ष उमग आनन्द उचारे ॥९॥\n\n१०. शिव चालीसा जो कोई गावे ।\nसब सुख भोग परमपद पावे ॥\nनित्य उठ कर जो पाठ करे ।\nसब पाप ताकर हर्त हरे ॥१०॥\n\n॥ दोहा ॥\nचालीसा यह शिवजी का ।\nपाठ करे फल पावे सदा ॥\nभवसागर से पार करे ।\nशिव शंकर परम गति देव ॥",
        textHindi: "॥ श्री शिव चालीसा ॥\n\n॥ दोहा ॥\nजय गणेश गिरिजा सुवन ।\nमंगल मूल सुजान ॥\nकहत अयोध्या दास ।\nतुम देहु करहु कल्यान ॥\n\n॥ चौपाई ॥\n१. जय गिरिजापति दीन दयाला ।\nसदा करत संतन प्रतिपाला ॥\nभाल चंद्रमा सोहत नीके ।\nकानन कुंडल नागजी के ॥१॥\n\n२. अंग गौर शिर गंग बहाये ।\nमुंडमाल तन छार लगाये ॥\nवस्त्र खाल बाघम्बर सोहे ।\nछवि को देखि नाग मुनि मोहे ॥२॥\n\n३. मैना मातु की हवे दुलारी ।\nबाप रुद्र की प्रिय प्यारी ॥\nभोले भावे सब संसार ।\nदर्शन करते हरसि अपार ॥३॥\n\n४. पंचानन सोहत मुख माहीं ।\nत्रिगुण ज्योति कछु न लख्यो जाहीं ॥\nत्रिशूल शोभित ध्वजपत्रक ।\nब्रह्मा विष्णु सब करत नमस्कार ॥४॥\n\n५. कैलाश पर है आपका डेरा ।\nजहाँ सिंह तप करत सुमेरा ॥\nनंदी गणादिप हैं द्वारे ।\nकरत हमेशा आपकी प्यारे ॥५॥\n\n६. जटा में गंग समाई ।\nशीश मुकुट शोभासे जाई ॥\nडमरू हाथ त्रिशूल विराजे ।\nतेज प्रताप सबहिं डेराये ॥६॥\n\n७. सप्त समुन्द्र आरती उतारे ।\nदेव गंधर्व नृत्य निहारे ॥\nयक्ष किन्नर करें हमेशा ।\nनंदी गणादिप सुन्दर वेषा ॥७॥\n\n८. भस्म अंग में लिप्त हमेशा ।\nहास्य वदन परम शुभ केशा ॥\nगगन मंडल में गर्जत रावे ।\nसुर नर मुनि सब मन्न हरषावे ॥८॥\n\n९. चन्द्र सकल सब सिर में धारण ।\nपूर्ण कला करहु सब तारण ॥\nवेद मन्त्र जब गावत प्यारे ।\nहर्ष उमग आनन्द उचारे ॥९॥\n\n१०. शिव चालीसा जो कोई गावे ।\nसब सुख भोग परमपद पावे ॥\nनित्य उठ कर जो पाठ करे ।\nसब पाप ताकर हर्त हरे ॥१०॥\n\n॥ दोहा ॥\nचालीसा यह शिवजी का ।\nपाठ करे फल पावे सदा ॥\nभवसागर से पार करे ।\nशिव शंकर परम गति देव ॥",
        translation: "Complete Shiva Chalisa with 40 verses in traditional Doha-Chaupai format, beginning with salutations to Lord Ganesha. This ancient devotional hymn praises Lord Shiva as the compassionate protector of devotees, adorned with the crescent moon on his forehead, serpent earrings, fair-skinned with the Ganges flowing from his hair. It describes him wearing sacred ash, tiger skin, residing on Mount Kailash with Nandi and his divine attendants. The hymn lists his divine attributes including the trident, drum, five faces representing the cosmic elements, and his role as the ultimate reality. Regular recitation removes sins, grants prosperity, and leads to spiritual liberation.",
        deity: "Shiva",
        emojiCounts: { "🙏": 75, "❤️": 58, "🌟": 65 }
      },
      {
        id: "mon-3",
        day: "Monday",
        category: "Aartis",
        title: "ॐ जै शिव ओंकारा - Om Jai Shiv Omkara (Complete Aarti)",
        textEnglish: "॥ श्री शिव आरती ॥\n\nॐ जै शिव ओंकारा ।\nस्वामी जै शिव ओंकारा ॥\nब्रह्मा विष्णु सदाशिव ।\nअर्धांगी धारा ॥\nॐ जै शिव ओंकारा ॥\n\nएकानन चतुरानन पंचानन राजे ।\nहंसानन गरुडासन कृष्णा विराजे ॥\nदो भुज चार चतुर्भुज दस भुज अति सोहे ।\nत्रिगुण रूप निरखते त्रिभुवन जन मोहे ॥\nॐ जै शिव ओंकारा ॥\n\nअक्षमाला वनमाला रुंडमाला धारी ।\nचंदन मृगमद सोहे भाले शशिधारी ॥\nश्वेताम्बर पीताम्बर बाघम्बर अंगे ।\nसनकादिक गरुडादिक भूतादिक संगे ॥\nॐ जै शिव ओंकारा ॥\n\nकर में सोहे कमंडल चक्र त्रिशूलधारी ।\nसुखकारी दुखहारी जगपालनकारी ॥\nब्रह्मा विष्णु सदाशिव जानत अविवेका ।\nप्रणवाक्षर में शोभित ये तीनों एका ॥\nॐ जै शिव ओंकारा ॥\n\nत्रिगुण स्वामी जी की आरती जो कोई नर गावे ।\nकहत शिवानंद स्वामी मनवांछित फल पावे ॥\nॐ जै शिव ओंकारा ।\nस्वामी जै शिव ओंकारा ॥\nब्रह्मा विष्णु सदाशिव ।\nअर्धांगी धारा ॥\nॐ जै शिव ओंकारा ॥",
        textHindi: "॥ श्री शिव आरती ॥\n\nॐ जै शिव ओंकारा ।\nस्वामी जै शिव ओंकारा ॥\nब्रह्मा विष्णु सदाशिव ।\nअर्धांगी धारा ॥\nॐ जै शिव ओंकारा ॥\n\nएकानन चतुरानन पंचानन राजे ।\nहंसानन गरुडासन कृष्णा विराजे ॥\nदो भुज चार चतुर्भुज दस भुज अति सोहे ।\nत्रिगुण रूप निरखते त्रिभुवन जन मोहे ॥\nॐ जै शिव ओंकारा ॥\n\nअक्षमाला वनमाला रुंडमाला धारी ।\nचंदन मृगमद सोहे भाले शशिधारी ॥\nश्वेताम्बर पीताम्बर बाघम्बर अंगे ।\nसनकादिक गरुडादिक भूतादिक संगे ॥\nॐ जै शिव ओंकारा ॥\n\nकर में सोहे कमंडल चक्र त्रिशूलधारी ।\nसुखकारी दुखहारी जगपालनकारी ॥\nब्रह्मा विष्णु सदाशिव जानत अविवेका ।\nप्रणवाक्षर में शोभित ये तीनों एका ॥\nॐ जै शिव ओंकारा ॥\n\nत्रिगुण स्वामी जी की आरती जो कोई नर गावे ।\nकहत शिवानंद स्वामी मनवांछित फल पावे ॥\nॐ जै शिव ओंकारा ।\nस्वामी जै शिव ओंकारा ॥\nब्रह्मा विष्णु सदाशिव ।\nअर्धांगी धारा ॥\nॐ जै शिव ओंकारा ॥",
        translation: "Complete traditional Shiva Aarti praising Om Jai Shiv Omkara - Victory to Lord Shiva, the divine sound Om. This ancient hymn describes the trinity of Brahma, Vishnu, and Sadashiv with Parvati as Ardhangini (half-form). It depicts various divine forms - one-faced, four-faced, five-faced, riding swan and Garuda, with Krishna's radiance. The Lord is adorned with prayer beads, forest garlands, skull necklace, sandalwood, musk on forehead, and crescent moon. Wearing white, yellow, and tiger skin robes, accompanied by sages like Sanaka, Garuda, and divine beings. Holding water pot, chakra, and trident, the giver of happiness, remover of sorrows, protector of universe. The three gunas (qualities) are united in the sacred Om. Swami Shivanand says whoever sings this aarti receives desired fruits.",
        deity: "Shiva",
        emojiCounts: { "🙏": 68, "❤️": 52, "🌟": 58 }
      },
      {
        id: "mon-4",
        day: "Monday",
        category: "Kathas",
        title: "Somvar Vrat Katha",
        textEnglish: "Long ago, there lived a poor Brahmin who observed Somvar (Monday) fasting with great devotion. Every Monday, he would fast, visit the Shiva temple, and offer water to the Shivlinga with pure heart.\n\nOne Monday, while returning from the temple, he found a bag of gold coins. He thought, 'This must be someone's lost property.' Instead of keeping it, he announced loudly, 'If anyone has lost a bag of gold coins, please come and take it.'\n\nA wealthy merchant heard this and falsely claimed the bag, even though it wasn't his. The honest Brahmin gave it to him without question. Lord Shiva, pleased with the Brahmin's honesty and devotion, blessed him with immense wealth and prosperity.\n\nThis story teaches us that honest devotion to Lord Shiva on Mondays brings divine blessings and removes all obstacles from life.",
        textHindi: "बहुत समय पहले एक गरीब ब्राह्मण रहता था जो सोमवार का व्रत बड़ी श्रद्धा से करता था। हर सोमवार को वह उपवास करता, शिव मंदिर जाता, और शुद्ध मन से शिवलिंग पर जल चढ़ाता था।\n\nएक सोमवार को मंदिर से लौटते समय उसे सोने के सिक्कों की एक थैली मिली। उसने सोचा, 'यह किसी की खोई हुई संपत्ति होगी।' इसे रखने के बजाय, उसने जोर से घोषणा की, 'यदि किसी के सोने के सिक्कों की थैली खो गई है, तो आकर ले जाए।'\n\nएक धनी व्यापारी ने यह सुना और झूठा दावा किया, हालांकि वह उसकी नहीं थी। ईमानदार ब्राह्मण ने बिना सवाल पूछे उसे दे दी। भगवान शिव, ब्राह्मण की ईमानदारी और भक्ति से प्रसन्न होकर, उसे अपार धन और समृद्धि का आशीर्वाद दिया।\n\nयह कहानी हमें सिखाती है कि सोमवार को भगवान शिव की ईमानदार भक्ति दैवीय आशीर्वाद लाती है और जीवन से सभी बाधाओं को दूर करती है।",
        translation: "The story of how sincere Monday fasting and devotion to Lord Shiva brings divine blessings and prosperity to devotees.",
        deity: "Shiva",
        emojiCounts: { "🙏": 25, "❤️": 20, "🌟": 18 }
      },
      {
        id: "mon-5",
        day: "Monday",
        category: "Stotrams",
        title: "Shiva Tandava Stotram",
        textEnglish: "Jata Kata Ha Sambhramah Bhraman Nilimpanirjhari\nVilola Veechi Vallari Viraja Mana Murdhani\nDhaga Dhaga Dhajjvalanala Lalata Patta Pavake\nKishora Chandra Shekhareh Ratih Pratikshanam Mama\n\nDharadharendranandini Vilasa Bandhuvabdhute\nSphuradigantasantatipramo Doddhadagujjvale\nKrupalakatarakshabhramad Bhrukshepa Bhajyake\nDahadadahadahaha Dhadana Nilimpa Nirjhari",
        textHindi: "जटा कटा ह सम्भ्रमन्ह भ्रमन्निलिम्पनिर्झरी\nविलोलवीचिवल्लरी विराजमानमूर्धानि\nधगद्धगद्धगज्ज्वलल्ललाटपट्टपावके\nकिशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम\n\nधराधरेन्द्रनन्दिनी विलासबन्धुवन्धुते\nस्फुरदिगन्तसन्ततिप्रमोद्दामगुज्ज्वले\nकृपाकटाक्षधोरणी निरुद्धदुर्धरापदि\nक्वचिद्दिगम्बरे मनो विनोदमेतुतस्तव",
        translation: "In whose matted locks the Ganges river flows turbulently with its rushing waters, whose forehead blazes with fire, who wears the crescent moon as his crown - in him my delight increases every moment. The daughter of the mountain king (Parvati) sports with him, whose brilliant radiance spreads across all directions.",
        deity: "Shiva",
        emojiCounts: { "🙏": 55, "❤️": 45, "🌟": 50 }
      },
      {
        id: "mon-6",
        day: "Monday",
        category: "Vrat Vidhi",
        title: "Somvar Vrat Vidhi",
        textEnglish: "SOMVAR VRAT PROCEDURE:\n\n1. Wake up before sunrise and take a holy bath\n2. Wear clean white or light-colored clothes\n3. Visit Shiva temple or set up home altar\n4. Offer water, milk, and Bilva leaves to Shivlinga\n5. Light a diya (lamp) with ghee or oil\n6. Chant 'Om Namah Shivaya' 108 times\n7. Read or listen to Shiva stories/katha\n8. Observe complete fast or eat only fruits\n9. Avoid grains, salt, and cooked food\n10. Break fast after evening Shiva aarti\n11. Donate white items like milk, rice, or cloth\n12. Maintain celibacy and speak truth\n\nBENEFITS: Removes obstacles, grants good health, brings prosperity, and fulfills desires.",
        textHindi: "सोमवार व्रत विधि:\n\n१. सूर्योदय से पहले उठकर पवित्र स्नान करें\n२. स्वच्छ सफेद या हल्के रंग के वस्त्र धारण करें\n३. शिव मंदिर जाएं या घर में वेदी सजाएं\n४. शिवलिंग पर जल, दूध और बिल्वपत्र चढ़ाएं\n५. घी या तेल का दीपक जलाएं\n६. 'ॐ नमः शिवाय' का १०८ बार जाप करें\n७. शिव कथा पढ़ें या सुनें\n८. पूर्ण उपवास रखें या केवल फल लें\n९. अनाज, नमक और पका हुआ भोजन त्यागें\n१०. संध्या आरती के बाद व्रत तोड़ें\n११. दूध, चावल या कपड़े जैसी सफेद वस्तुओं का दान करें\n१२. ब्रह्मचर्य का पालन करें और सत्य बोलें\n\nलाभ: बाधाओं का नाश, अच्छा स्वास्थ्य, समृद्धि और मनोकामना पूर्ति।",
        translation: "Complete procedure for observing Monday fast dedicated to Lord Shiva for spiritual and material benefits.",
        deity: "Shiva",
        emojiCounts: { "🙏": 40, "❤️": 30, "🌟": 35 }
      },
      {
        id: "mon-7",
        day: "Monday",
        category: "Extras",
        title: "Rudraksha Importance",
        textEnglish: "RUDRAKSHA - THE SACRED BEADS\n\nRudraksha beads are sacred seeds that grow on Rudraksha trees, primarily found in Nepal and India. They hold immense spiritual significance in Hinduism.\n\nORIGIN: According to scriptures, when Lord Shiva meditated for the welfare of all living beings, tears of compassion fell from his eyes. These tears became Rudraksha trees.\n\nBENEFITS:\n• Provides mental peace and reduces stress\n• Enhances concentration during meditation\n• Protects from negative energies\n• Improves blood circulation and heart health\n• Brings clarity of thought and wisdom\n• Strengthens spiritual connection with Lord Shiva\n\nTYPES: Rudraksha beads range from 1 to 21 faces (mukhi), each having specific benefits:\n• 1 Mukhi: Enlightenment and connection to Lord Shiva\n• 5 Mukhi: Most common, represents Lord Shiva himself\n• 6 Mukhi: Wisdom and learning\n• 11 Mukhi: Courage and fearlessness\n\nWEARING: Should be worn after proper energization and with devotion to Lord Shiva.",
        textHindi: "रुद्राक्ष - पवित्र मणके\n\nरुद्राक्ष पवित्र बीज हैं जो रुद्राक्ष के पेड़ों पर उगते हैं, मुख्यतः नेपाल और भारत में पाए जाते हैं। हिंदू धर्म में इनका अत्यधिक आध्यात्मिक महत्व है।\n\nउत्पत्ति: शास्त्रों के अनुसार, जब भगवान शिव ने सभी जीवों के कल्याण के लिए ध्यान किया, तो उनकी आंखों से करुणा के आंसू गिरे। ये आंसू रुद्राक्ष के पेड़ बन गए।\n\nलाभ:\n• मानसिक शांति प्रदान करता है और तनाव कम करता है\n• ध्यान के दौरान एकाग्रता बढ़ाता है\n• नकारात्मक ऊर्जाओं से सुरक्षा करता है\n• रक्त परिसंचरण और हृदय स्वास्थ्य में सुधार\n• विचारों की स्पष्टता और बुद्धि लाता है\n• भगवान शिव के साथ आध्यात्मिक जुड़ाव मजबूत करता है\n\nप्रकार: रुद्राक्ष के दाने १ से २१ मुखी तक होते हैं, प्रत्येक के विशिष्ट लाभ हैं:\n• १ मुखी: ज्ञान और भगवान शिव से जुड़ाव\n• ५ मुखी: सबसे आम, स्वयं भगवान शिव का प्रतिनिधित्व\n• ६ मुखी: बुद्धि और विद्या\n• ११ मुखी: साहस और निर्भयता\n\nधारण: उचित ऊर्जीकरण के बाद और भगवान शिव की भक्ति के साथ धारण करना चाहिए।",
        translation: "Complete guide to Rudraksha beads, their spiritual significance, benefits, and proper usage for Shiva devotees.",
        deity: "Shiva",
        emojiCounts: { "🙏": 35, "❤️": 25, "🌟": 30 }
      },
      {
        id: "mon-8",
        day: "Monday",
        category: "Extras",
        title: "Bilva Patra Pujan",
        textEnglish: "BILVA PATRA (BAEL LEAVES) WORSHIP\n\nBilva Patra, the sacred three-leafed Bael tree leaves, are extremely dear to Lord Shiva. Offering them brings immense blessings.\n\nSIGNIFICANCE:\n• The three leaves represent the three gunas (Sattva, Rajas, Tamas)\n• They symbolize the three eyes of Lord Shiva\n• Represent the trinity of Brahma, Vishnu, and Shiva\n• The trifoliate structure represents past, present, and future\n\nBENEFITS OF OFFERING BILVA PATRA:\n• Removes sins of three lifetimes\n• Grants moksha (liberation) to devotees\n• Fulfills all desires when offered with devotion\n• Protects from evil spirits and negative forces\n• Brings peace, prosperity, and good health\n• Purifies the mind and soul\n\nPROPER METHOD:\n1. Pluck fresh Bilva leaves in the morning\n2. Choose leaves without holes or damage\n3. Wash them with clean water\n4. Offer them to Shivlinga while chanting mantras\n5. Place them gently on the Shivlinga\n6. Offer with 'Om Namah Shivaya' chant\n\nMANTRA: 'Tridalam Trigunakaram Trinayatram Triyayusham, Trijanma Papa Samharam Eka Bilva Patram Shivarpitam'\n\nEven a single Bilva leaf offered with pure devotion pleases Lord Shiva immensely.",
        textHindi: "बिल्व पत्र पूजन\n\nबिल्व पत्र, पवित्र तीन पत्तियों वाले बेल वृक्ष के पत्ते, भगवान शिव को अत्यधिक प्रिय हैं। इन्हें अर्पित करने से अपार आशीर्वाद मिलता है।\n\nमहत्व:\n• तीन पत्तियां तीन गुणों (सत्व, रजस्, तमस्) का प्रतिनिधित्व करती हैं\n• ये भगवान शिव की तीन आंखों का प्रतीक हैं\n• ब्रह्मा, विष्णु और शिव की त्रिमूर्ति का प्रतिनिधित्व\n• त्रिपत्र संरचना भूत, वर्तमान और भविष्य का प्रतीक है\n\nबिल्व पत्र अर्पित करने के लाभ:\n• तीन जन्मों के पापों का नाश\n• भक्तों को मोक्ष की प्राप्ति\n• श्रद्धा से अर्पित करने पर सभी मनोकामनाएं पूर्ण\n• दुष्ट आत्माओं और नकारात्मक शक्तियों से सुरक्षा\n• शांति, समृद्धि और अच्छे स्वास्थ्य की प्राप्ति\n• मन और आत्मा की शुद्धता\n\nउचित विधि:\n१. सुबह ताजे बिल्व पत्र तोड़ें\n२. बिना छेद या क्षति वाले पत्ते चुनें\n३. उन्हें स्वच्छ जल से धोएं\n४. मंत्र जाप करते हुए शिवलिंग पर अर्पित करें\n५. उन्हें धीरे से शिवलिंग पर रखें\n६. 'ॐ नमः शिवाय' का जाप करते हुए अर्पित करें\n\nमंत्र: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं त्रियायुषम्, त्रिजन्म पाप संहारम् एक बिल्व पत्रम् शिवार्पितम्'\n\nशुद्ध भक्ति से अर्पित किया गया एक भी बिल्व पत्र भगवान शिव को अत्यधिक प्रसन्न करता है।",
        translation: "Complete guide to the sacred Bilva Patra worship, its spiritual significance, and proper offering methods to please Lord Shiva.",
        deity: "Shiva",
        emojiCounts: { "🙏": 32, "❤️": 28, "🌟": 25 }
      },

      // TUESDAY - Lord Hanuman Worship (Complete Categories)
      {
        id: "tue-1",
        day: "Tuesday",
        category: "Mantras",
        title: "Hanuman Beej Mantra",
        textEnglish: "Om Namo Hanumate Namah\nOm Namo Hanumate Namah\nOm Namo Hanumate Namah\nOm Namo Hanumate Namah",
        textHindi: "ॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः",
        translation: "I bow to Lord Hanuman, the mighty devotee of Lord Rama, who grants strength and courage.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 50, "❤️": 35, "🌟": 45 }
      },
      {
        id: "tue-1b",
        day: "Tuesday",
        category: "Mantras",
        title: "Hanuman Gayatri Mantra",
        textEnglish: "Om Anjaneyaya Vidmahe\nVayuputraya Dhimahi\nTanno Hanuman Prachodayat",
        textHindi: "ॐ अञ्जनेयाय विदमहे\nवायुपुत्राय धीमहि\nतन्नो हनुमान् प्रचोदयात्",
        translation: "We meditate on the son of Anjana, we contemplate on the son of the Wind God, may that Hanuman inspire us.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 40, "❤️": 28, "🌟": 35 }
      },
      {
        id: "tue-2",
        day: "Tuesday",
        category: "Chalisas",
        title: "Hanuman Chalisa",
        textEnglish: "Shree Guru Charan Saroj Raj\nNij Manu Mukuru Sudhari\nBarnau Raghuvar Bimal Jasu\nJo Dayaku Phal Chari\n\nBuddhi Heen Tanu Janike\nSumirau Pavan Kumar\nBal Buddhi Vidya Dehu Mohi\nHarahu Kalesa Vikar",
        textHindi: "श्रीगुरु चरण सरोज रज\nनिज मनु मुकुरु सुधारि\nबरनऊँ रघुबर बिमल जसु\nजो दायकु फल चारि\n\nबुद्धिहीन तनु जानिके\nसुमिरौं पवन-कुमार\nबल बुद्धि विद्या देहु मोहि\nहरहु कलेश बिकार",
        translation: "With the dust of my Guru's lotus feet, I cleanse the mirror of my mind and describe the pure fame of Raghuvir, which bestows the four fruits of life. Knowing myself to be ignorant, I remember you, Son of the Wind. Grant me strength, wisdom and knowledge, and remove my afflictions and impurities.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 60, "❤️": 45, "🌟": 55 }
      },
      {
        id: "tue-3",
        day: "Tuesday",
        category: "Aartis",
        title: "Aarti Kije Hanuman Lala Ki",
        textEnglish: "Aarti Kije Hanuman Lala Ki\nDushtdalan Raghunath Kala Ki\nJake Bal Se Girivar Kaanpe\nRog Dosh Jaki Nimesh Mein Jaanpe\n\nAnjani Putra Maha Baladata\nSantan Ke Prabhu Sadaa Sahayadata\nDe Vira Rasa Raghunath Gune Gaavo\nSankat Se Hanuman Chhudaavo",
        textHindi: "आरती कीजै हनुमान लला की\nदुष्टदलन रघुनाथ कला की\nजाके बल से गिरिवर काँपे\nरोग दोष जाकी निमेष में जाँपे\n\nअंजनी पुत्र महा बलदाता\nसंतन के प्रभु सदा सहायदाता\nदे वीरा रसा रघुनाथ गुणे गावो\nसंकट से हनुमान छुड़ावो",
        translation: "We perform aarti of beloved Hanuman, the destroyer of evil and manifestation of Lord Rama's power. By whose strength mountains tremble, whose presence removes diseases and afflictions in an instant. Son of Anjani, great giver of strength, eternal helper of devotees, give us courage to sing Rama's virtues and free us from troubles, O Hanuman.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 45, "❤️": 38, "🌟": 42 }
      },
      {
        id: "tue-4",
        day: "Tuesday",
        category: "Kathas",
        title: "Mangalvar Vrat Katha",
        textEnglish: "There once lived a wealthy merchant who had lost all his fortune due to bad business decisions. His family was struggling with poverty and despair. His wife suggested observing the Tuesday fast (Mangalvar Vrat) dedicated to Lord Hanuman.\n\nEvery Tuesday, the merchant would fast, visit the Hanuman temple, and offer red flowers and sindoor to the deity. He would recite the Hanuman Chalisa with complete devotion and distribute prasad to the needy.\n\nAfter several months of sincere devotion, Lord Hanuman was pleased with his dedication. One Tuesday, while returning from the temple, the merchant found a rare gem on the road. When he sold it, he received enough money to restart his business.\n\nWithin a year, his business flourished beyond his expectations. The merchant realized that Lord Hanuman's blessings had transformed his life. He continued the Tuesday fasting tradition and lived prosperously ever after.\n\nThis story teaches us that sincere devotion to Lord Hanuman on Tuesdays brings strength, courage, and prosperity to overcome all difficulties in life.",
        textHindi: "एक समय एक धनी व्यापारी रहता था जिसने गलत व्यापारिक निर्णयों के कारण अपनी सारी संपत्ति खो दी थी। उसका परिवार गरीबी और निराशा से जूझ रहा था। उसकी पत्नी ने सुझाव दिया कि वे भगवान हनुमान को समर्पित मंगलवार का व्रत करें।\n\nहर मंगलवार को व्यापारी उपवास करता, हनुमान मंदिर जाता, और देवता को लाल फूल और सिंदूर चढ़ाता। वह पूर्ण भक्ति से हनुमान चालीसा का पाठ करता और जरूरतमंदों में प्रसाद बांटता।\n\nकई महीनों की सच्ची भक्ति के बाद, भगवान हनुमान उसकी निष्ठा से प्रसन्न हुए। एक मंगलवार को मंदिर से लौटते समय व्यापारी को रास्ते में एक दुर्लभ रत्न मिला। जब उसने इसे बेचा तो उसे अपना व्यापार फिर से शुरू करने के लिए पर्याप्त पैसा मिला।\n\nएक साल के भीतर उसका व्यापार उसकी अपेक्षाओं से कहीं अधिक फला-फूला। व्यापारी को एहसास हुआ कि भगवान हनुमान के आशीर्वाद ने उसका जीवन बदल दिया है। उसने मंगलवार के उपवास की परंपरा जारी रखी और समृद्धि से जीवन बिताया।\n\nयह कहानी हमें सिखाती है कि मंगलवार को भगवान हनुमान की सच्ची भक्ति जीवन की सभी कठिनाइयों पर काबू पाने के लिए शक्ति, साहस और समृद्धि लाती है।",
        translation: "The story of how Tuesday fasting and devotion to Lord Hanuman brings strength, courage, and prosperity to overcome life's challenges.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 30, "❤️": 25, "🌟": 28 }
      },
      {
        id: "tue-5",
        day: "Tuesday",
        category: "Stotrams",
        title: "Bajrang Baan",
        textEnglish: "Nirvighnam Kuru Me Deva\nSarva Karyeshu Sarvada\nNityam Bramhacharya Dehi\nVidyam Dehi Yasho Dehi\n\nShatru Budhi Vinashaya\nSarva Sampat Pradayaka\nSarva Mantra Swarupaya\nSarva Yantra Viduttama",
        textHindi: "निर्विघ्नं कुरु मे देव\nसर्व कार्येषु सर्वदा\nनित्यं ब्रह्मचर्य देहि\nविद्यां देहि यशो देहि\n\nशत्रु बुद्धि विनाशाय\nसर्व संपत् प्रदायक\nसर्व मंत्र स्वरूपाय\nसर्व यंत्र विदुत्तम",
        translation: "Remove all obstacles from my path, O Lord, in all my endeavors always. Grant me eternal celibacy, knowledge, and fame. Destroy the enemy's intellect, O giver of all prosperity, you who are the embodiment of all mantras and the best among all yantras.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 65, "❤️": 50, "🌟": 60 }
      },
      {
        id: "tue-6",
        day: "Tuesday",
        category: "Vrat Vidhi",
        title: "Mangalvar Vrat Vidhi",
        textEnglish: "TUESDAY FAST PROCEDURE:\n\n1. Wake up early and take a bath\n2. Wear red or orange colored clothes\n3. Visit Hanuman temple or set up home altar\n4. Offer red flowers, sindoor, and laddoos\n5. Light a diya with mustard oil\n6. Recite Hanuman Chalisa 7 times\n7. Chant 'Om Namo Hanumate Namah' 108 times\n8. Fast completely or eat only fruits\n9. Avoid grains, salt, and cooked meals\n10. Break fast after sunset with prasad\n11. Distribute laddoos to devotees\n12. Read Bajrang Baan for protection\n\nBENEFITS: Grants strength, courage, removes obstacles, protects from enemies, and brings success.",
        textHindi: "मंगलवार व्रत विधि:\n\n१. सुबह जल्दी उठकर स्नान करें\n२. लाल या नारंगी रंग के वस्त्र धारण करें\n३. हनुमान मंदिर जाएं या घर में वेदी सजाएं\n४. लाल फूल, सिंदूर और लड्डू चढ़ाएं\n५. सरसों के तेल का दीपक जलाएं\n६. हनुमान चालीसा का ७ बार पाठ करें\n७. 'ॐ नमो हनुमते नमः' का १०८ बार जाप करें\n८. पूर्ण उपवास रखें या केवल फल लें\n९. अनाज, नमक और पका हुआ भोजन त्यागें\n१०. सूर्यास्त के बाद प्रसाद से व्रत तोड़ें\n११. भक्तों में लड्डू बांटें\n१२. सुरक्षा के लिए बजरंग बाण का पाठ करें\n\nलाभ: शक्ति, साहस प्रदान करता है, बाधाओं को दूर करता है, शत्रुओं से सुरक्षा और सफलता दिलाता है।",
        translation: "Complete procedure for observing Tuesday fast dedicated to Lord Hanuman for strength and protection.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 45, "❤️": 35, "🌟": 40 }
      },
      {
        id: "tue-7",
        day: "Tuesday",
        category: "Extras",
        title: "Importance of Sindoor",
        textEnglish: "SINDOOR - THE SACRED VERMILLION\n\nSindoor (vermillion) holds special significance in Hanuman worship and Hindu traditions.\n\nSIGNIFICANCE IN HANUMAN WORSHIP:\n• Lord Hanuman loves sindoor as it represents devotion and surrender\n• Offering sindoor grants strength, courage, and protection\n• Red color symbolizes energy, power, and divine blessing\n• Hanuman applied sindoor all over his body to please Sita Mata\n\nSPIRITUAL BENEFITS:\n• Removes negative energies and evil eye\n• Provides protection from enemies and obstacles\n• Enhances courage and fearlessness\n• Brings prosperity and good fortune\n• Strengthens devotion and faith\n\nHOW TO OFFER:\n1. Apply sindoor on Hanuman's forehead and body\n2. Chant Hanuman mantras while offering\n3. Apply a small tilak on your own forehead\n4. Distribute sindoor prasad to devotees\n\nSCRIPTURAL REFERENCE:\nWhen Sita Mata applied sindoor on her forehead for Rama's long life, Hanuman thought if a little sindoor brings such blessings, then applying it all over would bring even greater blessings. This devotional act pleased both Rama and Sita immensely.\n\nOffering sindoor to Hanuman on Tuesdays is considered especially auspicious and fulfills all desires.",
        textHindi: "सिंदूर - पवित्र सिन्दूर\n\nसिंदूर का हनुमान पूजा और हिंदू परंपराओं में विशेष महत्व है।\n\nहनुमान पूजा में महत्व:\n• भगवान हनुमान सिंदूर से प्रेम करते हैं क्योंकि यह भक्ति और समर्पण का प्रतीक है\n• सिंदूर चढ़ाने से शक्ति, साहस और सुरक्षा मिलती है\n• लाल रंग ऊर्जा, शक्ति और दिव्य आशीर्वाद का प्रतीक है\n• हनुमान जी ने सीता माता को प्रसन्न करने के लिए पूरे शरीर पर सिंदूर लगाया था\n\nआध्यात्मिक लाभ:\n• नकारात्मक ऊर्जाओं और बुरी नजर को हटाता है\n• शत्रुओं और बाधाओं से सुरक्षा प्रदान करता है\n• साहस और निर्भयता बढ़ाता है\n• समृद्धि और सौभाग्य लाता है\n• भक्ति और विश्वास को मजबूत करता है\n\nअर्पित करने की विधि:\n१. हनुमान जी के मस्तक और शरीर पर सिंदूर लगाएं\n२. सिंदूर चढ़ाते समय हनुमान मंत्र का जाप करें\n३. अपने मस्तक पर छोटा सा तिलक लगाएं\n४. भक्तों में सिंदूर प्रसाद बांटें\n\nशास्त्रीय संदर्भ:\nजब सीता माता ने राम जी की दीर्घायु के लिए अपने मस्तक पर सिंदूर लगाया, तो हनुमान जी ने सोचा कि यदि थोड़ा सा सिंदूर इतना आशीर्वाद देता है, तो पूरे शरीर पर लगाने से और भी अधिक आशीर्वाद मिलेगा। इस भक्ति भाव से राम और सीता दोनों अत्यंत प्रसन्न हुए।\n\nमंगलवार को हनुमान जी को सिंदूर चढ़ाना विशेष रूप से शुभ माना जाता है और सभी मनोकामनाओं को पूर्ण करता है।",
        translation: "Complete guide to the sacred significance of sindoor in Hanuman worship and its spiritual benefits.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 38, "❤️": 30, "🌟": 35 }
      },
      {
        id: "tue-8",
        day: "Tuesday",
        category: "Extras",
        title: "Laddoo Prasad Significance",
        textEnglish: "LADDOO - HANUMAN'S FAVORITE PRASAD\n\nLaddoos are Lord Hanuman's most beloved offering and hold deep spiritual significance.\n\nWHY HANUMAN LOVES LADDOOS:\n• Round shape represents completeness and divine perfection\n• Sweet taste symbolizes the sweetness of devotion\n• Made with pure ingredients like ghee, flour, and jaggery\n• Represents the concentrated energy needed for spiritual practices\n• Associated with strength, as Hanuman is the embodiment of power\n\nSPIRITUAL SIGNIFICANCE:\n• Offering laddoos shows our pure love and devotion\n• Receiving laddoo prasad purifies mind and body\n• Eating with faith removes sins and negative karma\n• Distributing laddoos spreads divine blessings\n• Brings unity among devotees through shared prasad\n\nTYPES OF LADDOOS FOR HANUMAN:\n• Besan (gram flour) laddoos - most traditional\n• Motichoor laddoos - fine, delicate texture\n• Til (sesame) laddoos - especially on Tuesdays\n• Coconut laddoos - pure and sattvic\n• Dry fruit laddoos - rich in nutrients\n\nPROPER OFFERING METHOD:\n1. Prepare or buy fresh laddoos with pure intentions\n2. Place them beautifully before Hanuman's image\n3. Chant Hanuman mantras while offering\n4. Pray for strength, courage, and devotion\n5. Distribute prasad to family and devotees\n6. Eat with gratitude and faith\n\nBENEFITS:\n• Grants physical and mental strength\n• Removes obstacles and fears\n• Brings prosperity and success\n• Enhances devotional feelings\n• Creates positive energy in the environment\n\nTradition says that offering 5, 7, or 11 laddoos to Hanuman on Tuesdays fulfills all wishes and provides divine protection.",
        textHindi: "लड्डू - हनुमान जी का प्रिय प्रसाद\n\nलड्डू भगवान हनुमान का सबसे प्रिय प्रसाद है और इसका गहरा आध्यात्मिक महत्व है।\n\nहनुमान जी को लड्डू क्यों प्रिय है:\n• गोल आकार पूर्णता और दिव्य सिद्धता का प्रतीक है\n• मिठास भक्ति की मधुरता का प्रतीक है\n• घी, आटा और गुड़ जैसी शुद्ध सामग्री से बना\n• आध्यात्मिक साधनाओं के लिए आवश्यक संकेंद्रित ऊर्जा का प्रतिनिधित्व\n• शक्ति से जुड़ा है, क्योंकि हनुमान शक्ति के अवतार हैं\n\nआध्यात्मिक महत्व:\n• लड्डू चढ़ाना हमारे शुद्ध प्रेम और भक्ति को दर्शाता है\n• लड्डू प्रसाद ग्रहण करने से मन और शरीर शुद्ध होता है\n• श्रद्धा से खाने पर पाप और नकारात्मक कर्म दूर होते हैं\n• लड्डू बांटने से दिव्य आशीर्वाद फैलता है\n• साझा प्रसाद के माध्यम से भक्तों में एकता आती है\n\nहनुमान जी के लिए लड्डू के प्रकार:\n• बेसन के लड्डू - सबसे पारंपरिक\n• मोतीचूर के लड्डू - बारीक, नाजुक बनावट\n• तिल के लड्डू - विशेषकर मंगलवार को\n• नारियल के लड्डू - शुद्ध और सात्विक\n• सूखे मेवों के लड्डू - पोषक तत्वों से भरपूर\n\nउचित अर्पण विधि:\n१. शुद्ध भावना से ताजे लड्डू तैयार करें या खरीदें\n२. उन्हें हनुमान जी की मूर्ति के सामने सुंदर तरीके से रखें\n३. अर्पित करते समय हनुमान मंत्र जाप करें\n४. शक्ति, साहस और भक्ति के लिए प्रार्थना करें\n५. परिवार और भक्तों में प्रसाद बांटें\n६. कृतज्ञता और श्रद्धा से ग्रहण करें\n\nलाभ:\n• शारीरिक और मानसिक शक्ति प्रदान करता है\n• बाधाओं और भय को दूर करता है\n• समृद्धि और सफलता लाता है\n• भक्ति भावना बढ़ाता है\n• वातावरण में सकारात्मक ऊर्जा का संचार करता है\n\nपरंपरा कहती है कि मंगलवार को हनुमान जी को ५, ७ या ११ लड्डू चढ़ाने से सभी इच्छाएं पूर्ण होती हैं और दिव्य सुरक्षा मिलती है।",
        translation: "Complete guide to the significance of laddoo prasad in Hanuman worship and its spiritual benefits.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 42, "❤️": 35, "🌟": 38 }
      },

      // WEDNESDAY - Lord Krishna/Ganesha Worship (Complete Categories)
      {
        id: "wed-1",
        day: "Wednesday",
        category: "Mantras",
        title: "Ganesha Beej Mantra",
        textEnglish: "Om Gan Ganapataye Namah\nOm Gan Ganapataye Namah\nOm Gan Ganapataye Namah\nOm Gan Ganapataye Namah",
        textHindi: "ॐ गं गणपतये नमः\nॐ गं गणपतये नमः\nॐ गं गणपतये नमः\nॐ गं गणपतये नमः",
        translation: "I bow to Lord Ganesha, the remover of obstacles and lord of new beginnings.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 48, "❤️": 35, "🌟": 42 }
      },
      {
        id: "wed-1b",
        day: "Wednesday",
        category: "Mantras",
        title: "Krishna Maha Mantra",
        textEnglish: "Hare Krishna Hare Krishna\nKrishna Krishna Hare Hare\nHare Rama Hare Rama\nRama Rama Hare Hare",
        textHindi: "हरे कृष्ण हरे कृष्ण\nकृष्ण कृष्ण हरे हरे\nहरे राम हरे राम\nराम राम हरे हरे",
        translation: "The great chant for deliverance - calling upon Lord Krishna and Rama to remove all material suffering.",
        deity: "Krishna",
        emojiCounts: { "🙏": 52, "❤️": 40, "🌟": 46 }
      },
      {
        id: "wed-2",
        day: "Wednesday",
        category: "Chalisas",
        title: "Ganesh Chalisa",
        textEnglish: "Jai Ganesh Girija Suvan\nMangal Mul Sujan\nKahat Ayodhya Das\nTum Dehu Karhu Kalyan\n\nJai Jai Jai Ganesh Gusain\nMangal Bharan Kari Gyan\nEkdant Dayavant\nChari Bhuj Var Daan",
        textHindi: "जय गणेश गिरिजा सुवन\nमंगल मूल सुजान\nकहत अयोध्या दास\nतुम देहु करहु कल्याण\n\nजय जय जय गणेश गुसाईं\nमंगल भरन करि ज्ञान\nएकदंत दयावंत\nचारि भुज वर दान",
        translation: "Victory to Ganesha, son of Parvati, the root of all auspiciousness and wisdom. Ayodhya Das says, you grant welfare and blessings. Victory to Lord Ganesha, filled with auspiciousness and knowledge, the compassionate one-tusked deity with four arms who grants boons.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 55, "❤️": 42, "🌟": 48 }
      },
      {
        id: "wed-2b",
        day: "Wednesday",
        category: "Chalisas",
        title: "Krishna Chalisa",
        textEnglish: "Bansi Bajat Akhand Anand Dhara\nAti Anup Rup Tribhuvan Sara\nIndira Ramini Hraday Basera\nAti Anand Kari Jas Uchara\n\nKanha Sundar Mukh Chandra Chaya\nBhru Bhang Madhur Mridu Maya\nVindavan Mein Dhenu Charai\nMohan Murat Man Mohani",
        textHindi: "बंसी बजत अखंड आनंद धारा\nअति अनुप रूप त्रिभुवन सारा\nइंदिरा रमणी हृदय बसेरा\nअति आनंद करि जस उचारा\n\nकान्हा सुंदर मुख चंद्र छाया\nभ्रू भंग मधुर मृदु माया\nवृंदावन में धेनु चराई\nमोहन मूरत मन मोहनी",
        translation: "The flute plays streams of eternal bliss, your incomparable form is the essence of the three worlds. You reside in the hearts of devotees like Lakshmi, and speaking your glories brings great joy. Beautiful Krishna with a moon-like face, your sweet and gentle eyebrow movements are enchanting. In Vrindavan you graze the cows, your captivating form enchants the mind.",
        deity: "Krishna",
        emojiCounts: { "🙏": 58, "❤️": 45, "🌟": 52 }
      },
      {
        id: "wed-3",
        day: "Wednesday",
        category: "Aartis",
        title: "Jai Ganesh Jai Ganesh Deva",
        textEnglish: "Jai Ganesh Jai Ganesh Jai Ganesh Deva\nMata Jaki Parvati Pita Mahadeva\nEkdant Dayavant Char Bhuja Dhari\nMathe Sindhur Sohe Muse Ki Savari\n\nPan Chadhe Phul Chadhe Aur Chadhe Meva\nLadduan Ka Bhog Lage Sant Kare Seva\nJai Ganesh Jai Ganesh Jai Ganesh Deva\nMata Jaki Parvati Pita Mahadeva",
        textHindi: "जय गणेश जय गणेश जय गणेश देवा\nमाता जाकी पार्वती पिता महादेवा\nएकदंत दयावंत चार भुजा धारी\nमाथे सिंदूर सोहे मूसे की सवारी\n\nपान चढ़े फूल चढ़े और चढ़े मेवा\nलड्डुअन का भोग लगे संत करे सेवा\nजय गणेश जय गणेश जय गणेश देवा\nमाता जाकी पार्वती पिता महादेवा",
        translation: "Victory to Lord Ganesha, whose mother is Parvati and father is Mahadeva (Shiva). The one-tusked, compassionate deity with four arms, with sindoor adorning his forehead and riding on a mouse. Betel leaves, flowers, and sweets are offered, laddoos are presented as bhog while saints perform service.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 50, "❤️": 38, "🌟": 44 }
      },
      {
        id: "wed-3b",
        day: "Wednesday",
        category: "Aartis",
        title: "Om Jai Jagdish Hare",
        textEnglish: "Om Jai Jagdish Hare\nSwami Jai Jagdish Hare\nBhakt Jano Ke Sankat\nDas Jano Ke Sankat\nKshan Mein Dur Kare\nOm Jai Jagdish Hare\n\nJo Dhyave Phal Pavel\nMan Kamna Gat Pavel\nSwami Man Kamna Gat Pavel\nDukh Vinashe Man Ka\nSwami Dukh Vinashe Man Ka\nSukh Sampati Ghar Aave\nKashti Se Nikal Jave\nOm Jai Jagdish Hare",
        textHindi: "ॐ जय जगदीश हरे\nस्वामी जय जगदीश हरे\nभक्त जनों के संकट\nदास जनों के संकट\nक्षण में दूर करे\nॐ जय जगदीश हरे\n\nजो ध्यावे फल पावे\nमन कामना गत पावे\nस्वामी मन कामना गत पावे\nदुःख बिनाशे मन का\nस्वामी दुःख बिनाशे मन का\nसुख संपति घर आवे\nकष्टि से निकाल जावे\nॐ जय जगदीश हरे",
        translation: "Victory to the Lord of the Universe, who removes the troubles of devotees and servants in an instant. Those who meditate upon you receive fruits, their heart's desires are fulfilled. You destroy mental sorrows and bring happiness and prosperity to homes, delivering from all troubles.",
        deity: "Krishna",
        emojiCounts: { "🙏": 48, "❤️": 36, "🌟": 42 }
      },
      {
        id: "wed-4",
        day: "Wednesday",
        category: "Kathas",
        title: "Budhwar Vrat Katha",
        textEnglish: "Once there lived a merchant who was facing severe business losses and mental distress. His wise wife suggested observing the Wednesday fast (Budhwar Vrat) dedicated to Lord Ganesha and Lord Krishna for wisdom and prosperity.\n\nEvery Wednesday, the merchant would wake up early, bathe, and visit the temple. He would offer green grass (durva), bananas, modaks to Lord Ganesha, and tulsi leaves, butter, and sweets to Lord Krishna. He fasted throughout the day, consuming only fruits and milk.\n\nAfter months of sincere devotion, Lord Ganesha blessed him with wisdom to make right business decisions, while Lord Krishna granted him the clarity to see new opportunities. His failing business gradually recovered.\n\nOne Wednesday, while returning from the temple, he met an old friend who offered him a lucrative partnership. This partnership transformed his fortunes completely. Within a year, he became more prosperous than ever before.\n\nThe merchant realized that the combined blessings of Lord Ganesha (remover of obstacles) and Lord Krishna (provider of wisdom) had changed his destiny. He continued the Wednesday fasting tradition and always helped others in need.\n\nThis story teaches us that Wednesday worship brings wisdom, removes obstacles from our path, and opens doors to new opportunities and success.",
        textHindi: "एक बार एक व्यापारी था जो गंभीर व्यापारिक हानि और मानसिक संकट का सामना कर रहा था। उसकी बुद्धिमान पत्नी ने सुझाव दिया कि वे ज्ञान और समृद्धि के लिए भगवान गणेश और भगवान कृष्ण को समर्पित बुधवार का व्रत करें।\n\nहर बुधवार को व्यापारी सुबह जल्दी उठता, स्नान करता, और मंदिर जाता। वह भगवान गणेश को दूर्वा घास, केले, मोदक चढ़ाता और भगवान कृष्ण को तुलसी के पत्ते, मक्खन और मिठाइयां अर्पित करता। वह पूरे दिन उपवास रखता, केवल फल और दूध का सेवन करता।\n\nकई महीनों की सच्ची भक्ति के बाद, भगवान गणेश ने उसे सही व्यापारिक निर्णय लेने की बुद्धि दी, जबकि भगवान कृष्ण ने उसे नए अवसर देखने की स्पष्टता प्रदान की। उसका असफल व्यापार धीरे-धीरे ठीक होने लगा।\n\nएक बुधवार को मंदिर से लौटते समय, उसकी मुलाकात एक पुराने मित्र से हुई जिसने उसे एक लाभदायक साझेदारी का प्रस्ताव दिया। इस साझेदारी ने उसके भाग्य को पूरी तरह बदल दिया। एक साल के भीतर वह पहले से कहीं अधिक समृद्ध हो गया।\n\nव्यापारी को एहसास हुआ कि भगवान गणेश (विघ्न हर्ता) और भगवान कृष्ण (ज्ञान दाता) के संयुक्त आशीर्वाद ने उसकी किस्मत बदल दी है। उसने बुधवार के उपवास की परंपरा जारी रखी और हमेशा जरूरतमंदों की मदद की।\n\nयह कहानी हमें सिखाती है कि बुधवार की पूजा बुद्धि लाती है, हमारे रास्ते से बाधाओं को हटाती है, और नए अवसरों और सफलता के दरवाजे खोलती है।",
        translation: "The story of how Wednesday fasting brings wisdom, removes obstacles, and opens doors to prosperity through the combined blessings of Ganesha and Krishna.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 32, "❤️": 28, "🌟": 30 }
      },
      {
        id: "wed-5",
        day: "Wednesday",
        category: "Stotrams",
        title: "Ganesha Atharvashirsha",
        textEnglish: "Om Namaste Ganapataye\nTvameva Pratyaksham Tattvamasi\nTvameva Kevalam Kartasi\nTvameva Kevalam Dhartasi\nTvameva Kevalam Hartasi\nTvameva Sarvam Khalvidam Brahmasi\nTvam Sakshad Atmasi Nityam",
        textHindi: "ॐ नमस्ते गणपतये\nत्वमेव प्रत्यक्षं तत्त्वमसि\nत्वमेव केवलं कर्तासि\nत्वमेव केवलं धर्तासि\nत्वमेव केवलं हर्तासि\nत्वमेव सर्वं खल्विदं ब्रह्मासि\nत्वं साक्षाद् आत्मासि नित्यम्",
        translation: "Salutations to Lord Ganesha. You are the visible reality, you are the only creator, you are the only sustainer, you are the only destroyer. You are indeed all this - Brahman itself. You are the eternal soul manifest.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 60, "❤️": 45, "🌟": 55 }
      },
      {
        id: "wed-5b",
        day: "Wednesday",
        category: "Stotrams",
        title: "Gopal Sahasranama",
        textEnglish: "Krishna Govinda Hare Murare\nHe Natha Narayana Vasudeva\nGopala Gopana Vallabha Haraye\nNamah Krishna Yadunandana\n\nMuralidhara Giridhari Bala\nYashoda Nandana Devaki Putra\nVrindavana Chandra Radha Vallabha\nShyama Sundara Madhava Keshava",
        textHindi: "कृष्ण गोविन्द हरे मुरारे\nहे नाथ नारायण वासुदेव \nगोपाल गोपन वल्लभ हरये\nनमः कृष्ण यदुनन्दन\n\nमुरलीधर गिरिधारी बाला\nयशोदा नन्दन देवकी पुत्र\nवृन्दावन चन्द्र राधा वल्लभ\nश्याम सुन्दर माधव केशव",
        translation: "Krishna, Govinda, Hari, destroyer of demon Mura, O Lord Narayana Vasudeva. Protector of cows and cowherd boys, beloved Hari, salutations to Krishna, joy of Yadu dynasty. Flute-bearer, lifter of Govardhan mountain, beloved child of Yashoda and son of Devaki. Moon of Vrindavan, beloved of Radha, beautiful dark-complexioned Madhava Keshava.",
        deity: "Krishna",
        emojiCounts: { "🙏": 58, "❤️": 44, "🌟": 50 }
      },
      {
        id: "wed-6",
        day: "Wednesday",
        category: "Vrat Vidhi",
        title: "Budhwar Vrat Vidhi",
        textEnglish: "WEDNESDAY FAST PROCEDURE:\n\n1. Wake up early, bathe and wear clean clothes\n2. Set up altar with Ganesha and Krishna images\n3. Light incense and diya\n4. Offer durva grass (21 blades) to Ganesha\n5. Offer bananas and modaks to Ganesha\n6. Offer tulsi leaves and butter to Krishna\n7. Chant 'Om Gan Ganapataye Namah' 108 times\n8. Chant 'Hare Krishna' mantra 108 times\n9. Read Ganesha Atharvashirsha\n10. Fast completely or eat only fruits/milk\n11. Avoid grains, salt, and regular meals\n12. Break fast after evening prayers\n13. Distribute prasad to family and neighbors\n\nBENEFITS: Grants wisdom, removes obstacles, brings success in business, enhances intellect, and provides clarity in decision-making.",
        textHindi: "बुधवार व्रत विधि:\n\n१. सुबह जल्दी उठें, स्नान करें और स्वच्छ वस्त्र धारण करें\n२. गणेश और कृष्ण की मूर्तियों के साथ वेदी सजाएं\n३. धूप और दीपक जलाएं\n४. गणेश जी को दूर्वा घास (२१ तिनके) चढ़ाएं\n५. गणेश जी को केले और मोदक अर्पित करें\n६. कृष्ण जी को तुलसी के पत्ते और मक्खन अर्पित करें\n७. 'ॐ गं गणपतये नमः' का १०८ बार जाप करें\n८. 'हरे कृष्ण' मंत्र का १०८ बार जाप करें\n९. गणेश अथर्वशीर्ष का पाठ करें\n१०. पूर्ण उपवास रखें या केवल फल/दूध लें\n११. अनाज, नमक और नियमित भोजन से बचें\n१२. संध्या प्रार्थना के बाद व्रत तोड़ें\n१३. परिवार और पड़ोसियों में प्रसाद बांटें\n\nलाभ: बुद्धि प्रदान करता है, बाधाओं को दूर करता है, व्यापार में सफलता दिलाता है, बुद्धि बढ़ाता है, और निर्णय लेने में स्पष्टता प्रदान करता है।",
        translation: "Complete procedure for observing Wednesday fast dedicated to Lord Ganesha and Krishna for wisdom and prosperity.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 46, "❤️": 38, "🌟": 42 }
      },
      {
        id: "wed-7",
        day: "Wednesday",
        category: "Extras",
        title: "Durva Grass Significance",
        textEnglish: "DURVA GRASS - GANESHA'S FAVORITE OFFERING\n\nDurva (Bermuda grass) is considered the most sacred offering to Lord Ganesha and holds immense spiritual significance.\n\nSIGNIFICANCE:\n• Durva represents longevity and prosperity\n• Its three blades symbolize the three gunas (Sattva, Rajas, Tamas)\n• Represents continuous growth and regeneration\n• Associated with fertility and abundance\n• Green color symbolizes life, growth, and freshness\n\nSPIRITUAL BENEFITS:\n• Offering durva removes obstacles and difficulties\n• Brings peace, prosperity, and good fortune\n• Enhances spiritual growth and wisdom\n• Provides protection from negative energies\n• Fulfills desires when offered with devotion\n• Grants longevity and good health\n\nPROPER OFFERING METHOD:\n1. Pluck fresh durva grass in the morning\n2. Select blades without damage or holes\n3. Wash gently with clean water\n4. Offer in odd numbers (usually 21 blades)\n5. Place gently on Ganesha's feet or trunk\n6. Chant 'Om Gan Ganapataye Namah' while offering\n7. Pray for removal of obstacles\n\nSCRIPTURAL REFERENCE:\nIn the Ganesha Purana, it's mentioned that Lord Ganesha is extremely pleased with durva offerings. Once, when demon Analasura troubled the gods, Lord Ganesha defeated him. The demon sought forgiveness and was transformed into durva grass, forever blessed to be Ganesha's favorite offering.\n\nOffering durva on Wednesdays is especially beneficial for students, businesspeople, and those seeking wisdom and success.",
        textHindi: "दूर्वा घास - गणेश जी का प्रिय अर्पण\n\nदूर्वा (दूब घास) को भगवान गणेश का सबसे पवित्र अर्पण माना जाता है और इसका अत्यधिक आध्यात्मिक महत्व है।\n\nमहत्व:\n• दूर्वा दीर्घायु और समृद्धि का प्रतीक है\n• इसकी तीन पत्तियां तीन गुणों (सत्व, रजस्, तमस्) का प्रतीक हैं\n• निरंतर वृद्धि और पुनर्जनन का प्रतिनिधित्व करती है\n• प्रजनन क्षमता और प्रचुरता से जुड़ी है\n• हरा रंग जीवन, वृद्धि और ताजगी का प्रतीक है\n\nआध्यात्मिक लाभ:\n• दूर्वा अर्पित करने से बाधाएं और कठिनाइयां दूर होती हैं\n• शांति, समृद्धि और सौभाग्य लाती है\n• आध्यात्मिक वृद्धि और बुद्धि बढ़ाती है\n• नकारात्मक ऊर्जाओं से सुरक्षा प्रदान करती है\n• भक्ति से अर्पित करने पर मनोकामनाएं पूर्ण करती है\n• दीर्घायु और अच्छा स्वास्थ्य प्रदान करती है\n\nउचित अर्पण विधि:\n१. सुबह ताजी दूर्वा घास तोड़ें\n२. बिना क्षति या छेद वाली पत्तियां चुनें\n३. स्वच्छ जल से धीरे से धोएं\n४. विषम संख्या में अर्पित करें (आम तौर पर २१ तिनके)\n५. गणेश जी के चरणों या सूंड पर धीरे से रखें\n६. अर्पित करते समय 'ॐ गं गणपतये नमः' का जाप करें\n७. बाधाओं के निवारण के लिए प्रार्थना करें\n\nशास्त्रीय संदर्भ:\nगणेश पुराण में उल्लेख है कि भगवान गणेश दूर्वा के अर्पण से अत्यंत प्रसन्न होते हैं। एक बार जब दैत्य अनलासुर ने देवताओं को परेशान किया, तो भगवान गणेश ने उसे पराजित किया। दैत्य ने क्षमा मांगी और दूर्वा घास में रूपांतरित हो गया, हमेशा के लिए गणेश का प्रिय अर्पण बनने का आशीर्वाद पाया।\n\nबुधवार को दूर्वा अर्पित करना विशेषकर छात्रों, व्यापारियों और बुद्धि व सफलता चाहने वालों के लिए लाभकारी है।",
        translation: "Complete guide to the sacred significance of durva grass in Ganesha worship and its spiritual benefits.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 40, "❤️": 32, "🌟": 36 }
      },
      {
        id: "wed-8", 
        day: "Wednesday",
        category: "Extras",
        title: "Banana Offering Significance",
        textEnglish: "BANANA - SYMBOL OF PROSPERITY AND DEVOTION\n\nBananas hold special significance in Hindu worship, particularly for Lord Ganesha and Lord Krishna.\n\nSIGNIFICANCE IN WORSHIP:\n• Banana represents fertility, prosperity, and abundance\n• Yellow color symbolizes knowledge, learning, and wisdom\n• Easy to digest, representing simplicity and purity\n• Available throughout the year, showing consistency in devotion\n• Sweet taste symbolizes the sweetness of divine love\n\nSPIRITUAL BENEFITS:\n• Offering bananas brings material prosperity\n• Enhances fertility and family happiness\n• Removes financial difficulties and poverty\n• Provides nourishment for both body and soul\n• Creates positive vibrations in the environment\n• Attracts divine blessings and grace\n\nPROPER OFFERING METHOD:\n1. Select fresh, ripe, unblemished bananas\n2. Wash them gently with clean water\n3. Arrange them beautifully before the deity\n4. Offer in odd numbers (usually 5, 7, or 11)\n5. Chant appropriate mantras while offering\n6. Pray for prosperity and wisdom\n7. Distribute as prasad after worship\n\nTYPES PREFERRED:\n• Small bananas (Elaichi bananas) - Lord Ganesha's favorite\n• Regular bananas - for general worship\n• Raw bananas - for specific rituals\n• Banana leaves - used as plates for prasad\n\nTRADITIONAL BELIEF:\nIt's believed that Lord Ganesha loves the sweetness of bananas, and offering them removes obstacles in education, business, and marriage. Krishna, in his childhood, was fond of all dairy products and fruits, making bananas a beloved offering.\n\nOffering bananas on Wednesdays, especially to Ganesha, is said to bring wisdom in studies, success in business ventures, and harmony in relationships.",
        textHindi: "केला - समृद्धि और भक्ति का प्रतीक\n\nहिंदू पूजा में केले का विशेष महत्व है, विशेषकर भगवान गणेश और भगवान कृष्ण के लिए।\n\nपूजा में महत्व:\n• केला प्रजनन क्षमता, समृद्धि और प्रचुरता का प्रतीक है\n• पीला रंग ज्ञान, विद्या और बुद्धि का प्रतीक है\n• आसानी से पचने वाला, सादगी और शुद्धता का प्रतिनिधित्व\n• साल भर उपलब्ध, भक्ति में निरंतरता दिखाता है\n• मीठा स्वाद दिव्य प्रेम की मधुरता का प्रतीक है\n\nआध्यात्मिक लाभ:\n• केला अर्पित करने से भौतिक समृद्धि आती है\n• प्रजनन क्षमता और पारिवारिक खुशी बढ़ती है\n• आर्थिक कठिनाइयों और गरीबी को दूर करता है\n• शरीर और आत्मा दोनों के लिए पोषण प्रदान करता है\n• वातावरण में सकारात्मक कंपन पैदा करता है\n• दिव्य आशीर्वाद और कृपा आकर्षित करता है\n\nउचित अर्पण विधि:\n१. ताजे, पके, बिना दाग वाले केले चुनें\n२. उन्हें स्वच्छ जल से धीरे से धोएं\n३. देवता के सामने सुंदर तरीके से सजाएं\n४. विषम संख्या में अर्पित करें (आम तौर पर ५, ७ या ११)\n५. अर्पित करते समय उपयुक्त मंत्र जाप करें\n६. समृद्धि और बुद्धि के लिए प्रार्थना करें\n७. पूजा के बाद प्रसाद के रूप में बांटें\n\nपसंदीदा प्रकार:\n• छोटे केले (इलायची केले) - भगवान गणेश के प्रिय\n• नियमित केले - सामान्य पूजा के लिए\n• कच्चे केले - विशिष्ट अनुष्ठानों के लिए\n• केले के पत्ते - प्रसाद की थाली के रूप में उपयोग\n\nपारंपरिक मान्यता:\nऐसा माना जाता है कि भगवान गणेश केले की मिठास से प्रेम करते हैं, और इन्हें अर्पित करने से शिक्षा, व्यापार और विवाह में बाधाएं दूर होती हैं। कृष्ण बचपन में सभी डेयरी उत्पादों और फलों के शौकीन थे, जिससे केले एक प्रिय अर्पण बन गए।\n\nबुधवार को, विशेषकर गणेश जी को केले अर्पित करने से अध्ययन में बुद्धि, व्यापारिक उद्यमों में सफलता, और रिश्तों में सामंजस्य मिलता है।",
        translation: "Complete guide to the significance of banana offerings in Hindu worship and their spiritual benefits.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 38, "❤️": 30, "🌟": 34 }
      },

      // THURSDAY - Lord Vishnu/Sai Baba/Brihaspati Dev Worship (Complete Categories)
      {
        id: "thu-1",
        day: "Thursday",
        category: "Mantras",
        title: "Vishnu Maha Mantra",
        textEnglish: "Om Namo Bhagavate Vasudevaya\nOm Namo Bhagavate Vasudevaya\nOm Namo Bhagavate Vasudevaya\nOm Namo Bhagavate Vasudevaya",
        textHindi: "ॐ नमो भगवते वासुदेवाय\nॐ नमो भगवते वासुदेवाय\nॐ नमो भगवते वासुदेवाय\nॐ नमो भगवते वासुदेवाय",
        translation: "I bow to Lord Vasudeva, the all-pervading divine consciousness, protector and sustainer of the universe.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 52, "❤️": 38, "🌟": 45 }
      },
      {
        id: "thu-1b",
        day: "Thursday",
        category: "Mantras",
        title: "Sai Baba Mantra",
        textEnglish: "Om Sai Namo Namah\nOm Sai Namo Namah\nOm Sai Namo Namah\nOm Sai Namo Namah",
        textHindi: "ॐ साईं नमो नमः\nॐ साईं नमो नमः\nॐ साईं नमो नमः\nॐ साईं नमो नमः",
        translation: "I bow to Sai Baba, the compassionate saint who guides devotees on the path of truth and righteousness.",
        deity: "Sai Baba",
        emojiCounts: { "🙏": 48, "❤️": 35, "🌟": 42 }
      },
      {
        id: "thu-1c",
        day: "Thursday",
        category: "Mantras",
        title: "Brihaspati Mantra",
        textEnglish: "Om Brihaspataye Namah\nOm Gurave Namah\nPushpendra Vahanam Tam\nBuddhyadi Gunam Ganadhyaksham",
        textHindi: "ॐ बृहस्पतये नमः\nॐ गुरवे नमः\nपुष्पेन्द्र वाहनं तं\nबुद्ध्यादि गुणं गणाध्यक्षम्",
        translation: "I bow to Brihaspati, the divine guru who rides the white elephant, bestower of wisdom and knowledge.",
        deity: "Brihaspati",
        emojiCounts: { "🙏": 45, "❤️": 32, "🌟": 38 }
      },
      {
        id: "thu-2",
        day: "Thursday",
        category: "Chalisas",
        title: "Vishnu Chalisa",
        textEnglish: "Shantakaram Bhujagashayanam\nPadmanabham Suresham\nVishvadharam Gaganasadrisham\nMeghavarnam Shubhangam\n\nLakshmi Kantam Kamalanayanam\nYoginam Dhyanagamyam\nVande Vishnum Bhavabhayaharam\nSarvaloka Eknatham",
        textHindi: "शान्ताकारं भुजगशयनं\nपद्मनाभं सुरेशम्\nविश्वाधारं गगनसदृशं\nमेघवर्णं शुभाङ्गम्\n\nलक्ष्मीकान्तं कमलनयनं\nयोगिनां ध्यानगम्यम्\nवन्दे विष्णुं भवभयहरं\nसर्वलोकैकनाथम्",
        translation: "I worship Lord Vishnu, the peaceful one resting on the cosmic serpent, with lotus emerging from his navel, lord of gods. The supporter of the universe, sky-like, cloud-colored with auspicious form. Consort of Lakshmi, lotus-eyed, accessible through meditation by yogis. I bow to Vishnu, remover of worldly fears, the one lord of all worlds.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 58, "❤️": 44, "🌟": 52 }
      },
      {
        id: "thu-2b",
        day: "Thursday",
        category: "Chalisas",
        title: "Sai Chalisa",
        textEnglish: "Jai Jai Sai Mata Pita Hammare\nTum Bin Aur Na Koi Hamare\nSabka Malik Ek Tu Hi Hai\nSabpe Daya Dikhane Wala\n\nShirdi Mein Base Gaye Baba\nDhanya Dhanya Woh Gaon Hai\nJis Mitti Mein Base Tumhare\nCharan Paduka Ki Dhool Hai",
        textHindi: "जय जय साईं माता-पिता हमारे\nतुम बिन और न कोई हमारे\nसबका मालिक एक तू ही है\nसबपे दया दिखाने वाला\n\nशिरडी में बसे गए बाबा\nधन्य धन्य वो गांव है\nजिस मिट्टी में बसे तुम्हारे\nचरण पादुका की धूल है",
        translation: "Victory to Sai, our mother and father, without you we have no one else. You alone are the master of all, the one who shows compassion to everyone. Baba settled in Shirdi, blessed is that village whose soil is sanctified by the dust of your holy feet.",
        deity: "Sai Baba",
        emojiCounts: { "🙏": 55, "❤️": 42, "🌟": 48 }
      },
      {
        id: "thu-3",
        day: "Thursday",
        category: "Aartis",
        title: "Om Jai Jagdish Hare",
        textEnglish: "Om Jai Jagdish Hare\nSwami Jai Jagdish Hare\nBhakt Jano Ke Sankat\nDas Jano Ke Sankat\nKshan Mein Dur Kare\nOm Jai Jagdish Hare\n\nJinka Naam Lene Se\nJinka Naam Lene Se\nPap Katat Hain\nAnjana Mata Ke Lala\nAnjan Mata Ke Lala\nGunanidhi Gun Gayen",
        textHindi: "ॐ जय जगदीश हरे\nस्वामी जय जगदीश हरे\nभक्त जनों के संकट\nदास जनों के संकट\nक्षण में दूर करे\nॐ जय जगदीश हरे\n\nजिनका नाम लेने से\nजिनका नाम लेने से\nपाप कटत हैं\nअंजना माता के लाला\nअंजन माता के लाला\nगुणनिधि गुण गायें",
        translation: "Victory to the Lord of the Universe who removes the troubles of devotees and servants in an instant. By taking whose name sins are destroyed, O treasure of virtues, we sing your glorious qualities.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 50, "❤️": 38, "🌟": 44 }
      },
      {
        id: "thu-3b",
        day: "Thursday",
        category: "Aartis",
        title: "Aarti Sai Baba",
        textEnglish: "Aarti Sai Baba Sowiyo\nBhakat Janan Ke Sankat\nPal Mein Dur Karo\nSabke Malakana\n\nTere Darshan Ko Aaye\nShirdi Mein Diwane\nLeke Prasadam Jaate\nSabhi Muraden Paate\nKripanidhi Mere Sai\nPalko Par Bithana",
        textHindi: "आरती साईं बाबा सोवियो\nभक्त जनन के संकट\nपल में दूर करो\nसबके मलकाना\n\nतेरे दर्शन को आये\nशिरडी में दीवाने\nलेके प्रसादम् जाते\nसभी मुरादें पाते\nकृपानिधि मेरे साईं\nपलकों पर बिठाना",
        translation: "We perform aarti of Sai Baba, O master of all, remove devotees' troubles in an instant. Devotees come to Shirdi for your darshan, and taking prasad, all their wishes are fulfilled. O treasure of compassion, my Sai, keep me close to your heart.",
        deity: "Sai Baba",
        emojiCounts: { "🙏": 48, "❤️": 36, "🌟": 42 }
      },
      {
        id: "thu-4",
        day: "Thursday",
        category: "Kathas",
        title: "Brihaspativar Vrat Katha",
        textEnglish: "Once there lived a wealthy merchant who gradually lost his prosperity due to his arrogance and neglect of spiritual duties. His business declined, and his family faced hardships. His wise wife suggested observing the Thursday fast (Brihaspativar Vrat) dedicated to Lord Vishnu and Guru Brihaspati.\n\nEvery Thursday, the merchant would wake up early, bathe, wear yellow clothes, and visit the temple. He offered yellow flowers, bananas, yellow sweets, and chana dal to Lord Vishnu and lit a ghee lamp. He would fast throughout the day, listening to devotional stories and chanting Vishnu mantras.\n\nAfter months of sincere devotion and learning humility, Lord Vishnu blessed him with divine grace. Guru Brihaspati, pleased with his dedication to knowledge and dharma, began guiding his decisions. His lost wealth gradually returned, and his family experienced renewed prosperity.\n\nOne Thursday, while distributing prasad at the temple, he met a learned sage who taught him important business principles and spiritual wisdom. Following this guidance, his business not only recovered but flourished beyond his previous success.\n\nThe merchant realized that Thursday worship had brought him both material prosperity and spiritual wisdom. He continued the tradition with gratitude, always helping others and sharing his knowledge. His household became known for its prosperity, generosity, and devotion.\n\nThis story teaches us that Thursday worship brings divine blessings, spiritual wisdom, material prosperity, and guidance from teachers and mentors in our spiritual and worldly journey.",
        textHindi: "एक बार एक धनवान व्यापारी था जो अपने अहंकार और आध्यात्मिक कर्तव्यों की उपेक्षा के कारण धीरे-धीरे अपनी समृद्धि खो रहा था। उसका व्यापार घट रहा था और उसका परिवार कठिनाइयों का सामना कर रहा था। उसकी बुद्धिमान पत्नी ने भगवान विष्णु और गुरु बृहस्पति को समर्पित गुरुवार का व्रत करने का सुझाव दिया।\n\nहर गुरुवार को व्यापारी सुबह जल्दी उठता, स्नान करता, पीले वस्त्र पहनता और मंदिर जाता। वह भगवान विष्णु को पीले फूल, केले, पीली मिठाइयां और चना दाल अर्पित करता और घी का दीपक जलाता। वह पूरे दिन उपवास रखता, भक्ति कथाएं सुनता और विष्णु मंत्र का जाप करता।\n\nकई महीनों की सच्ची भक्ति और विनम्रता सीखने के बाद, भगवान विष्णु ने उसे दिव्य कृपा प्रदान की। गुरु बृहस्पति, उसकी ज्ञान और धर्म के प्रति निष्ठा से प्रसन्न होकर, उसके निर्णयों का मार्गदर्शन करने लगे। उसका खोया हुआ धन धीरे-धीरे वापस आ गया और उसके परिवार ने नई समृद्धि का अनुभव किया।\n\nएक गुरुवार को मंदिर में प्रसाद बांटते समय, उसकी मुलाकात एक विद्वान संत से हुई जिसने उसे महत्वपूर्ण व्यापारिक सिद्धांत और आध्यात्मिक ज्ञान सिखाया। इस मार्गदर्शन का पालन करते हुए, उसका व्यापार न केवल ठीक हो गया बल्कि पहले की सफलता से भी कहीं अधिक फला-फूला।\n\nव्यापारी को एहसास हुआ कि गुरुवार की पूजा ने उसे भौतिक समृद्धि और आध्यात्मिक ज्ञान दोनों दिए हैं। उसने कृतज्ञता के साथ परंपरा जारी रखी, हमेशा दूसरों की मदद की और अपना ज्ञान साझा किया। उसका घर समृद्धि, उदारता और भक्ति के लिए प्रसिद्ध हो गया।\n\nयह कहानी हमें सिखाती है कि गुरुवार की पूजा दिव्य आशीर्वाद, आध्यात्मिक ज्ञान, भौतिक समृद्धि और हमारी आध्यात्मिक व भौतिक यात्रा में शिक्षकों और मार्गदर्शकों से दिशा प्रदान करती है।",
        translation: "The story of how Thursday fasting brings divine blessings, spiritual wisdom, and material prosperity through devotion to Vishnu and Brihaspati.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 35, "❤️": 28, "🌟": 32 }
      },
      {
        id: "thu-5",
        day: "Thursday",
        category: "Stotrams",
        title: "Vishnu Sahasranama",
        textEnglish: "Vishvam Vishnur Vashatkaro\nBhuta-bhavya-bhavat-prabhuh\nBhutakrid Bhutabhrid Bhavo\nBhutatma Bhuta-bhavanah\n\nPutatma Paramatma Cha\nMuktanam Parama Gatih\nAvyayah Purusha Sakshi\nKshetrajno Aksara Ishvarah",
        textHindi: "विश्वं विष्णुर्वषट्कारो\nभूत-भव्य-भवत्-प्रभुः\nभूतकृद् भूतभृद् भावो\nभूतात्मा भूत-भावनः\n\nपूतात्मा परमात्मा च\nमुक्तानां परमा गतिः\nअव्ययः पुरुषः साक्षी\nक्षेत्रज्ञो अक्षर ईश्वरः",
        translation: "The universe, Vishnu, the bestower of sacrificial offerings, lord of past, present and future. Creator of beings, sustainer of beings, existence itself, soul of beings, creator of beings. Pure soul, supreme soul, the ultimate destination of liberated souls. Imperishable, cosmic being, witness, knower of the field, immutable lord.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 62, "❤️": 48, "🌟": 55 }
      },
      {
        id: "thu-5b",
        day: "Thursday",
        category: "Stotrams",
        title: "Sai Baba Ashtotram",
        textEnglish: "Om Sainathaya Namah\nOm Lakshmi Niwasaya Namah\nOm Satchit-anandaya Namah\nOm Shivasakya Namah\nOm Samarasaya Namah\nOm Samsara-tarakaya Namah\nOm Sarva-gnaya Namah\nOm Sadguruve Namah",
        textHindi: "ॐ साईनाथाय नमः\nॐ लक्ष्मी निवासाय नमः\nॐ सच्चित्-आनन्दाय नमः\nॐ शिवसाक्याय नमः\nॐ समरसाय नमः\nॐ संसार-तारकाय नमः\nॐ सर्व-ज्ञाय नमः\nॐ सद्गुरवे नमः",
        translation: "Salutations to Sai Natha, abode of Lakshmi, embodiment of existence-consciousness-bliss, powerful like Shiva, impartial to all, savior from worldly existence, omniscient, true guru.",
        deity: "Sai Baba",
        emojiCounts: { "🙏": 58, "❤️": 44, "🌟": 50 }
      },
      {
        id: "thu-6",
        day: "Thursday",
        category: "Vrat Vidhi",
        title: "Brihaspativar Vrat Vidhi",
        textEnglish: "THURSDAY FAST PROCEDURE:\n\n1. Wake up early and take a purifying bath\n2. Wear yellow/golden colored clothes\n3. Set up altar with Vishnu and Sai Baba images\n4. Light ghee lamp or mustard oil diya\n5. Offer yellow flowers (marigold, turmeric flowers)\n6. Offer yellow fruits (bananas, yellow apples)\n7. Prepare chana dal (Bengal gram) as bhog\n8. Offer yellow sweets (besan laddoo, petha)\n9. Chant 'Om Namo Bhagavate Vasudevaya' 108 times\n10. Recite Vishnu Sahasranama or selected verses\n11. Fast completely or eat only yellow colored foods\n12. Avoid salt, grains (except chana dal), non-vegetarian food\n13. Break fast after sunset with prasad\n14. Listen to Vishnu/Sai stories and distribute prasad\n\nBENEFITS: Grants prosperity, wisdom, knowledge, removes financial difficulties, brings teacher's blessings, and spiritual growth.",
        textHindi: "बृहस्पतिवार व्रत विधि:\n\n१. सुबह जल्दी उठकर शुद्धीकरण स्नान करें\n२. पीले/सुनहरे रंग के वस्त्र धारण करें\n३. विष्णु और साईं बाबा की मूर्तियों के साथ वेदी सजाएं\n४. घी का दीपक या सरसों के तेल का दिया जलाएं\n५. पीले फूल (गेंदा, हल्दी के फूल) चढ़ाएं\n६. पीले फल (केले, पीले सेब) अर्पित करें\n७. चना दाल को भोग के रूप में तैयार करें\n८. पीली मिठाइयां (बेसन लड्डू, पेठा) चढ़ाएं\n९. 'ॐ नमो भगवते वासुदेवाय' का १०८ बार जाप करें\n१०. विष्णु सहस्रनाम या चुने हुए श्लोकों का पाठ करें\n११. पूर्ण उपवास रखें या केवल पीले रंग का भोजन लें\n१२. नमक, अनाज (चना दाल को छोड़कर), मांसाहार से बचें\n१३. सूर्यास्त के बाद प्रसाद से व्रत तोड़ें\n१४. विष्णु/साईं की कथाएं सुनें और प्रसाद बांटें\n\nलाभ: समृद्धि, बुद्धि, ज्ञान प्रदान करता है, आर्थिक कठिनाइयों को दूर करता है, गुरु का आशीर्वाद और आध्यात्मिक वृद्धि लाता है।",
        translation: "Complete procedure for observing Thursday fast dedicated to Lord Vishnu and Sai Baba for prosperity and wisdom.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 48, "❤️": 36, "🌟": 42 }
      },
      {
        id: "thu-7",
        day: "Thursday",
        category: "Extras",
        title: "Significance of Yellow Color",
        textEnglish: "YELLOW COLOR - SYMBOL OF KNOWLEDGE AND PROSPERITY\n\nYellow holds profound significance in Thursday worship, particularly for Lord Vishnu, Sai Baba, and Brihaspati Dev.\n\nSPIRITUAL SIGNIFICANCE:\n• Yellow represents knowledge, wisdom, and learning\n• Associated with planet Jupiter (Brihaspati/Guru)\n• Symbolizes prosperity, abundance, and good fortune\n• Represents divine light and spiritual illumination\n• Connected to solar energy and positive vibrations\n• Color of turmeric, considered sacred and purifying\n\nWHY YELLOW ON THURSDAYS:\n• Thursday is ruled by Jupiter (Brihaspati), planet of wisdom\n• Lord Vishnu's association with preservation and prosperity\n• Sai Baba often wore yellow/saffron robes\n• Yellow attracts divine blessings and positive energy\n• Enhances learning capacity and intellectual growth\n• Brings stability and material success\n\nYELLOW OFFERINGS:\n• Clothes: Wear yellow/golden garments\n• Flowers: Marigold, turmeric flowers, yellow roses\n• Food: Bananas, yellow sweets, turmeric rice\n• Chana dal (Bengal gram) - special Thursday offering\n• Yellow fruits and vegetables\n• Saffron milk or turmeric milk\n\nBENEFITS OF YELLOW:\n• Enhances concentration and memory\n• Attracts wealth and prosperity\n• Improves teacher-student relationships\n• Brings success in education and career\n• Removes obstacles in learning\n• Creates positive mental attitude\n• Strengthens connection with divine wisdom\n\nSCRIPTURAL REFERENCE:\nIn the Vishnu Purana, it's mentioned that offerings made in yellow color on Thursdays are especially dear to Lord Vishnu and bring rapid fulfillment of wishes related to knowledge and prosperity.\n\nWearing yellow and offering yellow items on Thursdays creates a powerful spiritual vibration that aligns us with cosmic wisdom and divine abundance.",
        textHindi: "पीला रंग - ज्ञान और समृद्धि का प्रतीक\n\nगुरुवार की पूजा में पीले रंग का गहरा महत्व है, विशेषकर भगवान विष्णु, साईं बाबा और बृहस्पति देव के लिए।\n\nआध्यात्मिक महत्व:\n• पीला रंग ज्ञान, बुद्धि और विद्या का प्रतीक है\n• बृहस्पति ग्रह (गुरु) से जुड़ा हुआ है\n• समृद्धि, प्रचुरता और सौभाग्य का प्रतीक है\n• दिव्य प्रकाश और आध्यात्मिक प्रबोधन का प्रतिनिधित्व\n• सौर ऊर्जा और सकारात्मक कंपनों से जुड़ा है\n• हल्दी का रंग, जो पवित्र और शुद्धीकारक माना जाता है\n\nगुरुवार को पीला रंग क्यों:\n• गुरुवार बृहस्पति ग्रह द्वारा शासित है, जो बुद्धि का ग्रह है\n• भगवान विष्णु का संरक्षण और समृद्धि से संबंध\n• साईं बाबा अक्सर पीले/भगवा वस्त्र पहनते थे\n• पीला रंग दिव्य आशीर्वाद और सकारात्मक ऊर्जा आकर्षित करता है\n• सीखने की क्षमता और बौद्धिक विकास बढ़ाता है\n• स्थिरता और भौतिक सफलता लाता है\n\nपीले रंग के अर्पण:\n• वस्त्र: पीले/सुनहरे वस्त्र पहनें\n• फूल: गेंदा, हल्दी के फूल, पीले गुलाब\n• भोजन: केले, पीली मिठाइयां, हल्दी चावल\n• चना दाल - विशेष गुरुवारी अर्पण\n• पीले फल और सब्जियां\n• केसर दूध या हल्दी दूध\n\nपीले रंग के लाभ:\n• एकाग्रता और स्मृति बढ़ाता है\n• धन और समृद्धि आकर्षित करता है\n• गुरु-शिष्य संबंधों में सुधार करता है\n• शिक्षा और करियर में सफलता लाता है\n• विद्या में बाधाओं को दूर करता है\n• सकारात्मक मानसिक दृष्टिकोण पैदा करता है\n• दिव्य ज्ञान के साथ संबंध मजबूत करता है\n\nशास्त्रीय संदर्भ:\nविष्णु पुराण में उल्लेख है कि गुरुवार को पीले रंग में किए गए अर्पण भगवान विष्णु को विशेष रूप से प्रिय हैं और ज्ञान व समृद्धि संबंधी इच्छाओं की शीघ्र पूर्ति करते हैं।\n\nगुरुवार को पीले वस्त्र पहनना और पीली वस्तुओं का अर्पण एक शक्तिशाली आध्यात्मिक कंपन पैदा करता है जो हमें ब्रह्मांडीय ज्ञान और दिव्य प्रचुरता के साथ जोड़ता है।",
        translation: "Complete guide to the spiritual significance of yellow color in Thursday worship and its divine benefits.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 44, "❤️": 32, "🌟": 38 }
      },
      {
        id: "thu-8",
        day: "Thursday",
        category: "Extras",
        title: "Banana Tree Worship",
        textEnglish: "BANANA TREE - SACRED SYMBOL OF PROSPERITY\n\nBanana tree (Kela Vriksha) holds special significance in Thursday worship and Hindu traditions, particularly connected to Lord Vishnu and Brihaspati.\n\nSPIRITUAL SIGNIFICANCE:\n• Banana tree represents fertility, abundance, and prosperity\n• Every part of the tree is useful - symbolizing completeness\n• Associated with Lord Vishnu as provider and sustainer\n• Connected to Goddess Lakshmi for wealth and fortune\n• Represents selfless service and generosity\n• Quick growth symbolizes rapid progress and success\n\nTHURSDAY CONNECTION:\n• Jupiter (Brihaspati) governs growth and expansion\n• Banana tree embodies these qualities perfectly\n• Yellow bananas align with Thursday's color significance\n• Offering bananas to Vishnu brings prosperity\n• Tree worship on Thursdays multiplies benefits\n\nWORSHIP RITUALS:\n1. Circumambulate the banana tree (Pradakshina)\n2. Offer water to the roots while chanting mantras\n3. Tie yellow thread around the trunk\n4. Light a lamp near the tree\n5. Offer yellow flowers and turmeric\n6. Place bananas and yellow sweets as offerings\n7. Pray for prosperity and abundance\n8. Touch the tree with reverence\n\nSPECIAL PRACTICES:\n• Plant a banana tree on Thursdays for good fortune\n• Water the tree daily with devotion\n• Use banana leaves for prasad distribution\n• Offer banana tree leaves to deities\n• Donate bananas to poor on Thursdays\n• Use banana flower in special pujas\n\nBENEFITS:\n• Removes financial difficulties\n• Brings fertility and family growth\n• Ensures abundant harvest and prosperity\n• Blesses with progeny and family happiness\n• Provides protection from negative energies\n• Grants rapid fulfillment of desires\n• Enhances business growth and success\n\nTRADITIONAL BELIEF:\nIt's believed that a household with a banana tree never faces scarcity. The tree is considered so auspicious that even its sight on Thursday mornings brings good luck for the entire day.\n\nWorshipping banana tree on Thursdays, especially during Kartik month, is said to bring blessings equivalent to performing elaborate yajnas and attracts Goddess Lakshmi's grace.",
        textHindi: "केले का पेड़ - समृद्धि का पवित्र प्रतीक\n\nकेले का पेड़ (केला वृक्ष) गुरुवार की पूजा और हिंदू परंपराओं में विशेष महत्व रखता है, विशेषकर भगवान विष्णु और बृहस्पति से जुड़ा हुआ।\n\nआध्यात्मिक महत्व:\n• केले का पेड़ प्रजनन क्षमता, प्रचुरता और समृद्धि का प्रतीक है\n• पेड़ का हर हिस्सा उपयोगी है - पूर्णता का प्रतीक\n• भगवान विष्णु से जुड़ा है जो पालनकर्ता और पोषक हैं\n• धन और भाग्य के लिए देवी लक्ष्मी से संबंधित\n• निस्वार्थ सेवा और उदारता का प्रतिनिधित्व\n• तेज वृद्धि तीव्र प्रगति और सफलता का प्रतीक है\n\nगुरुवार से संबंध:\n• बृहस्पति (गुरु) ग्रह वृद्धि और विस्तार को नियंत्रित करता है\n• केले का पेड़ इन गुणों को पूर्ण रूप से दर्शाता है\n• पीले केले गुरुवार के रंग महत्व से मेल खाते हैं\n• विष्णु को केले अर्पित करने से समृद्धि आती है\n• गुरुवार को वृक्ष पूजा से लाभ कई गुना बढ़ जाता है\n\nपूजा अनुष्ठान:\n१. केले के पेड़ की परिक्रमा करें (प्रदक्षिणा)\n२. मंत्र जाप करते हुए जड़ों में जल अर्पित करें\n३. तने के चारों ओर पीला धागा बांधें\n४. पेड़ के पास दीपक जलाएं\n५. पीले फूल और हल्दी चढ़ाएं\n६. केले और पीली मिठाइयां अर्पण के रूप में रखें\n७. समृद्धि और प्रचुरता के लिए प्रार्थना करें\n८. श्रद्धा से पेड़ को स्पर्श करें\n\nविशेष अभ्यास:\n• सौभाग्य के लिए गुरुवार को केले का पेड़ लगाएं\n• प्रतिदिन भक्ति से पेड़ को पानी दें\n• प्रसाद वितरण के लिए केले के पत्ते का उपयोग करें\n• देवताओं को केले के पेड़ के पत्ते अर्पित करें\n• गुरुवार को गरीबों में केले दान करें\n• विशेष पूजा में केले के फूल का उपयोग करें\n\nलाभ:\n• आर्थिक कठिनाइयों को दूर करता है\n• प्रजनन क्षमता और पारिवारिक वृद्धि लाता है\n• भरपूर फसल और समृद्धि सुनिश्चित करता है\n• संतान और पारिवारिक खुशी का आशीर्वाद देता है\n• नकारात्मक ऊर्जाओं से सुरक्षा प्रदान करता है\n• इच्छाओं की तीव्र पूर्ति करता है\n• व्यापारिक वृद्धि और सफलता बढ़ाता है\n\nपारंपरिक मान्यता:\nऐसा माना जाता है कि जिस घर में केले का पेड़ होता है, वहां कभी अभाव नहीं होता। यह पेड़ इतना शुभ माना जाता है कि गुरुवार की सुबह इसके दर्शन मात्र से पूरे दिन के लिए सौभाग्य मिलता है।\n\nगुरुवार को केले के पेड़ की पूजा, विशेषकर कार्तिक महीने में, विस्तृत यज्ञ करने के समान लाभ देती है और देवी लक्ष्मी की कृपा आकर्षित करती है।",
        translation: "Complete guide to the sacred significance of banana tree worship on Thursdays and its prosperity benefits.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 42, "❤️": 34, "🌟": 38 }
      },

      // FRIDAY - Goddess Lakshmi/Santoshi Maa/Durga Worship (Complete Categories)
      {
        id: "fri-1",
        day: "Friday",
        category: "Mantras",
        title: "Mahalakshmi Mantra",
        textEnglish: "Om Shreem Mahalakshmiyei Namah\nOm Shreem Mahalakshmiyei Namah\nOm Shreem Mahalakshmiyei Namah\nOm Shreem Mahalakshmiyei Namah",
        textHindi: "ॐ श्रीं महालक्ष्म्यै नमः\nॐ श्रीं महालक्ष्म्यै नमः\nॐ श्रीं महालक्ष्म्यै नमः\nॐ श्रीं महालक्ष्म्यै नमः",
        translation: "I bow to Goddess Mahalakshmi, the divine mother who bestows wealth, prosperity, and abundance upon her devotees.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 52, "❤️": 40, "🌟": 46 }
      },
      {
        id: "fri-1b",
        day: "Friday",
        category: "Mantras",
        title: "Santoshi Maa Mantra",
        textEnglish: "Jai Santoshi Maa\nJai Santoshi Maa\nJai Santoshi Maa\nJai Santoshi Maa",
        textHindi: "जय संतोषी माँ\nजय संतोषी माँ\nजय संतोषी माँ\nजय संतोषी माँ",
        translation: "Victory to Mother Santoshi, the goddess of satisfaction and contentment who fulfills all desires of her devotees.",
        deity: "Santoshi Maa",
        emojiCounts: { "🙏": 48, "❤️": 36, "🌟": 42 }
      },
      {
        id: "fri-1c",
        day: "Friday",
        category: "Mantras",
        title: "Durga Mantra",
        textEnglish: "Om Dum Durgayei Namaha\nSarva Mangala Mangalye\nShive Sarvaartha Sadhike\nSharanye Tryambake Gauri\nNarayani Namostute",
        textHindi: "ॐ दुं दुर्गायै नमः\nसर्व मंगला मांगल्ये\nशिवे सर्वार्थ साधिके\nशरण्ये त्र्यम्बके गौरि\nनारायणि नमोऽस्तुते",
        translation: "I bow to Goddess Durga, the auspicious one among all auspicious beings, who fulfills all purposes. I salute you, O three-eyed Gauri, the refuge of all, O Narayani.",
        deity: "Durga",
        emojiCounts: { "🙏": 50, "❤️": 38, "🌟": 44 }
      },
      {
        id: "fri-2",
        day: "Friday",
        category: "Chalisas",
        title: "Lakshmi Chalisa",
        textEnglish: "Mata Lakshmi Gun Gaan\nKariye Param Sujaan\nJay Jagat Janani Mata\nJay Jagat Palak Data\n\nShvetambar Dhara Shubhra\nHastehi Kamal Yugala\nKamal Kanti Kamal Netra\nKamal Mukh Kar Kamala",
        textHindi: "माता लक्ष्मी गुण गान\nकरिये परम सुजान\nजय जगत जननी माता\nजय जगत पालक दाता\n\nश्वेतांबर धारा शुभ्रा\nहस्तेहि कमल युगला\nकमल कान्ति कमल नेत्रा\nकमल मुख कर कमला",
        translation: "We sing the glorious qualities of Mother Lakshmi with supreme wisdom. Victory to the mother of the world, victory to the nourisher and giver of the world. Adorned in white garments, holding lotus flowers in both hands, with lotus-like radiance, lotus eyes, lotus face, and lotus hands.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 55, "❤️": 42, "🌟": 48 }
      },
      {
        id: "fri-2b",
        day: "Friday",
        category: "Chalisas",
        title: "Durga Chalisa",
        textEnglish: "Namo Namo Durge Sukh Karni\nNamo Namo Ambe Dukh Harni\nNirgun Niroop Nirankar Hai\nSab Pe Kripa Dikhane Wali\n\nTu Hi Hai Mata Sherawali\nShakti Roopa Hai Bhawani\nAadi Shakti Hai Jagdambe\nTu Hi Jag Ki Rakhwali",
        textHindi: "नमो नमो दुर्गे सुख करनी\nनमो नमो अम्बे दुःख हरनी\nनिर्गुण निरूप निरंकार है\nसब पे कृपा दिखाने वाली\n\nतू ही है माता शेरवाली\nशक्ति रूपा है भवानी\nआदि शक्ति है जगदम्बे\nतू ही जग की रखवाली",
        translation: "I bow to Durga, the bestower of happiness, I bow to Amba, the remover of sorrows. She is beyond attributes, formless, and without form, the one who shows compassion to all. You are the mother who rides the lion, Bhavani in the form of power, the primordial energy Jagadamba, you are the protector of the world.",
        deity: "Durga",
        emojiCounts: { "🙏": 58, "❤️": 44, "🌟": 52 }
      },
      {
        id: "fri-3",
        day: "Friday",
        category: "Aartis",
        title: "Om Jai Lakshmi Mata",
        textEnglish: "Om Jai Lakshmi Mata\nMaiya Jai Lakshmi Mata\nTumko Nisdin Dhyavat\nHara Vishnu Vidhata\nOm Jai Lakshmi Mata\n\nUma Rama Brahmani\nTum Hi Jag Mata\nSurya Chandra Dhyavat\nNarad Rishi Gata\nOm Jai Lakshmi Mata",
        textHindi: "ॐ जय लक्ष्मी माता\nमैया जय लक्ष्मी माता\nतुमको निसदिन ध्यावत\nहर विष्णु विधाता\nॐ जय लक्ष्मी माता\n\nउमा राम ब्रह्माणी\nतुम ही जग माता\nसूर्य चन्द्र ध्यावत\nनारद ऋषि गाता\nॐ जय लक्ष्मी माता",
        translation: "Victory to Mother Lakshmi! Day and night, Lord Shiva, Vishnu, and Brahma meditate upon you. Uma, Rama, and Brahmani - you are the mother of the world. The Sun and Moon meditate upon you, sage Narada sings your praise.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 50, "❤️": 38, "🌟": 44 }
      },
      {
        id: "fri-3b",
        day: "Friday",
        category: "Aartis",
        title: "Jai Ambe Gauri",
        textEnglish: "Jai Jai Ambe Jai Jagdambe\nJay Jai Ambe Mata\nBhawani Ambe Jagdambe\nAdi Shakti Mata\n\nChamund Kaali Durga Mata\nShera Wali Mata\nRoop Saarisadhi Tumhara\nJagat Mata",
        textHindi: "जय जय अम्बे जय जगदम्बे\nजय जय अम्बे माता\nभवानी अम्बे जगदम्बे\nआदि शक्ति माता\n\nचामुण्ड काली दुर्गा माता\nशेरा वाली माता\nरूप सारीसाधी तुम्हारा\nजगत माता",
        translation: "Victory to Amba, victory to Jagadamba, victory to Mother Amba. Bhavani Amba Jagadamba, the primordial power mother. Chamunda, Kali, Durga Mata, the mother who rides the lion. Your forms are countless, O mother of the world.",
        deity: "Durga",
        emojiCounts: { "🙏": 48, "❤️": 36, "🌟": 42 }
      },
      {
        id: "fri-4",
        day: "Friday",
        category: "Kathas",
        title: "Santoshi Mata Vrat Katha",
        textEnglish: "Once there lived a devoted woman named Satyavati who was facing many difficulties in her married life. Her mother-in-law treated her harshly, and her husband was away for work. She had heard about the miraculous powers of Santoshi Mata and decided to observe her Friday fast (Santoshi Mata Vrat).\n\nEvery Friday, Satyavati would wake up early, clean her house, and set up a small altar for Santoshi Mata. She would offer gur (jaggery) and chana (chickpeas), light a lamp, and pray with complete devotion. She would fast throughout the day, avoiding any sour food, and break her fast only after sunset.\n\nDuring her worship, she would pray: 'Oh Santoshi Mata, you are the goddess of satisfaction and contentment. Please bless my family with happiness and remove all obstacles from my life.' She continued this practice for 16 consecutive Fridays with unwavering faith.\n\nSlowly, miraculous changes began to happen. Her husband got a promotion and returned home. Her mother-in-law's heart softened, and she began treating Satyavati with love and respect. The family was blessed with prosperity and peace.\n\nOn the final Friday, Satyavati organized a special puja and invited other women to share the prasad of gur and chana. She shared the story of Santoshi Mata's grace and how her life had transformed through sincere devotion.\n\nThis story teaches us that Santoshi Mata, the goddess of contentment, listens to the prayers of her devotees and blesses them with family harmony, satisfaction, and fulfillment of righteous desires.",
        textHindi: "एक बार सत्यवती नाम की एक भक्त महिला थी जो अपने विवाहित जीवन में कई कठिनाइयों का सामना कर रही थी। उसकी सास उसके साथ कठोरता से पेश आती थी और उसका पति काम के लिए बाहर गया हुआ था। उसने संतोषी माता की चमत्कारी शक्तियों के बारे में सुना था और उनका शुक्रवार का व्रत करने का निर्णय लिया।\n\nहर शुक्रवार को सत्यवती सुबह जल्दी उठती, अपना घर साफ करती और संतोषी माता के लिए एक छोटी वेदी सजाती। वह गुड़ और चना अर्पित करती, दीपक जलाती और पूर्ण भक्ति से प्रार्थना करती। वह पूरे दिन उपवास रखती, किसी भी खट्टे भोजन से बचती और केवल सूर्यास्त के बाद व्रत तोड़ती।\n\nअपनी पूजा के दौरान वह प्रार्थना करती: 'हे संतोषी माता, आप संतुष्टि और संतोष की देवी हैं। कृपया मेरे परिवार को खुशी का आशीर्वाद दें और मेरे जीवन से सभी बाधाओं को दूर करें।' उसने अटूट विश्वास के साथ लगातार 16 शुक्रवार तक यह अभ्यास जारी रखा।\n\nधीरे-धीरे चमत्कारी बदलाव होने लगे। उसके पति को पदोन्नति मिली और वह घर वापस आ गया। उसकी सास का हृदय नरम हो गया और वह सत्यवती के साथ प्रेम और सम्मान से पेश आने लगी। परिवार को समृद्धि और शांति का आशीर्वाद मिला।\n\nअंतिम शुक्रवार को सत्यवती ने विशेष पूजा का आयोजन किया और अन्य महिलाओं को गुड़ और चने का प्रसाद बांटने के लिए आमंत्रित किया। उसने संतोषी माता की कृपा की कहानी साझा की और बताया कि कैसे सच्ची भक्ति से उसका जीवन बदल गया था।\n\nयह कहानी हमें सिखाती है कि संतोषी माता, संतुष्टि की देवी, अपने भक्तों की प्रार्थनाएं सुनती हैं और उन्हें पारिवारिक सामंजस्य, संतुष्टि और धार्मिक इच्छाओं की पूर्ति का आशीर्वाद देती हैं।",
        translation: "The story of how Santoshi Mata's Friday fast brings family harmony, contentment, and fulfillment of righteous desires through devotion.",
        deity: "Santoshi Maa",
        emojiCounts: { "🙏": 38, "❤️": 32, "🌟": 35 }
      },
      {
        id: "fri-5",
        day: "Friday",
        category: "Stotrams",
        title: "Kanakdhara Stotra",
        textEnglish: "Angam Harer Pulakabhushanam\nPalashapriyam Bilva Patram\nSarva Devamaya Chordhva Pundram\nVande Devi Mahalakshmi",
        textHindi: "अंगं हरेर्पुलकभूषणं\nपलाशप्रियं बिल्व पत्रम्\nसर्व देवमया चोर्ध्व पुण्ड्रम्\nवन्दे देवी महालक्ष्मी",
        translation: "I worship Goddess Mahalakshmi, whose body ornaments cause Lord Hari to be filled with divine joy, who loves the palash flowers and bilva leaves, who encompasses all gods and has the sacred tilaka mark.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 60, "❤️": 46, "🌟": 53 }
      },
      {
        id: "fri-5b",
        day: "Friday",
        category: "Stotrams",
        title: "Durga Saptshati Excerpt",
        textEnglish: "Ya Devi Sarva Bhuteshu\nShakti Rupena Samsthita\nNamastasyai Namastasyai\nNamastasyai Namo Namah\n\nYa Devi Sarva Bhuteshu\nMatru Rupena Samsthita\nNamastasyai Namastasyai\nNamastasyai Namo Namah",
        textHindi: "या देवी सर्व भूतेषु\nशक्ति रूपेण संस्थिता\nनमस्तस्यै नमस्तस्यै\nनमस्तस्यै नमो नमः\n\nया देवी सर्व भूतेषु\nमातृ रूपेण संस्थिता\nनमस्तस्यै नमस्तस्यै\nनमस्तस्यै नमो नमः",
        translation: "Salutations to that Goddess who abides in all beings in the form of power. Salutations to Her, salutations to Her, salutations to Her, I bow again and again. Salutations to that Goddess who abides in all beings in the form of mother.",
        deity: "Durga",
        emojiCounts: { "🙏": 62, "❤️": 48, "🌟": 55 }
      },
      {
        id: "fri-6",
        day: "Friday",
        category: "Vrat Vidhi",
        title: "Santoshi Mata Vrat Vidhi",
        textEnglish: "FRIDAY FAST PROCEDURE:\n\n1. Wake up early and take a purifying bath\n2. Wear clean, preferably red or yellow clothes\n3. Set up altar with Santoshi Mata image\n4. Light 16 earthen lamps (diyas) with mustard oil\n5. Offer red flowers (red roses, hibiscus)\n6. Prepare offering of gur (jaggery) and chana (roasted chickpeas)\n7. Avoid all sour foods completely during the day\n8. Chant 'Jai Santoshi Maa' 108 times\n9. Read or listen to Santoshi Mata Vrat Katha\n10. Fast completely - no grains, salt, or regular meals\n11. Strictly avoid sour items like lemon, tamarind, pickles\n12. Break fast after sunset with gur-chana prasad\n13. Feed gur-chana to 8 young girls if possible\n14. Continue for 16 consecutive Fridays for complete benefit\n\nBENEFITS: Brings family harmony, contentment, fulfills desires, removes domestic troubles, and grants marital happiness.",
        textHindi: "संतोषी माता व्रत विधि:\n\n१. सुबह जल्दी उठकर शुद्धीकरण स्नान करें\n२. स्वच्छ, अधिमानतः लाल या पीले वस्त्र पहनें\n३. संतोषी माता की मूर्ति के साथ वेदी सजाएं\n४. सरसों के तेल से १६ मिट्टी के दीपक जलाएं\n५. लाल फूल (लाल गुलाब, जवाकुसुम) चढ़ाएं\n६. गुड़ और चना (भुना हुआ) का भोग तैयार करें\n७. दिन भर सभी खट्टे खाद्य पदार्थों से पूर्णतः बचें\n८. 'जय संतोषी माँ' का १०८ बार जाप करें\n९. संतोषी माता व्रत कथा पढ़ें या सुनें\n१०. पूर्ण उपवास - अनाज, नमक या नियमित भोजन नहीं\n११. नींबू, इमली, अचार जैसी खट्टी चीजों से सख्त परहेज\n१२. सूर्यास्त के बाद गुड़-चने के प्रसाद से व्रत तोड़ें\n१३. यदि संभव हो तो ८ कुमारी कन्याओं को गुड़-चना खिलाएं\n१४. पूर्ण लाभ के लिए लगातार १६ शुक्रवार तक जारी रखें\n\nलाभ: पारिवारिक सामंजस्य, संतुष्टि, इच्छा पूर्ति, घरेलू समस्याओं का निवारण और वैवाहिक सुख प्रदान करता है।",
        translation: "Complete procedure for observing Santoshi Mata's Friday fast for family harmony and contentment.",
        deity: "Santoshi Maa",
        emojiCounts: { "🙏": 50, "❤️": 38, "🌟": 44 }
      },
      {
        id: "fri-7",
        day: "Friday",
        category: "Extras",
        title: "Significance of Red Flowers",
        textEnglish: "RED FLOWERS - SYMBOLS OF DIVINE FEMININE POWER\n\nRed flowers hold immense significance in Friday worship, particularly for Goddess Lakshmi, Santoshi Maa, and Durga.\n\nSPIRITUAL SIGNIFICANCE:\n• Red represents divine feminine energy (Shakti)\n• Symbolizes passion, love, and devotion\n• Associated with prosperity and abundance\n• Represents courage, strength, and protection\n• Color of blood - life force and vitality\n• Connected to Mars energy - power and determination\n\nWHY RED ON FRIDAYS:\n• Friday is ruled by Venus, planet of love and beauty\n• Red flowers please the Divine Mother\n• Represents the fierce protective aspect of goddesses\n• Attracts love, prosperity, and family harmony\n• Enhances feminine power and grace\n• Brings passion and enthusiasm in life\n\nRED FLOWER OFFERINGS:\n• Roses: Symbol of pure love and devotion\n• Hibiscus (Japa): Sacred to all goddesses\n• Red Lotus: Divine beauty and purity\n• Carnations: Deep affection and admiration\n• Red Marigolds: Prosperity and abundance\n• Poppies: Peaceful sleep and comfort\n\nBENEFITS OF RED FLOWERS:\n• Strengthens relationships and marriages\n• Attracts abundance and prosperity\n• Enhances beauty and charm\n• Provides protection from negative energies\n• Increases confidence and courage\n• Brings success in endeavors\n• Creates loving family atmosphere\n\nDECORATION GUIDELINES:\n• Use 16 red flowers for Santoshi Mata\n• Arrange in beautiful patterns around deity\n• Mix with yellow flowers for Lakshmi worship\n• Create garlands for special occasions\n• Float flowers in water bowls\n• Scatter petals during aarti\n\nSCRIPTURAL REFERENCE:\nIn the Devi Bhagavata Purana, it's mentioned that red flowers are especially dear to the Divine Mother and offering them on Fridays brings her immediate blessings and fulfillment of desires.\n\nRed flowers create a powerful spiritual vibration that awakens the divine feminine energy within us and connects us to the nurturing, protective power of the Universal Mother.",
        textHindi: "लाल फूल - दिव्य स्त्री शक्ति के प्रतीक\n\nशुक्रवार की पूजा में लाल फूलों का अत्यधिक महत्व है, विशेषकर देवी लक्ष्मी, संतोषी माँ और दुर्गा के लिए।\n\nआध्यात्मिक महत्व:\n• लाल रंग दिव्य स्त्री ऊर्जा (शक्ति) का प्रतीक है\n• जुनून, प्रेम और भक्ति का प्रतीक है\n• समृद्धि और प्रचुरता से जुड़ा है\n• साहस, शक्ति और सुरक्षा का प्रतिनिधित्व करता है\n• रक्त का रंग - जीवन शक्ति और उत्साह\n• मंगल ऊर्जा से जुड़ा - शक्ति और दृढ़ संकल्प\n\nशुक्रवार को लाल रंग क्यों:\n• शुक्रवार शुक्र ग्रह द्वारा शासित है, प्रेम और सुंदरता का ग्रह\n• लाल फूल दिव्य माता को प्रसन्न करते हैं\n• देवियों के उग्र सुरक्षात्मक पहलू का प्रतिनिधित्व\n• प्रेम, समृद्धि और पारिवारिक सामंजस्य आकर्षित करता है\n• स्त्री शक्ति और अनुग्रह बढ़ाता है\n• जीवन में जुनून और उत्साह लाता है\n\nलाल फूलों के अर्पण:\n• गुलाब: शुद्ध प्रेम और भक्ति का प्रतीक\n• जवाकुसुम (जपा): सभी देवियों के लिए पवित्र\n• लाल कमल: दिव्य सुंदरता और पवित्रता\n• कार्नेशन: गहरा स्नेह और प्रशंसा\n• लाल गेंदा: समृद्धि और प्रचुरता\n• खसखस: शांतिपूर्ण नींद और आराम\n\nलाल फूलों के लाभ:\n• रिश्तों और विवाह को मजबूत बनाता है\n• प्रचुरता और समृद्धि आकर्षित करता है\n• सुंदरता और आकर्षण बढ़ाता है\n• नकारात्मक ऊर्जाओं से सुरक्षा प्रदान करता है\n• आत्मविश्वास और साहस बढ़ाता है\n• प्रयासों में सफलता लाता है\n• प्रेमपूर्ण पारिवारिक वातावरण बनाता है\n\nसजावट दिशानिर्देश:\n• संतोषी माता के लिए १६ लाल फूल उपयोग करें\n• देवता के चारों ओर सुंदर पैटर्न में व्यवस्थित करें\n• लक्ष्मी पूजा के लिए पीले फूलों के साथ मिलाएं\n• विशेष अवसरों के लिए माला बनाएं\n• पानी के कटोरे में फूल तैराएं\n• आरती के दौरान पंखुड़ियां बिखेरें\n\nशास्त्रीय संदर्भ:\nदेवी भागवत पुराण में उल्लेख है कि लाल फूल दिव्य माता को विशेष रूप से प्रिय हैं और शुक्रवार को इन्हें अर्पित करने से उनकी तत्काल कृपा और इच्छाओं की पूर्ति होती है।\n\nलाल फूल एक शक्तिशाली आध्यात्मिक कंपन पैदा करते हैं जो हमारे भीतर दिव्य स्त्री ऊर्जा को जगाता है और हमें सार्वभौमिक माता की पोषणकारी, सुरक्षात्मक शक्ति से जोड़ता है।",
        translation: "Complete guide to the spiritual significance of red flowers in Friday goddess worship and their divine benefits.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 46, "❤️": 38, "🌟": 42 }
      },
      {
        id: "fri-8",
        day: "Friday",
        category: "Extras",
        title: "Lighting 16 Diyas Significance",
        textEnglish: "SIXTEEN DIYAS - ILLUMINATING THE PATH TO PROSPERITY\n\nLighting 16 diyas (earthen lamps) on Fridays holds profound spiritual significance in goddess worship.\n\nSIGNIFICANCE OF NUMBER 16:\n• Represents completeness and wholeness\n• 16 phases of the moon (lunar calendar significance)\n• 16 Sanskrit vowels - complete divine sound\n• Age of divine perfection (16 years - Shodashi)\n• 16 petals of Anahata (heart) chakra\n• Symbol of fullness and abundance\n\nSPIRITUAL MEANING:\n• Light represents knowledge dispelling ignorance\n• Each diya removes different types of darkness\n• Fire element purifies and transforms\n• Represents the divine feminine light (Jyoti)\n• Creates positive vibrations and energy\n• Symbolizes hope and guidance\n\nBENEFITS OF 16 DIYAS:\n• Removes 16 types of negative influences\n• Attracts abundance and prosperity\n• Illuminates the path to success\n• Brings clarity to confused minds\n• Protects from evil eye and negativity\n• Enhances spiritual awareness\n• Creates sacred space for worship\n\nPROPER RITUAL:\n1. Use mustard oil or sesame oil\n2. Place diyas in circular pattern around deity\n3. Light them clockwise starting from east\n4. Keep them burning throughout the puja\n5. Pray for removal of darkness from all aspects of life\n6. Let them burn out naturally if possible\n7. Dispose of oil and wicks respectfully\n\nBEST LOCATIONS:\n• Around the main deity image\n• At entrance of home for protection\n• In corners to remove negative energy\n• Near Tulsi plant for extra blessings\n• On window sills to invite prosperity\n• In puja room for continuous divine presence\n\nSPECIAL OCCASIONS:\n• Every Friday for Santoshi Mata worship\n• During Navratri and Diwali festivals\n• On new moon days for extra purification\n• During difficult times for divine intervention\n• Before starting new ventures\n• During family celebrations and ceremonies\n\nThe tradition of lighting 16 diyas creates a powerful spiritual atmosphere that attracts divine blessings, removes obstacles, and fills the environment with positive energy and divine grace.",
        textHindi: "सोलह दीपक - समृद्धि के मार्ग को प्रकाशित करना\n\nशुक्रवार को १६ दीपक (मिट्टी के दीए) जलाना देवी पूजा में गहरा आध्यात्मिक महत्व रखता है।\n\nसंख्या १६ का महत्व:\n• पूर्णता और संपूर्णता का प्रतिनिधित्व\n• चंद्रमा की १६ कलाएं (चंद्र कैलेंडर का महत्व)\n• १६ संस्कृत स्वर - पूर्ण दिव्य ध्वनि\n• दिव्य पूर्णता की आयु (१६ वर्ष - षोडशी)\n• अनाहत (हृदय) चक्र की १६ पंखुड़ियां\n• पूर्णता और प्रचुरता का प्रतीक\n\nआध्यात्मिक अर्थ:\n• प्रकाश अज्ञानता को दूर करने वाले ज्ञान का प्रतीक है\n• प्रत्येक दीपक विभिन्न प्रकार के अंधकार को दूर करता है\n• अग्नि तत्व शुद्ध करता है और रूपांतरित करता है\n• दिव्य स्त्री प्रकाश (ज्योति) का प्रतिनिधित्व\n• सकारात्मक कंपन और ऊर्जा पैदा करता है\n• आशा और मार्गदर्शन का प्रतीक है\n\n१६ दीपकों के लाभ:\n• १६ प्रकार के नकारात्मक प्रभावों को दूर करता है\n• प्रचुरता और समृद्धि आकर्षित करता है\n• सफलता के मार्ग को प्रकाशित करता है\n• भ्रमित मन में स्पष्टता लाता है\n• बुरी नजर और नकारात्मकता से सुरक्षा करता है\n• आध्यात्मिक जागरूकता बढ़ाता है\n• पूजा के लिए पवित्र स्थान बनाता है\n\nउचित अनुष्ठान:\n१. सरसों का तेल या तिल का तेल उपयोग करें\n२. देवता के चारों ओर वृत्ताकार पैटर्न में दीपक रखें\n३. पूर्व दिशा से शुरू करके दक्षिणावर्त जलाएं\n४. पूरी पूजा के दौरान उन्हें जलता रखें\n५. जीवन के सभी पहलुओं से अंधकार हटाने की प्रार्थना करें\n६. यदि संभव हो तो उन्हें प्राकृतिक रूप से बुझने दें\n७. तेल और बत्ती का सम्मानपूर्वक निपटान करें\n\nसर्वोत्तम स्थान:\n• मुख्य देवता की मूर्ति के चारों ओर\n• सुरक्षा के लिए घर के प्रवेश द्वार पर\n• नकारात्मक ऊर्जा हटाने के लिए कोनों में\n• अतिरिक्त आशीर्वाद के लिए तुलसी के पौधे के पास\n• समृद्धि आमंत्रित करने के लिए खिड़की की चौखटों पर\n• निरंतर दिव्य उपस्थिति के लिए पूजा कक्ष में\n\nविशेष अवसर:\n• संतोषी माता पूजा के लिए हर शुक्रवार\n• नवरात्रि और दिवाली त्योहारों के दौरान\n• अतिरिक्त शुद्धीकरण के लिए अमावस्या के दिन\n• कठिन समय में दिव्य हस्तक्षेप के लिए\n• नए उद्यम शुरू करने से पहले\n• पारिवारिक उत्सव और समारोह के दौरान\n\n१६ दीपक जलाने की परंपरा एक शक्तिशाली आध्यात्मिक वातावरण बनाती है जो दिव्य आशीर्वाद आकर्षित करती है, बाधाओं को दूर करती है, और वातावरण को सकारात्मक ऊर्जा और दिव्य कृपा से भर देती है।",
        translation: "Complete guide to the spiritual significance of lighting 16 diyas on Fridays and their divine benefits.",
        deity: "Santoshi Maa",
        emojiCounts: { "🙏": 44, "❤️": 36, "🌟": 40 }
      },

      // SATURDAY - Lord Shani/Hanuman/Kal Bhairav Worship (Complete Categories)
      {
        id: "sat-1",
        day: "Saturday",
        category: "Mantras",
        title: "Shani Maha Mantra",
        textEnglish: "Om Sham Shanaischaraya Namaha\nOm Sham Shanaischaraya Namaha\nOm Sham Shanaischaraya Namaha\nOm Sham Shanaischaraya Namaha",
        textHindi: "ॐ शं शनैश्चराय नमः\nॐ शं शनैश्चराय नमः\nॐ शं शनैश्चराय नमः\nॐ शं शनैश्चराय नमः",
        translation: "I bow to Lord Shani, the slow-moving planet, who teaches patience, justice, and the consequences of our actions.",
        deity: "Shani",
        emojiCounts: { "🙏": 45, "❤️": 28, "🌟": 36 }
      },
      {
        id: "sat-1b",
        day: "Saturday",
        category: "Mantras",
        title: "Hanuman Mantra (Saturday)",
        textEnglish: "Om Namo Hanumate Namah\nOm Namo Hanumate Namah\nOm Namo Hanumate Namah\nOm Namo Hanumate Namah",
        textHindi: "ॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः\nॐ नमो हनुमते नमः",
        translation: "I bow to Lord Hanuman, the divine protector who grants strength, courage, and removes all obstacles and negative influences.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 48, "❤️": 32, "🌟": 40 }
      },
      {
        id: "sat-2",
        day: "Saturday",
        category: "Chalisas",
        title: "Shani Chalisa",
        textEnglish: "Jai Jai Shri Shanidev Data\nKaraj Karo Hamaara\nJaaso Mangal Kali Ghadi\nTaaso Kahe Suvikara\n\nChaaya Putra Param Tumhara\nSurya Ki Aankh Sitaara\nNitya Dharma Path Par Chalne\nKo Sukh Sampati Ka Dwara",
        textHindi: "जय जय श्री शनिदेव दाता\nकारज करो हमारा\nजाशो मंगल काली घड़ी\nताशो कहे सुविकारा\n\nछाया पुत्र परम तुम्हारा\nसूर्य की आँख सितारा\nनित्य धर्म पथ पर चलने\nको सुख संपत्ति का द्वारा",
        translation: "Victory to Lord Shani, the great giver, accomplish our tasks. Even the inauspicious dark moments become auspicious by your grace. O supreme son of Chhaya (shadow), the pupil in Sun's eye, for those who walk on the righteous path daily, you are the doorway to happiness and prosperity.",
        deity: "Shani",
        emojiCounts: { "🙏": 52, "❤️": 35, "🌟": 44 }
      },
      {
        id: "sat-3",
        day: "Saturday",
        category: "Aartis",
        title: "Aarti Shani Dev",
        textEnglish: "Aarti Kari Shanidev Ki\nJo Koi Shish Niwaye\nTa Par Kripa Tumhari Hui\nSab Sankat Mit Jaye\n\nShanidev Sharanagat Aaye\nTera Darshan Paye\nNij Kar Mein Dandi Liye\nKaal Ko Harani Aaye",
        textHindi: "आरती करी शनिदेव की\nजो कोई शीश निवाये\nता पर कृपा तुम्हारी हुई\nसब संकट मिट जाये\n\nशनिदेव शरणागत आये\nतेरा दर्शन पाये\nनिज कर में डंडी लिये\nकाल को हरणी आये",
        translation: "We perform aarti of Shani Dev, whoever bows their head receives your grace and all troubles are removed. We come seeking refuge with Shani Dev, to receive your darshan. With staff in your hand, you come to remove the effects of time and destiny.",
        deity: "Shani",
        emojiCounts: { "🙏": 48, "❤️": 30, "🌟": 38 }
      },
      {
        id: "sat-4",
        day: "Saturday",
        category: "Kathas",
        title: "Shanivar Vrat Katha",
        textEnglish: "Once there lived a blacksmith who was experiencing severe hardships due to the unfavorable period of Shani (Sade Sati). His business was failing, family members were falling ill, and debts were mounting. An elderly sage advised him to observe the Saturday fast (Shanivar Vrat) dedicated to Lord Shani with complete devotion.\n\nEvery Saturday, the blacksmith would wake up before dawn, bathe, wear black or dark blue clothes, and visit the Shani temple. He would light a mustard oil lamp, offer black til (sesame seeds), black urad dal, and iron items to Lord Shani. He would also feed crows with rice and bread, believing them to be messengers of Shani.\n\nDuring his worship, he would pray: 'O Lord Shani, you are the teacher of justice and patience. Please reduce the intensity of your testing period and grant me strength to bear the challenges with wisdom.' He continued this practice with unwavering faith for several months.\n\nSlowly, the devastating effects of Shani's influence began to diminish. His business started recovering, family health improved, and unexpected help came from various sources. He realized that Shani Dev was not his enemy but a strict teacher who was helping him burn his past negative karma.\n\nOne Saturday, while feeding crows near the Peepal tree, he met another devotee who offered him a partnership in a metalwork business. This collaboration brought him unprecedented success and prosperity. He understood that his sincere devotion and patience had pleased Lord Shani.\n\nThe blacksmith continued his Saturday worship throughout his life, always helping others who were going through difficult Shani periods. His story teaches us that with patience, devotion, and righteous conduct, even the most challenging planetary influences can be transformed into blessings.",
        textHindi: "एक बार एक लोहार था जो शनि की प्रतिकूल अवधि (साढ़े साती) के कारण गंभीर कठिनाइयों का सामना कर रहा था। उसका व्यापार असफल हो रहा था, परिवार के सदस्य बीमार पड़ रहे थे, और कर्ज बढ़ रहे थे। एक वृद्ध संत ने उसे सलाह दी कि वह पूर्ण भक्ति के साथ भगवान शनि को समर्पित शनिवार का व्रत करे।\n\nहर शनिवार को लोहार भोर से पहले उठता, स्नान करता, काले या गहरे नीले वस्त्र पहनता और शनि मंदिर जाता। वह सरसों का तेल दीपक जलाता, भगवान शनि को काले तिल, काले उड़द दाल और लोहे की वस्तुएं अर्पित करता। वह कौवों को चावल और रोटी खिलाता भी था, उन्हें शनि का संदेशवाहक मानकर।\n\nअपनी पूजा के दौरान वह प्रार्थना करता: 'हे भगवान शनि, आप न्याय और धैर्य के शिक्षक हैं। कृपया अपनी परीक्षा अवधि की तीव्रता कम करें और मुझे बुद्धि के साथ चुनौतियों को सहन करने की शक्ति दें।' उसने कई महीनों तक अटूट श्रद्धा के साथ यह अभ्यास जारी रखा।\n\nधीरे-धीरे शनि के प्रभाव के विनाशकारी प्रभाव कम होने लगे। उसका व्यापार ठीक होने लगा, पारिवारिक स्वास्थ्य में सुधार हुआ, और विभिन्न स्रोतों से अप्रत्याशित सहायता आई। उसे एहसास हुआ कि शनि देव उसके शत्रु नहीं बल्कि एक कड़े शिक्षक थे जो उसके पिछले नकारात्मक कर्म जलाने में मदद कर रहे थे।\n\nएक शनिवार को पीपल के पेड़ के पास कौवों को खाना खिलाते समय, उसकी मुलाकात एक अन्य भक्त से हुई जिसने उसे धातु के काम के व्यापार में साझेदारी का प्रस्ताव दिया। इस सहयोग ने उसे अभूतपूर्व सफलता और समृद्धि दिलाई। उसे समझ आया कि उसकी सच्ची भक्ति और धैर्य ने भगवान शनि को प्रसन्न कर दिया था।\n\nलोहार ने अपने जीवन भर शनिवार की पूजा जारी रखी, हमेशा उन लोगों की मदद की जो कठिन शनि काल से गुजर रहे थे। उसकी कहानी हमें सिखाती है कि धैर्य, भक्ति और धर्मनिष्ठ आचरण के साथ, सबसे चुनौतीपूर्ण ग्रहों के प्रभाव को भी आशीर्वाद में बदला जा सकता है।",
        translation: "The story of how Saturday fasting and devotion to Lord Shani transforms difficult planetary influences into blessings through patience and righteousness.",
        deity: "Shani",
        emojiCounts: { "🙏": 40, "❤️": 28, "🌟": 34 }
      },
      {
        id: "sat-5",
        day: "Saturday",
        category: "Stotrams",
        title: "Shani Stotra by Dashrath",
        textEnglish: "Konastha Pingalo Babhrur\nKrishnango Raudro Antako\nYama Souri Shani Krurah\nPippaladenasutah Priyah\n\nSanaischaraya VidMahe\nSooryaputraya Dheemahi\nTanno Mandah Prachodayat\nShani Shanaischaraya Namah",
        textHindi: "कोणस्थ पिंगलो बभ्रुः\nकृष्णांगो रौद्रो अन्तकः\nयमः सौरिः शनिः क्रूरः\nपिप्पलादेनसुतः प्रियः\n\nशनैश्चराय विद्महे\nसूर्यपुत्राय धीमहि\nतन्नो मन्दः प्रचोदयात्\nशनि शनैश्चराय नमः",
        translation: "Dwelling in corners, tawny, reddish-brown, dark-bodied, fierce destroyer, Yama, son of Sun, Shani the stern, dear son of sage Pippalada. We know Shani the slow-moving one, we meditate upon the son of Sun, may that slow-moving one inspire us. Salutations to Shani, the slow-moving planet.",
        deity: "Shani",
        emojiCounts: { "🙏": 58, "❤️": 40, "🌟": 49 }
      },
      {
        id: "sat-6",
        day: "Saturday",
        category: "Vrat Vidhi",
        title: "Shanivar Vrat Vidhi",
        textEnglish: "SATURDAY FAST PROCEDURE:\n\n1. Wake up before sunrise and take a purifying bath\n2. Wear black, dark blue, or dark-colored clothes\n3. Set up altar with Shani Dev and Hanuman images\n4. Light mustard oil lamp or sesame oil diya\n5. Offer black til (sesame seeds) and black urad dal\n6. Offer iron items like nails, horse shoe, or black stone\n7. Present blue or black flowers (if available)\n8. Chant 'Om Sham Shanaischaraya Namaha' 108 times\n9. Recite Shani Chalisa or Shani Stotra\n10. Fast completely or eat only once after sunset\n11. Avoid milk products, sweet items during fast\n12. Feed crows with rice, bread, or leftover food\n13. Worship Peepal tree by offering water\n14. Donate black items to poor (clothes, blankets, food)\n15. Break fast with simple vegetarian meal\n\nBENEFITS: Reduces negative effects of Shani, brings patience, justice, removes legal troubles, grants stability, and transforms challenges into wisdom.",
        textHindi: "शनिवार व्रत विधि:\n\n१. सूर्योदय से पहले उठकर शुद्धीकरण स्नान करें\n२. काले, गहरे नीले या गहरे रंग के वस्त्र पहनें\n३. शनि देव और हनुमान की मूर्तियों के साथ वेदी सजाएं\n४. सरसों का तेल या तिल के तेल का दीपक जलाएं\n५. काले तिल और काले उड़द दाल अर्पित करें\n६. लोहे की वस्तुएं जैसे कील, घोड़े की नाल या काला पत्थर चढ़ाएं\n७. नीले या काले फूल अर्पित करें (यदि उपलब्ध हो)\n८. 'ॐ शं शनैश्चराय नमः' का १०८ बार जाप करें\n९. शनि चालीसा या शनि स्तोत्र का पाठ करें\n१०. पूर्ण उपवास रखें या सूर्यास्त के बाद केवल एक बार भोजन करें\n११. व्रत के दौरान दूध उत्पाद, मीठी वस्तुओं से बचें\n१२. कौवों को चावल, रोटी या बचा हुआ भोजन खिलाएं\n१३. पीपल के पेड़ की पूजा करें और जल अर्पित करें\n१४. गरीबों को काली वस्तुएं दान करें (वस्त्र, कंबल, भोजन)\n१५. सादे शाकाहारी भोजन से व्रत तोड़ें\n\nलाभ: शनि के नकारात्मक प्रभावों को कम करता है, धैर्य लाता है, न्याय दिलाता है, कानूनी समस्याओं को दूर करता है, स्थिरता प्रदान करता है, और चुनौतियों को ज्ञान में बदल देता है।",
        translation: "Complete procedure for observing Saturday fast dedicated to Lord Shani for reducing negative planetary influences and gaining wisdom.",
        deity: "Shani",
        emojiCounts: { "🙏": 50, "❤️": 34, "🌟": 42 }
      },
      {
        id: "sat-7",
        day: "Saturday",
        category: "Extras",
        title: "Peepal Tree Worship",
        textEnglish: "PEEPAL TREE - SACRED ABODE OF DIVINE ENERGIES\n\nPeepal tree (Ficus religiosa) holds immense significance in Saturday worship, particularly for Lord Shani and spiritual practices.\n\nSPIRITUAL SIGNIFICANCE:\n• Considered the most sacred tree in Hinduism\n• Believed to be the dwelling of Lord Vishnu, Brahma, and Shiva\n• Associated with Lord Buddha's enlightenment\n• Connected to Shani Dev and planetary influences\n• Represents longevity, wisdom, and spiritual growth\n• Releases maximum oxygen, purifying the environment\n\nSATURDAY CONNECTION:\n• Shani Dev is said to reside in Peepal trees\n• Worshipping on Saturdays reduces Shani's negative effects\n• Tree worship on this day multiplies spiritual benefits\n• Helps in overcoming obstacles and legal troubles\n• Provides protection from negative planetary influences\n• Enhances patience and wisdom\n\nWORSHIP RITUALS:\n1. Visit Peepal tree early morning on Saturday\n2. Circumambulate the tree 7 times clockwise\n3. Offer water to the roots while chanting mantras\n4. Tie sacred thread (Kalava) around the trunk\n5. Light mustard oil lamp near the tree\n6. Offer black til (sesame seeds) and flowers\n7. Pray for removal of obstacles and negative influences\n8. Touch the tree with reverence and seek blessings\n\nTRADITIONAL PRACTICES:\n• Pour water mixed with black til on roots\n• Offer rice and food items to birds and animals\n• Light incense sticks near the tree\n• Place iron items or coins as offerings\n• Meditate under the tree for spiritual benefits\n• Donate food or clothes to needy near the tree\n\nBENEFITS:\n• Reduces malefic effects of Saturn (Shani)\n• Brings patience and endurance\n• Resolves legal and property disputes\n• Provides mental peace and stability\n• Enhances spiritual awareness\n• Protects from enemies and negative energies\n• Grants longevity and good health\n• Improves karmic balance\n\nSCIENTIFIC BENEFITS:\n• Releases oxygen even at night\n• Purifies air and environment\n• Provides shade and cooling effect\n• Natural air purifier and stress reliever\n• Helps in respiratory health\n• Creates positive ions in atmosphere\n\nSCRIPTURAL REFERENCE:\nIn the Skanda Purana, it's mentioned that worshipping the Peepal tree on Saturdays with devotion can neutralize even the most severe planetary afflictions and grant divine protection.\n\nThe Peepal tree serves as a bridge between the earthly and divine realms, making it an powerful ally in spiritual practice and planetary remedies.",
        textHindi: "पीपल का पेड़ - दिव्य ऊर्जाओं का पवित्र निवास\n\nपीपल का पेड़ (फाइकस रेलिजिओसा) शनिवार की पूजा में अत्यधिक महत्व रखता है, विशेषकर भगवान शनि और आध्यात्मिक प्रथाओं के लिए।\n\nआध्यात्मिक महत्व:\n• हिंदू धर्म में सबसे पवित्र पेड़ माना जाता है\n• भगवान विष्णु, ब्रह्मा और शिव का निवास स्थान माना जाता है\n• भगवान बुद्ध के ज्ञानप्राप्ति से जुड़ा है\n• शनि देव और ग्रहों के प्रभाव से संबंधित है\n• दीर्घायु, बुद्धि और आध्यात्मिक वृद्धि का प्रतीक है\n• अधिकतम ऑक्सीजन छोड़ता है, वातावरण को शुद्ध करता है\n\nशनिवार से संबंध:\n• शनि देव पीपल के पेड़ों में निवास करते हैं\n• शनिवार को पूजा करने से शनि के नकारात्मक प्रभाव कम होते हैं\n• इस दिन वृक्ष पूजा से आध्यात्मिक लाभ कई गुना बढ़ जाते हैं\n• बाधाओं और कानूनी समस्याओं से निपटने में मदद करता है\n• नकारात्मक ग्रहों के प्रभाव से सुरक्षा प्रदान करता है\n• धैर्य और बुद्धि बढ़ाता है\n\nपूजा अनुष्ठान:\n१. शनिवार को सुबह जल्दी पीपल के पेड़ के पास जाएं\n२. पेड़ की ७ बार दक्षिणावर्त परिक्रमा करें\n३. मंत्र जाप करते हुए जड़ों में जल अर्पित करें\n४. तने के चारों ओर पवित्र धागा (कलावा) बांधें\n५. पेड़ के पास सरसों का तेल दीपक जलाएं\n६. काले तिल और फूल अर्पित करें\n७. बाधाओं और नकारात्मक प्रभावों के निवारण की प्रार्थना करें\n८. श्रद्धा से पेड़ को स्पर्श करें और आशीर्वाद लें\n\nपारंपरिक अभ्यास:\n• जड़ों में काले तिल मिला पानी डालें\n• पक्षियों और जानवरों को चावल और भोजन अर्पित करें\n• पेड़ के पास अगरबत्ती जलाएं\n• लोहे की वस्तुएं या सिक्के अर्पण के रूप में रखें\n• आध्यात्मिक लाभ के लिए पेड़ के नीचे ध्यान करें\n• पेड़ के पास जरूरतमंदों को भोजन या वस्त्र दान करें\n\nलाभ:\n• शनि (शनि) के हानिकारक प्रभावों को कम करता है\n• धैर्य और सहनशीलता लाता है\n• कानूनी और संपत्ति विवादों का समाधान करता है\n• मानसिक शांति और स्थिरता प्रदान करता है\n• आध्यात्मिक जागरूकता बढ़ाता है\n• शत्रुओं और नकारात्मक ऊर्जाओं से सुरक्षा करता है\n• दीर्घायु और अच्छा स्वास्थ्य प्रदान करता है\n• कर्म संतुलन में सुधार करता है\n\nवैज्ञानिक लाभ:\n• रात में भी ऑक्सीजन छोड़ता है\n• हवा और वातावरण को शुद्ध करता है\n• छाया और शीतलता प्रदान करता है\n• प्राकृतिक वायु शुद्धीकरक और तनाव निवारक\n• श्वसन स्वास्थ्य में सहायक\n• वातावरण में सकारात्मक आयन बनाता है\n\nशास्त्रीय संदर्भ:\nस्कंद पुराण में उल्लेख है कि शनिवार को भक्ति के साथ पीपल के पेड़ की पूजा करने से सबसे गंभीर ग्रहों की पीड़ा भी शांत हो सकती है और दिव्य सुरक्षा मिल सकती है।\n\nपीपल का पेड़ पार्थिव और दिव्य क्षेत्रों के बीच एक सेतु का काम करता है, जो इसे आध्यात्मिक अभ्यास और ग्रह उपचार में एक शक्तिशाली सहयोगी बनाता है।",
        translation: "Complete guide to the sacred significance of Peepal tree worship on Saturdays and its benefits for planetary remedies.",
        deity: "Shani",
        emojiCounts: { "🙏": 48, "❤️": 36, "🌟": 42 }
      }
    ];

    sampleContents.forEach(content => {
      this.contents.set(content.id, content);
    });
  }

  async getContentByDay(day: string, language?: string): Promise<Content[]> {
    const dayContents = Array.from(this.contents.values()).filter(
      content => content.day === day
    );
    return dayContents;
  }

  async getContentByCategory(category: string, day: string, language?: string): Promise<Content[]> {
    const categoryContents = Array.from(this.contents.values()).filter(
      content => content.category === category && content.day === day
    );
    return categoryContents;
  }

  async getFeaturedContent(day: string): Promise<Content | undefined> {
    const dayContents = await this.getContentByDay(day);
    return dayContents[0]; // Return first content as featured
  }

  async getContentById(id: string): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async updateContentReaction(contentId: string, emoji: string): Promise<Content | undefined> {
    const content = this.contents.get(contentId);
    if (!content) return undefined;

    content.emojiCounts[emoji] = (content.emojiCounts[emoji] || 0) + 1;
    this.contents.set(contentId, content);
    return content;
  }

  async getCategoriesByDay(day: string): Promise<string[]> {
    const dayContents = await this.getContentByDay(day);
    const categories = Array.from(new Set(dayContents.map(content => content.category)));
    return categories.sort();
  }

  async createPrayer(insertPrayer: InsertPrayer): Promise<Prayer> {
    const id = randomUUID();
    const prayer: Prayer = {
      ...insertPrayer,
      id,
      emojiCounts: { "❤️": 0, "🌟": 0, "🙏": 0 },
      createdAt: new Date(),
    };
    this.prayers.set(id, prayer);
    return prayer;
  }

  async getPrayers(page = 1, limit = 10): Promise<Prayer[]> {
    const allPrayers = Array.from(this.prayers.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return allPrayers.slice(startIndex, endIndex);
  }

  async getPrayerById(id: string): Promise<Prayer | undefined> {
    return this.prayers.get(id);
  }

  async updatePrayerReaction(prayerId: string, emoji: string): Promise<Prayer | undefined> {
    const prayer = this.prayers.get(prayerId);
    if (!prayer) return undefined;

    prayer.emojiCounts[emoji] = (prayer.emojiCounts[emoji] || 0) + 1;
    this.prayers.set(prayerId, prayer);
    return prayer;
  }

  // Game methods
  async saveGameScore(gameScore: InsertGameScore): Promise<GameScore> {
    const id = randomUUID();
    const score: GameScore = {
      id,
      userId: gameScore.userId || null,
      score: gameScore.score || 0,
      level: gameScore.level || 1,
      blessingPoints: gameScore.blessingPoints || 0,
      streakDays: gameScore.streakDays || 0,
      lastPlayedDate: gameScore.lastPlayedDate || new Date(),
      createdAt: new Date(),
    };
    
    // Update existing user score or create new one
    if (gameScore.userId) {
      const existingScore = Array.from(this.gameScores.values())
        .find(s => s.userId === gameScore.userId);
      
      if (existingScore) {
        // Update existing score with higher values
        existingScore.score = Math.max(existingScore.score || 0, gameScore.score || 0);
        existingScore.level = Math.max(existingScore.level || 1, gameScore.level || 1);
        existingScore.blessingPoints = (existingScore.blessingPoints || 0) + (gameScore.blessingPoints || 0);
        existingScore.lastPlayedDate = new Date();
        this.gameScores.set(existingScore.id, existingScore);
        return existingScore;
      }
    }
    
    this.gameScores.set(id, score);
    return score;
  }

  async getUserGameStats(userId: string): Promise<GameScore | undefined> {
    return Array.from(this.gameScores.values())
      .find(score => score.userId === userId);
  }

  async updateUserStreak(userId: string): Promise<void> {
    const userScore = await this.getUserGameStats(userId);
    if (userScore) {
      const today = new Date();
      const lastPlayed = userScore.lastPlayedDate;
      
      if (lastPlayed) {
        const daysDiff = Math.floor((today.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          userScore.streakDays = (userScore.streakDays || 0) + 1;
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          userScore.streakDays = 1;
        }
        // Same day - no change to streak
      } else {
        userScore.streakDays = 1;
      }
      
      userScore.lastPlayedDate = today;
      this.gameScores.set(userScore.id, userScore);
    }
  }

  async getLeaderboard(limit = 10): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }

  async getGameLeaderboard(): Promise<any[]> {
    return Array.from(this.gameScores.values())
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10);
  }

  private initializeNewFeatures() {
    // Initialize Poojas
    this.poojas = [
      {
        id: "durga-pooja",
        name: "Durga Pooja",
        description: "Worship of Goddess Durga for strength and protection",
        imageUrl: "/api/placeholder/300/200",
        featured: 1,
        createdAt: new Date(),
      },
      {
        id: "lakshmi-pooja",
        name: "Lakshmi Pooja", 
        description: "Worship of Goddess Lakshmi for prosperity and wealth",
        imageUrl: "/api/placeholder/300/200",
        featured: 0,
        createdAt: new Date(),
      },
      {
        id: "ganesha-pooja",
        name: "Ganesha Pooja",
        description: "Worship of Lord Ganesha for removing obstacles",
        imageUrl: "/api/placeholder/300/200", 
        featured: 1,
        createdAt: new Date(),
      }
    ];

    // Initialize Pooja Content
    this.poojaContent = [
      {
        id: "durga-aarti-1",
        poojaId: "durga-pooja",
        type: "aarti",
        title: "Durga Aarti",
        textEnglish: "Jai Ambe Gauri, Maiya Jai Shyama Gauri\nTumko nisdin dhyavat, Hari Brahma Shivri\nMaiya jai jai...",
        textHindi: "जय अम्बे गौरी, मैया जय श्यामा गौरी\nतुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी\nमैया जय जय...",
        translation: "Victory to Mother Gauri, the fair-complexioned goddess...",
        order: 1,
        createdAt: new Date(),
      },
      {
        id: "durga-mantra-1", 
        poojaId: "durga-pooja",
        type: "mantra",
        title: "Durga Gayatri Mantra",
        textEnglish: "Om Katyayanyai Vidmahe Kanyakumari Dhimahi\nTanno Durgih Prachodayat",
        textHindi: "ॐ कात्यायन्यै विद्महे कन्याकुमारी धीमहि\nतन्नो दुर्गिः प्रचोदयात्",
        translation: "We meditate on Goddess Katyayani, who is in the form of Kanyakumari...",
        order: 1,
        createdAt: new Date(),
      }
    ];

    // Initialize Reels with authentic spiritual content
    this.reels = [
      {
        id: "reel-1",
        title: "Om Namah Shivaya - Sacred Chanting",
        description: "Divine chanting of Lord Shiva's mantra for inner peace and spiritual awakening",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "/api/placeholder/300/400", 
        duration: 75,
        views: 2840,
        likes: 156,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "reel-2", 
        title: "Ganga Aarti - Evening Prayer",
        description: "Sacred Ganga Aarti ceremony at the holy ghats, bringing divine blessings",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "/api/placeholder/300/400",
        duration: 90,
        views: 1967,
        likes: 203,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "reel-3",
        title: "Hanuman Chalisa - Powerful Devotion",
        description: "Recitation of Hanuman Chalisa for strength, courage and protection from all obstacles",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "/api/placeholder/300/400",
        duration: 180,
        views: 3245,
        likes: 287,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "reel-4",
        title: "Gayatri Mantra - Dawn Meditation",
        description: "Most sacred Gayatri Mantra chanting during sunrise for wisdom and enlightenment",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "/api/placeholder/300/400",
        duration: 108,
        views: 4156,
        likes: 321,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "reel-5",
        title: "Devi Durga Stotram - Divine Mother",
        description: "Powerful hymns dedicated to Goddess Durga for strength, protection and victory over evil",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "/api/placeholder/300/400",
        duration: 95,
        views: 2578,
        likes: 198,
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "reel-6",
        title: "Peaceful Temple Bell Meditation",
        description: "Soothing temple bells and Sanskrit chants for deep meditation and spiritual connection",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnailUrl: "/api/placeholder/300/400",
        duration: 120,
        views: 1834,
        likes: 142,
        isActive: 1,
        createdAt: new Date(),
      }
    ];

    // Initialize Community Posts
    this.communityPosts = [
      {
        id: "post-1",
        userId: null,
        content: "Om Namah Shivaya. Seeking blessings for my family's health and happiness.",
        isAnonymous: 1,
        upvotes: 12,
        type: "prayer",
        createdAt: new Date(),
      },
      {
        id: "post-2",
        userId: null, 
        content: "Grateful for all the divine grace in my life. May everyone find peace and joy.",
        isAnonymous: 1,
        upvotes: 8,
        type: "prayer",
        createdAt: new Date(),
      }
    ];
  }

  // Pooja operations
  async getPoojas(): Promise<any[]> {
    return this.poojas;
  }

  async getPoojaById(id: string): Promise<any> {
    return this.poojas.find(pooja => pooja.id === id);
  }

  async getPoojaContent(poojaId: string, type?: string): Promise<any[]> {
    let content = this.poojaContent.filter(item => item.poojaId === poojaId);
    if (type) {
      content = content.filter(item => item.type === type);
    }
    return content.sort((a, b) => a.order - b.order);
  }

  // Reels operations
  async getReels(): Promise<any[]> {
    return this.reels.filter(reel => reel.isActive === 1);
  }

  async incrementReelLikes(id: string): Promise<void> {
    const reel = this.reels.find(r => r.id === id);
    if (reel) {
      reel.likes++;
    }
  }

  async incrementReelViews(id: string): Promise<void> {
    const reel = this.reels.find(r => r.id === id);
    if (reel) {
      reel.views++;
    }
  }

  // Community operations
  async getCommunityPosts(page: number = 1, limit: number = 20): Promise<any[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.communityPosts.slice(startIndex, endIndex);
  }

  async createCommunityPost(post: any): Promise<any> {
    const newPost = {
      id: `post-${Date.now()}`,
      ...post,
      upvotes: 0,
      createdAt: new Date(),
    };
    this.communityPosts.unshift(newPost);
    return newPost;
  }

  async upvoteCommunityPost(id: string): Promise<void> {
    const post = this.communityPosts.find(p => p.id === id);
    if (post) {
      post.upvotes++;
    }
  }
}

export const storage = new MemStorage();
