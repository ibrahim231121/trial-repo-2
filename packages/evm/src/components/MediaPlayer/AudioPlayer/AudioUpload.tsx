import { CRXButton, CRXTooltip, CRXToaster } from "@cb/shared";
import { useRef } from "react";

const AudioUpload = (props: any) => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const handleFileUpload = () => {
        if (hiddenFileInput?.current)
            hiddenFileInput.current.click();

    }
    const getDuration = (file: any) => {
        const reader = new FileReader();
        let audioDataTemp = props.audioData;
        reader.readAsArrayBuffer(file);
        reader.onloadend = (e: any) => {
            const ctx = new AudioContext();
            const audioArrayBuffer = e.target.result;
            ctx.decodeAudioData(audioArrayBuffer, data => {
                // this is the success callback
                const duration = data.duration;
                let fileStartDate = new Date();
                let fileEndDate = new Date();
                fileEndDate.setMinutes(fileEndDate.getMinutes() + (duration / 60));
                let recordingData = {
                    started: new Date(fileStartDate).toISOString(),
                    ended: new Date(fileEndDate).toISOString(),
                    // ended: '2023-05-09T07:55:29.487Z',
                    timeOffset: 0,
                }
                audioDataTemp[0].recording = recordingData;
                audioDataTemp[0].assetduration = file.size;
                //from parents
                // setAudioData(audioDataTemp);
                // setOpenAudioPlayer(true)
                // setAudioFlag(1)
            }, error => {
                // this is the error callback
                console.error(error);
            });
        };
    };
    const afterFileUpload = (event: any) => {
        
        let reader = new FileReader();
        let audioDataTemp = props.audioData
        reader.readAsDataURL(event[0]);
        getDuration(event[0])
        reader.onloadend = () => {
            let srcData = reader.result;
            let audioPayload: any =
            {
                filename: event[0].name.split('.').slice(0, -1).join('.'),
                fileurl: srcData?.toString(),
                fileduration: event[0].size,
                downloadUri: srcData?.toString(),
                typeOfAsset: 'Audio'
            }
            audioDataTemp[0].assetduration = event[0].size;
            audioDataTemp[0].name = event[0].name.split('.').slice(0, -1).join('.');
            audioDataTemp[0].files.push(audioPayload)
            // setAudioData(audioDataTemp);
        }
    }
    return (
        <div>
            <CRXButton color="primary"
                onClick={()=>handleFileUpload()}
                variant="contained"
                className={""}
            >
                Upload File
                <CRXTooltip
                    // iconName={isPlaying ? "icon icon-pause2 iconPause2" : "icon icon-play4 iconPlay4"}
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