import { useState } from 'react'
import MaterialMenu from "@material-ui/core/Menu";
import MaterialMenuItem from "@material-ui/core/MenuItem";
import { FormControlLabel, Switch } from "@material-ui/core";
import { CRXButton, CRXCheckBox } from "@cb/shared";

const VideoPlayerSettingMenu = (props:any)  => {

  const {singleVideoLoad, multiTimelineEnabled, setMultiTimelineEnabled, settingMenuEnabled, setSettingMenuEnabled, setSingleTimeline, timelinedetail, settimelinedetail, screenClick, overlayEnabled, setOverlayEnabled, overlayCheckedItems, setOverlayCheckedItems} = props;
  const [overlayMenuEnabled, setOverlayMenuEnabled] = useState<any>(null);
 

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
    if(event.target.checked) {
        setOverlayMenuEnabled(event.currentTarget)
    }
    setOverlayEnabled(event.target.checked); 
    setSettingMenuEnabled(null)
  }
  
  return (
    <>
     <MaterialMenu
                      className="ViewScreenMenu"
                      anchorEl={settingMenuEnabled}
                      keepMounted
                      open={Boolean(settingMenuEnabled)}
                      onClose={() => {setSettingMenuEnabled(null)}}
                      
                    >
                      <MaterialMenuItem>
                        {!singleVideoLoad && <FormControlLabel control={<Switch checked={multiTimelineEnabled} onChange={(event) => EnableMultipleTimeline(event)} />} label="Multi Timelines" />}
                      </MaterialMenuItem>
                      <MaterialMenuItem>
                        <FormControlLabel control={<Switch checked={overlayEnabled} onChange={(event) => OverlayChangeEvent(event) } />} label="Overlay" />
                      </MaterialMenuItem>
                    </MaterialMenu>

                    <MaterialMenu
                      className="ViewScreenMenu"
                      anchorEl={overlayMenuEnabled}
                      keepMounted
                      open={Boolean(overlayMenuEnabled)}
                      onClose={() => {overlayMenuEnabled(null)}}
                      
                    >
                      <MaterialMenuItem>
                        <CRXButton color="primary" onClick={(e : any) => {setSettingMenuEnabled(e.currentTarget); setOverlayMenuEnabled(null)}}>Back</CRXButton>
                      </MaterialMenuItem>
                      <MaterialMenuItem>
                        <CRXCheckBox
                          checked={overlayCheckedItems.some((x: any) => x == "All")}
                          onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems(["All"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x:any) => x !== "All"))}}
                          name="selectAll"
                          className="bucketListCheckedAll"
                          lightMode={true}/>
                        <span className="selectAllText">Select all</span>
                      </MaterialMenuItem>
                      <MaterialMenuItem>
                        <CRXCheckBox
                          checked={overlayCheckedItems.some((x: any) => x == "All" || x == "Timestamp")}
                          onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "Timestamp"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x:any) => x !== "Timestamp"))}}
                          name="Timestamp"
                          className="bucketListCheckedAll"
                          lightMode={true}/>
                        <span className="Timestamp">Timestamp</span>
                      </MaterialMenuItem>
                      <MaterialMenuItem>
                        <CRXCheckBox
                          checked={overlayCheckedItems.some((x: any) => x == "All" || x == "GPS (location + speed)")}
                          onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "GPS (location + speed)"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x:any) => x !== "GPS (location + speed)"))}}
                          name="GPS (location + speed)"
                          className="bucketListCheckedAll"
                          lightMode={true}/>
                        <span className="GPS (location + speed)">GPS (location + speed)</span>
                      </MaterialMenuItem>
                      <MaterialMenuItem>
                        <CRXCheckBox
                          checked={overlayCheckedItems.some((x: any) => x == "All" || x == "Sensors")}
                          onChange={(e: any) => { e.target.checked ? setOverlayCheckedItems([...overlayCheckedItems, "Sensors"]) : setOverlayCheckedItems(overlayCheckedItems.filter((x:any) => x !== "Sensors"))}}
                          name="Sensors"
                          className="bucketListCheckedAll"
                          lightMode={true}/>
                        <span className="Sensors">Sensors</span>
                      </MaterialMenuItem>
                    </MaterialMenu>
    </>
  )
}

export default VideoPlayerSettingMenu