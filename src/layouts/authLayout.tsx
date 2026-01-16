
"use client";

import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";

import SignUpImage from "@spt/assets/images/authImage.png";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

interface AuthLayoutProps {
  children: React.ReactNode;
  image?: any;
}

const AuthLayout = ({ children, image = SignUpImage }: AuthLayoutProps) => {
  return (
    <section className="w-full min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          w-full
          min-h-screen
          bg-white
          flex
          flex-col
          lg:flex-row
        "
      >
        {/* LEFT IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
          <Image
            src={image}
            alt="Auth image"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div
          className="
            w-full
            lg:w-1/2
            min-h-screen
            flex
            items-center
            justify-center
            p-[4.8rem_6.4rem]
          "
        >
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthLayout;
// // "use client";

// // import React from "react";

// // import { motion } from "framer-motion";
// // import Image from "next/image";

// // import SignUpImage from "@spt/assets/images/authImage.png";

// // const containerVariants = {
// //   hidden: { opacity: 0, y: 20 },
// //   visible: {
// //     opacity: 1,
// //     y: 0,
// //     transition: { duration: 0.6 },
// //   },
// // };

// // interface AuthLayoutProps {
// //   children: React.ReactNode;
// //   image?: any;
// // }

// // const AuthLayout = ({ children, image = SignUpImage }: AuthLayoutProps) => {
// //   return (
// //     <section className="min-h-screen w-full bg-[#fafafa]">
// //       {/* LOGO */}
// //       <div className="px-[6.4rem] pt-[4.8rem]">
// // <p>sl</p>      </div>

// //       {/* CENTER CONTENT */}
// //       <motion.div
// //         variants={containerVariants}
// //         initial="hidden"
// //         animate="visible"
// //         className="
// //           mx-auto
// //           mt-[4rem]
// //           max-w-[1200px]
// //           flex
// //           items-center
// //           justify-center
// //           gap-[4rem]
// //           px-[6.4rem]
// //         "
// //       >
// //         {/* LEFT IMAGE CARD */}
// //         <div className="hidden lg:block w-1/2">
// //           <div className="relative h-[520px] rounded-2xl overflow-hidden">
// //             <Image
// //               src={image}
// //               alt="Auth image"
// //               fill
// //               priority
// //               className="object-cover"
// //             />
// //           </div>
// //         </div>

// //         {/* RIGHT FORM CARD */}
// //         <div className="w-full lg:w-1/2">
// //           <div
// //             className="
// //               bg-white
// //               rounded-2xl
// //               shadow-sm
// //               p-[4.8rem_6.4rem]
// //             "
// //           >
// //             {children}
// //           </div>
// //         </div>
// //       </motion.div>
// //     </section>
// //   );
// // };

// // export default AuthLayout;
// // "use client";

// // import React from "react";

// // import { motion } from "framer-motion";
// // import Image from "next/image";

// // import SignUpImage from "@spt/assets/images/authImage.png";

// // const containerVariants = {
// //   hidden: { opacity: 0, y: 20 },
// //   visible: {
// //     opacity: 1,
// //     y: 0,
// //     transition: { duration: 0.6 },
// //   },
// // };

// // interface AuthLayoutProps {
// //   children: React.ReactNode;
// //   image?: any;
// // }

// // const AuthLayout = ({ children, image = SignUpImage }: AuthLayoutProps) => {
// //   return (
// //     <section className="min-h-screen w-full bg-[#fafafa]">
// //       {/* LOGO */}
// //       <div className="px-[3.2rem] pt-[3.2rem]">
// //         <p>sl</p>
// //       </div>

// //       {/* MAIN CONTENT */}
// //       <motion.div
// //         variants={containerVariants}
// //         initial="hidden"
// //         animate="visible"
// //         className="
// //           w-full
// //           flex
// //           items-center
// //           justify-between
// //           gap-[1rem]
// //           px-[3.2rem]
// //           mt-[2.4rem]
// //         "
// //       >
// //         {/* LEFT IMAGE */}
// //         <div className="hidden lg:flex flex-1 justify-center">
// //           <div className="relative w-full max-w-[720px] h-[560px] rounded-2xl overflow-hidden">
// //             <Image
// //               src={image}
// //               alt="Auth image"
// //               fill
// //               priority
// //               className="object-cover"
// //             />
// //           </div>
// //         </div>

// //         {/* RIGHT FORM */}
// //         <div className="flex-1 flex justify-center">
// //           <div
// //             className="
// //               w-full
// //               max-w-[520px]
// //               bg-white
// //               rounded-2xl
// //               shadow-sm
// //               p-[3.2rem]
// //             "
// //           >
// //             {children}
// //           </div>
// //         </div>
// //       </motion.div>
// //     </section>
// //   );
// // };

// // export default AuthLayout;



// "use client";

// import React from "react";

// import { motion } from "framer-motion";
// import Image from "next/image";

// import SignUpImage from "@spt/assets/images/authImage.png";

// const containerVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6 },
//   },
// };

// interface AuthLayoutProps {
//   children: React.ReactNode;
//   image?: any;
// }

// const AuthLayout = ({ children, image = SignUpImage }: AuthLayoutProps) => {
//   return (
//     <section className="h-screen w-full bg-[#fafafa] overflow-hidden">
//       {/* LOGO (removed from normal flow) */}
//       <div className="absolute top-[3.2rem] left-[3.2rem] z-10">
//         <p>sl</p>
//       </div>

//       {/* MAIN CONTENT */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="
//           h-full
//           w-full
//           flex
//           items-center
//           justify-between
//           gap-[2.4rem]
//           px-[3.2rem]
//         "
//       >
//         {/* LEFT IMAGE */}
//         <div className="hidden lg:flex flex-1 justify-center">
//           <div className="relative w-full max-w-[720px] h-[70vh] rounded-2xl overflow-hidden">
//             <Image
//               src={image}
//               alt="Auth image"
//               fill
//               priority
//               className="object-cover"
//             />
//           </div>
//         </div>

//         {/* RIGHT FORM */}
//         <div className="flex-1 flex justify-center">
//           <div
//             className="
//               w-full
//               max-w-[520px]
//               bg-white
//               rounded-2xl
//               shadow-sm
//               p-[3.2rem]
//               max-h-[80vh]
//               overflow-y-auto
//             "
//           >
//             {children}
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default AuthLayout;
