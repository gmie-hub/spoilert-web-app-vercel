import { StatCard } from "@spt/components";

import { MailIcon, PeopleIcon } from "./icons";

const LecturersMetrics = ({
  total,
  pending,
  accepted,
  declined,
}: {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      label="Total Lecturers"
      value={total.toLocaleString()}
      icon={<PeopleIcon color="#DA8543" />}
      iconBg="bg-orange-50"
    />
    <StatCard
      label="Pending Invitations"
      value={pending.toLocaleString()}
      icon={<MailIcon color="#0891B2" />}
      iconBg="bg-cyan-50"
    />
    <StatCard
      label="Accepted Invitations"
      value={accepted.toLocaleString()}
      icon={<MailIcon color="#B5179E" variant="check" />}
      iconBg="bg-purple-50"
    />
    <StatCard
      label="Declined Invitations"
      value={declined.toLocaleString()}
      icon={<MailIcon color="#DC3545" variant="x" />}
      iconBg="bg-red-50"
    />
  </div>
);

export default LecturersMetrics;
