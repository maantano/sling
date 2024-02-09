import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { Pagination, Button } from "@mui/material";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import "./pdf.css";

const PDFViewer = ({ pdfPath }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [originDoc, setOriginDoc] = useState(null);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const renderPage = useCallback(
    async (pageNum) => {
      try {
        if (!originDoc) return;

        const currentPage = await originDoc.getPage(pageNum);
        const viewport = currentPage.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const { width, height } = viewport;
        setCanvasWidth(width);
        setCanvasHeight(height);
        canvas.width = width;
        canvas.height = height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await currentPage.render(renderContext).promise;
      } catch (error) {
        console.log("Error rendering page:", error);
      }
    },
    [originDoc, scale]
  );

  const getPDF = useCallback(async (pdfPath) => {
    try {
      const loadingTask = pdfjsLib.getDocument(pdfPath);
      const doc = await loadingTask.promise;
      const totalPage = doc.numPages;
      setTotal(totalPage);
      setOriginDoc(doc);
    } catch (e) {
      console.log("Error loading PDF:", e);
      setError(true);
    }
  }, []);

  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.1)); // 최소 크기 0.1으로 제한
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - startPos.x;
      const deltaY = event.clientY - startPos.y;
      setOffset((prevOffset) => ({
        x: prevOffset.x + deltaX,
        y: prevOffset.y + deltaY,
      }));
      setStartPos({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getPDF(pdfPath);
  }, [pdfPath]);

  useEffect(() => {
    if (originDoc) {
      renderPage(currentPage);
    }
  }, [originDoc, renderPage, currentPage]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mt-4 mb-2">
        {/* <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 text-gray-500 border-gray-400"
          onClick={handleZoomIn}
        >
          확대
        </button>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 text-gray-500 border-gray-400 ml-3"
          onClick={handleZoomOut}
        >
          축소
        </button> */}
      </div>
      {/* <div className="self-start mb-3 text-sm"> */}
      <div className="flex  self-stretch justify-between mb-3 text-sm">
        <div>
          <div>총 페이지 : {total}</div>
          <div>현재 페이지 : {currentPage}</div>
        </div>
        <div>
          <button
            className="zoom inline-flex items-center justify-center font-medium  h-9 rounded-md px-3 ml-3"
            onClick={handleZoomIn}
          >
            확대
          </button>
          <button
            className="zoom inline-flex items-center justify-center font-medium  h-9 rounded-md px-3 ml-3"
            onClick={handleZoomOut}
          >
            축소
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="pdf-container border border-gray-200 rounded-md overflow-auto"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          paddingLeft: "calc((100% - " + canvasWidth * scale + "px) / 2)", // 왼쪽 여백 조정
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="pdf-content pdf-container"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            marginLeft: `${offset.x}px`,
            marginTop: `${offset.y}px`,
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
      <Pagination
        className="my-16"
        count={total}
        page={currentPage}
        onChange={handlePageChange}
      />
      {error && (
        <div style={{ height: "100%", margin: "5px auto" }}>
          PDF 로딩에 실패했습니다.
        </div>
      )}
    </div>
  );
};

export default PDFViewer;

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import { Pagination, Button } from "@mui/material";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// import "./pdf.css";

// const PDFViewer = ({ pdfPath }) => {
//   const containerRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [total, setTotal] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [originDoc, setOriginDoc] = useState(null);
//   const [error, setError] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });
//   const [offset, setOffset] = useState({ x: 0, y: 0 });

//   const renderPage = useCallback(
//     async (pageNum) => {
//       try {
//         if (!originDoc) return;

//         const currentPage = await originDoc.getPage(pageNum);
//         const viewport = currentPage.getViewport({ scale });
//         const canvas = canvasRef.current;
//         const context = canvas.getContext("2d");
//         const { width, height } = viewport;
//         setCanvasWidth(width);
//         setCanvasHeight(height);
//         canvas.width = width;
//         canvas.height = height;

//         const renderContext = {
//           canvasContext: context,
//           viewport: viewport,
//         };
//         await currentPage.render(renderContext).promise;
//       } catch (error) {
//         console.log("Error rendering page:", error);
//       }
//     },
//     [originDoc, scale]
//   );

//   const getPDF = useCallback(async (pdfPath) => {
//     try {
//       const loadingTask = pdfjsLib.getDocument(pdfPath);
//       const doc = await loadingTask.promise;
//       const totalPage = doc.numPages;
//       setTotal(totalPage);
//       setOriginDoc(doc);
//     } catch (e) {
//       console.log("Error loading PDF:", e);
//       setError(true);
//     }
//   }, []);

//   const handleZoomIn = () => {
//     setScale(scale + 0.1);
//   };

//   const handleZoomOut = () => {
//     setScale(Math.max(scale - 0.1, 1)); // 최소 크기 0.1으로 제한
//   };

//   const handleMouseDown = (event) => {
//     setIsDragging(true);
//     setStartPos({ x: event.clientX, y: event.clientY });
//   };

//   const handleMouseMove = (event) => {
//     if (isDragging) {
//       const deltaX = event.clientX - startPos.x;
//       const deltaY = event.clientY - startPos.y;
//       setOffset((prevOffset) => ({
//         x: prevOffset.x + deltaX,
//         y: prevOffset.y + deltaY,
//       }));
//       setStartPos({ x: event.clientX, y: event.clientY });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handlePageChange = (event, page) => {
//     setCurrentPage(page);
//   };

//   useEffect(() => {
//     getPDF(pdfPath);
//   }, [pdfPath]);

//   useEffect(() => {
//     if (originDoc) {
//       renderPage(currentPage);
//     }
//   }, [originDoc, renderPage, currentPage]);

//   return (
//     // <div style={{ width: "100%", height: "100%", position: "relative" }} >
//     <div className="flex flex-col items-center justify-center">
//       <div
//         className="mt-4 mb-2"
//       >
//         <button
//           className=" inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 text-gray-500 border-gray-400"
//           onClick={handleZoomIn}
//         >
//           확대
//         </button>
//         <button
//           className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 text-gray-500 border-gray-400 ml-3"
//           onClick={handleZoomOut}
//         >
//           축소
//         </button>
//       </div>
//       <div
//         ref={containerRef}
//         className="pdf-container  border border-gray-200 rounded-md over"
//         style={{
//           width: "100%",
//           height: "100%",
//           overflow: "auto",
//           position: "relative",
//         }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//       >
//         <div
//           className="pdf-content flex items-center justify-center"
//           style={{
//             transform: `scale(${scale})`,
//             transformOrigin: "top left",
//             marginLeft: `${offset.x}px`,
//             marginTop: `${offset.y}px`,
//           }}
//         >
//           <canvas ref={canvasRef} />
//         </div>
//       </div>

//       <Pagination
//         className="my-16"
//         count={total}
//         page={currentPage}
//         onChange={handlePageChange}
//       />
//       {error && (
//         <div style={{ height: "100%", margin: "5px auto" }}>
//           PDF 로딩에 실패했습니다.
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFViewer;

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import { Pagination } from "@mui/material";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// const PDFViewer = ({ pdfPath }) => {
//   const containerRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [total, setTotal] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [originDoc, setOriginDoc] = useState(null);
//   const [error, setError] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [canvasWidth, setCanvasWidth] = useState(0);
//   const [canvasHeight, setCanvasHeight] = useState(0);

//   const renderPage = useCallback(
//     async (pageNum) => {
//       try {
//         if (!originDoc) return;

//         const currentPage = await originDoc.getPage(pageNum);
//         const viewport = currentPage.getViewport({ scale });
//         const canvas = canvasRef.current;
//         const context = canvas.getContext("2d");
//         const { width, height } = viewport;
//         setCanvasWidth(width);
//         setCanvasHeight(height);
//         canvas.width = width;
//         canvas.height = height;

//         const renderContext = {
//           canvasContext: context,
//           viewport: viewport,
//         };
//         await currentPage.render(renderContext).promise;
//       } catch (error) {
//         console.log("Error rendering page:", error);
//       }
//     },
//     [originDoc, scale]
//   );

//   const getPDF = useCallback(async (pdfPath) => {
//     try {
//       const loadingTask = pdfjsLib.getDocument(pdfPath);
//       const doc = await loadingTask.promise;
//       const totalPage = doc.numPages;
//       setTotal(totalPage);
//       setOriginDoc(doc);
//     } catch (e) {
//       console.log("Error loading PDF:", e);
//       setError(true);
//     }
//   }, []);

//   const handleZoomIn = () => {
//     setScale(scale + 0.5);
//   };

//   const handleZoomOut = () => {
//     setScale(scale - 0.5);
//   };

//   useEffect(() => {
//     getPDF(pdfPath);
//   }, [pdfPath]);

//   useEffect(() => {
//     if (originDoc) {
//       renderPage(1);
//     }
//   }, [originDoc, renderPage]);

//   const onPageChange = async (event, page) => {
//     setCurrentPage(page);
//     await renderPage(page);
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="flex flex-col items-center"
//       style={{
//         overflow: "hidden",
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {error && (
//         <div style={{ height: "100%", margin: "5px auto" }}>
//           pdf 로딩에 실패했습니다.
//         </div>
//       )}
//       <div> total: {total}</div>
//       <button onClick={handleZoomIn}>+</button>
//       <button onClick={handleZoomOut}>-</button>
//       <div style={{ position: "relative" }}>
//         <canvas ref={canvasRef} />
//       </div>
//       <Pagination count={total} page={currentPage} onChange={onPageChange} />
//     </div>
//   );
// };

// export default PDFViewer;

// ====================================================
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import { Pagination } from "@mui/material";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// const PDFViewer = ({ pdfPath }) => {
//   const canvasRef = useRef(null);
//   const [total, setTotal] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [originDoc, setOriginDoc] = useState(null);
//   const [error, setError] = useState(false);
//   const [scale, setScale] = useState(1);

//   const renderPage = useCallback(
//     async (pageNum) => {
//       try {
//         if (!originDoc) return;

//         const currentPage = await originDoc.getPage(pageNum);
//         const viewport = currentPage.getViewport({ scale });
//         const canvas = canvasRef.current;
//         const context = canvas.getContext("2d");
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         console.log("canvas ===>", canvas);
//         console.log("canvas.width ===>", canvas.width);
//         console.log("canvas.height ===>", canvas.height);
//         console.log("viewport ===>", viewport);

//         const renderContext = {
//           canvasContext: context,
//           viewport: viewport,
//         };
//         await currentPage.render(renderContext).promise;
//         if (canvasRef.current) {
//           canvasRef.current.innerHTML = "";
//         }
//         if (canvasRef.current) {
//           canvasRef.current.appendChild(canvas);
//         }
//       } catch (error) {}
//     },
//     [originDoc, scale]
//   );

//   //   const renderPage = useCallback(
//   //     async (pageNum) => {
//   //       try {
//   //         if (!originDoc) return;

//   //         const currentPage = await originDoc.getPage(pageNum);
//   //         const viewport = currentPage.getViewport({ scale:1 });
//   //         const canvas = canvasRef.current;
//   //         const context = canvas.getContext("2d");
//   //         canvas.width = viewport.width;
//   //         canvas.height = viewport.height;

//   //         const renderContext = {
//   //           canvasContext: context,
//   //           viewport: viewport,
//   //         };
//   //         await currentPage.render(renderContext).promise;
//   //       } catch (error) {}
//   //     },
//   //     [originDoc]
//   //   );

//   const getPDF = useCallback(
//     async (pdfPath) => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(pdfPath);
//         const doc = await loadingTask.promise;
//         const totalPage = doc.numPages;
//         setTotal(totalPage);
//         setOriginDoc(doc);
//         // renderPage(1);
//       } catch (e) {
//         console.log(e);
//         setError(true);
//       }
//     },
//     // [renderPage]
//     []
//   );

//   const onChangeScale = useCallback(async () => {
//     try {
//       const currentPage = await doc.getPage(page);
//       const viewport = currentPage.getViewport({ scale });

//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       const renderContext = {
//         canvasContext: context,
//         viewport: viewport,
//       };
//       await currentPage.render(renderContext).promise;
//       if (canvasRef.current) {
//         canvasRef.current.innerHTML = "";
//       }
//       if (canvasRef.current) {
//         canvasRef.current.appendChild(canvas);
//       }
//     } catch (error) {
//       setLoadingError(`${page}번째 페이지 로딩 실패: ${error.message}`);
//     }
//   }, [scale]);

//   useEffect(() => {
//     getPDF(pdfPath);
//   }, [pdfPath]);
//   useEffect(() => {
//     if (originDoc) {
//       renderPage(1);
//     }
//   }, [originDoc, renderPage]);

//   const onPageChange = async (event, page) => {
//     setCurrentPage(page);
//     await renderPage(page);
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {error && (
//         <div style={{ height: "100%", margin: "5px auto" }}>
//           pdf 로딩에 실패했습니다.
//         </div>
//       )}
//       <div> total: {total}</div>
//       <button onClick={() => setScale(scale + 0.5)}>+</button>
//       <button onClick={() => setScale(scale - 0.5)}>-</button>
//       {/* <canvas ref={canvasRef} style={{ height: "100vh" }} /> */}
//       <canvas ref={canvasRef} style={{ margin: "5px auto" }} />

//       <Pagination count={total} page={currentPage} onChange={onPageChange} />
//     </div>
//   );
// };
// export default PDFViewer;

// ====================================================
// // MULTI PAGES
// import React, { useCallback, useEffect, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import Page from "./Page";
// import { Pagination } from "@mui/material";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// const PDFViewer = ({ pdfPath }) => {
//   const [pages, setPages] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [error, setError] = useState(false);
//   const [scale, setScale] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const onLoadSuccess = () => {
//     console.log(`pdf 로딩 성공`);
//     setError(false);
//   };

//   const onLoadFail = (e) => {
//     console.log(`pdf 로딩 실패!: ${e}`);
//     setError(true);
//   };
//   const renderPDF = useCallback(
//     async (pdfPath) => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(pdfPath);
//         const doc = await loadingTask.promise;
//         const totalPage = doc.numPages;
//         setTotal(totalPage);
//         if (totalPage === 0) {
//           throw new Error(`전체 페이지가 0`);
//         }
//         const pageArr = Array.from(Array(totalPage + 1).keys()).slice(1);
//         const allPages = pageArr.map((i) => (
//           <Page doc={doc} page={i} key={i} scale={scale} />
//         ));
//         setPages(allPages);

//         onLoadSuccess();
//       } catch (e) {
//         onLoadFail(e);
//       }
//     },
//     [scale]
//   );

//   useEffect(() => {
//     renderPDF(pdfPath);
//   }, [pdfPath, scale]);

//   const onPageChange = (event, page) => {
//     setCurrentPage(page);
//   };
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         overflow: "scroll",
//       }}
//       id="canvas-scroll"
//     >
//       {error && (
//         <div style={{ height: "100%", margin: "5px auto" }}>
//           pdf 로딩에 실패했습니다.
//         </div>
//       )}
//       <div> total: {total}</div>
//       <button onClick={() => setScale(scale + 0.5)}>+</button>
//       <button onClick={() => setScale(scale - 0.5)}>-</button>
//       {pages}
//       <Pagination count={total} page={currentPage} onChange={onPageChange} />
//     </div>
//   );
// };

// export default PDFViewer;
