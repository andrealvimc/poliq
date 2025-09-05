import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MediaWorkspace } from '@/components/media/MediaWorkspace';

export default function MediaPage() {
  return (
    <ProtectedRoute requiredRole="EDITOR">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Mídia</h1>
            <p className="text-muted-foreground">
              Gere e gerencie imagens para suas notícias
            </p>
          </div>

          <MediaWorkspace />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
