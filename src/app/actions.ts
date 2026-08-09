"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, setCurrentUsername } from "@/lib/session";
import { parseTagInput, slugify } from "@/lib/utils";

async function ensureTags(names: string[]) {
  const tags = [];
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    tags.push(tag);
  }
  return tags;
}

export async function switchUser(username: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("User not found");
  }
  await setCurrentUsername(username);
  revalidatePath("/");
  revalidatePath(`/u/${username}`);
}

export async function toggleFollow(targetUsername: string) {
  const me = await getCurrentUser();
  if (!me) throw new Error("Not signed in");

  const target = await prisma.user.findUnique({
    where: { username: targetUsername },
  });
  if (!target) throw new Error("User not found");
  if (target.id === me.id) throw new Error("Cannot follow yourself");

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: me.id,
        followingId: target.id,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: {
        followerId: me.id,
        followingId: target.id,
      },
    });
  }

  revalidatePath(`/u/${targetUsername}`);
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/");
}

export async function addInspiration(formData: FormData) {
  const me = await getCurrentUser();
  if (!me) throw new Error("Not signed in");

  const categoryId = String(formData.get("categoryId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const tagNames = parseTagInput(String(formData.get("tags") ?? ""));

  if (!categoryId || !title) {
    throw new Error("Category and title are required");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) throw new Error("Invalid category");

  const tags = await ensureTags(tagNames);

  await prisma.inspiration.create({
    data: {
      userId: me.id,
      categoryId,
      title,
      description,
      location,
      tags: {
        create: tags.map((tag) => ({ tagId: tag.id })),
      },
    },
  });

  revalidatePath(`/u/${me.username}`);
  revalidatePath("/");
}

export async function deleteInspiration(inspirationId: string) {
  const me = await getCurrentUser();
  if (!me) throw new Error("Not signed in");

  const item = await prisma.inspiration.findUnique({
    where: { id: inspirationId },
  });
  if (!item || item.userId !== me.id) {
    throw new Error("Not allowed");
  }

  await prisma.inspiration.delete({ where: { id: inspirationId } });
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/");
}
