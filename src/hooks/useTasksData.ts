import { useState, useEffect, useCallback } from 'react';
import { seoDataService } from '@/services/seoData';
import { TaskIdListItem } from '@/types/dataforseo';
import { useAuth } from '@/contexts/AuthContext';

export function useTasksData() {
  const [idList, setIdList] = useState<TaskIdListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) {
      setIdList([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const dbTasks = await seoDataService.getUserTasks(user.id);
      
      // Convert database tasks to TaskIdListItem format
      const formattedTasks: TaskIdListItem[] = dbTasks.map(task => ({
        id: task.task_id,
        url: task.target_url,
        datetime_posted: task.created_at,
        datetime_done: task.updated_at,
        status: task.status,
        cost: task.response?.cost || 0,
        metadata: {
          api: 'onPage',
          function: 'task_post',
          target: task.target_url,
          max_crawl_pages: 100
        }
      }));

      setIdList(formattedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      setIdList([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up real-time subscription for task updates
  useEffect(() => {
    if (!user) return;

    const subscription = seoDataService.subscribeToTaskUpdates(user.id, (updatedTask) => {
      setIdList(currentList => {
        const index = currentList.findIndex(task => task.id === updatedTask.task_id);
        if (index === -1) return currentList;

        const newList = [...currentList];
        newList[index] = {
          ...newList[index],
          status: updatedTask.status,
          datetime_done: updatedTask.updated_at
        };
        return newList;
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    idList,
    isLoading,
    error,
    refetch: fetchData
  };
}