"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ExamDetail from "../../../../components/ExamDetail";

const page = (props) => {
  console.log(props);
  return (
    <div className="w-[80%]">
      <p className="text-2xl">{props.params.ItemId}</p>
      <ExamDetail />
    </div>
  );
};

export default page;
