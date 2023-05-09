import './ImageViewer.scss'
import CRXCarousel from "./CRXCarousel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { assetdata } from '../../../Application/Assets/Detail/AssetDetailsTemplateModel';


interface ImageViewerProps {
  data: assetdata[];
}
const ImageViewer: React.FC<ImageViewerProps> = ({data}) => {

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


  return (
    <>
      <CRXCarousel
        mainSliderNodes={mainSliderNodes}
        indicatorSliderNodes={indicatorSliderNodes}
        data={data}
         />
    </>
  );
}


export default ImageViewer;
