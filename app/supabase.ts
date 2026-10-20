// Resilient Data Layer & Supabase Client with LocalStorage + In-Memory Synchronization
// Powers all 3 apps: 1) Admin CMS App, 2) Main English App (LTR), 3) Urdu App (RTL)
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const INITIAL_ARTICLES = [
  {
    id: 1,
    title: "Understanding Property Inheritance Rights for Women in Pakistan",
    title_urdu: "پاکستان میں خواتین کے وراثتی حقوق اور جائیداد کی منتقلی کا مکمل قانونی طریقہ کار",
    subtitle: "A comprehensive statutory guide to NADRA Letters of Administration, land mutation (Intiqal), and Supreme Court protections against forced relinquishment.",
    subtitle_urdu: "نادرا جانشینی سرٹیفکیٹ، زمین کے انتقال اور سپریم کورٹ کے حالیہ فیصلوں کی آسان الفاظ میں وضاحت۔",
    category: "Property & Inheritance",
    category_urdu: "جائیداد اور وراثت",
    author: "Adv. Sara Mansoor, ASC",
    author_urdu: "ایڈووکیٹ سارہ منصور (سپریم کورٹ)",
    read_time: "6 min read",
    read_time_urdu: "6 منٹ کا مطالعہ",
    featured: true,
    content: "Under Article 23 and Article 25 of the Constitution of Pakistan 1973, read alongside codified Islamic Jurisprudence and the Enforcement of Women's Property Rights Act 2020, a woman's right to her legal share in ancestral and self-acquired property is absolute and non-negotiable.\n\nRecent statutory reforms through NADRA Succession Facilitation Units have replaced decades-long civil court delays with a streamlined 15-day biometric verification process for obtaining Letters of Administration and Succession Certificates.\n\nIn landmark judgments including PLD 2024 SC 112 (Ghulam Ali v. Mst. Ghulam Sarwar), the Supreme Court of Pakistan held that inheritance vests in legal heirs the very moment the predecessor passes away. Any purported gift deed (Hiba) or relinquishment deed (Dastbardari) executed to deprive a female heir of her share without independent consideration and verifiable consent is void ab initio.\n\nKey Action Steps for Aggrieved Heirs:\n1. File a direct complaint before the Provincial Ombudsperson under Section 4 of the Enforcement of Women's Property Rights Act 2020.\n2. Request an immediate restraint order freezing fraudulent mutation (Intiqal) in the Revenue Record (Jamabandi).\n3. Obtain NADRA Family Registration Certificate (FRC) and biometric succession certificate.",
    content_urdu: "پاکستان کے آئین 1973 کے آرٹیکل 23 اور اسلامی قوانین کے تحت خواتین کا وراثتی جائیداد میں حصہ مکمل طور پر محفوظ ہے اور سپریم کورٹ آف پاکستان نے اس حق کے تحفظ کے لیے واضح اور سخت احکامات جاری کیے ہیں۔\n\nحالیہ قانونی اصلاحات اور نادرا کے جانشینی سہولت مراکز (Succession Facilitation Units) کے قیام کے بعد اب صرف 15 دن میں بائیو میٹرک تصدیق کے ذریعے جانشینی سرٹیفکیٹ اور لیٹرز آف ایڈمنسٹریشن حاصل کیے جا سکتے ہیں۔\n\nسپریم کورٹ آف پاکستان کے تاریخی فیصلے (PLD 2024 SC 112) کے مطابق مورث کی وفات کے فوراً بعد وراثت تمام شرعی اور قانونی وارثان کو منتقل ہو جاتی ہے۔ اگر کسی خاتون سے خاندانی دباؤ، دھوکے یا بغیر معاوضے کے وراثت سے دستبرداری کا کاغذ لکھوایا جائے تو قانون کی نظر میں اس کی کوئی حیثیت نہیں ہوگی۔\n\nمتاثرہ خواتین کے لیے فوری قانونی اقدامات:\n1۔ خواتین کے حقوقِ جائیداد کے تحفظ کے ایکٹ 2020 کے تحت صوبائی محتسب (Ombudsperson) کو براہِ راست درخواست دیں۔\n2۔ پٹواری یا ریونیو ریکارڈ میں جعلی انتقال رکوانے کے لیے فوری حکمِ امتناعی حاصل کریں۔\n3۔ نادرا سے فیملی رجسٹریشن سرٹیفکیٹ (FRC) حاصل کر کے اپنا قانونی حق محفوظ بنائیں۔",
    created_at: "2026-10-19T08:00:00.000Z"
  },
  {
    id: 2,
    title: "How Freelancers & IT Exporters Can Register With PSEB for 0.25% Final Tax",
    title_urdu: "فری لانسرز اور آئی ٹی ایکسپورٹرز کے لیے 0.25 فیصد ٹیکس رعائت حاصل کرنے کا طریقہ",
    subtitle: "Step-by-step compliance checklist for software engineers, agencies, and remote workers under Section 154A of the Income Tax Ordinance.",
    subtitle_urdu: "سافٹ ویئر انجینئرز اور ریموٹ ورکرز کے لیے ایف بی آر اور پاکستان سافٹ ویئر ایکسپورٹ بورڈ کی رجسٹریشن گائیڈ۔",
    category: "Tax & Corporate Law",
    category_urdu: "ٹیکس اور کارپوریٹ قانون",
    author: "Adv. Kamran Tariq, AHC",
    author_urdu: "ایڈووکیٹ کامران طارق (ہائی کورٹ)",
    read_time: "5 min read",
    read_time_urdu: "5 منٹ کا مطالعہ",
    featured: false,
    content: "Pakistan's Finance Act provides a major statutory tax incentive under Section 154A of the Income Tax Ordinance, 2001 for IT exporters, software houses, and independent freelancers bringing foreign remittance into Pakistan through formal banking channels.\n\nWhile standard export proceeds face a 1% final withholding tax by Authorized Dealer banks, individuals and firms holding a valid Pakistan Software Export Board (PSEB) registration certificate qualify for a reduced final tax rate of just 0.25%.\n\nTo qualify for the 0.25% regime:\n1. Ensure incoming wire transfers or Wise/Payoneer remittances are coded by your bank under SBP Purpose Code 9186 (IT & Software Consultancies).\n2. Obtain the Proceed Realization Certificate (PRC) from your commercial bank.\n3. Register or renew your freelancer/company profile on the PSEB portal and link your Active Taxpayer List (ATL) status on FBR IRIS.",
    content_urdu: "پاکستان کے فنانس ایکٹ اور انکم ٹیکس آرڈیننس 2001 کے سیکشن 154A کے تحت بیرون ملک سے زرمبادلہ لانے والے فری لانسرز اور آئی ٹی کمپنیوں کو ٹیکس میں خصوصی رعائت دی گئی ہے۔\n\nعام طور پر بینکوں کے ذریعے آنے والی غیر ملکی آمدن پر 1 فیصد ٹیکس کٹوتی ہوتی ہے، لیکن اگر آپ پاکستان سافٹ ویئر ایکسپورٹ بورڈ (PSEB) کے ساتھ رجسٹرڈ ہیں تو یہ فائنل ٹیکس کم ہو کر صرف 0.25 فیصد رہ جاتا ہے۔\n\nاس سہولت سے فائدہ اٹھانے کے لیے:\n1۔ اپنے بینک سے اسٹیٹ بینک کوڈ 9186 کے تحت PRC (Proceed Realization Certificate) حاصل کریں۔\n2۔ پی ایس ای بی (PSEB) پورٹل پر اپنی فری لانسر رجسٹریشن مکمل کریں۔\n3۔ ایف بی آر آئرس (FBR IRIS) پر اپنا سالانہ گوشوارہ جمع کروا کر ایکٹو ٹیکس پیئر لسٹ (ATL) میں نام برقرار رکھیں۔",
    created_at: "2026-10-18T10:00:00.000Z"
  },
  {
    id: 3,
    title: "Supreme Court Clarifies Post-Arrest Bail Guidelines Under Section 497 CrPC",
    title_urdu: "سپریم کورٹ نے ضابطہ فوجداری کی دفعہ 497 کے تحت ضمانت کے اصول واضح کر دیے",
    subtitle: "Why the rule of 'bail not jail' applies strictly to offenses outside the prohibitory clause and how trial courts must evaluate further inquiry.",
    subtitle_urdu: "ممنوعہ شق سے باہر کے مقدمات میں ضمانت بطورِ حق اور مزید تفتیش کے قانونی معیارات۔",
    category: "Criminal Procedure",
    category_urdu: "فوجداری ضابطہ",
    author: "Adv. Muhammad Ali Khan, ASC",
    author_urdu: "ایڈووکیٹ محمد علی خان (سپریم کورٹ)",
    read_time: "4 min read",
    read_time_urdu: "4 منٹ کا مطالعہ",
    featured: false,
    content: "The Supreme Court of Pakistan has reiterated in 2024 SCMR 918 that in offenses not falling within the prohibitory clause of Section 497(1) of the Code of Criminal Procedure (CrPC) 1898, the grant of bail is the rule and refusal is a rare exception.\n\nFurthermore, under Section 497(2) CrPC, whenever reasonable grounds appear that the accused's involvement calls for 'further inquiry' (Mazeed Tahqiq), bail becomes a matter of right rather than judicial discretion.\n\nThe Court emphasized that pre-trial incarceration cannot be used as a tool for punishment before conviction, safeguarding fundamental liberty guaranteed under Article 9 and Article 10A of the Constitution.",
    content_urdu: "سپریم کورٹ آف پاکستان نے اپنے حالیہ فیصلے (2024 SCMR 918) میں واضح کیا ہے کہ ایسے جرائم جو ضابطہ فوجداری کی دفعہ 497(1) کی ممنوعہ شق میں نہیں آتے، ان میں ضمانت منظور کرنا عمومی اصول ہے اور انکار صرف غیر معمولی حالات میں کیا جا سکتا ہے۔\n\nعدالت عظمیٰ نے قرار دیا کہ دفعہ 497(2) کے تحت جہاں مقدمہ 'مزید تفتیش' (Further Inquiry) کا متقاضی ہو، وہاں ضمانت ملزم کا قانونی حق بن جاتی ہے۔ آئین کے آرٹیکل 9 اور 10A کے تحت جرم ثابت ہونے سے پہلے کسی شہری کو بطورِ سزا جیل میں نہیں رکھا جا سکتا۔",
    created_at: "2026-10-17T12:00:00.000Z"
  },
  {
    id: 4,
    title: "Tenant & Landlord Protections Under Punjab & Islamabad Rent Laws",
    title_urdu: "کرایہ داری قوانین: مالک مکان اور کرایہ دار کے قانونی حقوق اور بے دخلی کا طریقہ کار",
    subtitle: "Why unregistered rent agreements trigger penalties and how Rent Tribunals adjudicate eviction petitions within statutory timelines.",
    subtitle_urdu: "رینٹ ٹربیونل میں کرایہ نامے کی رجسٹریشن اور قانونی بے دخلی کے قواعد۔",
    category: "Civil & Property Law",
    category_urdu: "دیوانی اور کرایہ داری قانون",
    author: "Adv. Ayesha Siddiqui, AHC",
    author_urdu: "ایڈووکیٹ عائشہ صدیقی (ہائی کورٹ)",
    read_time: "5 min read",
    read_time_urdu: "5 منٹ کا مطالعہ",
    featured: false,
    content: "Under the Punjab Rented Premises Act 2009 and Islamabad Rent Restriction Ordinance 2001, every tenancy agreement must be in writing and registered with the Rent Registrar within the prescribed period.\n\nIf a landlord approaches the Rent Tribunal for eviction due to default in monthly rent or expiry of tenancy period without a registered lease agreement, the law imposes a mandatory fine calculated as a percentage of annual rent before the petition is entertained.\n\nBoth landlords and tenants are strongly advised to execute biometric e-Stamp tenancy agreements and maintain bank transfer receipts for all security deposits and monthly rental payments.",
    content_urdu: "پنجاب رینٹڈ پریمسز ایکٹ 2009 اور اسلام آباد رینٹ آرڈیننس کے تحت ہر کرایہ نامہ تحریری شکل میں ہونا اور رینٹ رجسٹرار کے پاس درج کروانا لازمی ہے۔\n\nاگر مالک مکان یا کرایہ دار بغیر رجسٹرڈ کرایہ نامے کے رینٹ ٹربیونل سے رجوع کرتا ہے تو عدالت پہلے سالانہ کرائے کے تناسب سے قانونی جرمانہ عائد کرتی ہے۔\n\nقانونی تحفظ کے لیے ہمیشہ ای-اسٹامپ پیپر پر تحریری معاہدہ کریں اور کرائے کی ادائیگی بینک ٹرانسفر کے ذریعے عمل میں لائیں۔",
    created_at: "2026-10-16T09:30:00.000Z"
  }
];

export const INITIAL_LAWS = [
  {
    id: 1,
    title: "Constitution of Pakistan, 1973 — Articles 9, 10A & 23",
    title_urdu: "آئینِ پاکستان 1973 — آرٹیکل 9، 10A اور 23 (بنیادی حقوق)",
    category: "Constitution",
    section_number: "Part II, Chapter 1 (Articles 8–28)",
    section_urdu: "حصہ دوم، باب اول (آرٹیکل 8 تا 28)",
    content: "ARTICLE 9 — Security of Person:\nNo person shall be deprived of life or liberty save in accordance with law.\n\nARTICLE 10A — Right to Fair Trial:\nFor the determination of his civil rights and obligations or in any criminal charge against him a person shall be entitled to a fair trial and due process.\n\nARTICLE 23 — Provision as to Property:\nEvery citizen shall have the right to acquire, hold and dispose of property in any part of Pakistan, subject to the Constitution and any reasonable restrictions imposed by law in the public interest.\n\nARTICLE 25 — Equality of Citizens:\n(1) All citizens are equal before law and are entitled to equal protection of law.\n(2) There shall be no discrimination on the basis of sex.\n(3) Nothing in this Article shall prevent the State from making any special provision for the protection of women and children.",
    content_urdu: "آرٹیکل 9 — فرد کی جان و آزادی کا تحفظ:\nکسی شخص کو زندگی یا آزادی سے محروم نہیں کیا جائے گا سوائے اس کے کہ قانون اس کی اجازت دے۔\n\nآرٹیکل 10A — منصفانہ ٹرائل کا حق:\nاپنے شہری حقوق و فرائض کے تعین یا کسی فوجداری الزام کے فیصلے کے لیے ہر شخص منصفانہ سماعت اور شفاف قانونی کارروائی (Due Process) کا حقدار ہوگا۔\n\nآرٹیکل 23 — جائیداد کے حقوق:\nہر شہری کو پاکستان کے کسی بھی حصے میں جائیداد حاصل کرنے، رکھنے اور فروخت کرنے کا حق حاصل ہوگا۔\n\nآرٹیکل 25 — شہریوں کی مساوات:\n(1) تمام شہری قانون کی نظر میں برابر ہیں اور قانونی تحفظ کے مساوی حقدار ہیں۔\n(2) جنس کی بنیاد پر کوئی امتیاز نہیں برتا جائے گا۔\n(3) ریاست خواتین اور بچوں کے تحفظ کے لیے خصوصی اقدامات کر سکتی ہے۔",
    marginal_notes: "Inserted by the Constitution (Eighteenth Amendment) Act, 2010. Invoked via Writ Jurisdiction under Article 199 (High Court) and Article 184(3) (Supreme Court).",
    marginal_notes_urdu: "آٹھویں ترمیم 2010 کے تحت آرٹیکل 10A شامل کیا گیا۔ ہائی کورٹ میں آرٹیکل 199 کی رٹ پٹیشن کے ذریعے قابلِ نفاذ۔",
    description: "Fundamental constitutional guarantees protecting life, liberty, property, and due process in all courts.",
    created_at: "2026-10-15T09:00:00.000Z"
  },
  {
    id: 2,
    title: "Pakistan Penal Code (PPC), 1860 — Section 489-F (Cheque Dishonour)",
    title_urdu: "تعزیراتِ پاکستان (PPC) 1860 — دفعہ 489-F (چیک ڈس آنر ہونا)",
    category: "Pakistan Penal Code",
    section_number: "Act XLV of 1860 • Section 489-F",
    section_urdu: "ایکٹ نمبر 45 بابت 1860 • دفعہ 489-F",
    content: "SECTION 489-F — Dishonestly issuing a cheque:\nWhoever dishonestly issues a cheque towards re-payment of a loan or fulfillment of an obligation which is dishonoured on presentation, shall be punishable with imprisonment which may extend to three years, or with fine, or with both, unless he can establish, for which the burden of proof shall rest on him, that he had made arrangements with his bank to ensure that the cheque would be honoured and that the bank was at fault in dishonouring the cheque.\n\nEVIDENTIARY ELEMENTS REQUIRED FOR FIR:\n1. Issuance of a valid cheque signed by the accused.\n2. The cheque must be issued towards repayment of a loan or fulfillment of an existing legal obligation (not merely as a security cheque without underlying liability).\n3. Official Bank Return Memo confirming dishonour due to insufficient funds or account closure.",
    content_urdu: "دفعہ 489-F — بددیانتی سے چیک جاری کرنا:\nجو کوئی قرض کی واپسی یا کسی قانونی ذمہ داری کی ادائیگی کے لیے بددیانتی سے ایسا چیک جاری کرے جو بینک میں پیش کیے جانے پر کیش نہ ہو (ڈس آنر ہو جائے)، تو اسے تین سال تک قید، یا جرمانہ، یا دونوں سزائیں دی جا سکتی ہیں، الا یہ کہ وہ ثابت کرے کہ بینک کی غلطی سے چیک کیش نہیں ہوا۔\n\nمقدمے کے لیے لازمی قانونی شرائط:\n1۔ چیک کسی قرض کی واپسی یا قانونی ذمہ داری کی ادائیگی کے لیے دیا گیا ہو (محض ضمانتی چیک پر دفعہ 489-F لاگو نہیں ہوتی — PLD 2022 SC 410)۔\n2۔ بینک کی جانب سے باضابطہ چیک ریٹرن میمو (Return Memo) موجود ہو۔\n3۔ متاثرہ فریق سول کورٹ میں آرڈر 37 (Order XXXVII CPC) کے تحت رقم کی واپسی کا دعویٰ بھی دائر کر سکتا ہے۔",
    marginal_notes: "Non-bailable, cognizable offense triable by Magistrate of the First Class. Does not fall under the prohibitory clause of Section 497 CrPC.",
    marginal_notes_urdu: "ناقابلِ ضمانت جرم، مجسٹریٹ درجہ اول کےق دائرہ اختیار میں۔ دفعہ 497 ضابطہ فوجداری کی ممنوعہ شق سے باہر۔",
    description: "Criminal liability for dishonestly issuing a cheque towards repayment of a loan or legal obligation.",
    created_at: "2026-10-14T11:00:00.000Z"
  },
  {
    id: 3,
    title: "Specific Relief Act, 1877 — Sections 12, 42 & 54 (Specific Performance & Injunctions)",
    title_urdu: "مخصوص دادرسی ایکٹ 1877 — دفعہ 12، 42 اور 54 (تعملی مختص اور حکمِ امتناعی)",
    category: "Act",
    section_number: "Act I of 1877 • Chapters II, VI & X",
    section_urdu: "ایکٹ نمبر 1 بابت 1877 • باب دوم، ششم اور دہم",
    content: "SECTION 12 — Cases in which specific performance enforceable:\nExcept as otherwise provided in this Chapter, the specific performance of any contract may in the discretion of the Court be enforced when the act agreed to be done is in the performance, wholly or partly, of a trust, or when there exists no standard for ascertaining the actual damage caused by non-performance (such as agreements to sell immovable property).\n\nSECTION 42 — Discretion of Court as to declaration of status or right:\nAny person entitled to any legal character, or to any right as to any property, may institute a suit against any person denying, or interested to deny, his title to such character or right.\n\nSECTION 54 — Perpetual Injunctions when granted:\nSubject to the other provisions contained in, or referred to by, this Chapter, a perpetual injunction may be granted to prevent the breach of an obligation existing in favour of the applicant, whether expressly or by implication.",
    content_urdu: "دفعہ 12 — معاہدے کی تعمیلِ مختص (Specific Performance):\nغیر منقولہ جائیداد کی خرید و فروخت کے معاہدے (اقرار نامہ بیع) کی خلاف ورزی کی صورت میں عدالت فریقِ ثانی کو پابند کر سکتی ہے کہ وہ معاہدے کے مطابق جائیداد کی رجسٹری کروائے۔\n\nدفعہ 42 — استقرارِ حق (Declaratory Decree):\nکوئی بھی شخص جو کسی قانونی حیثیت یا جائیداد کے حق کا مالک ہو، کسی ایسے شخص کے خلاف استقرارِ حق کا دعویٰ دائر کر سکتا ہے جو اس کے حق سے انکار کرے۔\n\nدفعہ 54 — دوامی حکمِ امتناعی (Permanent Injunction / Stay Order):\nعدالت درخواست گزار کے قانونی حق کے تحفظ اور غیر قانونی قبضے یا مداخلت کو روکنے کے لیے مستقل حکمِ امتناعی جاری کر سکتی ہے۔",
    marginal_notes: "Read with Order XXXIX Rules 1 & 2 CPC for Temporary Injunctions (three ingredients: prima facie case, balance of convenience, irreparable loss).",
    marginal_notes_urdu: "عارضی حکمِ امتناعی (Stay Order) کے لیے ضابطہ دیوانی کے آرڈر 39 رول 1 اور 2 کے ساتھ پڑھا جائے۔",
    description: "Governing statute for property sale enforcement, title declarations, and court stay orders.",
    created_at: "2026-10-13T14:00:00.000Z"
  },
  {
    id: 4,
    title: "Muslim Family Laws Ordinance, 1961 — Sections 7, 8 & 9 (Talaq, Khula & Maintenance)",
    title_urdu: "مسلم عائلی قوانین آرڈیننس 1961 — دفعہ 7، 8 اور 9 (طلاق، خلع اور نان و نفقہ)",
    category: "Judgment",
    section_number: "Ordinance VIII of 1961 • Family Courts Act 1964",
    section_urdu: "آرڈیننس نمبر 8 بابت 1961 • فیملی کورٹس ایکٹ 1964",
    content: "SECTION 7 — Talaq & Arbitration Council Procedure:\n(1) Any man who wishes to divorce his wife shall, as soon as may be after the pronouncement of Talaq in any form whatsoever, give the Chairman of the Union Council notice in writing of his having done so, and shall supply a copy thereof to the wife.\n(3) Save as provided in sub-section (5), a Talaq, unless revoked earlier, expressly or otherwise, shall not be effective until the expiration of ninety days from the day on which notice under sub-section (1) is delivered to the Chairman.\n\nSECTION 9 — Maintenance (Nafaqah):\nIf any husband fails to maintain his wife adequately, or where there are more wives than one, fails to maintain them equitably, the wife, or all or any of the wives, may in addition to seeking any other legal remedy available apply to the Family Court for past and future maintenance and annual 10% statutory enhancement.",
    content_urdu: "دفعہ 7 — طلاق اور ثالثی کونسل کا طریقہ کار:\n(1) کوئی بھی شخص جو اپنی بیوی کو طلاق دے، وہ طلاق کے بعد یونین کونسل کے چیئرمین کو تحریری نوٹس بھیجے گا اور اس کی ایک نقل بیوی کو فراہم کرے گا۔\n(3) چیئرمین کو نوٹس ملنے کے 90 دن پورے ہونے تک طلاق مؤثر نہیں ہوگی تاکہ مصالحت کی کوشش کی جا سکے۔\n\nدفعہ 9 — بیوی اور بچوں کا نان و نفقہ (Maintenance):\nاگر شوہر بیوی یا بچوں کا مناسب خرچ (نان و نفقہ) ادا نہ کرے تو فیملی کورٹ کے ذریعے ماضی اور مستقبل کا خرچ بمعہ سالانہ 10 فیصد قانونی اضافہ وصول کیا جا سکتا ہے۔",
    marginal_notes: "Family Courts hold exclusive jurisdiction over dower (Haq Mehr), dowry articles, custody of minors (Hizanat), and dissolution of marriage.",
    marginal_notes_urdu: "حق مہر، سامانِ جہیز، بچوں کی حضانت اور تنسیخِ نکاح کے مقدمات فیملی کورٹ کے خصوصی دائرہ اختیار میں ہیں۔",
    description: "Statutory rules governing Nikah registration, divorce notice periods, Khula, and maintenance decrees.",
    created_at: "2026-10-12T10:00:00.000Z"
  }
];

export const INITIAL_LAWYERS = [
  {
    id: 1,
    name: "Adv. Sara Mansoor",
    name_urdu: "ایڈووکیٹ سارہ منصور",
    court: "Supreme Court of Pakistan",
    court_urdu: "سپریم کورٹ آف پاکستان",
    specialty: "Property, Inheritance & Constitutional Law",
    specialty_urdu: "جائیداد، وراثت اور آئینی قوانین",
    location: "Islamabad",
    city: "Islamabad",
    city_urdu: "اسلام آباد",
    contact_info: "sara.mansoor@supremecourtbar.pk • +92 300 1234567",
    phone: "923001234567",
    bio: "14+ years representing families, corporate entities, and overseas Pakistanis in property mutation, NADRA succession disputes, and Supreme Court constitutional petitions. Former Executive Member of the Islamabad High Court Bar Association.",
    intro: "Supreme Court Advocate specializing in succession, property disputes, and constitutional writs.",
    intro_urdu: "سپریم کورٹ میں 14 سالہ وکالت کا تجربہ۔ وراثتی جائیداد، فیملی اور آئینی درخواستوں کی ماہر۔",
    image_url: "",
    fee: 5000,
    rating: "4.9",
    reviews_count: 84,
    experience_years: 14,
    bar_council_id: "PBC-SC-2012-4491",
    is_female: true,
    pro_bono: true,
    verified: true,
    created_at: "2026-10-10T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Adv. Kamran Tariq",
    name_urdu: "ایڈووکیٹ کامران طارق",
    court: "Lahore High Court",
    court_urdu: "لاہور ہائی کورٹ",
    specialty: "Corporate, FBR Tax & Startup Law",
    specialty_urdu: "کارپوریٹ، ایف بی آر ٹیکس اور کمپنی لا",
    location: "Lahore",
    city: "Lahore",
    city_urdu: "لاہور",
    contact_info: "kamran.tariq@lhcbar.pk • +92 321 9876543",
    phone: "923219876543",
    bio: "Corporate legal counsel for over 60 technology companies and export houses. Specializes in SECP incorporation, FBR Appellate Tribunal representations, PSEB tax exemptions, and cross-border commercial contracts.",
    intro: "High Court Advocate and corporate tax counsel specializing in FBR appeals and IT export compliance.",
    intro_urdu: "لاہور ہائی کورٹ کے ممتاز ٹیکس اور کارپوریٹ وکیل۔ ایس ای سی پی اور ایف بی آر اپیلز میں مہارت۔",
    image_url: "",
    fee: 3500,
    rating: "4.8",
    reviews_count: 62,
    experience_years: 11,
    bar_council_id: "PbBC-HC-2015-8820",
    is_female: false,
    pro_bono: false,
    verified: true,
    created_at: "2026-10-09T08:00:00.000Z"
  },
  {
    id: 3,
    name: "Adv. Muhammad Ali Khan",
    name_urdu: "ایڈووکیٹ محمد علی خان",
    court: "Supreme Court / Sindh High Court",
    court_urdu: "سپریم کورٹ / سندھ ہائی کورٹ",
    specialty: "Criminal Defense, FIA & Bail Litigation",
    specialty_urdu: "فوجداری مقدمات، ایف آئی اے اور ضمانتیں",
    location: "Karachi",
    city: "Karachi",
    city_urdu: "کراچی",
    contact_info: "ali.khan@shcbar.pk • +92 333 4567890",
    phone: "923334567890",
    bio: "Senior Advocate with 18 years of criminal litigation expertise across Sindh High Court and Supreme Court Karachi Registry. Specializes in white-collar defense, FIA cybercrime & banking inquiries, and FIR quashment under Section 561-A CrPC.",
    intro: "Senior specialist in white-collar defense, FIA banking courts, and High Court criminal appeals.",
    intro_urdu: "سندھ ہائی کورٹ اور سپریم کورٹ کے سینئر وکیل۔ فوجداری دفاع، ضمانتوں اور اپیلوں میں 18 سالہ تجربہ۔",
    image_url: "",
    fee: 4500,
    rating: "4.9",
    reviews_count: 119,
    experience_years: 18,
    bar_council_id: "SBC-SC-2008-1904",
    is_female: false,
    pro_bono: true,
    verified: true,
    created_at: "2026-10-08T15:00:00.000Z"
  },
  {
    id: 4,
    name: "Adv. Ayesha Siddiqui",
    name_urdu: "ایڈووکیٹ عائشہ صدیقی",
    court: "Lahore High Court",
    court_urdu: "لاہور ہائی کورٹ",
    specialty: "Family Law, Guardianship & Civil Litigation",
    specialty_urdu: "فیملی لا، بچوں کی حضانت اور دیوانی مقدمات",
    location: "Lahore",
    city: "Lahore",
    city_urdu: "لاہور",
    contact_info: "ayesha.siddiqui@familylaw.pk • +92 345 1122334",
    phone: "923451122334",
    bio: "Dedicated family and civil rights litigator with 9 years of practice before Guardian Courts and Lahore High Court. Provides compassionate, confidential representation in Khula, child custody (Hizanat), maintenance, and domestic protection petitions.",
    intro: "High Court Family & Guardian Court specialist with dedicated Pro-Bono legal aid clinic.",
    intro_urdu: "لاہور ہائی کورٹ کی معروف فیملی اور گارڈین کورٹ ایڈووکیٹ۔ خواتین کے قانونی حقوق اور حضانت کی ماہر۔",
    image_url: "",
    fee: 2500,
    rating: "5.0",
    reviews_count: 93,
    experience_years: 9,
    bar_council_id: "PbBC-HC-2017-5532",
    is_female: true,
    pro_bono: true,
    verified: true,
    created_at: "2026-10-07T11:00:00.000Z"
  },
  {
    id: 5,
    name: "Adv. Zarak Khan Afridi",
    name_urdu: "ایڈووکیٹ زرک خان آفریدی",
    court: "Peshawar High Court",
    court_urdu: "پشاور ہائی کورٹ",
    specialty: "Land Revenue, Pre-Emption (Shufa) & Writ Petitions",
    specialty_urdu: "اراضی ریکارڈ، حقِ شفعہ اور رٹ پٹیشنز",
    location: "Peshawar",
    city: "Peshawar",
    city_urdu: "پشاور",
    contact_info: "zarak.afridi@phcbar.pk • +92 312 9988776",
    phone: "923129988776",
    bio: "12 years of appellate experience in Peshawar High Court handling complex Land Revenue Act disputes, Pre-Emption (Haq-e-Shufa) suits, and service tribunal matters across Khyber Pakhtunkhwa.",
    intro: "Peshawar High Court counsel for land revenue mutations, civil revisions, and constitutional writs.",
    intro_urdu: "پشاور ہائی کورٹ کے ممتاز وکیل برائے دیوانی مقدمات، اراضی تنازعات اور آئینی رٹ پٹیشنز۔",
    image_url: "",
    fee: 3000,
    rating: "4.8",
    reviews_count: 47,
    experience_years: 12,
    bar_council_id: "KPBC-HC-2014-3109",
    is_female: false,
    pro_bono: true,
    verified: true,
    created_at: "2026-10-06T14:00:00.000Z"
  }
];

export const INITIAL_TEMPLATES = [
  {
    id: 1,
    title: "Residential Lease & Tenancy Agreement (Registered Standard)",
    title_urdu: "رہائشی کرایہ نامہ (پنجاب اور اسلام آباد رینٹ ایکٹ کے مطابق)",
    category: "Property & Rent",
    category_urdu: "جائیداد اور کرایہ داری",
    price: 1500,
    pages: 6,
    bilingual: true,
    summary: "Compliant with Punjab Rented Premises Act 2009 & Islamabad Rent Restriction Ordinance. Includes security deposit escrow clause, 10% annual escalation, and eviction notice covenants.",
    summary_urdu: "پنجاب اور اسلام آباد کے کرایہ داری قوانین کے عین مطابق۔ سیکیورٹی ڈپازٹ، سالانہ 10 فیصد اضافہ اور بے دخلی کے قانونی نوٹس کی شقیں شامل ہیں۔",
    preview_text: "THIS TENANCY AGREEMENT is made at [City] on this [Day] day of [Month], 2026, BETWEEN:\n\n1. [Landlord Full Name], S/O [Father Name], holding CNIC No. [00000-0000000-0], resident of [Address] (hereinafter called the 'LANDLORD', which expression shall include his legal heirs, successors, and assigns) of the ONE PART;\n\nAND\n\n2. [Tenant Full Name], S/O [Father Name], holding CNIC No. [00000-0000000-0], resident of [Address] (hereinafter called the 'TENANT') of the OTHER PART.\n\nWHEREAS the Landlord is the absolute legal owner in possession of residential premises bearing House No. [___], Sector/Phase [___]...\n\nNOW THIS AGREEMENT WITNESSETH AS UNDER:\n1. TENANCY PERIOD: Eleven (11) months commencing from [Date] to [Date], renewable by mutual written consent with a 10% annual increase.\n2. MONTHLY RENT: PKR [Amount]/- payable in advance on or before the 5th day of each calendar month via cross-cheque or bank transfer.\n3. SECURITY DEPOSIT: PKR [Amount]/- (equivalent to 2 months' rent) refundable interest-free upon peaceful vacation of premises after deducting unpaid utility bills."
  },
  {
    id: 2,
    title: "IT Export & Freelancer Non-Disclosure & IP Assignment Agreement",
    title_urdu: "آئی ٹی کمپنی اور فری لانسر رازداری و انٹلیکچوئل پراپرٹی معاہدہ (NDA)",
    category: "Corporate & IT",
    category_urdu: "کارپوریٹ اور آئی ٹی",
    price: 2500,
    pages: 8,
    bilingual: true,
    summary: "Drafted for PSEB-registered software houses, SaaS founders, and independent contractors. Covers source code IP ownership, non-solicitation, and Arbitration Act 1940 dispute resolution.",
    summary_urdu: "سافٹ ویئر ہاؤسز اور فری لانسرز کے لیے تیار کردہ۔ سورس کوڈ کی ملکیت، رازداری اور ثالثی ایکٹ 1940 کے تحت تنازعات کے حل کی مکمل شقیں۔",
    preview_text: "MUTUAL NON-DISCLOSURE & INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT\n\nExecuted under the Contract Act, 1872 and Electronic Transactions Ordinance, 2002.\n\n1. CONFIDENTIAL INFORMATION: Includes all proprietary source code, API credentials, client lists, architecture blueprints, and trade secrets disclosed during the engagement.\n2. WORK MADE FOR HIRE & IP ASSIGNMENT: Upon receipt of full milestone payment in accordance with Invoice Schedule A, all Intellectual Property Rights in the deliverables shall vest irrevocably in the Client.\n3. GOVERNING LAW & ARBITRATION: Any dispute arising out of this Agreement shall be referred to sole arbitration in [Lahore/Islamabad/Karachi] under the Arbitration Act, 1940."
  },
  {
    id: 3,
    title: "Declaration of Family Gift Deed (Hiba-Nama — Immovable Property)",
    title_urdu: "اقرار نامہ ہبہ (خاندانی تحفہ / جائیداد کی منتقلی کا قانونی مسودہ)",
    category: "Inheritance & Family",
    category_urdu: "وراثت اور فیملی لا",
    price: 3000,
    pages: 5,
    bilingual: true,
    summary: "Contains the three mandatory ingredients of a valid Islamic Hiba under Supreme Court rulings: Offer by Donor (Ijab), Acceptance by Donee (Qubool), and Delivery of Possession (Qabza).",
    summary_urdu: "سپریم کورٹ کے فیصلوں کے مطابق شرعی و قانونی ہبہ کی تینوں لازمی شرائط (ایجاب، قبول اور قبضے کی حوالگی) پر مشتمل مستند مسودہ۔",
    preview_text: "DEED OF DECLARATION OF ORAL GIFT (HIBA-NAMA)\n\nWHEREAS the Donor out of natural love and affection for the Donee (being his/her real [Daughter/Son/Spouse]) has gifted the scheduled property free from all encumbrances.\n\nMANDATORY STATUTORY INGREDIENTS:\n(a) OFFER (IJAB): The Donor made an unconditional declaration of gift in the presence of two marginal witnesses.\n(b) ACCEPTANCE (QUBOOL): The Donee expressly accepted the gift on the spot in person.\n(c) DELIVERY OF POSSESSION (QABZA): Constructive and physical possession along with original title documents has been handed over to the Donee."
  },
  {
    id: 4,
    title: "Statutory Legal Notice for Dishonoured Cheque & Recovery (Sec 489-F PPC)",
    title_urdu: "ڈس آنر چیک اور رقم کی واپسی کا قانونی نوٹس (دفعہ 489-F / آرڈر 37)",
    category: "Criminal & Recovery",
    category_urdu: "فوجداری اور ریکوری",
    price: 2000,
    pages: 4,
    bilingual: true,
    summary: "15-day final demand notice served via Registered Post AD before lodging an FIR under Section 489-F PPC and summary recovery suit under Order XXXVII CPC.",
    summary_urdu: "ایف آئی آر کے اندراج اور سیشن کورٹ میں آرڈر 37 کے تحت دعویٰ دائر کرنے سے قبل بھیجا جانے والا 15 روزہ حتمی قانونی نوٹس۔",
    preview_text: "REGISTERED AD / COURIER LEGAL NOTICE\n\nSUBJECT: FINAL DEMAND NOTICE PRIOR TO CRIMINAL PROSECUTION UNDER SECTION 489-F PPC AND SUMMARY SUIT UNDER ORDER XXXVII CPC FOR RECOVERY OF PKR [AMOUNT]/-\n\nUnder instructions from and on behalf of my client [Client Name], I hereby serve upon you the following statutory notice:\n1. That in discharge of youroutstanding financial obligation, you issued Cheque No. [_______] dated [Date] drawn on [Bank Name].\n2. That upon presentation, the said cheque was dishonoured with the remarks 'Insufficient Funds' per Bank Return Memo dated [Date].\n3. You are hereby called upon to pay the principal sum within 15 days, failing which criminal & civil proceedings shall be initiated at your risk and cost."
  }
];

export const INITIAL_QUESTIONS = [
  {
    id: 1,
    title: "My brothers transferred our late father's agricultural land in Punjab without informing my sister and me. Is there a time limit to challenge this mutation?",
    title_urdu: "میرے بھائیوں نے والد کی وفات کے بعد زرعی زمین کا انتقال ہمارے علم میں لائے بغیر اپنے نام کروا لیا۔ کیا اس کو چیلنج کرنے کی کوئی مدت مقرر ہے؟",
    category: "Property & Inheritance",
    category_urdu: "جائیداد اور وراثت",
    city: "Faisalabad",
    is_anonymous: true,
    author_name: "Anonymous Citizen",
    created_at: "2026-10-19T06:30:00.000Z",
    answer_count: 2,
    verified_reply: {
      lawyer_name: "Adv. Sara Mansoor, ASC",
      lawyer_name_urdu: "ایڈووکیٹ سارہ منصور (سپریم کورٹ)",
      court: "Supreme Court of Pakistan",
      reply: "Under the settled law of the Supreme Court of Pakistan (Ghulam Ali v. Mst. Ghulam Sarwar, PLD 1990 SC 1 & PLD 2024 SC 112), no statute of limitation runs against a female co-sharer in ancestral inheritance. Fraud vitiates the most solemn proceedings. You can immediately file an application before the Provincial Ombudsperson under the Enforcement of Women's Property Rights Act 2020 or a civil suit for declaration under Section 42 of the Specific Relief Act to cancel the fraudulent mutation.",
      reply_urdu: "سپریم کورٹ آف پاکستان کے طے شدہ اصول (PLD 1990 SC 1 اور PLD 2024 SC 112) کے مطابق وراثت کے معاملات میں شریک وارث (بالخصوص بہنوں اور بیٹیوں) کے خلاف زائد المیعاد (Limitation) کا قانون لاگو نہیں ہوتا۔ دھوکہ دہی سے کیا گیا انتقال کسی بھی وقت منسوخ کروایا جا سکتا ہے۔ آپ فوری طور پر صوبائی محتسب برائے حقوقِ جائیدادِ خواتین کو درخواست دیں۔"
    }
  },
  {
    id: 2,
    title: "I receive USD payments from US clients via Wise directly into my Pakistani IBAN. My bank deducted 1% withholding tax. How do I reduce it to 0.25%?",
    title_urdu: "مجھے امریکہ سے فری لانسنگ کی رقم براہِ راست پاکستانی بینک اکاؤنٹ میں ملتی ہے جس پر بینک 1 فیصد ٹیکس کاٹ رہا ہے۔ اسے 0.25 فیصد کیسے کیا جائے؟",
    category: "Tax & Corporate Law",
    category_urdu: "ٹیکس اور کارپوریٹ قانون",
    city: "Lahore",
    is_anonymous: false,
    author_name: "Usman R. (Software Engineer)",
    created_at: "2026-10-18T14:20:00.000Z",
    answer_count: 1,
    verified_reply: {
      lawyer_name: "Adv. Kamran Tariq, AHC",
      lawyer_name_urdu: "ایڈووکیٹ کامران طارق (ہائی کورٹ)",
      court: "Lahore High Court",
      reply: "Under Section 154A of the Income Tax Ordinance 2001, banks deduct 1% by default unless you provide a valid PSEB (Pakistan Software Export Board) Freelancer Registration Certificate. Once you obtain the PSEB certificate online and submit it to your bank's Foreign Exchange / Home Remittance desk along with SBP Purpose Code 9186, future deductions will automatically drop to 0.25% full and final tax.",
      reply_urdu: "انکم ٹیکس آرڈیننس 2001 کے سیکشن 154A کے تحت جب تک آپ اپنے بینک کو پاکستان سافٹ ویئر ایکسپورٹ بورڈ (PSEB) کا رجسٹریشن سرٹیفکیٹ جمع نہیں کرواتے، بینک 1 فیصد ٹیکس کاٹتا ہے۔ پی ایس ای بی پورٹل پر رجسٹریشن کروا کر سرٹیفکیٹ اپنے بینک میں جمع کروائیں، جس کے بعد ٹیکس صرف 0.25 فیصد کٹے گا۔"
    }
  },
  {
    id: 3,
    title: "Can a tenant be evicted without notice if the written rent agreement expired 3 months ago but the tenant is still paying monthly rent via bank transfer?",
    title_urdu: "اگر تحریری کرایہ نامے کی مدت 3 ماہ قبل ختم ہو چکی ہو لیکن کرایہ دار ہر ماہ بینک کے ذریعے کرایہ دے رہا ہو تو کیا بغیر نوٹس بے دخل کیا جا سکتا ہے؟",
    category: "Civil & Property Law",
    category_urdu: "دیوانی اور کرایہ داری قانون",
    city: "Islamabad",
    is_anonymous: true,
    author_name: "Anonymous Citizen",
    created_at: "2026-10-17T18:10:00.000Z",
    answer_count: 1,
    verified_reply: {
      lawyer_name: "Adv. Ayesha Siddiqui, AHC",
      lawyer_name_urdu: "ایڈووکیٹ عائشہ صدیقی (ہائی کورٹ)",
      court: "Lahore High Court",
      reply: "No landlord can forcibly evict a tenant without an eviction order from the Special Judge (Rent) / Rent Tribunal. While expiry of tenancy period is a valid ground for filing an eviction petition under Section 15 of the Punjab Rented Premises Act 2009, forcible self-help dispossession is illegal and you can seek immediate injunctive protection.",
      reply_urdu: "کوئی بھی مالک مکان عدالتی حکم (Rent Tribunal) کے بغیر کرایہ دار کو زبردستی بے دخل نہیں کر سکتا۔ اگرچہ معاہدے کی مدت ختم ہونا بے دخلی کی درخواست کی بنیاد بن سکتا ہے، لیکن قانونی کارروائی اور نوٹس کے بغیر زبردستی سامان نکالنا غیر قانونی ہے۔"
    }
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 101,
    lawyer_id: 1,
    lawyer_name: "Adv. Sara Mansoor",
    lawyer_name_urdu: "ایڈووکیٹ سارہ منصور",
    court: "Supreme Court of Pakistan",
    client_name: "Tariq Mehmood",
    date: "2026-10-22",
    time_slot: "04:00 PM (PKT)",
    fee: 5000,
    payment_method: "Safepay Escrow (Protected)",
    status: "Active",
    case_summary: "NADRA Letter of Administration & ancestral house mutation in F-10 Islamabad.",
    escrow_id: "ESC-PK-89241"
  },
  {
    id: 102,
    lawyer_id: 2,
    lawyer_name: "Adv. Kamran Tariq",
    lawyer_name_urdu: "ایڈووکیٹ کامران طارق",
    court: "Lahore High Court",
    client_name: "Tariq Mehmood",
    date: "2026-10-12",
    time_slot: "02:30 PM (PKT)",
    fee: 3500,
    payment_method: "JazzCash Escrow",
    status: "Past",
    case_summary: "PSEB IT Export registration and Section 154A tax return audit review.",
    escrow_id: "ESC-PK-77410"
  }
];

export const INITIAL_CATEGORIES = [
  // Editorial Article Categories
  { id: 1, scope: "article", name: "Property & Inheritance", name_urdu: "جائیداد اور وراثت" },
  { id: 2, scope: "article", name: "Tax & Corporate Law", name_urdu: "ٹیکس اور کارپوریٹ قانون" },
  { id: 3, scope: "article", name: "Criminal Procedure", name_urdu: "فوجداری ضابطہ" },
  { id: 4, scope: "article", name: "Civil & Property Law", name_urdu: "دیوانی اور کرایہ داری قانون" },
  { id: 5, scope: "article", name: "Family & Guardianship", name_urdu: "عائلی قوانین اور حضانت" },
  // Statute / Law Library Categories
  { id: 6, scope: "law", name: "Constitution", name_urdu: "آئینِ پاکستان" },
  { id: 7, scope: "law", name: "Pakistan Penal Code", name_urdu: "تعزیراتِ پاکستان (PPC)" },
  { id: 8, scope: "law", name: "Act", name_urdu: "قانون / ایکٹ" },
  { id: 9, scope: "law", name: "Judgment", name_urdu: "عدالتی نظائر / فیصلے" },
  // Template Storefront Categories
  { id: 10, scope: "template", name: "Property & Rent", name_urdu: "جائیداد اور کرایہ داری" },
  { id: 11, scope: "template", name: "Corporate & IT", name_urdu: "کارپوریٹ اور آئی ٹی" },
  { id: 12, scope: "template", name: "Inheritance & Family", name_urdu: "وراثت اور فیملی لا" },
  { id: 13, scope: "template", name: "Criminal & Recovery", name_urdu: "فوجداری اور ریکوری" },
  // Advocate Cities
  { id: 14, scope: "lawyer_city", name: "Islamabad", name_urdu: "اسلام آباد" },
  { id: 15, scope: "lawyer_city", name: "Lahore", name_urdu: "لاہور" },
  { id: 16, scope: "lawyer_city", name: "Karachi", name_urdu: "کراچی" },
  { id: 17, scope: "lawyer_city", name: "Peshawar", name_urdu: "پشاور" },
];

export const INITIAL_SITE_SETTINGS = [
  {
    id: 1,
    masthead_title: "The Daily Legal Brief",
    masthead_title_urdu: "دی ڈیلی لیگل بریف",
    masthead_kicker: "PAKISTAN LEGAL JOURNAL, STATUTE ARCHIVE & VERIFIED ADVOCATE NETWORK",
    masthead_kicker_urdu: "پاکستان کا مستند قانونی جریدہ، آئینی لائبریری اور تصدیق شدہ وکلاء کا نیٹ ورک",
    masthead_subtitle: "Authoritative constitutional commentary, codified Pakistan statutes, and direct escrow consultations with verified High Court and Supreme Court advocates.",
    masthead_subtitle_urdu: "آئینِ پاکستان 1973، تعزیراتِ پاکستان، سپریم کورٹ کے فیصلوں کا تجزیہ اور ہائی کورٹ و سپریم کورٹ کے تصدیق شدہ وکلاء سے براہِ راست مشاورت۔",
    volume_issue: "VOL. IV · NO. 109 · ISLAMABAD · LAHORE · KARACHI · PESHAWAR",
    volume_issue_urdu: "جلد چہارم · شمارہ 109 · اسلام آباد · لاہور · کراچی · پشاور",
    plate_citation: "PLD 2024 SC 112 · ART. 23 & 25",
    plate_quote: "“Inheritance vests immediately upon the demise of the predecessor; no female co-sharer can be divested through coercion.”",
    plate_quote_urdu: "”مورث کی وفات کے فوراً بعد وراثت تمام شرعی وارثان کو منتقل ہو جاتی ہے؛ کسی خاتون کو دباؤ کے تحت وراثت سے محروم نہیں کیا جا سکتا۔“",
    plate_footer: "NADRA 15-Day Succession Protocol",
    plate_footer_urdu: "نادرا 15 روزہ جانشینی سرٹیفکیٹ گائیڈ",
    escrow_cleared_pkr: 285000,
  }
];

export const INITIAL_PROBONO_REQUESTS = [
  {
    id: 201,
    applicant: "Mst. Zainab Bibi",
    monthly_income: "28000",
    category: "Women Inheritance Deprivation",
    certificate_type: "Union Council Income Certificate",
    status: "Assigned to High Court Pro-Bono Panel",
    created_at: "2026-10-18T11:00:00.000Z"
  },
  {
    id: 202,
    applicant: "Muhammad Rafiq (Daily Wage Worker)",
    monthly_income: "32000",
    category: "Labour & Wage Recovery",
    certificate_type: "BISP / Zakat Mustahiq Declaration",
    status: "Under Advocate Review (Screen 48)",
    created_at: "2026-10-19T09:15:00.000Z"
  }
];

export const INITIAL_PROBONO_GUIDELINES = [
  {
    id: 1,
    title: "1. Union Council / Ward Verification",
    title_urdu: "1۔ یونین کونسل یا وارڈ سرٹیفکیٹ",
    description: "Signed certificate from your local Union Council Chairman or Secretary verifying monthly household income below PKR 50,000.",
    description_urdu: "یونین کونسل کے چیئرمین یا سیکرٹری کی جانب سے جاری کردہ تصدیق نامہ کہ ماہانہ آمدن 50,000 روپے سے کم ہے۔"
  },
  {
    id: 2,
    title: "2. Salary Slip or Pension Book",
    title_urdu: "2۔ تنخواہ کی سلپ یا پنشن بک",
    description: "Recent pay slip or widow pension record showing eligibility for District Legal Empowerment Committee aid.",
    description_urdu: "حالیہ تنخواہ کی سلپ یا بیوہ پنشن ریکارڈ جو مفت قانونی امداد کی اہلیت ظاہر کرے۔"
  },
  {
    id: 3,
    title: "3. Zakat / Bait-ul-Maal / Ombudsperson Referral",
    title_urdu: "3۔ زکوٰۃ کمیٹی یا صوبائی محتسب ریفرل",
    description: "Local Zakat Committee Form-CZ or Ombudsperson Women Property Rights referral.",
    description_urdu: "مقامی زکوٰۃ کمیٹی کا فارم یا صوبائی محتسب برائے حقوقِ جائیدادِ خواتین کا ریفرل۔"
  }
];

export const INITIAL_CRM_LEADS = [
  {
    id: 409,
    title: "Inheritance Mutation Challenge under Women Property Rights Act 2020",
    title_urdu: "خواتین کے حقوقِ جائیداد ایکٹ 2020 کے تحت وراثتی انتقال کا مقدمہ",
    client_name: "Begum Rukhsana K.",
    jurisdiction: "Islamabad High Court",
    proposed_fee: 45000,
    status: "Pending Review",
    summary: "Ancestral house in Sector F-10 mutated without NADRA biometric consent of two sisters."
  },
  {
    id: 410,
    title: "FBR Section 154A IT Export Tax Appeal before Appellate Tribunal",
    title_urdu: "ایف بی آر سیکشن 154A آئی ٹی ایکسپورٹ ٹیکس اپیل",
    client_name: "Nexus Cloud Pvt Ltd",
    jurisdiction: "Lahore High Court",
    proposed_fee: 65000,
    status: "Accepted",
    summary: "PSEB registered exporter challenging 1% tax deduction instead of 0.25% final regime."
  }
];

export const INITIAL_CASE_MILESTONES = [
  {
    id: 1,
    case_ref: "W.P. No. 3812/2026 — Mst. Amina vs. Revenue Officer",
    title: "Filing of Constitutional Writ under Article 199",
    status: "Completed",
    date: "2026-10-14",
    shared_file: "Writ_Petition_Art199_Signed.pdf"
  },
  {
    id: 2,
    case_ref: "W.P. No. 3812/2026 — Mst. Amina vs. Revenue Officer",
    title: "Interim Stay Order Granted & Notice to NADRA",
    status: "Active",
    date: "2026-10-20",
    shared_file: "IHC_Stay_Order_Oct2026.pdf"
  },
  {
    id: 3,
    case_ref: "Suit No. 114/2026 — Recovery under Order XXXVII CPC",
    title: "Summons Served with Bank Return Memo (Sec 489-F)",
    status: "Scheduled",
    date: "2026-10-28",
    shared_file: "Bank_Return_Memo_Verified.pdf"
  }
];

export const INITIAL_LAWYER_NETWORK = [
  {
    id: 1,
    author: "Adv. Sara Mansoor, ASC (Islamabad)",
    topic: "Supreme Court Larger Bench Interpretation on Article 10A & Revenue Mutations",
    topic_urdu: "آرٹیکل 10A اور اراضی انتقالات پر سپریم کورٹ لارجر بینچ کی تشریح",
    chamber_city: "Islamabad → Lahore Referral",
    replies_count: 14,
    content: "Seeking co-counsel at Lahore High Court Multan Bench for execution of a Supreme Court decree involving agricultural land partition (Wanda)."
  },
  {
    id: 2,
    author: "Adv. Muhammad Ali Khan, ASC (Karachi)",
    topic: "FIA Corporate Crime Wing SOPs on Section 489-F & Banking Offenses",
    topic_urdu: "ایف آئی اے کارپوریٹ کرائم ونگ اور بینکنگ عدالتوں کے نئے ضوابط",
    chamber_city: "Karachi High Court Bar",
    replies_count: 9,
    content: "Updated division bench precedent on pre-arrest bail where parallel civil suit under Order XXXVII is pending adjudication."
  }
];

export const INITIAL_AI_PROMPTS = [
  {
    id: 1,
    prompt_en: "Draft a post-arrest bail petition under Section 497 CrPC",
    prompt_ur: "دفعہ 497 ضابطہ فوجداری کے تحت ضمانت بعد از گرفتاری کی درخواست تیار کریں",
    category: "Criminal Procedure"
  },
  {
    id: 2,
    prompt_en: "Find property inheritance case laws under PLD 2024 SC 112",
    prompt_ur: "خواتین کے وراثتی حقوق ایکٹ 2020 کے تحت محتسب کو درخواست کا طریقہ",
    category: "Property & Inheritance"
  },
  {
    id: 3,
    prompt_en: "Key ingredients to quash an FIR under Section 489-F PPC",
    prompt_ur: "چیک ڈس آنر (دفعہ 489-F) کے قانونی نوٹس کے نکات",
    category: "Criminal Procedure"
  },
  {
    id: 4,
    prompt_en: "Checklist for 0.25% IT exporter withholding tax under Section 154A",
    prompt_ur: "فری لانسرز کے لیے PSEB رجسٹریشن اور 0.25% ٹیکس سیکشن 154A",
    category: "Tax & Corporate Law"
  }
];

export const INITIAL_AI_CITATIONS = [
  {
    id: 1,
    code: "PLD 2024 SC 112",
    title: "Supreme Court of Pakistan — Inheritance & Statutory Protection",
    court: "Supreme Court of Pakistan",
    summary: "Affirms that inheritance vests immediately upon demise of the predecessor and fraudulent mutations depriving female heirs are void ab initio without limitation constraints."
  },
  {
    id: 2,
    code: "2024 SCMR 918",
    title: "Supreme Court — Post-Arrest Bail & Further Inquiry (Sec 497 CrPC)",
    court: "Supreme Court of Pakistan",
    summary: "Establishes that grant of bail is the rule and refusal is an exception in offenses falling outside the prohibitory clause of Section 497(1) CrPC."
  },
  {
    id: 3,
    code: "PLD 2022 SC 410",
    title: "Supreme Court — Security Cheque vs. Repayment Obligation (Sec 489-F PPC)",
    court: "Supreme Court of Pakistan",
    summary: "Clarifies that a cheque issued purely as a security deposit without an existing crystallized debt does not attract criminal liability under Section 489-F PPC."
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Escrow Deposit Verified (#ESC-PK-89241)",
    title_urdu: "ایسکرو ڈپازٹ کی تصدیق ہو گئی (#ESC-PK-89241)",
    message: "Your PKR 5,000 consultation retainer with Adv. Sara Mansoor (Supreme Court) is locked in Safepay Escrow.",
    message_urdu: "ایڈووکیٹ سارہ منصور کے ساتھ آپ کی مشاورتی فیس (5,000 روپے) ایسکرو اکاؤنٹ میں محفوظ کر دی گئی ہے۔",
    time: "10 mins ago",
    type: "escrow"
  },
  {
    id: 2,
    title: "Verified Advocate Replied to Public Q&A (Screen 10)",
    title_urdu: "تصدیق شدہ ایڈووکیٹ نے آپ کے سوال کا جواب دیا",
    message: "Adv. Kamran Tariq posted a statutory citation regarding Section 154A PSEB 0.25% tax regime.",
    message_urdu: "ایڈووکیٹ کامران طارق نے سیکشن 154A ٹیکس رعائت پر قانونی رائے شائع کی ہے۔",
    time: "1 hour ago",
    type: "qa"
  },
  {
    id: 3,
    title: "High Court Cause-List Alert (Screen 38)",
    title_urdu: "ہائی کورٹ کاز لسٹ الرٹ (اسکرین 38)",
    message: "W.P. No. 3812/2026 fixed before Court Room No. 2, Islamabad High Court for 24 Oct 2026.",
    message_urdu: "رٹ پٹیشن نمبر 3812/2026 کی سماعت اسلام آباد ہائی کورٹ کورٹ روم نمبر 2 میں مقرر۔",
    time: "3 hours ago",
    type: "court"
  }
];

const inMemoryStore: Record<string, any[]> = {
  categories: [...INITIAL_CATEGORIES],
  site_settings: [...INITIAL_SITE_SETTINGS],
  articles: [...INITIAL_ARTICLES],
  laws: [...INITIAL_LAWS],
  lawyers: [...INITIAL_LAWYERS],
  templates: [...INITIAL_TEMPLATES],
  questions: [...INITIAL_QUESTIONS],
  appointments: [...INITIAL_APPOINTMENTS],
  probono_requests: [...INITIAL_PROBONO_REQUESTS],
  probono_guidelines: [...INITIAL_PROBONO_GUIDELINES],
  crm_leads: [...INITIAL_CRM_LEADS],
  case_milestones: [...INITIAL_CASE_MILESTONES],
  lawyer_network: [...INITIAL_LAWYER_NETWORK],
  ai_prompts: [...INITIAL_AI_PROMPTS],
  ai_citations: [...INITIAL_AI_CITATIONS],
  notifications: [...INITIAL_NOTIFICATIONS],
};

const STORAGE_VERSION = 'v4';

export function getTableData(table: string): any[] {
  if (typeof window !== 'undefined') {
    const key = `plp_store_${STORAGE_VERSION}_${table}`;
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fallback to initial
      }
    }
    const initial = inMemoryStore[table] || [];
    localStorage.setItem(key, JSON.stringify(initial));
    return [...initial];
  }
  return inMemoryStore[table] || [];
}

export function saveTableData(table: string, data: any[]): void {
  inMemoryStore[table] = data;
  if (typeof window !== 'undefined') {
    const key = `plp_store_${STORAGE_VERSION}_${table}`;
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('plp_data_updated'));
  }
}

export function getSiteSettings() {
  const rows = getTableData('site_settings');
  return rows[0] || INITIAL_SITE_SETTINGS[0];
}

export function saveSiteSettings(updated: Record<string, any>) {
  const current = getSiteSettings();
  const next = [{ ...current, ...updated, id: 1 }];
  saveTableData('site_settings', next);
}

export function getCategoriesByScope(scope: string): Array<{ id: number; scope: string; name: string; name_urdu: string }> {
  const all = getTableData('categories');
  return all.filter((c) => c.scope === scope);
}

export function resetAllPlatformData(): void {
  Object.keys(inMemoryStore).forEach((table) => {
    const defaultsMap: Record<string, any[]> = {
      categories: [...INITIAL_CATEGORIES],
      site_settings: [...INITIAL_SITE_SETTINGS],
      articles: [...INITIAL_ARTICLES],
      laws: [...INITIAL_LAWS],
      lawyers: [...INITIAL_LAWYERS],
      templates: [...INITIAL_TEMPLATES],
      questions: [...INITIAL_QUESTIONS],
      appointments: [...INITIAL_APPOINTMENTS],
      probono_requests: [...INITIAL_PROBONO_REQUESTS],
      probono_guidelines: [...INITIAL_PROBONO_GUIDELINES],
      crm_leads: [...INITIAL_CRM_LEADS],
      case_milestones: [...INITIAL_CASE_MILESTONES],
      lawyer_network: [...INITIAL_LAWYER_NETWORK],
      ai_prompts: [...INITIAL_AI_PROMPTS],
      ai_citations: [...INITIAL_AI_CITATIONS],
      notifications: [...INITIAL_NOTIFICATIONS],
    };
    if (defaultsMap[table]) {
      saveTableData(table, defaultsMap[table]);
    }
  });
}

class MockQueryBuilder {
  private tableName: string;
  private filters: Array<(row: any) => boolean> = [];
  private sortFn: ((a: any, b: any) => number) | null = null;
  private limitCount: number | null = null;
  private isSingle = false;
  private isCountOnly = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(_columns = '*', options?: { count?: string; head?: boolean }) {
    void _columns;
    if (options?.head || options?.count) {
      this.isCountOnly = true;
    }
    return this;
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.sortFn = (a, b) => {
      const valA = a[column];
      const valB = b[column];
      if (valA === valB) return 0;
      if (valA == null) return ascending ? 1 : -1;
      if (valB == null) return ascending ? -1 : 1;
      return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((row) => String(row[column]) === String(value));
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async insert(rows: any[]) {
    const data = getTableData(this.tableName);
    const newItems = rows.map((r, i) => ({
      id: r.id || Date.now() + i,
      created_at: r.created_at || new Date().toISOString(),
      ...r
    }));
    const updated = [...newItems, ...data];
    saveTableData(this.tableName, updated);
    return { data: newItems, error: null };
  }

  update(updates: any) {
    return {
      eq: async (column: string, value: any) => {
        const data = getTableData(this.tableName);
        let found = false;
        const updated = data.map((row) => {
          if (String(row[column]) === String(value)) {
            found = true;
            return { ...row, ...updates };
          }
          return row;
        });
        if (found) {
          saveTableData(this.tableName, updated);
          return { data: updates, error: null };
        }
        return { data: null, error: { message: 'Row not found' } };
      }
    };
  }

  delete() {
    return {
      eq: async (column: string, value: any) => {
        const data = getTableData(this.tableName);
        const updated = data.filter((row) => String(row[column]) !== String(value));
        saveTableData(this.tableName, updated);
        return { data: null, error: null };
      }
    };
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any; count?: number }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return (async () => {
      let rows = getTableData(this.tableName);

      for (const filter of this.filters) {
        rows = rows.filter(filter);
      }

      const totalCount = rows.length;

      if (this.sortFn) {
        rows = [...rows].sort(this.sortFn);
      }

      if (this.limitCount != null) {
        rows = rows.slice(0, this.limitCount);
      }

      if (this.isCountOnly) {
        return { data: null, error: null, count: totalCount };
      }

      if (this.isSingle) {
        if (rows.length === 0) {
          return { data: null, error: { message: 'Row not found' } };
        }
        return { data: rows[0], error: null };
      }

      return { data: rows, error: null, count: totalCount };
    })().then(onfulfilled, onrejected);
  }
}

export function createMockClient() {
  return {
    from: (tableName: string) => new MockQueryBuilder(tableName)
  };
}

export function createClient(supabaseUrl?: string, supabaseKey?: string) {
  if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey) {
    try {
      return createSupabaseClient(supabaseUrl, supabaseKey);
    } catch {
      return createMockClient() as any;
    }
  }
  return createMockClient() as any;
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;
