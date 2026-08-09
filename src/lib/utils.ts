export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTagInput(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[,]+/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
}
