import {CrxAccordion, CrxTabPanel, CRXTabs, CRXToaster} from "@cb/shared";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import dateDisplayFormat from "../../../GlobalFunctions/DateFormat";
import { Asset } from "../../../utils/Api/models/EvidenceModels";
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

type AssetDetailTabsProps = {
  assetId: string;
  evidenceId: number;
  metaData: AssetReformated;
  uploadedOn: string;
  assetsList: Asset[];
  evidenceSearchObject: SearchModel.Evidence;
}

const AssetDetailTabs: React.FC<AssetDetailTabsProps>  = (props) => {
  const { assetId, evidenceId, metaData, uploadedOn, assetsList, evidenceSearchObject } = props;
  const { t } = useTranslation<string>();
  const history = useHistory();

  const tabs = [
    { label: t("Asset_Metadata_Info"), index: 0 },
    { label: t("GROUPED_AND_RELATED_ASSETS"), index: 1 },
    { label: t("Audit_Trail"), index: 2 },
  ];

  const targetRef = React.useRef<typeof CRXToaster>(null);
  const detail_view = React.useRef(null);



  const [currentTab, setCurrentTab] = React.useState(0);
  const [GroupedFilesId, setGroupedFilesId] = React.useState<any[]>([]);
  const [isChecked, setIsChecked] = React.useState<boolean>();
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true);
  const [expanded, isExpaned] = React.useState<string | boolean>("panel1");


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

    if (GroupedFilesId !== null && GroupedFilesId !== undefined) {
      if (GroupedFilesId.length == 1) {
        console.log("1 download");
        console.log(GroupedFilesId);
        let url:any  = `/Files/download/${GroupedFilesId[0].filesId}/${GroupedFilesId[0].accessCode}`
        FileAgent.getDownloadFileUrl(url)
          .then((response) => {
            downloadFileByURLResponse(response);
          })
          .catch(() => {
            targetRef.current.showToaster({ message: t("Unable_to_download_file"), variant: 'error', duration: 5000, clearButtton: true });
          });

      } else {
        console.log("multi download");
        let fileRequest = GroupedFilesId.map((x: any) => {
          return { fileRecId: x.filesId, accessCode: "access code" }
        });
        let multiExport = { fileRequest: fileRequest, operationType: 1 }
        console.log(fileRequest);
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
    if (GroupedFilesId && GroupedFilesId.length > 0)
      setIsDisabled(false);
    else
      setIsDisabled(true)
  }, [isChecked, isDisabled]);

  const tabHandleChange = (event: any, newValue: number) => {
    setCurrentTab(newValue);
  }

  const assetSelectionHanlder = (e: any, filesId: any) => {
    setIsChecked(e.target.checked)
    if (e.target.checked) {
      setGroupedFilesId([...GroupedFilesId, {
        filesId
      }])
    }
    else {
      setGroupedFilesId(GroupedFilesId.filter((x: any) => x.filesId != filesId));
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
                  <p className="list_Copy_text" onClick={() => { navigator.clipboard.writeText(metaData.checksum.toString()) }}>Copy</p>
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
                  <div className="asset_MDI_label">{t("Username")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">{metaData.owners.join(',')}</div>
                </Grid>


                <Grid item xs={4} className="list_para">
                  <div className="asset_MDI_label">{t("Categories")}</div>
                </Grid>
                <Grid item xs={8} className="list_para">
                  <div className="asset_MDI_data">
                    {
                      metaData.categories.map((x: any) =>
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
                  <div className="asset_MDI_data">{metaData?.retention}</div>
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

            <CrxAccordion
              title={t("Grouped_Assets")}
              id="accorIdx1"
              className="crx-accordion"
              ariaControls="Content1"
              name="panel1"
              isExpanedChange={isExpaned}
              expanded={expanded === "panel1"}
            >
              <div className="asset_group_tabs_data">
                <div className="asset_group_tabs_data_row">
                  {assetsList.filter(x => x.id != parseInt(assetId)).map((asset: any, index: number) => {
                    let lastChar = asset.name.substr(asset.name.length - 4);
                    let fileType = asset?.files &&  asset?.files[0]?.type;
                    let accessCode = asset?.files &&  asset?.files[0]?.accessCode;
                    return (
                      <>
                        <div className="asset_group_tabs_data_col" key={index}>
                          <div className="_detail_checkBox_column">
                            <CRXCheckBox
                              checked={isChecked}
                              lightMode={true}
                              className='asse_detail_tab_checkBox '
                              onChange={(e: any) => assetSelectionHanlder(e, asset.files[0].filesId)}
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
                            />
                          </div>
                          <div className="_asset_detail_link_meta">
                            <Link
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

                              <div id="middletruncate" data-truncate={lastChar}>
                                {asset.name}
                              </div>
                            </Link>

                            <div className="timeLineLister">
                              {asset.camera !== undefined &&
                                asset.camera !== null &&
                                asset.camera !== "" ? (
                                <div>
                                  <label className="CRXPopupDetailFontSize">
                                    {asset.camera}
                                  </label>
                                </div>
                              ) : (
                                <div className="_asset_video_type_detail">
                                  <label className="CRXPopupDetailFontSize">
                                    {asset.typeOfAsset}
                                  </label>
                                </div>
                              )}
                              <label className="CRXPopupDetailFontSize">
                                {asset.recording && dateDisplayFormat(asset.recording.started)}
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </CrxAccordion>
          </CrxTabPanel>

          <CrxTabPanel value={currentTab} index={2}>
            <AuditTrailLister metaData={metaData} uploadedOn={uploadedOn} />
          </CrxTabPanel>
        </div>
      </div>
  );
};

export default AssetDetailTabs;
