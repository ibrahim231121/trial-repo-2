import React, {useState} from "react";
import Grid from '@material-ui/core/Grid';

interface VideoScreenProp { 
  viewNumber?: number,
  videoData: any[]
}

const VideoScreen = ({ viewNumber, videoData }: VideoScreenProp) => {
  const getVideoTag = (CameraCount: number) => {
    //console.log(viewNumber)
    //poster="https://i.ibb.co/C0PqYN4/Media-Not-Available.png"
    
    let camIndex = CameraCount - 1;
    if (camIndex < videoData.length) {
      return (
        <div className="videoContainer">
          <video id={videoData[camIndex].id} width="100%" height="100%"  preload="auto" crossOrigin="anonymous">
            <source src={videoData[camIndex].src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          
        </div>
      );
    } else {
      return <div />;
    }
  };
  return (
    <div id="video-player-screens">
      <Grid container>
        <Grid item spacing={3}
          xs={viewNumber == 0 ? 12: viewNumber == 1? 6: viewNumber == 2? 8: viewNumber == 3? 3: 1}>
          {getVideoTag(1)}
        </Grid>
        <Grid item spacing={3}
          xs={ viewNumber == 0 ? 1 : viewNumber == 1 ? 6 : viewNumber == 2 ? 4 : viewNumber == 3 ? 3: 1}>
          {getVideoTag(2)}
        </Grid>
        <Grid item
          xs={viewNumber == 2 ? 4 : viewNumber == 3 ? 3 : 1}
          className={`${viewNumber == 2 ? "pictureViewGrid" : ""}`}>
          {getVideoTag(3)}
        </Grid>
        <Grid item xs={viewNumber == 3 ? 3 : 1}>
          {getVideoTag(4)}
        </Grid>
        <Grid item xs={viewNumber == 3 ? 3 : 1}>
          {getVideoTag(5)}
        </Grid>
        <Grid item xs={viewNumber == 3 ? 3 : 1}>
          {getVideoTag(6)}
        </Grid>
        <Grid item xs={viewNumber == 3 ? 3 : 1}>
          {getVideoTag(7)}
        </Grid>
        <Grid item xs={viewNumber == 3 ? 3 : 1}>
          {getVideoTag(8)}
        </Grid>
      </Grid>
    </div>
  );
};

export default VideoScreen;