import React, { useRef, useState } from "react";
import {
  CRXPopOver,
  CRXHeading,
  CRXButton,
  CRXCheckBox,
  CRXTooltip,
  CRXMiddleTruncationPopover
} from "@cb/shared";

import "./DetailedAssetPopup.scss";
import thumbImg from "../../../../Assets/Images/thumb.png";
import { useTranslation } from "react-i18next";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useEffect } from "react";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import { makeStyles } from "@material-ui/core/styles";
import AssetNameTooltip from "./AssetNameTooltip";
import { AssetThumbnail } from "./AssetThumbnail"
import DetailedAssetPopupAction from "./DetailedAssetPopupAction"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Link } from "react-router-dom";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { addGroupedSelectedAssets } from "../../../../Redux/groupedSelectedAssets";
import {useDispatch} from "react-redux";
import { urlList, urlNames } from "../../../../utils/urlList";

type CheckValue = {
  isChecked: boolean;
  assetId: number;
  masterId?: number;
  evidenceId?:number;
};

type Props = {
  asset: SearchModel.Asset[]
  row?: any;
}

const DetailedAssetPopup: React.FC<Props> = ({asset, row}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const popOverRef:any = useRef(null)
  const [groupedAsset, setGroupedAsset] = useState<SearchModel.Asset[]>();

  const { t } = useTranslation<string>();
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selected, setSelected] = useState<CheckValue[]>([]);
  const [selectedActionRow, setSelectedActionRow] = React.useState<any>();

  const widgetStyle = makeStyles({
    CRXArrowStyle: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  });

  const classes = widgetStyle();

  useEffect(() => {
    controlSelection(false)
  }, [groupedAsset]);

  const onClose = () => {
    setAnchorEl(null);
  };
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    
    setGroupedAsset(asset);
    setAnchorEl(popOverRef.current);
  };

  const controlSelection = (check: boolean) => {
    if (groupedAsset !== undefined) {
      let checkValues = groupedAsset.map((select: SearchModel.Asset, i: number) => {
        let obj: CheckValue = {
          isChecked: check,
          assetId: select.assetId,
          masterId: row.masterAsset.assetId,
          evidenceId: row.id
        }
        return obj;
      });
      setSelected(checkValues);

      let groupedSelectedAssets = checkValues.map((select: any, i: number) => {
        let obj: any = {
          isChecked: select.isChecked,
          assetId: select.assetId,
          masterId: row.masterAsset.assetId,
          evidenceId: row.id
        }
        return obj;
      });
      dispatch(addGroupedSelectedAssets(groupedSelectedAssets));
    }
  };



  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckAll(event.target.checked);
    controlSelection(event.target.checked)
  }
  


  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, assetId: number) => {
    let countCheck: number = 0;
    let checkValues = selected.map((select: CheckValue, i: number) => {
      if (select.assetId === assetId) {
        if (e.target.checked === false) setCheckAll(e.target.checked);
        let obj: CheckValue = {
          isChecked: e.target.checked,
          assetId: select.assetId,
          masterId: row.masterAsset.assetId

        }
        return obj;
      } else return select;
    });
    setSelected(checkValues);

    let groupedSelectedAssets = checkValues.map((select: any, i: number) => {
      let obj: any = {
        isChecked: select.isChecked,
        assetId: select.assetId,
        masterId: row.masterAsset.assetId
      }
      return obj;
    });
    dispatch(addGroupedSelectedAssets(groupedSelectedAssets));

    checkValues.forEach((x) => {
      if (x.isChecked === true) countCheck++;
    });

    if (checkValues.length === countCheck) setCheckAll(true);
    else setCheckAll(false);
  };

  const createLink = (asset : any, strLen : number) => {
      const dataLength = asset.toString().length;
      if (dataLength <= strLen) {
        return dataLength
      } else {
        var separator:any = separator || '...';
        var separator:any = separator || '...';
        var sepLen = separator.length,
            charsToShow = strLen - sepLen,
            frontChars = Math.ceil(charsToShow/2),
            backChars = Math.floor(charsToShow/2);
            
            const middleElip =  asset.substr(1, frontChars) + 
            separator + 
            asset.substr(dataLength - backChars);
            
        return middleElip
      }   
  }

  return (
    <ClickAwayListener onClickAway={() => onClose()}>
    <div className="CRXPopupOuterDiv">

      { asset && asset.filter(x=> x.assetId !== row.masterAsset.assetId).length > 0 &&
      <span
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onClick={handlePopoverOpen}
        ref={popOverRef}
        id="pop"
      >
        <i className="fal fa-clone"></i>
      </span>
      }
      <CRXPopOver
        open={open}
        anchorEl={popOverRef.current}
        className={`CRXPopoverCss DetailAsset_Popover`}
        title={t("Grouped_Assets")}
        arrowDown={true}
        disablePortal={false}
        placement="right"
        onSetAnchorE1={(v: HTMLElement) => setAnchorEl(v)}
      >
        
            <div className="_asset_group_popover_list">
              <div className="_checked_all_list">
              <CRXCheckBox
                  className="relatedAssetsCheckbox"
                  checked={checkAll}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) =>handleCheckAll(e)}
                  lightMode={true}
                />
                <span className="checked_all_text">{t("Select_All")}</span>
              </div>
               
                {(selected.length > 0 && groupedAsset !== undefined)
                  ? groupedAsset.map((asset: SearchModel.Asset, index: number) => {
                      const id = `checkBox'+${index}`;

                      const links = <Link
                      className="linkColor"
                        to={{
                          pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
                          state: {
                            evidenceId: row.id,
                            assetId: asset.assetId,
                            assetName: asset.assetName,
                            evidenceSearchObject: row
                          },
                        }}
                      >
                        
                        <div className="assetName">{asset.assetName}</div>
                      </Link>
                      return (
                        <>
                          <div className="_asset_group_list_row" key={index}>
                            <div className="_asset_group_single_check">
                              <CRXCheckBox
                                inputProps={id}
                                className="relatedAssetsCheckbox"
                                checked={selected[index].isChecked}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleCheck(e, selected[index].assetId)}
                                lightMode={true}
                              />
                            </div>
                            <div className="_asset_group_list_thumb">
                              <AssetThumbnail
                                assetType={asset.assetType}
                                fileType={asset.files && asset.files[0]?.type}
                                className={"CRXPopupTableImage"}
                              />
                            </div>
                            <div className="_asset_group_list_detail">
                            
                            <div className="_asset_group_list_link">
                            {links}
                            </div>
                            {/* <CRXMiddleTruncationPopover
                              id={asset.assetId}
                              content={asset.assetName}
                              isPopover={true}
                              maxWidth={200}
                              minWidth={150}
                              link={links}
                              middle={false}
                            /> */}
                             
                              {asset.camera !== undefined &&
                              asset.camera !== null &&
                              asset.camera !== "" ? (
                                <div className="_asset_group_list_cam_name">
                                  {asset.camera}
                                </div>
                              ) : (
                                <div className="_asset_group_list_asset_type">
                                    {asset?.files && (asset?.files[0]?.type != undefined || asset?.files[0]?.type != null) ? asset?.files[0]?.type : asset?.assetType}
                                </div>
                              )}
                              <div className="_asset_group_list_recordingStarted">
                                {dateDisplayFormat(asset.recordingStarted)}
                              </div>
                            </div>
                            <div className="CRXPopupActionIcon">
                              
                                {/* <i className="far fa-ellipsis-v actionIcon"> */}
                                <span onClick={() => setSelectedActionRow(asset)}>
                                  <DetailedAssetPopupAction row={row} asset={asset} selectedItems={selected} />
                                </span>
                                {/* </i> */}
                              
                            </div>
                          </div>
                          
                        </>
                      );
                    })
                  : null}
              
            </div>
          
      </CRXPopOver>
      
    </div>
    </ClickAwayListener>
  );
};

export default DetailedAssetPopup;
