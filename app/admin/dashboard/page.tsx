'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({ news: 0, laws: 0, lawyers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch exact counts from your Supabase tables
        const [lawsData, lawyersData, newsData] = await Promise.all([
          supabase.from('laws').select('*', { count: 'exact', head: true }),
          supabase.from('lawyers').select('*', { count: 'exact', head: true }),
          supabase.from('articles').select('*', { count: 'exact', head: true }) 
        ])

        setStats({
          laws: lawsData.count || 0,
          lawyers: lawyersData.count || 0,
          news: newsData.count || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Platform Overview</h1>
      
      {loading ? (
        <div className="flex items-center space-x-2 text-emerald-800">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Loading statistics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Laws Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-800 transition-all">
            <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider text-sm">Total Laws</h2>
            <p className="text-5xl font-bold text-emerald-800 mt-2">{stats.laws}</p>
            <Link href="/admin/laws" className="mt-6 inline-block text-sm text-emerald-600 hover:text-emerald-900 font-medium">
              Manage Legal Library &rarr;
            </Link>
          </div>

          {/* Lawyers Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-800 transition-all">
            <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider text-sm">Directory Profiles</h2>
            <p className="text-5xl font-bold text-emerald-800 mt-2">{stats.lawyers}</p>
            <Link href="/admin/lawyers" className="mt-6 inline-block text-sm text-emerald-600 hover:text-emerald-900 font-medium">
              Manage Lawyers &rarr;
            </Link>
          </div>

          {/* News Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-800 transition-all">
            <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wider text-sm">News Updates</h2>
            <p className="text-5xl font-bold text-emerald-800 mt-2">{stats.news}</p>
            <Link href="/admin" className="mt-6 inline-block text-sm text-emerald-600 hover:text-emerald-900 font-medium">
              Manage Feed &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}