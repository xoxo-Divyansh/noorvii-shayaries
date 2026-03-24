import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);
const PASSWORD_HASH_PREFIX = "scrypt";
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_HASH_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024,
};

export function isStoredAdminPasswordHash(value) {
  return typeof value === "string" && value.startsWith(`${PASSWORD_HASH_PREFIX}$`);
}

export async function hashAdminPassword(password) {
  if (typeof password !== "string" || !password) {
    throw new Error("Password is required.");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH, PASSWORD_HASH_OPTIONS);

  return `${PASSWORD_HASH_PREFIX}$${salt}$${Buffer.from(derivedKey).toString("hex")}`;
}

export async function verifyAdminPassword(password, storedPasswordHash) {
  if (typeof password !== "string" || !password || !isStoredAdminPasswordHash(storedPasswordHash)) {
    return false;
  }

  const [prefix, salt, hash] = storedPasswordHash.split("$");

  if (prefix !== PASSWORD_HASH_PREFIX || !salt || !hash) {
    return false;
  }

  try {
    const expectedHashBuffer = Buffer.from(hash, "hex");
    const derivedKey = await scrypt(
      password,
      salt,
      expectedHashBuffer.length || PASSWORD_KEY_LENGTH,
      PASSWORD_HASH_OPTIONS
    );
    const derivedKeyBuffer = Buffer.from(derivedKey);

    if (derivedKeyBuffer.length !== expectedHashBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedKeyBuffer, expectedHashBuffer);
  } catch {
    return false;
  }
}
