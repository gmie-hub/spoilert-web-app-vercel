import { permanentRedirect } from "next/navigation";

import SpoilDetails from "@spt/screens/main/home/spoilDetails/spoilDetails";
import { getPublicSpoil } from "@spt/utils/getPublicSpoil";
import { getSpoilDetailsHref } from "@spt/utils/spoilRoutes";

interface LegacySpoilDetailsPageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

/**
 * Old `/spoil-details/:id` URL — permanently redirects to the SEO-friendly
 * `/spoil/:id/:slug` so existing links and search rankings carry over.
 */
export default async function LegacySpoilDetailsPage({
  params,
}: LegacySpoilDetailsPageProps) {
  const { spoilId } = await params;
  const spoil = await getPublicSpoil(spoilId);

  if (spoil) permanentRedirect(getSpoilDetailsHref({ ...spoil, id: spoilId }));

  // API unreachable or spoil not public — still show the page rather than a dead link.
  return <SpoilDetails spoilId={spoilId} />;
}
