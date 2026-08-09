"use client";

import { FormEvent, type ReactNode, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

type Category = {
  slug: string;
  name: string;
};

const categoryIcons: Record<string, ReactNode> = {
  restaurants: <UtensilsIcon />,
  books: <BookIcon />,
  movies: <MovieIcon />,
  "useful-items": <ItemIcon />,
};

export function HomeSearch({
  categories,
  locations,
}: {
  categories: Category[];
  locations: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [advancedOpen, setAdvancedOpen] = useState(
    Boolean(searchParams.get("tags")),
  );
  const selectedCategory = searchParams.get("category") ?? "";

  function pushParams(next: URLSearchParams) {
    startTransition(() => {
      const query = next.toString();
      router.push(query ? `/?${query}` : "/");
    });
  }

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const q = String(form.get("q") ?? "").trim();
    if (q) params.set("q", q);
    else params.delete("q");
    pushParams(params);
  }

  function toggleCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!slug || selectedCategory === slug) params.delete("category");
    else params.set("category", slug);
    pushParams(params);
  }

  function onFilterChange(key: "location" | "category", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    pushParams(params);
  }

  function onAdvancedSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const tags = String(form.get("tags") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const categorySearch = String(form.get("categorySearch") ?? "").trim();

    if (tags) params.set("tags", tags);
    else params.delete("tags");
    if (location) params.set("location", location);
    else params.delete("location");
    if (categorySearch) params.set("category", categorySearch);

    pushParams(params);
  }

  return (
    <div className={clsx("home-search", pending && "is-pending")}>
      <h1 className="home-search__title">
        Get inspired by your favorite people.
      </h1>

      <form className="home-search__bar" onSubmit={onSearchSubmit}>
        <SearchIcon />
        <input
          name="q"
          placeholder="Search for places, books, or moments..."
          defaultValue={searchParams.get("q") ?? ""}
          aria-label="Search"
        />
      </form>

      <div className="home-search__categories" role="group" aria-label="Categories">
        {categories.map((category) => {
          const active = selectedCategory === category.slug;
          return (
            <button
              key={category.slug}
              type="button"
              className={clsx("category-pill", active && "is-active")}
              aria-pressed={active}
              onClick={() => toggleCategory(category.slug)}
            >
              <span className="category-pill__icon">
                {categoryIcons[category.slug] ?? <ItemIcon />}
              </span>
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="filter-bar">
        <label className="filter-select">
          <span className="sr-only">Location</span>
          <select
            value={searchParams.get("location") ?? ""}
            onChange={(event) => onFilterChange("location", event.target.value)}
          >
            <option value="">Any Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-select">
          <span className="sr-only">Type</span>
          <select
            value={selectedCategory}
            onChange={(event) => onFilterChange("category", event.target.value)}
          >
            <option value="">Any Type</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="advanced-filters-btn"
          aria-expanded={advancedOpen}
          onClick={() => setAdvancedOpen((value) => !value)}
        >
          <SlidersIcon />
          Advanced Filters
        </button>
      </div>

      {advancedOpen ? (
        <form className="advanced-panel" onSubmit={onAdvancedSubmit}>
          <label>
            <span>Category name</span>
            <input
              name="categorySearch"
              placeholder="Type a category if it’s not listed above"
              defaultValue={
                !categories.some((c) => c.slug === selectedCategory)
                  ? selectedCategory
                  : ""
              }
            />
          </label>
          <label>
            <span>Tags</span>
            <input
              name="tags"
              placeholder="beef tallow, animal based diet"
              defaultValue={searchParams.get("tags") ?? ""}
            />
          </label>
          <label>
            <span>Location</span>
            <input
              name="location"
              placeholder="Bali, Lisbon…"
              defaultValue={searchParams.get("location") ?? ""}
            />
          </label>
          <button type="submit" className="btn btn--primary">
            Apply filters
          </button>
        </form>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm7.4 11.1 3.2 3.2-1.4 1.4-3.2-3.2 1.4-1.4Z"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M4 6h10v2H4V6Zm12 0h4v2h-4V6ZM4 11h4v2H4v-2Zm6 0h10v2H10v-2ZM4 16h8v2H4v-2Zm10 0h6v2h-6v-2Z"
      />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M7 3v7.2c0 1.1-.7 2-1.7 2.3V21H3.8v-8.5C2.8 12.2 2 11.3 2 10.2V3h1.8v6.5H5V3H7Zm7.5 0c2.4 0 4.2 2 4.2 5.2 0 2.4-1.1 4.1-2.7 4.7V21h-1.8v-8.1c-1.6-.6-2.7-2.3-2.7-4.7C11.5 5 13.3 3 15.5 3Z"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M6.2 4.2c1.7-.7 3.5-.9 5.3-.5v14.2c-1.6-.5-3.3-.4-4.8.3l-.5.2V4.2Zm11.6 0v13.9l-.5-.2c-1.5-.7-3.2-.8-4.8-.3V3.7c1.8-.4 3.6-.2 5.3.5Z"
      />
    </svg>
  );
}

function MovieIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M3 5.5h18v13H3v-13Zm2 2v2.2l1.8-1.1L8.5 9.7V7.5H5Zm11.5 0v2.2l1.7-1.1 1.8 1.1V7.5h-3.5ZM5 14.3V16.5h3.5v-2.2L6.8 13l-1.8 1.3Zm11.5 0V16.5H20v-2.2L18.2 13l-1.7 1.3Z"
      />
    </svg>
  );
}

function ItemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M7.2 3.5h9.6l1.7 4.2H5.5L7.2 3.5ZM5.2 9.2h13.6v10.3H5.2V9.2Zm4.1 2.1v6.1h1.7v-6.1H9.3Zm3.8 0v6.1h1.7v-6.1h-1.7Z"
      />
    </svg>
  );
}
