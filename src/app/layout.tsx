import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
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
  title: "p4pinfo — see what inspires your people",
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
      <body className="min-h-full flex flex-col antialiased">
        <SiteHeader
          currentUsername={currentUser?.username}
          users={users}
        />
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          <div className="site-shell">
            <strong>p4pinfo</strong> — categories are curated by the creator;
            tags are yours.
          </div>
        </footer>
      </body>
    </html>
  );
}
