import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  SubMenu,
  MenuDivider,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import VideoPlayerBase from "../MediaPlayer/VideoPlayerBase";
import moment, { duration } from 'moment';
//import { number } from "yup/lib/locale";
//import { each } from "immer/dist/internal";
type Props = {

  row?: any;
};

type assetdata = {
  files: any;
  assetduration: number;
  assetbuffering:any;
  recording:any;
}


type filedata ={
  filename:string;
  fileurl:string;
  fileduration:number;

}

const EvidenceActionMenu: React.FC<Props> = ({row}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [assetmaterial, setassetmaterial] = React.useState<assetdata[]>([]);


const Getassets = () => {
  if(row)
  {
  const data=extract(row)
 // const detail=Durationfinder(data)
  history.push('/videoplayer',{ data: data})
  }
};
 function extract(row : any){
  let rowdetail: assetdata[] = [];
  let rowdetail1: assetdata[] = [];
 
  const masterduration=row.asset.master.duration;
  const buffering=row.asset.master.buffering;
  const file=extractfile(row.asset.master.files);
  const recording=row.asset.master.recording;
  let myData: assetdata={files:file,assetduration:masterduration,assetbuffering:buffering,recording:recording}
  rowdetail.push(myData);
  rowdetail1=row.asset.children.map((template: any, i:number) => {
    return {
        assetduration: template.duration,
        files: extractfile(template.files),
        assetbuffering: template.buffering,
        recording:template.recording,
    
    }
})
for(let x=0;x<rowdetail1.length;x++)
    {
      rowdetail.push(rowdetail1[x])
    }
 return rowdetail
}
function extractfile(file : any){
  let Filedata: assetdata[] = [];
  Filedata = file.map((template: any, i:number) => {
    return {
        filename: template.name,
        fileurl: template.url,
        fileduration: template.duration,
    
    }
})
return Filedata;
}

  return (

    <Menu
      align="start"
      viewScroll="initial"
      direction="right"
      position="auto"
      className="menuCss"
      arrow
      menuButton={
        <MenuButton>
          <i className="far fa-ellipsis-v"></i>
        </MenuButton>
      }
    >

      <MenuItem >
        <div className="crx-meu-content groupingMenu crx-spac" onClick={Getassets} >
          <div className="crx-menu-icon"></div>
          <div className="crx-menu-list">
           View Asset
          </div>
        </div>
      </MenuItem>
    </Menu>

  );
};
export default EvidenceActionMenu;
