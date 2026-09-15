export const EyeIcon = ({ color = "#0891B2" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.7" />
  </svg>
);

export const ThumbsUpIcon = ({ color = "#EC4899" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 20V10.5m0 9.5H4.5A1.5 1.5 0 0 1 3 18.5v-6A1.5 1.5 0 0 1 4.5 11H7m0 9h10.2a2 2 0 0 0 2-1.7l.9-6a2 2 0 0 0-2-2.3H14l.7-4a1.7 1.7 0 0 0-3.1-1.2L7 10.5"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
