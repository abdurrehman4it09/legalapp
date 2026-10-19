'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminLaws() {
  const [laws, setLaws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLaws() {
      try {
        const { data, error } = await supabase
          .from('laws')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setLaws(data || [])
      } catch (error) {
        console.error('Error fetching laws:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaws()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Legal Library</h1>
        <button className="bg-emerald-800 text-white px-4 py-2 rounded-md hover:bg-emerald-900 transition-colors">
          + Add New Law
        </button>
      </div>

      {loading ? (
        <p className="text-emerald-800 font-medium animate-pulse">Loading legal records...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Title (Urdu)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {laws.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No laws found in the database.</td>
                </tr>
              ) : (
                laws.map((law) => (
                  <tr key={law.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{law.title || 'Untitled'}</div>
                      <div className="text-sm text-gray-500">{law.title_urdu || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        {law.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-emerald-600 hover:text-emerald-900 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}