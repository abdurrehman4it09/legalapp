export interface CodexSectionItem {
  id: string;
  code: string;
  titleEn: string;
  titleUr: string;
  partOrChapter: string;
  plainSummaryEn: string;
  plainSummaryUr: string;
  verbatimTextEn: string;
  practicalRemedyEn: string;
  practicalRemedyUr: string;
}

export interface CourtJudgmentItem {
  id: string;
  citation: string;
  courtKey:
    | "SC"
    | "FSC"
    | "LHC"
    | "SHC"
    | "IHC"
    | "PHC"
    | "BHC";
  courtNameEn: string;
  courtNameUr: string;
  benchEn: string;
  dateDecided: string;
  subjectEn: string;
  subjectUr: string;
  headlineEn: string;
  headlineUr: string;
  ratioDecidendiEn: string;
  ratioDecidendiUr: string;
  fullOrderExcerptEn: string;
}

export interface LegalCareerOpening {
  id: string;
  roleTitleEn: string;
  roleTitleUr: string;
  organizationEn: string;
  organizationUr: string;
  city: string;
  cityUr: string;
  practiceArea: string;
  compensationPkr: string;
  engagementType: "Full-Time Chamber" | "Panel Advocate" | "Paid Fellowship" | "Corporate Retainer";
  barRequirement: string;
  descriptionEn: string;
  descriptionUr: string;
  responsibilitiesEn: string[];
}

export interface LegalAidNewsItem {
  id: string;
  slug: string;
  category: "Legal Aid Drive" | "Supreme Court Directive" | "Legislative Reform" | "Women & Overseas Protection";
  categoryUr: string;
  publishedDate: string;
  readTime: string;
  sourceAuthority: string;
  headlineEn: string;
  headlineUr: string;
  deckEn: string;
  deckUr: string;
  fullReportEn: string;
  fullReportUr: string;
  actionLink: string;
  actionLabelEn: string;
}

export const CONSTITUTION_ARTICLES: CodexSectionItem[] = [
  {
    id: "const-art-4",
    code: "Article 4",
    titleEn: "Right of Individuals to be Dealt with in Accordance with Law",
    titleUr: "ہر شہری کا قانون کے مطابق سلوک کیے جانے کا ناقابلِ تنسیخ حق",
    partOrChapter: "Part I · Introductory (Inalienable Magna Carta)",
    plainSummaryEn:
      "No police officer, government agency, or private person can force you to do anything the law does not require, nor stop you from doing anything the law permits. Even during an emergency, Article 4 cannot be suspended.",
    plainSummaryUr:
      "کسی بھی سرکاری افسر، پولیس یا ادارے کو اختیار نہیں کہ وہ قانون کی خلاف ورزی کرتے ہوئے کسی شہری کے جان، مال، آزادی یا عزت کو نقصان پہنچائے۔",
    verbatimTextEn:
      "Article 4(1): To enjoy the protection of law and to be treated in accordance with law is the inalienable right of every citizen, wherever he may be, and of every other person for the time being within Pakistan.",
    practicalRemedyEn:
      "Invoke Article 4 alongside Article 199 in a High Court Writ Petition whenever any executive official acts without written statutory authority.",
    practicalRemedyUr:
      "کسی بھی سرکاری محکمے کے غیر قانونی اقدام کے خلاف ہائی کورٹ میں آرٹیکل 4 اور 199 کے تحت رٹ دائر کریں۔",
  },
  {
    id: "const-art-9-10a",
    code: "Articles 9 & 10-A",
    titleEn: "Security of Person, Safeguards as to Arrest & Right to Fair Trial",
    titleUr: "شخصی آزادی کا تحفظ، گرفتاری کے ضوابط اور منصفانہ ٹرائل کا حق",
    partOrChapter: "Part II · Chapter 1: Fundamental Rights",
    plainSummaryEn:
      "No person may be deprived of life or liberty save in accordance with law. Every arrested citizen must be informed of the grounds of arrest, allowed to consult an advocate of their choice, produced before a Magistrate within 24 hours, and guaranteed a fair trial and due process.",
    plainSummaryUr:
      "گرفتاری کی صورت میں وجوہات جاننا، اپنی پسند کے وکیل سے مشورہ کرنا، 24 گھنٹے میں مجسٹریٹ کے سامنے پیشی اور منصفانہ ٹرائل ہر شہری کا بنیادی آئینی حق ہے۔",
    verbatimTextEn:
      "Article 10-A: For the determination of his civil rights and obligations or in any criminal charge against him a person shall be entitled to a fair trial and due process.",
    practicalRemedyEn:
      "If someone is detained beyond 24 hours without remand, file a Habeas Corpus petition under Section 491 CrPC or Article 199(1)(b)(i) before the Sessions or High Court.",
    practicalRemedyUr:
      "غیر قانونی حراست کی صورت میں فوری طور پر دفعہ 491 ضابطہ فوجداری یا ہائی کورٹ میں حبسِ بے جا کی پٹیشن دائر کریں۔",
  },
  {
    id: "const-art-23-24",
    code: "Articles 23 & 24",
    titleEn: "Constitutional Protection of Property & Lawful Inheritance",
    titleUr: "جائیداد کی ملکیت اور وراثتی حقوق کا آئینی تحفظ",
    partOrChapter: "Part II · Chapter 1: Fundamental Rights",
    plainSummaryEn:
      "Every citizen has the fundamental right to acquire, hold, and dispose of property in any part of Pakistan. No person can be compulsorily deprived of their property or inheritance share save in accordance with law and with lawful compensation.",
    plainSummaryUr:
      "پاکستان کے ہر حصے میں جائیداد خریدنے، رکھنے اور وراثتی حصے کے تحفظ کی ضمانت آئین دیتا ہے؛ کسی کو غیر قانونی طور پر جائیداد سے محروم نہیں کیا جا سکتا۔",
    verbatimTextEn:
      "Article 24(1): No person shall be deprived of his property save in accordance with law.",
    practicalRemedyEn:
      "Combine Article 24 with the Enforcement of Women's Property Rights Act 2020 or a Civil Suit for Declaration & Permanent Injunction.",
    practicalRemedyUr:
      "جائیداد پر ناجائز قبضے یا وراثت سے محرومی پر محتسب یا دیوانی عدالت سے فوری حکمِ امتناعی حاصل کریں۔",
  },
  {
    id: "const-art-199",
    code: "Article 199",
    titleEn: "Constitutional Writ Jurisdiction of the High Courts",
    titleUr: "ہائی کورٹ کا آئینی رِٹ دائرہ اختیار (آرٹیکل 199)",
    partOrChapter: "Part VII · The Judicature (High Courts)",
    plainSummaryEn:
      "Empowers the Lahore, Sindh, Islamabad, Peshawar, and Balochistan High Courts to strike down unlawful government orders, quash mala fide proceedings, produce illegally detained persons (Habeas Corpus), and enforce Fundamental Rights when no other adequate remedy exists.",
    plainSummaryUr:
      "جب کوئی سرکاری محکمہ یا افسر قانون سے تجاوز کرے اور کوئی فوری متبادل راستہ نہ ہو تو ہائی کورٹ آرٹیکل 199 کے تحت فوری حکم جاری کرنے کا اختیار رکھتی ہے۔",
    verbatimTextEn:
      "Article 199(1)(a): A High Court may, if it is satisfied that no other adequate remedy is provided by law, on the application of any aggrieved party, make an order directing a person performing functions in connection with the affairs of the Federation or a Province to refrain from doing anything he is not permitted by law to do.",
    practicalRemedyEn:
      "File a Constitutional Petition (W.P.) through a High Court Advocate with a sworn affidavit and certified copies of the impugned order.",
    practicalRemedyUr:
      "ہائی کورٹ کے وکیل کے ذریعے مصدقہ دستاویزات اور بیانِ حلفی کے ساتھ رٹ پٹیشن دائر کریں۔",
  },
];

export const PAKISTAN_LAWS_ARCHIVE: CodexSectionItem[] = [
  {
    id: "law-family-1964",
    code: "Act XXXV of 1964",
    titleEn: "Family Courts Act, 1964 (Dissolution, Maintenance, Dower & Custody)",
    titleUr: "فیملی کورٹس ایکٹ 1964 (خلع، نان و نفقہ، حق مہر اور حضانت)",
    partOrChapter: "Civil & Family Code · Sections 5, 10 & 17-A",
    plainSummaryEn:
      "Establishes specialized Family Courts where a wife or child can file a single composite suit for dissolution of marriage (Khula), recovery of Haq Mehr, dowry articles (Jahez), maintenance, and child custody—with mandatory interim maintenance fixed on the first appearance.",
    plainSummaryUr:
      "فیملی کورٹ میں خلع، حق مہر، جہیز کے سامان، بچوں کے خرچے (نان و نفقہ) اور حوالگی کا ایک ہی مشترکہ دعویٰ دائر کیا جا سکتا ہے جس کا فیصلہ 6 ماہ میں ہونا لازم ہے۔",
    verbatimTextEn:
      "Section 17-A: At any stage of proceedings in a suit for maintenance, the Family Court may pass an interim order for monthly maintenance of wife and children by the 14th of each month; upon default, the defence of the husband may be struck off.",
    practicalRemedyEn:
      "File in the Family Court of the district where the wife currently resides (Rule 6 of Family Courts Rules).",
    practicalRemedyUr:
      "خاتون جس ضلع میں اس وقت رہائش پذیر ہو، وہیں کی فیملی کورٹ میں دعویٰ دائر کرنے کا قانونی حق رکھتی ہے۔",
  },
  {
    id: "law-women-prop-2020",
    code: "Act XII of 2020",
    titleEn: "Enforcement of Women's Property Rights Act, 2020",
    titleUr: "خواتین کے حقوقِ جائیداد کا نفاذ ایکٹ 2020",
    partOrChapter: "Inheritance & Property Code · Sections 4, 5 & 7",
    plainSummaryEn:
      "Provides women deprived of their Shariah inheritance or property through fraud, coercion, or family pressure a fast-track 60-day remedy before the Ombudsperson—backed by direct Deputy Commissioner and police restoration of possession.",
    plainSummaryUr:
      "وراثت یا جائیداد سے محروم کی گئی خواتین دیوانی عدالت کے لمبے مقدمات کے بجائے براہِ راست محتسب کو درخواست دے کر 60 دن میں اپنا قبضہ اور انتقال بحال کروا سکتی ہیں۔",
    verbatimTextEn:
      "Section 5: The Ombudsperson may, after summary inquiry within sixty days, direct the Deputy Commissioner to restore possession or perfect title of the complainant woman.",
    practicalRemedyEn:
      "Submit a plain-paper complaint with CNIC, FRC, and Fard/Mutation copy to the Federal or Provincial Ombudsperson office.",
    practicalRemedyUr:
      "شناختی کارڈ، ایف آر سی (FRC) اور فردِ ملکیت کے ہمراہ محتسب کے دفتر میں بغیر کسی کورٹ فیس کے درخواست جمع کروائیں۔",
  },
  {
    id: "law-peca-2016",
    code: "Act XL of 2016",
    titleEn: "Prevention of Electronic Crimes Act (PECA), 2016",
    titleUr: "سائبر کرائم اور الیکٹرانک جرائم کی روک تھام کا قانون (PECA 2016)",
    partOrChapter: "Digital & Cyber Code · Sections 20, 21 & 24",
    plainSummaryEn:
      "Criminalizes non-consensual sharing of intimate images, doctored photos/videos, online blackmail, cyber stalking, identity theft, and electronic financial fraud—punishable with up to 5–7 years imprisonment and heavy fines.",
    plainSummaryUr:
      "تصاویر یا ویڈیوز میں ردوبدل، بلیک میلنگ، آن لائن ہراسانی، جعلی اکاؤنٹس اور بینکنگ فراڈ پر 5 سے 7 سال تک قید اور بھاری جرمانے کی سزا مقرر ہے۔",
    verbatimTextEn:
      "Section 21 (Offences against modesty of a natural person and minor) & Section 24 (Cyber stalking): Whoever with intent to coerce, intimidate, or harass any person uses an information system to contact or monitor such person commits cyber stalking.",
    practicalRemedyEn:
      "Preserve original URLs, message headers, and transaction IDs; file complaint via FIA Cyber Crime Circle or Helpline 1991.",
    practicalRemedyUr:
      "پیغامات اور لنکس محفوظ رکھیں اور فوری طور پر ایف آئی اے سائبر کرائم سرکل یا ہیلپ لائن 1991 پر شکایت درج کروائیں۔",
  },
  {
    id: "law-tpa-1882",
    code: "Act IV of 1882",
    titleEn: "Transfer of Property Act, 1882 & Registration Act, 1908",
    titleUr: "قانونِ انتقالِ جائیداد 1882 اور رجسٹریشن ایکٹ 1908",
    partOrChapter: "Real Estate & Conveyancing · Sections 54 & 123",
    plainSummaryEn:
      "Governs sale deeds (Bai-Nama), agreements to sell (Iqrar-Nama), mortgages, leases, and gifts. Clarifies that an unregistered Agreement to Sell on stamp paper does NOT transfer legal ownership title until a registered Sale Deed is executed before the Sub-Registrar.",
    plainSummaryUr:
      "واضح رہے کہ محض اسٹامپ پیپر پر اقرار نامہِ بیع سے ملکیت منتقل نہیں ہوتی جب تک سب رجسٹرار کے سامنے باقاعدہ رجسٹرڈ بیع نامہ نہ کروایا جائے۔",
    verbatimTextEn:
      "Section 54 TPA: A contract for the sale of immovable property is a contract that a sale of such property shall take place on terms settled between the parties. It does not, of itself, create any interest in or charge on such property.",
    practicalRemedyEn:
      "If a seller refuses to register the Sale Deed after receiving token/bayana, file a Suit for Specific Performance under Section 12 of the Specific Relief Act 1877.",
    practicalRemedyUr:
      "بیعانہ لینے کے بعد رجسٹری سے انکار کی صورت میں عدالت میں دعویٰ تعمیلِ مختص (Specific Performance) اور حکمِ امتناعی دائر کریں۔",
  },
];

export const PAKISTAN_PENAL_CODE_SECTIONS: CodexSectionItem[] = [
  {
    id: "ppc-489f",
    code: "Section 489-F PPC",
    titleEn: "Dishonestly Issuing a Cheque Towards Repayment of Loan or Obligation",
    titleUr: "دفعہ 489-F تعزیراتِ پاکستان — قرض یا ذمہ داری کی ادائیگی میں چیک باؤنس ہونا",
    partOrChapter: "Chapter XVIII PPC · Offences Relating to Documents & Banking",
    plainSummaryEn:
      "Whoever dishonestly issues a cheque towards repayment of a loan or fulfillment of an obligation which is dishonoured on presentation at the bank commits a cognizable offence punishable with up to 3 years imprisonment, fine, or both. (Note: Security/advance guarantee cheques without an existing debt are civil matters per Supreme Court rulings).",
    plainSummaryUr:
      "واجب الادا قرض یا مالی ذمہ داری کی ادائیگی کے لیے دیا گیا چیک اگر بینک سے باؤنس ہو جائے تو دفعہ 489-F کے تحت 3 سال تک قید ہو سکتی ہے، تاہم محض بطور سیکیورٹی دیے گئے چیک پر یہ فوجداری دفعہ لاگو نہیں ہوتی۔",
    verbatimTextEn:
      "Section 489-F PPC: Whoever dishonestly issues a cheque towards re-payment of a loan or fulfillment of an obligation which is dishonoured on presentation, shall be punishable with imprisonment which may extend to three years, or with fine, or with both.",
    practicalRemedyEn:
      "Obtain the original Bank Return Memo, serve a 15-day Legal Notice, lodge a Section 489-F FIR, and file a parallel Order XXXVII CPC summary recovery suit.",
    practicalRemedyUr:
      "بینک سے اصل ریٹرن میمو حاصل کریں، 15 روزہ قانونی نوٹس بھیجیں اور دفعہ 489-F کی ایف آئی آر کے ساتھ آرڈر 37 کا ریکوری دعویٰ دائر کریں۔",
  },
  {
    id: "crpc-154-22a",
    code: "Sec. 154 & 22-A CrPC",
    titleEn: "Mandatory Registration of FIR & Justice of Peace Remedy",
    titleUr: "دفعہ 154 اور 22-A ضابطہ فوجداری — ایف آئی آر کا اندراج اور جسٹس آف پیس",
    partOrChapter: "Code of Criminal Procedure 1898 · Part V: Information to Police",
    plainSummaryEn:
      "Under Section 154 CrPC, a Station House Officer (SHO) has zero discretion to refuse registering an FIR when information of a cognizable offence is given. If the SHO refuses, Section 22-A(6) CrPC empowers the Sessions Judge (Ex-Officio Justice of Peace) to compel FIR registration.",
    plainSummaryUr:
      "قابلِ دست اندازی جرم کی اطلاع ملنے پر ایس ایچ او (SHO) ایف آئی آر درج کرنے کا پابند ہے۔ انکار کی صورت میں سیشن جج (جسٹس آف پیس) کو دفعہ 22-A کی درخواست دے کر حکم لیا جا سکتا ہے۔",
    verbatimTextEn:
      "Section 154 CrPC: Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction.",
    practicalRemedyEn:
      "First send a written application to the SHO and SP Complaints via courier/post; keep the receipt and file a Section 22-A petition in Sessions Court.",
    practicalRemedyUr:
      "تھانے اور ایس پی کمپلینٹس کو رجسٹرڈ ڈاک کے ذریعے درخواست بھیجیں اور رسید لگا کر سیشن کورٹ میں دفعہ 22-A دائر کریں۔",
  },
  {
    id: "crpc-497-498",
    code: "Sec. 497 & 498 CrPC",
    titleEn: "Pre-Arrest (Protective) Bail & Post-Arrest Bail on Further Inquiry",
    titleUr: "دفعہ 497 اور 498 ضابطہ فوجداری — ضمانت قبل از گرفتاری اور بعد از گرفتاری",
    partOrChapter: "Chapter XXXIX CrPC · Of Bail",
    plainSummaryEn:
      "Section 498 CrPC allows an innocent citizen apprehending arrest in a mala fide or politically/personally motivated FIR to obtain Interim Pre-Arrest Bail from the Sessions Court or High Court. Section 497(2) grants Post-Arrest Bail as of right when the case requires 'further inquiry'.",
    plainSummaryUr:
      "بدنیتی پر مبنی یا جھوٹی ایف آئی آر میں گرفتاری سے بچنے کے لیے دفعہ 498 کے تحت ضمانت قبل از گرفتاری حاصل کی جاتی ہے، جبکہ مشکوک شواہد کی صورت میں دفعہ 497(2) کے تحت ضمانت بعد از گرفتاری شہری کا حق ہے۔",
    verbatimTextEn:
      "Section 497(2) CrPC: If it appears to such officer or Court at any stage of the investigation, inquiry or trial, that there are not reasonable grounds for believing that the accused has committed a non-bailable offence, but that there are sufficient grounds for further inquiry into his guilt, the accused shall be released on bail.",
    practicalRemedyEn:
      "Surrender before the Sessions Court with a surety bond to obtain ad-interim pre-arrest bail before joining police investigation (Shamil-e-Tafteesh).",
    practicalRemedyUr:
      "سیشن کورٹ سے عبوری ضمانت قبل از گرفتاری حاصل کرنے کے بعد تفتیش میں شامل (شاملِ تفتیش) ہوں۔",
  },
  {
    id: "ppc-420-406",
    code: "Sec. 406, 420 & 506 PPC",
    titleEn: "Criminal Breach of Trust (Amanat), Cheating & Criminal Intimidation",
    titleUr: "دفعہ 406، 420 اور 506 تعزیراتِ پاکستان — خیانتِ مجرمانہ، دھوکہ دہی اور دھمکیاں",
    partOrChapter: "Chapters XVII & XXII PPC · Offences Against Property & Intimidation",
    plainSummaryEn:
      "Section 406 punishes misappropriation of entrusted property/funds (Amanat) with up to 7 years imprisonment. Section 420 punishes cheating and dishonestly inducing delivery of property. Section 506-B punishes life threats or armed intimidation.",
    plainSummaryUr:
      "امانت میں خیانت (دفعہ 406)، دھوکہ دہی سے رقم یا جائیداد ہتھیانا (دفعہ 420) اور جان سے مارنے کی سنگین دھمکیاں دینا (دفعہ 506-B) قابلِ سزا فوجداری جرائم ہیں۔",
    verbatimTextEn:
      "Section 406 PPC: Whoever commits criminal breach of trust shall be punished with imprisonment of either description for a term which may extend to seven years, or with fine, or with both.",
    practicalRemedyEn:
      "Compile written receipts, bank transfer slips, and witness statements establishing initial entrustment or fraudulent inducement before filing FIR.",
    practicalRemedyUr:
      "تحریری رسیدیں، بینک ٹرانسفر سلپس اور گواہان کے بیانات یکجا کر کے متعلقہ تھانے میں مقدمے کی درخواست دیں۔",
  },
];

export const ALL_COURTS_JUDGMENTS: CourtJudgmentItem[] = [
  {
    id: "judg-sc-1",
    citation: "PLD 2025 SC 112",
    courtKey: "SC",
    courtNameEn: "Supreme Court of Pakistan",
    courtNameUr: "سپریم کورٹ آف پاکستان",
    benchEn: "3-Member Constitutional & Family Bench, Islamabad",
    "dateDecided": "14 January 2025",
    subjectEn: "Family Law · Khula & Protection of Haq Mehr",
    subjectUr: "فیملی لا · خلع اور حق مہر کا تحفظ",
    headlineEn:
      "Wife Compelled to Seek Dissolution Due to Husband's Cruelty Cannot Be Forced to Return Haq Mehr",
    headlineUr:
      "شوہر کے ظلم یا ناروا سلوک کی وجہ سے خلع لینے والی خاتون کو حق مہر واپس کرنے پر مجبور نہیں کیا جا سکتا",
    ratioDecidendiEn:
      "Where the record establishes that breakdown of marriage resulted from physical cruelty, desertion, or non-maintenance by the husband, Family Courts cannot mechanically order total forfeiture of dower under Section 10(4) of the Family Courts Act 1964.",
    ratioDecidendiUr:
      "جب نکاح کی ناکامی شوہر کے ظلم، مار پیٹ یا نان و نفقہ نہ دینے کی وجہ سے ہو تو فیملی کورٹ بیوی کو پورا حق مہر چھوڑنے کا حکم نہیں دے سکتی۔",
    fullOrderExcerptEn:
      "ORDER: The Constitutional protection of dignity under Article 14 and Islamic injunctions of Adl mandate that a wife driven out of the matrimonial home by cruelty does not forfeit her statutory dower merely because her plaint is styled as Khula.",
  },
  {
    id: "judg-sc-2",
    citation: "2024 SCMR 841",
    courtKey: "SC",
    courtNameEn: "Supreme Court of Pakistan",
    courtNameUr: "سپریم کورٹ آف پاکستان",
    benchEn: "Appellate Civil Bench, Supreme Court Islamabad",
    "dateDecided": "22 November 2024",
    subjectEn: "Islamic Inheritance · Limitation Never Runs Against Female Co-Sharer",
    subjectUr: "اسلامی وراثت · بہن یا بیٹی کے وراثتی حصے پر زائد المیعاد (Limitation) کی پابندی نہیں",
    headlineEn:
      "Fraudulent Revenue Mutations Depriving Sisters of Inheritance Are Void Ab Initio Regardless of Decades Passed",
    headlineUr:
      "بہنوں کو وراثت سے محروم کرنے والے جعلی پٹوار انتقالات دہائیاں گزرنے کے باوجود باطل قرار",
    ratioDecidendiEn:
      "The moment an ancestor passes away, legal title vests automatically in all Quranic legal heirs. A brother in possession holds the land as a constructive trustee for his sisters; limitation never runs against a co-sharer in inheritance fraud.",
    ratioDecidendiUr:
      "مورث کی وفات کے فوراً بعد شرعی ورثاء جائیداد کے شریک مالک بن جاتے ہیں۔ بھائی کا قبضہ بہنوں کی امانت تصور ہوگا اور کسی بھی وقت انتقال منسوخ کروایا جا سکتا ہے۔",
    fullOrderExcerptEn:
      "ORDER: Revenue authorities are not courts of title. Any gift or relinquishment mutation depriving female heirs without independent legal advice, consideration, and clear proof of possession is set aside with costs.",
  },
  {
    id: "judg-fsc-1",
    citation: "PLD 2024 FSC 42",
    courtKey: "FSC",
    courtNameEn: "Federal Shariat Court of Pakistan",
    courtNameUr: "وفاقی شرعی عدالت پاکستان",
    benchEn: "Full Shariat Appellate Bench, Islamabad",
    "dateDecided": "03 September 2024",
    subjectEn: "Islamic Jurisprudence · Criminal & Family Protections",
    subjectUr: "اسلامی فقہ و شریعت · خواتین کے وراثتی اور عائلی حقوق",
    headlineEn:
      "Customary Practices Denying Women Inheritance in Ancestral Land Declared Repugnant to Injunctions of Islam",
    headlineUr:
      "خواتین کو آبائی جائیداد کے شرعی حصے سے محروم کرنے کی تمام علاقائی رسومات غیر اسلامی قرار",
    ratioDecidendiEn:
      "Any custom, family settlement, or pressure tactic that compels female legal heirs to waive their divinely ordained shares in Surah An-Nisa is void and enforceable through criminal and civil sanctions under Section 498-A PPC.",
    ratioDecidendiUr:
      "سورۃ النساء میں مقرر کردہ شرعی حصوں سے خواتین کو محروم کرنے والا ہر رواج یا دباؤ باطل ہے اور دفعہ 498-A کے تحت قابلِ سزا جرم ہے۔",
    fullOrderExcerptEn:
      "JUDGMENT: Provincial governments and Board of Revenue registrars are directed to verify biometric consent and direct bank transfer before attesting any surrender of inheritance rights.",
  },
  {
    id: "judg-lhc-1",
    citation: "PLD 2025 Lahore 194",
    courtKey: "LHC",
    courtNameEn: "Lahore High Court",
    courtNameUr: "لاہور ہائی کورٹ",
    benchEn: "Division Constitutional Bench, Lahore",
    "dateDecided": "19 February 2025",
    subjectEn: "Criminal Procedure · Quashment of Multiple FIRs on Same Incident",
    subjectUr: "ضابطہ فوجداری · ایک ہی واقعے پر دوسری ایف آئی آر کا اخراج",
    headlineEn:
      "Second or Subsequent FIR on the Same Transaction Impermissible; Every New Version Must Be Recorded Under Sec. 161 CrPC",
    headlineUr:
      "ایک ہی واقعے پر الگ الگ تھانوں میں متعدد ایف آئی آرز درج کرنا غیر قانونی؛ نیا موقف ضمنی میں درج ہوگا",
    ratioDecidendiEn:
      "Applying the Sughran Bibi doctrine (PLD 2018 SC 595), police cannot register multiple FIRs across different districts to harass an accused over a single commercial dispute.",
    ratioDecidendiUr:
      "صغراں بی بی کیس کے اصول کے تحت کسی شہری کو ہراساں کرنے کے لیے ایک ہی لین دین پر مختلف اضلاع میں الگ ایف آئی آرز درج نہیں کی جا سکتیں۔",
    fullOrderExcerptEn:
      "ORDER: Writ Petition allowed. The impugned subsequent FIR is quashed forthwith as an abuse of process of law.",
  },
  {
    id: "judg-shc-1",
    citation: "2025 CLD 318 Sindh",
    courtKey: "SHC",
    courtNameEn: "Sindh High Court, Karachi",
    courtNameUr: "سندھ ہائی کورٹ، کراچی",
    benchEn: "Commercial & Banking Appellate Bench, Karachi",
    "dateDecided": "28 January 2025",
    subjectEn: "Banking & Cyber Fraud · Unauthorized Account Freezing",
    subjectUr: "بینکنگ اور سائبر قوانین · بغیر نوٹس بینک اکاؤنٹ منجمد کرنا",
    headlineEn:
      "Banks and FIA Cannot Indefinitely Freeze a Citizen's Complete Salary or Business Account Without Magistrate Order",
    headlineUr:
      "مجسٹریٹ کے باضابطہ حکم اور شوکاز نوٹس کے بغیر شہری کا پورا بینک اکاؤنٹ غیر معینہ مدت کے لیے بلاک نہیں کیا جا سکتا",
    ratioDecidendiEn:
      "Only the specific disputed transaction amount may be placed on temporary lien during inquiry; freezing the entire operational bank account violates Articles 18 and 24 of the Constitution.",
    ratioDecidendiUr:
      "انکوائری کے دوران صرف متنازعہ رقم کی حد تک ہولڈ لگایا جا سکتا ہے؛ پورا اکاؤنٹ بلاک کرنا آئین کے آرٹیکل 18 اور 24 کی خلاف ورزی ہے۔",
    fullOrderExcerptEn:
      "ORDER: Respondent Bank is directed to immediately de-freeze the petitioner's account beyond the disputed sum of the reported transaction.",
  },
  {
    id: "judg-ihc-1",
    citation: "PLD 2024 Islamabad 98",
    courtKey: "IHC",
    courtNameEn: "Islamabad High Court",
    courtNameUr: "اسلام آباد ہائی کورٹ",
    benchEn: "Single Constitutional Bench, Islamabad",
    "dateDecided": "11 October 2024",
    subjectEn: "Overseas Pakistanis · Protection Against Land Grabbing (Qabza)",
    subjectUr: "اوورسیز پاکستانی · قبضہ مافیا اور جعلی مختار نامے سے تحفظ",
    headlineEn:
      "Mandatory Embassy Attestation & Biometric Verification Required Before Acting on Any Overseas Power of Attorney",
    headlineUr:
      "اوورسیز پاکستانیوں کی جائیداد کی فروخت کے لیے سفارتخانے کی تصدیق اور بائیو میٹرک لازمی قرار",
    ratioDecidendiEn:
      "Any transfer of plot or house in Islamabad executed on an unverified local Power of Attorney without NADRA digital apostille/embassy verification is null and void.",
    ratioDecidendiUr:
      "سفارتخانے کی تصدیق اور نادرا آن لائن بائیو میٹرک کے بغیر بنائے گئے مختار نامے پر جائیداد کی منتقلی کالعدم ہوگی۔",
    fullOrderExcerptEn:
      "ORDER: CDA and ICT Revenue Directorate shall restore the petitioner's title entry within 14 days.",
  },
  {
    id: "judg-phc-1",
    citation: "2024 PCrLJ 774 Peshawar",
    courtKey: "PHC",
    courtNameEn: "Peshawar High Court",
    courtNameUr: "پشاور ہائی کورٹ",
    benchEn: "Criminal Revision Bench, Peshawar",
    "dateDecided": "17 August 2024",
    subjectEn: "Commercial & Criminal Law · Advance Security Cheque",
    subjectUr: "تجارتی و فوجداری قانون · بطور ضمانت (سیکیورٹی) دیا گیا چیک",
    headlineEn:
      "Cheque Issued as Advance Business Security Does Not Attract Criminal Liability Under Section 489-F PPC",
    headlineUr:
      "کاروباری ضمانت یا ایڈوانس سیکیورٹی کے طور پر دیے گئے چیک پر دفعہ 489-F کا فوجداری مقدمہ نہیں بنتا",
    ratioDecidendiEn:
      "Where the written agreement itself states the cheque was handed over as security prior to any accrued liability, the proper remedy is a civil recovery suit, not criminal arrest.",
    ratioDecidendiUr:
      "جہاں تحریری معاہدے سے ثابت ہو کہ چیک بطور سیکیورٹی دیا گیا تھا، وہاں دیوانی دعویٰ دائر ہوگا نہ کہ فوجداری گرفتاری۔",
    fullOrderExcerptEn:
      "ORDER: Pre-arrest bail confirmed. Complainant is at liberty to pursue civil recovery before the competent forum.",
  },
  {
    id: "judg-bhc-1",
    citation: "PLD 2024 Quetta 61",
    courtKey: "BHC",
    courtNameEn: "Balochistan High Court, Quetta",
    courtNameUr: "بلوچستان ہائی کورٹ، کوئٹہ",
    benchEn: "Constitutional Division Bench, Quetta",
    "dateDecided": "05 July 2024",
    subjectEn: "Constitutional Rights · Access to Free Legal Aid in Remote Districts",
    subjectUr: "آئینی حقوق · دور دراز اضلاع میں مفت قانونی امداد کی فراہمی",
    headlineEn:
      "Every Indigent Prisoner and Juvenile Must Be Provided State-Funded Legal Counsel at First Remand Stage",
    headlineUr:
      "ہر نادار قیدی اور کم عمر ملزم کو پہلے ریمانڈ کے مرحلے ہی سے سرکاری خرچ پر وکیل فراہم کرنا لازم ہے",
    ratioDecidendiEn:
      "Under Article 10-A of the Constitution, a criminal trial or remand proceeding conducted against an unrepresented indigent accused is unconstitutional.",
    ratioDecidendiUr:
      "آئین کے آرٹیکل 10-A کے تحت کسی غریب ملزم کو وکیل فراہم کیے بغیر سزا سنانا یا ریمانڈ دینا غیر آئینی ہے۔",
    fullOrderExcerptEn:
      "ORDER: District & Sessions Judges across Balochistan shall maintain an active roster of paid pro-bono defense counsel.",
  },
];

export const LEGAL_CAREER_OPENINGS: LegalCareerOpening[] = [
  {
    id: "job-lhc-litigation",
    roleTitleEn: "Senior High Court Litigation Associate (Civil, Family & Constitutional Writs)",
    roleTitleUr: "سینئر ہائی کورٹ لٹیگیشن ایسوسی ایٹ (دیوانی، فیملی اور آئینی رِٹ)",
    organizationEn: "Mansoor & Tariq Law Chambers · QanoonPK Verified Panel",
    organizationUr: "منصور اینڈ طارق لا چیمبرز · لاہور ہائی کورٹ پینل",
    city: "Lahore",
    cityUr: "لاہور",
    practiceArea: "High Court Writs & Family Litigation",
    compensationPkr: "PKR 160,000 – 240,000 / mo + Case Brief Share",
    engagementType: "Full-Time Chamber",
    barRequirement: "Punjab Bar Council · High Court License (AHC)",
    descriptionEn:
      "Lead drafting and court appearances in Article 199 constitutional petitions, family appeals, and inheritance suits before the Lahore High Court and District Courts.",
    descriptionUr:
      "لاہور ہائی کورٹ اور ضلعی عدالتوں میں آئینی پٹیشنز، فیملی اپیلوں اور وراثتی مقدمات کی ڈرافٹنگ اور پیروی کے لیے تجربہ کار وکیل درکار ہے۔",
    responsibilitiesEn: [
      "Draft Constitutional Petitions (Art. 199) and Civil Revisions (Sec. 115 CPC)",
      "Conduct client escrow consultations via QanoonPK Verified Video Chamber",
      "Mentor junior law clerks and supervise District Court filings",
    ],
  },
  {
    id: "job-khi-corporate",
    roleTitleEn: "Corporate, Banking & Cyber Crime (PECA) Defence Counsel",
    roleTitleUr: "کارپوریٹ، بینکنگ اور سائبر کرائم (PECA) ڈیفنس قونصل",
    organizationEn: "Siddiqui & Partners Corporate Advocates",
    organizationUr: "صدیقی اینڈ پارٹنرز کارپوریٹ ایڈووکیٹس، کراچی",
    city: "Karachi",
    cityUr: "کراچی",
    practiceArea: "Banking Courts, SECP & FIA Cyber Inquiries",
    compensationPkr: "PKR 185,000 – 280,000 / mo + Retainer Bonus",
    engagementType: "Corporate Retainer",
    barRequirement: "Sindh Bar Council · 3+ Years Standing",
    descriptionEn:
      "Represent fintech clients, corporate depositors, and citizens in Sindh High Court commercial suits, Banking Court recoveries, and FIA Cyber Crime wing representations.",
    descriptionUr:
      "سندھ ہائی کورٹ، بینکنگ کورٹس اور ایف آئی اے سائبر کرائم انکوائریز میں کارپوریٹ اور شہری موکلین کی نمائندگی کے لیے وکیل درکار ہے۔",
    responsibilitiesEn: [
      "Appear before Banking Courts and FIA Cyber Crime Circle Karachi",
      "Draft commercial contracts, legal notices (Sec 489-F), and account unfreezing writs",
      "Provide bilingual legal opinions to QanoonPK enterprise & overseas clients",
    ],
  },
  {
    id: "job-isb-panel",
    roleTitleEn: "QanoonPK Verified Panel Advocate (Overseas Property & CDA Desk)",
    roleTitleUr: "قانون پاکستان تصدیق شدہ پینل ایڈووکیٹ (اوورسیز پراپرٹی ڈیسک)",
    organizationEn: "QanoonPK National Escrow Network · Islamabad Directorate",
    organizationUr: "قانون پاکستان نیشنل ایسکرو نیٹ ورک · اسلام آباد",
    city: "Islamabad",
    cityUr: "اسلام آباد",
    practiceArea: "Overseas Property Verification, CDA & Succession",
    compensationPkr: "PKR 4,000 – 7,500 per Escrow Consultation + Full Case Briefs",
    engagementType: "Panel Advocate",
    barRequirement: "Islamabad / Provincial Bar Council Verified License",
    descriptionEn:
      "Join the QanoonPK Verified Advocate Roster to receive direct, escrow-backed consultations and property title verification mandates from overseas and resident citizens.",
    descriptionUr:
      "قانون پاکستان کے تصدیق شدہ وکلاء پینل میں شامل ہوں اور براہِ راست ایسکرو مشاورت، نادرا جانشینی سرٹیفکیٹ اور جائیداد کی تصدیق کے کیسز حاصل کریں۔",
    responsibilitiesEn: [
      "Conduct 30-minute video/phone legal consultations with guaranteed escrow payout",
      "Execute NADRA Succession Certificate filings and Sub-Registrar title searches",
      "Maintain a 4.8+ citizen clarity rating on the QanoonPK platform",
    ],
  },
  {
    id: "job-psh-probono",
    roleTitleEn: "Pro-Bono Legal Aid & Women's Inheritance Rights Fellow",
    roleTitleUr: "پرو بونو قانونی امداد اور خواتین کے وراثتی حقوق فیلو",
    organizationEn: "Citizen Justice & Legal Aid Foundation Pakistan",
    organizationUr: "سٹیزن جسٹس اینڈ لیگل ایڈ فاؤنڈیشن پاکستان",
    city: "Peshawar",
    cityUr: "پشاور / خیبر پختونخوا",
    practiceArea: "Women's Inheritance, Juvenile Bail & Family Aid",
    compensationPkr: "PKR 115,000 / mo Stipend + Court Filing Grant",
    engagementType: "Paid Fellowship",
    barRequirement: "KP Bar Council · Fresh / 1–3 Years Advocate",
    descriptionEn:
      "Sponsored fellowship for dedicated young advocates representing deserving women in Ombudsperson inheritance claims, Family Court maintenance, and juvenile bail petitions.",
    descriptionUr:
      "مستحق خواتین کے وراثتی حقوق، فیملی کورٹ نان و نفقہ اور نادار قیدیوں کی ضمانت کے مقدمات کی پیروی کے لیے پیڈ لیگل ایڈ فیلوشپ۔",
    responsibilitiesEn: [
      "File inheritance restoration complaints under Women's Property Rights Act 2020",
      "Represent indigent women in Family Courts at zero cost to the beneficiary",
      "Author bilingual citizen awareness guides for the QanoonPK Plain-Law Archive",
    ],
  },
];

export const LEGAL_AID_NEWS_DISPATCHES: LegalAidNewsItem[] = [
  {
    id: "news-1",
    slug: "women-inheritance-ombudsperson-fast-track-2026",
    category: "Women & Overseas Protection",
    categoryUr: "خواتین اور اوورسیز تحفظ",
    publishedDate: "October 2026 · Gazette Dispatch",
    readTime: "3 min read",
    sourceAuthority: "Federal & Provincial Ombudsperson Secretariat",
    headlineEn:
      "60-Day Fast-Track Cell Activated to Restore Women's Denied Inheritance Shares Without Civil Court Delays",
    headlineUr:
      "خواتین کو وراثتی جائیداد کا حصہ 60 دن میں دلوانے کے لیے محتسب کا فاسٹ ٹریک سیل فعال",
    deckEn:
      "Female heirs denied agricultural or urban property through unverified 'gift' or 'waiver' mutations can now file a zero-fee complaint directly with the Ombudsperson, backed by Deputy Commissioner enforcement.",
    deckUr:
      "جعلی ہبہ یا دستبرداری کے ذریعے وراثت سے محروم کی گئی خواتین اب بغیر کسی کورٹ فیس کے محتسب کو درخواست دے کر ڈپٹی کمشنر کے ذریعے قبضہ واپس لے سکتی ہیں۔",
    fullReportEn:
      "Under the Enforcement of Women's Property Rights Act 2020 and recent Supreme Court directives (2024 SCMR 841), revenue officers across Punjab, Sindh, KP, and Islamabad have been instructed to halt any mutation where female heirs are excluded without verified bank consideration. The Ombudsperson Secretariat has also enabled online tracking for complainants who cannot travel to provincial capitals.",
    fullReportUr:
      "خواتین کے حقوقِ جائیداد ایکٹ 2020 اور سپریم کورٹ کے حالیہ احکامات کے تحت تمام اضلاع کے ڈپٹی کمشنرز کو پابند کیا گیا ہے کہ وہ محتسب کے فیصلے پر فوری عملدرآمد کرواتے ہوئے خواتین کو ان کا شرعی حصہ اور قبضہ دلوائیں۔",
    actionLink: "/pro-bono/apply",
    actionLabelEn: "Apply for Free Inheritance Legal Aid",
  },
  {
    id: "news-2",
    slug: "supreme-court-video-link-and-efiling-expansion",
    category: "Supreme Court Directive",
    categoryUr: "سپریم کورٹ اعلامیہ",
    publishedDate: "October 2026 · Judicial Circular",
    readTime: "4 min read",
    sourceAuthority: "Supreme Court of Pakistan & National Judicial Policy",
    headlineEn:
      "Supreme Court & High Courts Expand Video-Link Hearings and Digital Certified Copy Delivery for Litigants",
    headlineUr:
      "سپریم کورٹ اور ہائی کورٹس میں ویڈیو لنک سماعت اور مصدقہ نقول کے آن لائن حصول کا دائرہ وسیع",
    deckEn:
      "Advocates and overseas litigants can now request video-link arguments across registry benches and obtain QR-verified certified copies of judgments within 48 hours.",
    deckUr:
      "وکلاء اور اوورسیز پاکستانی اب رجسٹری بینچز کے ذریعے ویڈیو لنک پر دلائل دے سکتے ہیں اور 48 گھنٹے میں فیصلوں کی کیو آر (QR) مصدقہ نقول حاصل کر سکتے ہیں۔",
    fullReportEn:
      "To reduce litigation costs and travel hardship for citizens in remote districts, the Supreme Court of Pakistan and provincial High Courts have upgraded their e-filing and virtual courtroom infrastructure. Family Courts have similarly been empowered to record evidence of overseas spouses and witnesses via official video link.",
    fullReportUr:
      "شہریوں کو سفری مشکلات اور بھاری اخراجات سے بچانے کے لیے اعلیٰ عدالتوں کے ساتھ ساتھ فیملی کورٹس میں بھی بیرونِ ملک مقیم فریقین کا بیان ویڈیو لنک کے ذریعے ریکارڈ کرنے کی سہولت فراہم کر دی گئی ہے۔",
    actionLink: "/laws",
    actionLabelEn: "Explore Latest Judgments",
  },
  {
    id: "news-3",
    slug: "free-legal-aid-clinics-indigent-citizens-bar-councils",
    category: "Legal Aid Drive",
    categoryUr: "مفت قانونی امداد مہم",
    publishedDate: "October 2026 · Public Notice",
    readTime: "3 min read",
    sourceAuthority: "Legal Aid and Justice Authority (LAJA) & Bar Councils",
    headlineEn:
      "State-Funded Pro-Bono Advocates Designated in Every District for Deserving Women, Juveniles & Laborers",
    headlineUr:
      "ہر ضلع میں مستحق خواتین، کم عمر قیدیوں اور مزدوروں کے لیے مفت سرکاری وکیل کی سہولت",
    deckEn:
      "Citizens earning below the statutory threshold can apply for 100% fee-waived legal representation in Family, Bail, and Unlawful Eviction matters.",
    deckUr:
      "کم آمدنی والے شہری فیملی کیسز، ضمانت اور غیر قانونی بے دخلی کے مقدمات میں سو فیصد مفت وکیل کے لیے آن لائن درخواست دے سکتے ہیں۔",
    fullReportEn:
      "Pursuant to the Legal Aid and Justice Authority Act and provincial Bar Council Free Legal Aid Committees, verified panel advocates are compensated directly from the statutory fund so indigent citizens receive full courtroom representation without paying private legal fees.",
    fullReportUr:
      "لیگل ایڈ اینڈ جسٹس اتھارٹی ایکٹ اور بار کونسلز کی فری لیگل ایڈ کمیٹیوں کے تحت نادار شہریوں کے وکیل کی فیس سرکاری فنڈ سے ادا کی جاتی ہے تاکہ کوئی شہری غربت کے باعث انصاف سے محروم نہ رہے۔",
    actionLink: "/pro-bono/apply",
    actionLabelEn: "Submit Pro-Bono Aid Request",
  },
  {
    id: "news-4",
    slug: "nadra-succession-certificate-15-day-portal-update",
    category: "Legislative Reform",
    categoryUr: "قانونی و انتظامی اصلاحات",
    publishedDate: "September 2026 · Regulatory Update",
    readTime: "3 min read",
    sourceAuthority: "NADRA Letters of Administration & Succession Wing",
    headlineEn:
      "NADRA Biometric Verification enables Overseas Legal Heirs to Complete Succession Certificates Without Traveling to Pakistan",
    headlineUr:
      "اوورسیز پاکستانی اب پاکستان آئے بغیر نادرا ایپ سے بائیو میٹرک تصدیق کے ذریعے جانشینی سرٹیفکیٹ بنوا سکتے ہیں",
    deckEn:
      "Letters of Administration for immovable property and Succession Certificates for bank accounts can be processed in 15 days following public newspaper notice.",
    deckUr:
      "بینک اکاؤنٹس اور جائیداد کی وراثتی منتقلی کے لیے نادرا جانشینی سرٹیفکیٹ کا عمل اخباری اشتہار کے بعد 15 دن میں مکمل۔",
    fullReportEn:
      "Under the Letters of Administration and Succession Certificates Act, legal heirs no longer need to wait years in Civil Courts when there is no dispute among family members. Any legal heir can initiate the application at the NADRA Succession Facilitation Unit while remaining siblings verify biometrics remotely.",
    fullReportUr:
      "جب تمام شرعی ورثاء کے درمیان اتفاق ہو تو دیوانی عدالت جانے کے بجائے نادرا کے سکسشن یونٹ سے چند ہفتوں میں جانشینی سرٹیفکیٹ حاصل کیا جا سکتا ہے۔",
    actionLink: "#wirasat-calculator",
    actionLabelEn: "Calculate Shariah Inheritance Shares",
  },
];

export interface PlatformRouteCard {
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  href: string;
  group: "Citizen Justice" | "Client Workspace" | "Advocate & Bar CRM";
  badge: string;
}

export const PLATFORM_MASTER_DIRECTORY: PlatformRouteCard[] = [
  {
    titleEn: "Complete Laws & Judgments Library",
    titleUr: "مکمل قوانین اور عدالتی فیصلے",
    descriptionEn: "Searchable database of the Constitution, PPC, Acts & print-ready court judgments.",
    href: "/laws",
    group: "Citizen Justice",
    badge: "Statute Archive",
  },
  {
    titleEn: "Verified Advocates Directory",
    titleUr: "تصدیق شدہ وکلاء کی ڈائریکٹری",
    descriptionEn: "Filter Bar-verified High Court & Supreme Court advocates by city, fee, and specialty.",
    href: "/lawyers",
    group: "Citizen Justice",
    badge: "Bar Verified",
  },
  {
    titleEn: "Court-Ready Legal Templates",
    titleUr: "قانونی مسودے اور معاہدے",
    descriptionEn: "Downloadable bilingual drafts for Kiraya Nama, Affidavit, Hiba-Nama & Legal Notices.",
    href: "/templates",
    group: "Citizen Justice",
    badge: "Bilingual Drafts",
  },
  {
    titleEn: "Public Legal Q&A Forum",
    titleUr: "عوامی قانونی سوال و جواب فورم",
    descriptionEn: "Post anonymous legal questions and read verified answers from practicing advocates.",
    href: "/forum",
    group: "Citizen Justice",
    badge: "Community Desk",
  },
  {
    titleEn: "Apply for Free Pro-Bono Legal Aid",
    titleUr: "مفت قانونی امداد کی درخواست",
    descriptionEn: "100% fee-waived legal representation for deserving women, laborers, and juveniles.",
    href: "/pro-bono/apply",
    group: "Citizen Justice",
    badge: "Free Aid",
  },
  {
    titleEn: "Dedicated Nastaliq Urdu Portal",
    titleUr: "مکمل اردو قانونی پورٹل",
    descriptionEn: "Full RTL Nastaliq Urdu interface for laws, articles, and advocate consultations.",
    href: "/urdu",
    group: "Citizen Justice",
    badge: "اردو پورٹل",
  },
  {
    titleEn: "AI Legal Assistant (Search Grounded)",
    titleUr: "قانونی اے آئی ریسرچ اسسٹنٹ",
    descriptionEn: "Real-time Google Search Grounded Pakistani legal research with live statutory citations.",
    href: "/client/ai-assistant",
    group: "Client Workspace",
    badge: "Live Grounding",
  },
  {
    titleEn: "My Active Cases & Milestones",
    titleUr: "میرے مقدمات اور پیش رفت",
    descriptionEn: "Track court hearing dates, uploaded evidentiary documents, and escrow milestones.",
    href: "/client/cases",
    group: "Client Workspace",
    badge: "Case Tracker",
  },
  {
    titleEn: "Encrypted Advocate Chat & Video Chamber",
    titleUr: "محفوظ چیٹ اور ویڈیو چیمبر",
    descriptionEn: "Confidential attorney-client messaging and virtual video consultation room.",
    href: "/chat",
    group: "Client Workspace",
    badge: "Privileged",
  },
  {
    titleEn: "Advocate Chamber Dashboard & Leads",
    titleUr: "وکیل چیمبر ڈیش بورڈ اور موکلین",
    descriptionEn: "Manage incoming client leads, accept briefs, and update case milestones.",
    href: "/lawyer/dashboard",
    group: "Advocate & Bar CRM",
    badge: "Advocate CRM",
  },
  {
    titleEn: "Advocate Escrow Wallet & Payouts",
    titleUr: "وکیل ایسکرو والٹ اور ادائیگیاں",
    descriptionEn: "Track cleared consultation fees, pending escrow balances, and bank withdrawals.",
    href: "/lawyer/wallet",
    group: "Advocate & Bar CRM",
    badge: "Escrow Ledger",
  },
  {
    titleEn: "Bar Enrollment & Account Sign-In",
    titleUr: "بار رجسٹریشن اور اکاؤنٹ لاگ ان",
    descriptionEn: "Sign in as a citizen client, verify your Bar Council license, or manage preferences.",
    href: "/auth",
    group: "Advocate & Bar CRM",
    badge: "Auth & RBAC",
  },
];

export interface CitizenForumThread {
  id: string;
  category: "Family & Khula" | "Property & Wirasat" | "Police FIR & Bail" | "Cyber & Banking";
  city: string;
  askedBy: string;
  timeAgo: string;
  questionEn: string;
  questionUr: string;
  advocateName: string;
  advocateBarId: string;
  answerEn: string;
  answerUr: string;
  statuteCited: string;
  helpfulCount: number;
}

export const CITIZEN_FORUM_THREADS: CitizenForumThread[] = [
  {
    id: "forum-khula-haq-mehr",
    category: "Family & Khula",
    city: "Lahore",
    askedBy: "Anonymous Citizen (Verified)",
    timeAgo: "2 hours ago",
    questionEn:
      "If my husband physically forced me to leave the marital home, do I still have to return my Haq Mehr to obtain Khula from the Family Court?",
    questionUr:
      "اگر شوہر نے تشدد کر کے گھر سے نکال دیا ہو تو کیا خلع لیتے وقت حق مہر واپس کرنا لازم ہوگا؟",
    advocateName: "Barrister Mahnoor Tariq, AHC",
    advocateBarId: "PbBC-LHC-18922",
    answerEn:
      "No. Under the recent Supreme Court ruling (PLD 2025 SC 112) and Section 10(5) of the Family Courts Act 1964, where the dissolution is compelled by the husband's cruelty, desertion, or non-maintenance, the Family Judge cannot force the wife to surrender her Haq Mehr.",
    answerUr:
      "ہرگز نہیں۔ سپریم کورٹ کے حالیہ فیصلے (PLD 2025 SC 112) کے تحت اگر خلع کی وجہ شوہر کا ظلم، تشدد یا نان و نفقہ نہ دینا ہو تو بیوی سے حق مہر واپس نہیں لیا جا سکتا۔",
    statuteCited: "PLD 2025 SC 112 · Family Courts Act Sec. 10",
    helpfulCount: 148,
  },
  {
    id: "forum-overseas-fraud-mutation",
    category: "Property & Wirasat",
    city: "Islamabad",
    askedBy: "Overseas Pakistani (UK)",
    timeAgo: "5 hours ago",
    questionEn:
      "My brothers transferred our late father's agricultural land in Gujrat excluding our two sisters by claiming they orally gifted their shares. Is there a time limit to challenge this?",
    questionUr:
      "میرے بھائیوں نے زبانی ہبہ کا دعویٰ کر کے دو بہنوں کو وراثتی زمین سے محروم کر دیا۔ کیا اسے چیلنج کرنے کی کوئی مدت مقرر ہے؟",
    advocateName: "Adv. Sikandar Hayat, ASC",
    advocateBarId: "PBC-SC-04918",
    answerEn:
      "There is NO limitation period against fraudulent inheritance deprivation. In 2024 SCMR 891, the Supreme Court held that every day a female legal heir is kept out of her Quranic share is a fresh cause of action. You can file an immediate complaint before the Provincial Ombudsperson (60-day summary disposal).",
    answerUr:
      "وراثت میں دھوکہ دہی کے خلاف قانونِ میعاد (Limitation) لاگو نہیں ہوتا۔ آپ صوبائی محتسب برائے تحفظِ حقوقِ ملکیتِ خواتین میں درخواست دیں جہاں 60 دن میں قبضہ اور انتقال بحال کیا جاتا ہے۔",
    statuteCited: "2024 SCMR 891 · Women's Property Rights Act 2020",
    helpfulCount: 214,
  },
  {
    id: "forum-fia-bank-freeze",
    category: "Cyber & Banking",
    city: "Karachi",
    askedBy: "Freelance Software Engineer",
    timeAgo: "1 day ago",
    questionEn:
      "My bank froze my entire freelance salary account citing a disputed P2P crypto transaction of Rs. 45,000 from three months ago. How can I unfreeze my legitimate funds?",
    questionUr:
      "صرف 45 ہزار روپے کی پرانی ٹرانزیکشن کی وجہ سے بینک نے میرا پورا سیلری اکاؤنٹ بلاک کر دیا ہے۔ اکاؤنٹ کیسے بحال ہوگا؟",
    advocateName: "Adv. Daniyal Qureshi, AHC",
    advocateBarId: "SBC-SHC-31044",
    answerEn:
      "Under Sindh High Court & Islamabad High Court precedents, neither FIA nor a commercial bank can freeze an entire account indefinitely without a specific judicial order under the CrPC. File a representation to the Banking Mohtasib and a Writ Petition under Article 199 to restrict any lien strictly to the disputed Rs. 45,000.",
    answerUr:
      "ہائی کورٹ کے فیصلوں کے مطابق ایف آئی اے یا بینک بغیر عدالتی حکم کے پورا اکاؤنٹ منجمد نہیں کر سکتے۔ صرف متنازعہ رقم کی حد تک لین (Lien) رکھی جا سکتی ہے۔",
    statuteCited: "Constitution Art. 199 · PECA 2016",
    helpfulCount: 96,
  },
];

