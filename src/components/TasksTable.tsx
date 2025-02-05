import { TaskIdListItem } from "@/types/dataforseo";
import { RefreshCw, FileText, Loader2, DollarSign } from "lucide-react";
import { Button } from "./ui/button";

interface TasksTableProps {
  title: string;
  tasks: TaskIdListItem[];
  isLoading: boolean;
  error: string | null;
  type: "id-list" | "tasks-ready";
  onRefresh: () => void;
  onViewReport?: (taskId: string) => void;
}

export function TasksTable({
  title,
  tasks,
  isLoading,
  error,
  onRefresh,
  onViewReport,
}: TasksTableProps) {
  if (error) {
    return (
      <div className="mt-8 rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(cost);
  };

  const getStatusBadge = (status: string, statusCode?: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

    // Handle numeric status codes
    if (statusCode) {
      if (statusCode === 20100) {
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Task Created
          </span>
        );
      }
      if (statusCode >= 20000 && statusCode < 30000) {
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Success
          </span>
        );
      }
      if (statusCode >= 40000) {
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Error
          </span>
        );
      }
    }

    // Handle string status
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "processing":
        return (
          <span
            className={`${baseClasses} bg-blue-100 text-blue-800 flex items-center gap-1`}
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Completed
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Failed
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg bg-gray-50 p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
          No tasks found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  URL
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status Code
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {task.id}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-900">
                    {task.url || "N/A"}
                  </td>
                  {/* <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {task.status_code || "N/A"}
                  </td> */}
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-900">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      {task.cost ? formatCost(task.cost) : "N/A"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {task.datetime_posted
                      ? formatDate(task.datetime_posted)
                      : "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {onViewReport && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewReport(task.id)}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900"
                      >
                        <FileText className="h-4 w-4" />
                        View Report
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
