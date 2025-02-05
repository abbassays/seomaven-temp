import { useState } from "react";
import { Search, FileSearch, Loader2, LogOut, Activity } from "lucide-react";
import { Button } from "./components/ui/button";
import { AdvancedOptionsSheet } from "./components/advanced-options-sheet";
import { OnPageParameters } from "./types/dataforseo";
import { dataForSEOApi } from "./services/api";
import { seoDataService } from "./services/seoData";
import { useTasksData } from "./hooks/useTasksData";
import { TasksTable } from "./components/TasksTable";
import { useAuth } from "./contexts/AuthContext";
import { AuthForm } from "./components/auth/AuthForm";
import { TaskMonitor } from "./pages/TaskMonitor";
import { useTask } from "./contexts/TaskContext";

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);
  const { setAuditData } = useTask();
  const [parameters, setParameters] = useState<OnPageParameters>({
    store_raw_html: false,
    load_resources: true,
    enable_javascript: true,
    enable_browser_rendering: true,
    calculate_keyword_density: true,
    max_crawl_pages: 100,
  });

  const {
    idList,
    isLoading: tasksLoading,
    error: tasksError,
    refetch,
  } = useTasksData();

  const handleAnalyze = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    if (!user) {
      setError("Please sign in to analyze URLs");
      return;
    }

    try {
      console.log("setting audit data to null");
      setAuditData(null);
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Validate URL format
      let processedUrl: string;
      try {
        const urlToProcess = url.startsWith("http") ? url : `https://${url}`;
        const urlObj = new URL(urlToProcess);
        processedUrl = urlObj.toString();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (urlError) {
        throw new Error("Please enter a valid URL");
      }

      // Create DataForSEO task
      const response = await dataForSEOApi.createOnPageTask(
        processedUrl,
        parameters
      );

      if (!response?.result?.[0]?.task_id) {
        throw new Error("Failed to create task: No task ID received");
      }

      const newTaskId = response.result[0].task_id;

      // Store task and response in database
      await seoDataService.createTask(
        newTaskId,
        processedUrl,
        user.id,
        response
      );

      setTaskId(newTaskId);
      setShowMonitor(true);

      // Format cost to 4 decimal places
      const cost = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(response.cost);

      setSuccessMessage(
        `Analysis started successfully!\n` +
          `Task ID: ${newTaskId}\n` +
          `Cost: ${cost}`
      );

      await refetch(); // Refresh the task list
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Error in handleAnalyze:", errorMessage);
      setError(errorMessage);
      setTaskId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError("Failed to sign out");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <FileSearch className="mx-auto h-12 w-12 text-indigo-600" />
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                SEO Maven AI
              </h1>
              <p className="mt-2 text-gray-600">
                Sign in to analyze your websites
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSearch className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">SEO Maven AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMonitor(false)}
                className={showMonitor ? "text-gray-600" : "text-indigo-600"}
              >
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMonitor(true)}
                className={!showMonitor ? "text-gray-600" : "text-indigo-600"}
              >
                <Activity className="mr-2 h-4 w-4" />
                Monitor
              </Button>
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {showMonitor ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900">
                  Task Monitor
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Monitor your SEO analysis tasks in real-time
                </p>
              </div>
              <TaskMonitor taskId={taskId} />
              <TasksTable
                title="Recent Tasks"
                tasks={idList}
                isLoading={tasksLoading}
                error={tasksError}
                type="id-list"
                setShowMonitor={setShowMonitor}
                onRefresh={refetch}
              />
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="mb-4 text-4xl font-bold text-gray-900">
                  Your Site Audit
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                  Enter your website URL to get detailed insights and
                  recommendations
                </p>

                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., example.com)"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Starting...
                      </span>
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                  <AdvancedOptionsSheet
                    parameters={parameters}
                    onParametersChange={setParameters}
                  />
                </div>

                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-600 whitespace-pre-line">
                    {successMessage}
                  </div>
                )}
              </div>

              <TasksTable
                title="Recent Tasks"
                tasks={idList}
                isLoading={tasksLoading}
                error={tasksError}
                type="id-list"
                onRefresh={refetch}
                setShowMonitor={setShowMonitor}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
