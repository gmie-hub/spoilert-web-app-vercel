// "use client";

// import React, {  ReactNode } from "react";

// import Link from "next/link";

// import Button from "@spt/components/button";
// import Card from "@spt/components/card";
// import Stack from "@spt/components/stack";

// interface SuccessStateProps {
//   title: string;
//   description?: string;
//   buttonLabel: string;
//   href?: string;
//   onButtonClick?: () => void;
//   icon?: ReactNode;
//   className?: string;
// }

// const SuccessState = ({
//   title,
//   description,
//   buttonLabel,
//   href,
//   onButtonClick,
//   icon,
//   className = "",
// }: SuccessStateProps) => {
//   return (
// <div className="min-h-screen w-full flex items-center justify-center px-4">
// <Card className="max-w-md w-full flex items-center justify-center">
//     <Stack className="items-center justify-center text-center space-y-6">
//       {/* Icon */}
//       {icon && (
//         <div className="flex items-center justify-center">
//           {icon}
//         </div>
//       )}

//       {/* Title */}
//       <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
//         {title}
//       </h1>

//       {/* Description */}
//       {description && (
//         <p className="text-sm sm:text-md text-gray-500 max-w-sm mx-auto">
//           {description}
//         </p>
//       )}

//       {/* CTA */}
//       {href ? (
//         <Link href={href} className="w-full">
//           <Button className="w-full">
//             {buttonLabel}
//           </Button>
//         </Link>
//       ) : (
//         <Button
//           className="w-full"
//           onClick={onButtonClick}
//         >
//           {buttonLabel}
//         </Button>
//       )}
//     </Stack>
//   </Card>
// </div>
//   );
// };

// export default SuccessState;
"use client";

import React, { ReactNode } from "react";

import Link from "next/link";

import Button from "@spt/components/button";
import Card from "@spt/components/card";
import Stack from "@spt/components/stack";

interface SuccessStateProps {
  title: string;
  description?: string;
  buttonLabel: string;
  href?: string;
  onButtonClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

const SuccessState = ({
  title,
  description,
  buttonLabel,
  href,
  onButtonClick,
  icon,
  className = "",
}: SuccessStateProps) => {
  return (
    <div className="min-h-screen w-full grid place-items-center px-4">
      <Card className={`max-w-md w-full ${className}`}>
        <Stack className="items-center text-center space-y-6">
          {/* Icon */}
          {icon && <div>{icon}</div>}

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900  mx-auto text-center">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-sm sm:text-md text-gray-500 max-w-sm mx-auto">
              {description}
            </p>
          )}

          {/* CTA */}
          {href ? (
            <Link href={href} className="w-full">
              <Button className="w-full">
                {buttonLabel}
              </Button>
            </Link>
          ) : (
            <Button className="w-full" onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          )}
        </Stack>
      </Card>
    </div>
  );
};

export default SuccessState;
