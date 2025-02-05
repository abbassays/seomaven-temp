import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnPageSummary } from "@/types/dataforseo";

interface ResultsTabsProps {
  summary: OnPageSummary;
}

export function ResultsTabs({ summary }: ResultsTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="seo">SEO Issues</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Pages Crawled</p>
            <p className="text-2xl font-bold">
              {summary.crawl_status?.pages_crawled}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Total Pages</p>
            <p className="text-2xl font-bold">
              {summary.domain_info?.total_pages}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Crawl Progress</p>
            <p className="text-2xl font-bold capitalize">{summary.crawl_progress}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="seo" className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Duplicate Content</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Titles</span>
                <span className="font-semibold">
                  {summary.page_metrics?.duplicate_title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Descriptions</span>
                <span className="font-semibold">
                  {summary.page_metrics?.duplicate_description}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Content</span>
                <span className="font-semibold">
                  {summary.page_metrics?.duplicate_content}
                </span>
              </div>
            </div>
          </div>

          {/* //TODO: fix the data here */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Issues Overview</h3>
            <div className="space-y-3">
              {summary.page_metrics?.checks &&
                Object.entries(summary.page_metrics.checks).map(
                  ([check, stats]) => (
                    <div
                      key={check}
                      className="flex items-center justify-between gap-2"
                    >
                      <p className="capitalize">{check.replace(/_/g, " ")}</p>
                      <p className="font-medium">{stats}</p>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* //TODO: fix the data here */}
      <TabsContent value="performance" className="mt-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Page Metrics</h3>
          <div className="space-y-4">
            {summary.page_metrics &&
              Object.entries(summary.page_metrics).map(([metric, values]) => (
                <div key={metric} className="border-b pb-4">
                  <h4 className="mb-2 capitalize">
                    {metric.replace(/_/g, " ")}
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Min</p>
                      <p className="text-lg font-semibold">{values.min}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average</p>
                      <p className="text-lg font-semibold">{values.avg}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Max</p>
                      <p className="text-lg font-semibold">{values.max}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="links" className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Link Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Internal Links</span>
                <span className="font-semibold">
                  {summary.page_metrics?.links_internal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>External Links</span>
                <span className="font-semibold">
                  {summary.page_metrics?.links_external}
                </span>
              </div>
              <div className="flex items-center justify-between text-red-600">
                <span>Broken Links</span>
                <span className="font-semibold">
                  {summary.page_metrics?.broken_links}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Resource Issues</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-red-600">
                <span>Broken Resources</span>
                <span className="font-semibold">
                  {summary.page_metrics?.broken_resources}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
