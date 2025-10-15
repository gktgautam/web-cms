import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { Link } from 'react-router-dom'

export default function JobsList(){
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => (await api.get('/jobs')).data
  })
  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Failed to load</p>
  return (
    <div>
      <h1>Jobs</h1>
      <div style={{display:'grid', gap:12}}>
        {data.items.map((j: any) => (
          <div key={j.id} style={{border:'1px solid #ddd', padding:12, borderRadius:12}}>
            <div style={{fontWeight:600}}>{j.title}</div>
            <div style={{opacity:.7}}>{j.department.name} · {j.location} · {j.status}</div>
            <Link to={`/jobs/${j.slug}`}>Public page</Link>
          </div>
        ))}
      </div>
    </div>
  )
}