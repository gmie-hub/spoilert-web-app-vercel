import type { InviteStatus } from "../constants";

const STATUS_STYLES: Record<InviteStatus, string> = {
  Accepted: "bg-green-50 text-green-600",
  Pending: "bg-yellow-50 text-yellow-600",
  Declined: "bg-red-50 text-red-600",
};

const StatusBadge = ({ status }: { status: InviteStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);

export default StatusBadge;
