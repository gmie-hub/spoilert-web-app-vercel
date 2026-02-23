"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import Phone from "@spt/assets/icons/phone.svg";
import PhoneSmall from "@spt/assets/icons/phonesmalscreen.svg";
import AppStore from "@spt/assets/images/app-store.png";
import GooglePlay from "@spt/assets/images/google-play.png";

const GetStarted = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="px-6 md:px-[100px] md:py-[72px]">
      <div className="relative flex flex-col items-center">
        {/* Peach strip (SMALLER WIDTH) */}

        <div className="mx-auto h-[18px] w-[95%] max-w-[1080px] rounded-t-[8px] bg-[#F9D0B0]" />

        {/* Dark card (WIDER) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
        relative
        -mt-[12px]
        m-16 md:m-0
        w-full
        max-w-[1240px]
        overflow-hidden
        rounded-[12.8px]
        bg-[#053B4C]
        px-6 pt-8 pb-10 md:px-16 md:pt-8 md:pb-0
        
        flex flex-col md:flex-row
        items-center gap-12
      "
        >
          {/* Left content */}
          <motion.div variants={itemVariants} className="flex-1 text-white">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Ready to Get Started?
            </h2>

            <p className="mt-4 max-w-lg text-white/80 text-base md:text-lg">
              Get the app, sign up and start your learning journey with Spoilt.
              With Spoilt, every learner has a seat at the table, and every
              tutor has a voice in shaping the future of education.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Image src={AppStore} alt="App Store" className="w-[180px]" />
              <Image src={GooglePlay} alt="Google Play" className="w-[180px]" />
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="flex-1 flex justify-center md:justify-end"
          >
            {/* Small screen */}
            <Image
              src={PhoneSmall}
              alt="App Preview"
              className="block md:hidden w-full max-w-sm"
              priority
            />

            {/* Medium+ screen */}
            <Image
              src={Phone}
              alt="App Preview"
              className="hidden md:block w-full max-w-md md:max-w-lg"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStarted;
