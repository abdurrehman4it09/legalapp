'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminLawyers() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newLawyer, setNewLawyer] = useState({ name: '', specialty: '', location: '', contact_info: '', bio: '', image_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchLawyers() }, [])

  async function fetchLawyers() {
    setLoading(true)
    const { data, error } = await supabase.from('lawyers').select('*').order('created_at', { ascending: false })
    if (!error && data) setLawyers(data)
    setLoading(false)
  }

  async function handleSaveLawyer(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('lawyers').update(newLawyer).eq('id', editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('lawyers').insert([newLawyer])
      error = insertError
    }
    setSaving(false)
    if (!error) { resetForm(); fetchLawyers() } else { alert('Failed to save lawyer.') }
  }

  function handleEdit(lawyer: any) {
    setEditingId(lawyer.id)
    setNewLawyer({
      name: lawyer.name || '', specialty: lawyer.specialty || '',
      location: lawyer.location || '', contact_info: lawyer.contact_info || '',
      bio: lawyer.bio || '', image_url: lawyer.image_url || ''
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() { setShowForm(false); setEditingId(null); setNewLawyer({ name: '', specialty: '', location: '', contact_info: '', bio: '', image_url: '' }) }

  async function handleDelete(id: number) {
    if (!confirm('Delete this profile?')) return
    await supabase.from('lawyers').delete().eq('id', id); fetchLawyers()
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans border-t-4 border-emerald-800">
      {/* Persistent Sidebar */}
      <div className="w-64 border-r border-gray-100 p-8 h-full fixed bg-white">
        <h2 className="text-xl font-bold mb-12 tracking-tight">Admin<span className="text-emerald-800">.</span></h2>
        <ul className="space-y-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin">Post News</Link></li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/laws">Manage Laws</Link></li>
          <li className="text-emerald-800 border-b-2 border-emerald-800 inline-block pb-1">Manage Lawyers</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 ml-64 max-w-5xl">
        <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Manage Lawyer Directory</h1>
          <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="bg-emerald-800 text-white px-6 py-2 rounded font-bold tracking-wider hover:bg-emerald-900 transition">
            {showForm ? 'Cancel' : '+ Add Lawyer'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSaveLawyer} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 shadow-inner">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Edit Lawyer Profile' : 'Add a New Lawyer'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input required placeholder="Full Name" className="p-3 border rounded-md" value={newLawyer.name} onChange={e => setNewLawyer({...newLawyer, name: e.target.value})} />
              <input placeholder="Specialty (e.g., Corporate Law)" className="p-3 border rounded-md" value={newLawyer.specialty} onChange={e => setNewLawyer({...newLawyer, specialty: e.target.value})} />
              <input placeholder="City / Location" className="p-3 border rounded-md" value={newLawyer.location} onChange={e => setNewLawyer({...newLawyer, location: e.target.value})} />
              <input placeholder="Contact Info (Email/Phone)" className="p-3 border rounded-md" value={newLawyer.contact_info} onChange={e => setNewLawyer({...newLawyer, contact_info: e.target.value})} />
              <input placeholder="Image URL (Optional)" className="p-3 border rounded-md md:col-span-2" value={newLawyer.image_url} onChange={e => setNewLawyer({...newLawyer, image_url: e.target.value})} />
              <textarea placeholder="Professional Biography" className="p-3 border rounded-md h-24 md:col-span-2" value={newLawyer.bio} onChange={e => setNewLawyer({...newLawyer, bio: e.target.value})} />
            </div>
            <button type="submit" disabled={saving} className="bg-emerald-800 text-white px-6 py-2 rounded-md font-medium w-full md:w-auto">
              {saving ? 'Saving...' : (editingId ? 'Update Profile' : 'Save Profile')}
            </button>
          </form>
        )}

        {loading ? <p className="text-emerald-800 font-medium animate-pulse">Loading directory profiles...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-2 border-emerald-800">
                  {lawyer.image_url ? <img src={lawyer.image_url} alt={lawyer.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-2xl">{lawyer.name ? lawyer.name.charAt(0) : '?'}</div>}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{lawyer.name || 'Unknown Name'}</h3>
                <p className="text-sm text-gray-500 mb-4">{lawyer.specialty || 'General Practice'}</p>
                <div className="mt-auto flex space-x-3 w-full">
                  <button onClick={() => handleEdit(lawyer)} className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-md hover:bg-gray-100 text-sm font-bold transition-colors">Edit</button>
                  <button onClick={() => handleDelete(lawyer.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 text-sm font-bold transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}