import { getCategories } from "@/lib/content/repository";

export async function GET() {
  const categories = await getCategories();
  return Response.json({ categories });
}
