import "server-only";

import { ObjectId } from "mongodb";

import { getDatabase, isDatabaseConfigured } from "@/lib/db/mongodb";

const POST_TYPES = new Set(["image", "text", "video"]);

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ensureDatabaseConfigured() {
  if (!isDatabaseConfigured()) {
    throw new Error("MongoDB is not configured for admin operations.");
  }
}

async function getAdminDatabase() {
  ensureDatabaseConfigured();
  return getDatabase();
}

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function normalizeAdminCategory(category) {
  if (!category) return null;

  return {
    _id: category._id?.toString?.() ?? "",
    mood: cleanString(category.mood),
    name: cleanString(category.name),
    title: cleanString(category.title),
    description: cleanString(category.description),
    icon: cleanString(category.icon),
    previewImage: cleanString(category.previewImage),
    accent: cleanString(category.accent),
    surface: cleanString(category.surface),
    shadow: cleanString(category.shadow),
    updatedAt: category.updatedAt?.toISOString?.() ?? "",
  };
}

function normalizeAdminPost(post) {
  if (!post) return null;

  return {
    _id: post._id?.toString?.() ?? "",
    id: cleanString(post.id),
    type: cleanString(post.type),
    mood: cleanString(post.mood),
    title: cleanString(post.title),
    text: cleanString(post.text),
    image: cleanString(post.image),
    video: cleanString(post.video),
    poster: cleanString(post.poster),
    audio: cleanString(post.audio),
    downloadHref: cleanString(post.downloadHref),
    downloadLabel: cleanString(post.downloadLabel),
    featured: Boolean(post.featured),
    authorId: post.authorId?.toString?.() ?? "",
    updatedById: post.updatedById?.toString?.() ?? "",
    createdAt: post.createdAt?.toISOString?.() ?? "",
    updatedAt: post.updatedAt?.toISOString?.() ?? "",
  };
}

function normalizeAdminSocialLink(link, index = 0) {
  if (!link) return null;

  const name = cleanString(link.name);

  return {
    id: cleanString(link.id) || slugify(name || `social-${index + 1}`),
    name,
    href: cleanString(link.href),
    icon: cleanString(link.icon),
  };
}

function validateRequired(value, label) {
  if (!cleanString(value)) {
    throw new Error(`${label} is required.`);
  }
}

async function getKnownMoods(db) {
  const categories = await db
    .collection("categories")
    .find({}, { projection: { mood: 1 } })
    .toArray();

  return new Set(categories.map((category) => cleanString(category.mood)).filter(Boolean));
}

async function createUniquePostId(db, mood, title) {
  const base = `${slugify(mood)}-${slugify(title) || "post"}`;
  let candidate = base;
  let counter = 2;

  while (await db.collection("posts").findOne({ id: candidate }, { projection: { _id: 1 } })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function buildPostPayload(db, input, existingPost = null, actorUserId = null) {
  const type = cleanString(input.type);
  const mood = cleanString(input.mood);
  const title = cleanString(input.title);
  const text = cleanString(input.text);
  const image = cleanString(input.image);
  const video = cleanString(input.video);
  const poster = cleanString(input.poster);
  const audio = cleanString(input.audio);
  const downloadHref = cleanString(input.downloadHref);
  const downloadLabel = cleanString(input.downloadLabel);
  const featured = Boolean(input.featured);
  const actorObjectId = toObjectId(actorUserId);

  validateRequired(type, "Post type");
  validateRequired(mood, "Category");
  validateRequired(title, "Title");
  validateRequired(text, "Post text");

  if (!POST_TYPES.has(type)) {
    throw new Error("Post type must be image, text, or video.");
  }

  const moods = await getKnownMoods(db);

  if (!moods.has(mood)) {
    throw new Error("Choose an existing category before saving the post.");
  }

  if (type === "image" && !image) {
    throw new Error("Image posts need an image path.");
  }

  if (type === "video" && !video && !poster) {
    throw new Error("Video posts need either a video path or a poster path.");
  }

  return {
    id: existingPost?.id || (await createUniquePostId(db, mood, title)),
    type,
    mood,
    title,
    text,
    image,
    video,
    poster,
    audio,
    downloadHref,
    downloadLabel,
    featured,
    authorId: existingPost?.authorId || actorObjectId || null,
    updatedById:
      actorObjectId || existingPost?.updatedById || existingPost?.authorId || null,
    createdAt: existingPost?.createdAt || new Date(),
    updatedAt: new Date(),
  };
}

function buildCategoryPayload(input, existingCategory) {
  if (!existingCategory) {
    throw new Error("Category not found.");
  }

  const name = cleanString(input.name);
  const title = cleanString(input.title);
  const description = cleanString(input.description);
  const icon = cleanString(input.icon);
  const previewImage = cleanString(input.previewImage);
  const accent = cleanString(input.accent);
  const surface = cleanString(input.surface);
  const shadow = cleanString(input.shadow);

  validateRequired(name, "Category name");
  validateRequired(title, "Category title");
  validateRequired(description, "Category description");
  validateRequired(icon, "Category icon");
  validateRequired(previewImage, "Preview image");
  validateRequired(accent, "Accent color");
  validateRequired(surface, "Surface color");
  validateRequired(shadow, "Shadow color");

  return {
    mood: existingCategory.mood,
    name,
    title,
    description,
    icon,
    previewImage,
    accent,
    surface,
    shadow,
    updatedAt: new Date(),
  };
}

function buildSocialLinkPayload(input, existingLink) {
  if (!existingLink) {
    throw new Error("Social link not found.");
  }

  const name = cleanString(input.name);
  const href = cleanString(input.href);
  const icon = cleanString(input.icon);

  validateRequired(name, "Platform name");
  validateRequired(href, "Social URL");
  validateRequired(icon, "Icon path");

  return {
    id: existingLink.id,
    name,
    href,
    icon,
  };
}

async function getSiteSettings(db) {
  return (
    (await db.collection("siteSettings").findOne({ key: "primary" })) ?? {
      key: "primary",
      socialLinks: [],
    }
  );
}

export async function getAdminPosts() {
  const db = await getAdminDatabase();
  const posts = await db.collection("posts").find({}).sort({ updatedAt: -1, title: 1 }).toArray();
  return posts.map(normalizeAdminPost).filter(Boolean);
}

export async function getAdminPostById(id) {
  const db = await getAdminDatabase();
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const post = await db.collection("posts").findOne({ _id: objectId });
  return normalizeAdminPost(post);
}

export async function createAdminPost(input, session = null) {
  const db = await getAdminDatabase();
  const payload = await buildPostPayload(db, input, null, session?.userId);
  const result = await db.collection("posts").insertOne(payload);
  const createdPost = await db.collection("posts").findOne({ _id: result.insertedId });
  return normalizeAdminPost(createdPost);
}

export async function updateAdminPost(id, input, session = null) {
  const db = await getAdminDatabase();
  const objectId = toObjectId(id);

  if (!objectId) {
    throw new Error("Invalid post id.");
  }

  const existingPost = await db.collection("posts").findOne({ _id: objectId });

  if (!existingPost) {
    throw new Error("Post not found.");
  }

  const payload = await buildPostPayload(db, input, existingPost, session?.userId);

  await db.collection("posts").updateOne({ _id: objectId }, { $set: payload });

  const updatedPost = await db.collection("posts").findOne({ _id: objectId });
  return normalizeAdminPost(updatedPost);
}

export async function deleteAdminPost(id) {
  const db = await getAdminDatabase();
  const objectId = toObjectId(id);

  if (!objectId) {
    throw new Error("Invalid post id.");
  }

  const existingPost = await db.collection("posts").findOne({ _id: objectId });

  if (!existingPost) {
    throw new Error("Post not found.");
  }

  await db.collection("posts").deleteOne({ _id: objectId });

  return normalizeAdminPost(existingPost);
}

export async function getAdminCategories() {
  const db = await getAdminDatabase();
  const categories = await db.collection("categories").find({}).sort({ name: 1 }).toArray();
  return categories.map(normalizeAdminCategory).filter(Boolean);
}

export async function updateAdminCategory(mood, input) {
  const db = await getAdminDatabase();
  const normalizedMood = cleanString(mood);

  if (!normalizedMood) {
    throw new Error("Invalid category mood.");
  }

  const existingCategory = await db.collection("categories").findOne({ mood: normalizedMood });

  if (!existingCategory) {
    throw new Error("Category not found.");
  }

  const payload = buildCategoryPayload(input, existingCategory);

  await db.collection("categories").updateOne({ mood: normalizedMood }, { $set: payload });

  const updatedCategory = await db.collection("categories").findOne({ mood: normalizedMood });
  return normalizeAdminCategory(updatedCategory);
}

export async function getAdminSocialLinks() {
  const db = await getAdminDatabase();
  const settings = await getSiteSettings(db);

  return (settings.socialLinks || []).map(normalizeAdminSocialLink).filter(Boolean);
}

export async function updateAdminSocialLink(id, input) {
  const db = await getAdminDatabase();
  const settings = await getSiteSettings(db);
  const currentLinks = (settings.socialLinks || []).map(normalizeAdminSocialLink).filter(Boolean);
  const normalizedId = cleanString(id);
  const index = currentLinks.findIndex((link) => link.id === normalizedId);

  if (index === -1) {
    throw new Error("Social link not found.");
  }

  currentLinks[index] = buildSocialLinkPayload(input, currentLinks[index]);

  await db.collection("siteSettings").updateOne(
    { key: "primary" },
    {
      $set: {
        key: "primary",
        socialLinks: currentLinks,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return currentLinks[index];
}
