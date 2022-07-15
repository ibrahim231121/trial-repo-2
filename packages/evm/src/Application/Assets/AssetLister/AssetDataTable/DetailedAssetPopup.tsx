import React, { useState } from "react";
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
import { Asset } from "../../../../GlobalFunctions/globalDataTableFunctions"
import DetailedAssetPopupAction from "./DetailedAssetPopupAction"

type CheckValue = {
  isChecked: boolean;
  assetId: string;
};

type Props = {
  asset: Asset[]
  row?: any;
}

const DetailedAssetPopup: React.FC<Props> = ({asset, row}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const [groupedAsset, setGroupedAsset] = useState<Asset[]>();

  const { t } = useTranslation<string>();
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selected, setSelected] = useState<CheckValue[]>([]);
  const [selectedActionRow, setSelectedActionRow] =
    React.useState<any>();

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

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setGroupedAsset(asset);
    setAnchorEl(event.currentTarget);
  };

  const controlSelection = (check: boolean) => {
    if (groupedAsset !== undefined) {
      let checkValues = groupedAsset.map((select: Asset, i: number) => {
        let obj: CheckValue = {
          isChecked: check,
          assetId: select.assetId
        }
        return obj;
      });
      setSelected(checkValues);
    }
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckAll(event.target.checked);
    controlSelection(event.target.checked)
  }
  

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, assetId: string) => {
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
    <div className="CRXPopupOuterDiv">
      <span
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onClick={handlePopoverOpen}
      >
        <i className="fal fa-clone"></i>
      </span>
      <CRXPopOver
        open={open}
        anchorEl={anchorEl}
        onSetAnchorE1={(v: HTMLElement) => setAnchorEl(v)}
        className={"CRXPopoverCss"}
      >
        <div className="CRXPopupInnerDiv">
          <div className="CRXPopupCrossButton">
            <CRXButton
              className={classes.CRXArrowStyle + " CRXCloseButton"}
              disableRipple={true}
              onClick={onClose}
            >
              <div className="icon icon-cross2 detailPopupCloseIcon"></div>
            </CRXButton>
          </div>
          <div className="CRXPopupHeader">
            <CRXHeading className="DRPTitle" variant="h3">
              {t("Grouped_Assets")}
            </CRXHeading>
          </div>
          <div className="CRXPopupTableDiv">
            <table>
              <tbody>
                <tr className="CRXPopupTableRow">
                  <td className="CRXPopupTableCellOne">
                    <CRXCheckBox
                      className="relatedAssetsCheckbox"
                      checked={checkAll}
                      onChange={(e:React.ChangeEvent<HTMLInputElement>) =>handleCheckAll(e)}
                    />
                  </td>
                  <td className="CRXPopupTableCellTwo">{t("Select_All")}</td>
                  <td className="CRXPopupTableCellThree"></td>
                  <td className="CRXPopupTableCellFour"></td>
                </tr>
                {(selected.length > 0 && groupedAsset !== undefined)
                  ? groupedAsset.map((asset: Asset, index: number) => {
                      const id = `checkBox'+${index}`;

                      return (
                        <>
                          <tr key={index}>
                            <td>
                              <CRXCheckBox
                                inputProps={id}
                                className="relatedAssetsCheckbox"
                                checked={selected[index].isChecked}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleCheck(e, selected[index].assetId)}
                              />
                            </td>
                            <td>
                              <AssetThumbnail
                                assetType={asset.assetType}
                                className={"CRXPopupTableImage"}
                              />
                            </td>
                            <td>
                            
                            <CRXMiddleTruncationPopover
                              content={asset.assetName}
                              isPopover={true}
                              maxWidth={200}
                              minWidth={150}
                            />
                              {/* <AssetNameTooltip
                                key={index}
                                assetName={asset.assetName}
                              /> */}
                              {asset.camera !== undefined &&
                              asset.camera !== null &&
                              asset.camera !== "" ? (
                                <div>
                                  <label className="CRXPopupDetailFontSize">
                                    {asset.camera}
                                  </label>
                                </div>
                              ) : (
                                <div>
                                  <label className="CRXPopupDetailFontSize">
                                    {asset.assetType}
                                  </label>
                                </div>
                              )}
                              <label className="CRXPopupDetailFontSize">
                                {dateDisplayFormat(asset.recordingStarted)}
                              </label>
                            </td>
                            <td className="CRXPopupActionIcon">
                              
                                {/* <i className="far fa-ellipsis-v actionIcon"> */}
                                <span onClick={() => setSelectedActionRow(asset)}>
                                  <DetailedAssetPopupAction row={row} asset={asset} selectedItems={selected} />
                                </span>
                                {/* </i> */}
                              
                            </td>
                          </tr>
                          
                        </>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </CRXPopOver>
    </div>
  );
};

export default DetailedAssetPopup;
