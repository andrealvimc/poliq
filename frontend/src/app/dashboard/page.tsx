import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentNews } from '@/components/dashboard/RecentNews';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral do sistema Poliq
            </p>
          </div>

          <DashboardStats />
          
          <div className="grid gap-6 md:grid-cols-2">
            <RecentNews />
            <QuickActions />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
