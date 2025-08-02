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
}

export const storage = new MemStorage();
