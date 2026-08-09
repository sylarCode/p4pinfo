"use client";

import { useState } from "react";
import clsx from "clsx";
import { InspirationCard } from "@/components/InspirationCard";

type CategoryGroup = {
  category: {
    id: string;
    slug: string;
    name: string;
    description: string;
  };
  items: Array<{
    id: string;
    title: string;
    description: string;
    location: string;
    tags: Array<{ tag: { name: string } }>;
  }>;
};

type ViewMode = "vertical" | "horizontal";

export function ProfileCategories({
  groups,
  isOwnProfile,
}: {
  groups: CategoryGroup[];
  isOwnProfile: boolean;
}) {
  const [view, setView] = useState<ViewMode>("vertical");

  return (
    <div className="profile-categories">
      <div className="view-toggle" role="group" aria-label="Category layout">
        <span className="view-toggle__label">Categories</span>
        <div className="view-toggle__controls">
          <button
            type="button"
            className={clsx("view-toggle__btn", view === "vertical" && "is-active")}
            aria-pressed={view === "vertical"}
            onClick={() => setView("vertical")}
          >
            Vertical
          </button>
          <button
            type="button"
            className={clsx(
              "view-toggle__btn",
              view === "horizontal" && "is-active",
            )}
            aria-pressed={view === "horizontal"}
            onClick={() => setView("horizontal")}
          >
            Horizontal
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "category-board",
          view === "horizontal"
            ? "category-board--horizontal"
            : "category-board--vertical",
        )}
      >
        {groups.map(({ category, items }) => (
          <section
            key={category.id}
            className="category-block"
            id={category.slug}
          >
            <h2>{category.name}</h2>
            <p className="category-block__desc">{category.description}</p>
            {items.length ? (
              <div className="profile-grid">
                {items.map((item) => (
                  <InspirationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    location={item.location}
                    categoryName={category.name}
                    tags={item.tags.map((row) => row.tag.name)}
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state">
                {isOwnProfile
                  ? `Nothing under ${category.name} yet — add your first inspiration above.`
                  : `No ${category.name.toLowerCase()} shared yet.`}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
