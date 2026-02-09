// "use client";

// import React, { ReactNode } from "react";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";

// import Button from "@spt/components/button";
// import Stack from "@spt/components/stack";

// interface SuccessStateProps {
//   title: string;
//   description?: ReactNode;
//   buttonLabel: string;
//   href?: string;
//   onButtonClick?: () => void;
//   icon?: string;
//   className?: string;

//   /** Back button */
//   showBack?: boolean;
//   backHref?: string;

//   /** Icon size */
//   iconWidth?: number;
//   iconHeight?: number;
// }

// export const childVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const SuccessState = ({
//   title,
//   description,
//   buttonLabel,
//   href,
//   onButtonClick,
//   icon,
//   className,
//   showBack = false,
//   backHref = "/",
//   iconWidth = 200,
//   iconHeight = 200,
// }: SuccessStateProps) => {
//   return (
//     <main
//       className={`relative w-full max-w-none text-center ${
//         showBack ? "pt-14" : ""
//       } ${className ?? ""}`}
//     >
//       {/* ⬅️ Back button */}
//       {showBack && (
//         <Link
//           href={backHref}
//           className="absolute left-4 top-4 text-sm font-medium text-[var(--color-blue)]"
//         >
//           {`< Back`}
//         </Link>
//       )}

//       <Stack className="w-full max-w-none space-y-2">
//         {/* 🎉 Icon */}
//         {icon && (
//           <motion.div
//             variants={childVariants}
//             className="flex justify-center items-center w-full"
//             whileHover={{ scale: 1.05 }}
//           >
//             <Image
//               src={icon}
//               alt="icon"
//               width={iconWidth}
//               height={iconHeight}
//               style={{
//                 width: iconWidth,
//                 height: iconHeight,
//               }}
//               priority
//             />
//           </motion.div>
//         )}

//         {/* 🏷 Title */}
//         <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mx-auto text-center">
//           {title}
//         </h1>

//         {/* 📝 Description */}
//         {description && (
//           <p className="text-sm sm:text-md text-gray-500 max-w-sm mx-auto">
//             {description}
//           </p>
//         )}

//         {/* 🔘 CTA */}
//         {href ? (
//           <Link href={href} className="w-full">
//             <Button className="w-full">{buttonLabel}</Button>
//           </Link>
//         ) : (
//           <Button className="w-full" onClick={onButtonClick}>
//             {buttonLabel}
//           </Button>
//         )}
//       </Stack>
//     </main>
//   );
// };

// export default SuccessState;

"use client";

import React, { ReactNode } from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import Button from "@spt/components/button";
import Stack from "@spt/components/stack";

interface SuccessStateProps {
  title: string;
  description?: ReactNode;

  /** Primary button */
  buttonLabel: string;
  href?: string;
  onButtonClick?: () => void;

  /** Second button */
  showSecondBtn?: boolean;
  secondBtnLabel?: string;
  secondBtnHref?: string;
  onSecondBtnClick?: () => void;

  icon?: string;
  className?: string;

  /** Back button */
  showBack?: boolean;
  backHref?: string;

  /** Icon size */
  iconWidth?: number;
  iconHeight?: number;
}

export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const SuccessState = ({
  title,
  description,

  buttonLabel,
  href,
  onButtonClick,

  showSecondBtn = false,
  secondBtnLabel = "Secondary action",
  secondBtnHref,
  onSecondBtnClick,

  icon,
  className,
  showBack = false,
  backHref = "/",
  iconWidth = 200,
  iconHeight = 200,
}: SuccessStateProps) => {
  return (
    <main
      className={`relative w-full max-w-none text-center ${
        showBack ? "pt-14" : ""
      } ${className ?? ""}`}
    >
      {/* ⬅️ Back button */}
      {showBack && (
        <Link
          href={backHref}
          className="absolute left-4 top-4 text-sm font-medium text-[var(--color-blue)]"
        >
          {`< Back`}
        </Link>
      )}

      <Stack className="w-full max-w-none space-y-3">
        {/* 🎉 Icon */}
        {icon && (
          <motion.div
            variants={childVariants}
            className="flex justify-center items-center w-full"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={icon}
              alt="icon"
              width={iconWidth}
              height={iconHeight}
              style={{ width: iconWidth, height: iconHeight }}
              priority
            />
          </motion.div>
        )}

        {/* 🏷 Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mx-auto">
          {title}
        </h1>

        {/* 📝 Description */}
        {description && (
          <p className="text-sm sm:text-md text-gray-500 max-w-sm mx-auto">
            {description}
          </p>
        )}

        {/* 🔘 Primary CTA */}
        {href ? (
          <Link href={href} className="w-full">
            <Button type='submit' className="w-full">{buttonLabel}</Button>
          </Link>
        ) : (
          <Button className="w-full" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        )}

        {/* 🔘 Secondary CTA */}
        {showSecondBtn && (
          <>
            {secondBtnHref ? (
              <Link href={secondBtnHref} className="w-full">
                <Button className="w-full">{secondBtnLabel}</Button>
              </Link>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                type="button"
                onClick={onSecondBtnClick}
              >
                {secondBtnLabel}
              </Button>
            )}
          </>
        )}
      </Stack>
    </main>
  );
};

export default SuccessState;
