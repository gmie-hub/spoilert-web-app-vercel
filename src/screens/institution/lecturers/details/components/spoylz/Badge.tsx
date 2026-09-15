const TONE_STYLES: Record<string, string> = {
  Active: "bg-green-50 text-green-600",
  Completed: "bg-green-50 text-green-600",
  Successful: "bg-green-50 text-green-600",
  Unpublished: "bg-red-50 text-red-600",
  Failed: "bg-red-50 text-red-600",
  Ongoing: "bg-yellow-50 text-yellow-600",
  Pending: "bg-yellow-50 text-yellow-600",
  "Not Started": "bg-gray-100 text-gray-500",
};

const Badge = ({ label }: { label: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
      TONE_STYLES[label] ?? "bg-gray-100 text-gray-500"
    }`}
  >
    {label}
  </span>
);

export default Badge;
