  import { FC, PropsWithChildren } from "react";

  interface ComponentProps extends PropsWithChildren {
    className?: string;
  }

  const Card: FC<ComponentProps> = ({ className = "", children }) => {
    return (
      <div className={`p-8 w-full shadow-[0_0_40px_0_#D4A43712] ${className}`}>
        {children}
      </div>
    );
  };

  export default Card;
