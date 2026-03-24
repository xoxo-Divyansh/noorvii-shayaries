import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "noorvi_shayari";

let client;
let clientPromise;

if (process.env.NODE_ENV === "development" && uri) {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else if (uri) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export function isDatabaseConfigured() {
  return Boolean(uri);
}

export async function getDatabase() {
  if (!uri || !clientPromise) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const resolvedClient = await clientPromise;
  return resolvedClient.db(dbName);
}

export function getDatabaseName() {
  return dbName;
}
