'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { QueueStats } from '@/types';
import { toast } from 'sonner';

export const QueuesMonitoring: React.FC = () => {
  const [queues, setQueues] = useState<QueueStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchQueueStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQueueStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueueStats = async () => {
    try {
      const data = await apiClient.getQueueStats();
      setQueues(data);
    } catch (error) {
      console.error('Error fetching queue stats:', error);
      toast.error('Erro ao carregar estatísticas das filas');
    } finally {
      setLoading(false);
    }
  };

  const pauseQueue = async (queueName: string) => {
    try {
      setActionLoading(queueName);
      await apiClient.pauseQueue(queueName);
      toast.success(`Fila ${queueName} pausada`);
      fetchQueueStats();
    } catch (error) {
      console.error('Error pausing queue:', error);
      toast.error('Erro ao pausar fila');
    } finally {
      setActionLoading(null);
    }
  };

  const resumeQueue = async (queueName: string) => {
    try {
      setActionLoading(queueName);
      await apiClient.resumeQueue(queueName);
      toast.success(`Fila ${queueName} retomada`);
      fetchQueueStats();
    } catch (error) {
      console.error('Error resuming queue:', error);
      toast.error('Erro ao retomar fila');
    } finally {
      setActionLoading(null);
    }
  };

  const getTotalJobs = (queue: QueueStats) => {
    return queue.waiting + queue.active + queue.completed + queue.failed + queue.delayed;
  };

  const getProgressPercentage = (queue: QueueStats) => {
    const total = getTotalJobs(queue);
    if (total === 0) return 0;
    return (queue.completed / total) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Filas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(queues) ? queues.length : 0}</div>
            <p className="text-xs text-muted-foreground">
              {Array.isArray(queues) ? queues.filter(q => !q.paused).length : 0} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(queues) ? queues.reduce((sum, q) => sum + q.waiting, 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Em espera para processamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(queues) ? queues.reduce((sum, q) => sum + q.active, 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Sendo processados agora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(queues) ? queues.reduce((sum, q) => sum + q.completed, 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Processados com sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Detalhes das Filas</h2>
          <Button onClick={fetchQueueStats} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {!Array.isArray(queues) || queues.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma fila encontrada</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {queues.map((queue) => (
              <Card key={queue.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{queue.name}</span>
                      <Badge variant={queue.paused ? 'destructive' : 'default'}>
                        {queue.paused ? 'Pausada' : 'Ativa'}
                      </Badge>
                    </CardTitle>
                    <div className="flex space-x-2">
                      {queue.paused ? (
                        <Button
                          onClick={() => resumeQueue(queue.name)}
                          disabled={actionLoading === queue.name}
                          size="sm"
                        >
                          {actionLoading === queue.name ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => pauseQueue(queue.name)}
                          disabled={actionLoading === queue.name}
                          variant="outline"
                          size="sm"
                        >
                          {actionLoading === queue.name ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Pause className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Aguardando</span>
                      <span className="font-medium">{queue.waiting}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ativos</span>
                      <span className="font-medium">{queue.active}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Concluídos</span>
                      <span className="font-medium text-green-600">{queue.completed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Falharam</span>
                      <span className="font-medium text-red-600">{queue.failed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Atrasados</span>
                      <span className="font-medium">{queue.delayed}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{getProgressPercentage(queue).toFixed(1)}%</span>
                    </div>
                    <Progress value={getProgressPercentage(queue)} className="h-2" />
                  </div>

                  {queue.failed > 0 && (
                    <Alert>
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        {queue.failed} jobs falharam e precisam de atenção
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
