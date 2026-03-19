import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteMeta } from "../data/site";
import { getLegacyPostUrl, sortPosts } from "../lib/blog";

export async function GET(context) {
  const posts = sortPosts(await getCollection("blog"));

  return rss({
    title: `${siteMeta.title} | Blog`,
    description: siteMeta.description,
    site: context.site ?? siteMeta.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? "",
      link: getLegacyPostUrl(post)
    })),
    customData: "<language>en-au</language>"
  });
}
