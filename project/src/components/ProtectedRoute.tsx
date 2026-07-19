import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../pages/admin/AdminLayout';

export default function ProtectedRoute() {
  const { session, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 size={28} className="animate-spin text-mint-dark" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
