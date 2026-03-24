import Link from "next/link";
import { notFound } from "next/navigation";

import PostContainer from "@/components/PostContainer";
import {
  getCategories,
  getCategoryByMood,
  getPostsByMood,
} from "@/lib/content/repository";

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    mood: category.mood,
  }));
}

export async function generateMetadata({ params }) {
  const { mood } = await params;
  const category = await getCategoryByMood(mood);

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} | Noorvi Poetry & Moments`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { mood } = await params;
  const [category, filteredPosts] = await Promise.all([
    getCategoryByMood(mood),
    getPostsByMood(mood),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-5">
        <section
          className="paper-panel-strong rounded-[2.2rem] px-5 py-5 shadow-[0_24px_80px_rgba(124,82,60,0.12)] md:px-8 md:py-7"
          style={{
            boxShadow: `0 24px 80px ${category.shadow}`,
          }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/75 px-4 py-2 text-sm font-medium text-[var(--foreground)]"
              >
                Back to Home
              </Link>
              <div
                className="inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]"
                style={{
                  backgroundColor: category.surface,
                  color: category.accent,
                }}
              >
                {category.name}
              </div>
              <h1 className="font-[var(--font-playfair)] text-3xl text-[var(--foreground)] md:text-5xl">
                {category.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
                {category.description}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-[var(--muted)] md:text-right">
              <span>Swipe to explore all shayari below</span>
              <span>Tap sound button to enable audio</span>
            </div>
          </div>
        </section>

        <PostContainer category={category} posts={filteredPosts} />
      </div>
    </main>
  );
}
