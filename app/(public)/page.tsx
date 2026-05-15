import prisma from "@/lib/prisma";
import Hero from "@/components/public/Hero";
import Metrics from "@/components/public/Metrics";
import Featured from "@/components/public/Featured";
import PostsGrid from "@/components/public/PostsGrid";
import Newsletter from "@/components/public/Newsletter";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tag } = await searchParams;

  const tagFilter = typeof tag === "string" ? tag : undefined;

  const featured = await prisma.post.findFirst({
    where: { is_featured: 1 },
    orderBy: { id: "desc" },
  });

  const posts = await prisma.post.findMany({
    where: tagFilter ? { tag: tagFilter } : undefined,
    orderBy: { id: "desc" },
    take: 10,
  });

  return (
    <main>
      <Hero />
      <Metrics />
      {featured && <Featured post={featured} />}
      <PostsGrid posts={posts} />
      <Newsletter />
    </main>
  );
}
