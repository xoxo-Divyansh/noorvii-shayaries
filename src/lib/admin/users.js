import "server-only";

import { ObjectId } from "mongodb";

import { isAdminRole } from "@/lib/admin/permissions";
import { getDatabase, isDatabaseConfigured } from "@/lib/db/mongodb";

const USERS_COLLECTION = "users";

let userIndexesPromise;

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function normalizeRole(role) {
  return isAdminRole(role) ? role : "";
}

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function normalizeAdminUser(user, { includePassword = false } = {}) {
  if (!user) {
    return null;
  }

  const normalizedUser = {
    _id: user._id?.toString?.() ?? "",
    email: normalizeEmail(user.email),
    role: normalizeRole(user.role),
    createdAt: user.createdAt?.toISOString?.() ?? "",
    updatedAt: user.updatedAt?.toISOString?.() ?? "",
  };

  if (includePassword) {
    normalizedUser.password = typeof user.password === "string" ? user.password : "";
  }

  return normalizedUser;
}

async function getUsersCollection() {
  if (!isDatabaseConfigured()) {
    throw new Error("MongoDB is not configured for admin users.");
  }

  const db = await getDatabase();

  if (!userIndexesPromise) {
    userIndexesPromise = db
      .collection(USERS_COLLECTION)
      .createIndex({ email: 1 }, { unique: true, name: "users_email_unique" })
      .catch((error) => {
        userIndexesPromise = null;
        throw error;
      });
  }

  await userIndexesPromise;

  return db.collection(USERS_COLLECTION);
}

export async function getAdminUserCount() {
  if (!isDatabaseConfigured()) {
    return 0;
  }

  const usersCollection = await getUsersCollection();
  return usersCollection.countDocuments();
}

export async function findAdminUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ email: normalizedEmail });

  return normalizeAdminUser(user, { includePassword: true });
}

export async function getAdminUserById(id) {
  const objectId = toObjectId(id);

  if (!objectId) {
    return null;
  }

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ _id: objectId });

  return normalizeAdminUser(user);
}

export function normalizeAdminEmail(email) {
  return normalizeEmail(email);
}
