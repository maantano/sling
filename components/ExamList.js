"use client";
import React from "react";
import ExamItem from "./ExamItem";
import { usePathname, useRouter } from "next/navigation";

const ExamList = () => {
  return (
    <div>
      <ExamItem id={1} />
      <ExamItem id={2} />
    </div>
  );
};

export default ExamList;
