import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import { useParams } from 'react-router-dom'

export default function JobPublic(){
  const { slug } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobPublic', slug],
    queryFn: async () => (await api.get(`/public/jobs/${slug}`)).data,
    enabled: !!slug
  })
  if (isLoading) return <p>Loading…</p>
  if (error) return <p>Not found</p>
  return (
    <div style={{maxWidth:800, margin:'0 auto'}}>
      <h1>{data.title}</h1>
      <div style={{opacity:.7}}>{data.location} · {data.employmentType}</div>
      <pre style={{whiteSpace:'pre-wrap'}}>{data.description}</pre>
    </div>
  )
}