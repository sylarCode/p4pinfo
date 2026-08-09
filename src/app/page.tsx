import { Suspense } from "react";
import { FeedCard } from "@/components/FeedCard";
import { HomeSearch } from "@/components/HomeSearch";
import {
  getCategories,
  searchInspirations,
  type SearchParams,
} from "@/lib/search";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasFilters = Boolean(
    params.category || params.tags || params.location || params.q,
  );

  const [categories, results, currentUser, locations] = await Promise.all([
    getCategories(),
    searchInspirations(params),
    getCurrentUser(),
    prisma.inspiration.findMany({
      where: { location: { not: "" } },
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" },
    }),
  ]);

  const followingIds = currentUser
    ? (
        await prisma.follow.findMany({
          where: { followerId: currentUser.id },
          select: { followingId: true },
        })
      ).map((row) => row.followingId)
    : [];

  const friendResults =
    !hasFilters && followingIds.length
      ? results.filter((item) => followingIds.includes(item.userId))
      : results;

  const feed = (friendResults.length ? friendResults : results).slice(0, 24);

  const followerCounts = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { followingId: true },
  });
  const followerMap = new Map(
    followerCounts.map((row) => [row.followingId, row._count.followingId]),
  );

  return (
    <div className="home-page">
      <Suspense fallback={<div className="home-search__title">Loading…</div>}>
        <HomeSearch
          categories={categories}
          locations={locations.map((row) => row.location)}
        />
      </Suspense>

      <section className="feed-section">
        <h2 className="feed-section__title">
          {hasFilters ? "Matches" : "Your friends like:"}
        </h2>

        {feed.length ? (
          <div className="feed-grid">
            {feed.map((item) => (
              <FeedCard
                key={item.id}
                title={item.title}
                description={item.description}
                location={item.location}
                categoryName={item.category.name}
                categorySlug={item.category.slug}
                tags={item.tags.map((row) => row.tag.name)}
                user={{
                  username: item.user.username,
                  name: item.user.name,
                  avatarHue: item.user.avatarHue,
                }}
                likedByCount={Math.max(
                  0,
                  (followerMap.get(item.userId) ?? 1) - 1,
                )}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Nothing matched that search. Try another category, tag, or location.
          </p>
        )}
      </section>
    </div>
  );
}
