import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

// Public pages
import { HomePage } from '@/pages/HomePage';
import { AnnouncementsPage } from '@/pages/AnnouncementsPage';
import { AnnouncementDetailPage } from '@/pages/AnnouncementDetailPage';
import { EventsPage } from '@/pages/EventsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { MemberRegisterPage } from '@/pages/MemberRegisterPage';
import { LoginPage } from '@/pages/LoginPage';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ManageAnnouncements } from '@/pages/admin/ManageAnnouncements';
import { ManageEvents } from '@/pages/admin/ManageEvents';
import { ManageMembership } from '@/pages/admin/ManageMembership';
import { ManageOrganization } from '@/pages/admin/ManageOrganization';
import { AuditLogsPage } from '@/pages/admin/AuditLogsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'pengumuman', element: <AnnouncementsPage /> },
      { path: 'pengumuman/:id', element: <AnnouncementDetailPage /> },
      { path: 'agenda', element: <EventsPage /> },
      { path: 'profil', element: <ProfilePage /> },
      { path: 'daftar', element: <MemberRegisterPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['admin', 'pimpinan']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'pengumuman', element: <ManageAnnouncements /> },
          { path: 'agenda', element: <ManageEvents /> },
          { path: 'keanggotaan', element: <ManageMembership /> },
          { path: 'organisasi', element: <ManageOrganization /> },
          { path: 'audit', element: <AuditLogsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
