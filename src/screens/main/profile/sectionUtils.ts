import { profileNavigationGroups } from "./profileData";

import type { ProfileNavItemId } from "./types";

const profileItems = profileNavigationGroups.flatMap((group) => group.items);

export const isProfileSection = (value: string): value is ProfileNavItemId =>
  profileItems.some((item) => item.id === value);
