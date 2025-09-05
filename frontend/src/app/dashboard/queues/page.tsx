import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { QueuesMonitoring } from '@/components/queues/QueuesMonitoring';

export default function QueuesPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoramento de Filas</h1>
            <p className="text-muted-foreground">
              Monitore e gerencie as filas de processamento do sistema
            </p>
          </div>

          <QueuesMonitoring />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
