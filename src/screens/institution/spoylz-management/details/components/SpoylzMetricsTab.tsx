import { StatCard } from "@spt/components";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import { NetworkIcon, PeopleIcon } from "../../../lecturers/components/icons";

import { EyeIcon, ThumbsUpIcon } from "./metricsIcons";

const formatCount = (value?: number | null) => (value == null ? null : value.toLocaleString());

// All-time totals from the Spoylz itself.
const SpoylzMetricsTab = ({ spoil }: { spoil: SpoilDetailsData }) => {
  const metrics = [
    {
      label: "Total Number of Views",
      // The API doesn't count views yet.
      value: null,
      icon: <EyeIcon color="#0891B2" />,
      iconBg: "bg-cyan-50",
    },
    {
      label: "Total Number of Likes",
      value: formatCount(spoil.likes_count),
      icon: <ThumbsUpIcon color="#EC4899" />,
      iconBg: "bg-pink-50",
    },
    {
      label: "Total Number of Shares",
      value: formatCount(spoil.shares_count),
      icon: <NetworkIcon color="#B5179E" />,
      iconBg: "bg-purple-50",
    },
    {
      label: "Total Number of Enrollments",
      value: formatCount(spoil.enrolled_users),
      icon: <PeopleIcon color="#4F46E5" />,
      iconBg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <StatCard key={metric.label} {...metric} />
      ))}
    </div>
  );
};

export default SpoylzMetricsTab;
