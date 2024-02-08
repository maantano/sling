// MULTIPAGES
// import { PDFDocumentProxy } from "pdfjs-dist";
// import React, { useCallback, useEffect, useRef } from "react";

// const Page = ({ page, doc, scale = 1 }) => {
//   //   console.log("page,doc,scale ====>", page, doc, scale);
//   const canvasRef = useRef(null);

//   const drawCanvas = useCallback(
//     ({ width, height }) => {
//       console.log("drawCanvas!!!!");
//       if (!canvasRef.current) {
//         throw new Error("canvasRef가 없음");
//       }
//       const canvas = canvasRef.current;
//       canvas.width = width;
//       canvas.height = height;

//       const context = canvas.getContext("2d");
//       if (context) {
//         return context;
//       } else {
//         throw new Error("canvas context가 없음");
//       }
//     },
//     [canvasRef]
//   );

//   const renderPage = useCallback(async () => {
//     try {
//       const currentPage = await doc.getPage(page);
//       const viewport = currentPage.getViewport({ scale });
//       const context = drawCanvas({
//         width: viewport.width,
//         height: viewport.height,
//       });

//       const renderContext = {
//         canvasContext: context,
//         viewport: viewport,
//       };
//       await currentPage.render(renderContext).promise;
//     } catch (e) {
//       throw new Error(`${page}번째 페이지 로딩 실패`);
//     }
//   }, [doc, page, scale, drawCanvas]);

//   useEffect(() => {
//     renderPage();
//   }, [renderPage]);

//   return <canvas ref={canvasRef} style={{ margin: "5px auto" }} width={800} />;
// };

// export default Page;

import React, { useCallback, useEffect, useRef, useState } from "react";

const Page = ({ page, doc, scale = 1 }) => {
  const canvasRef = useRef(null);
  const [loadingError, setLoadingError] = useState(null);

  const drawCanvas = useCallback(({ width, height }) => {
    if (!canvasRef.current) {
      throw new Error("canvasRef가 없음");
    }
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("canvas context가 없음");
    }

    return context;
  }, []);

  const renderPage = useCallback(async () => {
    try {
      const currentPage = await doc.getPage(page);
      const viewport = currentPage.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await currentPage.render(renderContext).promise;
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
      }
      if (canvasRef.current) {
        canvasRef.current.appendChild(canvas);
      }
    } catch (error) {
      setLoadingError(`${page}번째 페이지 로딩 실패: ${error.message}`);
    }
  }, [doc, page, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  if (loadingError) {
    return <div>{loadingError}</div>;
  }

  return <div ref={canvasRef} style={{ margin: "5px auto" }} />;
};

export default Page;
