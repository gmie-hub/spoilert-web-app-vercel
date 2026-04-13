import ProfilePlaceholderPage from "./components/profilePlaceholderPage";
import MySpoilsSection from "./mySpoil";
import { profileNavigationGroups } from "./profileData";
import ProfileDetailsSection from "./profileDetails";

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
