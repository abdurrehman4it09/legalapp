'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

function UrduArticleContent() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticle() {
      if (!params?.id) return

      try {
        const { data, error } = await supabase
          .from('news') 
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
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

  if (!article) {
    return (
      <div className="text-center py-12" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">مضمون نہیں ملا (Article not found)</h2>
        <Link href="/urdu" className="text-emerald-600 hover:text-emerald-800 underline">
          واپس جائیں (Return to Platform)
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm" dir="rtl">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-normal">
        {article.title_urdu || article.title || 'Untitled Article'}
      </h1>
      {article.created_at && (
        <p className="text-sm text-gray-500 mb-8 border-b pb-4">
          شائع شدہ: {new Date(article.created_at).toLocaleDateString()}
        </p>
      )}
      <div className="prose max-w-none text-gray-700 whitespace-pre-wrap mt-8 text-lg leading-relaxed">
        {article.content_urdu || article.description || 'تفصیلات دستیاب نہیں (No content available)'}
      </div>
    </article>
  )
}

export default function FullUrduArticle() {
  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-white">
      <Link href="/urdu" className="text-emerald-600 hover:text-emerald-800 mb-8 inline-block text-sm font-medium">
        &larr; Back to Platform
      </Link>
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-64 text-emerald-800 font-medium animate-pulse" dir="rtl">
          ڈیٹا لوڈ ہو رہا ہے...
        </div>
      }>
        <UrduArticleContent />
      </Suspense>
    </div>
  )
}