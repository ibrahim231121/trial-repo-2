import './ImageViewer.scss'
import CRXCarousel from "./CRXCarousel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { assetdata } from '../../../Application/Assets/Detail/AssetDetailsTemplateModel';
import { useState } from 'react';
import { CRXTooltip } from '@cb/shared';
import { FullScreen, useFullScreenHandle } from "react-full-screen";


interface ImageViewerProps {
  data: assetdata[];
  masterAssetId: number;
  setAssetId: any
}
const ImageViewer: React.FC<ImageViewerProps> = ({ data, masterAssetId, setAssetId }) => {
  const handleScreenView = useFullScreenHandle();
  const [fullScreen, setFullScreen] = useState(false);
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

  const [detailContentMetadata, setDetailContentMetadata] = useState<boolean>(false)
  const Transform = ({ children }: any) => (
    <TransformWrapper>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <TransformComponent>
          {children}
        </TransformComponent>
      )}
    </TransformWrapper>
  )

  let mainSliderNodes = data.map(x => {
    return <Transform><img src={x.files[0]?.downloadUri} alt="" className="image" /></Transform>
  })

  let indicatorSliderNodes = data.map(x => {
    return <img src={x.files[0]?.downloadUri} alt="" className="image" />
  })

  const gotoSeeMoreView = (e: any, targetId: any) => {
    let detailContentTemp = detailContentMetadata == false ? true : false;
    setDetailContentMetadata(detailContentTemp);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const keydownListener = (event: any) => {
    const { code, shiftKey, altKey } = event;
    if (code == "KeyF" && shiftKey && altKey && (fullScreen == false)) {
      event.preventDefault(); viewScreenEnter()
    }
    else if (code == "KeyF" && shiftKey && altKey && (fullScreen)) {
      event.preventDefault(); viewScreenExit()
    }
  }

  return (
    <>
      <FullScreen onChange={screenViewChange} handle={handleScreenView} className={fullScreen === true ? 'mainFullView' : ''}>
        <div onKeyDown={keydownListener} tabIndex={-1}>
        <CRXCarousel
          mainSliderNodes={mainSliderNodes}
          indicatorSliderNodes={indicatorSliderNodes}
          data={data}
          detailContentMetadata={detailContentMetadata}
          fullScreen={fullScreen}
          masterAssetId={masterAssetId}
          setAssetId={setAssetId}
        />
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
        <div className="go_to_top_asset_detail">
          {/* {fullScreen == false && <button onClick={() => {viewScreenEnter();}}>Enter Full Screen</button>}
        {fullScreen == true && <button onClick={() => {viewScreenExit();}}>Exit Full Screen</button>} */}

        </div>
        </div>
      </FullScreen>
    </>
  );
}


export default ImageViewer;
