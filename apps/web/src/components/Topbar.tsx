import { Link } from 'react-router-dom'

type TopbarProps = {
  isAuthenticated: boolean
}

export function Topbar({ isAuthenticated }: TopbarProps) {
  return (
    <header className="w-full flex items-center justify-between bg-white shadow-sm px-5 h-20">
      <div className="flex items-center gap-6">
        {!isAuthenticated && (
          <a href="https://www.equentis.com" target="_blank" rel="noopener noreferrer">
            <img
              alt="Logo"
              className="w-auto min-w-[110px] h-[40px]"
              src="https://www.equentis.com/assets/Home_Page/equentis_logo.svg"
            />
          </a>
        )}
        <Link to="/">Public</Link>
      </div>

      {!isAuthenticated && (
        <div>
          <Link to="/login" className="btn btn-primary-animated">
            Sign in
          </Link>
        </div>
      )}
    </header>
  )
}
