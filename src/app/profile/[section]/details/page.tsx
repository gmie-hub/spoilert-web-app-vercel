import { notFound } from "next/navigation";

import PromotionDetailsPage from "@spt/screens/main/profile/my-promotions/details";
import { isProfileSection } from "@spt/screens/main/profile/sectionUtils";

interface Params {
  params: {
    section: string;
  };
}

export default function ProfileSectionDetailsPage({ params }: Params) {
  const { section } = params;

  if (!isProfileSection(section)) {
    notFound();
  }

  return <PromotionDetailsPage />;
}
