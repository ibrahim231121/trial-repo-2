import React from "react";
import thumbImg from "../../../../Assets/Images/thumb.png";

interface Props {
  rowData:string;
  fontSize:string;
  className?:string;
}

const AssetThumbnailIcon = (data: string) => {
    switch (data) {
        case "PDFDoc":
        return "fas fa-file-pdf"
        case "WordDoc":
        return "fas fa-file-word"
        case "ExcelDoc":
        return "fas fa-file-excel"
        case "CSVDoc":
        return "fas fa-file-csv"
        case "Audio":
        return "fas fa-file-audio "
        case "Video" :
        return "tumbPlayIcon icon-play3"
        default:
        return "fas fa-file"
      }
};
const AssetThumbnail: React.FC<Props> = ({ rowData,fontSize,className=' ' }) => {
  return (
    <>
      <div className={"assetThumb " + className}>
        <i
          className={AssetThumbnailIcon(rowData)}
          style={{ fontSize: fontSize }}
        ></i>
        {rowData === "Video" && <img src={thumbImg} alt="Asset Thumb" />}
      </div>
    </>
  );
};
export default AssetThumbnail;
