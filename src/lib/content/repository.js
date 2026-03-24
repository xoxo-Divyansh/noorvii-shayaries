import "server-only";

import posts, {
  categories as seedCategories,
  featuredDownloads as seedFeaturedDownloads,
  socialLinks as seedSocialLinks,
} from "@/data/posts";
import { getDatabase, getDatabaseName, isDatabaseConfigured } from "@/lib/db/mongodb";

function normalizeCategory(category) {
  if (!category) return null;

  return {
    mood: category.mood,
    name: category.name,
    title: category.title,
    description: category.description,
    icon: category.icon,
    previewImage: category.previewImage,
    accent: category.accent,
    surface: category.surface,
    shadow: category.shadow,
  };
}

function normalizePost(post) {
  if (!post) return null;

  return {
    id: post.id,
    type: post.type,
    mood: post.mood,
    title: post.title,
    text: post.text,
    image: post.image ?? "",
    video: post.video ?? "",
    poster: post.poster ?? "",
    audio: post.audio ?? "",
    downloadHref: post.downloadHref ?? "",
    downloadLabel: post.downloadLabel ?? "",
    featured: Boolean(post.featured),
  };
}

function normalizeSocialLink(link) {
  if (!link) return null;

  return {
    name: link.name,
    href: link.href,
    icon: link.icon,
  };
}

function normalizeSiteSettings(settings) {
  return {
    socialLinks: Array.isArray(settings?.socialLinks)
      ? settings.socialLinks.map(normalizeSocialLink).filter(Boolean)
      : [],
  };
}

function buildFeaturedDownloads(contentPosts) {
  const firstImage = contentPosts.find((post) => post.type === "image");
  const firstVideo = contentPosts.find((post) => post.type === "video");
  const firstAudio = contentPosts.find((post) => post.audio);

  return [
    {
      id: "image",
      label: "Download Image",
      description: "Status-sized poster art from the featured love collection.",
      href: firstImage?.downloadHref || firstImage?.image || "",
    },
    {
      id: "video",
      label: "Download Video",
      description: "Poster fallback for video shayari until motion assets are added.",
      href: firstVideo?.downloadHref || firstVideo?.poster || firstVideo?.video || "",
    },
    {
      id: "audio",
      label: "Download Audio",
      description: "Use the current mood track directly in stories or reels.",
      href: firstAudio?.audio || "",
    },
  ];
}

function getSeedSnapshot() {
  const normalizedPosts = posts.map(normalizePost);
  const normalizedCategories = seedCategories.map(normalizeCategory);
  const normalizedSocialLinks = seedSocialLinks.map(normalizeSocialLink);

  return {
    source: "seed",
    categories: normalizedCategories,
    posts: normalizedPosts,
    socialLinks: normalizedSocialLinks,
    featuredDownloads:
      seedFeaturedDownloads?.length > 0 ? seedFeaturedDownloads : buildFeaturedDownloads(normalizedPosts),
  };
}

async function getDatabaseSnapshot() {
  const db = await getDatabase();
  const [categories, postsCollection, siteSettings] = await Promise.all([
    db.collection("categories").find({}).sort({ name: 1 }).toArray(),
    db.collection("posts").find({}).sort({ mood: 1, title: 1 }).toArray(),
    db.collection("siteSettings").findOne({ key: "primary" }),
  ]);

  const normalizedCategories = categories.map(normalizeCategory).filter(Boolean);
  const normalizedPosts = postsCollection.map(normalizePost).filter(Boolean);
  const normalizedSiteSettings = normalizeSiteSettings(siteSettings);

  if (!normalizedCategories.length || !normalizedPosts.length) {
    return getSeedSnapshot();
  }

  return {
    source: "database",
    categories: normalizedCategories,
    posts: normalizedPosts,
    socialLinks: normalizedSiteSettings.socialLinks.length
      ? normalizedSiteSettings.socialLinks
      : seedSocialLinks,
    featuredDownloads: buildFeaturedDownloads(normalizedPosts),
  };
}

export async function getContentSnapshot() {
  if (!isDatabaseConfigured()) {
    return getSeedSnapshot();
  }

  try {
    return await getDatabaseSnapshot();
  } catch (error) {
    console.warn("Falling back to seed content because the database request failed.", error);
    return getSeedSnapshot();
  }
}

export async function getCategories() {
  const snapshot = await getContentSnapshot();
  return snapshot.categories;
}

export async function getCategoryByMood(mood) {
  if (!mood) return null;

  const snapshot = await getContentSnapshot();
  return snapshot.categories.find((category) => category.mood === mood) ?? null;
}

export async function getPostsByMood(mood) {
  const snapshot = await getContentSnapshot();
  return snapshot.posts.filter((post) => post.mood === mood);
}

export async function getAllPosts() {
  const snapshot = await getContentSnapshot();
  return snapshot.posts;
}

export async function getFeaturedPost(mood) {
  const snapshot = await getContentSnapshot();
  return snapshot.posts.find((post) => post.mood === mood) ?? null;
}

export async function getFeaturedDownloads() {
  const snapshot = await getContentSnapshot();
  return snapshot.featuredDownloads;
}

export async function getSocialLinks() {
  const snapshot = await getContentSnapshot();
  return snapshot.socialLinks;
}

export async function seedDatabaseFromContent(content = getSeedSnapshot()) {
  const db = await getDatabase();

  await Promise.all([
    db.collection("categories").deleteMany({}),
    db.collection("posts").deleteMany({}),
  ]);

  if (content.categories.length) {
    await db.collection("categories").insertMany(content.categories);
  }

  if (content.posts.length) {
    await db.collection("posts").insertMany(content.posts);
  }

  await db.collection("siteSettings").updateOne(
    { key: "primary" },
    {
      $set: {
        key: "primary",
        socialLinks: content.socialLinks,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return {
    database: getDatabaseName(),
    categories: content.categories.length,
    posts: content.posts.length,
    socialLinks: content.socialLinks.length,
  };
}

export function getSeedContentSnapshot() {
  return getSeedSnapshot();
}
