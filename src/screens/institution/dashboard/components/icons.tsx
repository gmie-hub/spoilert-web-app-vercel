export const LecturersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="8" r="3.2" stroke="#DA8543" strokeWidth="1.8" />
    <circle cx="16.5" cy="9.5" r="2.4" stroke="#DA8543" strokeWidth="1.8" />
    <path d="M3 19c0-3.3 2.7-5.6 6-5.6s6 2.3 6 5.6" stroke="#DA8543" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15.5 14c2.5 0 4.5 2 4.5 5" stroke="#DA8543" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SpoylzIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 5c0-.8.7-1.5 1.5-1.5H11v15H5.5A1.5 1.5 0 0 1 4 17V5Z"
      stroke="var(--color-blue)"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M20 5c0-.8-.7-1.5-1.5-1.5H13v15h5.5A1.5 1.5 0 0 0 20 17V5Z"
      stroke="var(--color-blue)"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const StudentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="7" r="2.6" stroke="#B5179E" strokeWidth="1.7" />
    <circle cx="5.5" cy="10.5" r="2" stroke="#B5179E" strokeWidth="1.7" />
    <circle cx="18.5" cy="10.5" r="2" stroke="#B5179E" strokeWidth="1.7" />
    <path d="M7.5 19c0-2.8 2-4.8 4.5-4.8s4.5 2 4.5 4.8" stroke="#B5179E" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M2.5 18c.2-2 1.6-3.4 3.3-3.4" stroke="#B5179E" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M21.5 18c-.2-2-1.6-3.4-3.3-3.4" stroke="#B5179E" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const RevenueIcon = ({ color = "#DC3545" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" stroke={color} strokeWidth="1.7" />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.7" />
    <path d="M5.5 9v0M18.5 15v0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
