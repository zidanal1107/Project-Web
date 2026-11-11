import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Calendar,
  Users,
  History,
  Building,
  ArrowLeft,
  LogOut,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminMenu = [
    { label: 'Dasbor Utama', path: '/admin', icon: LayoutDashboard },
    { label: 'Tabel Announcement', path: '/admin/pengumuman', icon: Bell },
    { label: 'Tabel Event', path: '/admin/agenda', icon: Calendar },
    { label: 'Rekrutmen & Anggota', path: '/admin/keanggotaan', icon: Users },
    { label: 'Profil Organisasi & Bidang', path: '/admin/organisasi', icon: Building },
    { label: 'Tabel AuditLog', path: '/admin/audit', icon: History },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center font-bold text-xs">
              IMM
            </div>
            <div>
              <p className="font-bold text-sm leading-none">Admin Portal</p>
              <p className="text-[11px] text-slate-400 mt-1">PC IMM Malang</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-red-700 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Public Portal & Profile */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Portal Publik</span>
          </Link>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-300">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white leading-tight truncate w-24">
                  {user?.name}
                </p>
                <p className="text-[10px] text-red-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Keluar"
              className="text-slate-400 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Backoffice Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              Sistem Manajemen Database & Histori Audit Organisasi
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Database Synced
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
