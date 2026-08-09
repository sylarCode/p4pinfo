"use client";

import { useTransition } from "react";
import { toggleFollow } from "@/app/actions";

export function FollowButton({
  username,
  isFollowing,
}: {
  username: string;
  isFollowing: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={isFollowing ? "btn btn--ghost" : "btn btn--primary"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await toggleFollow(username);
        });
      }}
    >
      {pending ? "Updating…" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
