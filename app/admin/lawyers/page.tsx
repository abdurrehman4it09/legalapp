'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AdminLawyers() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // New Lawyer Form State
  const [newLawyer, setNewLawyer] = useState({ name: '', specialty: '', location: '', contact_info: '', bio: '', image_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLawyers()
  }, [])

  async function fetchLawyers() {
    setLoading(true)
    const { data, error } = await supabase.from('lawyers').select('*').order('created_at', { ascending: false })
    if (!error && data) setLawyers(data)
    setLoading(false)
  }

  async function handleAddLawyer(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('lawyers').insert([newLawyer])
    setSaving(false)
    
    if (!error) {
      setShowForm(false)
      setNewLawyer({ name: '', specialty: '', location: '', contact_info: '', bio: '', image_url: '' })
      fetchLawyers()
    } else {
      alert('Failed to save lawyer.')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this profile?')) return
    await supabase.from('lawyers').delete().eq('id', id)
    fetchLawyers()
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Lawyer Directory</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-800 text-white px-4 py-2 rounded-md hover:bg-emerald-900 transition-colors font-medium"
        >
          {showForm ? 'Cancel' : '+ Add Lawyer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddLawyer} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add a New Lawyer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Full Name" className="p-3 border rounded-md" value={newLawyer.name} onChange={e => setNewLawyer({...newLawyer, name: e.target.value})} />
            <input placeholder="Specialty (e.g., Corporate Law)" className="p-3 border rounded-md" value={newLawyer.specialty} onChange={e => setNewLawyer({...newLawyer, specialty: e.target.value})} />
            <input placeholder="City / Location" className="p-3 border rounded-md" value={newLawyer.location} onChange={e => setNewLawyer({...newLawyer, location: e.target.value})} />
            <input placeholder="Contact Info (Email/Phone)" className="p-3 border rounded-md" value={newLawyer.contact_info} onChange={e => setNewLawyer({...newLawyer, contact_info: e.target.value})} />
            <input placeholder="Image URL (Optional)" className="p-3 border rounded-md md:col-span-2" value={newLawyer.image_url} onChange={e => setNewLawyer({...newLawyer, image_url: e.target.value})} />
            <textarea placeholder="Professional Biography" className="p-3 border rounded-md h-24 md:col-span-2" value={newLawyer.bio} onChange={e => setNewLawyer({...newLawyer, bio: e.target.value})} />
          </div>
          <button type="submit" disabled={saving} className="bg-emerald-800 text-white px-6 py-2 rounded-md font-medium w-full md:w-auto">
            {saving ? 'Saving Profile...' : 'Save Profile to Database'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-emerald-800 font-medium animate-pulse">Loading directory profiles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.length === 0 ? (
            <p className="text-gray-500 col-span-3">No lawyers found.</p>
          ) : (
            lawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-2 border-emerald-800">
                  {lawyer.image_url ? (
                    <img src={lawyer.image_url} alt={lawyer.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-2xl">
                      {lawyer.name ? lawyer.name.charAt(0) : '?'}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{lawyer.name || 'Unknown Name'}</h3>
                <p className="text-sm text-gray-500 mb-4">{lawyer.specialty || 'General Practice'}</p>
                <div className="mt-auto flex space-x-3 w-full">
                  <button onClick={() => handleDelete(lawyer.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 text-sm font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}