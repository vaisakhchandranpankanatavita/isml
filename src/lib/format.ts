import type { Post } from "@/types";

export const CATEGORY_LABEL: Record<Post["category"], string> = {
  news: "News",
  event: "Event",
  announcement: "Circular",
};

export function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
