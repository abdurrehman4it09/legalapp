'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminLaws() {
  const [laws, setLaws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newLaw, setNewLaw] = useState({ title: '', title_urdu: '', category: '', content: '', content_urdu: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchLaws() }, [])

  async function fetchLaws() {
    setLoading(true)
    const { data, error } = await supabase.from('laws').select('*').order('created_at', { ascending: false })
    if (!error && data) setLaws(data)
    setLoading(false)
  }

  async function handleSaveLaw(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('laws').update(newLaw).eq('id', editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('laws').insert([newLaw])
      error = insertError
    }
    setSaving(false)
    if (!error) { resetForm(); fetchLaws() } else { alert('Failed to save law.') }
  }

  function handleEdit(law: any) {
    setEditingId(law.id)
    setNewLaw({
      title: law.title || '', title_urdu: law.title_urdu || '',
      category: law.category || '', content: law.content || '', content_urdu: law.content_urdu || ''
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() { setShowForm(false); setEditingId(null); setNewLaw({ title: '', title_urdu: '', category: '', content: '', content_urdu: '' }) }

  async function handleDelete(id: number) {
    if (!confirm('Delete this law?')) return
    await supabase.from('laws').delete().eq('id', id); fetchLaws()
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans border-t-4 border-emerald-800">
      {/* Persistent Sidebar */}
      <div className="w-64 border-r border-gray-100 p-8 h-full fixed bg-white">
        <h2 className="text-xl font-bold mb-12 tracking-tight">Admin<span className="text-emerald-800">.</span></h2>
        <ul className="space-y-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin">Post News</Link></li>
          <li className="text-emerald-800 border-b-2 border-emerald-800 inline-block pb-1">Manage Laws</li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/lawyers">Manage Lawyers</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 ml-64 max-w-5xl">
        <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Manage Legal Library</h1>
          <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="bg-emerald-800 text-white px-6 py-2 rounded font-bold tracking-wider hover:bg-emerald-900 transition">
            {showForm ? 'Cancel' : '+ Add New Law'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSaveLaw} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 shadow-inner">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Edit Law' : 'Add a New Law'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input required placeholder="English Title" className="p-3 border rounded-md" value={newLaw.title} onChange={e => setNewLaw({...newLaw, title: e.target.value})} />
              <input placeholder="Urdu Title (اردو)" className="p-3 border rounded-md text-right" dir="rtl" value={newLaw.title_urdu} onChange={e => setNewLaw({...newLaw, title_urdu: e.target.value})} />
              <input placeholder="Category (e.g., Constitution)" className="p-3 border rounded-md md:col-span-2" value={newLaw.category} onChange={e => setNewLaw({...newLaw, category: e.target.value})} />
              <textarea placeholder="English Content" className="p-3 border rounded-md h-32" value={newLaw.content} onChange={e => setNewLaw({...newLaw, content: e.target.value})} />
              <textarea placeholder="Urdu Content (اردو)" className="p-3 border rounded-md h-32 text-right" dir="rtl" value={newLaw.content_urdu} onChange={e => setNewLaw({...newLaw, content_urdu: e.target.value})} />
            </div>
            <button type="submit" disabled={saving} className="bg-emerald-800 text-white px-6 py-2 rounded-md font-medium w-full md:w-auto">
              {saving ? 'Saving...' : (editingId ? 'Update Law' : 'Save Law to Database')}
            </button>
          </form>
        )}

        {loading ? <p className="text-emerald-800 font-medium animate-pulse">Loading legal records...</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Title (Urdu)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {laws.map((law) => (
                  <tr key={law.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{law.title || 'Untitled'}</div>
                      <div className="text-sm text-gray-500" dir="rtl">{law.title_urdu || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">{law.category || 'General'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => handleEdit(law)} className="text-emerald-600 hover:text-emerald-900 font-bold">Edit</button>
                      <button onClick={() => handleDelete(law.id)} className="text-red-600 hover:text-red-900 font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}