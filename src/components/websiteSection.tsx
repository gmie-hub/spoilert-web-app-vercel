import { FC, PropsWithChildren } from "react";

interface WebsiteSectionProps extends PropsWithChildren {
    className?: string;
}

const WebsiteSection: FC<WebsiteSectionProps> = ({ children, className }) => {
  return (
    <section className={`px-8  md:px-[100px]  ${className || ''}`}>
      {children}
    </section>
  );
};

export default WebsiteSection;
