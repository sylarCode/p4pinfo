"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import clsx from "clsx";

type Category = {
  slug: string;
  name: string;
};

export function CategoryPicker({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("category") ?? "";
  const [pending, startTransition] = useTransition();

  function selectCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!slug || selected === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    startTransition(() => {
      const query = params.toString();
      router.push(query ? `/?${query}` : "/");
    });
  }

  return (
    <div
      className={clsx("category-picker", pending && "is-pending")}
      role="group"
      aria-label="Categories"
    >
      {categories.map((category) => {
        const active = selected === category.slug;
        return (
          <button
            key={category.slug}
            type="button"
            className={clsx("category-chip", active && "is-active")}
            aria-pressed={active}
            onClick={() => selectCategory(category.slug)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
