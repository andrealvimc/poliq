import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NewsList } from '@/components/news/NewsList';

export default function NewsPage() {
  return (
    <ProtectedRoute requiredRole="EDITOR">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notícias</h1>
              <p className="text-muted-foreground">
                Gerencie todas as notícias do sistema
              </p>
            </div>
          </div>

          <NewsList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
