import crypto from "node:crypto";

import { isAdminRole } from "@/lib/admin/permissions";

export const ADMIN_COOKIE_NAME = "noorvi-admin-session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const ADMIN_SESSION_SCOPE = "noorvi-dashboard";
const ADMIN_SESSION_VERSION = 1;

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function signValue(value) {
  return crypto.createHmac("sha256", getAdminSecret()).update(value).digest("hex");
}

export function hasAdminSessionSecret() {
  return Boolean(getAdminSecret());
}

export function createAdminSessionValue(session) {
  if (!hasAdminSessionSecret() || !session?.userId || !isAdminRole(session.role)) {
    return "";
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      v: ADMIN_SESSION_VERSION,
      sub: session.userId,
      role: session.role,
      scope: ADMIN_SESSION_SCOPE,
      iat: now,
      exp: now + ADMIN_SESSION_MAX_AGE,
    }),
    "utf8"
  ).toString("base64url");

  return `${payload}.${signValue(payload)}`;
}

function readAdminSessionPayload(payload) {
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (
      decoded?.v !== ADMIN_SESSION_VERSION ||
      decoded?.scope !== ADMIN_SESSION_SCOPE ||
      typeof decoded?.sub !== "string" ||
      !isAdminRole(decoded?.role) ||
      typeof decoded?.exp !== "number"
    ) {
      return null;
    }

    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      userId: decoded.sub,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function readAdminSessionValue(sessionValue) {
  if (!hasAdminSessionSecret() || typeof sessionValue !== "string" || !sessionValue) {
    return null;
  }

  const [payload, signature] = sessionValue.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signValue(payload);

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  const isValidSignature = crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expectedSignature, "utf8")
  );

  if (!isValidSignature) {
    return null;
  }

  return readAdminSessionPayload(payload);
}

export function verifyAdminSessionValue(sessionValue) {
  return Boolean(readAdminSessionValue(sessionValue));
}
