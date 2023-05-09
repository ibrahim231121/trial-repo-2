import React, {useState, useEffect} from "react";
import { FileAgent } from '../../../../utils/Api/ApiAgent';
import { addAssetThumbnail, getAssetThumbnail } from "../../../../Redux/AssetThumbnailReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";
interface Props {
  assetName:string;
  assetType: string;
  fileType?: string;
  accessCode?: string;
  fontSize?: string;
  className?: string;
  onClick?: any;
}

export const AssetThumbnailIcon = (assetName:any,  data: any, fileType: any, accessCode:any): any => {

  const dispatch = useDispatch();
  const videoIcon = <i className="fas fa-solid fa-file-video"></i>
   const [videoElement , setVideoElement] = useState(videoIcon);

   const assetThumbnails: any = useSelector(
    (state: RootState) => state.assetThumbnail.assetThumbnailData
  );

   useEffect(()=>{
    if(fileType === 'Video' || fileType === 'Image'){
      if(assetThumbnails.map((x:any) => x.assetName).includes(assetName)) {
        var assetThumbnail = assetThumbnails.filter((x:any) => x.assetName == assetName)
        var base64Flag = 'data:image/jpeg;base64,';
                if(assetThumbnail[0].Bytes !== '' ){
                  var imageData = base64Flag + assetThumbnail[0].Bytes
                  
                  var imageTag = <img src={imageData} alt="Alt Text"  />
                  setVideoElement(imageTag);
                }
      }
      else {
        let isVideoFile = fileType === 'Video';
        FileAgent.getThumbnail(assetName,accessCode,isVideoFile)
          .then(res=> {
            var base64Flag = 'data:image/jpeg;base64,';
            if(res.bytes !== '' ){
              var imageData = base64Flag + res.bytes
              var imageTag = <img src={imageData} alt="Alt Text"  />
              setVideoElement(imageTag);
              dispatch(addAssetThumbnail({assetName:assetName, Bytes:res.bytes}));
            }
          })
        }
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
          case "WordDoc":
            return <i className="fas fa-file-word tumbFontIcon"></i>;
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
    case "AudioOnly":
      return <div className="asset_lister_thumb"><i className="fa-regular fa-waveform-lines"></i></div>;
    case "Video":
      return <div className="asset_lister_thumb">
        <div className="_video_play_icon">
          <span className="icon icon-play4"></span>
        </div>
        {videoElement}
      </div>;
      case "Image":
        return <div className="asset_lister_thumb">
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
  accessCode,
  className = " ",
  onClick,
}) => {
  
  return (
    <>
      <div className={"assetThumb " + className} onClick={onClick}>
        {AssetThumbnailIcon(assetName, assetType, fileType,accessCode)}
      </div>
    </>
  );
};
