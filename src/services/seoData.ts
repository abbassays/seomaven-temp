/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "./db";
import { OnPageTaskResponse, SEOAuditReportData } from "@/types/dataforseo";
import { dataForSEOApi } from "./api";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  OnPageDuplicateTagsResultInfo,
  OnPageKeywordDensityResultInfo,
  OnPageLinksResultInfo,
  OnPageNonIndexableResultInfo,
  OnPagePagesResultInfo,
  OnPageResourcesResultInfo,
  OnPageSummaryResultInfo,
} from "dataforseo-client";
import {
  InsertDuplicateTags,
  InsertKeywordDensity,
  InsertLinks,
  InsertNonIndexable,
  InsertPages,
  InsertResources,
} from "@/types/dao";

class SEODataService {
  private realtimeChannels: Map<string, RealtimeChannel> = new Map();

  async createTask(
    taskId: string,
    targetUrl: string,
    userId: string,
    response: OnPageTaskResponse
  ) {
    try {
      const { data, error } = await supabase.rpc("create_task_with_response", {
        p_task_id: taskId,
        p_target_url: targetUrl,
        p_user_id: userId,
        p_response_data: response as any,
      });

      if (error) {
        console.error("Error creating task:", error);
        throw new Error("Failed to create task in database");
      }

      return data;
    } catch (error) {
      console.error("Error in createTask:", error);
      throw error;
    }
  }

  async getUserTasks(userId: string) {
    const { data, error } = await supabase
      .from("seo_tasks")
      .select(
        `
        *,
        task_responses (
          response_data
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user tasks:", error);
      throw error;
    }
    console.log("Success user tasks");

    return data.map((task) => ({
      ...task,
      response: task.task_responses?.[0]?.response_data,
    }));
  }

  async getTaskByDataForSEOId(taskId: string) {
    const { data, error } = await supabase
      .from("seo_tasks")
      .select("*")
      .eq("task_id", taskId)
      .single();

    if (error) {
      console.error("Error fetching task:", error);
      throw error;
    }

    return { data };
  }

  async updateTaskStatus(
    taskId: string,
    status: "pending" | "processing" | "completed" | "failed"
  ) {
    console.log("Updating task status to", status);
    const { error } = await supabase
      .from("seo_tasks")
      .update({ status })
      .eq("task_id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  async fetchAndStoreAllData(
    taskId: string,
    dbTaskId: string
  ): Promise<SEOAuditReportData> {
    try {
      console.log("Starting to fetch and store all data");
      // Update task status to processing
      await this.updateTaskStatus(taskId, "processing");

      // Fetch all data types
      const [
        summary,
        pages,
        resources,
        links,
        nonIndexable,
        duplicateTags,
        duplicateContent,
        keywordDensity,
        redirectChains,
      ] = await Promise.all([
        dataForSEOApi.getOnPageSummary(taskId),
        dataForSEOApi.getOnPagePages(taskId),
        dataForSEOApi.getOnPageResources(taskId),
        dataForSEOApi.getOnPageLinks(taskId),
        dataForSEOApi.getOnPageNonIndexable(taskId),
        dataForSEOApi.getOnPageDuplicateTags(taskId),
        dataForSEOApi.getOnPageDuplicateContent(taskId),
        dataForSEOApi.getOnPageKeywordDensity(taskId),
        dataForSEOApi.getOnPageRedirectChains(taskId),
      ]);

      console.log("All data fetched");
      console.log("sample duplicateContent", JSON.stringify(duplicateContent));
      console.log("sample redirectChains", JSON.stringify(redirectChains));

      // Store each data type in its respective table
      await Promise.all([
        this.storeSummary(dbTaskId, summary),
        this.storePages(dbTaskId, pages),
        this.storeResources(dbTaskId, resources),
        this.storeLinks(dbTaskId, links),
        this.storeNonIndexable(dbTaskId, nonIndexable),
        this.storeDuplicateTags(dbTaskId, duplicateTags),
        // this.storeDuplicateContent(dbTaskId, duplicateContent),
        this.storeKeywordDensity(dbTaskId, keywordDensity),
      ]);

      console.log("All data stored");

      // Update task status to completed
      await this.updateTaskStatus(taskId, "completed");
      return {
        summary,
        pages,
        resources,
        links,
        nonIndexable,
        duplicateTags,
        duplicateContent,
        keywordDensity,
      };
    } catch (error) {
      console.error("Error storing SEO data:", error);
      await this.updateTaskStatus(taskId, "failed");
      throw error;
    }
  }

  subscribeToTaskUpdates(userId: string, callback: (task: any) => void) {
    // Clean up any existing subscription for this user
    this.unsubscribeFromTaskUpdates(userId);

    // Create a new channel for this user
    const channel = supabase
      .channel(`tasks:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "seo_tasks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    // Store the channel reference
    this.realtimeChannels.set(userId, channel);

    return {
      unsubscribe: () => this.unsubscribeFromTaskUpdates(userId),
    };
  }

  private unsubscribeFromTaskUpdates(userId: string) {
    const channel = this.realtimeChannels.get(userId);
    if (channel) {
      channel.unsubscribe();
      this.realtimeChannels.delete(userId);
    }
  }

  private async storeSummary(taskId: string, data: OnPageSummaryResultInfo) {
    const { error } = await supabase.from("seo_summaries").insert({
      broken_links_count: data.page_metrics?.broken_links,
      broken_resources_count: data.page_metrics?.broken_resources,
      checks: data.page_metrics?.checks || {},
      crawl_progress: data.crawl_progress,
      crawl_status: JSON.stringify(data.crawl_status),
      duplicate_content_count: data.page_metrics?.duplicate_content,
      duplicate_description_count: data.page_metrics?.duplicate_description,
      duplicate_title_count: data.page_metrics?.duplicate_title,
      external_links_count: data.page_metrics?.links_external,
      internal_links_count: data.page_metrics?.links_internal,
      page_metrics: data.page_metrics || {},
      pages_crawled: data.crawl_status?.pages_crawled,
      schema_types: data.schema_types,
      task_id: taskId,
      total_pages: data.domain_info?.total_pages,
    });

    if (error) {
      console.error("Error storing summary:", error);
      throw error;
    }
    console.log("Success storing summary");
  }

  private async storePages(
    taskId: string,
    pages: OnPagePagesResultInfo | undefined
  ) {
    const data: InsertPages[] = [];
    if (!pages?.items) return;
    for (const page of pages.items) {
      if (!page) continue;
      data.push({
        task_id: taskId,
        url: page.url || "",
        status_code: page.status_code,
        size: page.size,
        // @ts-expect-error
        load_time: page.page_timing.download_time,
        content_encoding: page.content_encoding,
        media_type: page.media_type,
        // @ts-expect-error
        meta: page.meta,
      });
    }

    const { error } = await supabase.from("seo_pages").insert(data);

    if (error) {
      console.error("Error storing pages:", error);
      throw error;
    }
    console.log("Success storing pages");
  }

  private async storeResources(
    taskId: string,
    resources: OnPageResourcesResultInfo | undefined
  ) {
    const data: InsertResources[] = [];
    if (!resources?.items) return;
    for (const resource of resources.items) {
      if (!resource) continue;
      data.push({
        task_id: taskId,
        url: resource.url || "",
        fetch_time: new Date(resource.fetch_time as string).getTime(),
        resource_type: resource.resource_type,
        size: resource.size,
        encoded_size: resource.encoded_size,
        total_transfer_size: resource.total_transfer_size,
        // @ts-expect-error
        fetch_timing: resource.fetch_timing,
      });
    }

    const { error } = await supabase.from("seo_resources").insert(data);

    if (error) {
      console.error("Error storing resources:", error);
      throw error;
    }
    console.log("Success storing resources");
  }

  private async storeLinks(
    taskId: string,
    links: OnPageLinksResultInfo | undefined
  ) {
    const data: InsertLinks[] = [];
    if (!links?.items) return;
    for (const resource of links.items) {
      if (!resource) continue;
      data.push({
        task_id: taskId,
        url_from: resource.link_from || "",
        url_to: resource.link_to || "",
        // @ts-expect-error
        link_attributes: resource.link_attribute ?? undefined,
        dofollow: resource.dofollow,
        link_type: resource.type,
      });
    }
    const { error } = await supabase.from("seo_links").insert(data);

    if (error) {
      console.error("Error storing links:", error);
      throw error;
    }
    console.log("Success storing links");
  }

  private async storeNonIndexable(
    taskId: string,
    items: OnPageNonIndexableResultInfo | undefined
  ) {
    const data: InsertNonIndexable[] = [];
    if (!items?.items) return;
    for (const item of items.items) {
      if (!item) continue;
      data.push({
        task_id: taskId,
        url: item.url || "",
        meta_robots: item.meta_robots,
        reason: item.reason,
      });
    }
    const { error } = await supabase.from("seo_non_indexable").insert(data);

    if (error) {
      console.error("Error storing non-indexable pages:", error);
      throw error;
    }
    console.log("Success storing non-indexable pages");
  }

  private async storeDuplicateTags(
    taskId: string,
    items: OnPageDuplicateTagsResultInfo | undefined
  ) {
    const data: InsertDuplicateTags[] = [];
    if (!items?.items) return;
    for (const item of items.items) {
      if (!item) continue;
      data.push({
        task_id: taskId,
        accumulator: item.accumulator ?? "",
        // @ts-expect-error
        pages: item.pages?.filter(Boolean) ?? {},
        total_count: item.count,
        urls: item.urls,
      });
    }

    const { error } = await supabase.from("seo_duplicate_tags").insert(data);

    if (error) {
      console.error("Error storing duplicate tags:", error);
      throw error;
    }
    console.log("Success duplicate tags");
  }

  // private async storeDuplicateContent(
  //   taskId: string,
  //   items: OnPageDuplicateContentResultInfo
  // ) {
  //   const data: InsertDuplicateContent[] = [];
  //   if (!items?.items) return;
  //   for (const item of items.items) {
  //     if (!item?.pages) continue;
  //     data.push({
  //       task_id: taskId,
  //       similarity_score: item.pages[0]?.similarity ?? 0,
  //       source_meta: item.pages[0]?.page[0]?.
  //     });
  //   }
  //   const { error } = await supabase
  //     .from("seo_duplicate_content")
  //     .insert(items.map((item) => ({ task_id: taskId, ...item })));

  //   if (error) throw error;
  // }

  private async storeKeywordDensity(
    taskId: string,
    items: OnPageKeywordDensityResultInfo | undefined
  ) {
    const data: InsertKeywordDensity[] = [];
    if (!items?.items) return;
    for (const item of items.items) {
      if (!item) continue;
      data.push({
        task_id: taskId,
        density: item.density ?? 0,
        frequency: item.frequency ?? 0,
        keyword: item.keyword ?? "",
      });
    }
    const { error } = await supabase.from("seo_keyword_density").insert(data);

    if (error) {
      console.error("Error storing keyword density:", error);
      throw error;
    }
    console.log("Success keyword density");
  }
}

export const seoDataService = new SEODataService();
