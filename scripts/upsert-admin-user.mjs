import { MongoClient } from "mongodb";

import { hashAdminPassword } from "../src/lib/admin/passwords.js";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "noorvi_shayari";
const VALID_ROLES = new Set(["admin", "editor"]);

function readArg(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return "";
  }

  return process.argv[index + 1] ?? "";
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

async function main() {
  if (!uri) {
    throw new Error("Set MONGODB_URI before running npm run auth:create-user.");
  }

  const email = normalizeEmail(readArg("--email") || process.env.ADMIN_USER_EMAIL);
  const password = readArg("--password") || process.env.ADMIN_USER_PASSWORD || "";
  const role = (readArg("--role") || process.env.ADMIN_USER_ROLE || "editor")
    .trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Provide --email or ADMIN_USER_EMAIL.");
  }

  if (!password) {
    throw new Error("Provide --password or ADMIN_USER_PASSWORD.");
  }

  if (!VALID_ROLES.has(role)) {
    throw new Error("Role must be admin or editor.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const passwordHash = await hashAdminPassword(password);
    const timestamp = new Date();

    await db
      .collection("users")
      .createIndex({ email: 1 }, { unique: true, name: "users_email_unique" });

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          email,
          password: passwordHash,
          role,
          updatedAt: timestamp,
        },
        $setOnInsert: {
          createdAt: timestamp,
        },
      },
      { upsert: true }
    );

    const user = await db.collection("users").findOne(
      { email },
      {
        projection: {
          email: 1,
          role: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      }
    );

    console.log("Admin user upserted successfully.");
    console.log(
      JSON.stringify(
        {
          id: user?._id?.toString?.() ?? "",
          email: user?.email ?? email,
          role: user?.role ?? role,
          createdAt: user?.createdAt?.toISOString?.() ?? "",
          updatedAt: user?.updatedAt?.toISOString?.() ?? "",
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
  console.error("Failed to upsert admin user.");
  console.error(error);
  process.exit(1);
});
