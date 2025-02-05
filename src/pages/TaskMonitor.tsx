import { SEOAuditReport } from "@/components/reports/SEOAuditReport";
import { useTask } from "@/contexts/TaskContext";
import { useTaskPolling } from "@/hooks/useTaskPolling";
import { Loader2 } from "lucide-react";

interface TaskMonitorProps {
  taskId: string | null;
}

export function TaskMonitor({ taskId }: TaskMonitorProps) {
  const { isPolling, error } = useTaskPolling(taskId);
  const { auditData } = useTask();

  if (error) {
    return (
      <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
    );
  }

  if (isPolling && !auditData) {
    return (
      <div className="mt-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]" />
        <p className="mt-4 text-gray-600">
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing your website...
          </span>
        </p>
      </div>
    );
  }

  if (auditData) {
    return <SEOAuditReport data={auditData} />;
  }

  return null;
}
