import React,{useRef,useState} from "react";
import { CRXSelectBox,CRXToaster,CRXAlert,GoogleMap } from "@cb/shared";
import "./AssetDetailsDropdown.scss";
import { EVIDENCE_SERVICE_URL } from '../../../utils/Api/url';
import AssetDetailNotesandBookmark from "./AssetDetailNotesandBookmark";

type propsObject = {
  data:any;
  evidenceId:string;
  setData:any;
  onClickBookmarkNote:any
}

const AssetDetailsDropdown = ({data,evidenceId,setData,onClickBookmarkNote}:propsObject) => {
   

  const [selectDropDown, setSelectDropDown] = React.useState("map");
  const targetRef = React.useRef<typeof CRXToaster>(null);
  const alertRef = useRef(null);
  const [alertType] = useState<string>('inline');
  const [errorType] = useState<string>('error');
  const [responseError] = React.useState<string>('');
  const [alert] = React.useState<boolean>(false);
  const options = [
    { value: "map", displayText: "Map" },
    { value: "bookmarks", displayText: "Bookmarks" },
    { value: "notes", displayText: "Notes" },
  ];
  

  const handleChangeDropDown = (event: any) => {
    setSelectDropDown(event.target.value);
  };




  const handleEdit = (x:any)=>{
    {selectDropDown == "notes" ? handleNoteEdit(x):handleBookmarkEdit(x)}
  }


const handleNoteEdit = (noteData:any)=>{
  const noteBody = {
    assetId: noteData.assetId, 
    id: noteData.id,
    position: noteData.position,
    description: noteData.description,
    version: noteData.version
};
const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      TenantId: "1",
    },
    body: JSON.stringify(noteBody)
  };
const url = EVIDENCE_SERVICE_URL + "/Evidences/"+evidenceId+"/Assets/"+noteData.assetId+"/Notes/"+noteData.id;
fetch(url, requestOptions)
.then((response: any) => {
    if (response.ok) {
      targetRef.current.showToaster({message: "Note Sucessfully Updated", variant: "Success", duration: 5000, clearButtton: true});    
    } 
})
.catch((err: any) => {

    console.error(err);


});
}

const handleBookmarkEdit= (bookmarkData:any)=>{
          const bookmarkBody = {
            id: bookmarkData.id,
            bookmarkTime: bookmarkData.bookmarkTime,
            position: bookmarkData.position,
            description: bookmarkData.description,
            madeBy: bookmarkData.madeBy,
            version: bookmarkData.version
          };
          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              TenantId: "1",
            },
            body: JSON.stringify(bookmarkBody),
          };
          const url = EVIDENCE_SERVICE_URL + "/Evidences/"+evidenceId+"/Assets/"+bookmarkData.assetId+"/Bookmarks/"+bookmarkData.id;
          fetch(url, requestOptions)
          .then((response: any) => {
            if (response.ok) {
              targetRef.current.showToaster({message: "Bookmark Edited Sucessfully ", variant: "Success", duration: 5000, clearButtton: true});  
            } 
          })
          .catch((err: any) => { 
            console.error(err);
          });
}




const handleDelete = (noteId:any,assetId:any)=>{
    
 { selectDropDown == "notes" ? 
  handleNoteDelete(noteId,assetId)
 :handleBookmarkDelete(noteId,assetId) }
 
}

const handleBookmarkDelete = (noteId:any,assetId:any)=>{
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      TenantId: "1",
    },
  };

const url = EVIDENCE_SERVICE_URL + "/Evidences/"+evidenceId+"/Assets/"+assetId+"/Bookmarks/"+noteId;
fetch(url, requestOptions)
.then((response: any) => {
    if (response.ok) {
      targetRef.current.showToaster({message: "Bookmark Delete Sucessfully ", variant: "Success", duration: 5000, clearButtton: true});
      var tempData = [...data]
      tempData[0].bookmarks = tempData[0].bookmarks.filter((x:any) => x.id !== noteId);
      setData(tempData)
    } 
})
.catch((err: any) => {
    console.error(err);
});
}


const handleNoteDelete = (noteId:any,assetId:any)=>{
    
 
    const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          TenantId: "1",
        },
      };

    const url = EVIDENCE_SERVICE_URL + "/Evidences/"+evidenceId+"/Assets/"+assetId+"/Notes/"+noteId;
    fetch(url, requestOptions)
    .then((response: any) => {
        if (response.ok) {
          targetRef.current.showToaster({message: "Note Deleted Sucessfully ", variant: "Success", duration: 5000, clearButtton: true});
          var tempData = [...data]
          tempData[0].notes = tempData[0].notes.filter((x:any) => x.id !== noteId);
          setData(tempData)
        } 
    })
    .catch((err: any) => {
        // setError(true);
        console.error(err);
    });

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
      
      {selectDropDown == "map" &&  
                <>
                  <GoogleMap
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    zoomLevel={30}
                    mapTypeControl={true}
                    initialMarker={{ lat: 13.084828874547332, long: 8.7890625 }}
                   
  
                   
                  />
                </>
              }
      {selectDropDown == "bookmarks" && 
      <AssetDetailNotesandBookmark
       data={data}
       setData={setData}
       searchFieldHeading="Search Bookmark"
       searchFieldPlaceholder="Search by Name, keyword, etc."
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
       searchFieldHeading="Search Notes"
       searchFieldPlaceholder="Search by Name, keyword, etc."
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

