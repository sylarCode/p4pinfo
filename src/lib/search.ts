import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export type SearchParams = {
  category?: string;
  tags?: string;
  location?: string;
  q?: string;
};

export async function searchInspirations(params: SearchParams) {
  const categorySlug = params.category?.trim().toLowerCase() || undefined;
  const location = params.location?.trim() || undefined;
  const query = params.q?.trim() || undefined;
  const tagSlugs = (params.tags ?? "")
    .split(",")
    .map((tag) => slugify(tag))
    .filter(Boolean);

  return prisma.inspiration.findMany({
    where: {
      AND: [
        categorySlug
          ? {
              category: {
                OR: [
                  { slug: categorySlug },
                  { name: { contains: categorySlug } },
                ],
              },
            }
          : {},
        location
          ? {
              location: { contains: location },
            }
          : {},
        tagSlugs.length
          ? {
              AND: tagSlugs.map((slug) => ({
                tags: {
                  some: {
                    tag: {
                      OR: [
                        { slug },
                        { name: { contains: slug.replace(/-/g, " ") } },
                      ],
                    },
                  },
                },
              })),
            }
          : {},
        query
          ? {
              OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { location: { contains: query } },
                {
                  tags: {
                    some: {
                      tag: { name: { contains: query } },
                    },
                  },
                },
                {
                  category: {
                    OR: [
                      { name: { contains: query } },
                      { slug: { contains: slugify(query) } },
                    ],
                  },
                },
                {
                  user: {
                    OR: [
                      { name: { contains: query } },
                      { username: { contains: query } },
                    ],
                  },
                },
              ],
            }
          : {},
      ],
    },
    include: {
      user: true,
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 60,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPopularTags(limit = 12) {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { inspirations: true } },
    },
    orderBy: {
      inspirations: { _count: "desc" },
    },
    take: limit,
  });
  return tags;
}
