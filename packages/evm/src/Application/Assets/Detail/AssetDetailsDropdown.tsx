import React, { useEffect, useState } from "react";
import { CRXSelectBox,CRXButton } from "@cb/shared";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import "./AssetDetailsDropdown.scss";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { EVIDENCE_SERVICE_URL } from '../../../utils/Api/url';

const AssetDetailsDropdown = ({data,evidenceId,setData}:any) => {
   

  const [selectDropDown, setSelectDropDown] = React.useState("map");
  const [isEditing, setisEditing] = useState<number[]>([]);
  const [isReadMore, setIsReadMore] = useState<any[]>([]);
  const [searchTerm, setsearchTerm] = React.useState("");
  const options = [
    { value: "map", displayText: "Map" },
    { value: "bookmarks", displayText: "Bookmarks" },
    { value: "notes", displayText: "Notes" },
  ];
  

  const handleChangeDropDown = (event: any) => {
    setSelectDropDown(event.target.value);
  };
  const onEditEnd = () => {
    setisEditing([]);
  };


  const handleSetNotes = (event:any,noteObject:any)=>{
    var tempData = [...data]
    var obj = tempData[0].notes.find((x:any)=>x.id == noteObject.id)
    if (obj !== undefined) {
     obj.description = event.target.value
    }
    setData(tempData)
  }

  const handleEdit = (x:string)=>{
  console.log("here we edit",x)
  //   const body = {
  //     id: bookmark.id,
  //     bookmarkTime: bookmark.bookmarkTime,
  //     position: bookmark.position,
  //     description: bookmark.description,
  //     madeBy:"User",
  //     version: bookmark.version
  // };
  // const requestOptions = {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": "application/json",
  //     TenantId: "1",
  //   },
  //   body: JSON.stringify(body),
  // };
  // const url = EVIDENCE_SERVICE_URL + "/Evidences/"+evidenceId+"/Assets/"+bookmark.assetId+"/Bookmarks/"+bookmark.id;
  // fetch(url, requestOptions)
  // .then((response: any) => {
  //     if (response.ok) {
  //        alert("happened")
  //     } else {
         
  //     }
  // })
  // .catch((err: any) => {
  //     // setError(true);
  //     console.error(err);
  // });

  }

  const handleCancel = (id: number) =>{
    setisEditing(isEditing.filter((x:any) => x !== id));
  }

  const onFocusFunction = (id : number) => {
    setisEditing([id]);
  };

 const handleReadMore = (e : any, id: number)=>{
   debugger
     var tempIsExist = [...isReadMore]
    var isExist = tempIsExist.find((y:any) => y.id == id);
    if(isExist !== undefined)
    {
      
        isExist.value = !isExist.value;
    }
    else{
        tempIsExist.push(
            {
                id: id,
                value: true
            }
        )
    }
    setIsReadMore(tempIsExist)
  
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

const handleFilter = (e:any)=>{
  setsearchTerm(e.target.value)
}




  return (
    
    <div className="detailDropdownMain">
  
      <CRXSelectBox
        options={options}
        id="simpleSelectBox"
        onChange={handleChangeDropDown}
        value={selectDropDown}
      />
      
      {selectDropDown == "map" && <h1>Map</h1>}
      {selectDropDown == "bookmarks" && <h1>Bookmark</h1>}
      {selectDropDown == "notes" && (
        
        <div className="inner-detailDropdownMain">    
        <List onMouseLeave={onEditEnd}>
          <h2>Search Notes</h2>
          <TextField
           type="text" 
           placeholder="Search by Name, keyword, etc." 
           onChange={handleFilter}
           value={searchTerm} 
           variant={"outlined"} 
           fullWidth 
            />

            
            { data[0].notes.filter((x: any) => {
                   if (searchTerm == ""){
                    return x
                  }
                  else if (x.description.toLowerCase().includes(searchTerm.toLowerCase())){
                    return x
                  }
                     } ).map((x:any)=>{
              
              return (
                <div className="item-detailDropdownMain">
                    <ListItem >
                    {moment(x.createdOn).format("HH:MM:SS")}
                    {` Form : ${x.madeBy}`}
                    <br />
                    <div >
                  <div className="menu">
                  <Menu
                    align="start"
                    viewScroll="initial"
                    direction="bottom"
                    position="auto"
                    arrow
                    menuButton={
                    <MenuButton>
                    <i className="fas fa-ellipsis-v"></i>
                    </MenuButton>}>
                    <MenuItem>
            
                        <div onClick={()=>handleNoteDelete(x.id,x.assetId)}
                            className="crx-meu-content groupingMenu crx-spac">
                            <div className="crx-menu-icon"></div>
                            <div >
                            Delete
                            </div>
                        </div>
                        
                    </MenuItem>
                    </Menu>
                    </div>
                      <div className="textToggler">
                        {x.description.length > 0 && x.description.length < 100 &&  
  
                     <TextField
                       name={String(x.id)}
                       value={x.description}
                       variant={isEditing.includes(x.id) ?"outlined":"standard"} 
                       color="primary"
                       multiline={true}
                       rows={2}
                       fullWidth 
                       onChange={(event) => handleSetNotes(event,x)}
                       onFocus={() => onFocusFunction(x.id)}>  
                       </TextField>

                       }
            
                     {x.description.length  > 100 && x.description.length < 10000 &&  
                      <div className={isReadMore.find((y:any) => y.id == x.id)?.value ? " ReadMoreShow" :  "ReadMoreHide" }>
                          <div className="readMore">
                            <TextField
                            name={String(x.id)}
                            value={x.description}
                            InputProps={{endAdornment: <div onClick={(e) => handleReadMore(e, x.id) }>{isReadMore.find((y:any) => y.id == x.id)?.value ?
                            <i className="fas fa-angle-up"> Showless </i> : <i className="fas fa-angle-down"> Read More </i>  }</div> }}
                            variant={isEditing.includes(x.id)  ?"outlined":"standard"} 
                            color="primary"
                            multiline
                            rows={2}
                            fullWidth 
                            rowsMax={12}
                            onChange={(event) => handleSetNotes(event,x)}
                            onFocus={() => onFocusFunction(x.id)}     
                             /> 
                           </div>
                      </div>
                      }
                      </div>
                    
                    {isEditing.includes(x.id) && (
                      <div >
                        <CRXButton onClick={()=>handleEdit(x)}><i className="fas fa-check"></i></CRXButton>
                        <CRXButton onClick={(e : any) => handleCancel(x.id)}><i className="fas fa-times"></i></CRXButton>
                      </div>
                    )}
                  </div>
                </ListItem>
                </div>
              )}
            )}
                    
            
          
        </List>
        </div>
      )}
    </div>
  );
};

export default AssetDetailsDropdown;

