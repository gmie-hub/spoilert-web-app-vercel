import type { PaymentDatum } from "@spt/hooks/apiRequests/useGetPaymentsQuery";

import { PAYMENT_STATUSES } from "../lecturers/details/mappers";
import { formatDate, formatNaira, formatTime, humanize } from "../lecturers/utils";

import type { RevenueTransaction } from "./components/constants";

// Anything the API doesn't serve shows as "-" rather than a made-up value.
const NOT_AVAILABLE = "-";

interface PaymentPerson {
  first_name?: string | null;
  last_name?: string | null;
}

// Relations the institution's /payments may load onto each payment; each one
// is only read when present.
export type InstitutionPayment = PaymentDatum & {
  user?: PaymentPerson | null;
  tutor?: PaymentPerson | null;
  spoil?: { title?: string | null; cover_image_url?: string | null } | null;
};

const fullName = (person?: PaymentPerson | null) =>
  `${person?.first_name ?? ""} ${person?.last_name ?? ""}`.trim();

export const toRevenueTransaction = (payment: InstitutionPayment): RevenueTransaction => {
  const status = payment.status?.toLowerCase();
  const purchasedAt = payment.paid_at ?? payment.created_at;

  return {
    id: String(payment.id),
    transactionId: payment.reference || NOT_AVAILABLE,
    studentName: fullName(payment.user) || payment.learner_name || NOT_AVAILABLE,
    spoylzTitle: payment.spoil?.title || NOT_AVAILABLE,
    thumbnail: payment.spoil?.cover_image_url || null,
    lecturerName: fullName(payment.tutor) || NOT_AVAILABLE,
    spoylzAmount: formatNaira(payment.amount) ?? NOT_AVAILABLE,
    // Not on the payment record yet.
    lecturerShare: NOT_AVAILABLE,
    institutionShare: NOT_AVAILABLE,
    status: PAYMENT_STATUSES[status] ?? (status ? humanize(status) : null),
    date: formatDate(purchasedAt),
    dateTime: `${formatDate(purchasedAt)} | ${formatTime(purchasedAt)}`,
  };
};
