"use client";

import { useTransition } from "react";
import { switchUser } from "@/app/actions";

type UserOption = {
  username: string;
  name: string;
};

export function ViewerSwitch({
  currentUsername,
  users,
}: {
  currentUsername?: string;
  users: UserOption[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="viewer-switch">
      <label htmlFor="viewer">Viewing as</label>
      <select
        id="viewer"
        name="username"
        defaultValue={currentUsername}
        disabled={pending}
        onChange={(event) => {
          const username = event.currentTarget.value;
          startTransition(async () => {
            await switchUser(username);
          });
        }}
      >
        {users.map((user) => (
          <option key={user.username} value={user.username}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}

