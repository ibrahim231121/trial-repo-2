import React, { useEffect } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "./index.scss";
import { CRXModalDialog } from '@cb/shared';
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Category/FormContainer";
import { addAssetToBucketActionCreator } from "../../../../Redux/AssetActionReducer";
import AssignUser from '../AssignUser/AssignUser';
import ManageRetention from '../ManageRetention/ManageRetention';
import { RootState } from "../../../../Redux/rootReducer";
import Restricted from "../../../../ApplicationPermission/Restricted";
import SecurityDescriptor from "../../../../ApplicationPermission/SecurityDescriptor";

type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
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

const ActionMenu: React.FC<Props> = React.memo(({ selectedItems, row, showToastMsg }) => {
  const dispatch = useDispatch();
  let addToAssetBucketDisabled: boolean = false;
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );

  const addToAssetBucket = () => {
    //if undefined it means header is clicked
    if (row !== undefined && row !== null) {
      const find = selectedItems.findIndex(
        (selected: any) => selected.id === row.id
      );
      const data = find === -1 ? row : selectedItems;
      dispatch(addAssetToBucketActionCreator(data));
    } else {
      dispatch(addAssetToBucketActionCreator(selectedItems));
    }
  };

  const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(true);
  const [maximumDescriptor, setMaximumDescriptor] = React.useState(0);
  React.useEffect(() => {
    /**
     * ! This rerenders if row is updated, it means user clicked the menu from parent component.
     * ! So we need to reset the form index, so that it starts from start.
     */
    if (row?.categories?.length > 0) {
      setMaximumDescriptor(findMaximumDescriptorId(row?.evidence?.securityDescriptors));
      setIsCategoryEmpty(false);
    } else {
      setIsCategoryEmpty(true);
    }
  }, [row]);

  const [openForm, setOpenForm] = React.useState(false);
  const handleChange = () => {
    setOpenForm(true);
  };

  const [openAssignUser, setOpenAssignUser] = React.useState(false);
  const [openManageRetention, setOpenManageRetention] = React.useState(false);

  const [filterValue, setFilterValue] = React.useState<any>([]);
  const handleOpenAssignUserChange = () => {
    setOpenAssignUser(true);
  };
  const handleOpenManageRetention = () => {
    setOpenManageRetention(true);
  }

  const MultiCompareAssetBucketData = (
    assetBucketData: AssetBucket[],
    selectedItems: any[]
  ) => {
    let assetBucketIds = assetBucketData.map((x: AssetBucket) => x.id);
    let selectedItemIds = selectedItems.map((x: any) => x.id);
    let value = selectedItemIds.map((x: number) => {
      if (assetBucketIds.includes(x)) return true;
      else return false;
    });
    return value;
  };

  if (row !== undefined && row !== null) {
    assetBucketData.map((data) => {
      if (data.id === row.id) addToAssetBucketDisabled = true;
    });
  } else if (selectedItems !== undefined && selectedItems.length > 0) {
    let value = MultiCompareAssetBucketData(assetBucketData, selectedItems);
    if (value.includes(false)) addToAssetBucketDisabled = false;
    else addToAssetBucketDisabled = true;
  }

  const findMaximumDescriptorId = (securityDescriptors: Array<securityDescriptorType>): number => {
    return Math.max.apply(Math, securityDescriptors.map((o) => {
      return parseInt(PersmissionModel[o.permission], 10);
    }));
  }

  return (
    <>
      <FormContainer
        setOpenForm={() => setOpenForm(false)}
        openForm={openForm}
        rowData={row}
        isCategoryEmpty={isCategoryEmpty}
        setIsCategoryEmpty={() => setIsCategoryEmpty(true)}
      />

      <CRXModalDialog
        maxWidth='lg'
        title={"Assign User"}
        className={'CRXModal'}
        modelOpen={openAssignUser}
        onClose={() => setOpenAssignUser(false)}
        defaultButton={false}
        indicatesText={true}

      >
        <AssignUser
          selectedItems={selectedItems}
          filterValue={filterValue}
          setFilterValue={(v: any) => setFilterValue(v)}
          rowData={row}
          setRemovedOption={(e: any) => { }}
          setOnClose={() => setOpenAssignUser(false)}
          showToastMsg={(obj: any) => showToastMsg(obj)}
          
        />
      </CRXModalDialog>
      <CRXModalDialog
        maxWidth='lg'
        title={"Modify Retention"}
        className={'CRXModal'}
        modelOpen={openManageRetention}
        onClose={() => setOpenManageRetention(false)}
        defaultButton={false}
        indicatesText={true}
        
      >
        <ManageRetention
            items = {selectedItems}
            filterValue={filterValue}
            //setFilterValue={(v: any) => setFilterValue(v)}
            rowData={row}
            setRemovedOption={(e: any) => {}}
            setOnClose={() => setOpenManageRetention(false)}
            showToastMsg={(obj: any) => showToastMsg(obj)}
          />
      </CRXModalDialog>

      <Menu
        align="start"
        viewScroll="initial"
        direction="right"
        position="auto"
        className="menuCss"
        arrow
        menuButton={
          <MenuButton>
            <i className="far fa-ellipsis-v"></i>
          </MenuButton>
        }
      >
        <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={addToAssetBucket}
              >
                <div className="crx-menu-icon"></div>
                <div
                  className={
                    addToAssetBucketDisabled === false
                      ? "crx-menu-list"
                      : "crx-menu-list disabledItem"
                  }
                >
                  Add to asset bucket
                </div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={4} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">Set as primary asset</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={21}>
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content" onClick={handleOpenAssignUserChange}>
                <div className="crx-menu-icon">
                  <i className="far fa-user-tag fa-md"></i>
                </div>
                <div className="crx-menu-list">Assign User</div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
            <div className="crx-meu-content groupingMenu" onClick={handleOpenManageRetention}>
              <div className="crx-menu-icon"></div>
              <div className="crx-menu-list">Modify Retention</div>
            </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>


        {isCategoryEmpty === false ? (
          <MenuItem>
            <Restricted moduleId={3}>
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">Edit Category and Form</div>
                </div>
                </SecurityDescriptor>
            </Restricted>
          </MenuItem>
        ) : (
          <MenuItem>
            <Restricted moduleId={2}>
            <SecurityDescriptor descriptorId={3} maximumDescriptor={maximumDescriptor}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">Categorize</div>
                </div>
                </SecurityDescriptor>
            </Restricted>
          </MenuItem>
        )}

        <MenuItem>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon">
                  <i className="far fa-envelope fa-md"></i>
                </div>
                <div className="crx-menu-list">Email</div>
              </div>
              </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={4} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content groupingMenu">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">
                  <SubMenu label="Export">
                    <MenuItem>File</MenuItem>
                    <MenuItem>Metadata</MenuItem>
                    <MenuItem>Evidence overlaid video</MenuItem>
                    <MenuItem>Metadata overlaid video</MenuItem>
                  </SubMenu>
                </div>
              </div>
              </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={1} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon">
                  <i className="far fa-link fa-md"></i>
                </div>
                <div className="crx-menu-list">Link asset</div>
              </div>
              </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem disabled>
          <Restricted moduleId={0}>
            <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list disabledItem">
                  Link to this group
                </div>
              </div>
            </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content">
                <div className="crx-menu-icon">
                  <i className="far fa-external-link-square fa-md"></i>
                </div>
                <div className="crx-menu-list">Move asset</div>
              </div>
              </SecurityDescriptor>
          </Restricted>
        </MenuItem>
        <MenuItem disabled>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={2} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content groupingMenu">
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list disabledItem">
                  Move to this group
                </div>
              </div>
              </SecurityDescriptor>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
          <SecurityDescriptor descriptorId={4} maximumDescriptor={maximumDescriptor}>
              <div className="crx-meu-content crx-spac">
                <div className="crx-menu-icon">
                  <i className="far fa-user-lock fa-md"></i>
                </div>
                <div className="crx-menu-list">Restrict access</div>
              </div>
              </SecurityDescriptor>
          </Restricted>
        </MenuItem>
      </Menu>
    </>
  );
});

export default ActionMenu;
