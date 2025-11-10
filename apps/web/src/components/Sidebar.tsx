import { Link } from 'react-router-dom'

type Role = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'VIEWER'

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
  onLogout: () => void
  role?: Role
}

export function Sidebar({ isOpen, onToggle, onLogout, role }: SidebarProps) {
  return (
    <aside
      className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <img
            src="https://www.equentis.com/assets/Home_Page/equentis_logo.svg"
            alt="Logo"
            className="w-auto h-10"
          />
        )}
        <button onClick={onToggle} className="ml-auto text-white focus:outline-none">
          {isOpen ? '⬅️' : '➡️'}
        </button>
      </div>

      <nav className="flex flex-col mt-5 space-y-2">
        <Link to="/dashboard/jobs" className="px-4 py-2 hover:bg-gray-700 rounded">
          {isOpen ? 'Jobs' : '📄'}
        </Link>

        {role === 'ADMIN' && (
          <>
            <Link to="/dashboard/departments" className="px-4 py-2 hover:bg-gray-700 rounded">
              {isOpen ? 'Departments' : '🏢'}
            </Link>
            <Link to="/dashboard/users/new" className="px-4 py-2 hover:bg-gray-700 rounded">
              {isOpen ? 'Invite User' : '👤'}
            </Link>
          </>
        )}

        <button onClick={onLogout} className="mt-auto px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
          {isOpen ? 'Sign Out' : '🚪'}
        </button>
      </nav>
    </aside>
  )
}
