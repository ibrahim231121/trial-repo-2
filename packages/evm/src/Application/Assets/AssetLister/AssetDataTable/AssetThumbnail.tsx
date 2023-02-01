import React, {useState, useEffect} from "react";
import thumbImg from "../../../../Assets/Images/Getac-Logo-Light-Grey_mb.svg";
import audioIcon from "../../../../Assets/svgs/regular/waveform-lines.svg";
import thumb from "../../../../../src/Assets/Images/thumbb.png";
import { FileAgent } from '../../../../utils/Api/ApiAgent';
interface Props {
  assetName:string;
  assetType: string;
  fileType?: string;
  fontSize?: string;
  className?: string;
  onClick?: any;
}

export const AssetThumbnailIcon = (assetName:any,  data: any, fileType: any): any => {

  const videoIcon = <i className="fas fa-solid fa-file-video"></i>
   const [videoElement , setVideoElement] = useState(videoIcon);

   useEffect(()=>{
    if(fileType === 'Video'){
      FileAgent.getThumbnail(assetName)
              .then(res=> {
                console.log(" Thumbnail Res ");
                console.log(res);
                var base64Flag = 'data:image/jpeg;base64,';
                if(res.bytes !== '' ){
                  var imageData = base64Flag + res.bytes
                  var imageTag = <img src={imageData} alt="Alt Text"  />
                  setVideoElement(imageTag);
                }
              })
               
    }
   },[])
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
            return <div className="Unspecified-file-type">
              <i className="fas fa-solid fa-file"></i>
            </div>;
        }
      }
      else {
        return <div className="Unspecified-file-type">
              <i className="fas fa-solid fa-file"></i>
            </div>;
      }



    case "Audio":
      return <div className="asset_lister_thumb"><i className="fa-regular fa-waveform-lines"></i></div>;
    case "Video":
      return <div className="asset_lister_thumb">
        <div className="_video_play_icon">
          <span className="icon icon-play4"></span>
        </div>
        {videoElement}
      </div>;
    default:
      return <div className="Unspecified-file-type">
        <i className="fas fa-solid fa-file"></i>
      </div>;
  }
};

export const AssetThumbnail: React.FC<Props> = ({
  assetName,
  assetType,
  fileType,
  className = " ",
  onClick,
}) => {
  return (
    <>
      <div className={"assetThumb " + className} onClick={onClick}>
        {AssetThumbnailIcon(assetName, assetType, fileType)}
      </div>
    </>
  );
};
