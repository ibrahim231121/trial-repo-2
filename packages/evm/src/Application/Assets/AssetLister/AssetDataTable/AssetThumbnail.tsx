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
    case "Doc":
      return <i className="fas fa-file-word tumbFontIcon"></i>;
    case "ExcelDoc":
      return <i className="fas fa-file-excel tumbFontIcon"></i>;
    case "CSVDoc":
      return <i className="fas fa-file-csv tumbFontIcon"></i>;
    case "Audio":
      return <div className="asset_lister_thumb"><i className="fa-regular fa-waveform-lines"></i></div>;
    case "Video":
      return <div className="asset_lister_thumb">
                <div className="_video_play_icon"><span className="icon icon-play4"></span></div>
                <i className="fas fa-solid fa-file-video"></i>
              </div>;
    default:
      return <div className="Unspecified-file-type">
              <i className="fas fa-solid fa-file"></i>
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
      </div>
    </>
  );
};
