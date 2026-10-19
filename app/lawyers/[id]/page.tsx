'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/app/supabase'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

function LawyerProfileContent() {
  const params = useParams()
  const [lawyer, setLawyer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLawyer() {
      if (!params?.id) return

      try {
        const { data, error } = await supabase
          .from('lawyers')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setLawyer(data)
      } catch (error) {
        console.error('Error fetching lawyer:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLawyer()
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

  if (!lawyer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lawyer profile not found</h2>
        <Link href="/lawyers" className="text-emerald-600 hover:text-emerald-800 underline">
          Return to Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        <div className="h-48 w-48 rounded-xl bg-gray-100 overflow-hidden border-4 border-emerald-800">
          {lawyer.image_url ? (
            <img src={lawyer.image_url} alt={lawyer.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-5xl">
              {lawyer.name ? lawyer.name.charAt(0) : '?'}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{lawyer.name || 'Unknown Lawyer'}</h1>
        <p className="text-xl text-emerald-800 font-medium mb-6">{lawyer.specialty || 'General Practice'}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</h3>
            <p className="text-gray-900 font-medium">{lawyer.location || 'Not specified'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Contact</h3>
            <p className="text-gray-900 font-medium">{lawyer.contact_info || 'Not provided'}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Professional Biography</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {lawyer.bio || lawyer.description || 'No biography available at this time.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FullLawyerPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-white">
      <Link href="/lawyers" className="text-emerald-600 hover:text-emerald-800 mb-8 inline-block text-sm font-medium">
        &larr; Back to Lawyers
      </Link>
      <Suspense fallback={
        <div className="flex justify-center items-center h-64 text-emerald-800 font-medium animate-pulse">
          Loading profile...
        </div>
      }>
        <LawyerProfileContent />
      </Suspense>
    </div>
  )
}