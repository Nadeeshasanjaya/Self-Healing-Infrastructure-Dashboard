import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-full w-full bg-base-900">
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen ?
      <div
        className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        onClick={() => setMobileOpen(false)}
        aria-hidden="true" /> :

      null}
      <div className="lg:pl-64">
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>);

}