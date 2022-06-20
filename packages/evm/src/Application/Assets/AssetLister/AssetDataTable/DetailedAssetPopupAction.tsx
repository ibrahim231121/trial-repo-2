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
import { EVIDENCE_SERVICE_URL } from '../../../../utils/Api/url'
import { getAssetSearchInfoAsync } from '../../../../Redux/AssetSearchReducer';

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
  const DetailedPopupMsgRef = React.useRef<typeof CRXToaster>(null);

  const message = [
    { messageType: "success", message: `${asset.assetName}` + ' is successfully set as primary asset' },
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
    const url = EVIDENCE_SERVICE_URL + '/Evidences/' + `${row.id}` + '/setAsPrimaryAsset/' + `${asset.assetId}`
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'TenantId': '1'}

    };
    await fetch(url,requestOptions)
    .then(async function(res) {
      if (res.ok) {
        setIsOpen(false);
        await setTimeout( async() => { dispatch(await getAssetSearchInfoAsync("")) }, 1000);
        showToastMsg();
      }
    })
    .catch(function (error) {
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
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={4} maximumDescriptor={maximumDescriptor}>
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
