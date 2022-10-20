import React, { useState } from "react";
import { CRXButton, TextField } from "@cb/shared";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import "./AssetDetailsPanel.scss";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { CRXTooltip,CRXConfirmDialog } from "@cb/shared";
import { useTranslation } from "react-i18next";

type propsObject = {
  data:any;
  setData:any;
  searchFieldHeading:string
  searchFieldPlaceholder:string;
  URL:Array<string>;
  condition:boolean;
  onDeleteNotes:  (x:string,y:string) => void;
  onEdit:(x:string) => void;  
  onClickBookmarkNote:any
  }


const AssetDetailNotesandBookmark = ({data,setData,searchFieldHeading,searchFieldPlaceholder,URL,condition,onDeleteNotes,onEdit,onClickBookmarkNote}:propsObject) => {
  const { t } = useTranslation<string>();
  const [isEditing, setisEditing] = useState<number[]>([]);
  const [isReadMore, setIsReadMore] = useState<any[]>([]);
  const [searchTerm, setsearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState("");
  const [assetId, setAssetId] = React.useState("");
  const [primary] = React.useState<string>("Yes, close");
  const [secondary] = React.useState<string>("No, do not close");
  const onEditEnd = () => {
    setisEditing([]);
  };

  const handleSetNotes = (event: any,noteObject:any)=>{
    var tempData = [...data]
    var obj = tempData[0].notes.find((x:any)=>x.id == noteObject.id)
    if (obj !== undefined) {
     obj.description = event.target.value
    }
    setData(tempData)
  }

  const handleSetBookmarks = (event:any,bookmarkObj:any)=>{
      var tempData = [...data]
      var obj = tempData[0].bookmarks.find((x:any)=>x.id == bookmarkObj.id)
      if ( obj!=undefined ){
        obj.description = event.target.value
      }
      setData(tempData)

  }

  const handleEdit = (x:string)=>{
         onEdit(x)
         setisEditing([]);
  }

  const handleCancel = (id: number) =>{
    setisEditing(isEditing.filter((x:any) => x !== id));
  }

  const onFocusFunction = (id : number) => {
    setisEditing([id]);
  };

 const handleReadMore = (e : any, id: number)=>{
  
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



const handleNoteDelete = (noteId:string,assetId:string)=>{  

   setOpen(true)
   setId(noteId)
   setAssetId(assetId)
 

}



const handleFilter = (e:any)=>{

  setsearchTerm(e.target.value)
}


const handleNoteClicked = (x:any)=>{
 if (condition == true){
  onClickBookmarkNote(x,2)
 }
 else{
  onClickBookmarkNote(x,1)
 }
}

const handleClose = (e: React.MouseEvent<HTMLElement>) => {
  setOpen(false);
};

const onConfirmm = () => {
  setOpen(false);
  onDeleteNotes(id,assetId)   
};

// const createTextFieldIsEditCondition = (x : any, isEditId : any) => {
//   if(x.id === isEditId) {
//     console.log("des", x.description)
//   }
//   return (
//    )
// }
  return (
    
    <div className="_asset_detail_bookmarks">
     <CRXConfirmDialog
        setIsOpen={(e: React.MouseEvent<HTMLElement>) => handleClose(e)}
        onConfirm={onConfirmm}
        title={t("Please_confirm")}
        isOpen={open}
        modelOpen={open}
        primary={primary}
        secondary={secondary}
      >
        {
          <div className="crxUplockContent">
            {t("You_are_attempting_to")} <strong>{t("Delete")}</strong> {t("the")}{" "}
            <strong>{condition == true ? t("Notes") : t("Bookmark")}</strong>. 
            {t("action")}.
            <p>
              {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_dialogue?")}
            </p>
          </div>
        }
      </CRXConfirmDialog>

        <div className="inner_asset_detail_bookmarks">    
        <List onMouseLeave={onEditEnd}>
          <div className="_video_right_panel_item_heading">{searchFieldHeading}</div>
          <div className="_BN_Search_field">
             <TextField
              type="text" 
              placeholder={searchFieldPlaceholder} 
              onChange={ handleFilter }
              value={searchTerm} 
              name="bookmarkSearch" 
            />
          </div>
         
          <div className="_bookMark_list_items">
                {URL.filter  ((x: any) => {
                        if (searchTerm == ""){
                        return x
                        }
                        else if (x.description.toLowerCase().includes(searchTerm.toLowerCase())){
                        return x
                        }
                }).map((x:any)=>{
                    
                        
              return (
                <div className="item_asset_detail_bookmarks">

                    <a onClick={()=>handleNoteClicked(x)} >
                    <div className="_bookmark_time_user_flex">
                      <div className="_bookmark_time">
                        {condition ==true ?  moment(x.noteTime).format("HH:MM:SS"):moment(x.bookmarkTime).format("HH:MM:SS")}
                      </div>
                      <div className="_bookmark_users">
                        {` ${t("Form")} : ${x.madeBy}`}
                      </div>
                      <div className="textToggler">
                    {x.description.length >= 0 && x.description.length < 50 &&  
                      
                      <TextField
                        name={String(x.id)}
                        value={x.description}
                        color="primary"
                        className={isEditing.includes(x.id) == true ? " " : "removeOutLine"}
                        multiline={true}
                        rows={2}
                        onChange={condition == true ? (event : any) => handleSetNotes(event,x):(event : any) => handleSetBookmarks(event,x)}
                      />
                        
                    }
            
                     {x.description.length  >= 50 && x.description.length < 10000 &&  
                      <div className={isReadMore.find((y:any) => y.id == x.id)?.value ? " ReadMoreShow" :  "ReadMoreHide" }>
                          <div className="readMore">
                            <TextField
                            name={String(x.id)}
                            value={x.description}
                            InputProps={{endAdornment: <div onClick={(e) => handleReadMore(e, x.id) }>{isReadMore.find((y:any) => y.id == x.id)?.value ?
                            <i className="fas fa-angle-up"> {t("Showless")} </i> : <i className="fas fa-angle-down"> {t("Read_More")} </i>  }</div> }}
                            variant={isEditing.includes(x.id)  ?"outlined":"standard"} 
                            color="primary"
                            multiline
                            rows={2}
                            fullWidth 
                            rowsMax={12}
                            onChange={condition == true ? (event : any) => handleSetNotes(event,x):(event : any) => handleSetBookmarks(event,x)}
                              
                             /> 
                           </div>
                      </div>
                      }
                      
                      {isEditing.includes(x.id) && x.madeBy.includes("User") && (
                      <div className="_field_action_container">
                        <a onClick={()=>handleEdit(x)} className="_field_action_button"><i className="fas fa-check"></i></a>
                        <a onClick={() => handleCancel(x.id)} className="_field_action_button"><i className="fas fa-times"></i></a>
                      </div>
                    )}
                    </div>
                      <div className="_side_panel_bookmark_menu">
                        {x.madeBy.includes("User") && 
                        <div className="menu">
                        <Menu
                          align="start"
                          viewScroll="initial"
                          direction="bottom"
                          position="auto"
                          arrow
                          menuButton={
                          <MenuButton>   
                          <CRXTooltip
                            className="CRXTooltip_form"
                            iconName="far fa-ellipsis-v"
                            title="actions"
                            placement="right"
                          />
                          </MenuButton>}>
                          <MenuItem>
                          
                          <div onClick={()=>{handleNoteDelete(x.id,x.assetId)}}
                              className="crx-meu-content groupingMenu crx-spac">
                              <div className="crx-menu-icon">
                                <i className="fas fa-trash"></i>
                              </div>
                              <div className="_NB_menu_item">
                              {t("Delete")}
                              </div>
                          </div>
                          </MenuItem>
                          <MenuItem>     
                          <div onClick={() => onFocusFunction(x.id)}
                              className="crx-meu-content groupingMenu crx-spac">
                              <div className="crx-menu-icon">
                                <i className="fas fa-edit"></i>
                              </div>
                              <div className="_NB_menu_item">
                              {t("Edit")}
                              </div>
                          </div>
                            
                          </MenuItem>
                          </Menu>
                          </div>
                      }
                      </div>
                    </div>
                   
               
                  
                    
                  
                </a>
                </div>
              )}
            )} 
            </div>
        </List>
        </div>
        
    </div>
  );
};

export default AssetDetailNotesandBookmark;

