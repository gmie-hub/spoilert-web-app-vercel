import { StatCard } from "@spt/components";

import { MailIcon, PeopleIcon } from "./icons";

// A null count shows "No data".
const LecturersMetrics = ({
  total,
  declined,
}: {
  total: number;
  declined: number | null;
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <StatCard
      label="Total Lecturers"
      value={total.toLocaleString()}
      icon={<PeopleIcon color="#DA8543" />}
      iconBg="bg-orange-50"
    />
    <StatCard
      label="Declined Invitations"
      value={declined?.toLocaleString()}
      icon={<MailIcon color="#DC3545" variant="x" />}
      iconBg="bg-red-50"
    />
  </div>
);

export default LecturersMetrics;
