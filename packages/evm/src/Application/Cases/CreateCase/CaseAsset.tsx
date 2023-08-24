import { FC } from "react";
import { CRXCheckBox, CRXTruncation } from "@cb/shared";
import { AssetThumbnail } from "../../Assets/AssetLister/AssetDataTable/AssetThumbnail";
import "./CaseAsset.scss";
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import { Link } from "react-router-dom";
import { urlList, urlNames } from "../../../utils/urlList";
import { AssetDetailRouteStateType } from "../../Assets/AssetLister/AssetDataTable/AssetDataTableModel";
import { AssetBucket } from "../../Assets/AssetLister/ActionMenu/types";
import DetailedAssetPopup from "../../Assets/AssetLister/AssetDataTable/DetailedAssetPopup";

type CaseAssetPropTypes = {
    item: SearchModel.Evidence | AssetBucket,
    isChecked?: boolean,
    hasCheckbox?: boolean,
    isThumbnailOnly?: boolean,
    onSelectAssetClick?: (e: any, item: any) => void
  }
  
const CaseAsset : FC<CaseAssetPropTypes> = ({item, isChecked = false, hasCheckbox = false, isThumbnailOnly = false, onSelectAssetClick}) => {

  const isSearchEvidenceModel = (data: SearchModel.Evidence | AssetBucket) : data is SearchModel.Evidence => {
    if(item != null) {
      return "masterAsset" in item ? true : false;
    }
    return false;
  }

  const assetNameTemplate = (assetName: string, evidence: SearchModel.Evidence) => {
    let assets = evidence.asset.filter(x => x.assetId != evidence.masterAsset.assetId);
    let dataLink =
      <>
        <Link
          className="linkColor"
          to={{
            pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
            state: {
              evidenceId: evidence.id,
              assetId: evidence.masterAsset.assetId,
              assetName: assetName,
              evidenceSearchObject: evidence
            } as AssetDetailRouteStateType,
          }}
        >
          <div className="assetName">

            <CRXTruncation placement="top" content={assetName.length >
              25
              ? assetName.substring(0,
                25
              ) + "..."
              : assetName} />
          </div>
        </Link>
        <DetailedAssetPopup asset={assets} row={evidence} />
      </>
    return dataLink;
  }

  const getAssetContent = () => {
    const isSearchEvidence = isSearchEvidenceModel(item);
    const masterAsset = isSearchEvidence ? item.masterAsset : item;
    const evidence = isSearchEvidence ? item : item.evidence;
    return <>
      <div className="caseAssetThumbnail">
        <AssetThumbnail
          asset={masterAsset}
          evidence={evidence}
          assetName={masterAsset.assetName}
          assetType={masterAsset.assetType}
          fileType={evidence?.masterAsset?.files[0]?.type}
          accessCode={evidence?.masterAsset?.files[0]?.accessCode}
          fontSize="61pt"
        />
      </div>
      {
        isThumbnailOnly == false ?
        <div className="caseAssetInformationContainer">
          <>
            <div className="bucketListAssetName">
                { assetNameTemplate(masterAsset.assetName, evidence)}
            </div>
            <div className="bucketListRec">
              {masterAsset.assetType}
            </div>
          </>
          {/* <div className="bucketListAssetName">
            { assetNameTemplate(item.assetName, item.evidence) }
          </div>
          <div className="bucketListRec">
            {item.assetType}
          </div> */}
          {/* : ( */}
          {/* <div className="caseAssetName">
            {item.assetName.length > 25
              ? item.assetName.substr(0, 25) + "..."
              : item.assetName}
          </div>
          <div className="caseAssetType">
            {item.assetType}
          </div> */}
          {/* )} */}
          {/* {assetBucketItem.evidence.categories &&
            assetBucketItem.evidence.categories.length > 0 && (
              <div className="bucketListRec">
                {assetBucketItem.evidence.categories
                  .map((item: any) => item)
                  .join(", ")}
              </div>
            )} */}
        </div>
        : null
      }
      </>
  }

    return (
      <div className={`caseAssetContainer ${isThumbnailOnly === true ? '-isThumbnailOnly' : ''}`}>
        {
          hasCheckbox === true && isThumbnailOnly == false ?
          <div className="assetCheck">
            <CRXCheckBox
              checked={isChecked}
              onChange={(e: any) => typeof onSelectAssetClick === "function" ? onSelectAssetClick(e, item) : {}}
              name={isSearchEvidenceModel(item) ? item.masterAsset.assetId : item.assetId}
              lightMode={true}
            />
          </div>
          : null
        }
        
        {getAssetContent()}
        {/* <div className="bucketActionMenu">
          {
            <ActionMenu
              row={x}
              selectedItems={selectedItems}
              actionMenuPlacement={
                ActionMenuPlacement.AssetBucket
              }
            />
          }
        </div> */}
      </div>
    )
}

export default CaseAsset;
