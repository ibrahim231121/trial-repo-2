import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";

import { CRXPanelStyle } from "@cb/shared";
import { DragDropContext } from "react-beautiful-dnd";

import { AssetThumbnail } from "./Application/Assets/AssetLister/AssetDataTable/AssetThumbnail";
import { useTranslation } from "react-i18next";
import "../../evm/src/utils/Localizer/i18n";
import { addAssetToBucketActionCreator } from "../src/Redux/AssetActionReducer";
import { useDispatch } from "react-redux";
import { getCategoryAsync } from "./Redux/categoryReducer";
import { useSelector } from "react-redux";
import { cultureActionCreator } from "./Redux/languageSlice";
import { RootState } from "./Redux/rootReducer";
import { CRXDropDown } from "@cb/shared";
import { CRXSelectBox } from "@cb/shared";
import "./App.scss";

import { setupSignalRConnection } from "./utils/hub_config";

import { SnackbarProvider, useSnackbar } from "notistack/dist/index";

import ApplicationPermissionProvider from "./ApplicationPermission/ApplicationPermissionProvider";
import { Permission } from "./ApplicationPermission/types";
import { getToken } from "./Login/API/auth";
import jwt_decode from "jwt-decode";
import { TokenType } from "./types";

function App() {
  const value: string = useSelector(
    (state: RootState) => state.cultureReducer.value
  );
  const options = [
    { value: "en", displayText: "English" },
    { value: "fr", displayText: "French (CA)" },
    { value: "pl", displayText: "Polish" },
    { value: "uk", displayText: "English (UK)" },
    { value: "isr", displayText: "Hebrew" },
  ];
  let culture: string = useSelector(
    (state: RootState) => state.cultureReducer.value
  );
  const [resources, setResources] = useState<any>("");
  const { i18n } = useTranslation<string>();
  const [rtl, setRTL] = useState<string>();
  const dispatch = useDispatch();
  const [moduleIds, setModuleIds] = React.useState<number[]>([]);
  const [open, setOpen] = useState(true);
  const classes = CRXPanelStyle();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleChange = (event: any) => {
    dispatch(cultureActionCreator(event.target.value));
  };
  dispatch(cultureActionCreator(value));

  useEffect(() => {
    import(`../../evm/src/utils/Localizer/resources/${culture}`).then((res) => {
      setResources(res.resources);
      dispatch(getCategoryAsync());
    });

    i18n.init({
      resources: resources,
      lng: culture,
    });

    if (i18n.language === "en") {
      i18n.changeLanguage("en");
      setRTL("ltr");
    } else if (i18n.language === "ar") {
      i18n.changeLanguage("ar");
      setRTL("rtl");
    } else if (i18n.language === "fr") {
      i18n.changeLanguage("fr");
      setRTL("ltr");
    } else if (i18n.language === "isr") {
      i18n.changeLanguage("isr");
      setRTL("ltr");
    } else if (i18n.language === "pl") {
      i18n.changeLanguage("pl");
      setRTL("ltr");
    } else if (i18n.language === "uk") {
      i18n.changeLanguage("uk");
      setRTL("ltr");
    }
  }, [culture, resources]);

  useEffect(()=>{

   //setupSignalRConnection("https://localhost:54321/command");
    
    var token = getToken();
    if(token){
          //  setupSignalRConnection("https://localhost:54321/command");
            setupSignalRConnection("https://localhost:54321/command");
            var moduleIds = getModuleIds();
            if(moduleIds){
             
              setModuleIds(moduleIds);
            }
        
    }
  }, []);

  const getModuleIds = () => {
    var token = getToken();
    if (token) {
      if (moduleIds.length <= 0) {
        var accessTokenDecode: TokenType = jwt_decode(token);
        if (
          accessTokenDecode !== null &&
          accessTokenDecode.AssignedModules &&
          accessTokenDecode.AssignedModules !== ""
        ) {
          var moduleIdsAssigned = accessTokenDecode.AssignedModules.split(
            ","
          ).map((x) => parseInt(x));
          return moduleIdsAssigned;
        } else {
          return [];
        }
      }
      if (moduleIds.length > 0) {
        return moduleIds;
      }
    } else {
      return [];
    }
  };

  const onDragStart = (e: any) => {
    var divMainBucket: any = document.getElementById("divMainBucket");
    if (divMainBucket !== null && e.source.droppableId === "assetDataTable") {
      var ligthBg = document.createElement("div");
      ligthBg.id = "lightBgContent";

      var bucketParentClass: any =
        document.getElementsByClassName("CRXBucketPanel");
      bucketParentClass[0].childNodes[0].style.borderBottomColor = "#EBA580";
      divMainBucket.appendChild(ligthBg);
      //divMainBucket.style.opacity = "0.5";
      divMainBucket.style.background = "#fff";
      divMainBucket.style.borderImageWidth = "3px";
      divMainBucket.style.transform = "none";
    }

    let assetContainer = localStorage.getItem("AssetContainer");
    var draggableItem = document.getElementById(
      "draggableItem" + e.source.index.toString() + e.source.droppableId
    );

    if (assetContainer !== null && draggableItem !== null) {
      let divOuter = document.createElement("div");
      divOuter.className = "divOuter";
      divOuter.id = "divOuter";
      divOuter.style.display = "block";
      let left: number = 0;
      let top: number = 0;

      let container = JSON.parse(assetContainer);

      let divCount = document.createElement("div");
      divCount.className = "divCount crxBadgeComponent-Grey";
      divCount.id = "divCount";
      divCount.innerHTML = container.length;
      if (container.length > 1) divCount.style.display = "";
      else divCount.style.display = "none";
      divOuter.appendChild(divCount);

      container.map((con: any, index: number) => {
        let divInner = document.createElement("div");
        divInner.className = "divInner";
        divInner.id = "innerDiv" + index.toString();
        divInner.style.zIndex = (container.length - index).toString();
        divInner.style.position = "absolute";
        divInner.style.top = top.toString() + "px";
        divInner.style.left = left.toString() + "px";

        var div1 = document.createElement("div");
        div1.className = "dragging";
        div1.id = "innerDrag" + index.toString();

        var i1 = document.createElement("i");
        i1.className = "icondrag fas fa-grip-vertical";
        div1.append(i1);
        divInner.appendChild(div1);

        var div2 = document.createElement("div");
        div2.className = "divImg";
        div2.id = "innerImg" + index.toString();

        // var i2 = document.createElement("i");
        // i2.className = AssetThumbnailIcon(con.assetType)
        // div2.append(i2);
        var i2 = (
          <AssetThumbnail
            className="onDraggingThumb"
            assetType={con.assetType}
            fontSize="50pt"
          />
        );
        ReactDOM.render(i2, div2);
        divInner.appendChild(div2);

        var div3 = document.createElement("div");
        div3.className = "divAssetId";
        div3.id = "innerAssetId" + index.toString();
        var i3 = document.createElement("a");
        i3.className = "linkColor";
        i3.innerHTML = con.assetName;
        div3.append(i3);
        divInner.appendChild(div3);

        top = top + 7;
        left = left + 7;

        divOuter.appendChild(divInner);
      });

      let classtd: HTMLCollectionOf<Element> =
        document.getElementsByClassName("CRXDataTableCustom");

      for (let x = 0; classtd.length > x; x++) {
        classtd[x].classList.add("draggingDropOn");
      }

      if (draggableItem !== null) {
        const getParent: HTMLElement | null = draggableItem.parentElement;
        const createBorder: HTMLElement = document.createElement("div");
        createBorder.id = "draggingStartBorder";
        var dragGrep = document.createElement("i");
        dragGrep.className = "iconStartdrag fas fa-grip-vertical";
        createBorder.append(dragGrep);
        getParent != null && getParent.appendChild(createBorder);
      }

      draggableItem.appendChild(divOuter);

    }
  };

  const onDragEnd = (e: any) => {
    var divOuter = document.getElementById("divOuter");
    if (divOuter !== null) divOuter.remove();

    const startBorder = document.getElementById("draggingStartBorder");
    startBorder && startBorder.remove();

    var bucketParentClass: any =
      document.getElementsByClassName("CRXBucketPanel");
    bucketParentClass[0].childNodes[0].style.borderBottomColor = "#D74B00";

    var divMainBucket = document.getElementById("divMainBucket");
    if (divMainBucket !== null) {
      divMainBucket.style.opacity = "1";
      divMainBucket.style.color = "unset";
      divMainBucket.style.background = "unset";
      divMainBucket.style.borderImageWidth = "0px";

      const findLightBg = document.getElementById("lightBgContent");
      findLightBg && findLightBg.remove();
    }

    let container: any;
    let assetContainer = localStorage.getItem("AssetContainer");
    if (assetContainer !== null) container = JSON.parse(assetContainer);

    localStorage.removeItem("AssetContainer");

    let classtd: any = document.getElementsByClassName("CRXDataTableCustom");
    for (let x = 0; classtd.length > x; x++) {
      classtd[x].classList.remove("draggingDropOn");
    }
    // Make sure we have a valid destination
    if (e.destination === undefined || e.destination === null) return null;
    // Make sure we're actually moving the item
    if (
      e.source.droppableId === e.destination.droppableId &&
      e.destination.index === e.source.index
    )
      return null;

    if (
      e.destination.droppableId === "assetBucket" ||
      e.destination.droppableId === "assetBucketEmptyDroppable"
    )
      dispatch(addAssetToBucketActionCreator(container));

    return null;
  };

  const onDragUpdate = (e: any) => {
    var divMainBucket = document.getElementById("divMainBucket");
    if (
      e.destination !== null &&
      (e.destination.droppableId === "assetBucketEmptyDroppable" ||
        e.destination.droppableId === "assetBucket")
    ) {
      if (divMainBucket !== null) {
        divMainBucket.style.transform = "none";
      }
    }
  };

  const icons = {
    success: <i className="fas fa-check-circle successIcon"></i>,
    attention: <i className="fas fa-info-circle infoIcon"></i>,
    warning: <i className="fas fa-exclamation-triangle warningIcon"></i>,
    error: <i className="fas fa-exclamation-circle errorIcon"></i>,
  };

  return (
    <ApplicationPermissionProvider  setModuleIds={
                                          (moduleIds:number[]) =>{
                                            
                                            setModuleIds(moduleIds)}
                                          }  
                                    moduleIds={moduleIds}  
                                    getModuleIds={()=>{ 
                                          var moduleIds =  getModuleIds()
                                          if(moduleIds){
                                            return moduleIds
                                          }else{
                                            return []
                                          }
                                    }}
                                    >
        <div dir={rtl}>
          <SnackbarProvider
          maxSnack={100}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          iconVariant={{
            success: icons.success,
            error: icons.error,
            warning: icons.warning,
            info: icons.attention,
          }}
          className="toasterMsg"
          classes={{
            variantSuccess: "success",
            variantError: "error",
            variantWarning: "warning",
            variantInfo: "info",
          }}
        >
          <div className="language_selector_app">
            <CRXSelectBox
              options={options}
              id="simpleSelectBox"
              onChange={handleChange}
              value={value}
              icon={true}
            />
            <i className="fal fa-globe world_language_icon"></i>
          </div>
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
          >
            {/* <CRXAppBar position="fixed">
            <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
        </CRXAppBar>
        
        <main 
          className={clsx(classes.content, 'crx-main-container', {
            [classes.contentShift]: open,
          })}
          > */}

            <Routes />

            {/* </main>
      
      <footer>
        <Footer />
      </footer> */}
         
          </DragDropContext>
        </SnackbarProvider>
      </div>
    </ApplicationPermissionProvider>
  );
}

export default App;
