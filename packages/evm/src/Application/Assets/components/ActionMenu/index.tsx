import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import './index.scss'
import { addAssetToBucketActionCreator } from "../../../../Redux/AssetActionReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/rootReducer";

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

const ActionMenu: React.FC<Props> = ({ selectedItems,row }) => {

  const dispatch = useDispatch()
  let addToAssetBucketDisabled: boolean = false
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket
  );
  
  const addToAssetBucket=()=>{
    //if undefined it means header is clicked
    if (row!==undefined && row !== null) {
      const find=selectedItems.findIndex((selected:any)=>selected.id===row.id)
      const data=find===-1?row:selectedItems
      dispatch(addAssetToBucketActionCreator(data))
    }
   else{
    dispatch(addAssetToBucketActionCreator(selectedItems))
   }
  }

  const MultiCompareAssetBucketData = (assetBucketData: AssetBucket[], selectedItems: any[]) => {
    let assetBucketIds = assetBucketData.map((x: AssetBucket) => x.id);
    let selectedItemIds = selectedItems.map((x: any) => x.id);
    let value = selectedItemIds.map((x:number) => {
      if(assetBucketIds.includes(x))
        return true
      else
        return false
    })
    return value
  }

  if(row !== undefined && row !== null)
  {
    assetBucketData.map((data) => {
      if(data.id === row.id)
      addToAssetBucketDisabled = true
    })
  }
  else if (selectedItems !== undefined && selectedItems.length > 0)
  {
    let value = MultiCompareAssetBucketData(assetBucketData, selectedItems);
    if(value.includes(false))
      addToAssetBucketDisabled = false
    else  
      addToAssetBucketDisabled = true
  }

  return (
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

        <MenuItem >
          <div className="crx-meu-content groupingMenu crx-spac" onClick={addToAssetBucket}>
            <div className="crx-menu-icon"></div>
            <div className={addToAssetBucketDisabled === false ? "crx-menu-list" : "crx-menu-list disabledItem"}>
              Add to asset bucket 
            </div>
          </div>
        </MenuItem>   
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
            <i className="far fa-clipboard-list fa-md"></i>
            </div>
            <div className="crx-menu-list">
              Categorize
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
            
            </div>
            <div className="crx-menu-list">
              Set as primary asset
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              <i className="far fa-user-tag fa-md"></i> 
            </div>
            <div className="crx-menu-list">
                Assign user
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content groupingMenu">
            <div className="crx-menu-icon">
              
            </div>
            <div className="crx-menu-list">
                Modify Retention
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              <i className="far fa-envelope fa-md"></i>
            </div>
            <div className="crx-menu-list">
                Email
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content groupingMenu">
            <div className="crx-menu-icon">
              
            </div>
            <div className="crx-menu-list">
              <SubMenu label="Export">
                <MenuItem>File</MenuItem>
                <MenuItem>Metadata</MenuItem>
                <MenuItem>Evidence overlaid video</MenuItem>
                <MenuItem>Metadata overlaid video</MenuItem>
              </SubMenu>
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              <i className="far fa-link fa-md"></i>
            </div>
            <div className="crx-menu-list">
              Link asset
            </div>
          </div>
        </MenuItem>
        <MenuItem disabled>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
              
            </div>
            <div className="crx-menu-list disabledItem">
            Link to this group
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content">
            <div className="crx-menu-icon">
            <i className="far fa-external-link-square fa-md"></i>
            </div>
            <div className="crx-menu-list">
            Move asset
            </div>
          </div>
        </MenuItem>
        <MenuItem disabled>
          <div className="crx-meu-content groupingMenu">
            <div className="crx-menu-icon">
           
            </div>
            <div className="crx-menu-list disabledItem">
              Move to this group
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="crx-meu-content crx-spac">
            <div className="crx-menu-icon">
            <i className="far fa-user-lock fa-md"></i>
            </div>
            <div className="crx-menu-list">
              Restrict access
            </div>
          </div>
        </MenuItem>
    </Menu>
  );
};
export default ActionMenu;
