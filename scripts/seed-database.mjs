import { MongoClient } from "mongodb";

import seedContent from "../src/data/seed-content.cjs";

const { categories, posts, socialLinks } = seedContent;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "noorvi_shayari";

function normalizeCategory(category) {
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

async function main() {
  if (!uri) {
    throw new Error("Set MONGODB_URI before running npm run db:seed.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    await Promise.all([
      db.collection("categories").deleteMany({}),
      db.collection("posts").deleteMany({}),
    ]);

    await db.collection("categories").insertMany(categories.map(normalizeCategory));
    await db.collection("posts").insertMany(posts.map(normalizePost));
    await db.collection("siteSettings").updateOne(
      { key: "primary" },
      {
        $set: {
          key: "primary",
          socialLinks,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("Database seeded successfully.");
    console.log(
      JSON.stringify(
        {
          database: dbName,
          categories: categories.length,
          posts: posts.length,
          socialLinks: socialLinks.length,
        },
        null,
        2
      )
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Failed to seed database.");
  console.error(error);
  process.exit(1);
});
