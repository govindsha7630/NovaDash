import type { Subtask } from "@/types";

//utils/formatDate
function formatDate(date?: string) {
  if (!date) return "No due date";

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) return "Invalid date";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}
// utils/timeAgo.ts

function timeAgo(date?: string): string {
  if (!date) return "No date";

  const now = new Date();
  const past = new Date(date);

  if (isNaN(past.getTime())) return "Invalid date";

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // seconds
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  // minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  }

  // hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  // months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  // years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

//utils/priority Classname
function recentTaskTagColor(priority: string) {
  const p = priority?.toLowerCase();

  const styles: Record<string, string> = {
    high:
      "inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-700 shadow-sm shadow-rose-500/5 transition-colors dark:border-rose-400/20 dark:bg-rose-500/15 dark:text-rose-300",
    medium:
      "inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 shadow-sm shadow-cyan-500/5 transition-colors dark:border-cyan-400/20 dark:bg-cyan-500/15 dark:text-cyan-300",
    low:
      "inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 shadow-sm shadow-amber-500/5 transition-colors dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-300",
  };

  return styles[p] ?? styles.low;
}

// utils/string.js
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}
function parseSubtasks(raw?: string): Subtask[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function generateSlug(title: string): string {
  const baseUrl = "https://novadash.com/articles";

  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "-") // remove special characters
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // remove duplicate -

  return `${baseUrl}/${slug}`;
}

function createSlug(title:string, id:string):string {
    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "-")   // remove special characters
        .replace(/\s+/g, "-")           // replace spaces with -
        .replace(/-+/g, "-")
    return `${slug}-${id}`
}

export {
  truncate,
  capitalize,
  formatDate,
  timeAgo,
  recentTaskTagColor,
  parseSubtasks,
  generateSlug,
  createSlug
};
