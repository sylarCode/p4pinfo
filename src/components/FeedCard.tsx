import Link from "next/link";

type FeedCardProps = {
  title: string;
  description?: string;
  location?: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  user: {
    username: string;
    name: string;
    avatarHue: number;
  };
  likedByCount?: number;
};

const categoryImages: Record<string, string[]> = {
  restaurants: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  ],
  books: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
  ],
  movies: [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  ],
  "useful-items": [
    "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&w=900&q=80",
  ],
};

function CategoryGlyph({ slug }: { slug: string }) {
  if (slug === "restaurants") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M7 3v7.2c0 1.1-.7 2-1.7 2.3V21H3.8v-8.5C2.8 12.2 2 11.3 2 10.2V3h1.8v6.5H5V3H7Zm7.5 0c2.4 0 4.2 2 4.2 5.2 0 2.4-1.1 4.1-2.7 4.7V21h-1.8v-8.1c-1.6-.6-2.7-2.3-2.7-4.7C11.5 5 13.3 3 15.5 3Z"
        />
      </svg>
    );
  }
  if (slug === "books") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M6.2 4.2c1.7-.7 3.5-.9 5.3-.5v14.2c-1.6-.5-3.3-.4-4.8.3l-.5.2V4.2Zm11.6 0v13.9l-.5-.2c-1.5-.7-3.2-.8-4.8-.3V3.7c1.8-.4 3.6-.2 5.3.5Z"
        />
      </svg>
    );
  }
  if (slug === "movies") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M3 5.5h18v13H3v-13Zm2 2v2.2l1.8-1.1L8.5 9.7V7.5H5Zm11.5 0v2.2l1.7-1.1 1.8 1.1V7.5h-3.5Z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path
        fill="currentColor"
        d="M7.2 3.5h9.6l1.7 4.2H5.5L7.2 3.5ZM5.2 9.2h13.6v10.3H5.2V9.2Z"
      />
    </svg>
  );
}

export function FeedCard({
  title,
  description,
  location,
  categoryName,
  categorySlug,
  tags,
  user,
  likedByCount = 0,
}: FeedCardProps) {
  const images = categoryImages[categorySlug] ?? categoryImages.books;
  const dual = images.length > 1;

  return (
    <article className="feed-card">
      <div className="feed-card__header">
        <div className="feed-card__type">
          <CategoryGlyph slug={categorySlug} />
          <span>{categoryName}</span>
        </div>
        <div className="feed-card__social">
          <span
            className="feed-card__mini-avatar"
            style={{ background: `hsl(${user.avatarHue} 35% 36%)` }}
          >
            {user.name.slice(0, 1)}
          </span>
          <p>
            Liked by{" "}
            <Link href={`/u/${user.username}`}>{user.name.split(" ")[0]}</Link>
            {likedByCount > 0 ? ` and ${likedByCount} others` : ""}
          </p>
        </div>
      </div>

      <h3 className="feed-card__title">
        <Link href={`/u/${user.username}`}>{title}</Link>
      </h3>

      {description ? <p className="feed-card__body">{description}</p> : null}

      {tags.length ? (
        <ul className="feed-card__tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/?tags=${encodeURIComponent(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={dual ? "feed-card__media feed-card__media--dual" : "feed-card__media"}>
        {images.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>

      <div className="feed-card__footer">
        {location ? (
          <>
            <PinIcon />
            <span>{location}</span>
          </>
        ) : (
          <>
            <CategoryGlyph slug={categorySlug} />
            <span>
              {categoryName}
              {tags[0] ? ` • ${tags[0]}` : ""}
            </span>
          </>
        )}
      </div>
    </article>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.8c3.4 0 6.2 2.7 6.2 6.1 0 4.5-5.2 10.8-5.8 11.5l-.4.4-.4-.4C11 19.7 5.8 13.4 5.8 8.9 5.8 5.5 8.6 2.8 12 2.8Zm0 3.4a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z"
      />
    </svg>
  );
}
