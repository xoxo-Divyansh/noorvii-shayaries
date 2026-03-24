import CategoryGrid from "@/components/CategoryGrid";
import DownloadStudio from "@/components/DownloadStudio";
import Navbar from "@/components/Navbar";
import PostContainer from "@/components/PostContainer";
import ProfileHeader from "@/components/ProfileHeader";
import {
  getAllPosts,
  getCategories,
  getFeaturedDownloads,
  getFeaturedPost,
  getSocialLinks,
} from "@/lib/content/repository";

export default async function Home() {
  const [categories, featuredDownloads, featuredImagePost, featuredVideoPost, socialLinks, allPosts] =
    await Promise.all([
      getCategories(),
      getFeaturedDownloads(),
      getFeaturedPost("love"),
      getFeaturedPost("video-shayari"),
      getSocialLinks(),
      getAllPosts(),
    ]);

  return (
    <main className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-4 md:px-6">
      <Navbar socialLinks={socialLinks} />

      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-7 pb-12 pt-6 md:gap-9 md:pt-8">
        <ProfileHeader />
        <CategoryGrid categories={categories} />
        
        {/* All Posts Section */}
        <section className="space-y-5 mt-12 mb-16">
          <div className="text-center">
            <h2 className="font-[var(--font-playfair)] text-3xl text-[var(--foreground)] md:text-4xl">
              Explore All Poetry
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] md:text-base">
              Every feeling, every moment, in one place
            </p>
          </div>
          <PostContainer posts={allPosts} category={null} />
        </section>
        
        <DownloadStudio
          featuredDownloads={featuredDownloads}
          featuredImagePost={featuredImagePost}
          featuredVideoPost={featuredVideoPost}
        />
      </div>
    </main>
  );
}
