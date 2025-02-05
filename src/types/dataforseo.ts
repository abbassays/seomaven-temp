import {
  OnPageSummaryResultInfo,
  OnPagePagesResultInfo,
  OnPageResourcesResultInfo,
  OnPageLinksResultInfo,
  OnPageNonIndexableResultInfo,
  OnPageDuplicateTagsResultInfo,
  OnPageDuplicateContentResultInfo,
  OnPageKeywordDensityResultInfo,
} from "dataforseo-client";

export interface OnPageParameters {
  checks_threshold?: string;
  custom_js?: string;
  store_raw_html?: boolean;
  load_resources?: boolean;
  enable_javascript?: boolean;
  enable_browser_rendering?: boolean;
  calculate_keyword_density?: boolean;
  max_pages?: number;
}

export interface OnPageTaskResponse {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  path: string[];
  data: {
    api: string;
    function: string;
    target: string;
  };
  result: {
    task_id: string;
    status_code: number;
    status_message: string;
  }[];
}

export type OnPageSummary = OnPageSummaryResultInfo;
export type OnPagePages = OnPagePagesResultInfo | undefined;
export type OnPageResources = OnPageResourcesResultInfo | undefined;
export type OnPageLinks = OnPageLinksResultInfo | undefined;
export type OnPageNonIndexable = OnPageNonIndexableResultInfo | undefined;
export type OnPageDuplicateTags = OnPageDuplicateTagsResultInfo | undefined;
export type OnPageDuplicateContent =
  | OnPageDuplicateContentResultInfo
  | undefined;
export type OnPageKeywordDensity = OnPageKeywordDensityResultInfo | undefined;

export type SEOAuditReportData = {
  summary: OnPageSummary;
  pages: OnPagePages;
  resources: OnPageResources;
  links: OnPageLinks;
  nonIndexable: OnPageNonIndexable;
  duplicateTags: OnPageDuplicateTags;
  duplicateContent: OnPageDuplicateContent;
  keywordDensity: OnPageKeywordDensity;
};

export interface TaskIdListItem {
  id: string;
  url: string;
  datetime_posted: string;
  datetime_done: string;
  status: string;
  cost: number;
  metadata: {
    api: string;
    function: string;
    target: string;
    max_crawl_pages: number;
  };
}

export interface TaskReadyItem {
  id: string;
  target: string;
  date_posted: string;
  tag: string;
}
