'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function ManageLaws() {
  const [category, setCategory] = useState('Constitution')
  const [title, setTitle] = useState(''); const [content, setContent] = useState('')
  const [titleUrdu, setTitleUrdu] = useState(''); const [contentUrdu, setContentUrdu] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [lawsList, setLawsList] = useState<any[]>([])

  useEffect(() => { fetchLaws() }, [])

  async function fetchLaws() {
    const { data } = await supabase.from('laws').select('*').order('id', { ascending: false })
    if (data) setLawsList(data)
  }

  async function publishLaw() {
    setStatusMsg('Saving...')
    const { error } = await supabase.from('laws').insert([{ category, title, content, title_urdu: titleUrdu, content_urdu: contentUrdu }])
    if (error) setStatusMsg('Failed to save.')
    else {
      setStatusMsg('Successfully Saved!')
      setTitle(''); setContent(''); setTitleUrdu(''); setContentUrdu(''); fetchLaws()
    }
  }

  async function deleteLaw(id: number) {
    await supabase.from('laws').delete().eq('id', id); fetchLaws()
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans border-t-4 border-emerald-800">
      <div className="w-64 border-r border-gray-100 p-8 h-full fixed bg-white">
        <h2 className="text-xl font-bold mb-12 tracking-tight">Admin<span className="text-emerald-800">.</span></h2>
        <ul className="space-y-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin">Post News</Link></li>
          <li className="text-emerald-800 border-b-2 border-emerald-800 inline-block pb-1">Manage Laws</li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/lawyers">Manage Lawyers</Link></li>
        </ul>
      </div>

      <div className="flex-1 p-12 ml-64 max-w-5xl">
        <header className="mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Manage Laws</h1>
        </header>

        <div className="mb-16">
          <select className="w-full mb-8 p-4 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:border-emerald-800" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Constitution">Constitution of Pakistan</option>
            <option value="Pakistan Penal Code">Pakistan Penal Code (PPC)</option>
            <option value="Act">General Act / Ordinance</option>
            <option value="Judgment">Court Judgment</option>
          </select>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-800 mb-6">— English (LTR)</h4>
              <input type="text" placeholder="Title..." className="w-full mb-6 p-4 bg-gray-50 border border-gray-100 rounded outline-none focus:border-emerald-800" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="Text..." className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded h-48 outline-none focus:border-emerald-800" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div dir="rtl">
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-800 mb-6">— اردو (RTL)</h4>
              <input type="text" placeholder="عنوان..." className="w-full mb-6 p-4 bg-gray-50 border border-gray-100 rounded outline-none focus:border-emerald-800" value={titleUrdu} onChange={(e) => setTitleUrdu(e.target.value)} />
              <textarea placeholder="تفصیل..." className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded h-48 outline-none focus:border-emerald-800" value={contentUrdu} onChange={(e) => setContentUrdu(e.target.value)} />
            </div>
          </div>
          <button onClick={publishLaw} className="bg-emerald-800 text-white px-8 py-3 rounded font-bold tracking-wider hover:bg-emerald-900 transition">Save Law</button>
          {statusMsg && <p className="mt-4 font-bold text-emerald-800">{statusMsg}</p>}
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Saved Library</h3>
          <div className="space-y-4">
            {lawsList.map((law) => (
              <div key={law.id} className="border-b border-gray-100 pb-4 flex justify-between items-center group">
                <div>
                  <span className="text-xs text-emerald-800 uppercase font-bold">— {law.category}</span>
                  <h4 className="font-bold text-gray-900">{law.title} | {law.title_urdu}</h4>
                </div>
                <button onClick={() => deleteLaw(law.id)} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:text-red-700 opacity-0 group-hover:opacity-100">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}