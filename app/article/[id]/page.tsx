'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function EnglishNewsFeed() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
      if (!error && data) setArticles(data)
      setLoading(false)
    }
    fetchNews()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Legal News & Updates</h1>
        <p className="text-lg text-gray-500">Stay informed with the latest legal developments across Pakistan.</p>
      </div>

      {loading ? (
        <div className="text-emerald-800 font-medium animate-pulse">Loading latest news...</div>
      ) : (
        <div className="space-y-8">
          {articles.length === 0 ? (
            <p className="text-gray-500">No articles published yet.</p>
          ) : (
            articles.map((article) => (
              <article key={article.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-800 transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {article.content}
                </p>
                <Link href={`/article/${article.id}`} className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold hover:bg-emerald-100 transition">
                  Read Full Article
                </Link>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  )
}