import Link from "next/link";
import { SidebarNav } from "@/components/SidebarNav";
import { ViewerSwitch } from "@/components/ViewerSwitch";

type UserOption = {
  username: string;
  name: string;
};

type CurrentUser = {
  username: string;
  name: string;
  bio: string;
  avatarHue: number;
} | null;

export function AppSidebar({
  currentUser,
  users,
}: {
  currentUser: CurrentUser;
  users: UserOption[];
}) {
  const subtitle =
    currentUser?.bio?.trim() ||
    (currentUser ? `@${currentUser.username}` : "Browse inspirations");

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <Link href="/" className="sidebar__brand">
          p4pinfo
        </Link>

        {currentUser ? (
          <Link href={`/u/${currentUser.username}`} className="sidebar__user">
            <span
              className="sidebar__avatar"
              style={{ background: `hsl(${currentUser.avatarHue} 35% 36%)` }}
              aria-hidden
            >
              {currentUser.name.slice(0, 1)}
            </span>
            <span className="sidebar__user-text">
              <strong>{currentUser.name.split(" ")[0]}</strong>
              <span>{subtitle}</span>
            </span>
          </Link>
        ) : null}

        <SidebarNav />
      </div>

      <div className="sidebar__middle">
        {currentUser ? (
          <Link href={`/u/${currentUser.username}#add`} className="sidebar__cta">
            Share Update
          </Link>
        ) : null}
        <ViewerSwitch
          currentUsername={currentUser?.username}
          users={users}
        />
      </div>

      <div className="sidebar__bottom">
        <Link href="/settings" className="sidebar__muted">
          <SettingsIcon />
          Settings
        </Link>
        <Link href="/help" className="sidebar__muted">
          <HelpIcon />
          Help
        </Link>
      </div>
    </aside>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm8.2 2.7-1.5-.3a6.8 6.8 0 0 0-.6-1.4l.9-1.3-1.5-1.5-1.3.9c-.45-.25-.92-.45-1.4-.6l-.3-1.5h-2.2l-.3 1.5c-.48.15-.95.35-1.4.6l-1.3-.9-1.5 1.5.9 1.3c-.25.45-.45.92-.6 1.4l-1.5.3v2.2l1.5.3c.15.48.35.95.6 1.4l-.9 1.3 1.5 1.5 1.3-.9c.45.25.92.45 1.4.6l.3 1.5h2.2l.3-1.5c.48-.15.95-.35 1.4-.6l1.3.9 1.5-1.5-.9-1.3c.25-.45.45-.92.6-1.4l1.5-.3v-2.2Z"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Zm0 14.4a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm1.5-4.7-.7.4v.7h-1.6v-1.4l1.4-.8c.45-.25.7-.6.7-1.05 0-.7-.55-1.2-1.35-1.2-.8 0-1.35.45-1.45 1.15H8.8c.15-1.7 1.45-2.85 3.25-2.85 1.85 0 3.15 1.1 3.15 2.7 0 .9-.45 1.6-1.7 2.35Z"
      />
    </svg>
  );
}
