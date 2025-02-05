import { useState, useEffect } from "react";
import { dataForSEOApi } from "@/services/api";
import { seoDataService } from "@/services/seoData";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";

export function useTaskPolling(taskId: string | null) {
  const { setAuditData } = useTask();
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!taskId || !user) return;
    console.log("starting polling for task", taskId);

    const pollInterval = 5000; // 5 seconds
    let timeoutId: NodeJS.Timeout;

    const pollTask = async () => {
      try {
        // First check tasks_ready endpoint
        const readyTasks = await dataForSEOApi.getTasksReady();
        const isTaskReady = readyTasks.some((task) => task.id === taskId);
        console.log("actively polling");
        if (isTaskReady) {
          // Store the data
          console.log("%c TASK READY ", "color: #bada55");

          const { data: dbTask } =
            await seoDataService.getTaskByDataForSEOId(taskId);
          console.log(dbTask);
          if (dbTask) {
            const data = await seoDataService.fetchAndStoreAllData(
              taskId,
              dbTask.id
            );
            setAuditData(data);
          }
          setIsPolling(false);
        } else {
          // Task not ready yet, continue polling
          timeoutId = setTimeout(pollTask, pollInterval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch results"
        );
        setIsPolling(false);
      }
    };

    setIsPolling(true);
    pollTask();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [taskId, user]);

  return { isPolling, error };
}
