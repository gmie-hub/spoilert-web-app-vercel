import { FC, ReactNode } from 'react';

interface BoxProps {
  children: ReactNode;
  padding?: string | Partial<Record<Breakpoint, string>>; 
  margin?: string | Partial<Record<Breakpoint, string>>;
  className?: string;
}

const Box: FC<BoxProps> = ({
  children,
  padding = '',
  margin = '',
  className = '',
}) => {
  // Handle responsive padding
  const paddingClass = typeof padding === 'string'
    ? padding
    : Object.entries(padding)
        .map(([breakpoint, p]) => (breakpoint === 'base' ? p : `${breakpoint}:${p}`))
        .join(' ');

  // Handle responsive margin
  const marginClass = typeof margin === 'string'
    ? margin
    : Object.entries(margin)
        .map(([breakpoint, m]) => (breakpoint === 'base' ? m : `${breakpoint}:${m}`))
        .join(' ');

  return (
    <div className={`${paddingClass} ${marginClass} ${className}`}>
      {children}
    </div>
  );
};

export default Box;