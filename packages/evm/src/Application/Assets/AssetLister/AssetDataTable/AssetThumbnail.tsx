import React from "react";
import thumbImg from "../../../../Assets/Images/Getac-Logo-Light-Grey_mb.svg";
import audioIcon from "../../../../Assets/svgs/regular/waveform-lines.svg";
import thumb from "../../../../../src/Assets/Images/thumbb.png";

interface Props {
  assetType: string;
  fontSize?: string;
  className?: string;
  onClick?: any;
}

export const AssetThumbnailIcon = (data: any): any => {
  switch (data) {
    case "PDFDoc":
      return <i className="fas fa-file-pdf tumbFontIcon"></i>;
    case "WordDoc":
      return <i className="fas fa-file-word tumbFontIcon"></i>;
    case "ExcelDoc":
      return <i className="fas fa-file-excel tumbFontIcon"></i>;
    case "CSVDoc":
      return <i className="fas fa-file-csv tumbFontIcon"></i>;
    case "Audio":
      return <i className="tumbPlayIcon icon icon-play4"></i>;
    case "Video":
      return <i className="tumbPlayIcon icon icon-play4"></i>;
    default:
      return <img src={thumb} />;
  }
};

export const AssetThumbnail: React.FC<Props> = ({
  assetType,
  className = " ",
  onClick,
}) => {
  return (
    <>
      <div className={"assetThumb " + className} onClick={onClick}>
        {AssetThumbnailIcon(assetType)}
        {assetType === "Video" && (
          <img src={thumbImg} alt="Asset Thumb" className="assetsThumbGetac" />
        )}
        {assetType === "Audio" && (
          <div className="audioBackground">
            <img src={audioIcon} />
          </div>
        )}
      </div>
    </>
  );
};
