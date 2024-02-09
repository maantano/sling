import React, { useEffect, useState, useRef, useCallback } from "react";

import PDFViewer from "./PDFViewer";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
const label = { inputProps: { "aria-label": "Switch demo" } };

const ExamDetail = () => {
  const [value, setValue] = React.useState("female");
  const [editStatus, setEditStatus] = useState(false);
  const [title, setTitle] = useState("제목 내용");
  const [publish, setPublish] = useState(true);
  const [grade, setGrade] = useState("6학년");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleEdit = () => {
    setEditStatus((prev) => !prev);
  };
  return (
    <div className="h-20">
      {/* <p className="text-2xl">{props.params.ItemId}</p> */}
      {editStatus ? (
        <div className="border rounded-md w-full h-20 flex flex-col justify-center">
          <div className=" transition-colors flex justify-evenly items-center">
            <div className="p-4 align-middle font-medium">
              <TextField
                id="standard-basic"
                label="제목"
                variant="standard"
                value={title}
              />
            </div>
            <div className="p-4 align-middle flex items-center justify-center">
              <div>공개 수정 :</div>
              <Switch {...label} checked={publish} />
            </div>
            <div className="p-4 align-middle  hidden md:table-cell">
              학년 : {grade}
            </div>
            <div className="p-4 ">
              <button
                className="edit font-medium inline-flex items-center justify-center h-9 rounded-md px-3 "
                onClick={handleEdit}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-md w-full h-20 flex flex-col justify-center">
          <div className="transition-colors flex justify-evenly items-center">
            <div className="p-4 align-middle font-medium">제목 : {title}</div>
            <div className="p-4 align-middle ">
              공개 여부 : {publish ? "공개" : "비공개"}
            </div>
            {/* <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              공개 여부
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <div className="flex">
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </div>
            </RadioGroup>
          </FormControl> */}
            <div className="p-4 align-middle  hidden md:table-cell">
              학년 : {grade}
            </div>
            <div className="p-4 ">
              <button
                className="edit font-medium inline-flex items-center justify-center h-9 rounded-md px-3 "
                onClick={handleEdit}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="border flex rounded-md w-full justify-evenly items-center">
        <div className="border-b transition-colors flex justify-center items-center">
          <div className="p-4 align-middle font-medium">
            제목 : 1234123412341234
          </div>
          <div className="p-4 align-middle ">공개 여부 : 공개</div>
          <div className="p-4 align-middle  hidden md:table-cell">
            학년 : 학년
          </div>
          <div className="p-4 ">
            <button
              className=" inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background  h-9 rounded-md px-3 text-gray-500 border-gray-400"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </div>
      </div> */}
      <PDFViewer pdfPath={"https://arxiv.org/pdf/quant-ph/0410100.pdf"} />
    </div>
  );
};

export default ExamDetail;
