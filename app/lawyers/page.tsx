'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/supabase'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function PublicLawyersDirectory() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchLawyers() {
      const { data, error } = await supabase.from('lawyers').select('*').order('created_at', { ascending: false })
      if (!error && data) setLawyers(data)
      setLoading(false)
    }
    fetchLawyers()
  }, [])

  const filteredLawyers = lawyers.filter(l => 
    (l.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (l.specialty?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (l.location?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Advocate Directory</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">Find and connect with verified legal professionals across Pakistan.</p>
      </div>

      <div className="mb-10 max-w-xl mx-auto">
        <input 
          type="text" 
          placeholder="Search by name, specialty, or city..." 
          className="w-full p-4 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-emerald-800 font-medium animate-pulse mt-12">Loading profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLawyers.map((lawyer) => (
            <Link href={`/lawyers/${lawyer.id}`} key={lawyer.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-gray-50 mb-6 overflow-hidden border-4 border-emerald-50 group-hover:border-emerald-800 transition-colors">
                {lawyer.image_url ? (
                  <img src={lawyer.image_url} alt={lawyer.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-300 font-bold text-4xl">
                    {lawyer.name ? lawyer.name.charAt(0) : '?'}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">{lawyer.name}</h2>
              <p className="text-emerald-800 font-medium text-sm mt-1 mb-3">{lawyer.specialty}</p>
              <div className="w-full border-t border-gray-100 pt-4 mt-auto">
                <span className="text-gray-500 text-sm">{lawyer.location || 'Location not specified'}</span>
              </div>
            </Link>
          ))}
          {filteredLawyers.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-12">No advocates found matching your search.</div>
          )}
        </div>
      )}
    </div>
  )
}