"use client";

import React, { useState } from "react";

import { Form, Formik } from "formik";
import Image from "next/image";
import { object } from "yup";

import ContactIcon5 from "@spt/assets/icons/con1.svg";
import ContactIcon6 from "@spt/assets/icons/con2.svg";
import ContactIcon7 from "@spt/assets/icons/con3.svg";
import SuccessIcon from "@spt/assets/icons/done-task-1lwcuCqx7L.svg";
import ContactIcon4 from "@spt/assets/icons/Frame 1618872944.svg";
import ContactIcon2 from "@spt/assets/icons/Social icon(1).svg";
import ContactIcon3 from "@spt/assets/icons/Social icon(2).svg";
import ContactIcon1 from "@spt/assets/icons/Social icons.svg";
import Button from "@spt/components/button";
import GetStarted from "@spt/components/getStarted";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import SuccessState from "@spt/components/successState";
import { validations } from "@spt/utils/validation";


export default function ContactSection() {
  /* ✅ Validation Schema */
  const validationSchema = object().shape({
    firstName: validations.firstName,
    lastName: validations.lastName,
    email: validations.email,
    // phone: validations.phone,
    // subject: validations.subject,
    // message: validations.message,
  });

  /* ✅ Submit Handler */
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="px-6 md:px-25 py-4 lg:py-16 bg-white">
        {/* Page Title */}
        <h2 className="text-3xl font-bold text-center text-[#063B4A] ">
          Contact Us
        </h2>

        {/* Main Wrapper */}
        <div className="  bg-white shadow-lg rounded-2xl p-4  lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT PANEL */}
            <div className="bg-[#063B4A] text-white rounded-2xl p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  We’d Love to Hear From You
                </h3>
                <p className="text-white/70 mb-8">
                  Any question or remarks? Just send us a message.
                </p>

                {/* Contact Info */}
                <div className="space-y-6">
                  <InfoItem
                    icon={ContactIcon5}
                    text="blinkersnigeria@gmail.com"
                  />
                  <InfoItem icon={ContactIcon6} text="+2348155656205" />
                  <InfoItem
                    icon={ContactIcon7}
                    //   icon={<MapPin size={18} />}
                    text="18B, Onikepo Akande Street, Off Admiralty way,Lekki Phase 1, Lagos State, Nigeria."
                  />
                </div>

                
              </div>

              {/* Socials */}
              <div className="mt-10">
                <p className="font-medium mb-3">Socials</p>
                <div className="flex gap-4">
                  <Image
                    src={ContactIcon1}
                    alt="ContactIcon1"
                    width={40}
                    height={40}
                  />
                  <Image
                    src={ContactIcon2}
                    alt="ContactIcon2"
                    width={40}
                    height={40}
                  />{" "}
                  <Image
                    src={ContactIcon3}
                    alt="ContactIcon3"
                    width={40}
                    height={40}
                  />{" "}
                  <Image
                    src={ContactIcon4}
                    alt="ContactIcon4"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="p-2 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Fill this form to ask your questions
              </h3>

              {/* ✅ Formik Form */}
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  subject: "",
                  message: "",
                }}
                validationSchema={validationSchema}
                onSubmit={() => {}}
              >
                {() => (
                  <Form className="space-y-6">
                    {/* First + Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input name="firstName" label="First Name" />
                      <Input name="lastName" label="Last Name" />
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input name="email" type="email" label="Email Address" />
                      <Input name="phone" label="Phone Number" />
                    </div>

                    {/* Subject */}
                    <Input name="subject" label="Subject" />

                    {/* Message */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Message
                      </label>

                      <textarea
                        name="message"
                        placeholder="Write your message..."
                        className="w-full mt-2 p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#063B4A]"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      onClick={() => setOpen(true)}
                      className="w-full md:w-[200px]"
                    >
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>

              <Modal
                open={open}
                onClose={() => setOpen(false)}
                size="md"
                showCloseButton={false}
              >
                <SuccessState
                  icon={SuccessIcon.src}
                  onButtonClick={() => setOpen(false)}
                  description="Our team will contact you as soon as possible"
                  title="Thanks for getting in touch! Your form has been submitted successfully 🎉 "
                  buttonLabel="Okay"
                  // href="/auth/signin"
                />
              </Modal>
            </div>
          </div>
        </div>
      </section>
      <GetStarted />
    </>
  );
}

/* Info Item Component */
function InfoItem({ icon, text }: { icon?: any; text: string }) {
  const renderIcon = () => {
    if (!icon) return null;

    try {
      return (
        <Image
          src={icon as any}
          alt="icon"
          width={20}
          height={20}
          className="object-contain"
        />
      );
    } catch (e:any) {
      console.log(e)
      if (typeof icon === "string") {
        return <img src={icon} alt="icon" className="w-5 h-5" />;
      }

      if (React.isValidElement(icon)) return icon;
      if (typeof icon === "function") return React.createElement(icon as any);

      return null;
    }
  };

  return (
    <div className="flex items-start gap-4">
      {/* Icon Box */}
      <span className="w-10 h-10 flex items-center justify-center  shrink-0">
        {renderIcon()}
      </span>

      {/* Text */}
      <p className="text-sm text-gray-600 leading-relaxed break-words">
        {text}
      </p>
    </div>
  );
}

