import React from "react";
import thumbImg from "../../../../Assets/Images/Getac-Logo-Light-Grey_mb.svg";
import audioIcon from "../../../../Assets/svgs/regular/waveform-lines.svg";

interface Props {
  assetType:string;
  fontSize?:string;
  className?:string;
}

export const AssetThumbnailIcon = (data: string) : string => {
    switch (data) {
        case "PDFDoc":
        return "fas fa-file-pdf tumbFontIcon"
        case "WordDoc":
        return "fas fa-file-word tumbFontIcon"
        case "ExcelDoc":
        return "fas fa-file-excel tumbFontIcon"
        case "CSVDoc":
        return "fas fa-file-csv tumbFontIcon"
        case "Audio":
        return "tumbPlayIcon icon-play3"
        case "Video" :
        return "tumbPlayIcon icon-play3"
        default:
        return "fas fa-file tumbFontIcon"
      }
};

export const AssetThumbnail: React.FC<Props> = ({ assetType,className=' ' }) => {
  return (
    <>
      <div className={"assetThumb " + className}>
        <i
          className={AssetThumbnailIcon(assetType)}
        ></i>
        {assetType === "Video" && <img src={thumbImg} alt="Asset Thumb" className="assetsThumbGetac" />}
        {assetType === 'Audio' && <div className="audioBackground"><img src={audioIcon} /></div>}
      </div>
    </>
  );
};

