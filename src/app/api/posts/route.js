import { getContentSnapshot, getPostsByMood } from "@/lib/content/repository";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get("mood");

  if (mood) {
    const posts = await getPostsByMood(mood);
    return Response.json({ posts });
  }

  const snapshot = await getContentSnapshot();
  return Response.json({ posts: snapshot.posts });
}
