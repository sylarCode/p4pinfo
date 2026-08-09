import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { slugify } from "../src/lib/utils";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function upsertTag(name: string) {
  const slug = slugify(name);
  return prisma.tag.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
}

async function main() {
  await prisma.inspirationTag.deleteMany();
  await prisma.inspiration.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all(
    [
      {
        slug: "movies",
        name: "Movies",
        description: "Films that stick with you long after the credits.",
        sortOrder: 1,
      },
      {
        slug: "books",
        name: "Books",
        description: "Stories and ideas worth passing along.",
        sortOrder: 2,
      },
      {
        slug: "restaurants",
        name: "Restaurants",
        description: "Tables worth traveling for.",
        sortOrder: 3,
      },
      {
        slug: "useful-items",
        name: "Useful Items",
        description: "Purchases that earned their keep.",
        sortOrder: 4,
      },
    ].map((category) =>
      prisma.category.create({
        data: category,
      }),
    ),
  );

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const maya = await prisma.user.create({
    data: {
      username: "maya",
      name: "Maya Chen",
      bio: "Chasing flavor, paperbacks, and quiet cinema.",
      location: "Bali, Indonesia",
      avatarHue: 168,
    },
  });

  const leo = await prisma.user.create({
    data: {
      username: "leo",
      name: "Leo Hart",
      bio: "Collecting tools, trails, and late-night reads.",
      location: "Portland, OR",
      avatarHue: 28,
    },
  });

  const noor = await prisma.user.create({
    data: {
      username: "noor",
      name: "Noor Alavi",
      bio: "Design-minded omnivore. Always tagging the good stuff.",
      location: "Lisbon, Portugal",
      avatarHue: 210,
    },
  });

  await prisma.follow.createMany({
    data: [
      { followerId: maya.id, followingId: leo.id },
      { followerId: maya.id, followingId: noor.id },
      { followerId: leo.id, followingId: maya.id },
      { followerId: noor.id, followingId: maya.id },
    ],
  });

  async function addInspiration(input: {
    userId: string;
    categorySlug: string;
    title: string;
    description?: string;
    location?: string;
    tags: string[];
  }) {
    const tags = await Promise.all(input.tags.map(upsertTag));
    return prisma.inspiration.create({
      data: {
        userId: input.userId,
        categoryId: bySlug[input.categorySlug].id,
        title: input.title,
        description: input.description ?? "",
        location: input.location ?? "",
        tags: {
          create: tags.map((tag) => ({ tagId: tag.id })),
        },
      },
    });
  }

  await addInspiration({
    userId: maya.id,
    categorySlug: "restaurants",
    title: "The Meat Emporium",
    description:
      "Wood-fired cuts and rendered fat done with conviction. Go hungry.",
    location: "Bali, Indonesia",
    tags: ["beef tallow", "animal based diet", "wood fired"],
  });

  await addInspiration({
    userId: maya.id,
    categorySlug: "books",
    title: "The Overstory",
    description: "A novel that rewires how you look at trees.",
    location: "",
    tags: ["fiction", "nature", "slow burn"],
  });

  await addInspiration({
    userId: maya.id,
    categorySlug: "movies",
    title: "Perfect Days",
    description: "Quiet beauty in ordinary routines.",
    location: "Tokyo, Japan",
    tags: ["contemplative", "slice of life"],
  });

  await addInspiration({
    userId: maya.id,
    categorySlug: "useful-items",
    title: "Opinel No.8 Carbon",
    description: "Pocket knife that feels like an heirloom from day one.",
    location: "",
    tags: ["everyday carry", "kitchen", "durable"],
  });

  await addInspiration({
    userId: leo.id,
    categorySlug: "books",
    title: "Braiding Sweetgrass",
    description: "Science and gratitude braided into one practice.",
    tags: ["nonfiction", "ecology", "gift-worthy"],
  });

  await addInspiration({
    userId: leo.id,
    categorySlug: "useful-items",
    title: "Filson Tin Cloth Jacket",
    description: "Heavy, waxed, and built for weather that means it.",
    location: "Portland, OR",
    tags: ["outerwear", "workwear", "rain"],
  });

  await addInspiration({
    userId: leo.id,
    categorySlug: "movies",
    title: "The Bear (Season 2)",
    description: "Kitchen chaos as character study.",
    tags: ["food", "intensity", "series"],
  });

  await addInspiration({
    userId: noor.id,
    categorySlug: "restaurants",
    title: "Cervejaria Ramiro",
    description: "Seafood counter energy. Order the percebes.",
    location: "Lisbon, Portugal",
    tags: ["seafood", "classic", "late night"],
  });

  await addInspiration({
    userId: noor.id,
    categorySlug: "books",
    title: "Atomic Habits",
    description: "Practical systems without the fluff.",
    tags: ["self-improvement", "systems"],
  });

  await addInspiration({
    userId: noor.id,
    categorySlug: "useful-items",
    title: "Traveler's Notebook",
    description: "Refillable notebook that makes packing lists feel ceremonial.",
    location: "Lisbon, Portugal",
    tags: ["stationery", "travel", "analog"],
  });

  console.log("Seeded Kindled with 4 creator categories and demo users.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
