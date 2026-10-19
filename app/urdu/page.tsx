'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function UrduPortal() {
  const [articles, setArticles] = useState<any[]>([])
  const [laws, setLaws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [newsRes, lawsRes] = await Promise.all([
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('laws').select('*').order('created_at', { ascending: false })
      ])
      if (newsRes.data) setArticles(newsRes.data)
      if (lawsRes.data) setLaws(lawsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen" dir="rtl">
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight text-emerald-800">
          پاکستان لیگل پلیٹ فارم
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          پاکستان کا پہلا ڈیجیٹل قانونی مرکز جہاں آپ قوانین پڑھ سکتے ہیں، تازہ ترین قانونی خبروں سے باخبر رہ سکتے ہیں، اور ماہر وکلاء سے رابطہ کر سکتے ہیں۔
        </p>
        <Link href="/lawyers" className="inline-block bg-emerald-800 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-900 transition-colors shadow-sm text-lg">
          وکلاء کی ڈائریکٹری دیکھیں (Find an Advocate)
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-emerald-800 text-xl animate-pulse">ڈیٹا لوڈ ہو رہا ہے...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b-4 border-emerald-800 inline-block pb-2">تازہ ترین خبریں</h2>
            <div className="space-y-6">
              {articles.map(article => (
                <Link href={`/urdu/article/${article.id}`} key={article.id} className="block bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{article.title_urdu || 'عنوان دستیاب نہیں'}</h3>
                  <p className="text-gray-600 text-lg line-clamp-2">{article.content_urdu}</p>
                  <span className="text-emerald-700 font-bold mt-4 inline-block text-sm">مزید پڑھیں &larr;</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b-4 border-emerald-800 inline-block pb-2">قوانین کی لائبریری</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {laws.map(law => (
                  <li key={law.id} className="hover:bg-gray-50 transition">
                    <Link href={`/urdu/laws/${law.id}`} className="block p-6">
                      <span className="bg-emerald-50 text-emerald-800 text-sm font-bold px-3 py-1 rounded mb-3 inline-block">
                        {law.category || 'عام قانون'}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900">{law.title_urdu || 'عنوان دستیاب نہیں'}</h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}