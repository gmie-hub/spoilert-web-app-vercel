import { FC, PropsWithChildren } from "react";

interface WebsiteSectionProps extends PropsWithChildren {
    className?: string;
}

const WebsiteSection: FC<WebsiteSectionProps> = ({ children, className }) => {
  return (
    <section className={`px-8 py-3 md:px-[100px] md:py-[30px] ${className || ''}`}>
      {children}
    </section>
  );
};

export default WebsiteSection;
