import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NewsForm } from '@/components/news/NewsForm';

export default function NewNewsPage() {
  return (
    <ProtectedRoute requiredRole="EDITOR">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nova Notícia</h1>
            <p className="text-muted-foreground">
              Crie uma nova notícia para o sistema
            </p>
          </div>

          <NewsForm />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
