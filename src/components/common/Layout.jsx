import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/members': 'Member Management',
  '/members/add': 'Add Member',
  '/trainers': 'Trainer Management',
  '/plans': 'Membership Plans',
  '/attendance': 'Attendance Tracking',
  '/payments': 'Payments',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || PAGE_TITLES[Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k) && k !== '/dashboard')] || 'WhatABod';

  return (
    <div className="flex h-screen overflow-hidden bg-gym-dark">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
