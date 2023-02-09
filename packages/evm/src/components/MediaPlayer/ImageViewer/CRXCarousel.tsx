import Carousel from "react-material-ui-carousel";
import './CRXCarousel.scss'
import { useRef, useState } from "react";

interface CarouselProps {
  mainSliderNodes: any[],
  indicatorSliderNodes: any[]
}

const CRXCarousel = ({ mainSliderNodes, indicatorSliderNodes }: CarouselProps) => {
  const [leftArrowDisable, setLeftArrowDisable] = useState(true);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const elementRef = useRef(null);

  const handleHorizantalScroll = (element: any, speed: any, distance: any, step: any) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
      if (element.scrollLeft === 0) {
        setLeftArrowDisable(true);
      } else {
        setLeftArrowDisable(false);
      }
    }, speed);
  };

  return (
    <div className="banner_corusel">
      <div className="mainImage">
        <Carousel
          swipe={false}
          autoPlay={false}
          animation="slide"
          indicators={false}
          navButtonsAlwaysVisible={true}
          cycleNavigation={false}
          navButtonsProps={{
            style: {
              background: "rgba(48, 48, 48, 0.4)",
              color: "rgb(70, 67, 67)",
              borderRadius: 50,
              marginLeft: 0
            }
          }}
          className="carousel"
          index={activeSlide}
          onChange={(now?: number, previous?: number) => {
            setActiveSlide(now ?? 0);
          }}>
          {mainSliderNodes.map((item: any) => (
            <>{item}</>
          ))}
        </Carousel>
      </div>
      <button
        className="leftSliderBtn"
        onClick={() => {
          handleHorizantalScroll(elementRef.current, 10, 100, -10);
        }}
        disabled={leftArrowDisable}
      >
        Left
      </button>
      <button
        className="rightSliderBtn"
        onClick={() => {
          handleHorizantalScroll(elementRef.current, 10, 100, 10);
        }}
      >
        Right
      </button>
      <div id="slide" ref={elementRef}>
        {
          indicatorSliderNodes.map((item: any, index: number) => {
            return <div onClick={() => { setActiveSlide(index) }} className={index == activeSlide ? "activeSlider slider" : "slider"} >{item}</div>;
          })
        }
      </div>

    </div>
  );
}


export default CRXCarousel;
