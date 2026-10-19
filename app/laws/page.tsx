'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function PublicLawsLibrary() {
  const [laws, setLaws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchLaws() {
      const { data, error } = await supabase.from('laws').select('*').order('created_at', { ascending: false })
      if (!error && data) setLaws(data)
      setLoading(false)
    }
    fetchLaws()
  }, [])

  const filteredLaws = laws.filter(l => 
    (l.title?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (l.category?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Digital Law Library</h1>
        <p className="text-lg text-gray-500">Browse current statutes, constitutional articles, and legal acts.</p>
      </div>

      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search laws by title or category..." 
          className="w-full md:w-96 p-4 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-emerald-800 font-medium animate-pulse mt-12">Loading legal database...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filteredLaws.length === 0 ? (
              <li className="p-8 text-center text-gray-500">No laws found matching your search.</li>
            ) : (
              filteredLaws.map((law) => (
                <li key={law.id} className="hover:bg-gray-50 transition-colors">
                  <Link href={`/laws/${law.id}`} className="block p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                            {law.category || 'General'}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{law.title || 'Untitled Law'}</h2>
                        {law.title_urdu && <h3 className="text-lg text-gray-600 mt-1" dir="rtl">{law.title_urdu}</h3>}
                      </div>
                      <span className="text-emerald-600 font-medium text-sm hidden md:block">Read Full Text &rarr;</span>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}