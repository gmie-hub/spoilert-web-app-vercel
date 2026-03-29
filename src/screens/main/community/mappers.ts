import type { CommunityCardItem, CommunityProfile } from "./communityTypes";

export const mapToCard = (c: any): CommunityCardItem => {
  const name = c.name ?? "";
  const displayName = typeof name === "string" && name.length > 18 ? `${name.slice(0, 18)}...` : name;
  let avatarLabel = "";
  if (c.owner) {
    const ownerName = `${c.owner.first_name ?? ""} ${c.owner.last_name ?? ""}`.trim() || c.owner.username || "";
    const partsOwner = ownerName.split(" ").filter(Boolean);
    avatarLabel = partsOwner.length >= 2 ? `${partsOwner[0][0]}${partsOwner[1][0]}` : (partsOwner[0] || "")[0] || "";
  } else {
    const parts = String(name).split(" ").filter(Boolean);
    avatarLabel = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : (parts[0] || "")[0] || "";
  }
  const avatarUrl = c?.spoil?.cover_image_url ?? c?.cover_image_url ?? c?.image ?? null;
  const locked = typeof c.locked === "number" ? c.locked : (c.locked === true ? 1 : 0);
  const audience = locked === 1 ? "locked" : "free";
  const members = c.total_members ?? c.total_members_count ?? c.members_count ?? c.members ?? 0;

  return {
    ...c,
    id: String(c.id ?? c._id ?? ""),
    name: displayName,
    description: c.description ?? c.spoil?.title ?? "",
    audience,
    locked,
    members,
    avatarLabel: avatarLabel.toUpperCase(),
    avatarUrl,
    accentColor: c.accent_color ?? "#6E9BC3",
  } as CommunityCardItem;
};

export const mapToProfile = (fetched: any, selectedCommunityId?: string | null): CommunityProfile | null => {
  if (!fetched) return null;

  return {
    id: String(fetched.id ?? fetched._id ?? selectedCommunityId ?? ""),
    name: fetched.name ?? "",
    members: fetched.total_members ?? fetched.members ?? 0,
    description: fetched.description ?? fetched.spoil?.description ?? "",
    spoilTitle: fetched.spoil?.title ?? fetched.spoil_title ?? "",
    spoil: fetched.spoil
      ? {
          title: fetched.spoil?.title ?? fetched.spoil_title ?? undefined,
          description: fetched.spoil?.description ?? undefined,
          tutor: fetched.spoil?.tutor
            ? {
                first_name: fetched.spoil.tutor.first_name ?? undefined,
                last_name: fetched.spoil.tutor.last_name ?? undefined,
                id: fetched.spoil.tutor.id ?? undefined,
              }
            : null,
        }
      : null,
    createdBy: (fetched.owner && `${fetched.owner.first_name ?? ""} ${fetched.owner.last_name ?? ""}`) || fetched.owner?.username || "",
    createdDate: fetched.created_at ?? "",
    avatarLabel:
      (fetched.owner && ((fetched.owner.first_name ?? "")[0] || "")) ||
      (fetched.spoil && fetched.spoil.tutor && ((fetched.spoil.tutor.first_name ?? "")[0] || "")) ||
      (fetched.name && String(fetched.name)[0]) ||
      "",
    accentColor: fetched.accent_color ?? "#C8D4E3",
    feed: fetched.feed ?? [],
    comments: fetched.comments ?? [],
  } as CommunityProfile;
};
