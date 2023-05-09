import React from "react";

interface Props {
  assetType: string;
  fileType?: string;
  fontSize?: string;
  className?: string;
  onClick?: any;
}

export const AssetThumbnailIcon = (data: any, fileType: any): any => {
  switch (data) {
    case "Doc":
      if (fileType != undefined || fileType != null) {
        switch (fileType) {
          case "PDFDoc":
            return <i className="fas fa-file-pdf tumbFontIcon"></i>;
          case "ExcelDoc":
            return <i className="fas fa-file-excel tumbFontIcon"></i>;
          case "CSVDoc":
            return <i className="fas fa-file-csv tumbFontIcon"></i>;
          default:
            return <div className="asset_lister_thumb">
              <i className="fas fa-solid fa-file"></i>
            </div>;
        }
      }
      else {
        return <div className="asset_lister_thumb">
              <i className="fas fa-solid fa-file"></i>
            </div>;
      }
    case "Audio":
      return <div className="asset_lister_thumb"><i className="fa-regular fa-waveform-lines"></i></div>;
    case "Video":
      return <div className="asset_lister_thumb">
        <div className="_video_play_icon"><span className="icon icon-play4"></span></div>
        <i className="fas fa-solid fa-file-video"></i>
      </div>;
    default:
      return <div className="asset_lister_thumb">
        <i className="fas fa-solid fa-file"></i>
      </div>;
  }
};

export const AssetBucketThumbnail: React.FC<Props> = ({
  assetType,
  fileType,
  className = " ",
  onClick,
}) => {
  return (
    <>
      <div className={"assetThumb " + className} onClick={onClick}>
        {AssetThumbnailIcon(assetType, fileType)}
      </div>
    </>
  );
};
