import { notFound } from "next/navigation";

import ProfileSectionContent from "@spt/screens/main/profile/sectionContent";
import { isProfileSection } from "@spt/screens/main/profile/sectionUtils";


interface ProfileSectionPageProps {
  params: Promise<{
    section: string;
  }>;
}

export default async function ProfileSectionPage({ params }: ProfileSectionPageProps) {
  const { section } = await params;


  if (!isProfileSection(section)) {
    notFound();
    
  }

  return <ProfileSectionContent section={section} />;
}
