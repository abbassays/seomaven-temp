import { useState, useEffect } from "react";
import { dataForSEOApi } from "@/services/api";
import { seoDataService } from "@/services/seoData";
import { OnPageSummary, SEOAuditReportData } from "@/types/dataforseo";
import { useAuth } from "@/contexts/AuthContext";

export function useTaskPolling(taskId: string | null) {
  const [summary, setSummary] = useState<OnPageSummary | null>(null);
  const [auditData, setAuditData] = useState<SEOAuditReportData | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!taskId || !user) return;

    const pollInterval = 5000; // 5 seconds
    let timeoutId: NodeJS.Timeout;

    const pollTask = async () => {
      try {
        // First check tasks_ready endpoint
        const readyTasks = await dataForSEOApi.getTasksReady();
        const isTaskReady = readyTasks.some((task) => task.id === taskId);

        if (isTaskReady) {
          // Task is ready, get the summary
          const result = await dataForSEOApi.getOnPageSummary(taskId);
          setSummary(result);

          // Store the data
          const { data: dbTask } =
            await seoDataService.getTaskByDataForSEOId(taskId);
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

  return { summary, isPolling, error, auditData };
}
