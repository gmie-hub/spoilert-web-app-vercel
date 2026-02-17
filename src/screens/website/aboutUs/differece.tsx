// "use client";

// import React from "react";

// import Image from "next/image";

// import AboutUsImage from "@spt/assets/images/aboutus3.svg";

// export default function Difference() {
//   return (
//     <section className="px-6 md:px-25 py-4 lg:py-24 bg-white">
//       {/* Top Section: Heading + Image Grid */}
//       <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20">
//         {/* Text */}
//         <div className="flex-1">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Global Access to Learning, Teaching, and Earning
//           </h2>
//           <p className="text-gray-600 text-lg md:text-xl">
//             Spoilert bridges the gap between learners and tutors across the
//             world. From academic subjects to real-world skills, our platform
//             makes it easy to teach, learn, and grow no matter where you are.
//           </p>
//         </div>
//         <div className="flex-1">
//           <Image
//             src={AboutUsImage}
//             alt="Person working on laptop"
//             width={590}
//             height={200}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import React from "react";

import Image from "next/image";

import AboutUsImage from "@spt/assets/images/aboutus3.svg";

export default function Difference() {
  return (
    <section className="  bg-white">
      {/* Wrapper */}
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        
        {/* Left Side: Text */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Global Access to Learning, Teaching, and Earning
          </h2>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Spoilert bridges the gap between learners and tutors across the
            world. From academic subjects to real-world skills, our platform
            makes it easy to teach, learn, and grow no matter where you are.
          </p>
        </div>

        {/* Right Side: Image (Centered) */}
        <div className="flex-1 flex justify-center items-center">
          <Image
            src={AboutUsImage}
            alt="Person working on laptop"
            width={590}
            height={400}
            className="w-full max-w-[590px] h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
