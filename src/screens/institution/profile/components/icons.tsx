export const PhoneIcon = ({ color = "var(--color-blue)" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke={color} strokeWidth="1.7" />
    <path d="M10.5 18h3" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const BankIcon = ({ color = "#DA8543" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 9.5L12 4l9 5.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 10.5v6.5M10 10.5v6.5M14 10.5v6.5M18.5 10.5v6.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <path d="M3 20h18" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const CheckIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6.5L9.5 17L4 11.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PencilIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13.3 4.7l6 6M4 20l1.2-5.1L15.8 4.3a2 2 0 0 1 2.8 0l1.1 1.1a2 2 0 0 1 0 2.8L9.1 18.8 4 20Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon =({ color = "var(--color-blue)" }: { color?: string }) => (
  <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <path d="M12 11v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill={color} />
  </svg>
);
