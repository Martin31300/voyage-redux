export const slugify = (text = "") =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const toList = (data, ...keys) => {
  if (Array.isArray(data)) return data;
  for (const key of [...keys, "data", "items", "results"]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

export const toObject = (data, ...keys) => {
  for (const key of [...keys, "data"]) {
    const value = data?.[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  }
  return data;
};

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

export const avatarFor = (seed) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed || "voyageur")}`;

export function normalizeUser(u = {}) {
  return {
    id: u.id ?? u.user_id ?? u.sub,
    username: u.username,
    email: u.email,
    firstName: u.firstName ?? u.first_name,
    lastName: u.lastName ?? u.last_name,
    gender: u.gender,
    avatar: u.avatar || u.image || avatarFor(u.username),
    role: u.role,
    createdAt: u.created_at ?? u.createdAt,
  };
}

export function normalizeRegion(r = {}) {
  return { id: r.id, slug: r.slug ?? slugify(r.name), name: r.name };
}

export function normalizeDestination(d = {}) {
  const regionObject = d.region && typeof d.region === "object" ? d.region : null;
  const regionName =
    regionObject?.name ??
    d.region_name ??
    d.regionName ??
    (typeof d.region === "string" ? d.region : undefined);
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    capital: d.capital,
    description: d.description,
    image: d.image,
    lat: d.lat,
    long: d.long ?? d.lng,
    regionId: d.region_id ?? regionObject?.id,
    regionName,
    regionSlug: regionObject?.slug ?? d.region_slug ?? d.regionSlug ?? slugify(regionName),
    createdBy: d.creator_id ?? d.created_by ?? d.createdBy,
    creatorName: d.creator_username ?? d.creatorName,
  };
}

export function normalizeComment(c = {}) {
  return {
    id: c.id,
    destinationId: c.destination_id ?? c.destinationId,
    destinationName: c.destination_name ?? c.destination_title ?? c.destination?.name,
    destinationSlug: c.destination_slug ?? c.destination?.slug,
    destinationImage: c.destination_image,
    userId: c.user_id ?? c.userId,
    author: c.username ?? c.user?.username ?? c.author ?? null,
    authorAvatar: c.avatar,
    content: c.content,
    rating: c.rating,
    createdAt: c.created_at ?? c.createdAt,
  };
}

export function normalizeFavorite(f = {}) {
  return {
    id: f.id,
    destinationId: f.destination_id ?? f.destinationId,
    title: f.destination_title ?? f.title,
    image: f.destination_image ?? f.image,
  };
}
