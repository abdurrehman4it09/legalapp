'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function FullUrduArticle() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    async function getArticle() {
      const { data } = await supabase.from('articles').select('*').eq('id', params.id).single()
      if (data) setArticle(data)
    }
    if (params?.id) getArticle()
  }, [params])

  if (!article) return <div className="p-10 text-center text-gray-500 font-bold" dir="rtl">لوڈ ہو رہا ہے...</div>

  return (
    <div dir="rtl" className="min-h-screen bg-white text-gray-900 border-t-4 border-emerald-800">
      
      {/* Minimalist Top Bar */}
      <header className="bg-white py-6 border-b border-gray-100 mb-12">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/urdu" className="text-emerald-800 font-bold text-sm hover:text-emerald-900 transition flex items-center gap-2 w-max">
            <span className="text-lg">→</span> روزنامہ بریف پر واپس جائیں
          </Link>
        </div>
      </header>

      {/* Full Article Content */}
      <main className="max-w-3xl mx-auto px-6 pb-20">
        <h1 className="text-5xl font-bold tracking-tight mb-8 leading-tight text-gray-900">
          {article.title_urdu}
        </h1>
        
        <div className="text-xl leading-relaxed text-gray-700 whitespace-pre-wrap">
          {article.content_urdu}
        </div>
      </main>
    </div>
  )
}