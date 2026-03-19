import type { CollectionEntry } from "astro:content";

export type BlogEntry = CollectionEntry<"blog">;

const WORDS_PER_MINUTE = 220;
const legacyIdPattern =
  /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})-(?<slug>.+)$/;

export function sortPosts(posts: BlogEntry[]) {
  return [...posts].sort(
    (left, right) => right.data.date.getTime() - left.data.date.getTime()
  );
}

export function parseLegacyId(id: string) {
  const match = legacyIdPattern.exec(id);

  if (!match?.groups) {
    throw new Error(`Unsupported legacy post id: ${id}`);
  }

  return {
    year: match.groups.year,
    month: match.groups.month.padStart(2, "0"),
    day: match.groups.day.padStart(2, "0"),
    slug: match.groups.slug
  };
}

export function getLegacyPostUrl(post: BlogEntry) {
  const { year, month, day, slug } = parseLegacyId(post.id);
  return `/${year}/${month}/${day}/${slug}/`;
}

export function getExcerpt(post: BlogEntry, maxLength = 220) {
  const body = post.body ?? "";
  const source = body.split("<!--more-->")[0] ?? body;
  const text = source
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function getReadingTime(post: BlogEntry) {
  const words = (post.body ?? "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function getTagSlug(tag: string) {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export function getTags(posts: BlogEntry[]) {
  const seen = new Set<string>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      seen.add(tag);
    }
  }

  return [...seen].sort((left, right) => left.localeCompare(right));
}

export function findPostsByTag(posts: BlogEntry[], tagSlug: string) {
  return sortPosts(
    posts.filter((post) =>
      (post.data.tags ?? []).some((tag) => getTagSlug(tag) === tagSlug)
    )
  );
}
