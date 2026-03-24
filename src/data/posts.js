import seedContent from "./seed-content.cjs";

export const { socialLinks, categories } = seedContent;

const posts = seedContent.posts;

export function getCategoryByMood(mood) {
  return categories.find((category) => category.mood === mood);
}

export function getPostsByMood(mood) {
  return posts.filter((post) => post.mood === mood);
}

export function getFirstPostByType(type) {
  return posts.find((post) => post.type === type);
}

export function getFeaturedPost(mood) {
  return posts.find((post) => post.mood === mood);
}

export const featuredDownloads = [
  {
    id: "image",
    label: "Download Image",
    description: "Status-sized poster art from the featured love collection.",
    href: getFirstPostByType("image")?.image,
  },
  {
    id: "video",
    label: "Download Video",
    description: "Poster fallback for video shayari until motion assets are added.",
    href:
      getFirstPostByType("video")?.downloadHref ??
      getFirstPostByType("video")?.poster,
  },
  {
    id: "audio",
    label: "Download Audio",
    description: "Use the current mood track directly in stories or reels.",
    href: posts.find((post) => post.audio)?.audio,
  },
];

export default posts;
