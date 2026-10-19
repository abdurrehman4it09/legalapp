'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminLaws() {
  const [laws, setLaws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // New Law Form State
  const [newLaw, setNewLaw] = useState({ title: '', title_urdu: '', category: '', content: '', content_urdu: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLaws()
  }, [])

  async function fetchLaws() {
    setLoading(true)
    const { data, error } = await supabase.from('laws').select('*').order('created_at', { ascending: false })
    if (!error && data) setLaws(data)
    setLoading(false)
  }

  async function handleAddLaw(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('laws').insert([newLaw])
    setSaving(false)
    
    if (!error) {
      setShowForm(false)
      setNewLaw({ title: '', title_urdu: '', category: '', content: '', content_urdu: '' })
      fetchLaws() // Refresh list
    } else {
      alert('Failed to save law. Check database permissions.')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this law?')) return
    await supabase.from('laws').delete().eq('id', id)
    fetchLaws()
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Legal Library</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-800 text-white px-4 py-2 rounded-md hover:bg-emerald-900 transition-colors font-medium"
        >
          {showForm ? 'Cancel' : '+ Add New Law'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddLaw} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add a New Law</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="English Title" className="p-3 border rounded-md" value={newLaw.title} onChange={e => setNewLaw({...newLaw, title: e.target.value})} />
            <input placeholder="Urdu Title (اردو)" className="p-3 border rounded-md text-right" dir="rtl" value={newLaw.title_urdu} onChange={e => setNewLaw({...newLaw, title_urdu: e.target.value})} />
            <input placeholder="Category (e.g., Constitution)" className="p-3 border rounded-md md:col-span-2" value={newLaw.category} onChange={e => setNewLaw({...newLaw, category: e.target.value})} />
            <textarea placeholder="English Content" className="p-3 border rounded-md h-32" value={newLaw.content} onChange={e => setNewLaw({...newLaw, content: e.target.value})} />
            <textarea placeholder="Urdu Content (اردو)" className="p-3 border rounded-md h-32 text-right" dir="rtl" value={newLaw.content_urdu} onChange={e => setNewLaw({...newLaw, content_urdu: e.target.value})} />
          </div>
          <button type="submit" disabled={saving} className="bg-emerald-800 text-white px-6 py-2 rounded-md font-medium w-full md:w-auto">
            {saving ? 'Saving...' : 'Save Law to Database'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-emerald-800 font-medium animate-pulse">Loading legal records...</p>
      ) : (
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
              {laws.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No laws found.</td></tr>
              ) : (
                laws.map((law) => (
                  <tr key={law.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{law.title || 'Untitled'}</div>
                      <div className="text-sm text-gray-500">{law.title_urdu || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        {law.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(law.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}