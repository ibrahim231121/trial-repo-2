import React from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory,CRXCheckBox, CRXSelectBox,CRXButton } from '@cb/shared';
import IconButton from '@material-ui/core/IconButton';
// import CRXTooltip  from "../../controls/CRXTooltip/CRXTooltip";


import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { EvidenceAgent, FileAgent } from '../../../../utils/Api/ApiAgent';
import { SubmitAnalysisModel,Project,Job,File } from '../../../../utils/Api/models/EvidenceModels';
import { useTranslation } from 'react-i18next';
import { CRXTooltip } from '@cb/shared';
import { number } from 'yup/lib/locale';
import { CRXMultiSelectBoxLight } from '@cb/shared';
import { JOBCOORDINATOR_SERVICE_URL } from '../../../../utils/Api/url';
import moment from 'moment';

type SubmitAnalysisProps = {
    items: any[];
    filterValue: any[];
    //setFilterValue: (param: any) => void;
    rowData: any;
    setOnClose: () => void;
    setRemovedOption: (param: any) => void;
    showToastMsg: (obj: any) => any;
  };
const SubmitAnalysis: React.FC<SubmitAnalysisProps> = (props) => {

    type AudioSourceOptionModel =  {
      value: number;
      displayText: string;
    };
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const [buttonState, setButtonState] = React.useState<boolean>(false);

    const [audioSourceCheck, setAudioSourceCheck] = React.useState<boolean>(false);
    const [videoAnalysisCheck, setVideoAnalysisCheck] = React.useState<boolean>(false);
    const [audioAnalysisCheck, setAudioAnalysisCheck] = React.useState<boolean>(false);
    const [audioSource,setAudioSource] = React.useState<string>("");
    const [notes,setNotes] = React.useState<string>('');
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [res, setRes] = React.useState<File>();
    const [downloadUrl, setDownloadUrl] = React.useState<string>();

    const [responseError, setResponseError] = React.useState<string>('');
    const [alert, setAlert] = React.useState<boolean>(false);
    const [emailError, setEmailError] = React.useState<string>('');
    const [showEmailError, setShowEmailError] = React.useState<boolean>(false);
    const [audioSourceOptions, setAudioSourceOptions] = React.useState<AudioSourceOptionModel[]>([{ value: 0, displayText: "Select" }]);

   
  //   const AudioSourceOptions = [
  //     { value: 1, displayText: t("Audio_Source_1") },
  //     { value: 2, displayText: t("Audio_Source_2") },
  //     { value: 3, displayText: t("Audio_Source_3") }
  //  ];
  //setAudioSourceOptions([{ value: 0, displayText: "Select" }])
  
    const [submitAnalysis, setSubmitAnalysis] = React.useState<SubmitAnalysisModel>()
  
    React.useEffect(() => {
      var masterAudioDevice = props.rowData.evidence.masterAsset.audioDevice;
     var TempAudioSources = [
        { value: 1, displayText: masterAudioDevice }
     ];
      
      var audioDevices = props.rowData.evidence.asset.map((x:any) => x.audioDevice  );
      console.log('audio Devices: ' + audioDevices);
      for(var i = 0;i < audioDevices.length-1; i++)
      {
        if(audioDevices[i] != null)
        {
        const temp = {
          value: i+2, displayText: audioDevices[i]
        }
      
        TempAudioSources.push(temp);
        }
      }
      setAudioSourceOptions(TempAudioSources);
      setAudioSource("1");
     
    }, []);
    React.useEffect(() => {
      if(submitAnalysis != null)
      {
        sendData();
      }
    },[submitAnalysis])
    React.useEffect(() => {
      if(res != null)
        {
          DownloadUrl();
        //   let tempProject: Project = {
        //     projectName:"Project_202208100648",
        //     type:0,
        //     notes:notes,
        //     assetId:props.rowData.evidence.masterAsset.assetId,
        //     assetName:props.rowData.assetName,
        //     assetUrl: res ? res.url : "",
        //     assetFileSize:res ? res.size : 0,
        //     assetDuration: res ? res.duration : 0,
        //     recordedBy:props.rowData.evidence.masterAsset.recordedBy[0],
        //     fileType:res ? res.extension : "",
        //     submitBy: parseInt(localStorage.getItem('User Id') ?? "0")
        // };
        // let tempJob: Job = {
        //   type:0,
        //   priority:0,
        //   progress:0
        // };
        // let temp: SubmitAnalysisModel = {
        //   project:tempProject,
        //   job:tempJob
        // };
        //setSubmitAnalysis(temp);
      }
    },[res])

    React.useEffect(() => {
      if(res != null)
      {
        let tempProject: Project = {
          projectName:"Project_202208100648",
          type:0,
          notes:notes,
          assetId:props.rowData.evidence.masterAsset.assetId,
          assetName:props.rowData.assetName,
          assetUrl: downloadUrl ? downloadUrl : "",
          assetFileSize:res ? res.size : 0,
          assetDuration: res ? res.duration : 0,
          recordedBy:props.rowData.evidence.masterAsset.recordedBy[0],
          fileType:res ? res.extension : "",
          submitBy: parseInt(localStorage.getItem('User Id') ?? "0")
      };
      let tempJob: Job = {
        type:0,
        priority:0,
        progress:0
      };
      let temp: SubmitAnalysisModel = {
        project:tempProject,
        job:tempJob
      };
      setSubmitAnalysis(temp);
    }
    },[downloadUrl])

  
    const handleAudioSourceCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
      
      setAudioSourceCheck(e.target.checked)
    }
    const handleAudioAnalysisCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAudioAnalysisCheck(e.target.checked)
    }
    const handleVideoAnalysisCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVideoAnalysisCheck(e.target.checked)
    }
    
    const onAudioSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAudioSource(e.target.value);
  }
    const onSubmitForm = async () => {
      
      const url =
      "/Evidences/" +
      `${props.rowData.id}` +
      "/assets/" +
      `${props.rowData.assetId}` +
      "/Files";

      
      EvidenceAgent.getAssetFile(url).then((response: File[]) =>  {
        const temp = response;
        
        setRes(temp[0]);
        
      });
     
  
    };
    const DownloadUrl = async () => {
      const url =
      "/Files/download/" +
      `${res?.url}`;
      FileAgent.getDownloadUrl(url).then((response: string) =>  {
        setDownloadUrl(response);
      });
      
    }
    const sendData = async () => {
      const url = JOBCOORDINATOR_SERVICE_URL;
      EvidenceAgent.submitAnalysis(url, submitAnalysis).then(() => {
        props.setOnClose();
        props.showToastMsg({
          message: "Analysis submitted for redaction",
          variant: "success",
          duration: 7000,
          clearButtton: true,
        });
      })
      .catch(function (error) {
        setAlert(true);
        setResponseError(
          "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
        );
        return error;
      });
    }
    
  
    const cancelBtn = () => {
      props.setOnClose();
    };
    const validateMultipleEmails = () => {
    }
    return (
      <>
        <div style={{ height: "380px" }}>
          <Formik 
          initialValues={{}} 
          onSubmit={() => onSubmitForm()}
          >
            {() => (
              <>
              <Form>
                <br></br>
                <div>* indicates required field</div>
                <br></br>
                <div>&lt; Please make your preferred selections for your submission &gt;</div>

                <div style={{
                  height: "0px", paddingTop: "5px",
                  display: `${props.rowData.evidence.asset.length > 0
                    ? ""
                    : "none"
                    }`
                }}>
                  {t("Audio_Source")}
                  <CRXCheckBox
                    inputProps={"audioSourceCheck"}
                    className="relatedAssetsCheckbox"
                    lightMode={true}
                    checked={audioSourceCheck}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => handleAudioSourceCheck(e)}
                  />
                  
                  <IconButton
                  ref={anchorRef}
                  aria-haspopup="true"
                  className="dataIconButton"
                  disableRipple={true}
                  style={{fontSize:"14px"}}
                  >
                  <CRXTooltip iconName='fas fa-info-circle' title="Audio Source" arrow={false} placement="top-start"></CRXTooltip>
        </IconButton>
                </div>
                
                <div style={{
                  height: "0px", paddingTop: "35px", paddingBottom: "30px",
                  display: `${audioSourceCheck == true
                    ? ""
                    : "none"
                    }`
                }}>
                 <span >{t("Select_Audio_Source")}</span>
                <CRXSelectBox
                      className={`adVSelectBox createUserSelectBox`}
                      id="selectBoxAudioSource"
                      value={audioSource}
                      onChange={(e: any) => onAudioSourceChange(e)}
                      options={audioSourceOptions}
                      icon={true}
                      popover={"crxSelectPermissionGroup"}
                       />
                 
                   </div>
                   <div style={{
                  height: "0px", paddingTop: "40px", paddingBottom: "0px"
                  
                }}>
                  {t("Analysis Option")}*
                </div>
                   <div style={{
                  height: "0px",marginLeft:"120px", paddingTop: "35px", paddingBottom: "30px", display:"inline"
                  
                }}>
                   {t("Video_Analysis")}
                   <CRXCheckBox
                    inputProps={"videoAnalysisCheck"}
                    className="relatedAssetsCheckbox"
                    lightMode={true}
                    checked={videoAnalysisCheck}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => handleVideoAnalysisCheck(e)}
                  />
                  
                  <IconButton
                  ref={anchorRef}
                  aria-haspopup="true"
                  className="dataIconButton"
                  disableRipple={true}
                  style={{fontSize:"14px"}}
                  >
                  <CRXTooltip iconName='fas fa-info-circle' title="Video Analysis" arrow={false} placement="top-start"></CRXTooltip>
        </IconButton>
        </div>
                <div style={{
                  height: "0px",marginLeft:"120px", paddingTop: "5px", paddingBottom:"10px",
                  
                }}>
                  {t("Audio_Analysis")}
                  <CRXCheckBox
                    inputProps={"audioAnalysisCheck"}
                    className="relatedAssetsCheckbox"
                    lightMode={true}
                    checked={audioAnalysisCheck}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => handleAudioAnalysisCheck(e)}
                  />
                  
                  <IconButton
                  ref={anchorRef}
                  aria-haspopup="true"
                  className="dataIconButton"
                  disableRipple={true}
                  style={{fontSize:"14px"}}
                  >
                  <CRXTooltip iconName='fas fa-info-circle' title="Audio Analysis" arrow={false} placement="top-start"></CRXTooltip>
          {/* <i className="fas fa-columns"></i> */}
        </IconButton>
                </div>
                <div className='categoryTitle'>
                {t("Notes")}
                </div>
                <div >
                  <textarea placeholder='Example: Redacting the person&#8218;s face' value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} cols={36} ></textarea>
                </div>
                <br />
                <br /><br />
                <br />
  
                <div className='modalFooter CRXFooter'>
                  <div className='nextBtn'>
                    <CRXButton type='submit' className={'nextButton ' + buttonState && 'primeryBtn'} disabled={buttonState}>
                      {t("Save")}
                    </CRXButton>
                  </div>
                  <div className='cancelBtn'>
                    <CRXButton onClick={cancelBtn} className='cancelButton secondary'>
                    {t("Cancel")}
                    </CRXButton>
                  </div>
                </div>
              </Form>
              </>
            )}
          </Formik>
        </div>
      </>
    );
  };
  
  export default SubmitAnalysis;
  