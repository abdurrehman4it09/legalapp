export interface PrecedentAlert {
  id: string;
  citation: string;
  en: string;
  ur: string;
}

export interface TriageRoadmap {
  topicKey: string;
  labelEn: string;
  labelUr: string;
  statuteBadge: string;
  protectionPlainEn: string;
  protectionFormalEn: string;
  protectionUr: string;
  documentsEn: string[];
  documentsUr: string[];
  nextStepPlainEn: string;
  nextStepFormalEn: string;
  nextStepUr: string;
  recommendedSpecialty: string;
}

export interface SpotlightBriefing {
  id: string;
  citation: string;
  categoryEn: string;
  categoryUr: string;
  readTime: string;
  audioDuration: string;
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  plainSummaryEn: string;
  formalTextEn: string;
  urduSummary: string;
  author: string;
}

export interface DecodedClause {
  id: string;
  clauseNumber: string;
  titleEn: string;
  titleUr: string;
  officialEn: string;
  officialUr: string;
  meaningEn: string;
  meaningUr: string;
  redFlagEn: string;
  redFlagUr: string;
}

export interface ClauseDocumentGroup {
  key: "nikahnama" | "fir" | "rent";
  labelEn: string;
  labelUr: string;
  statuteRef: string;
  clauses: DecodedClause[];
}

export interface VerifiedAdvocate {
  id: string;
  name: string;
  name_urdu: string;
  court: string;
  court_urdu: string;
  city: string;
  city_urdu: string;
  specialty: string;
  specialty_urdu: string;
  bar_council_id: string;
  experience_years: number;
  rating: string;
  fee: number;
  pro_bono: boolean;
  bio: string;
  bio_urdu: string;
  notable_precedents: string[];
}

export interface LegalTemplateDraft {
  id: string;
  code: string;
  titleEn: string;
  titleUr: string;
  statuteBadge: string;
  summaryEn: string;
  summaryUr: string;
  stampPaperValue: string;
  englishDraft: string;
  urduDraft: string;
}

export const PRECEDENT_ALERTS: PrecedentAlert[] = [
  {
    id: "alert-1",
    citation: "PLD 2025 SC 112",
    en: "PLD 2025 SC 112 — Supreme Court rules wife cannot be forced to forfeit Haq Mehr in Khula caused by husband's fault.",
    ur: "PLD 2025 SC 112 — سپریم کورٹ کا فیصلہ: شوہر کی زیادتی یا قصور کی بنا پر خلع کی صورت میں بیوی کو حق مہر چھوڑنے پر مجبور نہیں کیا جا سکتا۔",
  },
  {
    id: "alert-2",
    citation: "SEC 22-A CrPC",
    en: "CITIZEN PROTECTION (SEC 22-A CrPC) — If police refuse to register your FIR, approach the Justice of Peace immediately.",
    ur: "شہری تحفظ (دفعہ 22-A ضابطہ فوجداری) — اگر پولیس ایف آئی آر درج کرنے سے انکار کرے تو فوری طور پر جسٹس آف پیس (سیشن جج) سے رجوع کریں۔",
  },
  {
    id: "alert-3",
    citation: "PRO-BONO ROSTER",
    en: "24/7 FREE LEGAL AID HELPLINE — Verified pro-bono advocates available in Lahore, Karachi, Islamabad, Peshawar & Quetta.",
    ur: "مفت قانونی معاونت — لاہور، کراچی، اسلام آباد، پشاور اور کوئٹہ میں مستند پرو بونو وکلاء شہریوں کی رہنمائی کے لیے دستیاب ہیں۔",
  },
];

export const TRIAGE_ROADMAPS: Record<string, TriageRoadmap> = {
  "Family & Khula": {
    topicKey: "Family & Khula",
    labelEn: "Family & Khula",
    labelUr: "فیملی قوانین، خلع اور حق مہر",
    statuteBadge: "Family Courts Act 1964 · Sec 10 & PLD 2025 SC 112",
    protectionPlainEn:
      "You have an absolute statutory right to seek dissolution of marriage (Khula), recovery of unpaid Haq Mehr, dowry articles (Jahez), and interim child maintenance. Under recent Supreme Court rulings (PLD 2025 SC 112), if the breakdown of marriage is due to cruelty or fault of the husband, the Family Court cannot compel you to return your Haq Mehr.",
    protectionFormalEn:
      "Pursuant to Section 10(4) of the West Pakistan Family Courts Act, 1964 read with Section 2 of the Dissolution of Muslim Marriages Act, 1939 and the ratio decidendi in PLD 2025 SC 112, where reconciliation fails and khula is necessitated by spousal cruelty or desertion, restitution of dower (Haq Mehr) is not a sine qua non for passing a decree of dissolution.",
    protectionUr:
      "فیملی کورٹس ایکٹ 1964 اور سپریم کورٹ کے تازہ ترین فیصلے (PLD 2025 SC 112) کے تحت آپ کو خلع، حق مہر کی وصولی، سامانِ جہیز اور بچوں کے نان نفقہ کا مکمل قانونی حق حاصل ہے۔ اگر علیحدگی شوہر کے ظلم یا کوتاہی کی وجہ سے ہو تو حق مہر واپس کرنا لازم نہیں۔",
    documentsEn: [
      "Copy of registered Nikahnama (or NADRA Marriage Registration Certificate)",
      "CNIC copy of the petitioner & B-Form / Birth Certificates of children",
      "Signed list of Dowry Articles (Fehrist-e-Jahez) & receipts if available",
      "Medical reports, messages, or witness details showing cruelty/non-maintenance",
    ],
    documentsUr: [
      "رجسٹرڈ نکاح نامہ یا نادرا میرج سرٹیفکیٹ کی کاپی",
      "شناختی کارڈ اور بچوں کے ب فارم / پیدائشی سرٹیفکیٹ",
      "سامانِ جہیز کی فہرست اور رسیدیں (اگر موجود ہوں)",
      "نان نفقہ نہ دینے یا زیادتی کے شواہد / پیغامات",
    ],
    nextStepPlainEn:
      "File a consolidated Family Suit in the Family Court of the district where you currently reside (even if the Nikah took place in another city). The court must fix interim child maintenance on the first appearance and conclude dissolution proceedings within 6 months.",
    nextStepFormalEn:
      "Institute a composite plaint under Section 7 of the Family Courts Act, 1964 before the Family Judge having territorial jurisdiction under Rule 6 of the Family Courts Rules, 1965 (where the wife ordinarily resides), accompanied by an application under Section 17-A for interim maintenance.",
    nextStepUr:
      "اپنے موجودہ رہائشی ضلع کی فیملی کورٹ میں یکجا دعویٰ (خلع، حق مہر، نان نفقہ) دائر کریں۔ قانون کے مطابق عورت جس شہر میں مقیم ہو وہیں کیس دائر کر سکتی ہے اور عدالت دفعہ 17-A کے تحت فوری عبوری خرچہ مقرر کرنے کی پابند ہے۔",
    recommendedSpecialty: "Family & Constitutional Law",
  },
  "Property & Wirasat": {
    topicKey: "Property & Wirasat",
    labelEn: "Property & Wirasat",
    labelUr: "جائیداد، وراثت اور قبضہ واگزاری",
    statuteBadge: "Succession Act 1925 · Sec 42 Specific Relief Act · PPC 498-A",
    protectionPlainEn:
      "Every legal heir's share vests automatically the moment the deceased passes away. Depriving a female heir (mother, wife, sister, or daughter) of her Islamic inheritance share through fraudulent mutation or pressure is a criminal offence under Section 498-A PPC carrying up to 10 years imprisonment.",
    protectionFormalEn:
      "Under Islamic Law of Inheritance (Mirath) as enforced by the Supreme Court (PLD 1990 SC 1) and codified under Section 498-A of the Pakistan Penal Code, 1860, no period of limitation runs against a co-sharer in joint undivided family property, and fraudulent deprivation of female heirs is cognizable and punishable up to ten years rigorous imprisonment.",
    protectionUr:
      "مورث کی وفات کے فوراً بعد ہر شرعی وارث کا حصہ خود بخود قائم ہو جاتا ہے۔ کسی خاتون وارث (ماں، بیوی، بیٹی یا بہن) کو دھوکے یا دباؤ سے وراثت سے محروم کرنا تعزیراتِ پاکستان کی دفعہ 498-A کے تحت سنگین جرم ہے جس کی سزا 10 سال تک قید ہے۔",
    documentsEn: [
      "NADRA Family Registration Certificate (FRC) showing all legal heirs",
      "Official Death Certificate issued by Union Council / NADRA",
      "Certified Fard-e-Malkiyat / Registry / Allotment Letter of the property",
      "Biometric verification of heirs at NADRA Succession Facilitation Unit",
    ],
    documentsUr: [
      "نادرا فیملی رجسٹریشن سرٹیفکیٹ (FRC) جس میں تمام ورثاء درج ہوں",
      "یونین کونسل یا نادرا سے جاری شدہ ڈیتھ سرٹیفکیٹ",
      "جائیداد کی فردِ ملکیت، رجسٹری یا الاٹمنٹ لیٹر کی مصدقہ نقل",
      "نادرا سکسشن یونٹ میں ورثاء کی بائیو میٹرک تصدیق",
    ],
    nextStepPlainEn:
      "If all heirs agree, apply directly at NADRA for a Succession Certificate / Letter of Administration in 15 days without going to court. If another heir is refusing your share or trying to sell the property, file a Suit for Declaration, Partition & Permanent Injunction (Stay Order) under Section 42 Specific Relief Act.",
    nextStepFormalEn:
      "Submit an application under the Letters of Administration and Succession Certificates Act, 2020 before NADRA, or in case of a dispute, institute a Suit for Declaration, Separate Possession by Partition, and Permanent Injunction under Sections 42 & 54 of the Specific Relief Act, 1877 read with Order XXXIX Rules 1 & 2 CPC.",
    nextStepUr:
      "اگر تمام ورثاء متفق ہیں تو عدالت جائے بغیر نادرا سے 15 دن میں جانشینی سرٹیفکیٹ حاصل کریں۔ تنازع کی صورت میں سول کورٹ میں دعویٰ استقرارِ حق، تقسیمِ جائیداد اور حکمِ امتناعی (Stay Order) دائر کریں۔",
    recommendedSpecialty: "Property, Inheritance & Civil Litigation",
  },
  "Police FIR & Bail": {
    topicKey: "Police FIR & Bail",
    labelEn: "Police FIR & Bail",
    labelUr: "پولیس ایف آئی آر اور ضمانت (Bail)",
    statuteBadge: "CrPC Sec 154, Sec 22-A & Sec 497/498 · Art 10A Constitution",
    protectionPlainEn:
      "Under Section 154 CrPC, the Station House Officer (SHO) is legally bound to register an FIR if your complaint discloses a cognizable offence. Conversely, if a false or mala fide FIR is registered against you, you can seek Pre-Arrest Bail (Protective/Ad-Interim Bail) under Section 498 CrPC so police cannot arrest you.",
    protectionFormalEn:
      "Pursuant to Section 154 of the Code of Criminal Procedure, 1898, registration of First Information Report is mandatory upon disclosure of a cognizable offence. Where police fail to act, the Ex-Officio Justice of Peace (Sessions Judge) exercises supervisory jurisdiction under Section 22-A(6) CrPC. Pre-arrest bail lies under Section 498 CrPC upon establishing mala fide.",
    protectionUr:
      "ضابطہ فوجداری کی دفعہ 154 کے تحت قابلِ دست اندازی جرم کی اطلاع پر ایس ایچ او ایف آئی آر درج کرنے کا پابند ہے۔ اور اگر آپ کے خلاف جھوٹی ایف آئی آر درج کی گئی ہو تو آپ دفعہ 498 کے تحت ضمانت قبل از گرفتاری حاصل کر کے گرفتاری سے بچ سکتے ہیں۔",
    documentsEn: [
      "Written application signed by complainant with exact date, time & place of incident",
      "Receiving diary number / stamp from the Police Station Front Desk or SP Complaint Cell",
      "Medico-Legal Certificate (MLC) or financial/property proof of the offence",
      "CNIC copy & two solvent sureties (if applying for Pre-Arrest or Post-Arrest Bail)",
    ],
    documentsUr: [
      "وقوعہ کی تاریخ، وقت اور تفصیلات پر مشتمل تحریری درخواست",
      "تھانہ فرنٹ ڈیسک یا ایس پی کمپلینٹ سیل کی ڈائری نمبر رسید",
      "میڈیکو لیگل سرٹیفکیٹ (MLC) یا دیگر دستاویزی شواہد",
      "شناختی کارڈ اور ضمانت کے لیے دو معتبر ضامن",
    ],
    nextStepPlainEn:
      "First submit a written complaint at the Police Station Front Desk and get a computerised diary tag. If the SHO does not register the FIR within 24–48 hours, file a complaint to the SP Operations and then a Section 22-A Petition before the Sessions Judge.",
    nextStepFormalEn:
      "Obtain a computerized Police Station Diary Tag, escalate via representation to the Superintendent of Police (Complaints), and thereafter move a petition under Section 22-A & 22-B CrPC before the learned Sessions Judge / Ex-Officio Justice of Peace for a direction to register the FIR.",
    nextStepUr:
      "پہلے تھانے کے فرنٹ ڈیسک پر تحریری درخواست جمع کروا کر کمپیوٹرائزڈ رسید لیں۔ شنوائی نہ ہونے پر ایس پی کمپلینٹ سیل اور پھر سیشن جج (جسٹس آف پیس) کی عدالت میں دفعہ 22-A کی پٹیشن دائر کریں۔",
    recommendedSpecialty: "Criminal Defense, Bail & Constitutional Writ",
  },
  "FIA Cyber Harassment": {
    topicKey: "FIA Cyber Harassment",
    labelEn: "FIA Cyber Harassment",
    labelUr: "ایف آئی اے سائبر ہراسانی اور آن لائن فراڈ",
    statuteBadge: "PECA 2016 · Sec 20, 21, 24 & FIA NCCS",
    protectionPlainEn:
      "Non-consensual sharing of photos/videos, doctored images, blackmail, online stalking, and financial banking fraud are strict non-bailable offences under the Prevention of Electronic Crimes Act (PECA) 2016 (Sections 20, 21 & 24), carrying up to 5–7 years imprisonment and heavy fines.",
    protectionFormalEn:
      "Under Sections 20, 21, and 24 of the Prevention of Electronic Crimes Act, 2016 (PECA), offenses against the modesty of a natural person, non-consensual transmission of intimate visual material, and cyber stalking are cognizable by the National Cyber Crime Investigation Agency / FIA Cyber Crime Wing.",
    protectionUr:
      "پیکا ایکٹ (PECA 2016) کی دفعات 20، 21 اور 24 کے تحت کسی کی تصاویر یا ویڈیوز بغیر اجازت شیئر کرنا، بلیک میلنگ، ہراسانی اور آن لائن بینکنگ فراڈ سنگین ناقابلِ ضمانت جرائم ہیں جن کی سزا 5 سے 7 سال تک قید ہے۔",
    documentsEn: [
      "Unedited screenshots showing full URLs, profile links, phone numbers & timestamps",
      "Screen recording of the offending messages, threats, or fake social media account",
      "Bank transaction receipts / IBAN details (in case of online financial fraud)",
      "Copy of your CNIC & registered mobile SIM ownership details",
    ],
    documentsUr: [
      "مکمل یو آر ایل (URL)، فون نمبر اور وقت سمیت اصل اسکرین شاٹس",
      "دھمکی آمیز پیغامات یا جعلی اکاؤنٹ کی اسکرین ریکارڈنگ",
      "آن لائن مالی فراڈ کی صورت میں بینک ٹرانزیکشن سلپ",
      "شناختی کارڈ کی کاپی اور موبائل نمبر کی تفصیلات",
    ],
    nextStepPlainEn:
      "Do not delete the messages—preserve the device for digital forensics. File an immediate complaint with the FIA Cyber Crime Reporting Center (or call Helpline 1991) and request blocking of the offending URLs via PTA alongside criminal prosecution.",
    nextStepFormalEn:
      "Lodge a formal complaint before the Circle In-Charge, FIA Cyber Crime Wing / NCCS for forensic preservation of electronic evidence under Section 33 of PECA 2016 and registration of an inquiry culminating in an FIR before the designated PECA Special Court.",
    nextStepUr:
      "ثبوت ہرگز ڈیلیٹ نہ کریں تاکہ ڈیجیٹل فرانزک ہو سکے۔ فوری طور پر ایف آئی اے سائبر کرائم ونگ (ہیلپ لائن 1991) میں تحریری شکایت درج کروائیں اور پی ٹی اے کے ذریعے مواد بلاک کروائیں۔",
    recommendedSpecialty: "Cyber Crime (PECA) & Digital Forensics",
  },
  "Cheque Dishonour 489-F": {
    topicKey: "Cheque Dishonour 489-F",
    labelEn: "Cheque Dishonour 489-F",
    labelUr: "چیک باؤنس (دفعہ 489-F) اور رقم کی ریکوری",
    statuteBadge: "PPC Sec 489-F & Order XXXVII CPC (Summary Suit)",
    protectionPlainEn:
      "Dishonouring a cheque issued dishonesly to repay a loan or fulfill a business obligation is a criminal offence under Section 489-F PPC (up to 3 years imprisonment). Simultaneously, you can file a fast-track Summary Recovery Suit under Order XXXVII CPC directly before the District & Sessions Judge.",
    protectionFormalEn:
      "Section 489-F of the Pakistan Penal Code, 1860 penalizes dishonestly issuing a cheque towards repayment of a loan or fulfillment of an obligation which is dishonoured on presentation. Parallel civil recovery lies via Summary Suit on Negotiable Instruments under Order XXXVII of the Code of Civil Procedure, 1908.",
    protectionUr:
      "قرض کی واپسی یا کاروباری ذمہ داری کے لیے دیا گیا چیک باؤنس ہونا تعزیراتِ پاکستان کی دفعہ 489-F کے تحت جرم ہے (3 سال تک قید)۔ اس کے ساتھ آپ آرڈر 37 کے تحت سیشن کورٹ میں فوری رقم واپسی کا سمری دعویٰ بھی دائر کر سکتے ہیں۔",
    documentsEn: [
      "Original dishonoured cheque along with the official Bank Return Memo",
      "Underlying agreement, invoice, receipt, or WhatsApp ledger proving the obligation",
      "15-day formal Legal Notice sent via Registered Post / Courier AD",
      "Copy of CNIC & bank statement of the complainant",
    ],
    documentsUr: [
      "اصل باؤنس شدہ چیک اور بینک کا آفیشل ریٹرن میمو (Return Memo)",
      "لین دین کا معاہدہ، رسید یا کاروباری ریکارڈ جس کے تحت چیک دیا گیا",
      "رجسٹرڈ ڈاک کے ذریعے بھیجا گیا 15 روزہ قانونی نوٹس",
      "درخواست گزار کا شناختی کارڈ اور بینک اسٹیٹمنٹ",
    ],
    nextStepPlainEn:
      "Ensure the bank stamps the Original Return Memo with the exact reason ('Insufficient Funds' or 'Account Closed'). Serve a formal Legal Notice immediately, lodge an application for a Section 489-F FIR, and institute an Order XXXVII Summary Suit for principal + markup recovery.",
    nextStepFormalEn:
      "Obtain the original Bank Dishonour Memo, serve a statutory Legal Demand Notice, submit an application under Section 154 CrPC for registration of an FIR under Section 489-F PPC, and file a Summary Suit under Order XXXVII Rules 1 & 2 CPC before the District Judge.",
    nextStepUr:
      "بینک سے اصل ریٹرن میمو حاصل کریں جس پر چیک مسترد ہونے کی وجہ درج ہو۔ فوری طور پر قانونی نوٹس بھجوائیں، دفعہ 489-F کی ایف آئی آر کے لیے درخواست دیں اور سیشن کورٹ میں آرڈر 37 کا دعویٰ دائر کریں۔",
    recommendedSpecialty: "Commercial, Banking & Criminal Recovery",
  },
};

export const SPOTLIGHT_BRIEFINGS: SpotlightBriefing[] = [
  {
    id: "briefing-wirasat-2025",
    citation: "PLD 2024 SC 308 · Letters of Administration Act 2020",
    categoryEn: "Inheritance & Property Law",
    categoryUr: "قانونِ وراثت و جائیداد",
    readTime: "5 min read",
    audioDuration: "01:45",
    titleEn:
      "Understanding Women's Inheritance Rights (Wirasat) & NADRA Letters of Administration",
    titleUr:
      "پاکستان میں خواتین کے وراثتی حقوق اور نادرا انتقال کا مکمل طریقہ کار",
    subtitleEn:
      "How daughters, widows, and sisters can secure their succession certificates in 15 days through NADRA and nullify fraudulent mutations under Supreme Court precedent.",
    plainSummaryEn:
      "In Pakistan, a woman's share in family inheritance (Wirasat) becomes hers automatically the moment her father, husband, or brother passes away. No brother or family member can legally ask her to 'forgive' or sign away her share without first transferring possession or paying full market value.\n\n1. Fast-Track NADRA Succession (15 Days): When there is no dispute among heirs, you no longer need to spend years in civil court. Apply at any NADRA Succession Facilitation Unit with the Death Certificate, Family Registration Certificate (FRC), and property documents. Biometric verification of heirs can even be done remotely from abroad.\n\n2. Criminal Penalty for Depriving Women (Sec 498-A PPC): Forcing or deceiving a woman out of her inheritance is a non-compoundable offence carrying 5 to 10 years in prison.\n\n3. No Time Limit (Limitation) Against Fraud: The Supreme Court has repeatedly ruled that limitation law does not protect brothers who secretly transfer joint family land into their own names. Even a mutation from 20 years ago can be cancelled by the Civil Court.",
    formalTextEn:
      "STATUTORY & JUDICIAL DOSSIER — INHERITANCE (MIRATH) & LETTERS OF ADMINISTRATION ACT, 2020\n\n1. Automatic Vesting of Estate: As settled by the Hon'ble Supreme Court of Pakistan in Ghulam Ali v. Mst. Ghulam Sarwar Naqvi (PLD 1990 SC 1) and reiterated in recent 2024–2025 jurisprudence, succession opens immediately upon the demise of the propositus. Every co-sharer holds constructive possession on behalf of all female co-heirs.\n\n2. Invalidity of Uncompensated Relinquishment (Tanazul): Any purported relinquishment deed, oral gift, or consent mutation stripping a female heir of her Quranic sharer entitlement without independent consideration and actual delivery of possession is void ab initio as being opposed to public policy under Section 23 of the Contract Act, 1872.\n\n3. Penal Sanction under Section 498-A PPC: Whoever by deceitful or illegal means deprives any woman from inheriting any movable or immovable property at the time of opening of succession shall be punished with imprisonment for either description for a term which may extend to ten years but not be less than five years.",
    urduSummary:
      "پاکستانی قانون اور سپریم کورٹ کے فیصلوں کے مطابق مورث کے انتقال کے فوراً بعد بیٹی، بیوہ، ماں اور بہن کا شرعی حصہ خود بخود ان کی ملکیت بن جاتا ہے۔ خاندان کے دباؤ میں آ کر بغیر معاوضہ حصہ معاف کروانا قانونی طور پر کالعدم ہے۔\n\n١۔ نادرا جانشینی سرٹیفکیٹ: اگر تمام ورثاء متفق ہوں تو عدالت جانے کے بجائے نادرا سکسشن یونٹ سے صرف 15 دن میں جانشینی سرٹیفکیٹ اور لیٹر آف ایڈمنسٹریشن حاصل کیا جا سکتا ہے۔ بیرونِ ملک مقیم ورثاء آن لائن بائیو میٹرک تصدیق کروا سکتے ہیں۔\n\n٢۔ دفعہ 498-A کے تحت سزا: کسی خاتون کو دھوکہ دہی یا دباؤ سے وراثت سے محروم کرنے والے شخص کو 5 سے 10 سال تک قید اور بھاری جرمانے کی سزا ہو سکتی ہے۔\n\n٣۔ میعاد کا قانون لاگو نہیں ہوتا: سپریم کورٹ نے واضح کیا ہے کہ وراثتی دھوکہ دہی میں وقت گزرنے کی کوئی قید نہیں؛ سالہا سال پرانا جعلی انتقال بھی سول کورٹ کے ذریعے منسوخ کروایا جا سکتا ہے۔",
    author: "Adv. Sara Mansoor, ASC",
  },
  {
    id: "briefing-bail-497",
    citation: "2025 SCMR 419 · Section 497(2) CrPC",
    categoryEn: "Criminal Procedure & Liberty",
    categoryUr: "ضابطہ فوجداری و ضمانت",
    readTime: "4 min read",
    audioDuration: "01:30",
    titleEn:
      "Supreme Court Post-Arrest Bail Guidelines Under Section 497 CrPC",
    titleUr: "دفعہ 497 کے تحت ضمانت اور ’مزید تحقیق‘ کے نئے عدالتی اصول",
    subtitleEn:
      "Why bail cannot be withheld as punishment and how the Doctrine of Further Inquiry protects citizens before conviction.",
    plainSummaryEn:
      "Arrest should never be used as a tool of punishment before a person is proven guilty at trial. Under Section 497(2) of the Code of Criminal Procedure, if there are reasonable grounds to believe that the case requires 'further inquiry' into the accused's guilt, bail becomes a matter of right—not a favour.\n\nKey Factors That Entitle an Accused to Bail:\n• Unexplained delay in registering the FIR suggesting consultation and fabrication.\n• Contradiction between the eye-witness account and the medical report (MLC).\n• Non-recovery of any incriminating weapon or stolen property from the accused.\n• Statutory Delay: If the trial is not concluded within 1 year for non-capital offences (or 2 years for capital offences) without the fault of the accused, the accused is entitled to bail as of right.",
    formalTextEn:
      "SUPREME COURT JURISPRUDENCE — SECTION 497(2) CrPC & STATUTORY DELAY\n\n1. Scope of Tentative Assessment: At the bail stage, the Court is proscribed from conducting a deeper appreciation of evidence; rather, only a tentative assessment of the record under Section 173 CrPC, medical evidence, and recovery memos is permissible.\n\n2. Case of Further Inquiry: Where the prosecution narrative suffers from mala fide, unexplained delay in lodging the First Information Report, or a material conflict between ocular and medical testimony, the case squarely falls within the ambit of sub-section (2) of Section 497 CrPC, rendering the grant of bail a right rather than a concession.\n\n3. Third Proviso to Section 497(1) CrPC: Statutory delay in conclusion of trial, not attributable to the accused or any person acting on his behalf, matures into an independent statutory ground for release on bail.",
    urduSummary:
      "سپریم کورٹ آف پاکستان کے اصولوں کے مطابق جرم ثابت ہونے سے پہلے کسی شہری کو بطور سزا جیل میں نہیں رکھا جا سکتا۔ ضابطہ فوجداری کی دفعہ 497(2) کے تحت اگر مقدمے میں شک و شبہ ہو اور ’مزید تحقیق‘ (Further Inquiry) کی گنجائش نکلتی ہو تو ضمانت ملزم کا قانونی حق بن جاتی ہے۔\n\nضمانت کے اہم نکات:\n• ایف آئی آر کے اندراج میں بلا جواز تاخیر جو مشاورت اور جھوٹ کی نشاندہی کرے۔\n• گواہوں کے بیان اور میڈیکل رپورٹ (MLC) میں واضح تضاد۔\n• ملزم سے کسی آلۂ قتل یا مالِ مسروقہ کی برآمدگی نہ ہونا۔\n• قانونی تاخیر (Statutory Delay): اگر ملزم کی غلطی کے بغیر ٹرائل مقررہ مدت میں مکمل نہ ہو سکے تو ضمانت بطورِ حق منظور کی جاتی ہے۔",
    author: "Adv. Zafarullah Khan, ASC",
  },
  {
    id: "briefing-fir-22a",
    citation: "PLD 2024 SC 612 · Sec 154 & 22-A CrPC",
    categoryEn: "Police Accountability",
    categoryUr: "پولیس احتساب و شہری حقوق",
    readTime: "4 min read",
    audioDuration: "01:20",
    titleEn:
      "What to Do When Police Refuse an FIR: Section 154 & 22-A Petition Guide",
    titleUr:
      "پولیس ایف آئی آر درج نہ کرے تو دفعہ 22-A کی درخواست کیسے دیں؟",
    subtitleEn:
      "Step-by-step protocol from the Police Front Desk Diary Number to the Ex-Officio Justice of Peace (Sessions Court).",
    plainSummaryEn:
      "A common frustration for citizens across Pakistan is when the local police station delays or refuses to register an FIR. The law gives you a clear, binding escalation path:\n\nStep 1 — Police Front Desk Tag: Submit your written complaint at the Police Station Front Desk (or send it via registered post with AD receipt) and obtain the computerised E-Tag number.\n\nStep 2 — SP Complaint Cell: Following the Supreme Court's Sughran Bibi judgment, submit a copy to the District SP Complaints.\n\nStep 3 — Section 22-A Petition before Sessions Judge: If no FIR is registered, your advocate files a petition under Section 22-A(6) CrPC before the Sessions Judge (acting as Ex-Officio Justice of Peace), who can summon the SHO's comments within days and issue a binding judicial order to register the FIR.",
    formalTextEn:
      "PROCEDURAL MANDATE UNDER SECTIONS 154 & 22-A(6) CODE OF CRIMINAL PROCEDURE, 1898\n\n1. Mandatory Nature of Section 154 CrPC: Whenever information relating to the commission of a cognizable offence is conveyed to an officer in charge of a police station, he is under a statutory duty to reduce the same into writing in the prescribed register without embarking upon a preliminary investigation prior to registration.\n\n2. Exhaustion of Departmental Hierarchy (PLD 2018 SC 595): Prior to invoking the jurisdiction of the Ex-Officio Justice of Peace under Section 22-A(6) CrPC, the aggrieved informant should evidence approach to the SHO and the Superintendent of Police (Complaints).\n\n3. Judicial Direction: Upon satisfaction that the information discloses a cognizable offence and the police have failed in their statutory duty, the learned Justice of Peace directs immediate registration of the FIR.",
    urduSummary:
      "اکثر شہریوں کو شکایت ہوتی ہے کہ تھانہ پولیس ایف آئی آر درج کرنے میں ٹال مٹول سے کام لیتی ہے۔ قانون نے اس کا واضح اور بااختیار حل دیا ہے:\n\nمرحلہ ١ — تھانہ فرنٹ ڈیسک رسید: اپنی تحریری درخواست تھانے کے فرنٹ ڈیسک پر جمع کروائیں اور کمپیوٹرائزڈ ڈائری نمبر حاصل کریں (یا رجسٹرڈ ڈاک کے ذریعے بھجوائیں)۔\n\nمرحلہ ٢ — ایس پی کمپلینٹ سیل: سپریم کورٹ کے فیصلے کے مطابق ضلعی ایس پی کمپلینٹس کو درخواست کی کاپی جمع کروائیں۔\n\nمرحلہ ٣ — سیشن جج کے سامنے دفعہ 22-A کی پٹیشن: شنوائی نہ ہونے پر سیشن جج (جسٹس آف پیس) کی عدالت میں دفعہ 22-A کی درخواست دائر کریں۔ عدالت ایس ایچ او سے جواب طلب کر کے فوری مقدمہ درج کرنے کا حکم دیتی ہے۔",
    author: "Adv. Kamran Tariq, AHC",
  },
  {
    id: "briefing-peca-cyber",
    citation: "PECA 2016 · Sections 20, 21 & 24",
    categoryEn: "Digital Rights & Cyber Law",
    categoryUr: "سائبر کرائم اور ڈیجیٹل حقوق",
    readTime: "5 min read",
    audioDuration: "01:50",
    titleEn:
      "Protection Against Online Defamation, Blackmail & Financial Fraud Under PECA",
    titleUr:
      "سائبر کرائم، بلیک میلنگ اور آن لائن فراڈ کے خلاف قانونی کارروائی",
    subtitleEn:
      "How to preserve admissible forensic digital evidence and freeze fraudulent bank accounts through FIA & NCCS.",
    plainSummaryEn:
      "Whether you are facing WhatsApp blackmail, non-consensual sharing of family photographs, fake impersonation profiles, or unauthorized mobile banking transfers, Pakistani law provides immediate criminal remedies under PECA 2016:\n\n• Section 21 (Modesty & Intimate Images): Sharing, morphing, or threatening to share private photos/videos carries up to 5 years imprisonment and Rs. 5 million fine. It is a non-bailable offence.\n• Section 24 (Cyber Stalking): Repeatedly harassing, coercing, or monitoring someone online despite clear disinterest is punishable up to 3 years imprisonment.\n• Immediate Action for Banking Fraud: Call your bank's helpline within the first golden hour to request a dispute mark on the recipient IBAN via 1-Link, and file an online complaint with FIA Cyber Crime (Helpline 1991).",
    formalTextEn:
      "PREVENTION OF ELECTRONIC CRIMES ACT, 2016 (PECA) & QANUN-E-SHAHADAT ARTICLE 164\n\n1. Admissibility of Electronic Evidence: Pursuant to Article 164 of the Qanun-e-Shahadat Order, 1984 read with the Electronic Transactions Ordinance, 2002, digital logs, Uniform Resource Locators (URLs), device hashes, and forensic extraction reports generated by the FIA Digital Forensics Lab constitute primary admissible evidence.\n\n2. Offences Against Modesty & Cyber Stalking (Sections 21 & 24 PECA): Superimposing, transmitting, or threatening to distribute intimate visual data of a natural person is a cognizable, non-bailable, and non-compoundable offence triable exclusively by the notified PECA Special Court.",
    urduSummary:
      "واٹس ایپ بلیک میلنگ، بغیر اجازت تصاویر یا ویڈیوز پھیلانا، جعلی سوشل میڈیا اکاؤنٹ بنانا یا آن لائن بینکنگ فراڈ پیکا ایکٹ (PECA 2016) کے تحت سنگین جرائم ہیں:\n\n• دفعہ 21 (تصاویر کا غلط استعمال اور بلیک میلنگ): کسی شخص کی نجی تصاویر ایڈٹ کرنا، شیئر کرنا یا دھمکی دینا ناقابلِ ضمانت جرم ہے جس کی سزا 5 سال تک قید اور 50 لاکھ روپے تک جرمانہ ہے۔\n• دفعہ 24 (سائبر اسٹاکنگ): آن لائن پیچھا کرنا اور بار بار ہراساں کرنا قابلِ سزا جرم ہے۔\n• آن لائن بینکنگ فراڈ میں فوری اقدام: فراڈ ہوتے ہی پہلے گھنٹے کے اندر اپنے بینک کی ہیلپ لائن پر کال کر کے 1-Link کے ذریعے متعلقہ اکاؤنٹ منجمد (Dispute Mark) کروائیں اور ایف آئی اے ہیلپ لائن 1991 پر اطلاع دیں۔",
    author: "Adv. Ayesha Siddiqui, AHC",
  },
];

export const CLAUSE_DECODER_GROUPS: ClauseDocumentGroup[] = [
  {
    key: "nikahnama",
    labelEn: "Standard Nikahnama (Clauses 13–21)",
    labelUr: "نکاح نامہ کی شقیں (13 تا 21)",
    statuteRef: "Muslim Family Laws Ordinance, 1961 · Form II",
    clauses: [
      {
        id: "nikah-13-16",
        clauseNumber: "Clauses 13–16",
        titleEn: "Amount & Mode of Haq Mehr (Prompt vs. Deferred Dower)",
        titleUr: "حق مہر کی مقدار اور قسم (معجل یا غیر معجل)",
        officialEn:
          "Clause 13: Amount of Dower. Clause 14: How much of the dower is Mu'ajjal (prompt) and how much is Ghair Mu'ajjal (deferred). Clause 16: Whether any property was given in lieu of the whole or any portion of the dower, with specification.",
        officialUr:
          "شق 13 تا 16: مہر کی رقم کتنی ہے، اس میں سے کتنا معجل (فوری واجب الادا) ہے اور کتنا عندالطلب/غیر معجل ہے، اور کیا مہر کے عوض کوئی جائیداد دی گئی ہے۔",
        meaningEn:
          "Mu'ajjal (Prompt) dower is payable immediately upon marriage whenever the wife demands it—she can legally refuse conjugal restitution until it is paid. Any property written in Clause 16 transfers legally to the bride via the Nikahnama itself.",
        meaningUr:
          "مہرِ معجل شادی کے فوراً بعد بیوی کے مطالبے پر واجب الادا ہوتا ہے۔ شق 16 میں درج کی گئی جائیداد یا سونا نکاح نامے کے ذریعے ہی دلہن کی قانونی ملکیت بن جاتی ہے۔",
        redFlagEn:
          "Never allow 'Shara'i Mehr' or token amounts to be written without the bride's informed consent, and ensure any gold or plot promised at marriage is explicitly itemised in Clause 16.",
        redFlagUr:
          "احتیاط: دلہن کی مرضی کے بغیر محض برائے نام رقم نہ لکھنے دیں، اور شادی کے وقت دیا جانے والا سونا یا پلاٹ لازمی شق 16 میں تفصیل سے درج کروائیں۔",
      },
      {
        id: "nikah-17",
        clauseNumber: "Clause 17",
        titleEn: "Special Conditions, Monthly Pocket Money & Domicile",
        titleUr: "خاص شرائط، ماہانہ جیب خرچ اور رہائش کی شرط",
        officialEn:
          "Clause 17: Special conditions, if any (Khaas Sharait, agar کوئی hon).",
        officialUr: "شق 17: خاص شرائط، اگر کوئی ہوں۔",
        meaningEn:
          "This is the most powerful protective clause in a Pakistani Nikahnama. The bride and groom can mutually stipulate a fixed monthly pocket money (Kharcha-e-Pandan), the wife's right to continue her education/career, or separate accommodation.",
        meaningUr:
          "یہ نکاح نامے کی انتہائی اہم شق ہے۔ اس میں دلہن کا ماہانہ جیب خرچ، تعلیم و ملازمت جاری رکھنے کا حق، اور الگ مناسب رہائش کی شرط باہمی رضامندی سے لکھی جا سکتی ہے۔",
        redFlagEn:
          "Nikah Khwans routinely draw a line through Clause 17 ('N/A') before bringing the form for signatures. Inspect the form BEFORE the ceremony and write agreed monthly maintenance clearly.",
        redFlagUr:
          "احتیاط: اکثر نکاح خواں پوچھے بغیر شق 17 پر لکیر پھیر دیتے ہیں۔ دستخط سے پہلے فارم چیک کریں اور ماہانہ خرچہ و شرائط واضح طور پر درج کروائیں۔",
      },
      {
        id: "nikah-18",
        clauseNumber: "Clause 18",
        titleEn: "Delegated Right of Divorce (Haq-e-Talaq-e-Tafweez)",
        titleUr: "طلاق تفویض کا حق (عورت کا حقِ طلاق)",
        officialEn:
          "Clause 18: Whether the husband has delegated the power of divorce to the wife. If so, under what conditions.",
        officialUr:
          "شق 18: آیا شوہر نے طلاق کا حق بیوی کو تفویض کر دیا ہے؟ اگر ہاں تو کن شرائط کے تحت؟",
        meaningEn:
          "If 'Yes' is written in Clause 18, the wife can end the marriage through the Union Council arbitration process (Section 7 MFLO) WITHOUT going through a lengthy court Khula or giving up her Haq Mehr.",
        meaningUr:
          "اگر شق 18 میں ’ہاں‘ لکھا ہو تو بیوی اپنا حقِ مہر چھوڑے بغیر اور لمبی عدالتی کارروائی کے بغیر یونین کونسل کے ذریعے باعزت طور پر نکاح ختم کر سکتی ہے۔",
        redFlagEn:
          "Under Punjab & ICT amendments, the Nikah Khwan is legally bound to ask both parties about Clause 18. Crossing it out unilaterally without asking is a punishable violation.",
        redFlagUr:
          "احتیاط: قانون کے مطابق نکاح خواں فریقین سے شق 18 کے بارے میں پوچھنے کا پابند ہے۔ بغیر اجازت اس شق کو کاٹنا غیر قانونی ہے۔",
      },
      {
        id: "nikah-21",
        clauseNumber: "Clause 21",
        titleEn: "Restriction on Husband's Second Marriage (Polygamy Consent)",
        titleUr: "پہلی بیوی کی اجازت کے بغیر دوسری شادی پر پابندی",
        officialEn:
          "Clause 21: Whether the husband has any existing wife, and if so, whether he has secured permission of the Arbitration Council under the Muslim Family Laws Ordinance, 1961.",
        officialUr:
          "شق 21: آیا شوہر کی پہلے سے کوئی بیوی موجود ہے، اور اگر ہے تو کیا اس نے مسلم عائلی قوانین مجریہ 1961 کے تحت ثالثی کونسل سے دوسری شادی کی اجازت حاصل کر لی ہے؟",
        meaningEn:
          "Under Section 6 of the Muslim Family Laws Ordinance 1961, contracting a second marriage without prior written permission of the first wife and Arbitration Council makes the entire deferred Haq Mehr immediately payable and attracts up to 1 year imprisonment.",
        meaningUr:
          "مسلم فیملی لاز آرڈیننس کی دفعہ 6 کے تحت پہلی بیوی اور ثالثی کونسل کی تحریری اجازت کے بغیر دوسری شادی کرنے پر پہلی بیوی کا پورا مہر فوری واجب الادا ہو جاتا ہے اور شوہر کو قید و جرمانے کی سزا ہو سکتی ہے۔",
        redFlagEn:
          "Always verify the groom's NADRA Marital Status and ensure Clause 21 is accurately filled and attested by the Union Council Nikah Registrar.",
        redFlagUr:
          "احتیاط: نکاح سے قبل نادرا ریکارڈ کی تصدیق کریں اور یقینی بنائیں کہ شق 21 درست طریقے سے پر کی گئی ہے۔",
      },
    ],
  },
  {
    key: "fir",
    labelEn: "Police FIR Format (Sec 154)",
    labelUr: "پولیس ایف آئی آر کا فارمیٹ (دفعہ 154)",
    statuteRef: "Code of Criminal Procedure, 1898 · Form 24.5(1)",
    clauses: [
      {
        id: "fir-col-1-2",
        clauseNumber: "Columns 1 & 2",
        titleEn: "Date & Hour of Occurrence vs. Date Reported to Police",
        titleUr: "وقوعہ کی تاریخ و وقت اور تھانے میں اطلاع کا وقت",
        officialEn:
          "Column 1: Date and hour of occurrence. Column 2: Date and hour when reported, and name of informant/complainant.",
        officialUr:
          "کالم 1 اور 2: وقوعہ کی تاریخ اور وقت، اور تھانے میں اطلاع دینے کی تاریخ و وقت مع نام مستغیث۔",
        meaningEn:
          "The gap between when the crime happened (Col 1) and when it was reported (Col 2) is one of the most heavily scrutinized details in court. An unexplained delay of even 12–24 hours gives the accused a strong ground for bail.",
        meaningUr:
          "وقوعہ کے وقت اور ایف آئی آر درج ہونے کے وقت کا فرق عدالت میں سب سے زیادہ پرکھا جاتا ہے۔ بلا جواز تاخیر سے ملزم کو ضمانت میں بڑا فائدہ مل سکتا ہے۔",
        redFlagEn:
          "If police delayed registering your FIR after you arrived at the station, explicitly state in the body of your complaint the exact time you first submitted your application at the Front Desk.",
        redFlagUr:
          "احتیاط: اگر تاخیر پولیس کی طرف سے ہوئی ہے تو متن میں واضح لکھیں کہ آپ نے کس تاریخ اور وقت پر فرنٹ ڈیسک پر درخواست جمع کروائی تھی۔",
      },
      {
        id: "fir-col-3",
        clauseNumber: "Column 3",
        titleEn: "Brief Description of Offence & Penal Sections Applied",
        titleUr: "جرم کی مختصر کیفیت اور لگائی گئی قانونی دفعات",
        officialEn:
          "Column 3: Brief description of offence with section of law, and details of property carried off, if any.",
        officialUr:
          "کالم 3: جرم کی مختصر تفصیل مع دفعہ قانون اور اگر کوئی مال چھینا یا چرایا گیا ہو تو اس کی تفصیل۔",
        meaningEn:
          "The penal sections written here (e.g., PPC 302, 420, 489-F, 379) determine whether the offence is Bailable or Non-Bailable and which court will try the case.",
        meaningUr:
          "اس کالم میں درج دفعات سے طے ہوتا ہے کہ جرم قابلِ ضمانت ہے یا ناقابلِ ضمانت، اور کیس کس عدالت میں چلے گا۔",
        redFlagEn:
          "Check that police have not deliberately omitted non-bailable sections to favour the opposite party, or added exaggerated sections in a civil dispute.",
        redFlagUr:
          "احتیاط: چیک کریں کہ پولیس نے مخالف فریق کو فائدہ پہنچانے کے لیے اہم ناقابلِ ضمانت دفعات حذف تو نہیں کر دیں۔",
      },
      {
        id: "fir-col-6",
        clauseNumber: "Narrative Body",
        titleEn: "The First Information Statement (Matan-e-FIR)",
        titleUr: "ایف آئی آر کا اصل متن اور واقعہ کی تفصیل",
        officialEn:
          "First Information of a Cognizable Crime Reported under Section 154, Code of Criminal Procedure (Matan).",
        officialUr:
          "اطلاع ابتدائی بابت جرم قابلِ دست اندازی پولیس زیر دفعہ 154 ضابطہ فوجداری (متنِ درخواست)۔",
        meaningEn:
          "This is the foundation of the entire prosecution case. It must clearly state WHO did WHAT, with WHICH weapon/means, in front of WHICH witnesses, and WHY.",
        meaningUr:
          "یہ پورے فوجداری مقدمے کی بنیاد ہے۔ اس میں واضح ہونا چاہیے کہ کس ملزم نے، کس ہتھیار یا طریقے سے، کن گواہوں کے سامنے کیا جرم کیا۔",
        redFlagEn:
          "Never let a police Moharrir dictate dramatic or false roles for an entire family ('throwing a wide net'). Courts disbelieve FIRs that falsely implicate 8–10 relatives.",
        redFlagUr:
          "احتیاط: محرر کے کہنے پر پورے خاندان کو جھوٹا نامزد نہ کریں؛ عدالتیں ایسی مبالغہ آمیز ایف آئی آر کو مشکوک قرار دے دیتی ہیں۔",
      },
      {
        id: "fir-police-karwai",
        clauseNumber: "Police Karwai",
        titleEn: "Police Action Note & Investigation Officer Assignment",
        titleUr: "کارروائی پولیس اور تفتیشی افسر (IO) کا تقرر",
        officialEn:
          "Action taken by Police (Karwai Police): Registration of case, dispatch of copies to Area Magistrate, and handover to Investigation Wing.",
        officialUr:
          "کارروائی پولیس: مقدمہ کا اندراج، علاقہ مجسٹریٹ کو نقول کی ترسیل اور تفتیشی ونگ کے سپردگی۔",
        meaningEn:
          "Under the Police Order 2002, the officer who registers the FIR cannot investigate it—the case must be handed over to an officer of the Investigation Wing.",
        meaningUr:
          "پولیس آرڈر 2002 کے تحت مقدمہ درج کرنے والا افسر خود تفتیش نہیں کر سکتا بلکہ کیس تفتیشی ونگ کے حوالے کیا جاتا ہے۔",
        redFlagEn:
          "If the Investigation Officer (IO) is biased or demanding bribes, you have the right to apply to the SP Investigation for a Transfer of Investigation before the Standing Board.",
        redFlagUr:
          "احتیاط: اگر تفتیشی افسر جانبداری کرے تو آپ ایس پی انویسٹی گیشن کو تبدیلیِ تفتیش کی درخواست دے سکتے ہیں۔",
      },
    ],
  },
  {
    key: "rent",
    labelEn: "House Rent Agreement (Kiraya Nama)",
    labelUr: "کرایہ نامہ (رہائشی و کمرشل معاہدہ)",
    statuteRef: "Punjab Rented Premises Act 2009 / Sindh Rented Premises Ordinance",
    clauses: [
      {
        id: "rent-registration",
        clauseNumber: "Clause 01",
        titleEn: "Mandatory Registration with Rent Registrar & Police",
        titleUr: "رینٹ رجسٹرار اور تھانے میں کرایہ دار کا لازمی اندراج",
        officialEn:
          "The Tenancy Agreement shall be reduced to writing and registered with the Rent Registrar within the statutory period under Section 5 of the Rented Premises Act.",
        officialUr:
          "کرایہ داری کا معاہدہ تحریری صورت میں ہوگا اور قانون کے مطابق رینٹ رجسٹرار اور مقامی تھانے کے سافٹ ویئر میں درج کروایا جائے گا۔",
        meaningEn:
          "An unregistered paper rent agreement creates serious obstacles if you ever need to evict a defaulting tenant through the Rent Tribunal.",
        meaningUr:
          "غیر رجسٹرڈ کرایہ نامے کی صورت میں رینٹ ٹربیونل سے نادہندہ کرایہ دار کو بے دخل کروانے میں بھاری جرمانہ اور قانونی رکاوٹ پیش آتی ہے۔",
        redFlagEn:
          "Always register the tenancy on e-Stamping and enter the tenant's CNIC in the Police Tenant Registration System within 48 hours of handing over keys.",
        redFlagUr:
          "احتیاط: چابیاں دینے کے 48 گھنٹے کے اندر پولیس کرایہ دار رجسٹریشن سسٹم میں اندراج لازمی مکمل کریں۔",
      },
      {
        id: "rent-bank-payment",
        clauseNumber: "Clause 04",
        titleEn: "Payment of Monthly Rent Strictly via Bank Transfer",
        titleUr: "ماہانہ کرایہ صرف بینک اکاؤنٹ کے ذریعے ادا کرنے کی شرط",
        officialEn:
          "Monthly rent shall be payable in advance on or before the 5th day of each calendar month strictly via crossed cheque or direct online IBAN bank transfer.",
        officialUr:
          "ماہانہ کرایہ ہر مہینے کی 5 تاریخ تک پیشگی صرف بینک ٹرانسفر یا کراس چیک کے ذریعے ادا کیا جائے گا۔",
        meaningEn:
          "Pakistani Rent Laws mandate payment of rent via bank or official receipt so neither party can falsely claim or deny that rent was paid.",
        meaningUr:
          "قانونِ کرایہ داری کے مطابق بینک ٹرانسفر سے دونوں فریق محفوظ رہتے ہیں اور کرایہ کی ادائیگی یا عدم ادائیگی کا پختہ ثبوت موجود رہتا ہے۔",
        redFlagEn:
          "Never accept or pay rent in undocumented cash without a signed receipt; cash disputes are the #1 cause of prolonged Rent Tribunal litigation.",
        redFlagUr:
          "احتیاط: بغیر تحریری رسید کے نقد کرایہ لینے یا دینے سے گریز کریں۔",
      },
      {
        id: "rent-subletting",
        clauseNumber: "Clause 07",
        titleEn: "Strict Prohibition on Sub-Letting or Structural Changes",
        titleUr: "ذیلی کرایہ داری (Sub-letting) اور تعمیراتی تبدیلی پر پابندی",
        officialEn:
          "The Tenant shall not sub-let, assign, or part with possession of the demised premises or any portion thereof to any third party without prior written consent of the Landlord.",
        officialUr:
          "کرایہ دار مالک مکان کی تحریری اجازت کے بغیر جائیداد یا اس کا کوئی حصہ کسی تیسرے شخص کو آگے کرائے پر (Sub-let) نہیں دے گا۔",
        meaningEn:
          "Unauthorized sub-letting or changing the structure of the house/shop gives the landlord an immediate statutory ground for eviction before the Special Judge (Rent).",
        meaningUr:
          "مالک کی اجازت کے بغیر کسی اور کو قبضہ دینا یا عمارت میں توڑ پھوڑ کرنا فوری بے دخلی کی قانونی بنیاد بن جاتا ہے۔",
        redFlagEn:
          "Ensure the exact names and CNIC numbers of the authorized family/business occupants are listed in the schedule of the agreement.",
        redFlagUr:
          "احتیاط: معاہدے میں رہائش پذیر افراد کی تعداد اور شناختی کارڈ نمبر واضح درج کریں۔",
      },
      {
        id: "rent-security-eviction",
        clauseNumber: "Clause 10",
        titleEn: "Security Deposit Refund & 30-Day Vacation Notice",
        titleUr: "سیکیورٹی رقم کی واپسی اور مکان خالی کرنے کا نوٹس",
        officialEn:
          "The refundable Security Deposit shall not be adjusted against the last months' rent and shall be returned upon peaceful handover of vacant possession and clearance of utility bills.",
        officialUr:
          "ایڈوانس سیکیورٹی کی رقم ماہانہ کرائے میں ایڈجسٹ نہیں ہوگی بلکہ مکان کا قبضہ اور بجلی، گیس کے بل کلیئر کرنے پر واپس کی جائے گی۔",
        meaningEn:
          "Protects the landlord from unpaid electricity/gas bills left behind on the final month while guaranteeing the tenant a written commitment for immediate refund upon handover.",
        meaningUr:
          "اس شق سے مالک مکان آخری مہینے کے واجب الادا بلوں سے محفوظ رہتا ہے اور کرایہ دار کو قبضہ واپس کرتے ہی سیکیورٹی واپسی کی ضمانت ملتی ہے۔",
        redFlagEn:
          "Take meter photos of Electricity (WAPDA/K-Electric) and Sui Gas on the day of move-in and attach the final paid bill numbers upon vacation.",
        redFlagUr:
          "احتیاط: قبضہ لیتے اور دیتے وقت بجلی اور گیس کے میٹر کی ریڈنگ کی تصویر لازمی محفوظ رکھیں۔",
      },
    ],
  },
];

export const VERIFIED_ADVOCATES: VerifiedAdvocate[] = [
  {
    id: "adv-sara-mansoor",
    name: "Adv. Sara Mansoor, ASC",
    name_urdu: "ایڈووکیٹ سارہ منصور",
    court: "Supreme Court of Pakistan",
    court_urdu: "سپریم کورٹ آف پاکستان",
    city: "Lahore",
    city_urdu: "لاہور",
    specialty: "Family Law, Women's Inheritance & Constitutional Writs",
    specialty_urdu: "فیملی قوانین، خواتین کی وراثت اور آئینی رٹ",
    bar_council_id: "PBC-SC-4491",
    experience_years: 16,
    rating: "4.9",
    fee: 4500,
    pro_bono: true,
    bio: "Senior Advocate Supreme Court specializing in women's statutory inheritance recovery, overseas family litigation, and Article 199 High Court constitutional petitions.",
    bio_urdu:
      "سپریم کورٹ کی سینئر وکیل جو خواتین کے وراثتی حقوق کی بازیابی، اوورسیز فیملی کیسز اور آئینی پٹیشنز میں 16 سالہ تجربہ رکھتی ہیں۔",
    notable_precedents: [
      "PLD 2025 SC 112 (Khula & Dower Protection)",
      "2024 CLC 891 Lahore (Cancellation of Fraudulent Wirasat Mutation)",
    ],
  },
  {
    id: "adv-kamran-tariq",
    name: "Adv. Kamran Tariq, AHC",
    name_urdu: "ایڈووکیٹ کامران طارق",
    court: "Lahore High Court",
    court_urdu: "لاہور ہائی کورٹ",
    city: "Lahore",
    city_urdu: "لاہور",
    specialty: "Criminal Defense, Pre-Arrest Bail & Sec 22-A Petitions",
    specialty_urdu: "فوجداری مقدمات، ضمانت قبل از گرفتاری اور دفعہ 22-A",
    bar_council_id: "PbBC-LHC-19204",
    experience_years: 12,
    rating: "4.9",
    fee: 3500,
    pro_bono: false,
    bio: "Former Deputy Prosecutor practicing before the Lahore High Court in pre-arrest bail, FIR quashment under Section 561-A CrPC, and white-collar criminal defense.",
    bio_urdu:
      "سابق ڈپٹی پراسیکیوٹر اور ہائی کورٹ وکیل، ضمانت قبل از گرفتاری اور جھوٹی ایف آئی آر کے اخراج (561-A) کے ماہر۔",
    notable_precedents: [
      "2024 PCrLJ 1102 (Pre-Arrest Bail in Mala Fide FIR)",
      "2023 YLR 415 (Section 22-A Justice of Peace Direction)",
    ],
  },
  {
    id: "adv-ayesha-siddiqui",
    name: "Adv. Ayesha Siddiqui, AHC",
    name_urdu: "ایڈووکیٹ عائشہ صدیقی",
    court: "Sindh High Court",
    court_urdu: "سندھ ہائی کورٹ",
    city: "Karachi",
    city_urdu: "کراچی",
    specialty: "FIA Cyber Crime (PECA), Banking Fraud & Corporate Law",
    specialty_urdu: "ایف آئی اے سائبر کرائم (پیکا)، بینکنگ فراڈ اور کارپوریٹ لا",
    bar_council_id: "SBC-SHC-30812",
    experience_years: 11,
    rating: "5.0",
    fee: 4000,
    pro_bono: true,
    bio: "Lead counsel for digital rights, FIA Cyber Crime inquiries, online defamation defense, and disputed banking recoveries across Karachi and Sindh High Court.",
    bio_urdu:
      "ڈیجیٹل حقوق، ایف آئی اے سائبر کرائم انکوائریز، آن لائن ہتکِ عزت اور بینکنگ ریکوری مقدمات کی ماہر وکیل۔",
    notable_precedents: [
      "2025 MLD 318 Sindh (PECA Forensic Chain of Custody)",
      "2024 CLD 704 (Disputed Electronic Banking Liability)",
    ],
  },
  {
    id: "adv-zafarullah-khan",
    name: "Adv. Zafarullah Khan, ASC",
    name_urdu: "ایڈووکیٹ ظفر اللہ خان",
    court: "Supreme Court & Islamabad High Court",
    court_urdu: "سپریم کورٹ و اسلام آباد ہائی کورٹ",
    city: "Islamabad",
    city_urdu: "اسلام آباد",
    specialty: "Property Disputes, CDA Land Litigation & Civil Appeals",
    specialty_urdu: "جائیداد کے تنازعات، سی ڈی اے لینڈ اور دیوانی اپیلیں",
    bar_council_id: "PBC-SC-2910",
    experience_years: 19,
    rating: "4.9",
    fee: 5000,
    pro_bono: false,
    bio: "20-year civil and constitutional litigator representing overseas Pakistanis and families in property possession, specific performance of agreements, and CDA disputes.",
    bio_urdu:
      "اوورسیز پاکستانیوں کی جائیداد کے تحفظ، تعمیلِ مختص (Specific Performance) اور سی ڈی اے تنازعات میں 19 سالہ تجربہ۔",
    notable_precedents: [
      "PLD 2024 Islamabad 98 (Protection of Overseas Property Owners)",
      "2023 SCMR 1402 (Specific Performance & Readiness to Pay)",
    ],
  },
  {
    id: "adv-mehwish-gilani",
    name: "Adv. Mehwish Gilani, AHC",
    name_urdu: "ایڈووکیٹ مہوش گیلانی",
    court: "Islamabad High Court",
    court_urdu: "اسلام آباد ہائی کورٹ",
    city: "Islamabad",
    city_urdu: "اسلام آباد",
    specialty: "Child Custody (Hizanat), Guardianship & Pro-Bono Legal Aid",
    specialty_urdu: "بچوں کی حضانت (حوالگی)، گارڈین شپ اور مفت قانونی امداد",
    bar_council_id: "IBC-IHC-8841",
    experience_years: 9,
    rating: "4.9",
    fee: 3000,
    pro_bono: true,
    bio: "Dedicated family and guardianship counsel handling welfare-of-minor custody petitions, international travel permissions, and pro-bono legal aid for women.",
    bio_urdu:
      "بچوں کی حوالگی (حضانت)، گارڈین کورٹ مقدمات اور مستحق خواتین کے لیے مفت قانونی معاونت کی ماہر وکیل۔",
    notable_precedents: [
      "2024 CLC 1205 (Welfare of Minor Overriding Technicalities)",
    ],
  },
  {
    id: "adv-tariq-mehmood",
    name: "Adv. Tariq Mehmood, ASC",
    name_urdu: "ایڈووکیٹ طارق محمود",
    court: "Peshawar High Court & Supreme Court",
    court_urdu: "پشاور ہائی کورٹ و سپریم کورٹ",
    city: "Peshawar",
    city_urdu: "پشاور",
    specialty: "Cheque Dishonour (489-F), Commercial Summary Suits & Tax",
    specialty_urdu: "چیک باؤنس (489-F)، کاروباری ریکوری اور ٹیکس قوانین",
    bar_council_id: "PBC-SC-5120",
    experience_years: 15,
    rating: "4.8",
    fee: 3500,
    pro_bono: true,
    bio: "Specialist in commercial recoveries under Order XXXVII CPC, Section 489-F trials, and appellate representation before the Peshawar High Court and Supreme Court.",
    bio_urdu:
      "آرڈر 37 کے تحت فوری کاروباری ریکوری، دفعہ 489-F کے مقدمات اور اعلیٰ عدالتوں میں اپیلوں کے ماہر وکیل۔",
    notable_precedents: [
      "2024 PCrLJ 774 Peshawar (Ingredients of Civil vs Criminal Cheque Liability)",
    ],
  },
];

export const PLAIN_LAW_INDEX: SpotlightBriefing[] = [
  ...SPOTLIGHT_BRIEFINGS,
  {
    id: "briefing-cheque-489f",
    citation: "PPC Sec 489-F · Order XXXVII CPC",
    categoryEn: "Commercial & Banking Law",
    categoryUr: "بینکنگ اور کاروباری قانون",
    readTime: "4 min read",
    audioDuration: "01:25",
    titleEn:
      "Dishonoured Cheque Recovery: Criminal FIR (Sec 489-F) vs. Summary Civil Suit",
    titleUr:
      "باؤنس چیک کی ریکوری: دفعہ 489-F کی ایف آئی آر اور آرڈر 37 کا سمری دعویٰ",
    subtitleEn:
      "Why the Supreme Court distinguishes security cheques from repayment cheques—and how to recover your principal amount fast.",
    plainSummaryEn:
      "When a cheque bounces in Pakistan, you have two parallel legal remedies:\n\n1. Criminal Prosecution under Section 489-F PPC: Punishes a person who dishonestly issues a cheque towards repayment of a loan or fulfillment of a financial obligation. Note: The Supreme Court has clarified that cheques given purely as advance 'security' (Zamanat) without an existing debt do not attract criminal punishment under 489-F.\n\n2. Fast-Track Civil Recovery under Order XXXVII CPC: Filed directly in the Sessions Court (not ordinary civil court). The defendant cannot even defend the case without first getting leave from the judge and depositing surety.",
    formalTextEn:
      "STATUTORY DISTINCTION — SECTION 489-F PPC VS. ORDER XXXVII CODE OF CIVIL PROCEDURE\n\nAs laid down by the Supreme Court of Pakistan in PLD 2022 SC 764, the foundational ingredient of Section 489-F PPC is dishonesty in issuing a cheque towards repayment of an existing loan or fulfillment of a present obligation. For civil realization of the liquidated sum, Summary Suit under Order XXXVII Rules 1 & 2 CPC provides expedited decree mechanisms.",
    urduSummary:
      "پاکستان میں چیک باؤنس ہونے کی صورت میں دو قانونی راستے موجود ہیں:\n\n١۔ دفعہ 489-F کے تحت فوجداری مقدمہ: اگر چیک کسی قرض کی واپسی یا واجب الادا رقم کے لیے دیا گیا ہو تو 3 سال تک قید ہو سکتی ہے۔ (یاد رہے کہ محض بطور ’سیکیورٹی/ضمانت‘ دیے گئے چیک پر فوجداری دفعہ لاگو نہیں ہوتی)۔\n\n٢۔ آرڈر 37 کے تحت سیشن کورٹ میں فوری ریکوری دعویٰ: اس دعوے میں ملزم کو عدالت میں صفائی پیش کرنے کے لیے بھی پہلے ضمانت جمع کروانا پڑتی ہے۔",
    author: "Adv. Tariq Mehmood, ASC",
  },
];

export const LEGAL_TEMPLATES: LegalTemplateDraft[] = [
  {
    id: "tpl-kiraya-nama",
    code: "DRAFT-01",
    titleEn: "Residential Rent Agreement (Kiraya Nama)",
    titleUr: "رہائشی کرایہ نامہ (مستند قانونی مسودہ)",
    statuteBadge: "Rented Premises Act Compliant",
    summaryEn:
      "Court-compliant bilingual tenancy contract with mandatory bank-transfer rent clause, annual 10% escalation, utility clearance protection, and 30-day vacation notice.",
    summaryUr:
      "عدالتی تقاضوں کے مطابق تیار کردہ کرایہ نامہ جس میں بینک کے ذریعے کرایہ کی ادائیگی، سیکیورٹی واپسی اور بجلی و گیس بلوں کے تحفظ کی شرائط شامل ہیں۔",
    stampPaperValue: "PKR 1,200 e-Stamp Paper",
    englishDraft: `RESIDENTIAL TENANCY AGREEMENT (KIRAYA NAMA)
[QANOONPK VERIFIED STATUTORY TEMPLATE — EXECUTED ON E-STAMP PAPER]

THIS TENANCY AGREEMENT is made at ______________ on this ___ day of __________, 2026:

BETWEEN
1. Mr./Ms. ______________________ S/O, D/O ______________________ holding CNIC No. ______________________ Resident of ________________________________________ (hereinafter called the "LANDLORD").

AND
2. Mr./Ms. ______________________ S/O, D/O ______________________ holding CNIC No. ______________________ Resident of ________________________________________ (hereinafter called the "TENANT").

WHEREAS the Landlord is the lawful owner in possession of residential premises situated at: ________________________________________________ (the "Demised Premises").

NOW THIS AGREEMENT WITNESSETH AS UNDER:
1. TENANCY PERIOD: The tenancy shall be for a fixed period of Eleven (11) Months commencing from ____________ to ____________.
2. MONTHLY RENT: The monthly rent is fixed at PKR __________/= per month, payable strictly in advance on or before the 5th day of each calendar month into Landlord's Bank Account IBAN: __________________________.
3. REFUNDABLE SECURITY DEPOSIT: The Tenant has paid PKR __________/= as interest-free refundable security deposit, which shall NOT be adjusted towards monthly rent and shall be refunded upon peaceful handover of vacant possession and paid utility bills.
4. PROHIBITION ON SUB-LETTING: The Tenant shall use the premises solely for family residential purposes and shall not sub-let or part with possession to any third party.
5. VACATION NOTICE: Either party may terminate this tenancy by serving One (01) Month prior written notice.

IN WITNESS WHEREOF both parties have signed this Agreement in presence of marginal witnesses.

_______________________                    _______________________
LANDLORD (Signature & CNIC)                TENANT (Signature & CNIC)`,
    urduDraft: `معاہدہ کرایہ داری (رہائشی کرایہ نامہ)
[قانون پاکستان تصدیق شدہ قانونی مسودہ — برائے ای اسٹامپ پیپر]

یہ معاہدہ کرایہ داری آج مورخہ ____________ بمقام ____________ مابین:
فریقِ اول (مالک مکان): ______________________ ولدیت ______________________ شناختی کارڈ نمبر ______________________
فریقِ دوم (کرایہ دار): ______________________ ولدیت ______________________ شناختی کارڈ نمبر ______________________

شرائطِ معاہدہ حسبِ ذیل ہیں:
١۔ مدتِ کرایہ داری: یہ معاہدہ گیارہ (11) ماہ کی مدت کے لیے طے پایا ہے جو مورخہ ________ سے شروع ہو کر مورخہ ________ تک نافذ العمل رہے گا۔
٢۔ ماہانہ کرایہ: مکان کا ماہانہ کرایہ مبلغ __________ روپے طے پایا ہے جو ہر ماہ کی 5 تاریخ تک پیشگی صرف بینک اکاؤنٹ ٹرانسفر کے ذریعے ادا کیا جائے گا۔
٣۔ ایڈوانس سیکیورٹی: کرایہ دار نے مبلغ __________ روپے بطور قابلِ واپسی سیکیورٹی ادا کر دی ہے جو ماہانہ کرائے میں ایڈجسٹ نہیں ہوگی بلکہ مکان خالی کرنے اور بجلی و گیس کے بل کلیئر کرنے پر واپس کی جائے گی۔
٤۔ ذیلی کرایہ داری پر پابندی: کرایہ دار مکان کسی تیسرے شخص کو آگے کرائے پر (Sub-let) نہیں دے گا اور نہ ہی عمارت میں کوئی تعمیراتی تبدیلی کرے گا۔
٥۔ نوٹس تخلیہ: دونوں فریق ایک ماہ کے پیشگی تحریری نوٹس پر مکان خالی کرنے یا کروانے کے پابند ہوں گے۔

دستخط مالک مکان: _______________          دستخط کرایہ دار: _______________`,
  },
  {
    id: "tpl-bayan-e-halfi",
    code: "DRAFT-02",
    titleEn: "General Legal Affidavit (Bayan-e-Halfi)",
    titleUr: "بیانِ حلفی (ایفی ڈیوٹ برائے عدالت و سرکاری دفاتر)",
    statuteBadge: "Oaths Act 1873 · Verification Clause",
    summaryEn:
      "Standard sworn affidavit format with mandatory verification clause under the Oaths Act 1873 for courts, NADRA, educational boards, and government filings.",
    summaryUr:
      "عدالتوں، نادرا اور سرکاری محکموں میں جمع کروانے کے لیے قانونِ حلف مجریہ 1873 کے مطابق مستند بیانِ حلفی کا فارمیٹ۔",
    stampPaperValue: "PKR 100 / 300 e-Stamp Paper",
    englishDraft: `AFFIDAVIT (BAYAN-E-HALFI)
[PURSUANT TO THE OATHS ACT, 1873]

I, __________________________ S/O, D/O, W/O __________________________ holding CNIC No. __________________________ Resident of ____________________________________________________, do hereby solemnly affirm and declare on oath as under:

1. That I am a law-abiding citizen of Pakistan and the deponent of this Affidavit, and as such am fully conversant with the facts stated herein.
2. That _____________________________________________________________________.
3. That the documents annexed herewith are genuine, true copies of their originals, and nothing material has been concealed therefrom.
4. That whatever is stated above is true and correct to the best of my knowledge and belief.

___________________________
DEPONENT (Signature & Thumb Impression)
CNIC No: ___________________

VERIFICATION:
Verified on oath at ____________ on this ___ day of __________, 2026 that the contents of the above Affidavit from Para 1 to 4 are true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.`,
    urduDraft: `بیانِ حلفی (AFFIDAVIT)
[تحت قانونِ حلف مجریہ 1873]

منکہ __________________________ ولد/دختر/زوجہ __________________________ حامل شناختی کارڈ نمبر __________________________ ساکن ____________________________________________________ حلفاً اقرار و بیان کرتا/کرتی ہوں کہ:

١۔ یہ کہ میں پاکستان کا/کی شہری ہوں اور مندرجہ ذیل واقعات سے ذاتی طور پر بخوبی واقف ہوں۔
٢۔ یہ کہ _____________________________________________________________________۔
٣۔ یہ کہ میری طرف سے پیش کردہ تمام دستاویزات بالکل درست اور اصل کے مطابق ہیں اور کوئی امر مخفی نہیں رکھا گیا۔
٤۔ یہ کہ میرا مندرجہ بالا بیان میرے علم اور یقین کے مطابق بالکل درست اور سچ ہے۔

العبد / المقر: _______________________
شناختی کارڈ نمبر: ___________________`,
  },
  {
    id: "tpl-489f-notice",
    code: "DRAFT-03",
    titleEn: "Dishonoured Cheque Legal Notice (Sec 489-F)",
    titleUr: "چیک باؤنس ہونے پر قانونی نوٹس (دفعہ 489-F)",
    statuteBadge: "PPC Sec 489-F & Order XXXVII CPC",
    summaryEn:
      "Formal 15-day statutory Legal Demand Notice prior to lodging a Section 489-F PPC criminal FIR and instituting a Summary Recovery Suit in Sessions Court.",
    summaryUr:
      "چیک ڈس آنر (باؤنس) ہونے پر دفعہ 489-F کی ایف آئی آر اور سیشن کورٹ میں سمری دعویٰ دائر کرنے سے قبل بھیجا جانے والا 15 روزہ قانونی نوٹس۔",
    stampPaperValue: "Advocate Letterhead / Regd. Post AD",
    englishDraft: `REGISTERED AD / COURIER LEGAL DEMAND NOTICE
UNDER SECTION 489-F PAKISTAN PENAL CODE & ORDER XXXVII CPC

To,
Mr./Ms. __________________________
Address: __________________________

SUBJECT: FINAL LEGAL DEMAND NOTICE CONSEQUENT UPON DISHONOUR OF CHEQUE NO. __________ DATED __________ FOR PKR ______________ DRAWN ON __________________ BANK

Dear Sir/Madam,
Under instructions from and on behalf of my client __________________________, I hereby serve upon you the following Legal Notice:

1. That towards repayment of your lawful financial obligation, you issued Cheque No. __________ dated __________ amounting to PKR __________/= drawn on __________________ Bank.
2. That upon presentation within its validity period, the said cheque was dishonoured by your banker vide Return Memo dated __________ with remarks "Insufficient Funds / Account Closed".
3. That by dishonestly issuing a cheque which was dishonoured on presentation, you have committed a cognizable criminal offence punishable under Section 489-F PPC alongside civil liability under Order XXXVII CPC.

YOU ARE HEREBY CALLED UPON to pay the sum of PKR __________/= within Fifteen (15) Days of receipt of this Notice, failing which criminal and civil proceedings shall be initiated against you at your sole risk as to costs.`,
    urduDraft: `قانونی نوٹس بذریعہ رجسٹرڈ ڈاک (LEGAL DEMAND NOTICE)
زیر دفعہ 489-F تعزیراتِ پاکستان و آرڈر 37 ضابطہ دیوانی

بخدمت: __________________________
پتہ: ____________________________

عنوان: چیک نمبر __________ مورخہ __________ مالیتی مبلغ __________ روپے بینک ہذا __________ کے ڈس آنر (باؤنس) ہونے پر حتمی قانونی نوٹس

منجانب موکل: __________________________

١۔ یہ کہ آپ نے اپنے ذمے واجب الادا مالی ذمہ داری کی ادائیگی کے سلسلے میں چیک نمبر __________ مالیتی __________ روپے جاری کیا۔
٢۔ یہ کہ مقررہ تاریخ پر بینک میں پیش کرنے پر مذکورہ چیک ”ناکافی فنڈز / اکاؤنٹ کلوز“ کے ریمارکس اور ریٹرن میمو کے ساتھ باؤنس ہو گیا۔
٣۔ یہ کہ آپ کا یہ فعل تعزیراتِ پاکستان کی دفعہ 489-F کے تحت قابلِ دست اندازی جرم ہے جس کی سزا تین سال تک قید ہے۔

لہٰذا اس نوٹس کی وصولی کے پندرہ (15) یوم کے اندر اندر اصل رقم مبلغ __________ روپے ادا کریں، بصورتِ دیگر آپ کے خلاف دفعہ 489-F کی ایف آئی آر اور سیشن کورٹ میں آرڈر 37 کا دعویٰ دائر کر دیا جائے گا۔`,
  },
  {
    id: "tpl-hiba-nama",
    code: "DRAFT-04",
    titleEn: "Family Gift Deed (Hiba-Nama / Tamleek)",
    titleUr: "ہبہ نامہ / تملیک نامہ (خاندانی تحفہ جائیداد)",
    statuteBadge: "Islamic Law of Hiba · Sec 123 TPA",
    summaryEn:
      "Bilingual Islamic Gift Deed enshrining the 3 mandatory pillars of a valid Hiba: (1) Declaration by Donor, (2) Acceptance by Donee, and (3) Delivery of Possession.",
    summaryUr:
      "اسلامی قانونِ ہبہ کے تین لازمی ارکان (ایجابِ واہب، قبولیتِ موہوب لہ اور حوالگیِ قبضہ) پر مشتمل مستند ہبہ نامہ۔",
    stampPaperValue: "e-Stamp Paper per DC Valuation",
    englishDraft: `DEED OF ISLAMIC GIFT (HIBA-NAMA / TAMLEEK)
[VALID UNDER MUHAMMADAN LAW — DECLARATION, ACCEPTANCE & DELIVERY OF POSSESSION]

THIS DEED OF GIFT (HIBA-NAMA) is executed at ____________ on this ___ day of __________, 2026:

BY: __________________________ CNIC No. __________________________ (hereinafter called the "DONOR / WAHIB")
IN FAVOUR OF: __________________________ CNIC No. __________________________ Relation: ____________ (hereinafter called the "DONEE / MAUHOOB-LAHU").

1. DECLARATION OF GIFT (IJAB): Out of natural love and affection, the Donor hereby voluntarily gifts and transfers all rights, title, and interest in Property No. __________________________ unto the Donee free from all encumbrances and without any monetary consideration.
2. ACCEPTANCE (QABOOL): The Donee hereby personally accepts the said Gift during the lifetime of the Donor.
3. DELIVERY OF POSSESSION (QABZA): The Donor has handed over complete physical and constructive possession along with original title documents of the gifted property to the Donee on the spot.

_______________________                    _______________________
DONOR (Signature & Thumb)                  DONEE — ACCEPTANCE (Signature)`,
    urduDraft: `اقرار نامہ ہبہ (ہبہ نامہ / تملیک نامہ)
[تحت اسلامی قانونِ ہبہ — ایجاب، قبولیت اور حوالگیِ قبضہ]

منکہ (واہب / ہبہ دہندہ): __________________________ شناختی کارڈ نمبر __________________________
بہ حق (موہوب لہ / ہبہ گیرندہ): __________________________ شناختی کارڈ نمبر __________________________ رشتہ: ____________

١۔ ایجابِ ہبہ: میں بقائمی ہوش و حواس خمسہ، بلا جبر و اکراہ، فطری محبت و شفقت کی بنا پر اپنی مملوکہ جائیداد واقع __________________________ بلا معاوضہ فریقِ دوم کو ہبہ (گفٹ) کرتا/کرتی ہوں۔
٢۔ قبولیتِ ہبہ: موہوب لہ (فریقِ دوم) نے اس ہبہ کو میرے روبرو اور گواہان کی موجودگی میں بخوشی قبول کر لیا ہے۔
٣۔ حوالگیِ قبضہ: میں نے ہبہ شدہ جائیداد کا موقع پر قبضہ اور اصل کاغذاتِ ملکیت موہوب لہ کے حوالے کر دیے ہیں اور اب میرا یا میرے دیگر ورثاء کا اس جائیداد سے کوئی واسطہ نہ رہا۔

دستخط واہب (ہبہ دہندہ): _______________     دستخط موہوب لہ (قبول کنندہ): _______________`,
  },
];
