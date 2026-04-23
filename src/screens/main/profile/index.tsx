"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

import { usePathname } from "next/navigation";

import { useAuthStore } from "@spt/store/authStore";

import ProfileSidebar from "./components/profileSidebar";
import { defaultProfileDisplay, profileNavigationGroups } from "./profileData";

import type { ProfileNavItemId } from "./types";

interface ProfileShellProps {
  children: ReactNode;
}

const ProfileShell = ({ children }: ProfileShellProps) => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const activeItem = useMemo<ProfileNavItemId>(() => {
    const segment = pathname.split("/")[2];

    if (!segment) {
      return "my-spoils";
    }

    const matchedItem = profileNavigationGroups
      .flatMap((group) => group.items)
      .find((item) => item.id === segment);

    return matchedItem?.id ?? "my-spoils";
  }, [pathname]);

  const profileDisplay = useMemo(() => {
    if (!user) {
      return defaultProfileDisplay;
    }

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
    const handleSource =
      user.username || fullName || user.email.split("@")[0] || "Spoilert user";

    return {
      name: fullName || defaultProfileDisplay.name,
      handle: handleSource,
      followersLabel: `${user.followers_count ?? 0} Followers`,
      avatar: user.avatar,
      initials: handleSource.slice(0, 2).toUpperCase(),
    };
  }, [user]);

  return (
    <section className="min-h-screen bg-[#FCFEFF] px-4 py-8 sm:px-6 lg:px-[60px] xl:px-[76px]">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#20262D] md:text-[32px]">
          Profile
        </h1>

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <ProfileSidebar
            activeItem={activeItem}
            navigationGroups={profileNavigationGroups}
            profile={profileDisplay}
            showDeleteModal={activeItem === "delete-my-account"}
          />

          <div className="min-w-0 self-start rounded-[24px] border border-[#EEF3F6] bg-white px-5 py-6 shadow-[0_18px_54px_rgba(11,83,104,0.08)] sm:px-7 sm:py-7">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileShell;
