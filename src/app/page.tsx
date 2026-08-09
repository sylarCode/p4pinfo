import Link from "next/link";
import { Suspense } from "react";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { CategoryPicker } from "@/components/CategoryPicker";
import { InspirationCard } from "@/components/InspirationCard";
import {
  getCategories,
  getPopularTags,
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

  const [categories, results, popularTags, people, currentUser] =
    await Promise.all([
      getCategories(),
      searchInspirations(params),
      getPopularTags(),
      prisma.user.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              inspirations: true,
              followers: true,
            },
          },
        },
      }),
      getCurrentUser(),
    ]);

  const followingIds = currentUser
    ? new Set(
        (
          await prisma.follow.findMany({
            where: { followerId: currentUser.id },
            select: { followingId: true },
          })
        ).map((row) => row.followingId),
      )
    : new Set<string>();

  const friends = people.filter((person) => followingIds.has(person.id));

  return (
    <>
      <section className="hero site-shell">
        <div className="hero__content">
          <p className="hero__brand">p4pinfo</p>
          <h1 className="hero__headline">
            Follow friends. See what sparks them.
          </h1>
          <p className="hero__support">
            Browse the movies, books, restaurants, and useful items your people
            keep coming back to — tagged the way they talk about them.
          </p>
          <div className="hero__cta">
            {currentUser ? (
              <Link className="btn btn--primary" href={`/u/${currentUser.username}`}>
                Open my profile
              </Link>
            ) : null}
            <a className="btn btn--ghost" href="#discover">
              Start discovering
            </a>
          </div>
        </div>

        <div className="search-panel" id="discover">
          <Suspense fallback={<div className="category-picker">Loading categories…</div>}>
            <CategoryPicker categories={categories} />
          </Suspense>
          <Suspense fallback={null}>
            <AdvancedSearch />
          </Suspense>
        </div>
      </section>

      <section className="section site-shell">
        <div className="section__head">
          <div>
            <h2>{hasFilters ? "Matches" : "Latest shares"}</h2>
            <p>
              {hasFilters
                ? "Filtered by the categories, tags, and places you chose."
                : "Recent inspirations from across p4pinfo."}
            </p>
          </div>
          {popularTags.length ? (
            <ul className="tag-list" aria-label="Popular tags">
              {popularTags.slice(0, 6).map((tag) => (
                <li key={tag.id}>
                  <Link href={`/?tags=${encodeURIComponent(tag.name)}`}>
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {results.length ? (
          <div className="results-grid">
            {results.map((item) => (
              <InspirationCard
                key={item.id}
                title={item.title}
                description={item.description}
                location={item.location}
                categoryName={item.category.name}
                tags={item.tags.map((row) => row.tag.name)}
                user={{
                  username: item.user.username,
                  name: item.user.name,
                }}
                showUser
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Nothing matched that search. Try another category, tag, or location.
          </p>
        )}
      </section>

      <section className="section site-shell">
        <div className="section__head">
          <div>
            <h2>{friends.length ? "People you follow" : "People on p4pinfo"}</h2>
            <p>Profiles organized by creator-managed categories.</p>
          </div>
        </div>
        <div className="people-row">
          {(friends.length ? friends : people).map((person) => (
            <Link
              key={person.id}
              href={`/u/${person.username}`}
              className="person-link"
            >
              <strong>{person.name}</strong>
              <span>@{person.username}</span>
              <span>
                {person._count.inspirations} inspirations ·{" "}
                {person._count.followers} followers
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
