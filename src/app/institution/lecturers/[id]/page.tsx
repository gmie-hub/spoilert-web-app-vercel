"use client";

import { use } from "react";

import LecturerDetails from "@spt/screens/institution/lecturers/details";

const LecturerDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return <LecturerDetails id={id} />;
};

export default LecturerDetailsPage;
