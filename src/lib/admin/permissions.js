export const ADMIN_ROLES = Object.freeze({
  ADMIN: "admin",
  EDITOR: "editor",
});

export const ADMIN_PERMISSIONS = Object.freeze({
  VIEW_DASHBOARD: "viewDashboard",
  MANAGE_POSTS: "managePosts",
  DELETE_POSTS: "deletePosts",
  MANAGE_CATEGORIES: "manageCategories",
  MANAGE_SOCIALS: "manageSocials",
  MANAGE_USERS: "manageUsers",
});

const ROLE_PERMISSIONS = {
  [ADMIN_ROLES.ADMIN]: new Set(Object.values(ADMIN_PERMISSIONS)),
  [ADMIN_ROLES.EDITOR]: new Set([
    ADMIN_PERMISSIONS.VIEW_DASHBOARD,
    ADMIN_PERMISSIONS.MANAGE_POSTS,
  ]),
};

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Overview",
    permission: ADMIN_PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    href: "/admin/posts",
    label: "Posts",
    permission: ADMIN_PERMISSIONS.MANAGE_POSTS,
  },
  {
    href: "/admin/socials",
    label: "Socials",
    permission: ADMIN_PERMISSIONS.MANAGE_SOCIALS,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    permission: ADMIN_PERMISSIONS.MANAGE_CATEGORIES,
  },
];

function normalizeRole(role) {
  return typeof role === "string" ? role.trim().toLowerCase() : "";
}

export function isAdminRole(role) {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === ADMIN_ROLES.ADMIN || normalizedRole === ADMIN_ROLES.EDITOR;
}

export function hasAdminPermission(role, permission = ADMIN_PERMISSIONS.VIEW_DASHBOARD) {
  const normalizedRole = normalizeRole(role);

  if (!isAdminRole(normalizedRole)) {
    return false;
  }

  if (!permission) {
    return true;
  }

  return ROLE_PERMISSIONS[normalizedRole]?.has(permission) ?? false;
}

export function getAdminNavigation(role) {
  return NAV_ITEMS.filter((item) => hasAdminPermission(role, item.permission));
}

export function getAdminRoleLabel(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === ADMIN_ROLES.ADMIN) {
    return "Super Admin";
  }

  if (normalizedRole === ADMIN_ROLES.EDITOR) {
    return "Content Manager";
  }

  return "Unknown Role";
}

export function getRequiredAdminPermission(pathname, method = "GET") {
  const normalizedPathname = typeof pathname === "string" ? pathname : "";
  const normalizedMethod = typeof method === "string" ? method.toUpperCase() : "GET";

  if (!normalizedPathname.startsWith("/admin") && !normalizedPathname.startsWith("/api/admin")) {
    return null;
  }

  if (
    normalizedPathname === "/admin" ||
    normalizedPathname === "/api/admin" ||
    normalizedPathname === "/admin/login"
  ) {
    return ADMIN_PERMISSIONS.VIEW_DASHBOARD;
  }

  if (
    normalizedPathname.startsWith("/admin/posts") ||
    normalizedPathname.startsWith("/api/admin/posts")
  ) {
    return normalizedMethod === "DELETE"
      ? ADMIN_PERMISSIONS.DELETE_POSTS
      : ADMIN_PERMISSIONS.MANAGE_POSTS;
  }

  if (
    normalizedPathname.startsWith("/admin/categories") ||
    normalizedPathname.startsWith("/api/admin/categories")
  ) {
    return ADMIN_PERMISSIONS.MANAGE_CATEGORIES;
  }

  if (
    normalizedPathname.startsWith("/admin/socials") ||
    normalizedPathname.startsWith("/api/admin/socials")
  ) {
    return ADMIN_PERMISSIONS.MANAGE_SOCIALS;
  }

  if (
    normalizedPathname.startsWith("/admin/users") ||
    normalizedPathname.startsWith("/api/admin/users")
  ) {
    return ADMIN_PERMISSIONS.MANAGE_USERS;
  }

  return ADMIN_PERMISSIONS.VIEW_DASHBOARD;
}
