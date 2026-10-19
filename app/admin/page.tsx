'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/supabase'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminDashboard() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [titleUrdu, setTitleUrdu] = useState('')
  const [contentUrdu, setContentUrdu] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [articles, setArticles] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { fetchArticles() }, [])

  async function fetchArticles() {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    if (data) setArticles(data)
  }

  async function handleSaveNews() {
    setStatusMsg('Saving...')
    const payload = { title, content, title_urdu: titleUrdu, content_urdu: contentUrdu }
    
    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('articles').update(payload).eq('id', editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('articles').insert([payload])
      error = insertError
    }

    if (error) {
      setStatusMsg('Failed to save.')
    } else {
      setStatusMsg(editingId ? 'Successfully Updated!' : 'Successfully Published!')
      resetForm()
      fetchArticles()
    }
  }

  function handleEdit(art: any) {
    setEditingId(art.id)
    setTitle(art.title || '')
    setContent(art.content || '')
    setTitleUrdu(art.title_urdu || '')
    setContentUrdu(art.content_urdu || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setTitle(''); setContent(''); setTitleUrdu(''); setContentUrdu('')
  }

  async function deleteArticle(id: number) {
    if (!confirm('Are you sure you want to delete this article?')) return
    await supabase.from('articles').delete().eq('id', id); fetchArticles()
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans border-t-4 border-emerald-800">
      <div className="w-64 border-r border-gray-100 p-8 h-full fixed bg-white">
        <h2 className="text-xl font-bold mb-12 tracking-tight">Admin<span className="text-emerald-800">.</span></h2>
        <ul className="space-y-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <li className="text-emerald-800 border-b-2 border-emerald-800 inline-block pb-1">Post News</li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/laws">Manage Laws</Link></li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/lawyers">Manage Lawyers</Link></li>
        </ul>
      </div>

      <div className="flex-1 p-12 ml-64 max-w-5xl">
        <header className="mb-12 border-b border-gray-100 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{editingId ? 'Edit Legal News' : 'Publish Legal News'}</h1>
            <p className="text-gray-500 mt-2 text-lg">Write once, publish in English and Urdu simultaneously.</p>
          </div>
          {editingId && <button onClick={resetForm} className="text-sm font-bold text-gray-500 hover:text-gray-900 underline">Cancel Edit</button>}
        </header>
        
        <div className="mb-16">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-800 mb-6">— English (LTR)</h4>
              <input type="text" placeholder="Article Title..." className="w-full mb-6 p-4 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:border-emerald-800 transition" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="Write the news content here..." className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded h-48 focus:outline-none focus:border-emerald-800 transition" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div dir="rtl">
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-800 mb-6">— اردو (RTL)</h4>
              <input type="text" placeholder="مضمون کا عنوان..." className="w-full mb-6 p-4 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:border-emerald-800 transition" value={titleUrdu} onChange={(e) => setTitleUrdu(e.target.value)} />
              <textarea placeholder="خبر کی تفصیل یہاں لکھیں..." className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded h-48 focus:outline-none focus:border-emerald-800 transition" value={contentUrdu} onChange={(e) => setContentUrdu(e.target.value)} />
            </div>
          </div>
          <button onClick={handleSaveNews} className="bg-emerald-800 text-white px-8 py-3 rounded font-bold tracking-wider hover:bg-emerald-900 transition">
            {editingId ? 'Update Article' : 'Publish'}
          </button>
          {statusMsg && <span className="ml-4 font-bold text-emerald-800">{statusMsg}</span>}
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Published History</h3>
          <div className="space-y-4">
            {articles.map((art) => (
              <div key={art.id} className="border-b border-gray-100 pb-4 flex justify-between items-center group">
                <div className="flex gap-8 w-full mr-4">
                  <h4 className="font-bold text-gray-900 flex-1">{art.title}</h4>
                  <h4 className="font-bold text-gray-900 flex-1 text-right" dir="rtl">{art.title_urdu}</h4>
                </div>
                <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(art)} className="text-xs text-emerald-600 font-bold uppercase tracking-widest hover:text-emerald-800">Edit</button>
                  <button onClick={() => deleteArticle(art.id)} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:text-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}