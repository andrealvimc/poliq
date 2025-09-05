import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NewsForm } from '@/components/news/NewsForm';

interface EditNewsPageProps {
  params: {
    id: string;
  };
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  return (
    <ProtectedRoute requiredRole="EDITOR">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Notícia</h1>
            <p className="text-muted-foreground">
              Edite os detalhes da notícia
            </p>
          </div>

          <NewsForm newsId={params.id} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
