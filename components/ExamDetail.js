import React, { useEffect, useState, useRef, useCallback } from "react";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PDFViewer from "./PDFViewer";

const ExamDetail = () => {
  return (
    <div>
      {/* <p className="text-2xl">{props.params.ItemId}</p> */}
      <div className="border flex rounded-md w-full justify-center items-center">
        <div className="border-b transition-colors flex justify-center items-center">
          <div className="p-4 align-middle font-medium">Task 1</div>
          <div className="p-4 align-middle ">Task 1 Description</div>
          <div className="p-4 align-middle  hidden md:table-cell">
            01/01/2024
          </div>
          <div className="p-4 align-middle ">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-gray-300 border-gray-300">
              Edit
            </button>
            <button
              className="hover:bg-red-500 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 ml-2 text-gray-300 border-gray-300"
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:Rkplqfnnja:"
              data-state="closed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <PDFViewer pdfPath={"https://arxiv.org/pdf/quant-ph/0410100.pdf"} />
    </div>
  );
};

export default ExamDetail;
