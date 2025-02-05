/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { OnPageDuplicateContent } from "@/types/dataforseo";
import EmptyData from "../empty-data";

type DuplicateContentTableProps = {
  data: OnPageDuplicateContent;
};
export default function DuplicateContentTable({
  data,
}: DuplicateContentTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Duplicate Content</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duplicate Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Similarity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.items?.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRow(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedRows.has(index) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item?.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item?.total_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.max(
                      ...(item?.pages?.map((page) => page?.similarity || 0) ||
                        [])
                    )}
                    %
                  </td>
                </tr>
                {expandedRows.has(index) && (
                  <tr>
                    <td colSpan={4}>
                      <div className="px-6 py-4">
                        <h4 className="font-semibold mb-2">Similar Pages:</h4>
                        <ul className="list-disc pl-5">
                          {item?.pages?.map((page, pageIndex) => (
                            <li key={pageIndex} className="text-sm">
                              <span className="font-medium">
                                {page?.similarity}% -{" "}
                              </span>
                              <a
                                href={page?.page?.[0]?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {/* @ts-expect-error */}
                                {page?.page?.[0]?.meta?.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
          <EmptyData
            data={data?.items}
            label="Duplicate Content"
          />
      </div>
    </div>
  );
}
