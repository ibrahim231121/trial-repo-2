import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import "@szhsin/react-menu/dist/index.css";
import "./index.scss";
import { CRXConfirmDialog, CRXToaster,CRXAlert } from '@cb/shared';
import { getAssetSearchInfoAsync } from '../../../../Redux/AssetSearchReducer';
import { useTranslation } from "react-i18next";
import { EvidenceAgent, SearchAgent } from '../../../../utils/Api/ApiAgent';
import ActionMenu from "../ActionMenu";
import { SearchType } from "../../utils/constants";
import { ActionMenuPlacement } from "../ActionMenu/types";
import { ReFormatPropsForActionMenu } from "./Utility";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { RootState } from "../../../../Redux/rootReducer";
import { getEvidenceSearchObject } from "../../../../Redux/FilterSearchEvidence";
type Props = {
  row?: any;
  asset: any;
  selectedItems?: any;
  setIsAddedToBucket : React.Dispatch<React.SetStateAction<boolean>>;
  isRelatedAsset : boolean;
  relatedEvidenceObject?: SearchModel.Evidence[],
};

const DetailedAssetPopupAction: React.FC<Props> = (({ row, asset, selectedItems, setIsAddedToBucket, isRelatedAsset, relatedEvidenceObject }) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isDuplicaterModalOpen, setIsDuplicateModalOpen] = React.useState<boolean>(false);
  const [alertType, setAlertType] = React.useState<string>("inline");
  const [alert, setAlert] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>("");
  const [errorType, setErrorType] = React.useState<string>("error");
  const [showSuccess, setShowSuccess] = React.useState<boolean>(true);
  const DetailedPopupMsgRef = React.useRef<typeof CRXToaster>(null);
  const [isPrimaryAsset, setIsPrimaryAsset] = React.useState(true);
  const  filteredEvidenceSearchObject =  useSelector((state : RootState)  => state.FilteredSearchEvidenceSlice)

  useEffect(() => {
  }, [isOpen]);

  const handlePrimaryAsset = () => {
    setIsOpen(true);
  };

  const showToastMsgs = (message: string) => {
    DetailedPopupMsgRef.current.showToaster({
      message: message,
      variant: "success",
      duration: 4000,
      clearButtton: true,
    });
  };

  const onConfirm = async () => {
    const url = '/Evidences/' + `${row.id}` + '/setAsPrimaryAsset/' + `${asset.assetId}`
    EvidenceAgent.setPrimaryAsset(url).then(() => {
      setIsOpen(false);
      setTimeout(async () => { dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch })) }, 1000);
      showToastMsgs( `${asset.assetName}` + ` ${t("is_successfully_set_as_primary_asset")}`);
    })
      .catch(function (error) {
        if(error.response.status == 409)
        {
        setIsOpen(false);
        setIsDuplicateModalOpen(true);
        }
        else
        {
          setAlert(true);
          setResponseError(
            t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
          );
        }
        return error;
      });
  };

  const reformatSelectedAsset = (selectedAssets: any[]) => {
    const filteredArray = selectedAssets.filter(x => x.isChecked == true  && x.isRelatedAsset == false);
    if (filteredArray.length > 0 ) {
      filteredArray.forEach(element => {
        if(element.evidence === undefined)element.evidence = relatedEvidenceObject ?? row ;
      });
    }
    const filteredEvidenceSearchObject1 = selectedAssets.filter((x: any) => x.isChecked == true && x.isRelatedAsset == true && x.evidence != null)
    const filterRelatedAndGroupAsset = filteredArray.concat(filteredEvidenceSearchObject1)
    const selectedGroupAndRelatedAssets = filterRelatedAndGroupAsset.filter((value, index) => {
      const _value = JSON.stringify(value);
      return index === filterRelatedAndGroupAsset.findIndex(obj => {
        return JSON.stringify(obj) === _value;
      });
    });
    return selectedGroupAndRelatedAssets;
  }
  return (
    <>
    <CRXToaster ref={DetailedPopupMsgRef} />
      <CRXConfirmDialog
        className={`crx-unblock-modal __set__Primary__Modal__ ${alert === true ? "__crx__Set_primary_Show" : "__crx__Set_primary_Hide"} `}
        title={t("Please_confirm")}
        setIsOpen={setIsOpen}
        onConfirm={onConfirm}
        isOpen={isOpen}
        primary="Confirm"
        secondary="Cancel">
        {
          <div className='crxUplockContent'>
            <CRXAlert
              className={"CrxAlertNotificationGroup"}
              message={responseError}
              type={errorType}
              open={alert}
              alertType={alertType}
              showCloseButton={false}
              setShowSucess={setShowSuccess}
            />
            <p>
              {t("You_are_attempting_to")} <b> {t("set_the")} {("'")}{asset.assetName}{("'")} </b> {t("as_the_primary_asset")}.
            </p>
            <p>
              {t("Are_you_sure_would_like_to")} <b> {t("set")} {("'")}{asset.assetName}{("'")} </b> {t("asset_as_the_primary_asset")}?
            </p>
          </div>
        }
      </CRXConfirmDialog>
      <CRXConfirmDialog
        className={`crx-unblock-modal __set__Primary__Modal__ ${alert === true ? "__crx__Set_primary_Show" : "__crx__Set_primary_Hide"} `}
        title={t("Error")}
        setIsOpen={setIsDuplicateModalOpen}
        onConfirm={onConfirm}
        isOpen={isDuplicaterModalOpen}
        primaryDisabled={true}
        isCloseButton={true}
          secondary={t("Yes_close")}
          isPrimaryHide = {true}>
        {
          <div className='crxUplockContent'>
            <CRXAlert
              className={"CrxAlertNotificationGroup"}
              message={responseError}
              type={errorType}
              open={alert}
              alertType={alertType}
              showCloseButton={false}
              setShowSucess={setShowSuccess}
            />
            <p>
              {t("Unable to perform this operation because the asset is already Master Asset In other evidence group")}.
            </p>
            
          </div>
          
        }
      </CRXConfirmDialog>
      <ActionMenu
        row={ReFormatPropsForActionMenu(row, asset.assetId ?? asset.id)}
        selectedItems={reformatSelectedAsset(selectedItems)}
        asset={asset}
        showToastMsg={(obj) => showToastMsgs(obj.message)}
        setIsPrimaryOptionOpen={setIsOpen}
        isPrimaryOptionOpen={isPrimaryAsset}
        portal={true}
        actionMenuPlacement={ActionMenuPlacement.DetailedAssets}
        className="_see_more_asset_bucket_"
        actionViewScroll="initial"
        setIsAddedToBucket = {setIsAddedToBucket}
        isRelatedAsset={isRelatedAsset}
      />
    </>
  );
});

export default DetailedAssetPopupAction;
