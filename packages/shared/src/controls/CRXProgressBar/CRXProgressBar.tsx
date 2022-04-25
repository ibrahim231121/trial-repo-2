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
};
const CRXProgressBar = (props: LinearProgressProps & ProgressTypes) => {
  const { value, loadingText, loadingCompleted, error, maxDataSize, id } =
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
  //const [progress, setProgress] = useState<number>(0);
  const [rotate, setRotate] = useState<string>("");
  const [propgresicon, setProgressIcon] = useState<string>("fas fa-sync-alt");
  //const [errState, setError] = useState<boolean>();
  //const [limit, setLimit] = useState<number>(100)
  const [errorClx, setErorrClx] = useState<string>("");
  const [progressBar, setProgressBar] = useState<any>(0);
  //const errConditionValue: any = errState && errState ? limit : progress

  useEffect(() => {
    //setError(error);
    if (error == true) {
      // setLimit(40);
      // setProgress(40)
      setErorrClx("progressErorr");
      setProgressBar("Error");
      setRotate("");
      setProgressIcon("far fa-exclamation-circle");
    } else {
      //let progressValue = Math.round(progress) + "%";
      //setPercentageText(progress)
    }
  }, [error]);

  //This block use for initial bind the component or error case hanldler
  useEffect(() => {
    setRotate("rotate");

    // if (errState == true) {

    //     setProgress(40)
    //     setLimit(40)
    //     clearInterval(animate)

    // } else {

    //     animate == setInterval(() => {
    //         setProgress((prevState: any) => prevState < limit && !errState ? prevState + value : limit,)
    //     }, 800)
    // }

    // return () => {
    //     clearInterval(animate)
    // }
  }, []);

  //update the value of progrees and control icon and and class from this block
  useEffect(() => {
    // if (progress == 40) {
    //     setError(false);
    // }

    if (value == 100) {
      setRotate("");
      setProgressIcon("far fa-check-circle");
    }

    // if (errState == true) {

    //     // setLimit(40);
    //     // setProgress(40)
    //     setErorrClx("progressErorr")
    //     setPercentageText("Error")
    //     setRotate("");
    //     setProgressIcon("far fa-exclamation-circle")
    // } else {
    //     let progressValue = Math.round(progress) + "%";
    //     //setPercentageText(progress)
    // }

    setProgressBar(value);
    return () => { };
  }, [value]);

  const clx = maxDataSize == true ? "loadingAssets" : "loadingText ";

  const percentageText = errorClx == "progressErorr" ? "" : "%";

  return (
    <div className="crx-progress-br">
      <div className={clx}>{loadingText}</div>
      <div className="loader">
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
        <div className="fileUploadStatus">
          {maxDataSize && loadingCompleted}
        </div>
        <div
          className="progressPercentage"
          style={{ left: progressBar / 2 + percentageText }}
        >
          {progressBar + percentageText}
        </div>
        <div className={"loadingIcon " + assetsLoadingBarIcon}>
          <i className={propgresicon + " " + rotate}></i>
        </div>
      </div>
    </div>
  );
};

export default CRXProgressBar;
