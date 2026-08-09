import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export default async function FriendsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <p className="empty-state">Sign in by choosing a viewer in the sidebar.</p>;
  }

  const following = await prisma.follow.findMany({
    where: { followerId: currentUser.id },
    include: {
      following: {
        include: {
          _count: {
            select: { inspirations: true, followers: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="simple-page">
      <h1>Friends</h1>
      <p>People you follow on p4pinfo.</p>
      <div className="people-row">
        {following.length ? (
          following.map(({ following: person }) => (
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
          ))
        ) : (
          <p className="empty-state">You’re not following anyone yet.</p>
        )}
      </div>
    </div>
  );
}
