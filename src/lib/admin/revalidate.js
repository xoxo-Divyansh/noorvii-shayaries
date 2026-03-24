import "server-only";

import { revalidatePath } from "next/cache";

function uniqueValues(values = []) {
  return [...new Set(values.filter(Boolean))];
}

export function revalidatePublicContent(moods = []) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/socials");
  revalidatePath("/admin/categories");

  uniqueValues(moods).forEach((mood) => {
    revalidatePath(`/category/${mood}`);
  });
}