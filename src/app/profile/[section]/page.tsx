import { notFound } from "next/navigation";

import ProfileSectionContent from "@spt/screens/main/profile/sectionContent";
import { isProfileSection } from "@spt/screens/main/profile/sectionUtils";


interface ProfileSectionPageProps {
  params: {
    section: string;
  };
}


export default function ProfileSectionPage({ params }: ProfileSectionPageProps) {
  const { section } = params;


  if (!isProfileSection(section)) {
    notFound();
  }

  return <ProfileSectionContent section={section} />;
}
