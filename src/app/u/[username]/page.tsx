import Link from "next/link";
import { notFound } from "next/navigation";
import { AddInspirationForm } from "@/components/AddInspirationForm";
import { FollowButton } from "@/components/FollowButton";
import { ProfileCategories } from "@/components/ProfileCategories";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const [user, categories, currentUser] = await Promise.all([
    prisma.user.findUnique({
      where: { username },
      include: {
        inspirations: {
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            inspirations: true,
          },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    getCurrentUser(),
  ]);

  if (!user) notFound();

  const isOwnProfile = currentUser?.id === user.id;
  const isFollowing = currentUser
    ? Boolean(
        await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: user.id,
            },
          },
        }),
      )
    : false;

  const byCategory = categories.map((category) => ({
    category,
    items: user.inspirations.filter(
      (item) => item.categoryId === category.id,
    ),
  }));

  return (
    <div className="site-shell">
      <section className="profile-hero">
        <div className="profile-hero__top">
          <div>
            <div
              className="avatar"
              style={{
                background: `hsl(${user.avatarHue} 42% 32%)`,
              }}
              aria-hidden
            >
              {user.name.slice(0, 1)}
            </div>
            <h1>{user.name}</h1>
            <p className="profile-hero__handle">@{user.username}</p>
            {user.bio ? <p className="profile-hero__bio">{user.bio}</p> : null}
          </div>
          <div>
            {!isOwnProfile && currentUser ? (
              <FollowButton username={user.username} isFollowing={isFollowing} />
            ) : null}
            {isOwnProfile ? (
              <Link href="/#discover" className="btn btn--ghost">
                Discover more
              </Link>
            ) : null}
          </div>
        </div>

        <div className="profile-stats">
          <span>{user._count.inspirations} inspirations</span>
          <span>{user._count.followers} followers</span>
          <span>{user._count.following} following</span>
          {user.location ? <span>{user.location}</span> : null}
        </div>
      </section>

      {isOwnProfile ? <AddInspirationForm categories={categories} /> : null}

      <ProfileCategories groups={byCategory} isOwnProfile={isOwnProfile} />
    </div>
  );
}
