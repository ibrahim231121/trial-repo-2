import './PDFCarousel.scss'
import { assetdata } from '../../../Application/Assets/Detail/AssetDetailsTemplateModel';
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from "@material-ui/core/Button";
import { CRXTooltip } from '@cb/shared';
import { PDFItemStyled, ImageTabsStyled } from './CRXPDFCarouselStyle';
import Box from '@mui/material/Box';
import { enterPathActionCreator } from '../../../Redux/breadCrumbReducer';
import { useDispatch, useSelector } from 'react-redux';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useInterval } from 'usehooks-ts';
import { setLoaderValue } from '../../../Redux/loaderSlice';
import { urlList, urlNames } from '../../../utils/urlList';

interface PDFViewerProps {
  data: assetdata[];
  // updatePrimaryAsset: any;
  setAssetId: any;
}

const PDFViewers: React.FC<PDFViewerProps> = ({ data, setAssetId }) => {
  const loadingValue = useSelector((state: any) => state.loaderSlice.loadingValue);
  const dispatch = useDispatch();

  const handleScreenView = useFullScreenHandle();
  const [fullScreen, setFullScreen] = useState(false);
  const [sortedData, setSortedData] = useState<assetdata[]>(data);
  const viewScreenEnter = () => {
    handleScreenView.enter();
    setFullScreen(true);
  }

  const viewScreenExit = () => {
    handleScreenView.exit();
    setFullScreen(false);
  }

  const screenViewChange = (e: any, h: any) => {
    if (h.active == true) {
    } else {
      setFullScreen(false);
    }
  }

  const [docs, setDocs] = useState<any[]>();
  const [ids, setIds] = useState<string>("")
  const { t } = useTranslation<string>();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [detailContentMetadata, setDetailContentMetadata] = useState<boolean>(false)
  const elementRef = useRef(null);
  const TabStyle = ImageTabsStyled()
  const TabLabelStyle = PDFItemStyled()

  let docViewerFileType = [
    {
      fileType: "Text",
      docViewerFileType: "txt",
      icon: <i className="fas fa-file-lines"></i>
    },
    {
      fileType: "ExcelDoc",
      docViewerFileType: "xlsx",
      icon: <i className="fas fa-file-excel"></i>
    },
    {
      fileType: "WordDoc",
      docViewerFileType: "docx",
      icon: <i className="fas fa-file-word"></i>
    },
    {
      fileType: "PDFDoc",
      docViewerFileType: "pdf",
      icon: <i className="fa-solid fa-file-pdf"></i>
    },
    {
      fileType: "PowerPointDoc",
      docViewerFileType: "pptx",
      icon: <i className="fa-solid fa-file-powerpoint"></i>
    },
    {
      fileType: "CSVDoc",
      docViewerFileType: "txt",
      icon: <i className="fa-solid fa-file-excel"></i>
    }
  ];

  const setDocsForViewer = () => {
    let dataFormatted: any[] = data.map(x => {
      let thisDocViewerFileType = docViewerFileType.find(y => y.fileType == x.files[0]?.typeOfAsset);
      if (thisDocViewerFileType) {
        return { uri: x.files[0]?.downloadUri, fileType: thisDocViewerFileType.docViewerFileType }
      }
    })
    setDocs(dataFormatted);
  }
  useEffect(() => {
    if (ids != data.map(x => x.id).join(',')) {
      let sorted = [...data].sort((a, b) => a.id - b.id);
      setSortedData(sorted);
      let index = sorted.findIndex(x => x.id == data[0]?.id);
      setActiveSlide(index)
      setIds(data.map(x => x.id).join(','));
      setDocsForViewer();
    }
  }, [ids, data])

  useEffect(() => {
    dispatch(setLoaderValue({ isLoading: true, message: "" }));
    let htmlElement: any = document.querySelector("html");
    htmlElement.style.overflow = "hidden";
  }, [])

  useInterval(() => {
    let htmlElement: any = document.querySelector("#loading-renderer");
    if((!htmlElement) && (loadingValue > 0))
    {
      dispatch(setLoaderValue({ isLoading: false, message: "", error: true }));
    }
  }, 999)

  const keydownListener = (event: any) => {
    const { code, shiftKey, altKey } = event;
    if (code == "KeyF" && shiftKey && altKey && (fullScreen == false)) {
      event.preventDefault(); viewScreenEnter()
    }
    else if (code == "KeyF" && shiftKey && altKey && (fullScreen)) {
      event.preventDefault(); viewScreenExit()
    }
  }

  useEffect(() => {
    
    let path = window.location.pathname;
    let htmlElement: any = document.querySelector("html");
    let pathBody = document.querySelector("body");
    if (path == urlList.filter((item: any) => item.name === urlNames.testVideoPlayer)[0].url) {
      pathBody?.classList.add("pathVideoPlayer");
      htmlElement.style.overflow = "hidden";
    } else if (path == urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url) {
      pathBody?.classList.add("pathAssetDetail");
      htmlElement.style.overflow = "hidden";
    } else {
      pathBody?.classList.remove("pathVideoPlayer");
      pathBody?.classList.remove("pathAssetDetail");
      htmlElement.style.overflow = "auto";

    }
   
  },[])
  return (
    <>
      <FullScreen onChange={screenViewChange} handle={handleScreenView} className={fullScreen === true ? 'mainFullView' : ''}>
        <div onKeyDown={keydownListener} tabIndex={-1} className={`banner_corusel_Document ${fullScreen == true ? " fullHeight" : " "} ${detailContentMetadata == true ? " whiteBackground" : " "} `}>
          <div className={"carousel_button_container prev-button-tabs" + (fullScreen ? " displayOnFullScreen" : " hideOnFullScreen")}>
           
              <CRXTooltip
                arrow={false}
                content={<> <button className={`carousel_button ${activeSlide > 0 ? "activeBtn" : "disabledBtn"} `}
                onClick={() => {
                  if (activeSlide > 0) {
                    // updatePrimaryAsset(sortedData[activeSlide - 1]?.id);
                    setAssetId(sortedData[activeSlide - 1]?.id);
                    setActiveSlide(activeSlide - 1)
                    dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + sortedData[activeSlide - 1]?.name }));
                  }
                }}><i className="fa-solid fa-chevron-left"/></button></>}
                title="previous"
                placement="bottom-start"
                className="privoius-left CRXImageViewLeft"
                disablePortal={fullScreen ? true : false}
              />
           
          </div>
          <div className={"carousel_button_container next-button-tabs" + (fullScreen ? " displayOnFullScreen" : " hideOnFullScreen")}>
            
              <CRXTooltip
                arrow={false}
                content={<><button className={`carousel_button ${((sortedData.length - 1) > activeSlide) ? "activeBtn" : "disabledBtn"}`}
                onClick={() => {
                  if ((sortedData.length - 1) > activeSlide) {
                    // updatePrimaryAsset(sortedData[activeSlide - 1]?.id);
                    setAssetId(sortedData[activeSlide + 1]?.id);
                    setActiveSlide(activeSlide + 1)
                    dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + sortedData[activeSlide + 1]?.name }));
                  }
                }}><i className="fa-solid fa-chevron-right"></i></button></>}
                title="next"
                placement="bottom-start"
                className="privoius-left CRXImageViewRight"
                disablePortal={fullScreen ? true : false}
              />
          </div>

         {fullScreen == false && <div className="pdf_item_image_viewer crx-col-4">
            <div id="pdf_viewer_slide" ref={elementRef}>
              <Box
                sx={{ flexGrow: 1, position: "relative", bgcolor: '#000', display: 'flex', height: `${detailContentMetadata == true ? 'calc(100vh - 333px)' : 'calc(100vh - 250px)'}` }}
              >

                <Tabs
                  value={activeSlide}
                  className={"pdf_bottom_slider_tabs "}
                  onChange={(item: any, index: number) => {
                    let x = sortedData[index];
                    setActiveSlide(index)
                    // if (data[0]?.id != x.id) {
                    // updatePrimaryAsset(sortedData[activeSlide - 1]?.id);
                    setAssetId(x.id);
                    setActiveSlide(x.id)
                    dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + sortedData[index]?.name }));
                    // }
                  }}
                  orientation="vertical"
                  variant="scrollable"
                  scrollButtons
                  selectionFollowsFocus={true}
                  visibleScrollbar={true}
                  aria-label="ant example"
                  classes={{
                    ...TabStyle
                  }}
                  ScrollButtonComponent={(props) => {
                    if (
                      props.direction === "left" &&
                      !props.disabled && props.orientation == "vertical"
                    ) {
                      return (
                        <CRXTooltip
                          iconName="fas fa-chevron-up"
                          arrow={false}
                          title="see less"
                          placement="bottom-start"
                          className="tooltipBottomSlider"
                          disablePortal={true}
                          content={<Button className="image_viewer_bt_btn image_viewer_left_btn" disableRipple disabled={!props.disabled} {...props}><i className='fas fa-chevron-up'></i></Button>}
                        />
                      );
                    } else if (
                      props.direction === "right" &&
                      !props.disabled && props.orientation == "vertical"
                    ) {
                      return (
                        <CRXTooltip
                          iconName="fas fa-chevron-down"
                          arrow={false}
                          title="see more"
                          placement="bottom-end"
                          className="tooltipBottomSlider"
                          disablePortal={true}
                          content={<Button
                            className="image_viewer_bt_btn image_viewer_right_btn" disableRipple disabled={!props.disabled}  {...props}><i className='fas fa-chevron-down'></i></Button>}
                        />
                      );
                    } else {
                      return null
                    }

                  }}
                >
                  {
                    sortedData.map((item: assetdata, index: number) => {
                      let itemIcon = docViewerFileType.find(x => x.fileType == item.files[0]?.typeOfAsset);
                      return <Tab className=" pdf_bottom_slider_items" disableRipple disableFocusRipple label={<div className={TabLabelStyle.labelIcon}>{item.name}</div>} icon={itemIcon?.icon} />
                    })
                  }
                </Tabs>
              </Box>
            </div>
          </div>
        }
          <div className="mainImage crx-col-8">
            {docs && <DocViewer
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: true
                },
              }}
              // theme={{
              //   primary: "#d1d2d4",
              //   secondary: "#ffffff",
              //   tertiary: "#000",
              //   text_primary: "#ffffff",
              //   text_secondary: "#d1d2d4",
              //   text_tertiary: "#d1d2d4",
              //   disableThemeScrollbar: false,
              // }}
              documents={docs} style={{ width: "100%", height: "calc(100vh - 250px)" }} />}

            <div className={"playerViewRight docPage_fullscreen"}>
              <div className="playerView">
                {fullScreen == false ?
                  <div onClick={viewScreenEnter} >
                    <CRXTooltip
                      iconName={"fas fa-expand-wide"}
                      placement="top"
                      title={<>Full screen <span className="FullScreenTooltip">Shift + Alt + F</span></>}
                      arrow={false}
                      disablePortal={fullScreen ? true : false}
                    />
                  </div> :
                  <div onClick={viewScreenExit}>
                    <CRXTooltip
                      iconName={"fas fa-compress-wide"}
                      placement="left"
                      title={<>Exit full screen <span className="FullScreenTooltip">Shift + Alt + F</span></>}
                      arrow={false}
                      disablePortal={fullScreen ? true : false}
                    />
                  </div>}
              </div>

            </div>
          </div>

        </div>
        {detailContentMetadata == false ? <div className='full-screen-button'></div> : ""}

      </FullScreen>
    </>
  );
}
export default PDFViewers
