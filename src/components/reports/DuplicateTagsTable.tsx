/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { OnPageDuplicateTagsResultInfo } from "dataforseo-client";
import { OnPageDuplicateTags } from "@/types/dataforseo";

type DuplicateTagsTableProps = {
  data: OnPageDuplicateTags;
};
const DuplicateTagsTable = ({ data }: DuplicateTagsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (key: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
    } else {
      newExpandedRows.add(key);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderTable = (
    title: string,
    data: OnPageDuplicateTagsResultInfo | undefined
  ) => {
    if (!data || !data.items || data.items.length === 0) {
      return (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p>No {title.toLowerCase()} found.</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleRow(`${title}-${index}`)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedRows.has(`${title}-${index}`) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                      {item?.accumulator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item?.total_count}
                    </td>
                  </tr>
                  {expandedRows.has(`${title}-${index}`) && (
                    <tr>
                      <td colSpan={3}>
                        <div className="px-6 py-4">
                          <h4 className="font-semibold mb-2">
                            Pages with this content:
                          </h4>
                          <ul className="list-disc pl-5">
                            {item?.pages?.map((page, pageIndex) => (
                              <li key={pageIndex} className="text-sm">
                                <a
                                  href={page?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {/* @ts-expect-error */}
                                  {page?.meta.title}
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
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderTable("Duplicate Titles", data.duplicateTitle)}
      {renderTable("Duplicate Descriptions", data.duplicateDescription)}
    </div>
  );
};

export default DuplicateTagsTable;
