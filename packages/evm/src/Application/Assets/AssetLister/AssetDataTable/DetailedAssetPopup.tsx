import {
  CRXCheckBox, CRXPopOver
} from "@cb/shared";
import React, { useRef, useState } from "react";

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import dateDisplayFormat from "../../../../GlobalFunctions/DateFormat";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { AssetThumbnail } from "./AssetThumbnail";
import "./DetailedAssetPopup.scss";
import DetailedAssetPopupAction from "./DetailedAssetPopupAction";
import { AssetDetailRouteStateType } from "./AssetDataTableModel";

type CheckValue = {
  isChecked: boolean;
  assetId: number;
};

type Props = {
  asset: SearchModel.Asset[]
  row?: any;
}

const DetailedAssetPopup: React.FC<Props> = ({ asset, row }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const popOverRef: any = useRef(null)
  const [groupedAsset, setGroupedAsset] = useState<SearchModel.Asset[]>();
  const { t } = useTranslation<string>();
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selected, setSelected] = useState<CheckValue[]>([]);

  useEffect(() => {
    controlSelection(false)
  }, [groupedAsset]);

  const widgetStyle = makeStyles({
    CRXArrowStyle: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  });

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
          assetId: select.assetId
        }
        return obj;
      });
      setSelected(checkValues);
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
          assetId: select.assetId
        }
        return obj;
      } else return select;
    });
    setSelected(checkValues);

    checkValues.forEach((x) => {
      if (x.isChecked === true) countCheck++;
    });

    if (checkValues.length === countCheck) setCheckAll(true);
    else setCheckAll(false);
  };

  return (
    <ClickAwayListener onClickAway={() => onClose()}>
      <div className="CRXPopupOuterDiv">

        {asset && asset.filter(x => x.assetId !== row.masterAsset.assetId).length > 0 &&
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
          anchorEl={anchorEl}
          onSetAnchorE1={(v: HTMLElement) => setAnchorEl(v)}
          className={"CRXPopoverCss"}
          title={t("Grouped_Assets")}
          arrowDown={true}
        >

          <div className="_asset_group_popover_list">
            <div className="_checked_all_list">
              <CRXCheckBox
                className="relatedAssetsCheckbox"
                checked={checkAll}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCheckAll(e)}
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
                    pathname: "/assetdetail",
                    state: {
                      evidenceId: row.id,
                      assetId: asset.assetId,
                      assetName: asset.assetName,
                      evidenceSearchObject: row
                    } as AssetDetailRouteStateType,
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
                        <span>
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
