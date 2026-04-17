/**
 * @file client/src/components/Admin/AdminLayout.jsx
 * @description Layout wrapper for all admin pages.
 * Includes sidebar, top navbar, and main content area.
 * Theme: Indigo Blue (#7C8BF2) + Lavender (#DFE1F2)
 */

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

/** Map pathnames to page titles */
const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/add': 'Add Product',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
  '/admin/analytics': 'Analytics',
};

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine title from path
  let title = PAGE_TITLES[location.pathname] || 'Admin';
  if (location.pathname.includes('/admin/products/edit')) title = 'Edit Product';

  return (
    <div className="min-h-screen bg-[#F5F6FC] flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Navbar */}
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(true)}
          title={title}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#000000',
            border: '1px solid #C9CDED',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#FFFFFF' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
          },
        }}
      />
    </div>
  );
}

export default AdminLayout;
