import { Database } from "./supabase";

export type InsertPages = Database["public"]["Tables"]["seo_pages"]["Insert"];
export type InsertResources = Database["public"]["Tables"]["seo_resources"]["Insert"];
export type InsertLinks = Database["public"]["Tables"]["seo_links"]["Insert"];
export type InsertNonIndexable = Database["public"]["Tables"]["seo_non_indexable"]["Insert"];
export type InsertDuplicateTags = Database["public"]["Tables"]["seo_duplicate_tags"]["Insert"];
export type InsertDuplicateContent = Database["public"]["Tables"]["seo_duplicate_content"]["Insert"];
export type InsertKeywordDensity = Database["public"]["Tables"]["seo_keyword_density"]["Insert"];
// export type InsertRedirectChains = Database["public"]["Tables"]["seo_redirect_chains"]["Insert"];