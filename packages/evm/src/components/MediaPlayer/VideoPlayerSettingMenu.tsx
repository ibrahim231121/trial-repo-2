import { useState } from 'react'
import MaterialMenu from "@material-ui/core/Menu";
import MaterialMenuItem from "@material-ui/core/MenuItem";
import { FormControlLabel, Switch } from "@material-ui/core";
import { CRXButton, CRXCheckBox } from "@cb/shared";
import "./VideoPlayerSettingMenu.scss";
const VideoPlayerSettingMenu = (props: any) => {

  const { singleVideoLoad, multiTimelineEnabled, setMultiTimelineEnabled, settingMenuEnabled, setSettingMenuEnabled, setSingleTimeline, timelinedetail, settimelinedetail, screenClick, overlayEnabled, setOverlayEnabled, overlayCheckedItems, setOverlayCheckedItems } = props;
  const [overlayMenuEnabled, setOverlayMenuEnabled] = useState<any>(null);
  const [position, setPosition] = useState(false);


  const EnableMultipleTimeline = (event: any) => {
    setMultiTimelineEnabled(event.target.checked)
    setSingleTimeline(!event.target.checked)
    if (event.target.checked == false) {
      let timelinedetailTemp = [...timelinedetail]
      timelinedetailTemp.forEach((x: any) => {
        if (x.indexNumberToDisplay != 1) {
          x.indexNumberToDisplay = 0;
          x.enableDisplay = false;
        }
      })
      settimelinedetail(timelinedetailTemp);
      screenClick(1, event);
    }
  }

  const OverlayChangeEvent = (event: any) => {
    if (event.target.checked) {
      setOverlayMenuEnabled(event.currentTarget)
      setPosition(true);
    } else {
      setPosition(false);

    }
    setOverlayEnabled(event.target.checked);
    setSettingMenuEnabled(null)
  }

  return (
    <>
      <MaterialMenu
        className={`ViewScreenMenu SettingOverlayMenu  ${position === true ? "settingOverlayPos" : ""}   ${multiTimelineEnabled ? "enabledMultiLine" : "disenabledMultiLine"}  ${position === true && multiTimelineEnabled == true ? " settingMultiOverlay" : ""}`}
        anchorEl={settingMenuEnabled}
        keepMounted
        open={Boolean(settingMenuEnabled)}
        onClose={() => { setSettingMenuEnabled(null) }}

      >


        <MaterialMenuItem className={`settingOverlay`}>
          <span className="icon icon-pencil5 iconsLeft"></span>
          <FormControlLabel control={<Switch />} label="Annotations" />
        </MaterialMenuItem>

        <MaterialMenuItem className="settingOverlay">
          <span className='fas fa-comment-alt-plus iconsLeft'></span>
          <FormControlLabel control={<Switch />} label="Notes" />
        </MaterialMenuItem>

        <MaterialMenuItem className="settingOverlay">
          <span className="icon icon-stack3 iconsLeft"></span>
          <span className="toggleBack"></span>
          <FormControlLabel control={<Switch checked={overlayEnabled} className="overlaySwitcher" onChange={(event) => OverlayChangeEvent(event)} />} label="Overlay" />
          <i className="fas fa-chevron-right iconsRight"></i>
        </MaterialMenuItem>
        <MaterialMenuItem className='multiTimeLine_tab'>
          <i className="far fa-stream"></i>
          {/* {!singleVideoLoad && <FormControlLabel control={<Switch checked={multiTimelineEnabled} onChange={(event) => EnableMultipleTimeline(event)} />} label="Multi Timelines" />} */}
          {<FormControlLabel control={<Switch checked={multiTimelineEnabled} onChange={(event) => EnableMultipleTimeline(event)} />} label="Multiple Timelines" />}

        </MaterialMenuItem>
      </MaterialMenu>

      <MaterialMenu
        className={`ViewScreenMenu SettingBackMenu ${position === true && multiTimelineEnabled == true ? "backOverlayTab" : ""}`}
        anchorEl={overlayMenuEnabled}
        keepMounted
        open={Boolean(overlayMenuEnabled)}
        onClose={() => { overlayMenuEnabled(null) }}

      >
        <MaterialMenuItem className='backChevron'>
          <i className="fas fa-chevron-left chevronLeft "></i>
          <CRXButton color="primary" onClick={(e: any) => { setSettingMenuEnabled(e.currentTarget); setOverlayMenuEnabled(null) }}>Back</CRXButton>
        </MaterialMenuItem>
        <MaterialMenuItem>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems(["All"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "All")) }}
            name="selectAll"
            className="bucketListCheckedAll"
            lightMode={false} />
          <span className="selectAllText">All</span>
        </MaterialMenuItem>
        <MaterialMenuItem>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "Timestamp"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "Timestamp")) }}
            name="Timestamp"
            className="bucketListCheckedAll"
            lightMode={false} />
          <span className="Timestamp">Timestamp</span>
        </MaterialMenuItem>
        <MaterialMenuItem>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "GPS (location + speed)"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "GPS (location + speed)")) }}
            name="GPS (location + speed)"
            className="bucketListCheckedAll"
            lightMode={false} />
          <span className="GPS (location + speed)">GPS (location + speed)</span>
        </MaterialMenuItem>
        <MaterialMenuItem>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "Sensors"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "Sensors")) }}
            name="Sensors"
            className="bucketListCheckedAll"
            lightMode={false} />
          <span className="Sensors">Sensors</span>
        </MaterialMenuItem>
      </MaterialMenu>
    </>
  )
}

export default VideoPlayerSettingMenu