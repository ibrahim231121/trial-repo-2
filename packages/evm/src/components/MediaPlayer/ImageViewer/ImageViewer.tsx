import './ImageViewer.scss'
import CRXCarousel from "./CRXCarousel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";



export default function ImageViewer(props: any) {

  const Transform = ({ children }: any) => (
    <TransformWrapper>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <TransformComponent>
          {children}
        </TransformComponent>
      )}
    </TransformWrapper>
  )


  let images = [
    <Transform><img src={"https://thumbs.dreamstime.com/b/setting-sun-over-ocean-australia-11835577.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/seagul-fishing-boat-far-away-sea-sunrise-greece-31280927.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/bright-big-sun-sky-yellow-orange-red-gradation-colors-mm-%EF%BC%8B-teleconverter%EF%BC%88%C3%97-%EF%BC%89-33955585.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/setting-sun-over-ocean-australia-11835577.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/seagul-fishing-boat-far-away-sea-sunrise-greece-31280927.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/bright-big-sun-sky-yellow-orange-red-gradation-colors-mm-%EF%BC%8B-teleconverter%EF%BC%88%C3%97-%EF%BC%89-33955585.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/setting-sun-over-ocean-australia-11835577.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/seagul-fishing-boat-far-away-sea-sunrise-greece-31280927.jpg"} alt="" className="image" /></Transform>,
    <Transform><img src={"https://thumbs.dreamstime.com/b/bright-big-sun-sky-yellow-orange-red-gradation-colors-mm-%EF%BC%8B-teleconverter%EF%BC%88%C3%97-%EF%BC%89-33955585.jpg"} alt="" className="image" /></Transform>,
  ]
  let images1 = [
    <img src={"https://thumbs.dreamstime.com/b/setting-sun-over-ocean-australia-11835577.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/seagul-fishing-boat-far-away-sea-sunrise-greece-31280927.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/bright-big-sun-sky-yellow-orange-red-gradation-colors-mm-%EF%BC%8B-teleconverter%EF%BC%88%C3%97-%EF%BC%89-33955585.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/setting-sun-over-ocean-australia-11835577.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/seagul-fishing-boat-far-away-sea-sunrise-greece-31280927.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/bright-big-sun-sky-yellow-orange-red-gradation-colors-mm-%EF%BC%8B-teleconverter%EF%BC%88%C3%97-%EF%BC%89-33955585.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/setting-sun-over-ocean-australia-11835577.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/seagul-fishing-boat-far-away-sea-sunrise-greece-31280927.jpg"} alt="" className="image" />,
    <img src={"https://thumbs.dreamstime.com/b/bright-big-sun-sky-yellow-orange-red-gradation-colors-mm-%EF%BC%8B-teleconverter%EF%BC%88%C3%97-%EF%BC%89-33955585.jpg"} alt="" className="image" />,
  ]


  return (
    <>
      <CRXCarousel
        mainSliderNodes={images}
        indicatorSliderNodes={images1} />
    </>
  );
}
