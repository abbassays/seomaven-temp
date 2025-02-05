import { useTaskPolling } from "@/hooks/useTaskPolling";
import { ResultsTabs } from "@/components/results/ResultsTabs";
import { Loader2 } from "lucide-react";
import { SEOAuditReport } from "@/components/reports/SEOAuditReport";

interface TaskMonitorProps {
  taskId: string;
}

export function TaskMonitor({ taskId }: TaskMonitorProps) {
  const { summary, isPolling, error, auditData } = useTaskPolling(taskId);

  if (error) {
    return (
      <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
    );
  }

  if (isPolling && !summary) {
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

  if (summary || auditData) {
    return (
      <div className="flex flex-col gap-6">
        {summary && <ResultsTabs summary={summary} />}
        {auditData && <SEOAuditReport data={auditData} />}
      </div>
    );
  }
  if (auditData) {
    return <SEOAuditReport data={auditData} />;
  }

  return null;
}
