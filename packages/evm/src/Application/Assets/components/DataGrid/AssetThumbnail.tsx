import React from "react";
import thumbImg from "../../../../Assets/Images/thumb.png";

interface Props {
  assetType:string;
  fontSize:string;
  className?:string;
}

export const AssetThumbnailIcon = (data: string) : string => {
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

export const AssetThumbnail: React.FC<Props> = ({ assetType,fontSize,className=' ' }) => {
  return (
    <>
      <div className={"assetThumb " + className}>
        <i
          className={AssetThumbnailIcon(assetType)}
          style={{ fontSize: fontSize }}
        ></i>
        {assetType === "Video" && <img src={thumbImg} alt="Asset Thumb" />}
      </div>
    </>
  );
};

