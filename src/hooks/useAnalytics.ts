import type { Todo } from "@/types";

// Types for the function
type ArticleRangeData = {
  label: string;
  articles: number;
};

// Minimal Article type needed — only $createdAt
type ArticleInput = {
  $createdAt: string;
};

type RangeType = "day" | "week" | "month";

function getArticleAnalytics(
  articles: ArticleInput[],
  range: RangeType,
): ArticleRangeData[] {
  // ── DAY — last 7 days ──────────────────────────────────────
  if (range === "day") {
    const buckets: (ArticleRangeData & { dateKey: string })[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      buckets.push({
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateKey: date.toLocaleDateString("en-CA"),
        articles: 0,
      });
    }

    articles.forEach((article) => {
      const created = new Date(article.$createdAt).toLocaleDateString("en-CA");
      const bucket = buckets.find((b) => b.dateKey === created);
      if (bucket) bucket.articles++;
    });

    return buckets.map(({ dateKey, ...rest }) => rest);
  }

  // ── WEEK — last 4 weeks ────────────────────────────────────
  if (range === "week") {
    const buckets: ArticleRangeData[] = [
      { label: "Week 1", articles: 0 },
      { label: "Week 2", articles: 0 },
      { label: "Week 3", articles: 0 },
      { label: "Week 4", articles: 0 },
    ];

    const now = new Date();

    articles.forEach((article) => {
      const created = new Date(article.$createdAt);
      const diffDays =
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays <= 7) buckets[3].articles++;
      else if (diffDays <= 14) buckets[2].articles++;
      else if (diffDays <= 21) buckets[1].articles++;
      else if (diffDays <= 28) buckets[0].articles++;
      // older than 28 days → ignored
    });

    return buckets;
  }

  // ── MONTH — last 12 months ─────────────────────────────────
  if (range === "month") {
    // Internal type includes month+year for matching
    const buckets: (ArticleRangeData & { month: number; year: number })[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(1); // prevent month overflow bug
      date.setMonth(date.getMonth() - i);

      buckets.push({
        label: date.toLocaleDateString("en-US", { month: "short" }),
        month: date.getMonth(), // 0-11
        year: date.getFullYear(),
        articles: 0,
      });
    }

    // ✅ THE MISSING FILL STEP — this is what was broken
    // For each article, find which month bucket it belongs to
    // Match by BOTH month AND year — otherwise Jan 2024 and Jan 2025 clash
    articles.forEach((article) => {
      const created = new Date(article.$createdAt);
      const bucket = buckets.find(
        (b) =>
          b.month === created.getMonth() && b.year === created.getFullYear(),
      );
      if (bucket) bucket.articles++;
    });

    // Strip month and year — Recharts only needs label and articles
    return buckets.map(({ month, year, ...rest }) => rest);
  }

  return [];
}

function getTasksOverTime(todos: Todo[]) {
  // Phase 1 — build buckets
  const buckets: { day: string; dateKey: string; tasks: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    buckets.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateKey: date.toLocaleDateString("en-CA"),
      tasks: 0,
    });
  }

  // Phase 2 — fill buckets
  todos?.forEach((t) => {
    const creAt = new Date(t.$createdAt).toLocaleDateString("en-CA");
    const bucket = buckets.find((b) => b.dateKey === creAt);
    if (bucket) bucket.tasks++;
  });

  // Phase 3 — strip dateKey
  return buckets.map(({ dateKey, ...rest }) => rest);
}

export { getArticleAnalytics, getTasksOverTime };
