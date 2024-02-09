"use client";
import React from "react";
import ExamItem from "./ExamItem";

const ExamList = ({ examList }) => {
  return (
    <div>
      {examList.data.map((item, idx) => (
        <ExamItem key={idx} data={item} />
      ))}
    </div>
  );
};

export default ExamList;
