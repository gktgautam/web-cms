import { useState } from 'react'
import { api } from '../../../lib/api'
import { useNavigate } from 'react-router-dom'

export default function JobNew(){
  const nav = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', location:'', employmentType:'', departmentId:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|undefined>()

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError(undefined)
    try {
      const res = await api.post('/jobs', form)
      nav(`/jobs/${res.data.slug}`)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{maxWidth:600}}>
      <h1>New Job</h1>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{display:'block', width:'100%', margin:'8px 0', padding:8}} />
      <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} style={{display:'block', width:'100%', margin:'8px 0', padding:8, height:160}} />
      <input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} style={{display:'block', width:'100%', margin:'8px 0', padding:8}} />
      <input placeholder="Employment Type" value={form.employmentType} onChange={e=>setForm({...form, employmentType:e.target.value})} style={{display:'block', width:'100%', margin:'8px 0', padding:8}} />
      <input placeholder="Department ID" value={form.departmentId} onChange={e=>setForm({...form, departmentId:e.target.value})} style={{display:'block', width:'100%', margin:'8px 0', padding:8}} />
      <button disabled={loading} style={{padding:'8px 12px'}}>{loading ? 'Saving…' : 'Save draft'}</button>
    </form>
  )
}