"use client";

import React from "react";

import SpoilQuiz from "@spt/screens/main/spoils/quiz";

export default function CreateQuizPage() {
  return (
    <div>
      <React.Suspense fallback={<div />}> 
        <SpoilQuiz />
      </React.Suspense>
    </div>
  );
}