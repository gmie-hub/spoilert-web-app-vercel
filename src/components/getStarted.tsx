"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import AppStore from "@spt/assets/icons/appiconss.svg";
import BgReady from "@spt/assets/icons/bgReady.svg";
import GooglePlay from "@spt/assets/icons/googoleicon.svg";
import Phone from "@spt/assets/icons/phone.svg";
import PhoneSmall from "@spt/assets/icons/phonesmalscreen.svg";

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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative mx-auto w-full max-w-[1240px] overflow-hidden rounded-[12.8px] flex flex-col md:flex-row items-center gap-12 px-6 pt-8 pb-10 md:px-16 md:pt-8 md:pb-0"
      >
        {/* Background SVG */}
        <Image
          src={BgReady}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />

        {/* Left content */}
        <motion.div variants={itemVariants} className="relative z-10 flex-1 text-white">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Ready to Get Started?
          </h2>

          <p className="mt-4 max-w-lg text-white/80 text-base md:text-lg">
            Get the app, sign up and start your learning journey with Spoylz .
            With Spoylz, every learner has a seat at the table, and every
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
          className="relative z-10 flex-1 flex justify-center md:justify-end"
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
    </section>
  );
};

export default GetStarted;
