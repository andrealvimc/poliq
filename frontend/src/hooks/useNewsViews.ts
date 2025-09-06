import { useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';

interface UseNewsViewsProps {
  newsId: string;
  initialViews: number;
  onViewsUpdate?: (views: number) => void;
}

export const useNewsViews = ({ 
  newsId, 
  initialViews, 
  onViewsUpdate 
}: UseNewsViewsProps) => {
  const hasIncremented = useRef(false);
  const isIncrementing = useRef(false);

  useEffect(() => {
    const incrementViews = async () => {
      // Evitar múltiplas chamadas simultâneas
      if (hasIncremented.current || isIncrementing.current) {
        return;
      }

      isIncrementing.current = true;

      try {
        const response = await apiClient.incrementNewsViews(newsId);
        hasIncremented.current = true;
        onViewsUpdate?.(response.views);
      } catch (error) {
        console.error('Erro ao incrementar views:', error);
        // Reset em caso de erro para permitir nova tentativa
        hasIncremented.current = false;
      } finally {
        isIncrementing.current = false;
      }
    };

    incrementViews();
  }, [newsId, onViewsUpdate]);

  return {
    hasIncremented: hasIncremented.current,
  };
};
