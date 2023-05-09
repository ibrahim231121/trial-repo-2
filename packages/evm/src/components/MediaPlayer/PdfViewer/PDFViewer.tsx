import React, { useEffect, useRef } from 'react';
import { CRXButton } from '@cb/shared';
import axios from 'axios';
import PDFCarousel from './PDFCarousel';
import { assetdata } from '../../../Application/Assets/Detail/AssetDetailsTemplateModel';
import Restricted from '../../../ApplicationPermission/Restricted';
import * as pdfjslib from 'pdfjs-dist'
import PDFDisplay from './PDFDisplay';
interface PDFViewerProps {
  data: assetdata[];
}

const PDFViewers: React.FC<PDFViewerProps> = ({data}) => {

  // const viewPdf = async (data: assetdata) => {
    
  //   axios.get(data.files[0]?.downloadUri, { responseType: "blob" })
  //   .then(async (res : any) => {
  //     const file = new Blob([res.data], { type: "application/pdf" });
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL);
  //   })
  //   .catch((error : any) => {
  //     console.log("Error Open PDf: ",error)
  //   });
  // };

  const imageWithButton = () => {
    let dataFormatted: JSX.Element[] = [];
    {data.forEach((x: assetdata,index: number)=>
      {dataFormatted.push(
        <>
         <PDFDisplay downloadUri={x.files[0]?.downloadUri} index={index} />
        </>
      )}
    )}
    return dataFormatted;
  };

  const imageWithOutButton = () => {
    let dataFormatted: JSX.Element[] = [];
    {data.forEach(x=>
      {dataFormatted.push(
        <div className='pdfImageDiv' style={{backgroundImage: `url("https://thumbs.dreamstime.com/b/detail-white-brick-wall-texture-109123123.jpg")`}}>
          <div className='InnerPdfScroll'>
              <div><i className="fas fa-file-pdf tumbFontIcon" style={{fontSize: '50px'}}></i></div>
              <p>{x.files[0]?.filename}</p>
          </div>
        </div>
      )}
    )}
    return dataFormatted;
  };

  return (
    <>
      <PDFCarousel
        mainSliderNodes={imageWithButton()}
        indicatorSliderNodes={imageWithOutButton()}
        data={data}
        />
    </>
  );
}
export default PDFViewers
