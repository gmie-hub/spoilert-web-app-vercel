"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCamera } from "react-icons/fi";

import deleteaccIcon from "@spt/assets/icons/deleteacc.svg";
import LogoutIcon from "@spt/assets/icons/logouticon.svg";
import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";
import useDeleteUserMutation from "@spt/hooks/apiRequests/useDeleteUserMutation";
import { useAuthStore } from "@spt/store/authStore";

import type {
  ProfileDisplay,
  ProfileNavGroup,
  ProfileNavItemId,
} from "../types";

interface ProfileSidebarProps {
  profile: ProfileDisplay;
  navigationGroups: ProfileNavGroup[];
  activeItem: ProfileNavItemId;
  showDeleteModal?: boolean;
}

const ProfileSidebar = ({
  profile,
  navigationGroups,
  activeItem,
  showDeleteModal = false,
}: ProfileSidebarProps) => {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isTutor = user?.role === "tutor";

  const filteredGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.tutorOnly || isTutor),
    }))
    .filter((group) => group.items.length > 0);

  const navigationItems = filteredGroups.flatMap((group) => group.items);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleDeleteAccount = () => {
    if (user?.id) {
      deleteUser(user.id, {
        onSuccess: () => {
          router.push("/auth/signin");
        },
      });
    }
  };

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
    router.push("/auth/signin");
  };

  return (
    <div className="min-w-0">
      <div className="rounded-[24px] border border-[#EEF3F6] bg-white px-5 py-5 shadow-[0_18px_54px_rgba(11,83,104,0.08)] xl:hidden">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#D6DEF8]">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-base font-semibold tracking-[0.08em] text-[#0B5368]">
                  {profile.initials}
                </span>
              )}
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#F4FBFD] text-[#0B5368] shadow-sm"
              aria-label="Update profile photo"
            >
              <FiCamera className="text-xs" />
            </button>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-semibold text-[#20262D]">
              {profile.name}
            </h2>
            <p className="truncate text-sm text-[#6E7C87]">{profile.handle}</p>
            <p className="mt-1 text-sm text-[#6E7C87]">{profile.followersLabel}</p>
          </div>
        </div>

        <nav
          aria-label="Profile navigation"
          className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1 scrollbar-hide"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            const isDanger =
              item.id === "delete-my-account" || item.id === "log-out";

            if (item.id === "log-out") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLogoutModalOpen(true)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#0B5368] bg-[#0B5368] text-white shadow-[0_10px_24px_rgba(11,83,104,0.18)]"
                      : isDanger
                        ? "border-[#FDE3E1] bg-[#FFF5F5] text-[#F04438]"
                        : "border-[#E4ECF1] bg-[#F9FBFC] text-[#48606F] hover:border-[#0B5368] hover:text-[#20262D]"
                  }`}
                >
                  <Icon className="text-[15px]" />
                  <span>{item.label}</span>
                </button>
              );
            }
            if (item.id === "delete-my-account") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => router.push("/profile/delete-my-account")}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#0B5368] bg-[#0B5368] text-white shadow-[0_10px_24px_rgba(11,83,104,0.18)]"
                      : isDanger
                        ? "border-[#FDE3E1] bg-[#FFF5F5] text-[#F04438]"
                        : "border-[#E4ECF1] bg-[#F9FBFC] text-[#48606F] hover:border-[#0B5368] hover:text-[#20262D]"
                  }`}
                >
                  <Icon className="text-[15px]" />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <Link
                key={item.id}
                href={item?.href || ''}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[#0B5368] bg-[#0B5368] text-white shadow-[0_10px_24px_rgba(11,83,104,0.18)]"
                    : isDanger
                      ? "border-[#FDE3E1] bg-[#FFF5F5] text-[#F04438]"
                      : "border-[#E4ECF1] bg-[#F9FBFC] text-[#48606F] hover:border-[#0B5368] hover:text-[#20262D]"
                }`}
              >
                <Icon className="text-[15px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <aside className="hidden sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-[24px] border border-[#EEF3F6] bg-white px-5 py-6 shadow-[0_18px_54px_rgba(11,83,104,0.08)] xl:block">
        <div className="flex flex-col items-center border-b border-[#EEF3F6] pb-6 text-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#D6DEF8]">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold tracking-[0.08em] text-[#0B5368]">
                  {profile.initials}
                </span>
              )}
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#F4FBFD] text-[#0B5368] shadow-sm"
              aria-label="Update profile photo"
            >
              <FiCamera className="text-sm" />
            </button>
          </div>

          <h2 className="mt-4 text-[18px] font-semibold text-[#20262D]">
            {profile.name}
          </h2>
          <p className="mt-1 text-sm text-[#6E7C87]">{profile.handle}</p>
          <p className="mt-2 text-sm text-[#6E7C87]">{profile.followersLabel}</p>
        </div>

        <div className="mt-6 space-y-6">
          {filteredGroups.map((group) => (
            <div
              key={group.title}
              className="border-b border-[#EEF3F6] pb-6 last:border-b-0 last:pb-0"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3AF]">
                {group.title}
              </p>

              <div className="mt-3 space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeItem;
                  const isDanger =
                    item.id === "delete-my-account" || item.id === "log-out";

                  if (item.id === "log-out") {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLogoutModalOpen(true)}
                        className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm transition ${
                          isActive
                            ? "bg-[#0B5368] text-white shadow-[0_10px_24px_rgba(11,83,104,0.18)]"
                            : isDanger
                              ? "text-[#F04438] hover:bg-[#FFF5F5]"
                              : "text-[#6E7C87] hover:bg-[#F7FBFD] hover:text-[#20262D]"
                        }`}
                      >
                        <Icon className="shrink-0 text-[15px]" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  if (item.id === "delete-my-account") {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => router.push("/profile/delete-my-account")}
                        className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm transition ${
                          isActive
                            ? "bg-[#0B5368] text-white shadow-[0_10px_24px_rgba(11,83,104,0.18)]"
                            : isDanger
                              ? "text-[#F04438] hover:bg-[#FFF5F5]"
                              : "text-[#6E7C87] hover:bg-[#F7FBFD] hover:text-[#20262D]"
                        }`}
                      >
                        <Icon className="shrink-0 text-[15px]" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={item.id}
                      href={item?.href || ''}
                      className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "bg-[#0B5368] text-white shadow-[0_10px_24px_rgba(11,83,104,0.18)]"
                          : isDanger
                            ? "text-[#F04438] hover:bg-[#FFF5F5]"
                            : "text-[#6E7C87] hover:bg-[#F7FBFD] hover:text-[#20262D]"
                      }`}
                    >
                      <Icon className="shrink-0 text-[15px]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <DeleteConfirmationModal
        open={logoutModalOpen}
        title="Are You Sure You Want to Log Out?"
        description="You will need to sign in again to access your account"
        confirmLabel="Yes Log Out"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
        icon={<Image src={LogoutIcon} alt="logout" width={75} height={87} />}
      />
      <DeleteConfirmationModal
        open={showDeleteModal}
        title="Are You Sure You Want to Delete Your Account?"
        description="Deleting your account will remove all your data, including your progress, purchase history, and any created Spoils. This action cannot be undone."
        confirmLabel="Yes Delete"
        isLoading={isDeleting}
        loadingLabel="Deleting..."
        onConfirm={handleDeleteAccount}
        onCancel={() => router.back()}
        icon={<Image src={deleteaccIcon} alt="delete" width={75} height={87} />}
      />
    </div>
  );
};

export default ProfileSidebar;
