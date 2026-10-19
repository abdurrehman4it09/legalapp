'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminLawyers() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLawyers() {
      try {
        const { data, error } = await supabase
          .from('lawyers')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setLawyers(data || [])
      } catch (error) {
        console.error('Error fetching lawyers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLawyers()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Lawyer Directory</h1>
        <button className="bg-emerald-800 text-white px-4 py-2 rounded-md hover:bg-emerald-900 transition-colors">
          + Add Lawyer
        </button>
      </div>

      {loading ? (
        <p className="text-emerald-800 font-medium animate-pulse">Loading directory profiles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.length === 0 ? (
            <p className="text-gray-500 col-span-3">No lawyers found in the database.</p>
          ) : (
            lawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-2 border-emerald-800">
                  {lawyer.image_url ? (
                    <img src={lawyer.image_url} alt={lawyer.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-2xl">
                      {lawyer.name ? lawyer.name.charAt(0) : '?'}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{lawyer.name || 'Unknown Name'}</h3>
                <p className="text-sm text-gray-500 mb-4">{lawyer.specialty || 'General Practice'}</p>
                <div className="mt-auto flex space-x-3 w-full">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 text-sm font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}