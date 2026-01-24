import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router"

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <section className="flex h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-md md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-gray-800 to-gray-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl font-bold text-white">📦</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Marktplace Aidee</h1>
              <p className="text-xs text-gray-600">Sistema de Inventario</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`
          fixed md:relative
          w-72 h-full md:h-screen
          bg-white border-r border-gray-200 shadow-lg 
          flex flex-col
          z-50
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          top-0 left-0
        `}
      >
        {/* Logo & Company Name */}
        <div className="bg-linear-to-r from-gray-800 to-gray-700 p-6 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-gray-800">📦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Marktplace Aidee</h1>
              <p className="text-xs text-gray-300">Sistema de Inventario</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            <Link
              to="/products"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/products')
                  ? 'bg-linear-to-r from-gray-800 to-gray-700 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">📋</span>
              <span className="font-semibold">Productos</span>
            </Link>

            <Link
              to="/products/new"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/products/new')
                  ? 'bg-linear-to-r from-gray-800 to-gray-700 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">➕</span>
              <span className="font-semibold">Nuevo Producto</span>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            © 2026 Mi Empresa
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <Outlet />
      </main>
    </section>
  )
}