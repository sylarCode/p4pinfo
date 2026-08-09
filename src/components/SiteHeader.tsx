import Link from "next/link";
import { ViewerSwitch } from "@/components/ViewerSwitch";

type UserOption = {
  username: string;
  name: string;
};

export function SiteHeader({
  currentUsername,
  users,
}: {
  currentUsername?: string;
  users: UserOption[];
}) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark" aria-label="Kindled home">
          <span className="brand-mark__word">Kindled</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <Link href="/">Discover</Link>
          {currentUsername ? (
            <Link href={`/u/${currentUsername}`}>My profile</Link>
          ) : null}
        </nav>

        <ViewerSwitch currentUsername={currentUsername} users={users} />
      </div>
    </header>
  );
}
