"use client";
import Image from "next/image";

import TeachIcon from "@spt/assets/icons/about4.svg";
import AboutUs2 from "@spt/assets/icons/about5.svg";
import AboutUs3 from "@spt/assets/icons/about6.svg";
import AboutUs4 from "@spt/assets/icons/about7.svg";
import AboutUs5 from "@spt/assets/icons/about8.svg";
import AboutUs6 from "@spt/assets/icons/about9.svg";

export default function WhySpoilertSection() {
  return (
    <section className="w-full py-16 ">
      <div className="p-10 bg-[#063B4A] rounded-2xl  text-white">
        {/* Top Mission + Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mission */}
          <div>
            <div className="flex flex-col items-start justify-start    gap-2 mb-4 ">
              <Image src={AboutUs6} alt="AboutUs6" width={50} height={50} />
              <h3 className="text-lg font-semibold text-center">Our Mission</h3>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
      To create an inclusive, scalable, and engaging learning ecosystem where knowledge can be easily shared and accessed by anyone, anywhere.
            </p>
          </div>

          {/* Vision */}
          <div>
            <div className="flex flex-col items-start justify-start    gap-2 mb-4 ">
              <Image src={AboutUs5} alt="AboutUs5" width={50} height={50} />
              <h3 className="text-lg font-semibold text-center">Our Vision</h3>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
To become a leading global platform for interactive and flexible digital education.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">Why Spoilert</h2>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <FeatureCard
              icon={
                <Image src={AboutUs4} alt="AboutUs4" width={20} height={20} />
              }
              title="Global Learning"
              desc="Connect with learners and experts from all over the world."
            />

            {/* Card 2 */}
            <FeatureCard
              icon={
                <Image src={AboutUs3} alt="AboutUs3" width={20} height={20} />
              }
              title="Flexible Learning"
              desc="Study at your own pace, on your own schedule."
            />

            {/* Card 3 */}
            <FeatureCard
              icon={
                <Image src={AboutUs2} alt="AboutUs2" width={20} height={20} />
              }
              title="Diverse Content"
              desc="Learn through videos, text, and interactive Spoylz."
            />

            {/* Card 4 */}
            <FeatureCard
              icon={
                <Image src={TeachIcon} alt="Teach" width={20} height={20} />
              }
              title="Earn as You Teach"
              desc="Tutors earn by sharing their knowledge anytime, anywhere."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Card Component */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon?: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#EAF8FD] text-[#063B4A] rounded-xl p-6 shadow-md hover:scale-[1.02] transition">
      {/* Icon */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#063B4A]/10 mb-4">
        {icon}
      </div>

      {/* Title */}
      <h4 className="font-semibold mb-2">{title}</h4>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
