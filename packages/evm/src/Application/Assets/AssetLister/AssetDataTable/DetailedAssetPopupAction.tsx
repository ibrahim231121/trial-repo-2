import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import {
  Menu,
  MenuItem,
  MenuButton,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "./index.scss";
import { CRXConfirmDialog, CRXToaster } from '@cb/shared';
import Restricted from "../../../../ApplicationPermission/Restricted";
import SecurityDescriptor from "../../../../ApplicationPermission/SecurityDescriptor";
import { getAssetSearchInfoAsync } from '../../../../Redux/AssetSearchReducer';
import Cookies from "universal-cookie";
import { CRXAlert } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import ActionMenu from "../ActionMenu";


type Props = {
  row?: any;
  asset: any;
  selectedItems?: any;
};

export interface AssetBucket {
  id: number;
  assetId: number;
  assetName: string;
  recordingStarted: string;
  categories: string[];
}

export enum PersmissionModel {
  View = 1,
  Share = 2,
  Update = 3,
  Exclusive = 4
}

export type securityDescriptorType = {
  groupId: number;
  permission: PersmissionModel;
}

const DetailedAssetPopupAction: React.FC<Props> = React.memo(({ row, asset, selectedItems }) => {

  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
  const [alertType, setAlertType] = React.useState<string>("inline");
  const [alert, setAlert] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>("");
  const [errorType, setErrorType] = React.useState<string>("error");
  const [showSuccess, setShowSuccess] = React.useState<boolean>(true);
  const DetailedPopupMsgRef = React.useRef<typeof CRXToaster>(null);
  const [isPrimaryAsset,setIsPrimaryAsset] = React.useState(true)
  const cookies = new Cookies();

  const message = [
    { messageType: "success", message: `${asset.assetName}` + ` ${t("is_successfully_set_as_primary_asset")}` },
  ];

  React.useEffect(() => {
    if (row?.securityDescriptors?.length > 0)
      setMaximumDescriptor(findMaximumDescriptorId(row?.securityDescriptors));
  }, [row]);

  React.useEffect(() => {
    

  }, [maximumDescriptor]);

  const findMaximumDescriptorId = (securityDescriptors: Array<securityDescriptorType>): number => {
    return Math.max.apply(Math, securityDescriptors.map((o) => {
      return parseInt(PersmissionModel[o.permission], 10);
    }));
  }

  const handlePrimaryAsset = () => {
    setIsOpen(true);
  };

  const showToastMsg = () => {
    DetailedPopupMsgRef.current.showToaster({
      message: message[0].message,
      variant: "success",
      duration: 4000,
      clearButtton: true,
    });
 };

  const onConfirm = async () => {
    const url = '/Evidences/' + `${row.id}` + '/setAsPrimaryAsset/' + `${asset.assetId}`
    EvidenceAgent.setPrimaryAsset(url).then(() => {
      setIsOpen(false);
      setTimeout( async() => { dispatch(await getAssetSearchInfoAsync("")) }, 1000);
      showToastMsg();
    })
    .catch(function (error) {
      setAlert(true);
      setResponseError(
        t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
      );
      return error;
    });
  };

  useEffect(() => {
  },[isOpen]) 

  return (
    <>
      <CRXConfirmDialog
        className={`crx-unblock-modal __set__Primary__Modal__
        
        ${alert === true ? "__crx__Set_primary_Show" : "__crx__Set_primary_Hide"} `}
        title={t("Please_confirm")}
        setIsOpen={setIsOpen}
        onConfirm={onConfirm}
        isOpen={isOpen}
        buttonPrimary="Yes, set as primary"
        buttonSecondary="No, do not set as primary">
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
           {/* <p>
              {t("You_are_sure_want_to_make")} <b>'{asset.assetName}'</b> {t("the_primary_asset?")}
            </p> */}
            <p>
            {t("You_are_attempting_to")} <b> {t("set_the '")}{asset.assetName}{t("' as_the_primary_asset")}</b>.
            {/* You are attempting to <b>set the '{asset.assetName}' as the primary asset</b>. */}
            </p>

            <p>
            {t("Are_you_sure_would_like_to")} <b> {t("set '")}{asset.assetName}{t("' asset_as_the_primary_asset")}</b>?
            {/* Are you sure would like to <b> set '{asset.assetName}' asset as the primary asset</b>? */}
            </p>
          </div>
        }
      </CRXConfirmDialog>
      <ActionMenu Asset={asset} row={row} selectedItems={selectedItems} showToastMsg={() => showToastMsg()} setIsOpen = {setIsOpen} IsOpen= {isPrimaryAsset}/>
    </>
  );
});

export default DetailedAssetPopupAction;
