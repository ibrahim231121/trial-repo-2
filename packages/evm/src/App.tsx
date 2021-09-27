import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import clsx from 'clsx';
import { CRXAppBar, CRXContainer, CRXPanelStyle, } from "@cb/shared";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import AppHeader from './Application/Headeer/Header'
import { AssetThumbnailIcon } from "../src/Application/Assets/components/DataGrid/AssetThumbnail"
import Footer from './Application/Headeer/Footer'
import {useTranslation} from 'react-i18next'; 

import "../../evm/src/utils/Localizer/i18n"
import Img from "./Assets/Images/thumb.png";

function App() {
  let culture: string = "en";
  const [resources, setResources] = useState<any>("");
  const { i18n } = useTranslation<string>();
  const [rtl, setRTL] = useState<string>();

  const [open, setOpen] = useState(true);
  const classes = CRXPanelStyle();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  let initialContainers: any = {
    dataTable: {
      id: "dataTable",
      rows: null,
    },
    list: {
      id: "list",
      rows: null,
    },
  };
  const [containers, setContainers] = useState(initialContainers);

  useEffect(() => {
    import(`../../evm/src/utils/Localizer/resources/${culture}`).then((res) => {
      setResources(res.resources);
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
    }
  }, [culture, resources]);

  const onDragStart = (e: any) => {
    let assetContainer = localStorage.getItem("AssetContainer");
    var draggableItem = document.getElementById(
      "draggableItem" + e.source.index.toString()
    );
    if (assetContainer !== null && draggableItem !== null) {
      console.log("Drag Start", JSON.parse(assetContainer));

      let divOuter = document.createElement("div");
      divOuter.className = "divOuter";
      divOuter.id = "divOuter";
      divOuter.style.display = "block";

      let left: number = 0;
      let top: number = 0;

      let container = JSON.parse(assetContainer);

      let divCount = document.createElement("div");
      divCount.className = "divCount MuiBadge-badge";
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
        i1.style.position = "relative";
        i1.style.top = "20px";
        i1.style.left = "8px";
        div1.append(i1);
        divInner.appendChild(div1);

        var div2 = document.createElement("div");
        div2.className = "divImg";
        div2.id = "innerImg" + index.toString();

        // var img = document.createElement("img");
        // img.className = "imgdrag";
        // img.src = Img;
        // div2.append(img);

        var i2 = document.createElement("i");
        i2.className = AssetThumbnailIcon(con.assetType)
        i2.style.fontSize = "55pt";
        div2.append(i2);

        divInner.appendChild(div2);

        var div3 = document.createElement("div");
        div3.className = "divAssetId";
        div3.id = "innerAssetId" + index.toString();
        var i3 = document.createElement("i");
        i3.className = "linkColor";
        i3.innerHTML = con.assetName;
        div3.append(i3);
        divInner.appendChild(div3);

        top = top + 5;
        left = left + 5;

        divOuter.appendChild(divInner);
      });
      //draggableItem.appendChild(divCount);
      draggableItem.appendChild(divOuter);
      draggableItem.style.display = "flex";
    }
  };

  const onDragEnd = (e: any) => {
    var divOuter = document.getElementById("divOuter");
    if (divOuter !== null) divOuter.remove();
    // Make sure we have a valid destination
    if (e.destination === undefined || e.destination === null) return null;
    // Make sure we're actually moving the item
    if (
      e.source.droppableId === e.destination.droppableId &&
      e.destination.index === e.source.index
    )
      return null;

    // Set start and end variables
    const start = containers[e.source.droppableId];
    const end = containers[e.destination.droppableId];

    const startIndex = e.source.index; //+ (page*rowsPerPage)
    let destinationIndex = e.destination.index;

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item

      // console.log("If");
      // const newList = start.rows.filter((_: any, idx: any) => idx !== startIndex);
      // destinationIndex = e.destination.index //+ (page*rowsPerPage)
      // // Then insert the item at the right location
      // newList.splice(destinationIndex, 0, start.rows[startIndex]);

      // // Then create a new copy of the column object
      // const newCol = {
      //   id: start.id,
      //   rows: newList
      // };

      // // Update the state
      // setContainers((state: any) => ({ ...state, [newCol.id]: newCol }));
      //}
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      //const newStartList = start.rows.filter((_: any, idx: any) => idx !== source.index);
      console.log("Else");
      // Create a new start column
      const newStartCol = {
        id: start.id,
        //rows: newStartList
        rows: start.rows,
      };

      // Make a new end list array
      const newEndList = end.rows;

      // Insert the item into the end list
      newEndList.splice(destinationIndex, 0, start.rows[startIndex]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        rows: newEndList,
      };

      // Update the state
      setContainers((state: any) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  return (
    <div dir={rtl}>
<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <CRXAppBar position="fixed">
          <AppHeader onClick={handleDrawerToggle} onClose={handleDrawerToggle} open={open} />
      </CRXAppBar>
      
      <main 
      className={clsx(classes.content, 'crx-main-container', {
        [classes.contentShift]: open,
      })}
      >
      <CRXContainer className="mainContainer" maxWidth="xl" disableGutters={true}>
        <Routes />
      </CRXContainer>
      </main>
      
</DragDropContext>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
