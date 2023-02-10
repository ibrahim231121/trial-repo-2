import React, { useState, useEffect, useRef } from 'react';
import { CRXButton } from '@cb/shared';
import axios from 'axios';
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
  return (
    <div style={{display: 'flex'}}>
      {pdfData.map((x:any)=>
        {return (
          <div  style={{marginRight: '10px', marginLeft: '10px'}}>
            <div><i className="fas fa-file-pdf tumbFontIcon" style={{fontSize: '50px'}}></i></div>
            <CRXButton color="primary" onClick={()=>viewPdf(x)} variant="contained"> PDF View
            </CRXButton>
          </div>
        )}
      )}
    </div>
    
  );
}
export default PDFViewers
