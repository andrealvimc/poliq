import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicationsManagement } from '@/components/publications/PublicationsManagement';

export default function PublicationsPage() {
  return (
    <ProtectedRoute requiredRole="EDITOR">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Publicações</h1>
            <p className="text-muted-foreground">
              Gerencie publicações em redes sociais
            </p>
          </div>

          <PublicationsManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
