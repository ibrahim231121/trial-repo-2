import React, { useEffect, useRef, useState } from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/styles";
import "./progressStyle.scss";
import progressImage from "../CRXProgressBar/ProgressImageLight.png";

type ProgressTypes = {
  value: number;
  loadingText: string;
  loadingCompleted: any;
  error: boolean;
  maxDataSize: boolean;
  id: string;
  removeIcon?: any,
  width?: any,
  widthInPercentage? : boolean,
};
const CRXProgressBar = (props: LinearProgressProps & ProgressTypes) => {
  const { value, loadingText, loadingCompleted, error, maxDataSize, id, removeIcon, width, widthInPercentage } =
    props;
  const progreesRefs = useRef((id: any) => {
    return id;
  });
  const assetsLoadingBarIcon = maxDataSize ? "assetsLoadingBarIcon" : "";
  //Design block
  const progressStyle = makeStyles({
    root: {
      height: "14px",
    },
    colorPrimary: {
      background: "#f5f5f5",
      boxShadow: "inset 0px 0px 3px #0000001A",
    },
    barColorPrimary: {
      background: "#003A5D",
      backgroundImage: (_) => maxDataSize ? `url(${progressImage})` : "",
      backgroundRepeatY: "no-repeat",
      backgroundPositionY: "1.1px",
    },

    barColorSecondary: {
      background: "#003A5D",
    },
  });

  const styled = progressStyle();
  const [rotate, setRotate] = useState<string>("");
  const [propgresicon, setProgressIcon] = useState<string>("fas fa-sync-alt");
  const [errorClx, setErorrClx] = useState<string>("");
  const [progressBar, setProgressBar] = useState<any>(0);


  useEffect(() => {

    if (error == true) {

      setErorrClx("progressErorr");
      setProgressBar("Error");
      setRotate("");
      setProgressIcon("far fa-exclamation-circle");
    }
    else {
      setErorrClx("");
      setProgressBar("");
      setRotate("rotate");
      setProgressIcon("fas fa-sync-alt");
    }
  }, [error]);

  //This block use for initial bind the component or error case hanldler
  useEffect(() => {
    setRotate("rotate");
  }, []);

  //update the value of progrees and control icon and and class from this block
  useEffect(() => {

    if (value == 100) {
      setRotate("");
      setProgressIcon("far fa-check-circle");
    }

    setProgressBar(value);
    return () => { };
  }, [value]);

  const clx = maxDataSize == true ? "loadingAssets" : "loadingText ";

  const percentageText = errorClx == "progressErorr" ? "" : "%";

  const textPercentClass = errorClx == "progressErorr" ? "errorProgress_Text" : "Progress_Text";

  const perc = progressBar * width / 100 - 7;

  return (
    <div className="crx-progress-br">
      <div className={clx}>{loadingText}</div>
      <div className="loader">
        <div className="linerLoader" style={{ width: widthInPercentage ? width + "%" : (width + "px") }}>


          <LinearProgress
            id={id}
            ref={progreesRefs}
            variant="determinate"
            className={errorClx}
            value={value}
            classes={{
              root: styled.root,
              colorPrimary: styled.colorPrimary,
              barColorPrimary:
                value && value == 100
                  ? styled.barColorSecondary
                  : styled.barColorPrimary,
            }}
          />
          <div
            className={`progressPercentage ${textPercentClass}`}
            style={{ left: (perc / 2) + (widthInPercentage ? "%" : "px") }}
          >
            {progressBar + percentageText}
          </div>
        </div>
        <div className="fileUploadStatus">
          {maxDataSize && loadingCompleted}
        </div>


        <div className={"loadingIcon " + assetsLoadingBarIcon}>
          {removeIcon}
          <i className={propgresicon + " " + rotate}></i>
        </div>
      </div>
    </div>
  );
};

export default CRXProgressBar;
