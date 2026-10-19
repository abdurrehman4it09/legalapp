'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function UrduHome() {
  const [articles, setArticles] = useState<any[]>([])
  const [leadName, setLeadName] = useState('')
  const [leadMessage, setLeadMessage] = useState('')

  useEffect(() => {
    async function getArticles() {
      const { data } = await supabase.from('articles').select('*').order('id', { ascending: false }).limit(5)
      if (data) setArticles(data)
    }
    getArticles()
  }, [])

  function submitLead(e: any) {
    e.preventDefault()
    const text = `السلام علیکم پاکستان لیگل پلیٹ فارم! میرا نام ${leadName} ہے۔ مجھے اس معاملے میں مدد درکار ہے: ${leadMessage}`
    window.open(`https://wa.me/923000000000?text=${encodeURIComponent(text)}`, '_blank')
    setLeadName(''); setLeadMessage('');
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white text-gray-900 border-t-4 border-emerald-800">
      
      <header className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
          <Link href="/urdu" className="text-3xl font-bold tracking-tight text-gray-900 hover:text-emerald-800 transition">
            پاکستان لیگل پلیٹ فارم<span className="text-emerald-800">۔</span>
          </Link>
          <div className="flex gap-6 items-center">
            <span className="text-emerald-800 font-bold border-b-2 border-emerald-800 pb-1">خبریں</span>
            <Link href="/urdu/laws" className="text-gray-500 hover:text-emerald-800 font-semibold transition">قانونی لائبریری</Link>
            <Link href="/urdu/lawyers" className="text-gray-500 hover:text-emerald-800 font-semibold transition">وکلاء ڈائریکٹری</Link>
            <Link href="/" className="bg-emerald-800 text-white px-5 py-2 rounded-full font-semibold text-xs hover:bg-emerald-900 transition shadow-sm" dir="ltr">English</Link>
          </div>
        </div>
      </header>

      {/* ULTRA-MINIMAL HERO BANNER */}
      <section className="bg-white py-24 px-6 text-center border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-emerald-800 font-bold tracking-widest text-sm mb-6 block">— قانون کے مستقبل میں خوش آمدید</span>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 text-gray-900 leading-tight">
            انصاف اور رہنمائی، <br/>اب آپ کی انگلیوں پر۔
          </h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
            پاکستان کا پہلا دو لسانی پلیٹ فارم جو شہریوں کو تصدیق شدہ وکلاء، قانونی خبروں اور ڈیجیٹل قانونی لائبریری سے جوڑتا ہے۔
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/urdu/lawyers" className="bg-emerald-800 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-emerald-900 transition shadow-sm">
              وکیل تلاش کریں
            </Link>
            <Link href="/urdu/laws" className="bg-white border-2 border-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold tracking-wide hover:border-emerald-800 hover:text-emerald-800 transition">
              قوانین پڑھیں
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-6 mt-12 grid grid-cols-1 lg:grid-cols-5 gap-16 mb-24">
        
        {/* Left Column (News) */}
        <div className="lg:col-span-3">
          <header className="mb-10 border-b border-gray-200 pb-6">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">روزنامہ بریف</h2>
          </header>
          
          <div className="space-y-12">
            {articles.map((art: any) => (
              <article key={art.id} className="group">
                <Link href={`/urdu/article/${art.id}`}>
                  <h3 className="text-3xl font-bold mb-3 leading-snug text-gray-900 group-hover:text-emerald-800 transition duration-200 cursor-pointer">
                    {art.title_urdu}
                  </h3>
                </Link>
                <p className="text-gray-600 leading-relaxed mb-4 text-lg line-clamp-2">
                  {art.content_urdu}
                </p>
                <Link href={`/urdu/article/${art.id}`} className="text-emerald-800 font-bold text-sm hover:text-emerald-900 transition flex items-center gap-2 w-max">
                  <span className="text-lg">←</span> پوری کہانی پڑھیں
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column (Lead Form) */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 p-10 rounded-xl sticky top-10 shadow-sm">
            <span className="text-emerald-800 font-bold tracking-widest text-xs mb-3 block">— رابطہ کریں</span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">قانونی مدد درکار ہے؟</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">ہمارے ہیڈکوارٹر کو براہ راست پیغام بھیجیں۔ ہم آپ کے کیس کا جائزہ لے کر آپ کو درست قانونی ماہر سے جوڑیں گے۔</p>
            
            <form onSubmit={submitLead} className="space-y-4">
              <input 
                type="text" required placeholder="آپ کا مکمل نام" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded focus:bg-white outline-none focus:border-emerald-800 transition"
                value={leadName} onChange={e => setLeadName(e.target.value)}
              />
              <textarea 
                required placeholder="اپنے قانونی مسئلے کی مختصر وضاحت کریں..." 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded h-32 focus:bg-white outline-none focus:border-emerald-800 transition resize-none"
                value={leadMessage} onChange={e => setLeadMessage(e.target.value)}
              />
              <button type="submit" className="w-full bg-emerald-800 text-white font-bold tracking-widest py-4 rounded hover:bg-emerald-900 transition shadow-sm">
                ہیڈکوارٹر کو درخواست بھیجیں
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  )
}