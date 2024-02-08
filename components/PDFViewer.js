// ====================================================
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { Pagination } from "@mui/material";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const PDFViewer = ({ pdfPath }) => {
  const canvasRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [originDoc, setOriginDoc] = useState(null);
  const [error, setError] = useState(false);

  const renderPage = useCallback(
    async (pageNum) => {
      try {
        if (!originDoc) return;

        const currentPage = await originDoc.getPage(pageNum);
        const viewport = currentPage.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await currentPage.render(renderContext).promise;
      } catch (error) {}
    },
    [originDoc]
  );

  const getPDF = useCallback(
    async (pdfPath) => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const doc = await loadingTask.promise;
        const totalPage = doc.numPages;
        setTotal(totalPage);
        setOriginDoc(doc);
        // renderPage(1);
      } catch (e) {
        console.log(e);
        setError(true);
      }
    },
    // [renderPage]
    []
  );

  useEffect(() => {
    getPDF(pdfPath);
  }, [pdfPath]);
  useEffect(() => {
    if (originDoc) {
      renderPage(1);
    }
  }, [originDoc, renderPage]);

  const onPageChange = async (event, page) => {
    setCurrentPage(page);
    await renderPage(page);
  };

  return (
    <div>
      {error && (
        <div style={{ height: "100%", margin: "5px auto" }}>
          pdf 로딩에 실패했습니다.
        </div>
      )}
      <div> total: {total}</div>
      <canvas ref={canvasRef} style={{ height: "100vh" }} />
      <Pagination count={total} page={currentPage} onChange={onPageChange} />
    </div>
  );
};
export default PDFViewer;

// MULTI PAGES
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
