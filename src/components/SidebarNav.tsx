"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="sidebar__nav" aria-label="Primary">
      <Link
        href="/"
        className={clsx("sidebar__link", pathname === "/" && "is-active")}
      >
        <HomeIcon />
        <span>Home</span>
      </Link>
      <Link
        href="/friends"
        className={clsx(
          "sidebar__link",
          pathname.startsWith("/friends") && "is-active",
        )}
      >
        <FriendsIcon />
        <span>Friends</span>
      </Link>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.2 3.5 10.2V21h6.2v-6.1h4.6V21h6.2V10.2L12 3.2Z"
      />
    </svg>
  );
}

function FriendsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="currentColor"
        d="M8.5 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7.2-.4a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4ZM3.4 19.2c.4-2.8 2.7-4.6 5.1-4.6s4.7 1.8 5.1 4.6H3.4Zm10.1-.2c.3-1.5 1.1-2.8 2.2-3.6.7-.5 1.5-.8 2.4-.8 1.9 0 3.5 1.3 3.9 3.2h-8.5Z"
      />
    </svg>
  );
}
