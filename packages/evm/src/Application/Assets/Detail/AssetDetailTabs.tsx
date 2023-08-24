import {CrxAccordion, CrxTabPanel, CRXTabs, CRXToaster} from "@cb/shared";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import {dateDisplayFormat} from "../../../GlobalFunctions/DateFormat";
import { Asset, RelatedAssets } from "../../../utils/Api/models/EvidenceModels";
import { AssetThumbnail } from "../AssetLister/AssetDataTable/AssetThumbnail";
import "./AssetDetailTabsMenu.scss";
import "./assetDetailTemplate.scss";
import { CRXCheckBox } from "@cb/shared";
import { Grid } from "@material-ui/core";
import { downloadExeFileByFileResponse } from "../AssetLister/ActionMenu";
import { AssetDetailRouteStateType } from "../AssetLister/AssetDataTable/AssetDataTableModel";
import { SearchModel } from "../../../utils/Api/models/SearchModel";
import AuditTrailLister from "./AuditTrailLister";
import { AssetReformated } from "./AssetDetailsTemplateModel";
import { FileAgent } from "../../../utils/Api/ApiAgent";
import { urlList, urlNames } from "../../../utils/urlList";
import moment from 'moment';
import { checkIndefiniteDate } from "../AssetLister/AssetDataTable/Utility";
import { CRXTooltip } from "@cb/shared";
import truncateMiddle from "truncate-middle";
import { CRXTruncation } from "@cb/shared";
import { Metadatainfo } from "../../../Redux/MetaDataInfoDetailReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";

type AssetDetailTabsProps = {
  evidence: any;
  assetId: string;
  evidenceId: number;
  uploadedOn: string;
  assetsList: Asset[];
  evidenceSearchObject: SearchModel.Evidence;
  relatedAssets : RelatedAssets[] | null | undefined;
}

const AssetDetailTabs: React.FC<AssetDetailTabsProps>  = (props) => {
  const { evidence, assetId, evidenceId, uploadedOn, assetsList, evidenceSearchObject, relatedAssets } = props;
  const { t } = useTranslation<string>();
  const history = useHistory();

  const tabs = [
    { label: t("Asset_Metadata_Info"), index: 0 },
    { label: t("SEE_MORE_ASSETS"), index: 1 },
    { label: t("Audit_Trail"), index: 2 },
  ];

  const targetRef = React.useRef<typeof CRXToaster>(null);
  const detail_view = React.useRef(null);

  const metaData: Metadatainfo = useSelector(
    (state: RootState) => state.metadatainfoDetailReducer.metadataInfoState
  );

  const [selectAllCheckBox, setSelectAllCheckBox] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [groupedAndRelatedAssetsFilesIds, setGroupedAndRelatedAssetsFilesIds] = React.useState<any[]>([]);
  const [groupedAssetsCheckBox, setGroupedAssetsCheckBox] = React.useState<{fileId: number, checkBoxName: string, isCheck: boolean}[]>([]);
  const [relatedAssetsCheckBox, setRelatedAssetsCheckBox] = React.useState<{fileId: number, checkBoxName: string, isCheck: boolean}[]>([]);
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true);
  const [expanded, isExpaned] = React.useState<string | boolean>("panel1");
  const [expandedRelatedAsset, isExpanedRelatedAsset] = React.useState<string | boolean>("panel2");

  const downloadFileByURLResponse = (url: string) => {
    const link = document.createElement("a");
    // Give url to link.
    link.href = url;
    //set download attribute to that link.
    link.setAttribute("download", ``);
    // Append to html link element page.
    document.body.appendChild(link);
    // start download.
    link.click();
    // Clean up and remove the link.
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  const DownloadFile = () => {
    if (groupedAndRelatedAssetsFilesIds !== null && groupedAndRelatedAssetsFilesIds !== undefined) {
      if (groupedAndRelatedAssetsFilesIds.length == 1) {
        let url:any  = `/Files/download/${groupedAndRelatedAssetsFilesIds[0].filesId}/${groupedAndRelatedAssetsFilesIds[0].accessCode}`
        FileAgent.getDownloadFileUrl(url)
          .then((response) => {
            downloadFileByURLResponse(response);
          })
          .catch(() => {
            targetRef.current.showToaster({ message: t("Unable_to_download_file"), variant: 'error', duration: 5000, clearButtton: true });
          });

      } else {
        let fileRequest = groupedAndRelatedAssetsFilesIds.map((x: any) => {
          return { fileRecId: x.filesId, accessCode: x.accessCode }
        });
        let multiExport = { fileRequest: fileRequest, operationType: 1 }
        targetRef.current.showToastMsg?.({
          message: t("files will be downloaded shortly"),
          variant: "success",
          duration: 5000,
        });
        FileAgent.getMultiDownloadFileUrl(multiExport)
          .then((response) => {
            downloadExeFileByFileResponse(response, "getacvideo-multidownloader");
            targetRef.current.showToastMsg?.({
              message: t("file downloaded successfully"),
              variant: "success",
              duration: 5000,
            });
          })
          .catch(() => {
            targetRef.current.showToastMsg?.({
              message: t("Unable_to_download_file"),
              variant: "error",
              duration: 5000,
            });
          });
      }
    }
  }

  const newRound = (x: any, y: any) => {
    history.push(urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url, {
      evidenceId: evidenceId,
      assetId: x,
      assetName: y,
      evidenceSearchObject: evidenceSearchObject
    })
    history.go(0)
  }

  const refresh = () => {
    window.location.reload();
  }

  useEffect(() => {
    if (groupedAndRelatedAssetsFilesIds && groupedAndRelatedAssetsFilesIds.length > 0)
      setIsDisabled(false);
    else
      setIsDisabled(true);

    if ((assetsList.length === groupedAssetsCheckBox.length) && (relatedAssets?.length === relatedAssetsCheckBox.length))
      setSelectAllCheckBox(true);
    else
      setSelectAllCheckBox(false);
  }, [groupedAssetsCheckBox, relatedAssetsCheckBox, isDisabled]);

  const tabHandleChange = (event: any, newValue: number) => {
    setCurrentTab(newValue);
  }

  const groupedAssetsCheckBoxChangeHandler = (e: any, asset: any) => {
    const filesId = asset.files[0]?.filesId;
    if (e.target.checked) {
      const accessCode = asset.files[0]?.accessCode;
      setGroupedAssetsCheckBox([...groupedAssetsCheckBox, {
        fileId: filesId,
        checkBoxName: asset.name,
        isCheck: true
      }]);
      setGroupedAndRelatedAssetsFilesIds([...groupedAndRelatedAssetsFilesIds, {
        filesId,
        accessCode
      }]);
    }
    else {
      setGroupedAssetsCheckBox(groupedAssetsCheckBox.filter(x => x.fileId != filesId));
      setGroupedAndRelatedAssetsFilesIds(groupedAndRelatedAssetsFilesIds.filter((x: any) => x.filesId != filesId));
    }
  }

  const relatedAssetsCheckBoxChangeHandler = (e: any, relatedAsset: any) => {
    const filesId = relatedAsset?.asset?.files[0]?.filesId;
    if (e.target.checked) {
      const accessCode = relatedAsset?.asset?.files[0]?.accessCode;
      setRelatedAssetsCheckBox([...relatedAssetsCheckBox, {
        fileId: filesId,
        checkBoxName: relatedAsset?.asset?.name,
        isCheck: true
      }]);
      setGroupedAndRelatedAssetsFilesIds([...groupedAndRelatedAssetsFilesIds, {
        filesId,
        accessCode
      }]);
    }
    else {
      setRelatedAssetsCheckBox(relatedAssetsCheckBox.filter(x => x.fileId != filesId));
      setGroupedAndRelatedAssetsFilesIds(groupedAndRelatedAssetsFilesIds.filter((x: any) => x.filesId != filesId));
    }
  }

  const checkEvidenceIndefinite = (retention : string) => {
    let date: Date;
    if (evidenceSearchObject?.holdUntil != null)
      date = moment(evidenceSearchObject.holdUntil).toDate();
    else
      date = moment(evidenceSearchObject?.expireOn).toDate();
    if (checkIndefiniteDate(date, evidenceSearchObject.evidenceRelations?.length > 0)) {
        return t("Indefinite");
    }
    return retention;
  }

  const selectAllAssetsCheckBoxOnChangeHandler = (e: any) => {
    setSelectAllCheckBox(e.target.checked);
    if (e.target.checked) {
      const groupedAndRelatedAssetsFilesIds: {filesId: any, accessCode : string}[] = [];
      const groupedCheckBoxArray: {fileId: number, checkBoxName: string, isCheck: boolean}[] = [];
      const relatedAssetsCheckBoxArray: {fileId: number, checkBoxName: string, isCheck: boolean}[] = [];
      const groupedAssets = assetsList.map(x => {
        return {
          filesId : x.files[0]?.filesId,
          accessCode: x.files[0]?.accessCode,
          assetName : x.name
        } as {filesId : number, accessCode : string, assetName : string };
      });
      for (const _asset of groupedAssets) {
        const fileId = _asset.filesId;
        const accessCode = _asset.accessCode;
        groupedAndRelatedAssetsFilesIds.push({
          filesId: fileId,
          accessCode
        });
        groupedCheckBoxArray.push({
          fileId: fileId,
          checkBoxName: _asset.assetName,
          isCheck: true
        });
      }
      if (relatedAssets) {
        const _relatedAssets = relatedAssets.map(x => {
          return {
            filesId: x.asset.files[0]?.filesId,
            accessCode: x.asset.files[0]?.accessCode,
            assetName: x.asset.name
          } as { filesId: number, accessCode: string, assetName: string };
        });
        for (const relatedAsset of _relatedAssets) {
          const fileId = relatedAsset.filesId;
          const accessCode = relatedAsset.accessCode;
          groupedAndRelatedAssetsFilesIds.push({
            filesId: fileId,
            accessCode
          });
          relatedAssetsCheckBoxArray.push({
            fileId: fileId,
            checkBoxName: relatedAsset.assetName,
            isCheck: true
          });
        }
      }
      setGroupedAndRelatedAssetsFilesIds(groupedAndRelatedAssetsFilesIds);
      setGroupedAssetsCheckBox(groupedCheckBoxArray);
      setRelatedAssetsCheckBox(relatedAssetsCheckBoxArray);
    } else {
      setGroupedAssetsCheckBox([]);
      setGroupedAndRelatedAssetsFilesIds([]);
      setRelatedAssetsCheckBox([]);
    }
  }

  return (
      <div className="asset_detail_tabs CRX_detail_tabs" id="detail_view" ref={detail_view}>
      <CRXToaster ref={targetRef} />

        <CRXTabs value={currentTab} onChange={tabHandleChange} tabitems={tabs} />

        <div className="list_data_main CRX_accordion_main">
          <CrxTabPanel value={currentTab} index={0}>

            <div className="list_data">
              <Grid container spacing={0}>
                <Grid item xs={4} className="list_para" >
                  <div className="asset_MDI_label">{t("Checksum")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data boldText asset_check_sum">{metaData.checksum}</div>
                  
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Asset ID")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.assetName}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Asset Type")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.typeOfAsset}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Asset Status")}</div>

                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.status}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("User")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                
                  <div className="asset_MDI_data">{metaData?.owners?.map((x: any) => x.split('@')[0]).join()}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Categories")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">
                    {
                      metaData?.categories?.map((x: any) =>
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={3}>
                              <span style={{ fontWeight: 700 }}>{x.name} :</span>
                            </Grid>
                            <Grid item xs={9}>
                              {x.formDatas.map((x: any) =>
                                <Grid item xs={9}>
                                  <span> {x.key + " : " + x.value} </span>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>

                        </>)
                    }
                  </div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Camera Name")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.camera}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Captured")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.capturedDate}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Uploaded")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{uploadedOn}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Duration")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.duration}</div>
                </Grid>



                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Size")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.size}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Retention")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{ checkEvidenceIndefinite(metaData?.retention)}</div>
                </Grid>
              </Grid>
            </div>
          </CrxTabPanel>

          <CrxTabPanel value={currentTab} index={1}>
            <div className="asset_export_button_group">
              <button className="iconButton_global" disabled={isDisabled} onClick={() => DownloadFile()}>
                <i className="far fa-download"></i>
                Download
              </button>
            </div>
          <div>
            <CRXCheckBox
              checked={selectAllCheckBox}
              lightMode={true}
              className='asse_detail_tab_checkBox '
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectAllAssetsCheckBoxOnChangeHandler(e)}
            />
            <span className="selectAllText">
              {t("Select_All")}
            </span>
          </div>

            <CrxAccordion
              title={t("Grouped_Assets") + ( assetsList && assetsList.length > 0 ?`(${assetsList.length})` : assetsList && assetsList.length == 0 ? `(0)` : "")}
              id="accorIdx1"
              className="crx-accordion"
              ariaControls="Content1"
              name="panel1"
              isExpanedChange={isExpaned}
              expanded={expanded === "panel1"}
            >
              <div className="asset_group_tabs_data">
                <div className="asset_group_tabs_data_row">
                  {assetsList.map((asset: any, index: number) => {
                    let lastChar = asset.name.substr(asset.name.length - 4);
                    let fileType = asset?.files &&  asset?.files[0]?.type;
                    let accessCode = asset?.files &&  asset?.files[0]?.accessCode;
                    let recordedBy = asset.owners && asset.owners.map((x : any)=> x.record.find((y: any) => y.key === "UserName")?.value)?.filter((x: any) => x != undefined);
                    let recordedBy_owners = recordedBy && recordedBy.map((x: any) => x.substring(0, x.lastIndexOf("@"))).join(",");

                   const Assetlink =  <Link
                    className="linkColor"
                    onClick={refresh}
                    to={{
                      pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
                      state: {
                        evidenceId: evidenceId,
                        assetId: asset.id,
                        assetName: asset.name,
                        evidenceSearchObject: evidenceSearchObject
                      } as AssetDetailRouteStateType,
                    }}>
                      <div className="">
                            {asset.name.toString().length > 23 ? 
                            truncateMiddle(asset.name, 11, 12, '...')
                            : asset.name }
                      </div>
                  </Link>

                    return (
                      <>
                        <div className="asset_group_tabs_data_col" key={index}>
                          <div className="_detail_checkBox_column">
                            <CRXCheckBox
                              checked={groupedAssetsCheckBox.find(x => x.fileId === asset.files[0]?.filesId)?.isCheck ?? false}
                              lightMode={true}
                              className='asse_detail_tab_checkBox '
                              onChange={(e: any) => groupedAssetsCheckBoxChangeHandler(e, asset)}
                            />
                          </div>
                          <div className="_detail_thumb_column">
                            <AssetThumbnail
                              assetName={asset.name}
                              assetType={asset.typeOfAsset}
                              fileType={fileType}
                              accessCode={accessCode}
                              className={"CRXPopupTableImage  CRXPopupTableImageUi"}
                              onClick={() => newRound(asset.id, asset.name)}
                              asset={asset}
                            />
                          </div>
                          <div className="_asset_detail_link_meta">
                            <div className="detail_seeMore_link">
                                <CRXTruncation className="detail_asset_truncation" placement="top" count={asset.name} content={Assetlink} middleTruncation={true} />
                            </div>
                       
                            <div className="detail_seeMore_info">
                                  {asset.owners && asset.typeOfAsset == "Video" ?
                                  <div className="assetDetail_recorded">
                                      <span>Recorded by: {recordedBy_owners} </span>
                                  </div> : 
                                  <div className="assetDetail_recorded">
                                    <span>File type: <span className="detail_file_type">{asset.files[0]?.type}</span></span>
                                  </div>
                                  }
                                  <div className="assetDetail_unitId">
                                    <span>Unit ID: {asset.unitId > 0 ? asset.unit.record.find((x:any) => x.key === 'Name').value : "N/A"}</span> 
                                  </div>
                                  {asset.files[0]?.recording.started && <label className="CRXPopupDetailFontSize">
                                  {asset.files[0]?.recording && dateDisplayFormat(asset.files[0]?.recording.started)}
                                  </label>
                                  }
                            </div>
                          </div>
                          <div className="detail_seeMore_primaryButton"> 
                                  {asset.id ==  assetId  ?
                                  <div className="assetDetialPrimary_indicator">
                                        primary
                                    </div>
                                  
                                  : null
                                  } 
                            </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </CrxAccordion>
            <CrxAccordion
               title={t("Related_Assets") + (relatedAssets && relatedAssets.length > 0 ?`(${relatedAssets.length})` : relatedAssets && relatedAssets.length == 0 ? `(0)` : "")}
              id="accorIdx2"
              className="crx-accordion"
              ariaControls="Content2"
              name="panel2"
              isExpanedChange={isExpanedRelatedAsset}
              expanded={expandedRelatedAsset === "panel2"}
            >
              <div className="asset_group_tabs_data">
                <div className="asset_group_tabs_data_row">
                  {relatedAssets ? relatedAssets?.map((relatedAsset: any, index: number) => {
                    let lastChar = relatedAsset?.asset?.name?.substr(relatedAsset?.asset?.name?.length - 4);
                    let fileType = relatedAsset?.asset?.files &&  relatedAsset?.asset?.files[0]?.type;
                   
                    const relatedAssetLink = <Link
                    className="linkColor"
                    onClick={refresh}
                    to={{
                      pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
                      state: {
                        evidenceId: evidenceId,
                        assetId: relatedAsset?.asset?.id,
                        assetName: relatedAsset?.asset?.name,
                        evidenceSearchObject: evidenceSearchObject
                      } as AssetDetailRouteStateType,
                    }}>
                    <div className="">
                            {relatedAsset?.asset?.name.toString().length > 23 ? 
                            truncateMiddle(relatedAsset?.asset?.name, 11, 12, '...')
                            : relatedAsset?.asset?.name }
                      </div>
                  </Link>
                    return (
                      <>
                        <div className="asset_group_tabs_data_col" key={index}>
                          <div className="_detail_checkBox_column">
                            <CRXCheckBox
                              checked={relatedAssetsCheckBox.find(x => x.fileId === relatedAsset?.asset?.files[0]?.filesId)?.isCheck ?? false}
                              lightMode={true}
                              className='asse_detail_tab_checkBox '
                              onChange={(e: any) => relatedAssetsCheckBoxChangeHandler(e,  relatedAsset)}
                            />
                          </div>
                          <div className="_detail_thumb_column">
                            <AssetThumbnail
                              assetName={relatedAsset?.asset?.name}
                              assetType={relatedAsset?.asset?.typeOfAsset}
                              fileType={fileType}
                              className={"CRXPopupTableImage  CRXPopupTableImageUi"}
                              onClick={() => newRound(relatedAsset?.asset?.id, relatedAsset?.asset?.name)}
                            />
                          </div>
                          <div className="_asset_detail_link_meta">
                            <div className="detail_seeMore_link">
                                <CRXTruncation className="detail_asset_truncation" placement="top" count={relatedAsset?.asset?.name} content={relatedAssetLink} middleTruncation={true} />
                            </div>
                      
                            <div className="detail_seeMore_info">
                                    {
                                      (relatedAsset?.asset.typeOfAsset === "Video" || relatedAsset?.asset.typeOfAsset === "Audio") && relatedAsset?.relationType != "" ?
                                        (
                                          <div className="detail_box_text">Related by:
                                            {
                                              relatedAsset?.relationType.split(',').map((x: any) => {
                                                return <div >{x}</div>
                                              })
                                            }
                                          </div>
                                        ) : (relatedAsset?.asset.typeOfAsset === "Image" || relatedAsset?.asset.typeOfAsset === "Executable" || relatedAsset?.asset.typeOfAsset === "Others" || relatedAsset?.asset.typeOfAsset === "Doc") && relatedAsset?.relationType != "" ? <div className="detail_box_text">File type:
                                          {
                                           <span className="detial_image_type">{relatedAsset?.asset.files[0]?.type}</span> 
                                          }
                                        </div> : <></>
                                    }
                                    {  relatedAsset?.asset.unitId > 0 ?  <div className="assetDetail_unitId">
                                        <span>Unit ID: {relatedAsset.asset.unit.record.find((x:any) => x.key === 'Name').value}</span>
                                      </div> :
                                      <div className="assetDetail_unitId">Unit ID: N/A</div>
                                    }
                                    {relatedAsset.asset.files[0]?.recording &&  <label className="CRXPopupDetailFontSize">
                                        {relatedAsset?.asset?.files[0]?.recording && dateDisplayFormat(relatedAsset?.asset?.files[0]?.recording.started)}
                                      </label>
                                    }
                            </div>
                          </div>
                          <div className="detail_seeMore_primaryButton"> 
                                  {relatedAsset?.asset?.id ==  assetId  ?
                                  <div className="assetDetialPrimary_indicator">
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
                        </div>
                      </>
                    );
                  }): <></>} 
                </div>
              </div>
            </CrxAccordion>
          </CrxTabPanel>

          <CrxTabPanel value={currentTab} index={2}>
            <AuditTrailLister evidence={evidence} assetId={assetId} metaData={metaData} uploadedOn={uploadedOn} />
          </CrxTabPanel>
        </div>
      </div>
  );
};

export default AssetDetailTabs;
