import { useEffect, useState } from 'react'
import MaterialMenu from "@material-ui/core/Menu";
import MaterialMenuItem from "@material-ui/core/MenuItem";
import { CRXButton, CRXCheckBox,CBXSwitcher } from "@cb/shared";
import "./VideoPlayerSettingMenu.scss";
const VideoPlayerSettingMenu = (props: any) => {

  const { singleVideoLoad, multiTimelineEnabled, setMultiTimelineEnabled, settingMenuEnabled, setSettingMenuEnabled, setSingleTimeline, timelinedetail, settimelinedetail, screenClick, overlayEnabled, setOverlayEnabled, overlayCheckedItems, setOverlayCheckedItems } = props;
  const [overlayMenuEnabled, setOverlayMenuEnabled] = useState<any>(null);
  const [position, setPosition] = useState(false);
  const [notesEnabled, setnotesEnabled] = useState(false);
  const [annotationsEnabled, setannotationsEnabled] = useState(false);


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

  const notes = (e: any) => {
    if (e.target.checked) {
      setnotesEnabled(true);
    } else {
      setnotesEnabled(false);
    }
  }
  const Annotations = (e: any) => {
    if (e.target.checked) {
      setannotationsEnabled(true);
    } else {
      setannotationsEnabled(false);
    }
  }

useEffect(() => {
  if(Boolean(settingMenuEnabled) || Boolean(overlayMenuEnabled)) {
    document.querySelector(".faCogIcon")?.classList.add("faCogIconScale");
  } else {
    document.querySelector(".faCogIcon")?.classList.remove("faCogIconScale");
  }
})

  let CheckedSensors = overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors");
  let CheckedAll = overlayCheckedItems.some((x: any) => x == "All");
  let CheckedTimestamp = overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp");
  let CheckedGPS = overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)")
  let CheckedSpeed = overlayCheckedItems.some((x: any) => x == "All" || x == "Speed")

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

          <div className="SwitcherControl"  >
            <label>
              <span>Annotations</span>
              <CBXSwitcher className="videoSetingMenu_toggle_button" rootClass="videoSetingMenu_toggle" toggleLabel={false} theme="dark" checked={annotationsEnabled} size="small" onChange={(e: any) => Annotations(e)} name="Annotations" />
            </label>
          </div>
        </MaterialMenuItem>

        <MaterialMenuItem className="settingOverlay">
          <span className='fas fa-comment-alt-plus iconsLeft'></span>

          <div className="SwitcherControl"  >
            <label>
              <span>Notes</span>
              <CBXSwitcher rootClass="videoSetingMenu_toggle" toggleLabel={false} theme="dark" checked={notesEnabled} size="small" onChange={(e: any) => notes(e)} name="Notes" />
            </label>
          </div>
        </MaterialMenuItem>

        <MaterialMenuItem className="settingOverlay">
          <span className="icon icon-stack3 iconsLeft"></span>
          <span className="toggleBack"></span>
          <div className="SwitcherControl"  >
            <label>
              <span>Overlay</span>
              <CBXSwitcher rootClass="videoSetingMenu_toggle" toggleLabel={false} theme="dark" checked={overlayEnabled} size="small" onChange={(event: any) => OverlayChangeEvent(event)} name="Overlay" />
            </label>
          </div>
          <i className="fas fa-chevron-right iconsRight"></i>
        </MaterialMenuItem>

      </MaterialMenu>

      <MaterialMenu
        className={`ViewScreenMenu SettingBackMenu ${position === true && multiTimelineEnabled == true ? "backOverlayTab" : ""} ${CheckedAll ? "CheckedAllTrueMain" : ""} `}
        anchorEl={overlayMenuEnabled}
        keepMounted
        open={Boolean(overlayMenuEnabled)}
        onClose={() => { overlayMenuEnabled(null) }}

      >
        <MaterialMenuItem className='backChevron'>
          <i className="fas fa-chevron-left chevronLeft "></i>
          <CRXButton color="primary" onClick={(e: any) => { setSettingMenuEnabled(e.currentTarget); setOverlayMenuEnabled(null) }}>Back</CRXButton>
        </MaterialMenuItem>
        <MaterialMenuItem className={`${CheckedAll ? "CheckedAllTrue" : ""}`}>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems(["All"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "All")) }}
            name="selectAll"
            selectedRow={overlayCheckedItems.some((x: any) => x == "All")}
            className="bucketListCheckedAll "
          />
          <span className="selectAllText">All Metadata Overlays</span>
        </MaterialMenuItem>
        <MaterialMenuItem className={`${CheckedTimestamp || CheckedAll ? "CheckedTimestampTrue" : ""}`}>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "Timestamp"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "Timestamp")) }}
            name="Timestamp"
            selectedRow={overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp")}
            className="bucketListCheckedAll"
          />
          <span className="Timestamp">Time Stamp</span>
        </MaterialMenuItem>
        <MaterialMenuItem className={`${CheckedSensors || CheckedAll ? "CheckedSensorsTrue" : ""}`}>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "Sensors"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "Sensors")) }}
            selectedRow={overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors")}
            name="Sensors"
            className="bucketListCheckedAll"
          />
          <span className="Sensors">Sensors</span>
        </MaterialMenuItem>
        <MaterialMenuItem className={`${CheckedGPS || CheckedAll ? "CheckedGPSTrue" : ""}`}>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)")}
            selectedRow={overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "GPS (location + speed)"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "GPS (location + speed)")) }}
            name="GPS (location + speed)"
            className="bucketListCheckedAll"
          />

          <span className="GPS (location + speed)">GPS Coordinates</span>
        </MaterialMenuItem>
        <MaterialMenuItem className={`${CheckedSpeed || CheckedAll ? "CheckedSpeedTrue" : ""}`}>
          <CRXCheckBox
            checked={overlayCheckedItems.some((x: any) => x == "All" || x == "Speed")}
            selectedRow={overlayCheckedItems.some((x: any) => x == "All" || x == "Speed")}
            onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "Speed"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x: any) => x !== "Speed")) }}
            name="Speed"
            className="bucketListCheckedAll"
          />
          <span className="GPS (location + speed)">Speed</span>
        </MaterialMenuItem>

      </MaterialMenu>
    </>
  )
}

export default VideoPlayerSettingMenu