import { notFound } from "next/navigation";

import PromotionDetailsPage from "@spt/screens/main/profile/my-promotions/details";
import { isProfileSection } from "@spt/screens/main/profile/sectionUtils";


interface ProfileSectionDetailsPageProps {
  params?: {
    section: string;
  };
}


export default function ProfileSectionDetailsPage({ params }: ProfileSectionDetailsPageProps) {
  const section = params?.section;


  if (!section || !isProfileSection(section)) {
    notFound();
  }

  return <PromotionDetailsPage />;
}
