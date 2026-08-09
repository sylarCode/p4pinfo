import Link from "next/link";

type InspirationCardProps = {
  title: string;
  description?: string;
  location?: string;
  categoryName: string;
  tags: string[];
  user?: {
    username: string;
    name: string;
  };
  showUser?: boolean;
};

export function InspirationCard({
  title,
  description,
  location,
  categoryName,
  tags,
  user,
  showUser = false,
}: InspirationCardProps) {
  return (
    <article className="inspiration">
      <div className="inspiration__meta">
        <span className="inspiration__category">{categoryName}</span>
        {location ? <span className="inspiration__location">{location}</span> : null}
      </div>
      <h3 className="inspiration__title">{title}</h3>
      {description ? <p className="inspiration__body">{description}</p> : null}
      {tags.length ? (
        <ul className="tag-list">
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/?tags=${encodeURIComponent(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      ) : null}
      {showUser && user ? (
        <p className="inspiration__by">
          Kindled by{" "}
          <Link href={`/u/${user.username}`}>{user.name}</Link>
        </p>
      ) : null}
    </article>
  );
}
