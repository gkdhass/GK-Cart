/**
 * @file client/src/components/Admin/AdminNavbar.jsx
 * @description Top navigation bar for the admin dashboard.
 * Features mobile hamburger toggle, search, admin name, and quick actions.
 * Theme: Cream/Peach (#FBE8CE) + Orange (#F96D00)
 */

import { HiOutlineBars3, HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

function AdminNavbar({ onToggleSidebar, title = 'Dashboard' }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#E4DFB5] border-b border-[#E8C99A]">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-[#E8C99A] rounded-lg transition-colors"
          >
            <HiOutlineBars3 className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-gray-900 font-semibold text-lg">{title}</h2>
            <p className="text-gray-600 text-xs hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: Search + Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center bg-white/60 rounded-xl px-3 py-2 border border-[#E8C99A] focus-within:border-[#F96D00] transition-colors">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none w-40 lg:w-56"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-[#E8C99A] rounded-xl transition-colors">
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#E4DFB5] text-[8px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* Admin profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#E8C99A]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F96D00] to-[#E86500] flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-gray-900 text-sm font-medium leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-gray-600 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
