'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function FullLawPage() {
  const params = useParams()
  const [law, setLaw] = useState<any>(null)

  useEffect(() => {
    async function getLaw() {
      const { data } = await supabase.from('laws').select('*').eq('id', params.id).single()
      if (data) setLaw(data)
    }
    if (params?.id) getLaw()
  }, [params])

  if (!law) return <div className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest">Loading Document...</div>

  return (
    <div dir="ltr" className="min-h-screen bg-white text-gray-900 border-t-4 border-emerald-800">
      <header className="bg-white py-6 border-b border-gray-100 mb-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/laws" className="text-emerald-800 font-bold text-sm tracking-widest uppercase hover:text-emerald-900 transition flex items-center gap-2">
            <span className="text-lg">←</span> Back to Law Library
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase mb-3 block">
          — {law.category}
        </span>
        <h1 className="text-4xl font-bold tracking-tight mb-8 leading-tight text-gray-900 border-b border-gray-100 pb-6">
          {law.title}
        </h1>
        <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap font-serif">
          {law.content}
        </div>
      </main>
    </div>
  )
}