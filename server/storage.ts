import { type Content, type InsertContent, type Prayer, type InsertPrayer } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private contents: Map<string, Content>;
  private prayers: Map<string, Prayer>;

  constructor() {
    this.contents = new Map();
    this.prayers = new Map();
    this.initializeContent();
  }

  private initializeContent() {
    // Initialize with comprehensive devotional content for all days and categories
    const sampleContents: Content[] = [
      // SUNDAY - Sun God Worship
      {
        id: "sun-1",
        day: "Sunday",
        category: "Mantras",
        title: "Surya Gayatri Mantra",
        textEnglish: "Om Bhaskaraya Vidmahe\nMahadyutikaraya Dhimahi\nTanno Adityah Prachodayat",
        textHindi: "ॐ भास्कराय विद्महे\nमहाद्युतिकराय धीमहि\nतन्नो आदित्यः प्रचोदयात्",
        translation: "We know the brilliant Sun, we meditate on the great effulgent one, may the Sun God inspire our understanding.",
        deity: "Surya",
        emojiCounts: { "🙏": 15, "❤️": 8, "🌟": 12 }
      },
      {
        id: "sun-2",
        day: "Sunday",
        category: "Aartis",
        title: "Surya Aarti",
        textEnglish: "Om Jai Surya Bhagawan\nHara Sab Ko Klesh Santan\nPrakash Karo Jagat Mein\nHara Andhakar Jeevan Mein",
        textHindi: "ॐ जय सूर्य भगवान्\nहर सब को क्लेश संतान\nप्रकाश करो जगत में\nहर अंधकार जीवन में",
        translation: "Victory to Lord Sun! Remove all troubles and sorrows, illuminate the world, dispel darkness from life.",
        deity: "Surya",
        emojiCounts: { "🙏": 20, "❤️": 12, "🌟": 18 }
      },
      {
        id: "sun-3",
        day: "Sunday",
        category: "Stotrams",
        title: "Aditya Hridayam",
        textEnglish: "Aditya Hridayam Punyam\nSarva Shatru Vinashakam\nJayavaham Jape Nityam\nAkshayam Paramam Shivam",
        textHindi: "आदित्य हृदयं पुण्यं\nसर्व शत्रु विनाशकम्\nजयावहं जपे नित्यं\nअक्षयं परमं शिवम्",
        translation: "The sacred Aditya Hridayam destroys all enemies, brings victory when chanted daily, and grants eternal auspiciousness.",
        deity: "Surya",
        emojiCounts: { "🙏": 25, "❤️": 15, "🌟": 22 }
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
        title: "Shiv Chalisa",
        textEnglish: "Jai Girijapati Hridaya Harasha\nMatadamber Mana Kiye Prakasha\nRatna Jatit Shish Phani Rajit\nKshana Kshana Anand Adhik Sajit\n\nBhuj Chaturbhuj Ur Mani Maala\nKar Trishul Sobhit Bhaala\nSur Nara Muni Jan Sewat Taahi\nJag Janani Kripala Man Mahi",
        textHindi: "जै गिरिजापति हृदय हर्ष\nमातदम्बर मन कीये प्रकाश\nरत्न जटित शीश फणि राजित\nक्षण क्षण आनंद अधिक साजित\n\nभुज चतुर्भुज उर मणि माला\nकर त्रिशूल शोभित भाला\nसुर नर मुनि जन सेवत ताही\nजग जननि कृपाल मन माही",
        translation: "Hail to Lord of Parvati, joy of the heart, illuminating the mind like a mother's embrace, adorned with jewels in his matted hair with serpents, ever increasing in bliss moment by moment. Four-armed, with gem necklace on chest, trident in hand and glowing forehead, served by gods, humans and sages, the compassionate mother of the universe in the heart.",
        deity: "Shiva",
        emojiCounts: { "🙏": 35, "❤️": 25, "🌟": 28 }
      },
      {
        id: "mon-3",
        day: "Monday",
        category: "Aartis",
        title: "Om Jai Shiv Omkara",
        textEnglish: "Om Jai Shiv Omkara\nSwami Jai Shiv Omkara\nBrahma Vishnu Sadashiv\nArddhangee Dhara\nOm Jai Shiv Omkara\n\nEkanan Chaturanan Panchanan Rajai\nHansanan Garudasan Vrishvahan Sajai\nDo Bhuj Char Chaturbhuj Dus Bhuj Te Sohai\nTribhuvan Mein Ek Roop Hai Yahee Mohai",
        textHindi: "ॐ जय शिव ओंकारा\nस्वामी जय शिव ओंकारा\nब्रह्मा विष्णु सदाशिव\nअर्धांगी धारा\nॐ जय शिव ओंकारा\n\nएकानन चतुरानन पंचानन राजै\nहंसानन गरुड़ासन वृषवाहन साजै\nदो भुज चार चतुर्भुज दस भुज ते सोहै\nत्रिभुवन में एक रूप है यही मोहै",
        translation: "Victory to Lord Shiva, the embodiment of Om! Lord, victory to Shiva Om! Brahma, Vishnu, and eternal Shiva, the one who has Parvati as half his body. With one face, four faces, five faces they shine, with swan mount, eagle mount, bull mount they are adorned. With two arms, four arms, ten arms they appear beautiful, in the three worlds, this one form enchants all.",
        deity: "Shiva",
        emojiCounts: { "🙏": 42, "❤️": 32, "🌟": 38 }
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

      // TUESDAY - Hanuman Worship
      {
        id: "tue-1",
        day: "Tuesday",
        category: "Mantras",
        title: "Hanuman Beej Mantra",
        textEnglish: "Om Hanumate Namaha\nOm Anjaneya Namaha\nOm Mahabalaya Namaha\nOm Vira Hanumate Namaha",
        textHindi: "ॐ हनुमते नमः\nॐ आञ्जनेय नमः\nॐ महाबलाय नमः\nॐ वीर हनुमते नमः",
        translation: "I bow to Hanuman, son of Anjana, the mighty one, the brave Hanuman.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 40, "❤️": 30, "🌟": 35 }
      },
      {
        id: "tue-2",
        day: "Tuesday",
        category: "Chalisas",
        title: "Hanuman Chalisa",
        textEnglish: "Shri Guru Charan Saroj Raj\nNij Man Mukur Sudhari\nBarnau Raghubar Bimal Jasu\nJo Dayaku Phal Chari",
        textHindi: "श्रीगुरु चरन सरोज रज\nनिज मन मुकुर सुधारि\nबरनउं रघुबर बिमल जसु\nजो दायक फल चारि",
        translation: "With the dust of Guru's lotus feet, I clean the mirror of my mind and narrate the sacred glory of Sri Ram.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 50, "❤️": 40, "🌟": 45 }
      },
      {
        id: "tue-3",
        day: "Tuesday",
        category: "Kathas",
        title: "Hanuman Birth Story",
        textEnglish: "Long ago, Vayu, the wind god, fell in love with Anjana, a celestial apsara. Their union blessed the world with Hanuman, born with divine strength and unwavering devotion to Lord Rama. From childhood, Hanuman displayed extraordinary powers - he once leapt towards the sun thinking it was a fruit!",
        textHindi: "बहुत समय पहले, वायु देव का अंजना नामक अप्सरा से प्रेम हुआ। उनके मिलन से हनुमान का जन्म हुआ, जो दिव्य शक्ति और राम भक्ति से भरे थे। बचपन से ही हनुमान में असाधारण शक्तियां थीं - एक बार उन्होंने सूर्य को फल समझकर उसकी ओर छलांग लगाई थी!",
        translation: "The divine birth story of Hanuman and his extraordinary childhood displaying supernatural powers.",
        deity: "Hanuman",
        emojiCounts: { "🙏": 22, "❤️": 18, "🌟": 20 }
      },

      // WEDNESDAY - Ganesha & Krishna Worship
      {
        id: "wed-1",
        day: "Wednesday",
        category: "Mantras",
        title: "Ganesha Mantra",
        textEnglish: "Om Gam Ganapataye Namaha\nVakratunda Mahakaya\nSurya Koti Samaprabha\nNirvighnam Kuru Me Deva",
        textHindi: "ॐ गं गणपतये नमः\nवक्रतुण्ड महाकाय\nसूर्य कोटि समप्रभ\nनिर्विघ्नं कुरु मे देव",
        translation: "Om, I bow to Lord Ganesha. O curved-trunk, mighty-bodied one, with the brilliance of a million suns, please remove all obstacles from my path.",
        deity: "Ganesha",
        emojiCounts: { "🙏": 45, "❤️": 35, "🌟": 40 }
      },
      {
        id: "wed-2",
        day: "Wednesday",
        category: "Aartis",
        title: "Ganga Aarti",
        textEnglish: "Om Jai Gange Mata\nMaiya Jai Gange Mata\nJo Nar Tumko Dhyaata\nManokamana Paata",
        textHindi: "ॐ जय गंगे माता\nमैया जय गंगे माता\nजो नर तुमको ध्याता\nमनोकामना पाता",
        translation: "Victory to Mother Ganga! Those who meditate upon you, their heart's desires are fulfilled.",
        deity: "Ganga",
        emojiCounts: { "🙏": 38, "❤️": 25, "🌟": 32 }
      },

      // THURSDAY - Vishnu & Guru Worship
      {
        id: "thu-1",
        day: "Thursday",
        category: "Mantras",
        title: "Vishnu Mantra",
        textEnglish: "Om Namo Bhagavate Vasudevaya\nOm Narsimhaya Namaha\nOm Govindaya Namaha\nOm Madhavaya Namaha",
        textHindi: "ॐ नमो भगवते वासुदेवाय\nॐ नरसिंहाय नमः\nॐ गोविन्दाय नमः\nॐ माधवाय नमः",
        translation: "I bow to Lord Vasudeva, to Narasimha, to Govinda, to Madhav - all forms of Lord Vishnu.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 42, "❤️": 28, "🌟": 38 }
      },
      {
        id: "thu-2",
        day: "Thursday",
        category: "Stotrams",
        title: "Vishnu Sahasranama",
        textEnglish: "Vishvam Vishnur Vashatkaro\nBhuta-bhavya-bhavat-prabhuh\nBhutakrid Bhutabhrid Bhavo\nBhutatma Bhuta-bhavanah",
        textHindi: "विश्वं विष्णुर्वषट्कारो\nभूत-भव्य-भवत्-प्रभुः\nभूतकृद् भूतभृद् भावो\nभूतात्मा भूत-भावनः",
        translation: "The Universe, The All-Pervading, The Performer of Sacrifices, The Lord of Past, Present and Future.",
        deity: "Vishnu",
        emojiCounts: { "🙏": 55, "❤️": 45, "🌟": 50 }
      },

      // FRIDAY - Lakshmi & Devi Worship
      {
        id: "fri-1",
        day: "Friday",
        category: "Mantras",
        title: "Lakshmi Mantra",
        textEnglish: "Om Shreem Mahalakshmiyei Namaha\nOm Gam Shreem Gam Shreem\nGanapataye Shreem Namaha\nSarva Mangala Mangalye",
        textHindi: "ॐ श्रीं महालक्ष्म्यै नमः\nॐ गं श्रीं गं श्रीं\nगणपतये श्रीं नमः\nसर्व मंगल मांगल्ये",
        translation: "I bow to Goddess Mahalakshmi. Om, the auspicious one among all auspicious beings.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 48, "❤️": 35, "🌟": 42 }
      },
      {
        id: "fri-2",
        day: "Friday",
        category: "Aartis",
        title: "Lakshmi Aarti",
        textEnglish: "Om Jai Lakshmi Mata\nMaiya Jai Lakshmi Mata\nTumko Nisdin Dhyavat\nHara Vishnu Viridata",
        textHindi: "ॐ जय लक्ष्मी माता\nमैया जय लक्ष्मी माता\nतुमको निसदिन ध्यावत\nहर विष्णु विरिदाता",
        translation: "Victory to Mother Lakshmi! Day and night, Lord Vishnu and Lord Shiva meditate upon you.",
        deity: "Lakshmi",
        emojiCounts: { "🙏": 40, "❤️": 30, "🌟": 35 }
      },

      // SATURDAY - Shani Dev Worship
      {
        id: "sat-1",
        day: "Saturday",
        category: "Mantras",
        title: "Shani Mantra",
        textEnglish: "Om Sham Shanaischaraya Namaha\nNilanjana Samabhasam\nRavi Putram Yamagrajam\nChaya Martanda Sambhutam",
        textHindi: "ॐ शं शनैश्चराय नमः\nनीलांजन समाभासं\nरवि पुत्रं यमाग्रजम्\nछाया मार्तण्ड संभूतम्",
        translation: "I bow to Lord Shani, who appears like blue ointment, son of Sun god, elder brother of Yama, born from shadow and sun.",
        deity: "Shani",
        emojiCounts: { "🙏": 35, "❤️": 20, "🌟": 28 }
      },
      {
        id: "sat-2",
        day: "Saturday",
        category: "Stotrams",
        title: "Shani Stotra",
        textEnglish: "Konastha Pingalo Babhrur\nKrishnango Raudro Antako\nYama Souri Shani Krurah\nPippaladenasutah Priyah",
        textHindi: "कोणस्थ पिंगलो बभ्रुः\nकृष्णांगो रौद्रो अन्तकः\nयमः सौरिः शनिः क्रूरः\nपिप्पलादेनसुतः प्रियः",
        translation: "Dwelling in corners, tawny, reddish-brown, dark-bodied, fierce destroyer, Yama, son of Sun, Shani the stern, dear son of sage Pippalada.",
        deity: "Shani",
        emojiCounts: { "🙏": 25, "❤️": 15, "🌟": 20 }
      },

      // SATURDAY - Shani Dev Worship
      {
        id: "sat-1",
        day: "Saturday",
        category: "Mantras",
        title: "Shani Mantra",
        textEnglish: "Om Sham Shanaischaraya Namaha\nNilanjana Samabhasam\nRavi Putram Yamagrajam\nChaya Martanda Sambhutam",
        textHindi: "ॐ शं शनैश्चराय नमः\nनीलांजन समाभासं\nरवि पुत्रं यमाग्रजम्\nछाया मार्तण्ड संभूतम्",
        translation: "I bow to Lord Shani, who appears like blue ointment, son of Sun god, elder brother of Yama, born from shadow and sun.",
        deity: "Shani",
        emojiCounts: { "🙏": 35, "❤️": 20, "🌟": 28 }
      },
      {
        id: "sat-2",
        day: "Saturday",
        category: "Stotrams",
        title: "Shani Stotra",
        textEnglish: "Konastha Pingalo Babhrur\nKrishnango Raudro Antako\nYama Souri Shani Krurah\nPippaladenasutah Priyah",
        textHindi: "कोणस्थ पिंगलो बभ्रुः\nकृष्णांगो रौद्रो अन्तकः\nयमः सौरिः शनिः क्रूरः\nपिप्पलादेनसुतः प्रियः",
        translation: "Dwelling in corners, tawny, reddish-brown, dark-bodied, fierce destroyer, Yama, son of Sun, Shani the stern, dear son of sage Pippalada.",
        deity: "Shani",
        emojiCounts: { "🙏": 25, "❤️": 15, "🌟": 20 }
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
    const categories = [...new Set(dayContents.map(content => content.category))];
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
}

export const storage = new MemStorage();
