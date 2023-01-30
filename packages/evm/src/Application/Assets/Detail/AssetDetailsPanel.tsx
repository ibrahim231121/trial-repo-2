import React, { useRef, useState } from "react";
import { CRXToaster, CRXAlert, CRXMenu } from "@cb/shared";
import "./AssetDetailsPanel.scss";
import GoogleMap from "../../../map/google/GoogleMap";
import { Bookmark, Note } from "../../../utils/Api/models/EvidenceModels";
import { EvidenceAgent } from "../../../utils/Api/ApiAgent";
import { useTranslation } from "react-i18next";
import { CMTEntityRecord } from "../../../utils/Api/models/CommonModels";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { addTimelineDetailActionCreator } from "../../../Redux/VideoPlayerTimelineDetailReducer";
import AssetDetailNotesandBookmarkBox from "./AssetDetailNotesandBookmarkBox";
import List from "@material-ui/core/List";
import { TextField } from "@cb/shared";
import { CRXSelectBox } from "@cb/shared";

type propsObject = {
  data: any;
  evidenceId: string;
  setData: any;
  onClickBookmarkNote: any;
  updateSeekMarker: any
  gMapApiKey: any
  gpsJson: any
  openMap: boolean
  setOnMarkerClickTimeData: any
  toasterMsgRef: any
  isGuestView: boolean
}
type Timeline = {
  recording_start_point: number;
  recording_Start_point_ratio: number;
  recording_end_point: number;
  recording_end_point_ratio: number;
  recordingratio: number;
  bookmarks: any;
  notes: any;
  startdiff: number;
  video_duration_in_second: number;
  src: string;
  id: string;
  dataId: string;
  unitId: string;
  enableDisplay: boolean,
  indexNumberToDisplay: number,
  camera: string,
  timeOffset: number,
}

const AssetDetailsPanel = ({ data, evidenceId, setData, onClickBookmarkNote, updateSeekMarker, gMapApiKey, gpsJson, openMap, setOnMarkerClickTimeData, isGuestView, toasterMsgRef }: propsObject) => {
  const { t } = useTranslation<string>();
  const [selectDropDown, setSelectDropDown] = React.useState(openMap ? "Map" : "Bookmarks");
  const targetRef = React.useRef<typeof CRXToaster>(null);
  const alertRef = useRef(null);
  const [alertType] = useState<string>('inline');
  const [errorType] = useState<string>('error');
  const [responseError] = React.useState<string>('');
  const [alert] = React.useState<boolean>(false);
  const [bookmarksStateArr, setBookmarksStateArr] = useState<any>([]);
  const [notesStateArr, setNotesStateArr] = useState<any>([]);
  const [searchTerm, setsearchTerm] = React.useState("");
  const [assetDetailSelectValue, setAssetDetailSelectValue] = React.useState<string>("Bookmarks")

  const timelinedetail: Timeline[] = useSelector(
    (state: RootState) => state.timelineDetailReducer.data
  );
  React.useEffect(() => {
    if (timelinedetail && timelinedetail.length > 0) {
      var tempbookmarksarray: any[] = [];
      var tempnotesarray: any[] = [];
      timelinedetail.forEach((x: Timeline) => {
        x.enableDisplay && x.bookmarks.forEach((y: any) => {
          let tempData: any = JSON.parse(JSON.stringify(y));
          tempbookmarksarray.push(tempData);
        }
        )
      }
      )
      setBookmarksStateArr(tempbookmarksarray);
      timelinedetail.forEach((x: Timeline) => {
        x.enableDisplay && x.notes.forEach((y: any) => {
          let tempData: any = JSON.parse(JSON.stringify(y));
          tempnotesarray.push(tempData);
        }
        )
      }
      )
      setNotesStateArr(tempnotesarray);
    }
  }, [timelinedetail]);

  const [options, setOptions] = React.useState(!isGuestView ? [
    { value: "Transcription", displayText: "Transcription" },
    { value: "Notes", displayText: "Notes" },
    { value: "Bookmarks", displayText: "Bookmarks" }
  ] : []);

  React.useEffect(() => {
    if (openMap) {
      setOptions([...options, { value: "Map", displayText: "Map" }])
    }
  }, [openMap]);

  React.useEffect(() => {
    if (openMap) {
      setAssetDetailSelectValue("Map")
      setSelectDropDown("Map")
    }
  }, [options])

  const handleChangeDropDown = (event: any) => {

    setSelectDropDown(event.target.value);
    setAssetDetailSelectValue(event.target.value)
  };

  const callBackOnMarkerClick = (logtime: any) => {
    const dateObject = new Date(logtime);
    setOnMarkerClickTimeData(dateObject);
  }

  const handleFilter = (e: any) => {
    setsearchTerm(e.target.value)
  }
  const handleFilterClear = (e: any) => {
    setsearchTerm("");
  }


  return (

    <div className="detailDropdownMain">

      <CRXToaster ref={targetRef} />
      {alert && <CRXAlert
        ref={alertRef}
        message={responseError}
        className='crxAlertUserEditForm'
        alertType={alertType}
        type={errorType}
        open={alert}
        setShowSucess={() => null}
      />}
      <div className="Video_Side_Panel_DropDown">
        <CRXSelectBox
          options={options}
          defaultOption={false}
          className="video_right_panel_dropDown"
          onChange={(e: any) => handleChangeDropDown(e)}
          icon={true}
          defaultOptionText={openMap ? "Map" : "Bookmarks"}
          popover="video_right_panel_dropDown_menu"
          value={assetDetailSelectValue}
        />
      </div>


      {selectDropDown == "Map" && openMap && gpsJson && gpsJson.length > 0 &&
        <GoogleMap
          apiKey={gMapApiKey}
          zoomLevel={15}
          mapTypeControl={true}
          gpsData={gpsJson}
          callBackOnMarkerClick={callBackOnMarkerClick}
          updateSeekMarker={updateSeekMarker}
        />
      }


      {(selectDropDown == "Bookmarks" || selectDropDown == "Notes") &&
        <div className="_asset_detail_bookmarks">
          <div className="inner_asset_detail_bookmarks">
            <List>
              <div className="_video_right_panel_item_heading">{selectDropDown == "Bookmarks" ? t("Search Bookmarks") : t("Search Notes")}</div>
              <div className="_BN_Search_field">

                <TextField
                  type="text"
                  placeholder={t("Search_by_Name_keyword_etc.")}
                  onChange={handleFilter}
                  value={searchTerm}
                  name="bookmarkSearch"
                />
                <i className="fa-regular fa-magnifying-glass magnifyingIconUi"></i>
                {searchTerm && <i onClick={handleFilterClear} className="fa-regular fa-xmark xmarkIconUi"></i>}
              </div>
              <div className="_bookMark_list_items ">
                {selectDropDown == "Bookmarks" &&
                  bookmarksStateArr.filter((bookmarkStateObj: any) => searchTerm == "" ? true : bookmarkStateObj.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((bookmarkStateObj: any) => {
                      return (
                        <AssetDetailNotesandBookmarkBox
                          stateObj={bookmarkStateObj}
                          EvidenceId={evidenceId}
                          timelinedetail={timelinedetail}
                          selectDropDown={selectDropDown}
                          onClickBookmarkNote={onClickBookmarkNote}
                          toasterMsgRef={toasterMsgRef} />
                      )
                    }
                    )
                }
                {selectDropDown == "Notes" &&
                  notesStateArr.filter((noteStateObj: any) => searchTerm == "" ? true : noteStateObj.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((noteStateObj: any) => {
                      return (
                        <AssetDetailNotesandBookmarkBox
                          stateObj={noteStateObj}
                          EvidenceId={evidenceId}
                          timelinedetail={timelinedetail}
                          selectDropDown={selectDropDown}
                          onClickBookmarkNote={onClickBookmarkNote}
                          toasterMsgRef={toasterMsgRef} />
                      )
                    }
                    )
                }
              </div>
            </List>
          </div>
        </div>
      }
    </div>
  );
};

export default AssetDetailsPanel;

