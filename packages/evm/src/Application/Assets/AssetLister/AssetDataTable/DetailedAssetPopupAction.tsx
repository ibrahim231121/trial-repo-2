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
import { EvidenceAgent } from "../../../../utils/Api/ApiAgent";


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
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [primary, setPrimary] = React.useState<string>('Confirm');
  const [secondary, setSecondary] = React.useState<string>('Close');
  const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
  const [alertType, setAlertType] = React.useState<string>("inline");
  const [alert, setAlert] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>("");
  const [errorType, setErrorType] = React.useState<string>("error");
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false);
  const DetailedPopupMsgRef = React.useRef<typeof CRXToaster>(null);
  const cookies = new Cookies();

  const message = [
    { messageType: "success", message:' Asset set as the primary' },
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
        "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
      );
      return error;
    });
  };

  useEffect(() => {
  },[isOpen])

  return (
    <>
      <CRXToaster ref={DetailedPopupMsgRef} />
      <CRXConfirmDialog
        className='crx-unblock-modal'
        title={"Please Confirm"}
        setIsOpen={setIsOpen}
        onConfirm={onConfirm}
        isOpen={isOpen}
        primary={primary}
        secondary={secondary}>
        {
          <div className='crxUplockContent'>
            <CRXAlert
        className={"CrxAlertNotificationGroup "}
        message={responseError}
        type={errorType}
        open={alert}
        alertType={alertType}
        setShowSucess={setShowSuccess}
      />
            <p>
              You are sure want to make '{asset.assetName}' the primary asset?
            </p>
          </div>
        }
      </CRXConfirmDialog>

      <Menu
        align="start"
        viewScroll="initial"
        direction="right"
        position="auto"
        className="menuCss"
        arrow
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v actionIcon"></i>
          </MenuButton>
        }
      >

        <MenuItem>
          <Restricted moduleId={30}>
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content" onClick={handlePrimaryAsset}>
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">Set as primary asset</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>


      </Menu>
    </>
  );
});

export default DetailedAssetPopupAction;
