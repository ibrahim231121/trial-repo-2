import React,{useRef,useState} from "react";
import { CRXSelectBox,CRXToaster,CRXAlert } from "@cb/shared";
import "./AssetDetailsDropdown.scss";
import { EVIDENCE_SERVICE_URL } from '../../../utils/Api/url';
import AssetDetailNotesandBookmark from "./AssetDetailNotesandBookmark";
import GoogleMap from "../../../map/google/GoogleMap";
import { Bookmark, Note } from "../../../utils/Api/models/EvidenceModels";
import { EvidenceAgent } from "../../../utils/Api/ApiAgent";
import { useTranslation } from "react-i18next";

type propsObject = {
  data:any;
  evidenceId:string;
  setData:any;
  onClickBookmarkNote:any;
  updateSeekMarker:any
  gMapApiKey:any
  gpsJson:any
  openMap:boolean
  setOnMarkerClickTimeData:any
}

const AssetDetailsDropdown = ({data,evidenceId,setData,onClickBookmarkNote,updateSeekMarker,gMapApiKey,gpsJson,openMap,setOnMarkerClickTimeData}:propsObject) => {
  const { t } = useTranslation<string>();
  const [selectDropDown, setSelectDropDown] = React.useState("map");
  const targetRef = React.useRef<typeof CRXToaster>(null);
  const alertRef = useRef(null);
  const [alertType] = useState<string>('inline');
  const [errorType] = useState<string>('error');
  const [responseError] = React.useState<string>('');
  const [alert] = React.useState<boolean>(false);
  
  const options = [
    { value: "map", displayText: t("Map") },
    { value: "bookmarks", displayText: t("Bookmarks") },
    { value: "notes", displayText: t("Notes") },
  ];

  const handleChangeDropDown = (event: any) => {
    setSelectDropDown(event.target.value);
  };




  const handleEdit = (x:any)=>{
    {selectDropDown == "notes" ? handleNoteEdit(x):handleBookmarkEdit(x)}
  }

const handleNoteEdit = (noteData:Note)=>{
  const noteBody : Note = {
    assetId: noteData.assetId, 
    id: noteData.id,
    position: noteData.position,
    description: noteData.description,
    version: noteData.version,
    noteTime: noteData.noteTime,
    madeBy: noteData.madeBy
  };
  const url = "/Evidences/" + evidenceId + "/Assets/" + noteData.assetId + "/Notes/" + noteData.id;
  EvidenceAgent.updateNote(url, noteBody).then(() => {
    targetRef.current.showToaster({message: t("Note_Sucessfully_Updated"), variant: t("Success"), duration: 5000, clearButtton: true});    
  })
}

const handleBookmarkEdit= (bookmarkData:Bookmark)=>{
  const bookmarkBody: Bookmark = {
    id: bookmarkData.id,
    assetId: bookmarkData.assetId,
    bookmarkTime: bookmarkData.bookmarkTime,
    position: bookmarkData.position,
    description: bookmarkData.description,
    madeBy: bookmarkData.madeBy,
    version: bookmarkData.version
  };
  const url = "/Evidences/" + evidenceId + "/Assets/" + bookmarkData.assetId + "/Bookmarks/" + bookmarkData.id;
  EvidenceAgent.updateBookmark(url, bookmarkBody).then(() => {
    targetRef.current.showToaster({message: t("Bookmark_Edited_Sucessfully"), variant: t("Success"), duration: 5000, clearButtton: true});  
  })
}




const handleDelete = (noteId:any,assetId:any)=>{
    
 { selectDropDown == "notes" ? 
  handleNoteDelete(noteId,assetId)
 :handleBookmarkDelete(noteId,assetId) }
 
}

const handleBookmarkDelete = (noteId:any,assetId:any)=>{
  const url = "/Evidences/"+evidenceId+"/Assets/"+assetId+"/Bookmarks/"+noteId;
  EvidenceAgent.deleteBookmark(url).then(() => {
    targetRef.current.showToaster({message: t("Bookmark_Delete_Sucessfully"), variant: t("Success"), duration: 5000, clearButtton: true});
    var tempData = [...data]
    tempData[0].bookmarks = tempData[0].bookmarks.filter((x:any) => x.id !== noteId);
    setData(tempData)
  })
}


const handleNoteDelete = (noteId:any,assetId:any)=>{
  const url = "/Evidences/"+evidenceId+"/Assets/"+assetId+"/Notes/"+noteId;
  EvidenceAgent.deleteNote(url).then(() => {
    targetRef.current.showToaster({message: t("Note_Deleted_Sucessfully"), variant: t("Success"), duration: 5000, clearButtton: true});
    var tempData = [...data]
    tempData[0].notes = tempData[0].notes.filter((x:any) => x.id !== noteId);
    setData(tempData)
  })
}
const callBackOnMarkerClick=(logtime:any)=>{
  const milliseconds = logtime * 1000
  const dateObject = new Date(milliseconds);
  setOnMarkerClickTimeData(dateObject);
}


  return (
  
    <div className="detailDropdownMain">
  
      <CRXToaster ref={targetRef} />
        <CRXAlert
        ref={alertRef}
        message={responseError}
        className='crxAlertUserEditForm'
        alertType={alertType}
        type={errorType}
        open={alert}
        setShowSucess={() => null}
      />
      <CRXSelectBox
        options={options}
        id="simpleSelectBox"
        onChange={handleChangeDropDown}
        value={selectDropDown}
      />
      
      {selectDropDown == "map" &&  openMap &&
        <GoogleMap
          apiKey={gMapApiKey}
          zoomLevel={15}
          mapTypeControl={true}
          gpsData = {gpsJson}
          callBackOnMarkerClick={callBackOnMarkerClick}
          updateSeekMarker={updateSeekMarker}
        />
      }
      {selectDropDown == "bookmarks" && 
      <AssetDetailNotesandBookmark
       data={data}
       setData={setData}
       searchFieldHeading={t("Search Bookmark")}
       searchFieldPlaceholder={t("Search_by_Name_keyword_etc.")}
       condition={false}
       URL={data[0].bookmarks}
       onDeleteNotes={handleDelete}
       onEdit={handleEdit}
       onClickBookmarkNote={onClickBookmarkNote}
       />
       }


      {selectDropDown == "notes" && 
      <AssetDetailNotesandBookmark
       data={data}
       setData={setData}
       searchFieldHeading={t("Search Notes")}
       searchFieldPlaceholder={t("Search_by_Name_keyword_etc.")}
       condition={true}
       URL={data[0].notes}
       onDeleteNotes={handleDelete}
       onEdit={handleEdit}
       onClickBookmarkNote={onClickBookmarkNote}
       />
      }
    </div>
  );
};

export default AssetDetailsDropdown;

