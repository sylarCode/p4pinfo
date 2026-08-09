import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "p4p_user";

export async function getCurrentUser() {
  const jar = await cookies();
  const username = jar.get(SESSION_COOKIE)?.value;
  if (!username) {
    return prisma.user.findUnique({ where: { username: "maya" } });
  }
  return prisma.user.findUnique({ where: { username } });
}

export async function setCurrentUsername(username: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}
