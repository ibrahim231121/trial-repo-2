import React from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "./index.scss";

import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Category/FormContainer";
import { addAssetToBucketActionCreator } from "../../../../Redux/AssetActionReducer";

import { RootState } from "../../../../Redux/rootReducer";
import Restricted from "../../../../ApplicationPermission/Restricted";

type Props = {
  selectedItems?: any;
  row?: any;
};

interface AssetBucket {
  id: number;
  assetId: number;
  assetName: string;
  recordingStarted: string;
  categories: string[];
}

const ActionMenu: React.FC<Props> = React.memo(({ selectedItems, row }) => {
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
  React.useEffect(() => {
    /**
     * ! This rerenders if row is updated, it means user clicked the menu from parent component.
     * ! So we need to reset the form index, so that it starts from start.
     */
    if (row?.categories?.length > 0) {
      setIsCategoryEmpty(false);
    } else {
      setIsCategoryEmpty(true);
    }
  }, [row]);

  const [openForm, setOpenForm] = React.useState(false);
  const handleChange = () => {
    setOpenForm(true);
  };

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

  return (
    <>
      <FormContainer
        setOpenForm={() => setOpenForm(false)}
        openForm={openForm}
        rowData={row}
        isCategoryEmpty={isCategoryEmpty}
        setIsCategoryEmpty={() => setIsCategoryEmpty(true)}
      />

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
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <div className="crx-meu-content">
              <div className="crx-menu-icon"></div>
              <div className="crx-menu-list">Set as primary asset</div>
            </div>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <div className="crx-meu-content">
              <div className="crx-menu-icon">
                <i className="far fa-user-tag fa-md"></i>
              </div>
              <div className="crx-menu-list">Assign user</div>
            </div>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <div className="crx-meu-content groupingMenu">
              <div className="crx-menu-icon"></div>
              <div className="crx-menu-list">Modify Retention</div>
            </div>
          </Restricted>
        </MenuItem>

       

        {isCategoryEmpty === false ? (
          <MenuItem>
            <Restricted moduleId={3}>
              <div className="crx-meu-content" onClick={handleChange}>
                <div className="crx-menu-icon">
                  <i className="far fa-clipboard-list fa-md"></i>
                </div>
                <div className="crx-menu-list">Edit Category and Form</div>
              </div>
            </Restricted>
          </MenuItem>
        ) : (
          <MenuItem>
            <Restricted moduleId={2}>
              <div className="crx-meu-content" onClick={handleChange}>
                <div className="crx-menu-icon">
                  <i className="far fa-clipboard-list fa-md"></i>
                </div>
                <div className="crx-menu-list">Categorize</div>
              </div>
            </Restricted>
          </MenuItem>
        )}

        <MenuItem>
          <Restricted moduleId={0}>
            <div className="crx-meu-content">
              <div className="crx-menu-icon">
                <i className="far fa-envelope fa-md"></i>
              </div>
              <div className="crx-menu-list">Email</div>
            </div>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
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
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <div className="crx-meu-content">
              <div className="crx-menu-icon">
                <i className="far fa-link fa-md"></i>
              </div>
              <div className="crx-menu-list">Link asset</div>
            </div>
          </Restricted>
        </MenuItem>

        <MenuItem disabled>
          <Restricted moduleId={0}>
            <div className="crx-meu-content">
              <div className="crx-menu-icon"></div>
              <div className="crx-menu-list disabledItem">
                Link to this group
              </div>
            </div>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <div className="crx-meu-content">
              <div className="crx-menu-icon">
                <i className="far fa-external-link-square fa-md"></i>
              </div>
              <div className="crx-menu-list">Move asset</div>
            </div>
          </Restricted>
        </MenuItem>
        <MenuItem disabled>
          <Restricted moduleId={0}>
            <div className="crx-meu-content groupingMenu">
              <div className="crx-menu-icon"></div>
              <div className="crx-menu-list disabledItem">
                Move to this group
              </div>
            </div>
          </Restricted>
        </MenuItem>

        <MenuItem>
          <Restricted moduleId={0}>
            <div className="crx-meu-content crx-spac">
              <div className="crx-menu-icon">
                <i className="far fa-user-lock fa-md"></i>
              </div>
              <div className="crx-menu-list">Restrict access</div>
            </div>
          </Restricted>
        </MenuItem>
      </Menu>
    </>
  );
});

export default ActionMenu;
