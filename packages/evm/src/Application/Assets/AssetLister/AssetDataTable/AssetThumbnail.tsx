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
      return <div className="asset_lister_thumb">
              <div className="_video_play_icon"><span className="icon icon-play4"></span></div>
              <i className="fas fa-solid fa-file-video"></i>
            </div>;
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
          // <img src={thumbImg} alt="Asset Thumb" className="assetsThumbGetac" />
          <div className="asset_lister_thumb">
            <i className="fas fa-solid fa-file-video"></i>
          </div>
        )}
        {assetType === "Audio" && (
          // <div className="audioBackground">
          //   <img src={audioIcon} />
          // </div>
          <div className="asset_lister_thumb">
            <i className="fas fa-solid fa-file-video"></i>
          </div>
        )}
      </div>
    </>
  );
};
