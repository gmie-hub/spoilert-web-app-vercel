import { FC, PropsWithChildren } from "react";

interface WebsiteSectionProps extends PropsWithChildren {
    className?: string;
    /** Match the dashboard home hero spacing: tighter gutters and a centered 1400px content width. */
    contained?: boolean;
}

const WebsiteSection: FC<WebsiteSectionProps> = ({ children, className, contained }) => {
  if (contained) {
    return (
      <section className={`px-4 sm:px-6 lg:px-10 xl:px-[40px] ${className || ''}`}>
        <div className="mx-auto w-full max-w-[1400px]">{children}</div>
      </section>
    );
  }

  return (
    <section className={`px-8  md:px-[100px]  ${className || ''}`}>
      {children}
    </section>
  );
};

export default WebsiteSection;
