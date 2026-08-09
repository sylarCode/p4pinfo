"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(
    Boolean(
      searchParams.get("tags") ||
        searchParams.get("location") ||
        searchParams.get("categorySearch"),
    ),
  );
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    const categorySearch = String(form.get("categorySearch") ?? "").trim();
    const tags = String(form.get("tags") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const q = String(form.get("q") ?? "").trim();

    const knownCategories = new Set([
      "movies",
      "books",
      "restaurants",
      "useful-items",
    ]);
    if (categorySearch) {
      params.set("category", categorySearch);
    } else if (!knownCategories.has(params.get("category") ?? "")) {
      // Clear free-text category searches when the field is emptied;
      // keep chip selections from the picker above.
      params.delete("category");
    }

    if (tags) params.set("tags", tags);
    else params.delete("tags");

    if (location) params.set("location", location);
    else params.delete("location");

    if (q) params.set("q", q);
    else params.delete("q");

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `/?${query}` : "/");
    });
  }

  return (
    <div className="advanced-search">
      <button
        type="button"
        className="advanced-search__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Advanced search</span>
        <span className="advanced-search__hint">
          categories · tags · location
        </span>
      </button>

      {open ? (
        <form className="advanced-search__form" onSubmit={onSubmit}>
          <label>
            <span>Category name</span>
            <input
              name="categorySearch"
              placeholder="Type a category if it’s not listed above"
              defaultValue={
                !["movies", "books", "restaurants", "useful-items"].includes(
                  searchParams.get("category") ?? "",
                )
                  ? (searchParams.get("category") ?? "")
                  : ""
              }
            />
          </label>
          <label>
            <span>Tags</span>
            <input
              name="tags"
              placeholder="Comma-separated, e.g. beef tallow, animal based diet"
              defaultValue={searchParams.get("tags") ?? ""}
            />
          </label>
          <label>
            <span>Location</span>
            <input
              name="location"
              placeholder="Bali, Lisbon, Portland…"
              defaultValue={searchParams.get("location") ?? ""}
            />
          </label>
          <label className="advanced-search__wide">
            <span>Keyword</span>
            <input
              name="q"
              placeholder="Search titles, people, notes…"
              defaultValue={searchParams.get("q") ?? ""}
            />
          </label>
          <div className="advanced-search__actions">
            <button type="submit" className="btn btn--primary" disabled={pending}>
              {pending ? "Searching…" : "Search Kindled"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
