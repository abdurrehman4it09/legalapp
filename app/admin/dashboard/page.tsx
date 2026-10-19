'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({ news: 0, laws: 0, lawyers: 0 })

  useEffect(() => {
    async function fetchStats() {
      // These magically count the rows in your database without downloading all the data!
      const { count: newsCount } = await supabase.from('articles').select('*', { count: 'exact', head: true })
      const { count: lawsCount } = await supabase.from('laws').select('*', { count: 'exact', head: true })
      const { count: lawyersCount } = await supabase.from('lawyers').select('*', { count: 'exact', head: true })
      
      setStats({
        news: newsCount || 0,
        laws: lawsCount || 0,
        lawyers: lawyersCount || 0
      })
    }
    fetchStats()
  }, [])

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans border-t-4 border-emerald-800">
      
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-gray-100 p-8 h-full fixed bg-white">
        <h2 className="text-xl font-bold mb-12 tracking-tight">Admin<span className="text-emerald-800">.</span></h2>
        <ul className="space-y-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <li className="text-emerald-800 border-b-2 border-emerald-800 inline-block pb-1">Dashboard</li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin">Post News</Link></li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/laws">Manage Laws</Link></li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/lawyers">Manage Lawyers</Link></li>
        </ul>
      </div>

      {/* Main Analytics Area */}
      <div className="flex-1 p-12 ml-64 max-w-5xl">
        <header className="mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Platform Command Center</h1>
          <p className="text-gray-500 mt-2 text-lg">Real-time database statistics and overview.</p>
        </header>

        {/* Big Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-xl shadow-sm">
            <h3 className="text-emerald-800 font-bold uppercase tracking-widest text-xs mb-2">Total News Articles</h3>
            <p className="text-6xl font-bold text-emerald-950">{stats.news}</p>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-xl shadow-sm">
            <h3 className="text-emerald-800 font-bold uppercase tracking-widest text-xs mb-2">Digital Law Library</h3>
            <p className="text-6xl font-bold text-emerald-950">{stats.laws}</p>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-xl shadow-sm">
            <h3 className="text-emerald-800 font-bold uppercase tracking-widest text-xs mb-2">Verified Advocates</h3>
            <p className="text-6xl font-bold text-emerald-950">{stats.lawyers}</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}