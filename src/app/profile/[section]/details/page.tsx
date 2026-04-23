import { notFound } from "next/navigation";

import PromotionDetailsPage from "@spt/screens/main/profile/my-promotions/details";
import { isProfileSection } from "@spt/screens/main/profile/sectionUtils";


interface ProfileSectionDetailsPageProps {
  params: Promise<{
    section: string;
  }>;
}

export default async function ProfileSectionDetailsPage({ params }: ProfileSectionDetailsPageProps) {
  const { section } = await params;

  if (!section || !isProfileSection(section)) {
    notFound();
  }

  return <PromotionDetailsPage />;
}
