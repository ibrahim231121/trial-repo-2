import { CRXButton, CRXTooltip, CRXToaster } from "@cb/shared";
import React from "react";
import { useRef } from "react";
interface Props {
    audioData: any,
    uploadedFileData: (fileUpdatedData: any, audioFlag: boolean)=>void,
    setData: (audioData:any)=>void,
  }
const AudioUpload: React.FC<Props> =(
    {audioData,uploadedFileData,setData})=> {
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const handleFileUpload = () => {
        if (hiddenFileInput?.current)
            hiddenFileInput.current.click();

    }
    const getDuration = (file: any,auidData:any) => {
        const reader = new FileReader();
        // if(props.fileUpdatedData!==undefined && props.fileUpdatedData!==null)
        // {
          let audioDataTemp =audioData;
          reader.readAsArrayBuffer(file);
          reader.onloadend = (e: any) => {
              const ctx = new AudioContext();
              const audioArrayBuffer = e.target.result;
              ctx.decodeAudioData(audioArrayBuffer, data => {
                  // this is the success callback
                  const duration = data.duration;
                  let fileStartDate         = new Date();
                  let fileEndDate           = new Date(fileStartDate);
                  // fileEndDate.setMinutes(fileEndDate.getMinutes() + (fileDurationInMinutes));
                  fileEndDate.setSeconds(fileEndDate.getSeconds() + (duration));
                  let recordingData = {
                      started: new Date(fileStartDate).toISOString(),
                      ended: new Date(fileEndDate).toISOString(),
                      timeOffset: 0,
                  }
                  audioDataTemp[0].recording = recordingData;
                  audioDataTemp[0].assetduration = file.size;
                  let audioPayload: any =[
                  {
                      filename: file.name.split('.').slice(0, -1).join('.'),
                      fileurl: auidData?.toString(),
                      fileduration: file.size,
                      downloadUri: auidData?.toString(),
                      typeOfAsset: 'Audio'
                  }]
                audioDataTemp[0].typeOfAsset = "Audio";
                audioDataTemp[0].assetduration = file.size;
                audioDataTemp[0].name = file.name.split('.').slice(0, -1).join('.');
                audioDataTemp[0].files=audioPayload
                uploadedFileData(audioDataTemp,true)
                setData(audioDataTemp);
              }, error => {
                  // this is the error callback
                  console.error(error);
              });
          };
        // }
    };
    const afterFileUpload = (event: any) => {
        // if(props.fileUploadData!==undefined && props.fileUploadData!==null)
        // {
          let reader = new FileReader();
          reader.readAsDataURL(event[0]);
          
          reader.onloadend = () => {
              getDuration(event[0],reader.result);
          }
      // }
    }
    return (
        <div>
            <CRXButton color="primary"
                onClick={()=>handleFileUpload()}
                variant="contained"
                className={""}
            >
                
                <CRXTooltip
                    // iconName={isPlaying ? "icon icon-pause2 iconPause2" : "icon icon-play4 iconPlay4"}
                    iconName={"fas fa-upload" }
                    placement="top"
                    title={<> <span className="">Upload File</span></>}
                    arrow={false}
                // disablePortal={!ViewScreen ? true : false}
                />
            </CRXButton>
            <input
                type="file"
                accept=".mp3"
                ref={hiddenFileInput}
                style={{ display: 'none' }}
                id="contained"
                name="fileDetails"
                onChange={(event: any) => {
                    afterFileUpload(
                        event.currentTarget.files
                    )
                }}
            />
        </div>
    )

}
export default AudioUpload;