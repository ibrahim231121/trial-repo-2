import { CRXTooltip } from "@cb/shared";
import React, { useEffect } from "react";
import VideoPlayerBase from "../../../components/MediaPlayer/VideoPlayerBase";
import PDFViewer from "../../../components/MediaPlayer/PdfViewer/PDFViewer";
import { assetdata } from "./AssetDetailsTemplateModel";
import { CRXTabs } from "@cb/shared";
import { useTranslation } from "react-i18next";
import ImageViewer from "../../../components/MediaPlayer/ImageViewer/ImageViewer";
import { AppBar, Box, Tab, Tabs, Theme, Typography, makeStyles } from "@material-ui/core";
import AssetsDisplayTabsHeaders from "./AssetsDisplayTabsHeaders";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { useDispatch } from "react-redux";
import DocViewer from "../../../components/MediaPlayer/DocsViewer/DocViewer";
import AudioPlayerBase from "../../../components/MediaPlayer/AudioPlayer/AudioPlayerBase";

const AssetsDisplayTabs = (props: any) => {
  const dispatch = useDispatch();
  const { metaData, typeOfVideoAssetToInclude, typeOfAudioAssetToInclude, typeOfImageAssetToInclude, typeOfDocAssetToInclude, typeOfOtherAssetToInclude, detailContent, setDetailContent, formattedData, evidenceId, gpsJson, sensorsDataJson, openMap, updatePrimaryAsset, isPrimaryAsset, assetId } = props;
  
  let defaultTab = 0;
  const [block, setBlock] = React.useState(false);
  useEffect(() => {
    if(formattedData[0].typeOfAsset == "Doc" && formattedData[0].files[0].typeOfAsset == "PDFDoc"){
      defaultTab = typeOfDocAssetToInclude.includes(formattedData[0].files[0].typeOfAsset) ? 3 : defaultTab;
    }
    else if(formattedData[0].typeOfAsset == ("Video" || "Audio" || "AudioOnly" || "Image")){
      defaultTab = typeOfVideoAssetToInclude.includes(formattedData[0].typeOfAsset) ? 1 : defaultTab;
      defaultTab = typeOfAudioAssetToInclude.includes(formattedData[0].typeOfAsset) ? 0 : defaultTab;
      defaultTab = typeOfImageAssetToInclude.includes(formattedData[0].typeOfAsset) ? 2 : defaultTab;
    }
    else{
      defaultTab = typeOfOtherAssetToInclude.includes(formattedData[0].files[0].typeOfAsset) ? 4 : defaultTab;
    }
    setTypeOfAssetCurrentTab(defaultTab);
  }, [formattedData])
  const [typeOfAssetCurrentTab, setTypeOfAssetCurrentTab] = React.useState(defaultTab);

  useEffect(() => {
    let availableAssets = formattedData.filter((x: any) => x.status == "Available");
    let {videos, images, docs, audios, otherdocs} = dataOfCategories(availableAssets);
    if(typeOfAssetCurrentTab == 1){
      dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + videos[0]?.name }));
    }
    else if(typeOfAssetCurrentTab == 0){
      dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + audios[0]?.name }));
    }
    else if(typeOfAssetCurrentTab == 2){
      dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + images[0]?.name }));
    }
    else if(typeOfAssetCurrentTab == 3){
      dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + docs[0]?.name }));
    }
    else if(typeOfAssetCurrentTab == 4){
      dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + otherdocs[0]?.name }));
    }
  }, [typeOfAssetCurrentTab])


  const [apiKey, setApiKey] = React.useState<string>("");
  const { t } = useTranslation<string>();

  const typeOfAssetTabs = [
    { label: t("Audio"), index: 0 },
    { label: t("Videos"), index: 1 },
    { label: t("Images"), index: 2 },
    { label: t("Documents"), index: 3 },
    { label: t("Others"), index: 4 },
  ];

  const dataOfCategories = (availableAssets: assetdata[]) => {
    let videos = availableAssets.filter(x => typeOfVideoAssetToInclude.includes(x.typeOfAsset) || (x.typeOfAsset == "AudioOnly" ? x.files.some(y => typeOfAudioAssetToInclude.includes(y.typeOfAsset)) : false));
    let docs = availableAssets.filter((x: any) => x.typeOfAsset == "Doc" && typeOfDocAssetToInclude.includes(x.files[0].typeOfAsset));
    let images = availableAssets.filter((x: any) => typeOfImageAssetToInclude.includes(x.typeOfAsset));
    let audios = availableAssets.filter((x: any) => typeOfAudioAssetToInclude.includes(x.typeOfAsset));
    let otherdocs = availableAssets.filter((x: any) => typeOfOtherAssetToInclude.includes(x.files[0].typeOfAsset));
    return {videos, docs, images, audios, otherdocs}
  }


  useEffect(() => {
    setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "");  //put this in env.dev REACT_APP_GOOGLE_MAPS_API_KEY = AIzaSyAA1XYqnjsDHcdXGNHPaUgOLn85kFaq6es
  }, [])


  const gotoSeeMoreView = (e: any, targetId: any) => {
    detailContent == false ? setDetailContent(true) : setDetailContent(false);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  useEffect(() => {
    if(block){
      setBlock(false)
    }
  }, [formattedData])




//tab fun end
  const noAvailableAssetFound = () => {
    return <div className="_player_video_uploading">
      <div className="layout_inner_container">
        {metaData.id && <div className="text_container_video">Evidence is not available!</div>}
        <div className="_empty_arrow_seeMore">
          {detailContent == false ?
            <button id="seeMoreButton" className="_empty_content_see_mot_btn seeMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "detail_view")} data-target="#detail_view">
              <CRXTooltip iconName="fas fa-chevron-down" placement="bottom" arrow={false} title="see more" />
            </button>
            :
            <button id="lessMoreButton" data-target="#root" className="_empty_content_see_mot_btn lessMoreButton" onClick={(e: any) => gotoSeeMoreView(e, "root")}>
              <CRXTooltip iconName="fas fa-chevron-up" placement="bottom" arrow={false} title="see less" />
            </button>
          }
        </div>
      </div>
    </div>
  }

  const assetDisplay = (formattedData: assetdata[], evidenceId: any, gpsJson: any, sensorsDataJson: any, openMap: boolean, apiKey: any) => {
    let availableAssets = formattedData.filter((x: any) => x.status == "Available");
    if (availableAssets.length > 0) {
      let {videos, images, docs, audios, otherdocs} = dataOfCategories(availableAssets);
      
      
      
      return <>
        {/* New Tabs start */}
        <div  className="MainTabsPanel">
        <div className="tabsHeaderControl">
        {isPrimaryAsset && <CRXTooltip iconName="fas fa-certificate" arrow={false} title="primary asset" placement="left" className="crxTooltipNotificationIcon" />}
          {typeOfAssetTabs.map(x => 
          
            {
              let categoryAssets: assetdata[] = [];
              if(x.index == 0 && audios.length < 1){ return }
              categoryAssets = x.index == 1 ? videos : categoryAssets;
              categoryAssets = x.index == 2 ? images : categoryAssets;
              categoryAssets = x.index == 3 ? docs : categoryAssets;
              categoryAssets = x.index == 0 ? audios : categoryAssets;
              categoryAssets = x.index == 4 ? otherdocs : categoryAssets;
              
              return <AssetsDisplayTabsHeaders setTypeOfAssetCurrentTab={setTypeOfAssetCurrentTab} typeOfAssetTab={x} updatePrimaryAsset={(id: any) => {setBlock(true); updatePrimaryAsset(id); setTimeout(() => {setBlock(false)}, 3000)}} availableAssets={availableAssets} categoryAssets={categoryAssets} isSelected={typeOfAssetCurrentTab == x.index} assetId={assetId}/> })}
        </div>
        <div className="tabsBodyControl">
        <div style={{display: typeOfAssetCurrentTab == 0 ? "block" : "none"}}>
          {audios.length > 0 && !block && <AudioPlayerBase data={audios} evidenceId={evidenceId} />}
        </div>
        <div style={{display: typeOfAssetCurrentTab == 1 ? "block" : "none"}}>
          {videos.length > 0 && <VideoPlayerBase data={videos} evidenceId={evidenceId} gpsJson={gpsJson} sensorsDataJson={sensorsDataJson} openMap={openMap} apiKey={apiKey} guestView={false} />}
        </div>
        <div style={{display: typeOfAssetCurrentTab == 2 ? "block" : "none"}}>
          {images.length > 0 && <ImageViewer data={images} />}
        </div>
        <div style={{display: typeOfAssetCurrentTab == 3 ? "block" : "none"}}>
          {docs.length > 0 && <PDFViewer data={docs} />}
        </div>
        <div style={{display: typeOfAssetCurrentTab == 4 ? "block" : "none"}}>
          {otherdocs.length > 0 && <DocViewer data={otherdocs[0]} />}
        </div>
      </div>
    </div>
  
        {/* New Tabs end */}

      </>
    }
    else { return <>{noAvailableAssetFound()}</> }
  }

  return <>{assetDisplay(formattedData, evidenceId, gpsJson, sensorsDataJson, openMap, apiKey)}</>
};

export default AssetsDisplayTabs;
