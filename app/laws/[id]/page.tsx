'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

function EnglishLawContent() {
  const params = useParams()
  const [law, setLaw] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLaw() {
      if (!params?.id) return

      try {
        const { data, error } = await supabase
          .from('laws')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setLaw(data)
      } catch (error) {
        console.error('Error fetching law:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLaw()
  }, [params?.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-emerald-800">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  if (!law) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Law not found</h2>
        <Link href="/laws" className="text-emerald-600 hover:text-emerald-800 underline">
          Return to Legal Directory
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
          {law.category || 'General'}
        </span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{law.title || 'Untitled Law'}</h1>
      <div className="prose max-w-none text-gray-700 whitespace-pre-wrap mt-8 text-lg leading-relaxed border-t border-gray-100 pt-8">
        {law.content || law.description || 'No detailed content available for this statute.'}
      </div>
    </article>
  )
}

export default function FullLawPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-white">
      <Link href="/laws" className="text-emerald-600 hover:text-emerald-800 mb-8 inline-block text-sm font-medium">
        &larr; Back to Directory
      </Link>
      <Suspense fallback={
        <div className="flex justify-center items-center h-64 text-emerald-800 font-medium animate-pulse">
          Loading legal text...
        </div>
      }>
        <EnglishLawContent />
      </Suspense>
    </div>
  )
}