/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Link2,
  FileText,
  Image,
  Clock,
  Tag,
  Copy,
  Layers,
  FileWarningIcon,
} from "lucide-react";
import { SEOAuditReportData } from "@/types/dataforseo";
import EmptyData from "../empty-data";

interface SEOAuditReportProps {
  data: SEOAuditReportData;
}

export function SEOAuditReport({ data }: SEOAuditReportProps) {
  const { summary } = data;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-8">SEO Audit Report</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="seo-issues" className="flex items-center gap-2">
            <FileWarningIcon className="h-4 w-4 shrink-0" />
            SEO Issues
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Image className="h-4 w-4 shrink-0" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <Link2 className="h-4 w-4 shrink-0" />
            Links
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="flex items-center gap-2">
            <Copy className="h-4 w-4 shrink-0" />
            Duplicates
          </TabsTrigger>
          <TabsTrigger value="indexing" className="flex items-center gap-2">
            <Layers className="h-4 w-4 shrink-0" />
            Indexing
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Tag className="h-4 w-4 shrink-0" />
            Keywords
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Crawl Progress
              </h3>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-2xl font-semibold text-gray-900 capitalize">
                  {data.summary?.crawl_progress}
                </p>
                <div className="flex items-center text-green-600">
                  <Clock className="h-4 w-4 shrink-0" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Pages Crawled
              </h3>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-2xl font-semibold text-gray-900">
                  {data.summary?.crawl_status?.pages_crawled}
                </p>
                <div className="flex items-center text-blue-600">
                  <FileText className="h-4 w-4 shrink-0" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Links</h3>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-2xl font-semibold text-gray-900">
                  {(data.summary?.page_metrics?.links_internal ?? 0) +
                    (data.summary?.page_metrics?.links_external ?? 0)}
                </p>
                <div className="flex items-center text-indigo-600">
                  <Link2 className="h-4 w-4 shrink-0" />
                </div>
              </div>
            </div>

            {/* <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Issues Found
              </h3>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-2xl font-semibold text-gray-900">
                  {Object.values(data.summary?.domain_info?.checks || {}).reduce(
                    (acc, check) => acc + check.failed,
                    0
                  )}
                </p>
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                </div>
              </div>
            </div> */}
          </div>

          {/* <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Technical Issues Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.summary?.checks).map(([check, stats]) => (
                <div key={check} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 capitalize">
                    {check.replace(/_/g, " ")}
                  </h4>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-green-600">
                      {stats.passed} passed
                    </span>
                    <span className="text-red-600">{stats.failed} failed</span>
                    <span className="text-yellow-600">
                      {stats.warnings} warnings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </TabsContent>

        <TabsContent value="seo-issues" className="mt-6">
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

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Issues Overview</h3>
              <div className="space-y-3">
                {summary.page_metrics?.checks &&
                  Object.entries(summary.page_metrics.checks).map(
                    ([check, stats]) => {
                      if (!stats) return null;
                      return (
                        <div
                          key={check}
                          className="flex items-center justify-between gap-2"
                        >
                          <p className="capitalize">
                            {check.replace(/_/g, " ")}
                          </p>
                          <p className="font-medium">{stats}</p>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Done */}
        <TabsContent value="pages" className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Load Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.pages?.items?.map((page) => {
                  if (!page) return;
                  return (
                    <tr key={page.url}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {page.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.status_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round((page.size ?? 0) / 1024)} KB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* @ts-expect-error */}
                        {page.page_timing
                          ? // @ts-expect-error
                            (page.page_timing.download_time ?? 0)
                          : 0}
                        s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <EmptyData data={data.pages?.items} label="Pages" />
          </div>
        </TabsContent>
        {/* Done */}
        <TabsContent value="resources" className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Load Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.resources?.items?.map((resource) => {
                  if (!resource) return;
                  return (
                    <tr key={resource.url}>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                        {resource.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resource.resource_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round((resource.size ?? 0) / 1024)} KB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* @ts-expect-error */}
                        {resource.fetch_timing.duration_time}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <EmptyData data={data.resources?.items} label="Resources" />
          </div>
        </TabsContent>
        {/* Done */}
        <TabsContent value="links" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Link Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Internal Links</span>
                  <span className="font-semibold">
                    {data.summary?.page_metrics?.links_internal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>External Links</span>
                  <span className="font-semibold">
                    {data.summary?.page_metrics?.links_external}
                  </span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span>Broken Links</span>
                  <span className="font-semibold">
                    {data.summary?.page_metrics?.broken_links}
                  </span>
                </div>
              </div>
            </div>
            {/* Done */}
            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.links?.items?.map((link, index) => {
                    if (!link) return;
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {link.link_from}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {link.link_to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {link.type}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <EmptyData data={data.links?.items} label="Links" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="duplicates" className="mt-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Duplicate Tags</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.duplicateTags?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item?.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                          {item?.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <EmptyData
                  data={data.duplicateTags?.items}
                  label="Duplicate Tags"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Duplicate Content</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Similarity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duplicate URLs
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.duplicateContent?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                          {item?.url}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.similarity_percent}%
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item?.duplicate_urls.length} URLs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <EmptyData
                  data={data.duplicateContent?.items}
                  label="Duplicate Content"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="indexing" className="mt-6">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Non-Indexable Pages
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meta Robots
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.nonIndexable?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                          {item?.url}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.meta_robots?.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <EmptyData
                  data={data.nonIndexable?.items}
                  label="Non-Indexable Pages"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Keyword Density Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keyword
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Density
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pages
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.keywordDensity?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item?.keyword}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.density?.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.urls.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <EmptyData
                  data={data.keywordDensity?.items}
                  label="Keyword Density Analysis"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
