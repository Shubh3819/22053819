import { Link, useLocation } from 'react-router-dom'
import { ChartBarIcon, FireIcon, NewspaperIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const location = useLocation()
  
  const navLinks = [
    { path: '/', icon: ChartBarIcon, label: 'Top Users' },
    { path: '/trending', icon: FireIcon, label: 'Trending' },
    { path: '/feed', icon: NewspaperIcon, label: 'Feed' }
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-600">Social Analytics</h1>
          <div className="flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === link.path
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <link.icon className="h-5 w-5 mr-2" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar