'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function UrduLawyerDirectory() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('سب')

  useEffect(() => {
    async function getLawyers() {
      const { data } = await supabase.from('lawyers').select('*').order('id', { ascending: false })
      if (data) setLawyers(data)
    }
    getLawyers()
  }, [])

  const cities = ['سب', ...Array.from(new Set(lawyers.map(l => l.city_urdu || l.city).filter(Boolean)))]

  const filteredLawyers = lawyers.filter((l) => {
    const q = search.toLowerCase()
    const name = (l.name_urdu || l.name || '').toLowerCase()
    const specialty = (l.specialty_urdu || l.specialty || '').toLowerCase()
    const city = (l.city_urdu || l.city || '').toLowerCase()

    const matchesSearch = name.includes(q) || specialty.includes(q) || city.includes(q)
    const currentCity = l.city_urdu || l.city
    const matchesCity = cityFilter === 'سب' || currentCity === cityFilter

    return matchesSearch && matchesCity
  })

  return (
    <div dir="rtl" className="min-h-screen bg-white text-gray-900 border-t-4 border-emerald-800">
      <header className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
          <Link href="/urdu" className="text-3xl font-bold tracking-tight text-gray-900 hover:text-emerald-800 transition">
            پاکستان لیگل پلیٹ فارم<span className="text-emerald-800">۔</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/urdu" className="text-gray-500 hover:text-emerald-800 font-semibold transition">خبریں</Link>
            <span className="text-emerald-800 font-bold border-b-2 border-emerald-800 pb-1">وکلاء ڈائریکٹری</span>
            <Link href="/lawyers" className="bg-emerald-800 text-white px-5 py-2 rounded-full font-semibold text-xs hover:bg-emerald-900 transition mr-2" dir="ltr">English</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-12">
        <header className="mb-10 border-b border-gray-200 pb-8">
          <h2 className="text-5xl font-bold tracking-tight mb-4 text-gray-900">تصدیق شدہ وکلاء</h2>
          <p className="text-gray-500 text-xl mb-6">پاکستان بھر کے ممتاز قانونی ماہرین اور ایڈووکیٹس تلاش کریں۔</p>

          <input 
            type="text" 
            placeholder="نام، مہارت، یا شہر سے تلاش کریں..." 
            className="w-full p-4 mb-4 bg-gray-50 border border-gray-200 rounded text-base outline-none focus:border-emerald-800 focus:bg-white transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 flex-wrap text-xs font-bold">
            {cities.map((city) => (
              <button 
                key={city} 
                onClick={() => setCityFilter(city)}
                className={`px-3 py-1.5 rounded transition ${cityFilter === city ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {city}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredLawyers.length === 0 ? (
            <p className="text-gray-500">کوئی وکیل موجود نہیں ہے۔</p>
          ) : (
            filteredLawyers.map((lawyer: any) => (
              <article key={lawyer.id} className="border border-gray-100 p-8 hover:border-emerald-800 transition flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 tracking-widest block mb-2">— {lawyer.specialty_urdu || lawyer.specialty}</span>
                  <h3 className="text-2xl font-bold mb-1 text-gray-900">{lawyer.name_urdu || lawyer.name}</h3>
                  <p className="text-gray-400 font-semibold mb-4 text-sm">📍 {lawyer.city_urdu || lawyer.city}</p>
                  {(lawyer.intro_urdu || lawyer.intro) && (
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm border-r-2 border-emerald-100 pr-3">{lawyer.intro_urdu || lawyer.intro}</p>
                  )}
                </div>
                <a 
                  href={`https://wa.me/${lawyer.phone || '923000000000'}?text=${encodeURIComponent('السلام علیکم، میں نے آپ کا پروفائل پاکستان لیگل پلیٹ فارم پر دیکھا ہے اور قانونی مشاورت درکار ہے۔')}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="bg-green-500 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-green-600 transition inline-flex items-center gap-2 w-max shadow-sm"
                >
                  💬 واٹس ایپ پر رابطہ کریں
                </a>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}