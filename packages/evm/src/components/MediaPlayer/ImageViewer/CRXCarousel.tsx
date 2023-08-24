import Carousel from "react-material-ui-carousel";
import { carouselStyle, ImageTabsStyled } from "./CRXCarouselStyle";
import './CRXCarousel.scss'
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { assetdata } from "../../../Application/Assets/Detail/AssetDetailsTemplateModel";
import { useTranslation } from "react-i18next";
import Tabs  from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from "@material-ui/core/Button";
import { CRXTooltip } from "@cb/shared";
import { setIsPrimaryAsset } from "../../../Redux/AssetDetailPrimaryBreadcrumbReducer";


interface CarouselProps {
  mainSliderNodes: any[],
  indicatorSliderNodes: any[],
  data: assetdata[],
  detailContentMetadata: boolean,
  fullScreen: boolean,
  masterAssetId: number
  setAssetId: any
}

const CRXCarousel = ({ mainSliderNodes, indicatorSliderNodes, data, detailContentMetadata, fullScreen, masterAssetId, setAssetId }: CarouselProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation<string>();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const elementRef:any = useRef(null);

  const sliderStyle = carouselStyle()
  const imgStyleProps = ImageTabsStyled()
  return (
    <div className={`banner_corusel ${fullScreen == true ? " fullHeight" : " " } ${detailContentMetadata == true ? " whiteBackground" : " " } `}>
      <div className={`crx_image_viewer ${fullScreen == true ? " mainFullView" : " " } `}>
        <div className="carousel_button_container prev-button-tabs">
         
              <CRXTooltip
                // iconName="fa-solid fa-chevron-left"
                content={<>
                   <button className={`carousel_button ${activeSlide > 0 ? "activeBtn" : "disabledBtn"} `}
            onClick={() => {
              if (activeSlide > 0) {
                setActiveSlide(activeSlide - 1)
                setAssetId(data[activeSlide - 1]?.id);
                dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + data[activeSlide - 1]?.name }));
                dispatch(setIsPrimaryAsset({isPrimaryAsset: data[activeSlide - 1]?.id == masterAssetId}));
              }
            }}><i className="fa-solid fa-chevron-left"/></button>
                
               </>}
                arrow={false}
                title="previous"
                placement="bottom-start"
                className="privoius-left CRXImageViewLeft"
                disablePortal={fullScreen ? true : false}
                />
        
        </div>
        <Carousel
          swipe={false}
          autoPlay={false}
          animation="slide"
          indicators={false}
          navButtonsAlwaysVisible={false}
          height="auto"
          cycleNavigation={false}
          NextIcon={<i className="fa-solid fa-chevron-right"></i>}
          PrevIcon={<i className="fa-solid fa-chevron-left"></i>}
          navButtonsProps={{
            style: {
              opacity : 0,
              display : "none"
            }
          }}
          className={"carousel carousel_tabs " + sliderStyle.carousel}
          index={activeSlide}
          onChange={(now?: number, previous?: number) => {
            setAssetId(data[now ?? 0]?.id);
            setActiveSlide(now ?? 0);
            dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + data[now ?? 0]?.name }));
            dispatch(setIsPrimaryAsset({isPrimaryAsset: data[now ?? 0]?.id == masterAssetId}));
          }}>
          {mainSliderNodes.map((item: any) => (
            <div className="img_silder_items_viewer">{item}</div>
          ))}
        </Carousel>
        
        <div className="carousel_button_container next-button-tabs">
              <CRXTooltip
              // iconName="fa-solid fa-chevron-right"
              content={<>  <button className={ `carousel_button ${((indicatorSliderNodes.length - 1) > activeSlide) ? "activeBtn" : "disabledBtn" }`}
              onClick={() => {
                if ((indicatorSliderNodes.length - 1) > activeSlide) {
                  setAssetId(data[activeSlide + 1]?.id);
                  setActiveSlide(activeSlide + 1)
                  dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + data[activeSlide + 1]?.name }));
                  dispatch(setIsPrimaryAsset({isPrimaryAsset: data[activeSlide + 1]?.id == masterAssetId}));
                }
              }}><i className="fa-solid fa-chevron-right"></i></button></>}
              arrow={false}
              title="next"
              placement="bottom-start"
              className="privoius-left CRXImageViewRight"
              disablePortal={fullScreen ? true : false}
            />
         
        </div>
      </div>
      {fullScreen === false && <div className="bottom_image_viewer">
      
      {<div id="image_viewer_slide" ref={elementRef}>
        <Tabs
          value={activeSlide}
          className={ "image_bottom_slider_tabs "}
          onChange={(item: any, index: number) => {
            setAssetId(data[index]?.id);
            setActiveSlide(index)
            dispatch(enterPathActionCreator({ val: t("Asset_Detail") + ": " + data[index]?.name }));
            dispatch(setIsPrimaryAsset({isPrimaryAsset: data[index]?.id == masterAssetId}));
          }}
          variant="scrollable"
          scrollButtons={true}
          selectionFollowsFocus={true}
          
          visibleScrollbar
          aria-label="ant example"
          classes={{
            ...imgStyleProps
          }}
          allowScrollButtonsMobile
          ScrollButtonComponent = {(props) => {
            
          if (
           
            props.direction === "left" && 
            !props.disabled
              
          ) {
              return (
                  <Button className="image_viewer_bt_btn image_viewer_left_btn"  disableRipple disabled={false} {...props}>
                       <CRXTooltip
                          iconName="fas fa-chevron-left"
                          arrow={false}
                          title="see less"
                          placement="bottom-start"
                          className="tooltipBottomSlider"
                          disablePortal={true}
                        />
                      
                  </Button>
              );
          } else if (
           
              props.direction === "right" && 
              !props.disabled
          ) {
              return (
                  <Button 
                    className="image_viewer_bt_btn image_viewer_right_btn" disableRipple disabled={false} {...props}>
                       
                      <CRXTooltip
                          iconName="fas fa-chevron-right"
                          arrow={false}
                          title="see more"
                          placement="bottom-end"
                          className="tooltipBottomSlider"
                          disablePortal={true}
                        />
                      
                  </Button>
              );
          } else {
              return null;
            }

      }}
      >
         {
          indicatorSliderNodes.map((item: any, index: number) => {
            return <Tab disableRipple disableFocusRipple className="image_bottom_slider_items" icon={item} />
          })
        }
      </Tabs>
      </div>}
      </div>}
    </div>
  );
}


export default CRXCarousel;
