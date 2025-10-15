import { Route, Routes, Link } from 'react-router-dom'
import PublicJobs from './features/public/pages/PublicJobs'
import JobPublic from './features/public/pages/JobPublic'
import JobsList from './features/jobs/pages/JobsList'
import JobNew from './features/jobs/pages/JobNew'

export default function App(){
  return (
    <div style={{fontFamily:'system-ui', padding:16}}>
      <header style={{display:'flex', gap:12, marginBottom:16}}>
        <Link to="/">Public</Link>
        <Link to="/dashboard/jobs">Dashboard</Link>
        <Link to="/dashboard/jobs/new">New Job</Link>
      </header>
      <Routes>
        <Route path="/" element={<PublicJobs/>}/>
        <Route path="/jobs/:slug" element={<JobPublic/>}/>
        <Route path="/dashboard/jobs" element={<JobsList/>}/>
        <Route path="/dashboard/jobs/new" element={<JobNew/>}/>
      </Routes>
    </div>
  )
}