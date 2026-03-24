import {
  getFeaturedDownloads,
  getSocialLinks,
} from "@/lib/content/repository";

export async function GET() {
  const [socialLinks, featuredDownloads] = await Promise.all([
    getSocialLinks(),
    getFeaturedDownloads(),
  ]);

  return Response.json({
    socialLinks,
    featuredDownloads,
  });
}
