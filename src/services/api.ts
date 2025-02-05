// https://github.com/dataforseo/TypeScriptClient/blob/master/docs/classes/OnPageApi.md
import {
  OnPageDuplicateContentResponseInfo,
  OnPageDuplicateContentResultInfo,
  OnPageDuplicateTagsResponseInfo,
  OnPageKeywordDensityResponseInfo,
  OnPageKeywordDensityResultInfo,
  OnPageLinksResponseInfo,
  OnPageLinksResultInfo,
  OnPageNonIndexableResponseInfo,
  OnPageNonIndexableResultInfo,
  OnPagePagesResponseInfo,
  OnPagePagesResultInfo,
  OnPageRedirectChainsResponseInfo,
  OnPageRedirectChainsResultInfo,
  OnPageResourcesResponseInfo,
  OnPageResourcesResultInfo,
  OnPageSummaryResponseInfo,
  OnPageSummaryResultInfo,
} from "dataforseo-client";

import { env } from "@/config/env";
import { logData } from "@/lib/utils";
import {
  OnPageDuplicateTags,
  OnPageParameters,
  OnPageTaskResponse,
  TaskIdListItem,
  TaskReadyItem,
} from "@/types/dataforseo";
import axios from "axios";

const API_BASE_URL = "https://api.dataforseo.com/v3";

class DataForSEOApi {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      auth: {
        username: env.dataForSEO.login,
        password: env.dataForSEO.password,
      },
      headers: {
        "content-type": "application/json",
      },
    });
  }

  async createOnPageTask(
    url: string,
    parameters: OnPageParameters
  ): Promise<OnPageTaskResponse> {
    try {
      // Use the test configuration
      const post_array = [{ target: url, ...parameters }];
      const response = await this.client.post("/on_page/task_post", post_array);

      console.log(
        "DataForSEO API Response:",
        JSON.stringify(response.data, null, 2)
      );

      if (!response.data?.tasks?.[0]) {
        throw new Error("Invalid API response: missing tasks array");
      }

      const task = response.data?.tasks?.[0];

      // Check for API error response
      if (task.status_code >= 40000) {
        throw new Error(task.status_message || "API Error");
      }

      return {
        id: task.id,
        status_code: task.status_code,
        status_message: task.status_message,
        time: task.time,
        cost: task.cost,
        result_count: task.result_count,
        path: task.path,
        data: task.data,
        result: [
          {
            task_id: task.id,
            status_code: task.status_code,
            status_message: task.status_message,
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("DataForSEO API Error:", error.response?.data);
        throw new Error(
          error.response?.data?.error_message ||
            error.response?.data?.tasks?.[0]?.status_message ||
            "API request failed"
        );
      }
      throw error;
    }
  }

  async getTasksReady(): Promise<TaskReadyItem[]> {
    try {
      const response = await this.client.get("/on_page/tasks_ready");
      if (!response.data?.tasks?.[0]?.result) {
        return [];
      }

      return response.data?.tasks?.[0]?.result;
    } catch (error) {
      console.error("Tasks Ready Error:", error);
      return [];
    }
  }

  async getTaskIdList(): Promise<TaskIdListItem[]> {
    try {
      const now = new Date();
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      logData("getTaskIdList", oneMonthAgo.toISOString());
      const response = await this.client.post("/on_page/id_list", [
        {
          datetime_from: oneMonthAgo.toISOString(),
          datetime_to: new Date().toISOString(),
          limit: 100,
          include_metadata: true,
        },
      ]);
      // logData("getTaskIdList response", response);

      if (!response.data?.tasks?.[0]?.result) {
        return [];
      }

      return response.data?.tasks?.[0]?.result;
    } catch (error) {
      console.error("Task ID List Error:", error);
      return [];
    }
  }

  async getOnPageSummary(taskId: string): Promise<OnPageSummaryResultInfo> {
    try {
      const response = await this.client.get<OnPageSummaryResponseInfo>(
        `/on_page/summary/${taskId}`
      );
      // logData("getOnPageSummary response", response);
      if (!response.data?.tasks?.[0]?.result?.[0]) {
        throw new Error("Invalid API response format or task not ready");
      }

      return response.data?.tasks?.[0]?.result?.[0];
    } catch (error) {
      console.error("Summary Error:", error);
      throw error;
    }
  }

  // Add methods for fetching other data types
  async getOnPagePages(
    taskId: string
  ): Promise<OnPagePagesResultInfo | undefined> {
    const response = await this.client.post<OnPagePagesResponseInfo>(
      `/on_page/pages`,
      {
        data: [{ id: taskId }],
      }
    );
    // logData("getOnPagePages response", response);
    return response.data?.tasks?.[0]?.result?.[0];
  }

  async getOnPageResources(
    taskId: string
  ): Promise<OnPageResourcesResultInfo | undefined> {
    const response = await this.client.post<OnPageResourcesResponseInfo>(
      `/on_page/resources`,
      {
        data: [{ id: taskId }],
      }
    );
    // logData("getOnPageResources response", response);
    return response.data?.tasks?.[0]?.result?.[0];
  }

  async getOnPageLinks(
    taskId: string
  ): Promise<OnPageLinksResultInfo | undefined> {
    const response = await this.client.post<OnPageLinksResponseInfo>(
      `/on_page/links`,
      {
        data: [{ id: taskId }],
      }
    );
    // logData("getOnPageLinks response", response);
    return response.data?.tasks?.[0]?.result?.[0];
  }

  async getOnPageNonIndexable(
    taskId: string
  ): Promise<OnPageNonIndexableResultInfo | undefined> {
    const response = await this.client.post<OnPageNonIndexableResponseInfo>(
      `/on_page/non_indexable`,
      {
        data: [{ id: taskId }],
      }
    );
    // logData("getOnPageNonIndexable response", response);
    return response.data?.tasks?.[0]?.result?.[0];
  }

  async getOnPageDuplicateTags(taskId: string): Promise<OnPageDuplicateTags> {
    const response = await this.client.post<OnPageDuplicateTagsResponseInfo>(
      `/on_page/duplicate_tags`,
      [
        { id: taskId, type: "duplicate_title" },
        { id: taskId, type: "duplicate_description" },
      ]
    );
    logData("getOnPageDuplicateTags response", response.data);
    logData("getOnPageDuplicateTags response", JSON.stringify(response.data));
    const duplicateTitle = response.data?.tasks?.[0]?.result?.[0];
    const duplicateDescription = response.data?.tasks?.[1]?.result?.[0];
    return { duplicateTitle, duplicateDescription };
  }

  async getOnPageDuplicateContent(
    taskId: string,
    url: string
  ): Promise<OnPageDuplicateContentResultInfo | undefined> {
    const response = await this.client.post<OnPageDuplicateContentResponseInfo>(
      `/on_page/duplicate_content`,
      [{ id: taskId, url }]
    );
    logData("getOnPageDuplicateContent response", response.data);
    logData(
      "getOnPageDuplicateContent response",
      JSON.stringify(response.data)
    );
    return response.data?.tasks?.[0]?.result?.[0];
  }

  async getOnPageKeywordDensity(
    taskId: string
  ): Promise<OnPageKeywordDensityResultInfo | undefined> {
    const response = await this.client.post<OnPageKeywordDensityResponseInfo>(
      `/on_page/keyword_density`,
      [{ id: taskId, keyword_length: 2 }]
    );
    return response.data?.tasks?.[0]?.result?.[0];
  }

  async getOnPageRedirectChains(
    taskId: string
  ): Promise<OnPageRedirectChainsResultInfo | undefined> {
    const response = await this.client.post<OnPageRedirectChainsResponseInfo>(
      `/on_page/redirect_chains`,
      [{ id: taskId }]
    );
    logData("getOnPageRedirectChains response", response.data);
    logData("getOnPageRedirectChains response", JSON.stringify(response.data));
    return response.data?.tasks?.[0]?.result?.[0];
  }

  async getAllData(taskId: string, url: string) {
    const res = await Promise.all([
      this.getOnPageSummary(taskId),
      this.getOnPagePages(taskId),
      this.getOnPageResources(taskId),
      this.getOnPageLinks(taskId),
      this.getOnPageNonIndexable(taskId),
      this.getOnPageDuplicateTags(taskId),
      this.getOnPageDuplicateContent(taskId, url),
      this.getOnPageKeywordDensity(taskId),
      this.getOnPageRedirectChains(taskId),
    ]);
    return res;
  }
}

// Create and export a singleton instance
export const dataForSEOApi = new DataForSEOApi();
