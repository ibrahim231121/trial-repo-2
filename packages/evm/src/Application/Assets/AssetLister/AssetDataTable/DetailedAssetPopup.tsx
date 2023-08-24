import React, { useRef, useState } from "react";
import {
  CRXPopOver,
  CRXCheckBox,
  CRXTabs,
  CrxTabPanel,
  CRXTruncation,
  CRXTooltip
} from "@cb/shared";
import "./DetailedAssetPopup.scss";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { dateDisplayFormat } from "../../../../GlobalFunctions/DateFormat";
import { AssetThumbnail } from "./AssetThumbnail"
import DetailedAssetPopupAction from "./DetailedAssetPopupAction"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Link } from "react-router-dom";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { addGroupedSelectedAssets } from "../../../../Redux/groupedSelectedAssets";
import { useDispatch, useSelector } from "react-redux";
import { urlList, urlNames } from "../../../../utils/urlList";
import { CRXLoader } from "@cb/shared";
import truncateMiddle from "truncate-middle";
import { RootState } from "../../../../Redux/rootReducer";
import { RelatedAssetsCreator, getRelatedAsset, resetRelatedAsset } from "../../../../Redux/FilteredRelatedAssetsReducer";
import { EvidenceAgent, SearchAgent } from "../../../../utils/Api/ApiAgent";
import moment from "moment";
import { addEvidenceObject, clearEvidenceSearchObject, getEvidenceSearchObject } from "../../../../Redux/FilterSearchEvidence";

type CheckValue = {
  isChecked: boolean;
  assetId: number;
  masterId?: number;
  evidenceId?: number;
  assetName?: string,
  assetType?: string,
  fileType?: string,
  expireOn?: Date,
  holduntil?: Date,
  isRelatedAsset?: boolean,
  row?: any
  evidence?: any
};

type Props = {
  asset: SearchModel.Asset[]
  row?: any;
  relatedAssets?: SearchModel.RelatedAssets[] | null;
}

const DetailedAssetPopup: React.FC<Props> = ({ asset, row, relatedAssets }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const popOverRef: any = useRef(null)
  const [groupedAsset, setGroupedAsset] = useState<SearchModel.Asset[]>();
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation<string>();
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selected, setSelected] = useState<CheckValue[]>([]);
  const [grouped, setGrouped] = useState<number>(0);
  const [relatedAssetData, setRelatedAssetData] = useState<any>();
  const [redacted, setRedacted] = useState<number>(0);
  const [selectedActionRow, setSelectedActionRow] = React.useState<any>();
  const [load, setLoad] = useState(false);
  const [popupScroll, setPopupScroll] = useState("upScrollBlock");
  const filteredRelatedAssets = useSelector((state: RootState) => state.filteredRelatedAssetsSlice)
  const sharePopupStatus = useSelector((state: RootState) => state.assetBucketBasketSlice.sharePopup);
  const [isAddedToBucket, setIsAddedToBucket] = useState<boolean>(false)
  const [relatedSelected, setRelatedSelected] = useState<CheckValue[]>([])
  const [isRelatedAssets, setIsRelatedAssets] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<CheckValue[]>([])
  const filteredSearchEvidence = useSelector((state: RootState) => state.FilteredSearchEvidenceSlice);
  const [response,setResponse] = useState<any>([]);
const[checkRelated,setCheckRelated] = useState<boolean>(false);

  const tabs = [
    { label: t("GROUPED") + ` (${grouped})`, index: 0 },
    { label: t("RELATED") + (relatedAssetData && relatedAssetData.length > 0 ? `(${relatedAssetData.length})` : relatedAssetData && relatedAssetData.length == 0 ? `(0)` : ""), index: 1 },
    { label: t("REDACTED") + ` (${redacted})`, index: 1 },
  ];


  useEffect(() => {
    if (asset?.length > 0) {
      setGrouped(asset?.length)
    }
  }, [asset]);

  useEffect(() => {
    controlSelection(false)
  }, [groupedAsset]);

  useEffect(() => {
    controlSelectionForRelatedAsset(false);
    if (relatedAssetData && checkAll) {
      controlSelectionForRelatedAsset(true);
    }
  }, [relatedAssetData])

  useEffect(() => {
    if (selectedValues.length > 0) {
      let countCheck: number = 0;
      let checkRelatedAssetExist = selectedValues.some((x: any) => x.isRelatedAsset == true && x.isChecked == true)
      checkRelatedAssetExist ? setIsRelatedAssets(true) : setIsRelatedAssets(false)
      selectedValues.forEach((x) => {
        if (x.isChecked === true) countCheck++;
      });
      if (selectedValues.length === countCheck) setCheckAll(true);
      else setCheckAll(false);
    }
  }, [selectedValues])

  useEffect(() => {
    if (isAddedToBucket === true) {
      
      setIsAddedToBucket(false);
      // setCheckAll(false);
    }
  }, [isAddedToBucket]);

  const onClose = () => {
    setCheckAll(false);
    !sharePopupStatus && setAnchorEl(null);
  };

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setGroupedAsset(asset);
    setAnchorEl(popOverRef.current);
  };

  const controlSelection = (check: boolean) => {
    let allCheckedValues: any = []; 
    if (groupedAsset !== undefined) {
      let checkValues = groupedAsset?.map((select: SearchModel.Asset, i: number) => {
        let obj: CheckValue = {
          isChecked: check,
          assetId: select?.assetId,
          masterId: row?.masterAsset?.assetId,
          evidenceId: row?.id,
          assetName: row?.asset?.find((x: any) => x.assetId == select.assetId)?.assetName,
          assetType: row?.asset?.find((x: any) => x.assetId == select.assetId)?.assetType,
          fileType: row?.asset?.find((x: any) => x.assetId == select.assetId)?.files[0]?.type,
          expireOn: row?.expireOn,
          isRelatedAsset: false,
          holduntil: row?.holdUntil,
        }
        allCheckedValues.push(obj);
        return obj;
      });
      setSelected(checkValues);
      let groupedSelectedAssets = checkValues?.map((select: any, i: number) => {
        let obj: any = {
          isChecked: select?.isChecked,
          assetId: select?.assetId,
          masterId: row?.masterAsset?.assetId,
          evidenceId: row?.id,
          assetName: row?.asset?.find((x: any) => x.assetId == select.assetId)?.assetName,
          assetType: row?.asset?.find((x: any) => x.assetId == select.assetId)?.assetType,
          fileType: row?.asset?.find((x: any) => x.assetId == select.assetId)?.files[0]?.type,
          expireOn: row?.expireOn,
          isRelatedAsset: false,
          holduntil: row?.holdUntil,
        }
        return obj;
      });
      dispatch(addGroupedSelectedAssets(groupedSelectedAssets));
      return checkValues
    }
   
  };

  const controlSelectionForRelatedAsset = (check: boolean) => {
    let data: any = [];
    if (relatedAssetData != undefined) {
      let checkValues1 = relatedAssetData?.map((select: any, i: number) => {
        const finds: any = filteredSearchEvidence.RelatedEvidenceObject.find((y: any) => +Object.keys(y)[0] == select.evidenceId)
        let obj: CheckValue = {
          isChecked: check,
          assetId: +select?.asset.id,
          masterId: +select?.asset.id,
          evidenceId: select.evidenceId,
          assetName: select?.asset.name,
          assetType: select?.asset.typeOfAsset,
          isRelatedAsset: true,
          expireOn: row?.expireOn,
          holduntil: row?.holdUntil,
          evidence: finds ? Object.values(finds)[0] : null
        }
        return obj;
      });
      if(checkRelated){
         data = selectedValues.filter((x: any) => x.isRelatedAsset !== true)
        setCheckRelated(false);
      }
      else{
        data = selectedValues
      }
      setRelatedSelected(checkValues1);
      setSelectedValues([...data,...checkValues1]);
      return checkValues1
    }
  }

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setCheckAll(event.target.checked);
    let related = controlSelectionForRelatedAsset(event.target.checked)?? [];
    let group = controlSelection(event.target.checked)?? [];
    let selectedAsset = related.concat(group);
    setSelectedValues([...selectedAsset]);
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, assetId: number) => {
    let checkValues = selected.map((select: CheckValue, i: number) => {
      if (select.assetId === assetId) {
        if (e.target.checked === false) setCheckAll(e.target.checked);
        let obj: CheckValue = {
          isChecked: e.target.checked,
          assetId: select.assetId,
          masterId: row.masterAsset.assetId,
          evidenceId: row?.id,
          assetName: row.asset.find((x: any) => x.assetId == select.assetId).assetName,
          assetType: row.asset.find((x: any) => x.assetId == select.assetId).assetType,
          fileType: row.asset.find((x: any) => x.assetId == select.assetId).files[0].type,
          expireOn: row.expireOn,
          isRelatedAsset: false,
          holduntil: row.holdUntil,
          row: row
        }
        return obj;
      } else return select;
    });
    setSelected(checkValues);
    setSelectedValues([...relatedSelected,...checkValues] )
    let groupedSelectedAssets = checkValues.map((select: any, i: number) => {
      let obj: any = {
        isChecked: select.isChecked,
        assetId: select.assetId,
        masterId: row.masterAsset.assetId,
        assetName: row.asset.find((x: any) => x.assetId == select.assetId).assetName,
        assetType: row.asset.find((x: any) => x.assetId == select.assetId).assetType,
        fileType: row.asset.find((x: any) => x.assetId == select.assetId).files[0].type,
        expireOn: row.expireOn,
        isRelatedAssets: false,
        holduntil: row.holdUntil,
        row: row
      }
      return obj;
    });
    dispatch(addGroupedSelectedAssets(groupedSelectedAssets));
  
  };
  

  const handleRelatedCheck = (e: React.ChangeEvent<HTMLInputElement>, assetId: number) => {
    if (relatedAssetData != undefined) {
      let checkValues1 = relatedSelected?.map((select: CheckValue, i: number) => {
        const finds: any = filteredSearchEvidence.RelatedEvidenceObject.find((y: any) => +Object.keys(y)[0] == select.evidenceId)
        if (select.assetId === assetId) {
          let obj: CheckValue = {
            isChecked: e.target.checked,
            assetId: +select?.assetId,
            masterId: +select?.assetId,
            evidenceId: select.evidenceId,
            evidence: finds ? Object.values(finds)[0] : null,
            assetName: select?.assetName,
            assetType: select?.assetType,
           isRelatedAsset : true,
           expireOn: row?.expireOn,
            holduntil: row?.holdUntil,
          }
          return obj;
        } else return select
      });

      setRelatedSelected(checkValues1);
      setSelectedValues([...selected,...checkValues1])

    }
  }

  function handleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  
  useEffect(() => {
    if (selectedValues.length) {
      const filteredEvidenceSearchObject1 = selectedValues.filter((x: any) => x.isChecked == true && x.isRelatedAsset == true)
      if (filteredEvidenceSearchObject1.length > 0) {
        filteredEvidenceSearchObject1.forEach(element => {
          const val: any = response.find((y: any) => y.id == element.evidenceId)
          if (val) { if (element.evidence === undefined) element.evidence = val}
        })
      }
    }
  },[response])

  const getRelatedEvidenceSearchObject =  (relatedArray: any) => {
     relatedArray && relatedArray.map((x: any) => {
      SearchAgent.getEvidenceSearch(x.evidenceId).then((resp) => {
        setResponse([...response,resp]);
         dispatch(addEvidenceObject({ [`${resp.id}`]: resp }));
      });
    })
  }
  useEffect(() => {
    if (value == 1) { // Related tab
      var check1 = filteredRelatedAssets.RelatedAsset.find((x: any) => Object.keys(x) == row.id);
      if (check1) {
        var values: any = Object.values(check1)[0]
        getRelatedEvidenceSearchObject(values);
        setRelatedAssetData(values);
      }
      else {
        setLoad(true)
        setRelatedSelected([])
        setCheckRelated(true);
        EvidenceAgent.getRelatedAssets(row.id).then((response) => {
          setLoad(false)
          filterRelatedAssetData(response, row.id);
          getRelatedEvidenceSearchObject(response);

        })
          .catch(() => {
            setLoad(false);
          });
      }
    }
  }, [value])
 

  useEffect(() => {
    dispatch(getRelatedAsset())
    dispatch(getEvidenceSearchObject())
  }, [dispatch])

  setTimeout(() => {
    dispatch(resetRelatedAsset())
  }, 3600000);

  const filterRelatedAssetData = (resp: any, rowId: number) => {
    var ONE_HOUR = 60 * 60 * 1000;
    var currentDate: any = moment().utc();
    var RecordingEndedDate: any = moment(row.masterAsset.recordingEnded).toDate();

    if ((currentDate - RecordingEndedDate) > ONE_HOUR) {
      dispatch(RelatedAssetsCreator({ [`${rowId}`]: resp }));
      setRelatedAssetData(resp);
    }
    else {
      setRelatedAssetData(resp);
    }
  }

  const popupScrollBar = (e: any) => {

    if (e?.target.scrollTop === 0) {
      setPopupScroll("upScrollBlock");
    } else if (e?.target.clientHeight >= (e?.target.scrollHeight - e?.target.scrollTop - 5)) {
      setPopupScroll("downScrollBlock");
    } else {
      setPopupScroll("noScrollBlock");
    }
  }

  const rowSelection = (relatedId: any) => {  
    let selectedRow = filteredSearchEvidence.RelatedEvidenceObject.find((x: any) => Object.keys(x)[0] == relatedId);
    if(selectedRow){
    let values = Object.values(selectedRow);
    return values[0]
    }
    else{
    return row
    }
  }


  return (
    <>
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
              <CRXTooltip
                iconName="fal fa-clone"
                arrow={false}
                title={`see more assets (${asset?.length})`}
                placement="bottom"
                className="popupAssetDetail"
              />
            </span>
          }
          <CRXPopOver
            open={open}
            anchorEl={popOverRef.current}
            className={`CRXPopoverCss DetailAsset_Popover ${popupScroll}`}
            title={t("See_More_Assets")}
            arrowDown={true}
            disablePortal={false}
            placement="right"
            onSetAnchorE1={(v: HTMLElement) => setAnchorEl(v)}
            removeOnScroll={false}
          >
            <div className="_checked_all_list">
              <CRXCheckBox
                className="relatedAssetsCheckbox"
                checked={checkAll}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCheckAll(e)}
                lightMode={true}
              />
              <span className="checked_all_text">{t("Select_All")}</span>
            </div>

            <CRXTabs classname="crxMainTab_listerPage" value={value} onChange={handleChange} tabitems={tabs} stickyTab={130} />
            <CrxTabPanel value={value} index={0} onScroll={(e: any) => popupScrollBar(e)} >
              <div className="_asset_group_popover_list">

                {(selected.length > 0 && groupedAsset !== undefined)
                  ? groupedAsset.map((asset: SearchModel.Asset, index: number) => {
                    const id = `checkBox'+${index}`;
                    const links =
                      <>
                        <Link
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

                          <div className={"assetName detailPopup_asset_name"}>
                            {asset.assetName.toString().length > 23 ?
                              truncateMiddle(asset.assetName, 11, 11, '...')
                              : asset.assetName}
                          </div>
                        </Link>
                      </>;

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
                              asset={asset}
                              evidence={row}
                              assetName={asset.assetName}
                              assetType={asset.assetType}
                              fileType={asset.files && asset.files[0]?.type}
                              accessCode={asset.files && asset.files[0]?.accessCode}
                              className={"CRXPopupTableImage"}
                            />
                          </div>
                          <Link
                            className="linkColor linkSeeMore"
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
                            <div className="_asset_group_list_detail">

                              <div className="_asset_group_list_link">
                                <CRXTruncation className="detail_asset_truncation" placement="top" count={asset.assetName} content={links} middleTruncation={true} />
                              </div>

                              <div className="assetDetail_recorded">
                                {asset.owners && asset.assetType == "Video" || asset.assetType == "Audio" ?
                                  <span>Recorded by: {asset.owners.map((x: any) => x.substring(0, x.lastIndexOf("@"))).join(", ")}</span>
                                  :
                                  <span>File Type: {asset?.files[0]?.type}</span>
                                }
                              </div>

                              <div className="assetDetail_unitId">
                                <span>Unit ID: {asset.unit ? asset.unit : "N/A"}</span>
                              </div>

                              {asset.recordingStarted && <div className="_asset_group_list_recordingStarted">
                                {dateDisplayFormat(asset.recordingStarted)}
                              </div>}
                            </div>
                          </Link>    

                          <div className="CRXPopupActionIcon">

                            <span onClick={() => setSelectedActionRow(asset)}>
                              <DetailedAssetPopupAction row={row} asset={asset} selectedItems={selectedValues} setIsAddedToBucket={setIsAddedToBucket} isRelatedAsset={isRelatedAssets} />
                            </span>

                          </div>

                          {asset.assetId == row.masterAssetId ?
                            <div className="assetDetial_indicator">
                              <CRXTooltip
                                content="Primary"
                                arrow={false}
                                title={`primary video`}
                                placement="bottom-start"
                                className="popupAssetDetail"
                              />
                            </div> : null
                          }
                        </div>

                      </>
                    );
                  }).reverse()
                  : null}

              </div>
            </CrxTabPanel>
            <CRXLoader
              show={load}
              loadingText="Please wait"
            />
            <CrxTabPanel value={value} index={1}>
              <div className="_asset_group_popover_list">

                {(relatedAssetData != null && relatedAssetData.length > 0)
                  ? relatedAssetData?.map((relatedAssetData: any, index: number) => {
                    const id = `checkBox'+${index}`;

                    const links = <Link
                      className="linkColor"
                      to={{
                        pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
                        state: {
                          evidenceId: row.id,
                          assetId: relatedAssetData?.asset?.id,
                          assetName: relatedAssetData?.asset?.name,
                          evidenceSearchObject: row
                        },
                      }}
                    >


                      <div className="assetName">
                        {relatedAssetData?.asset?.name.toString().length > 23 ?
                          truncateMiddle(relatedAssetData?.asset?.name, 10, 10, '...')
                          : relatedAssetData?.asset?.name}
                      </div>
                    </Link>
                    return (
                      <>
                        <div className="_asset_group_list_row" key={index}>
                          <div className="_asset_group_single_check">
                            <CRXCheckBox
                              inputProps={id}
                              className="relatedAssetsCheckbox"
                              checked={relatedSelected.length > 0 ? relatedSelected[index].isChecked : false}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => { handleRelatedCheck(e, relatedSelected[index].assetId) }}
                              lightMode={true}
                            />
                          </div>
                          <div className="_asset_group_list_thumb">
                            <AssetThumbnail
                              assetName={relatedAssetData?.asset?.name}
                              assetType={relatedAssetData?.asset?.typeOfAsset}
                              fileType={relatedAssetData?.asset?.files && relatedAssetData?.asset?.files[0]?.type}
                              className={"CRXPopupTableImage"}
                            />
                          </div>
                          <div className="_asset_group_list_detail">

                            <div className="_asset_group_list_link">
                              {links}
                            </div>
                            {
                              (relatedAssetData?.asset.typeOfAsset === "Video" || relatedAssetData?.asset.typeOfAsset === "Audio") && relatedAssetData?.relationType != "" ?
                                (
                                  <div className="box-wrapper">Related by:
                                    {
                                     ` ${ relatedAssetData?.relationType.replace(",",", ")}`
                                    }
                                  </div>
                                ) : (relatedAssetData?.asset.typeOfAsset === "Image" || relatedAssetData?.asset.typeOfAsset === "Executable" || relatedAssetData?.asset.typeOfAsset === "Others" || relatedAssetData?.asset.typeOfAsset === "Doc") && relatedAssetData?.relationType != "" ? <div className="box-wrapper">File Type:
                                  {
                                    ` ${relatedAssetData?.asset.files[0].type}`
                                  }

                                </div> : <></>
                            }
                            {
                              relatedAssetData?.asset.unitId > 0 ? <div className="assetDetail_unitId">

                                <span>Unit ID: {relatedAssetData.asset.unit.record.find((x: any) => x.key === 'Name').value}</span>
                              </div> :
                                <div className="assetDetail_unitId">Unit ID: N/A</div>
                            }
                            {relatedAssetData.asset.recording && <div className="_asset_group_list_recordingStarted">
                              {dateDisplayFormat(relatedAssetData?.asset?.recording?.started)}
                            </div>
                            }
                           
                          </div>
                          <div className="CRXPopupActionIcon">
                              <span onClick={() => setSelectedActionRow(relatedAssetData)}>
                                <DetailedAssetPopupAction row={rowSelection(relatedAssetData.evidenceId)} asset={relatedAssetData.asset} selectedItems={selectedValues} setIsAddedToBucket={setIsAddedToBucket} isRelatedAsset={true} relatedEvidenceObject={row}  />
                              </span>

                            </div>
                        </div>
                      </>
                        );
                  })
                  : null}

              </div>
            </CrxTabPanel>
            <CrxTabPanel value={value} index={2}></CrxTabPanel>
          </CRXPopOver>

        </div>
      </ClickAwayListener>
    </>

  );
};

export default DetailedAssetPopup;
