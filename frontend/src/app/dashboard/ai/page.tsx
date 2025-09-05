import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AIWorkspace } from '@/components/ai/AIWorkspace';

export default function AIPage() {
  return (
    <ProtectedRoute requiredRole="EDITOR">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">IA & Processamento</h1>
            <p className="text-muted-foreground">
              Ferramentas de inteligência artificial para processamento de conteúdo
            </p>
          </div>

          <AIWorkspace />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
