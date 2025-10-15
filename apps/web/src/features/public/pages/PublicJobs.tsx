import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { Link } from 'react-router-dom'

export default function PublicJobs(){
  const { data = [], isLoading } = useQuery({
    queryKey: ['publicJobs'],
    queryFn: async () => (await api.get('/public/jobs')).data
  })
  if (isLoading) return <p>Loading…</p>
  return (
    <div style={{maxWidth:800, margin:'0 auto'}}>
      <h1>Open Roles</h1>
      {data.map((j: any) => (
        <div key={j.id} style={{border:'1px solid #ddd', padding:12, borderRadius:12, margin:'8px 0'}}>
          <div style={{fontWeight:600}}>{j.title}</div>
          <div style={{opacity:.7}}>{j.department?.name} · {j.location} · {j.employmentType}</div>
          <Link to={`/jobs/${j.slug}`}>View</Link>
        </div>
      ))}
    </div>
  )
}