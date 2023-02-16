import React, { useState, useEffect, useRef } from 'react';
import { CRXButton } from '@cb/shared';
import axios from 'axios';
import CRXCarousel from '../ImageViewer/CRXCarousel';
interface PDFViewerProps {
  pdfMasterData: any;
  pdfChildData: any;
}

const PDFViewers: React.FC<PDFViewerProps> = ({pdfMasterData, pdfChildData}) => {
  const [pdfData, setPdfData] = React.useState<any[]>([]);
  const fpdfDataRef = useRef<any>([]);


  useEffect(() => {
    if(pdfMasterData.length>0){
      let tempfpdfDataRef = fpdfDataRef.current;
      let  tempPdfMasterData = pdfMasterData;
      fpdfDataRef.current = tempPdfMasterData.concat(tempfpdfDataRef)
    }
    if(pdfChildData.length>0){
      let tempfpdfDataRef = fpdfDataRef.current;
      let  tempPdfChildData = pdfChildData;
      fpdfDataRef.current = tempPdfChildData.concat(tempfpdfDataRef)
    }
    if(fpdfDataRef.current.length > 0){
      setPdfData(fpdfDataRef.current);
      fpdfDataRef.current = [];
    }
  }, [pdfMasterData,pdfChildData]);

  const viewPdf = async (data: any) => {
    axios.get(data.downloadUri, { responseType: "blob" })
    .then((res : any) => {
      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    })
    .catch((error : any) => {
      console.log("Error Open PDf: ",error)
    });
  };

  const downloadPdf = (downloadUri: any) => {
    const link = document.createElement("a");
    link.href = downloadUri;
    link.click();
  };

  const imageWithButton = () => {
    let data: JSX.Element[] = [];
    {pdfData.forEach((x:any)=>
      {data.push(
        <div style={{backgroundImage: `url("https://thumbs.dreamstime.com/b/detail-white-brick-wall-texture-109123123.jpg")`}}>
          <div><i className="fas fa-file-pdf tumbFontIcon" style={{fontSize: '50px'}}></i></div>
          <CRXButton color="primary" onClick={()=>viewPdf(x)} variant="contained"> View </CRXButton>
          <CRXButton color="primary" onClick={()=>downloadPdf(x.downloadUri)} variant="contained"> Download </CRXButton>
        </div>
      )}
    )}
    return data;
  };

  const imageWithOutButton = () => {
    let data: JSX.Element[] = [];
    {pdfData.forEach((x:any)=>
      {data.push(
        <div style={{backgroundImage: `url("https://thumbs.dreamstime.com/b/detail-white-brick-wall-texture-109123123.jpg")`}}>
          <div><i className="fas fa-file-pdf tumbFontIcon" style={{fontSize: '50px'}}></i></div>
          <p>{x.filename}</p>
        </div>
      )}
    )}
    return data;
  };

  return (
    <>
      <CRXCarousel
        mainSliderNodes={imageWithButton()}
        indicatorSliderNodes={imageWithOutButton()} />
    </>
  );
}
export default PDFViewers
