import React, { useEffect, useRef } from 'react';
import { CRXButton } from '@cb/shared';
import Restricted from '../../../ApplicationPermission/Restricted';
import * as pdfjslib from 'pdfjs-dist'
interface PDFDisplayProps {
    downloadUri: string;
    index: number;
}

const PDFDisplay: React.FC<PDFDisplayProps> = ({downloadUri,index}) => {

  const [canvas, setCanvas] = React.useState<any>();
  const [ctx, setCtx] = React.useState<any>();
  const [pdfDoc, setPdfDoc] = React.useState<any>();
  const [pageNum, setPageNum] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(1);
  const pageRendering = useRef<boolean>(false);
  const pageNumPending  = useRef(null);
  const scale = 0.8;

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = downloadUri;
    link.click();
  };
  useEffect(() => {
    setPageNum(1);
    let canv = document.getElementById('the-canvas'+index) as HTMLCanvasElement;
    setCanvas(canv)
    setCtx(canv?.getContext('2d'));
    pdfjslib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.6.347/build/pdf.worker.js';
    // let pdfjs = await import("pdfjs-dist");
    pdfjslib.getDocument(downloadUri).promise.then(function(pdfdoc) {
      setPdfDoc(pdfdoc);
      setPageCount(pdfdoc.numPages);
    })
    .catch((error : any) => {
      console.log("Jamil: ",error)
    });
  },[downloadUri])
  useEffect(() => {
    if(pdfDoc){
      renderPage(pageNum);
    }
  },[pdfDoc])

  function renderPage(num : number) {
    pageRendering.current = true;
    
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page : any) {
      var viewport = page.getViewport({scale: scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
  
      // Wait for rendering to finish
      renderTask.promise.then(function() {
        pageRendering.current = false;
        if (pageNumPending.current !== null) {
          // New page rendering is pending
          renderPage(pageNumPending.current);
          pageNumPending.current = null;
        }
      });
    });
  
    // Update page counters
    setPageNum(num);
  }

  function queueRenderPage(num : any) {
    if (pageRendering.current) {
        pageNumPending.current = num;
    } else {
        renderPage(num);
    }
  }

  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    setPageNum(pageNum - 1);
    queueRenderPage(pageNum - 1);
  }

  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    setPageNum(pageNum + 1);
    queueRenderPage(pageNum + 1);
  }

  return (
    <>
        <div >
          <div>
            <CRXButton id="prev" onClick={()=>onPrevPage()}>Previous</CRXButton>
            <CRXButton id="next" onClick={()=>onNextPage()}>Next</CRXButton>
            &nbsp; &nbsp;
            <span>Page: <span id="page_num">{pageNum}</span> / <span id="page_count">{pageCount}</span></span>
            <Restricted moduleId={60}>
            <CRXButton color="primary btnPdfDownload" onClick={()=>downloadPdf()} variant="contained"> Download </CRXButton>
            </Restricted>
          </div>

          <canvas id={"the-canvas"+index}></canvas>
        </div>
    </>
  );
}
export default PDFDisplay
