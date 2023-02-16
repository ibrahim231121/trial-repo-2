import React from 'react';
import { CRXButton } from '@cb/shared';
import axios from 'axios';
import CRXCarousel from '../ImageViewer/CRXCarousel';
import { assetdata } from '../../../Application/Assets/Detail/AssetDetailsTemplateModel';
interface PDFViewerProps {
  data: assetdata[];
}

const PDFViewers: React.FC<PDFViewerProps> = ({data}) => {
  const viewPdf = async (data: assetdata) => {
    axios.get(data.files[0]?.downloadUri, { responseType: "blob" })
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
    let dataFormatted: JSX.Element[] = [];
    {data.forEach(x=>
      {dataFormatted.push(
        <div style={{backgroundImage: `url("https://thumbs.dreamstime.com/b/detail-white-brick-wall-texture-109123123.jpg")`}}>
          <div><i className="fas fa-file-pdf tumbFontIcon" style={{fontSize: '50px'}}></i></div>
          <CRXButton color="primary" onClick={()=>viewPdf(x)} variant="contained"> View </CRXButton>
          <CRXButton color="primary" onClick={()=>downloadPdf(x.files[0]?.downloadUri)} variant="contained"> Download </CRXButton>
        </div>
      )}
    )}
    return dataFormatted;
  };

  const imageWithOutButton = () => {
    let dataFormatted: JSX.Element[] = [];
    {data.forEach((x:any)=>
      {dataFormatted.push(
        <div style={{backgroundImage: `url("https://thumbs.dreamstime.com/b/detail-white-brick-wall-texture-109123123.jpg")`}}>
          <div><i className="fas fa-file-pdf tumbFontIcon" style={{fontSize: '50px'}}></i></div>
          <p>{x.filename}</p>
        </div>
      )}
    )}
    return dataFormatted;
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
