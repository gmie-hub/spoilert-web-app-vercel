import ProfilePlaceholderPage from "./components/profilePlaceholderPage";
import MySpoilsSection from "./mySpoil";
import { profileNavigationGroups } from "./profileData";
import ProfileDetailsSection from "./profileDetails";
import SpoilStatsPage from "./spoil-stats";
import MyBookmarksPage from "./my-bookmarks";
import ChangePasswordPage from "./change-password";

import type { ProfileNavItemId } from "./types";

interface ProfileSectionContentProps {
  section: ProfileNavItemId;
}

const ProfileSectionContent = ({ section }: ProfileSectionContentProps) => {
  const profileItems = profileNavigationGroups.flatMap((group) => group.items);

  if (section === "profile-details") {
    return <ProfileDetailsSection />;
  }

  if (section === "my-spoils") {
    return <MySpoilsSection />;
  }

  if (section === "spoil-stats") {
    return <SpoilStatsPage />;
  }

  if (section === "my-bookmarks") {
    return <MyBookmarksPage />;
  }

  if (section === "change-password") {
    return <ChangePasswordPage />;
  }

  const selectedItem = profileItems.find((item) => item.id === section);
  const label = selectedItem?.label ?? "Profile Section";

  return (
    <div>
      <h2 className="text-[20px] font-semibold text-[#20262D]">{label}</h2>
      <ProfilePlaceholderPage
        title={`${label} Coming Soon`}
        description={`This ${label.toLowerCase()} page is now route-ready and connected to the shared profile layout. You can build the full section here next without changing the shell or URL structure.`}
        actionLabel="Continue Building"
      />
    </div>
  );
};

export default ProfileSectionContent;
