'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function PublicLawyerDirectory() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('All')

  useEffect(() => {
    async function getLawyers() {
      const { data } = await supabase.from('lawyers').select('*').order('id', { ascending: false })
      if (data) setLawyers(data)
    }
    getLawyers()
  }, [])

  const cities = ['All', ...Array.from(new Set(lawyers.map(l => l.city).filter(Boolean)))]

  const filteredLawyers = lawyers.filter((l) => {
    const q = search.toLowerCase()
    const matchesSearch = (l.name && l.name.toLowerCase().includes(q)) ||
                          (l.specialty && l.specialty.toLowerCase().includes(q)) ||
                          (l.city && l.city.toLowerCase().includes(q))
    const matchesCity = cityFilter === 'All' || l.city === cityFilter
    return matchesSearch && matchesCity
  })

  return (
    <div dir="ltr" className="min-h-screen bg-white text-gray-900">
      <header className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900 hover:text-emerald-800 transition">
            Pakistan Legal Platform<span className="text-emerald-800">.</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-gray-500 hover:text-emerald-800 font-semibold text-sm transition">News</Link>
            <Link href="/laws" className="text-gray-500 hover:text-emerald-800 font-semibold text-sm transition">Law Library</Link>
            <span className="text-emerald-800 font-bold border-b-2 border-emerald-800 pb-1 text-sm">Directory</span>
            <Link href="/urdu/lawyers" className="bg-emerald-800 text-white px-5 py-2 rounded-full font-semibold text-xs hover:bg-emerald-900 transition shadow-sm">اردو</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-12 mb-24">
        <header className="mb-10 border-b border-gray-200 pb-8">
          <h2 className="text-5xl font-bold tracking-tight mb-4 text-gray-900">Verified Advocates</h2>
          <p className="text-gray-500 text-xl mb-6">Find and connect with top legal professionals across Pakistan.</p>
          
          <input 
            type="text" 
            placeholder="Search by advocate name, specialty, or city..." 
            className="w-full p-4 mb-4 bg-gray-50 border border-gray-200 rounded focus:bg-white text-base outline-none focus:border-emerald-800 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 flex-wrap text-xs font-bold uppercase tracking-wider">
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
            <p className="text-gray-500">No advocates match your search criteria.</p>
          ) : (
            filteredLawyers.map((lawyer: any) => (
              <article key={lawyer.id} className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-800 transition duration-300 flex flex-col justify-between group">
                <div>
                  {/* NEW: Profile Picture Layout */}
                  <div className="flex items-center gap-6 mb-6">
                    {lawyer.image_url ? (
                      <img src={lawyer.image_url} alt={lawyer.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 group-hover:border-emerald-800 transition" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center text-gray-400 font-bold text-2xl group-hover:border-emerald-800 transition">
                        {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase mb-1 block">— {lawyer.specialty}</span>
                      <h3 className="text-2xl font-bold mb-1 text-gray-900 leading-tight">{lawyer.name}</h3>
                      <p className="text-gray-400 font-semibold text-sm">📍 {lawyer.city}</p>
                    </div>
                  </div>

                  {lawyer.intro && (
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm border-l-2 border-emerald-100 pl-4">{lawyer.intro}</p>
                  )}
                </div>
                
                <a 
                  href={`https://wa.me/${lawyer.phone || '923000000000'}?text=${encodeURIComponent(`Hello Advocate ${lawyer.name}, I found your profile on Pakistan Legal Platform and would like to request a consultation.`)}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="bg-emerald-800 text-white font-bold tracking-widest uppercase text-xs px-6 py-3 rounded hover:bg-emerald-900 transition inline-flex items-center justify-center gap-2 w-full mt-2"
                >
                  Message on WhatsApp
                </a>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  )
}