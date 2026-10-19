'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/supabase'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function UrduLawLibrary() {
  const [laws, setLaws] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('سب')

  useEffect(() => {
    async function getLaws() {
      const { data } = await supabase.from('laws').select('*').order('id', { ascending: false })
      if (data) setLaws(data)
    }
    getLaws()
  }, [])

  const filteredLaws = laws.filter((law) => {
    const q = search.toLowerCase()
    const matchesSearch = (law.title_urdu && law.title_urdu.includes(q)) || 
                          (law.content_urdu && law.content_urdu.includes(q))
    const matchesCat = selectedCat === 'سب' || law.category === selectedCat
    return matchesSearch && matchesCat
  })

  return (
    <div dir="rtl" className="min-h-screen bg-white text-gray-900 border-t-4 border-emerald-800">
      <header className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-6">
          <Link href="/urdu" className="text-3xl font-bold tracking-tight text-gray-900 hover:text-emerald-800 transition">
            پاکستان لیگل پلیٹ فارم<span className="text-emerald-800">۔</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/urdu" className="text-gray-500 hover:text-emerald-800 font-semibold transition">خبریں</Link>
            <span className="text-emerald-800 font-bold border-b-2 border-emerald-800 pb-1">قانونی لائبریری</span>
            <Link href="/urdu/lawyers" className="text-gray-500 hover:text-emerald-800 font-semibold transition">وکلاء ڈائریکٹری</Link>
            <Link href="/laws" className="bg-emerald-800 text-white px-5 py-2 rounded-full font-semibold text-xs hover:bg-emerald-900 transition shadow-sm" dir="ltr">English</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 mt-12">
        <header className="mb-10 border-b border-gray-200 pb-8">
          <h2 className="text-5xl font-bold tracking-tight mb-4 text-gray-900">ڈیجیٹل قانونی لائبریری</h2>
          <p className="text-gray-500 text-xl mb-6">آئین پاکستان، ایکٹس اور عدالتی فیصلوں کا مطالعہ کریں۔</p>
          
          <input 
            type="text" 
            placeholder="قوانین، دفعات یا الفاظ سے تلاش کریں..." 
            className="w-full p-4 mb-4 bg-gray-50 border border-gray-200 rounded text-base outline-none focus:border-emerald-800 focus:bg-white transition"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 flex-wrap text-xs font-bold uppercase tracking-wider">
            {['سب', 'Constitution', 'Pakistan Penal Code', 'Act', 'Judgment'].map((cat) => (
              <button 
                key={cat} onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded transition ${selectedCat === cat ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} dir="ltr"
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-12">
          {filteredLaws.length === 0 ? (
            <p className="text-gray-500">کوئی قانون موجود نہیں ہے۔</p>
          ) : (
            filteredLaws.map((law: any) => (
              <article key={law.id} className="group border-b border-gray-100 pb-10 last:border-0">
                <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase mb-2 block" dir="ltr">— {law.category}</span>
                <Link href={`/urdu/laws/${law.id}`}>
                  <h3 className="text-3xl font-bold mb-3 leading-snug text-gray-900 group-hover:text-emerald-800 transition cursor-pointer">
                    {law.title_urdu || law.title}
                  </h3>
                </Link>
                <p className="text-gray-600 leading-relaxed mb-4 text-base line-clamp-3">{law.content_urdu || law.content}</p>
                <Link href={`/urdu/laws/${law.id}`} className="text-emerald-800 font-bold text-sm tracking-widest hover:text-emerald-900 transition inline-flex items-center gap-2">
                  <span className="text-lg">←</span> مکمل دستاویز پڑھیں
                </Link>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}