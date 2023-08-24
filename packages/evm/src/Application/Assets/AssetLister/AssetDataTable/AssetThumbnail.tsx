import React from "react";
import { CheckEvidenceExpire } from "../../../../GlobalFunctions/CheckEvidenceExpire";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { FILE_SERVICE_URL_V2 } from "../../../../utils/Api/url";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import defaultThumbnailImage from "../../../../Assets/Images/thumb.png";
interface Props {
  assetName:string;
  assetType: string;
  fileType?: string;
  accessCode?: string;
  fontSize?: string;
  className?: string;
  onClick?: any;
  evidence? : any;
  asset?: any
  isAssetLister? : boolean;
  isRestricted? : boolean;
}

export const AssetThumbnailIcon = (assetName:any,  data: any, fileType: any, accessCode:any, isExpired : boolean): any => {
  const videoIcon = <i className="fas fa-solid fa-file-video"></i>;
  const [videoElement, setVideoElement] = React.useState(videoIcon);
  const { tenantId } = React.useContext(ApplicationPermissionContext);
  const [src, setSrc] = React.useState('');
  React.useEffect(() => {
    if (fileType === 'Video' || fileType === 'Image')
       setSrc(`${FILE_SERVICE_URL_V2}/Files/FetchThumbnail/${assetName}/${accessCode}/${tenantId}/${fileType === 'Video'}`);
  }, []);

  React.useEffect(() => {
    if (src !== '') {
      const imageTag = <img src={src} alt="Alt Text" onError={() => {
        setSrc(defaultThumbnailImage);
      }} />;
      setVideoElement(imageTag);
    }
  }, [src]);

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
      return <div className="asset_lister_thumb">
        <i className="fa-regular fa-waveform-lines"></i></div>;
    case "Video":
      if (isExpired && isExpired == true) {
        return <div className="asset_lister_thumb">
          {videoElement}
        </div>;
      }
      else {
        return <div className="asset_lister_thumb">
          <div className="_video_play_icon">
            <span className="icon icon-play4"></span>
          </div>
          {videoElement}
        </div>;
      }
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

const isLockIconShow = (asset : SearchModel.Asset) : boolean => {
  if(asset.lock)
    return true;
  return false;
}

export const AssetThumbnail: React.FC<Props> = ({
  assetName,
  assetType,
  fileType,
  accessCode,
  className = " ",
  onClick,
  evidence,
  asset,
  isAssetLister,
  isRestricted,
}) => {
  let isExpired = CheckEvidenceExpire(evidence) ? true : false;
  let assetLockCheck = asset ? isLockIconShow(asset) ? "RESTRICTED" : "" : "";
  let evidenceLockCheck = evidence ? evidence?.masterAsset?.lock ? "RESTRICTED" : "" : "";
  let restricted = assetLockCheck.length > 0 ? assetLockCheck : (isAssetLister && evidenceLockCheck.length > 0) ? evidenceLockCheck : "";
  
  let evidenceExpire = isExpired ? "EXPIRED" : "";
  let indicator = isExpired ? evidenceExpire : restricted;
  let dynamicClassName = indicator == "EXPIRED" ? "assetIndTxt-exp" : indicator == "RESTRICTED" ? "assetIndTxt-res" : "";
  if(isRestricted == true)
  {
    indicator = "RESTRICTED";
    dynamicClassName = "assetIndTxt-res";
  } 

  return (
    <>
      <div className={"assetThumb " + className} onClick={onClick}>
        {AssetThumbnailIcon(assetName, assetType, fileType, accessCode, isExpired)}
        <span className={dynamicClassName}>{indicator}</span>
      </div>
    </>
  );
};
