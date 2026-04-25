
import ChangePasswordPage from "./change-password";
import ManageBankAccount from "./components/ManageBankAccount";
import ProfilePlaceholderPage from "./components/profilePlaceholderPage";
import CustomerSupportPage from "./customer-support";
import EarningsBreakdownPage from "./earnings-breakdown";
import FAQ from "./faqs/index";
import MyBookmarksPage from "./my-bookmarks";
import MyPromotionsPage from "./my-promotions";
import MySponsorshipsPage from "./my-sponsorships";
import MySpoilsSection from "./mySpoil";
import { profileNavigationGroups } from "./profileData";
import ProfileDetailsSection from "./profileDetails";
import SpoilPerformanceAnalyticsPage from "./spoil-performance-analytics";
import SpoilStatsPage from "./spoil-stats";
import TransactionHistoryPage from "./transaction-history";

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

  if (section === "my-promotions") {
    return <MyPromotionsPage />;
  }

  if (section === "my-sponsorships") {
    return <MySponsorshipsPage />;
  }

  if (section === "earnings-breakdown") {
    return <EarningsBreakdownPage />;
  }

  if (section === "transaction-history") {
    return <TransactionHistoryPage />;
  }

  if (section === "spoil-performance-analytics") {
    return <SpoilPerformanceAnalyticsPage />;
  }

  if (section === "delete-my-account") {
    return null;
  }

  if (section === "manage-bank-account") {
    return <ManageBankAccount />;
  }

  if (section === "customer-support") {
    return <CustomerSupportPage />;
  }

  if (section === "faqs") {
    return <FAQ />;
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
