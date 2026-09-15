import type { ApplicationResponseData } from "@spt/hooks/apiRequests/useGetApplicationByIdQuery";

import { INSTITUTION_COUNTRIES, INSTITUTION_POSITIONS } from "./constants";

import type { InstitutionApplicationValues } from "./types";

export const mapApplicationToFormValues = (
  application: ApplicationResponseData,
): InstitutionApplicationValues => {
  const countryValue =
    INSTITUTION_COUNTRIES.find((option) => option.label === application.country)?.value ??
    application.country ??
    "";
  const positionValue =
    INSTITUTION_POSITIONS.find((option) => option.label === application.contact?.position)?.value ??
    application.contact?.position ??
    "";

  return {
    institutionName: application.name ?? "",
    institutionType: application.type ?? "",
    country: countryValue,
    state: application.state ?? "",
    city: application.city ?? "",
    institutionAddress: application.address ?? "",
    officialEmail: application.official_email ?? "",
    phone: application.phone ?? "",
    repFullName: application.contact?.full_name ?? "",
    repEmail: application.contact?.email ?? "",
    repPhone: application.contact?.phone ?? "",
    repPosition: positionValue,
  };
};
