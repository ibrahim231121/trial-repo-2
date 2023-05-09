import { FC, useState } from "react";
import { CRXCheckBox, CRXTruncation, CRXTooltip, CRXAlert, CRXButton } from "@cb/shared";
import { useTranslation } from "react-i18next";
import "./ConfirmAdditionalAssets.scss";
import { AssetThumbnail } from "../AssetDataTable/AssetThumbnail";
import DetailedAssetPopup from "../AssetDataTable/DetailedAssetPopup";
import { AssetDetailRouteStateType } from "../AssetDataTable/AssetDataTableModel";
import { Link } from "react-router-dom";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { urlList, urlNames } from "../../../../utils/urlList";

type ConfirmAdditionalAssetsPropTypes = {
    selectedItems: any[],
    onClose: () => void
}

const ConfirmAdditionalAssets : FC<ConfirmAdditionalAssetsPropTypes> = (props) => {
    const [additionalAssets, setAdditionalAssets] = useState(props.selectedItems);

    const { t } = useTranslation<string>();

    const onAssetSelectionChange = (e: any, item: any) => {
        const stateCopy = additionalAssets.map(item => ({...item}));
        const existingIndex = stateCopy.findIndex(x => x.id === item.id);
        if(existingIndex > -1) {
            stateCopy[existingIndex].isSelected = e.target.checked;
        }
        setAdditionalAssets([...stateCopy]);
    }

    const onAddToCaseClick = () => {
        console.log("Add to case click")
    }

    const onCancelClick = () => {
        props.onClose();
    }

    return (
        <div className="confirmAdditionalAssetsContent">
            <label className="additionalAssetsHeading">{t('Please_Confirm')}</label>
            <label className="additionalAssetsSubHeading">{t('Select_the_additional_assets_you_want_to_add_to_the_case')}</label>
            {
                additionalAssets.map((item: any, idx: number) => (
                    <div key={`additionalAssetItem${idx}`} className="additionalAssetContainer">
                        <div className="additionalAssetSubContainer">
                        <div className="additionalAssetCheckbox">
                            <CRXCheckBox
                                checked={!(item.isSelected === false) && item.isDisabled != true}
                                onChange={(e: any) => onAssetSelectionChange(e, item)}
                                name={item.assetId}
                                lightMode={true}
                                disabled={item.isDisabled}
                            />
                        </div>
                        <div className="additionalAssetDetail">
                            <div className="additionalAssetThumbnail">
                                <AssetThumbnail
                                    assetName={item.assetName}
                                    assetType={item.assetType}
                                    fileType={item?.evidence?.masterAsset?.files[0]?.type}
                                    fontSize="61pt"
                                />
                            </div>
                            <div className="additionalAssetNameContainer">
                                <div className="additionalAssetName">{assetNameTemplate(item.assetName, item.evidence)}</div>
                            </div>
                        </div>
                        </div>
                        {
                            item.isDisabled === true ?
                            <CRXAlert
                                className="additionalAssetWarningMessage"
                                message= {t("The_assets_above_already_exists_in_the_destination_case")}
                                type="info"
                                alertType="inline"
                                open={true}
                                setShowSucess={() => null}
                                showCloseButton={false}
                            />
                            : null
                        }      
                    </div>
                ))
            }
            <div className="additionalAssetModalFooter">
                <CRXButton
                    className="additionalAssetAddButton secondary"
                    color="secondary"
                    variant="outlined"
                    onClick={() => onAddToCaseClick()}
                    disabled={!(additionalAssets.filter(x => x.isSelected !== false && x.isDisabled !== true)?.length > 0)}
                >
                    {t("Add_To_Case")}
                </CRXButton>
                <CRXButton
                    className="additionalAssetCancelButton secondary"
                    color="secondary"
                    variant="outlined"
                    onClick={() => onCancelClick()}
                >
                    {t("Cancel")}
                </CRXButton>
            </div>
        </div>
    )
}

const assetNameTemplate = (assetName: string, evidence: SearchModel.Evidence) => {
    let masterAsset = evidence.masterAsset;
    let assets = evidence.asset.filter(x => x.assetId != masterAsset.assetId);
    let dataLink = 
    <>
      <Link
        className="linkColor"
        to={{
          pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
          state: {
            evidenceId: evidence.id,
            assetId: masterAsset.assetId,
            assetName: assetName,
            evidenceSearchObject: evidence
          } as AssetDetailRouteStateType,
        }}
      >
        <div className="assetName">
        <CRXTruncation placement="top" content={assetName} />
        </div>
      </Link>
      {assets  && evidence.masterAsset.lock &&
      <CRXTooltip iconName="fas fa-lock-keyhole" arrow={false} title="Access Restricted" placement="right" className="CRXLock"/>
      }
      <DetailedAssetPopup asset={assets} row={evidence} />
    </>
    return dataLink;
      
};

export default ConfirmAdditionalAssets;
