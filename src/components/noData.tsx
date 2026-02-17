import type { FC, PropsWithChildren } from "react";

import Image from "next/image";

import EmptyImage from "@spt/assets/images/empty.png";

interface NoDataProps extends PropsWithChildren {
  heading: string;
  description: string;
}

const NoData: FC<NoDataProps> = ({ children, description, heading }) => {
  return (
    <div className="my-2 flex w-full items-center justify-center">
      <div className="flex w-full flex-col gap-6 text-center md:gap-10">
        <div className="flex justify-center">
          <Image src={EmptyImage} alt="empty" />
        </div>

        <div className="flex flex-col gap-0 md:gap-4">
          <p className="text-xl font-semibold">{heading}</p>
          <p className="text-gray-500">{description}</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default NoData;
