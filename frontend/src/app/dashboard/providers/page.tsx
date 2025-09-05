import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProvidersManagement } from '@/components/providers/ProvidersManagement';

export default function ProvidersPage() {
  return (
    <ProtectedRoute requiredRole="EDITOR">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Provedores Externos</h1>
            <p className="text-muted-foreground">
              Gerencie fontes de notícias externas e busque conteúdo automaticamente
            </p>
          </div>

          <ProvidersManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
