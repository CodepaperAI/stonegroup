import "server-only";

const API_BASE = "https://api.upliftai.co/api/public/v1";

export type BlogSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  status: "PUBLISH" | "DRAFT" | string;
  publishDate?: string | null;
  publishTime?: string | null;
  featuredImage?: string | null;
  categories?: string[];
  tags?: string[];
  seoScore?: number;
  createdAt?: string;
  updatedAt?: string;
  authorName?: string | null;
  authorUrl?: string | null;
  freshness?: {
    lastUpdatedAt?: string;
    ageDays?: number;
    needsRefresh?: boolean;
    freshnessThresholdDays?: number;
  };
  meta?: {
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogType?: string;
    ogUrl?: string;
    ogSiteName?: string;
    articleAuthor?: string;
    articleSection?: string;
    articleTags?: string[];
    keywords?: string[];
  };
  customFields?: {
    readingTime?: string;
    rating?: number;
    [key: string]: unknown;
  };
};

type BlogListResponse = {
  success: boolean;
  data?: {
    blogs: BlogSummary[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
};

type BlogDetailResponse = {
  success: boolean;
  data?: {
    blog: BlogSummary;
  };
  error?: string;
};

export type BlogListResult = NonNullable<BlogListResponse["data"]>;

function token() {
  const apiKey = process.env.UPLIFT_API_KEY;

  if (!apiKey) {
    throw new Error("Missing UPLIFT_API_KEY. Add it to .env.local before running the site.");
  }

  return apiKey;
}

async function upliftFetch<T>(path: string, query?: Record<string, string | number>) {
  const url = new URL(`${API_BASE}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token()}`
    },
    next: { revalidate: 300 }
  });

  const payload = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error || `Uplift API request failed with ${response.status}`);
  }

  return payload;
}

export async function getBlogs(page = 1, limit = 9): Promise<BlogListResult> {
  const payload = await upliftFetch<BlogListResponse>("/blogs", {
    page,
    limit,
    status: "PUBLISH"
  });

  if (!payload.success || !payload.data) {
    throw new Error(payload.error || "Uplift API returned an invalid blog list response.");
  }

  return payload.data;
}

export async function getBlog(slug: string): Promise<BlogSummary> {
  const payload = await upliftFetch<BlogDetailResponse>(`/blog/${encodeURIComponent(slug)}`);

  if (!payload.success || !payload.data?.blog) {
    throw new Error(payload.error || "Uplift API returned an invalid blog response.");
  }

  return payload.data.blog;
}

export function formatDate(date?: string | null) {
  if (!date) return "Latest insight";

  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}

export function plainTextFromHtml(html?: string | null) {
  if (!html) return "";

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTime(blog: BlogSummary) {
  const customReadingTime = blog.customFields?.readingTime;

  if (typeof customReadingTime === "string" && customReadingTime.trim()) {
    return customReadingTime;
  }

  const words = plainTextFromHtml(blog.content || blog.excerpt).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}
