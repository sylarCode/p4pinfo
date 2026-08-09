import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AppSidebar } from "@/components/AppSidebar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "p4pinfo — get inspired by your favorite people",
  description:
    "Follow friends and browse the movies, books, restaurants, and useful items that inspire them.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUser, users] = await Promise.all([
    getCurrentUser(),
    prisma.user.findMany({
      select: { username: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        <div className="app-frame">
          <AppSidebar
            currentUser={
              currentUser
                ? {
                    username: currentUser.username,
                    name: currentUser.name,
                    bio: currentUser.bio,
                    avatarHue: currentUser.avatarHue,
                  }
                : null
            }
            users={users}
          />
          <div className="app-main">
            <header className="topbar">
              <div className="topbar__actions" aria-label="Quick actions">
                <button type="button" className="icon-btn" aria-label="Notifications">
                  <BellIcon />
                </button>
                <button type="button" className="icon-btn" aria-label="Saved">
                  <BookmarkIcon />
                </button>
              </div>
            </header>
            <main className="app-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.2a5.2 5.2 0 0 1 5.2 5.2v2.1c0 1.3.4 2.5 1.1 3.5l.7 1H5l.7-1c.7-1 1.1-2.2 1.1-3.5V8.4A5.2 5.2 0 0 1 12 3.2Zm-2.2 14.6h4.4a2.2 2.2 0 0 1-4.4 0Z"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M7.2 3.5h9.6c.8 0 1.4.6 1.4 1.4v15.1l-6.2-3.3-6.2 3.3V4.9c0-.8.6-1.4 1.4-1.4Z"
      />
    </svg>
  );
}
