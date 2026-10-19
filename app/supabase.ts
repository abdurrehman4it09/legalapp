// Resilient Supabase client with in-memory / localStorage fallback for AI Studio
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const INITIAL_ARTICLES = [
  {
    id: 1,
    title: "Understanding Property Inheritance Rights for Women in Pakistan",
    title_urdu: "پاکستان میں خواتین کے وراثتی حقوق اور جائیداد کی منتقلی کا مکمل قانونی طریقہ کار",
    category: "Constitutional Law",
    content: "Under Article 23 of the Constitution and Islamic Jurisprudence codified in Pakistan's legal system, women's right to inherited property is absolute and protected by the Supreme Court of Pakistan.\n\nRecent statutory reforms and NADRA Succession Facilitation Units have simplified the process into a 15-day biometric verification window.\n\nIf any family member pressures a female heir to relinquish her share without documented consideration, the transaction is void ab initio under Supreme Court rulings (PLD 2024 SC 112).",
    content_urdu: "پاکستان کے آئین کے آرٹیکل 23 اور اسلامی قوانین کے تحت خواتین کا وراثت میں حصہ مکمل طور پر محفوظ ہے اور سپریم کورٹ آف پاکستان نے اس حق کے تحفظ کے لیے سخت احکامات جاری کیے ہیں۔\n\nاب نادرا کے جانشینی سرٹیفکیٹ (Succession Certificate) کے ذریعے صرف 15 دن میں وراثتی جائیداد کی تقسیم ممکن ہو گئی ہے۔\n\nسپریم کورٹ کے واضح فیصلوں کے مطابق اگر کسی خاتون سے دباؤ یا دھوکے سے وراثت سے دستبرداری کا کاغذ لکھوایا جائے تو اس کی کوئی قانونی حیثیت نہیں ہوگی۔",
    created_at: "2026-10-19T08:00:00.000Z"
  },
  {
    id: 2,
    title: "How Freelancers & IT Exporters Can Register With PSEB for 0.25% Tax",
    title_urdu: "فری لانسرز اور آئی ٹی ایکسپورٹرز کے لیے 0.25 فیصد ٹیکس رعائت حاصل کرنے کا طریقہ",
    category: "Tax & Corporate Law",
    content: "Pakistan's Finance Act provides a major tax incentive for IT exporters and independent freelancers bringing foreign remittance into Pakistan through formal banking channels.\n\nWhile standard export proceeds face a 1% withholding tax under Section 154A, individuals registered with PSEB enjoy a reduced final tax rate of just 0.25%.\n\nFreelancers can register directly online through the PSEB portal by submitting bank remittance statements.",
    content_urdu: "پاکستان کے فنانس ایکٹ کے تحت بیرون ملک سے زرمبادلہ لانے والے فری لانسرز اور آئی ٹی کمپنیوں کو ٹیکس میں خصوصی رعائت دی گئی ہے۔\n\nانکم ٹیکس آرڈیننس کے سیکشن 154A کے تحت اگر آپ پاکستان سافٹ ویئر ایکسپورٹ بورڈ (PSEB) کے ساتھ رجسٹرڈ ہیں تو یہ ٹیکس کم ہو کر صرف 0.25 فیصد رہ جاتا ہے۔",
    created_at: "2026-10-18T10:00:00.000Z"
  },
  {
    id: 3,
    title: "Supreme Court Clarifies Bail Guidelines Under Section 497 CrPC",
    title_urdu: "سپریم کورٹ نے ضابطہ فوجداری کی دفعہ 497 کے تحت ضمانت کے اصول واضح کر دیے",
    category: "Criminal Procedure",
    content: "The Supreme Court of Pakistan has reiterated that grant of bail is the rule and refusal is an exception in offenses that do not fall within the prohibitory clause of Section 497 CrPC.\n\nThe landmark verdict emphasizes individual liberty under Article 9 of the Constitution and instructs lower trial courts not to deny bail on speculative grounds.",
    content_urdu: "سپریم کورٹ آف پاکستان نے واضح کیا ہے کہ ایسے جرائم جو ممنوعہ شق میں نہیں آتے، ان میں ضمانت دینا عمومی اصول ہے اور انکار استثنا ہے۔ عدالت عظمیٰ نے آئین کے آرٹیکل 9 کے تحت شہری آزادیوں کے تحفظ پر زور دیا۔",
    created_at: "2026-10-17T12:00:00.000Z"
  }
];

export const INITIAL_LAWS = [
  {
    id: 1,
    title: "Constitution of Pakistan, 1973 - Article 9 & 10A",
    title_urdu: "آئینِ پاکستان 1973 - آرٹیکل 9 اور 10A (جان و آزادی کا تحفظ)",
    category: "Constitution",
    content: "ARTICLE 9 (Security of Person):\nNo person shall be deprived of life or liberty save in accordance with law.\n\nARTICLE 10A (Right to Fair Trial):\nFor the determination of his civil rights and obligations or in any criminal charge against him a person shall be entitled to a fair trial and due process.",
    content_urdu: "آرٹیکل 9 (جان کا تحفظ): کسی شخص کو زندگی یا آزادی سے محروم نہیں کیا جائے گا سوائے اس کے کہ قانون اس کی اجازت دے۔\n\nآرٹیکل 10A (منصفانہ ٹرائل کا حق): اپنے شہری حقوق و فرائض کے تعین یا کسی فوجداری الزام کے فیصلے کے لیے ہر شخص منصفانہ سماعت اور شفاف قانونی کارروائی کا حقدار ہوگا۔",
    description: "Fundamental constitutional rights protecting life, liberty, and due process in all courts.",
    created_at: "2026-10-15T09:00:00.000Z"
  },
  {
    id: 2,
    title: "Pakistan Penal Code (PPC) 1860 - Section 489-F",
    title_urdu: "تعزیراتِ پاکستان (PPC) - دفعہ 489-F (چیک ڈس آنر ہونا)",
    category: "Pakistan Penal Code",
    content: "Whoever dishonestly issues a cheque towards repayment of a loan or fulfillment of an obligation which is dishonoured on presentation, shall be punishable with imprisonment up to three years, or with fine, or both.",
    content_urdu: "جو کوئی قرض کی واپسی یا کسی قانونی ذمہ داری کی ادائیگی کے لیے بددیانتی سے ایسا چیک جاری کرے جو بینک میں پیش کیے جانے پر ڈس آنر ہو جائے، اسے تین سال تک قید یا جرمانہ یا دونوں سزائیں ہو سکتی ہیں۔",
    description: "Dishonestly issuing a cheque towards loan or obligation repayment.",
    created_at: "2026-10-14T11:00:00.000Z"
  },
  {
    id: 3,
    title: "Specific Relief Act, 1877 - Section 42 & 54 (Injunctions & Stay Orders)",
    title_urdu: "مخصوص دادرسی ایکٹ 1877 - دفعہ 42 اور 54 (حکم امتناعی / سٹے آرڈر)",
    category: "Act",
    content: "Any person entitled to any legal character, or to any right as to any property, may institute a suit against any person denying, or interested to deny, his title to such character or right, and the Court may in its discretion make therein a declaration that he is so entitled.\n\nPerpetual injunctions may be granted to prevent the breach of an obligation existing in favor of the applicant.",
    content_urdu: "کوئی بھی شخص جو کسی قانونی حیثیت یا جائیداد کے حق کا حقدار ہو، کسی ایسے شخص کے خلاف دعویٰ دائر کر سکتا ہے جو اس کے حق سے انکار کر رہا ہو، اور عدالت اپنی صوابدید پر اس کے حق کی ڈگری جاری کر سکتی ہے۔",
    description: "Declaratory decrees and perpetual injunctions protecting property rights.",
    created_at: "2026-10-13T14:00:00.000Z"
  }
];

export const INITIAL_LAWYERS = [
  {
    id: 1,
    name: "Adv. Sara Mansoor",
    name_urdu: "ایڈووکیٹ سارہ منصور",
    specialty: "Property, Inheritance & Constitutional Law",
    specialty_urdu: "جائیداد، وراثت اور آئینی قوانین",
    location: "Islamabad",
    city: "Islamabad",
    city_urdu: "اسلام آباد",
    contact_info: "sara.mansoor@advocates.pk | +92 300 1234567",
    phone: "923001234567",
    bio: "14+ years representing families and overseas Pakistanis in property, succession, and Supreme Court constitutional petitions. Former Vice President of Islamabad High Court Bar Association.",
    intro: "Supreme Court advocate specializing in succession, property disputes and constitutional litigation.",
    intro_urdu: "سپریم کورٹ میں 14 سالہ وکالت کا تجربہ۔ وراثتی جائیداد، فیملی اور آئینی درخواستوں کی ماہر۔",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    fee: 5000,
    rating: "4.9",
    created_at: "2026-10-10T10:00:00.000Z"
  },
  {
    id: 2,
    name: "Adv. Kamran Tariq",
    name_urdu: "ایڈووکیٹ کامران طارق",
    specialty: "Corporate, FBR Tax & Startup Law",
    specialty_urdu: "کارپوریٹ، ایف بی آر ٹیکس اور کمپنی لا",
    location: "Lahore",
    city: "Lahore",
    city_urdu: "لاہور",
    contact_info: "kamran.tariq@lahorebar.pk | +92 321 9876543",
    phone: "923219876543",
    bio: "Corporate counsel for over 60 tech companies and startups. Specializes in SECP compliance, FBR tax appeals, foreign remittance exemptions, and cross-border commercial contracts.",
    intro: "High Court advocate and corporate legal advisor specializing in tax structuring and contracts.",
    intro_urdu: "لاہور ہائی کورٹ کے ممتاز ٹیکس اور کارپوریٹ وکیل۔ ایس ای سی پی اور ایف بی آر اپیلز میں مہارت۔",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    fee: 3500,
    rating: "4.8",
    created_at: "2026-10-09T08:00:00.000Z"
  },
  {
    id: 3,
    name: "Adv. Muhammad Ali Khan",
    name_urdu: "ایڈووکیٹ محمد علی خان",
    specialty: "Criminal Defense & Trial Advocacy",
    specialty_urdu: "فوجداری مقدمات اور ضمانتیں",
    location: "Karachi",
    city: "Karachi",
    city_urdu: "کراچی",
    contact_info: "ali.khan@sindhhighcourt.pk | +92 333 4567890",
    phone: "923334567890",
    bio: "Advocate High Court with 18 years of criminal litigation expertise across Sindh, specializing in trial courts, FIA cybercrime defense, and appellate tribunals.",
    intro: "Specialist in white collar defense, FIR quashment, and High Court criminal appeals.",
    intro_urdu: "سندھ ہائی کورٹ کے سینئر وکیل۔ فوجداری دفاع، ضمانتوں اور اپیلوں میں وسیع تجربہ۔",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    fee: 4000,
    rating: "4.9",
    created_at: "2026-10-08T15:00:00.000Z"
  }
];

// In-memory / localStorage storage
const inMemoryStore: Record<string, any[]> = {
  articles: [...INITIAL_ARTICLES],
  laws: [...INITIAL_LAWS],
  lawyers: [...INITIAL_LAWYERS]
};

function getTableData(table: string): any[] {
  if (typeof window !== 'undefined') {
    const key = `plp_mock_${table}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall back to inMemoryStore
      }
    } else {
      const initial = inMemoryStore[table] || [];
      localStorage.setItem(key, JSON.stringify(initial));
      return [...initial];
    }
  }
  return inMemoryStore[table] || [];
}

function saveTableData(table: string, data: any[]): void {
  inMemoryStore[table] = data;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`plp_mock_${table}`, JSON.stringify(data));
  }
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

  // Support awaiting this query builder directly
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
  // If a valid HTTP url and key are provided, use official client
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
