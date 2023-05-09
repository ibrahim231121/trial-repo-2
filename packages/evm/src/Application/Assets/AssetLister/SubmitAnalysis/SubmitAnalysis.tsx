import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import { CRXCheckBox, CRXSelectBox, CRXButton } from '@cb/shared';
import IconButton from '@material-ui/core/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { AICoordinatorAgent, EvidenceAgent, FileAgent } from '../../../../utils/Api/ApiAgent';
import { Asset, File } from '../../../../utils/Api/models/EvidenceModels';
import { useTranslation } from 'react-i18next';
import { CRXTooltip } from '@cb/shared';
import { Project } from '../../../../utils/Api/models/AICoordinatorModels';

import './SubmitAnalysis.scss'
import moment from 'moment';
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
import { ProjectStateEnum, ProjectStatusEnum, ProjectTypeEnum, RedactionStatus } from '../../utils/RedactionEnum';
import { MultiSelectBoxCategory } from '@cb/shared';
import { SelectedCategoryModel } from '../Category/Model/FormContainerModel';
import { filterCategory } from '../Category/Utility/UtilityFunctions';
import { RootState } from '../../../../Redux/rootReducer';
import { getUsersIdsAsync, getUsersInfoAsync } from '../../../../Redux/UserReducer';
import { UserNameAndValue } from '../../../Header/AssetsBucket/SubComponents/types';
import { CRXMultiSelectBoxLight } from '@cb/shared';
import { AutoCompleteOptionType } from '../../../Cases/CaseTypes';

type SubmitAnalysisProps = {
  items: any[];
  filterValue: any[];
  //setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
  showToastMsg: (obj: any) => any;
  isSubmittedForRedaction: boolean
};

const SubmitAnalysis: React.FC<SubmitAnalysisProps> = (props) => {

  type AudioSourceOptionModel = {
    value: number;
    displayText: string;
  };
  const cookies = new Cookies();
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState<boolean>(true);

  const [audioSourceCheck, setAudioSourceCheck] = React.useState<boolean>(false);
  const [evidenceGroupCheck, setEvidenceGroupCheck] = React.useState<boolean>(false);
  const [videoAnalysisCheck, setVideoAnalysisCheck] = React.useState<boolean>(false);
  const [audioAnalysisCheck, setAudioAnalysisCheck] = React.useState<boolean>(false);
  const [audioSource, setAudioSource] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>('');
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [asset, setAsset] = React.useState<Asset>()
  const [audioSourceOptions, setAudioSourceOptions] = React.useState<AudioSourceOptionModel[]>([{ value: 0, displayText: "Select" }]);
  const [selectedCategoryValues, setSelectedCategoryValues] = React.useState<Array<SelectedCategoryModel>>([]);
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const [owner, setOwner] = React.useState<AutoCompleteOptionType[]>([])
  const [userOption, setUserOption] = React.useState<string[]>([])
  const users: any = useSelector((state: RootState) => state.userReducer.userIds);

  React.useEffect(() => {
    var masterAudioDevice = props.rowData.evidence.masterAsset.audioDevice;
    var TempAudioSources = [
      { value: 1, displayText: masterAudioDevice }
    ];

    var audioDevices = props.rowData.evidence.asset.map((x: any) => x.audioDevice);
    for (var i = 0; i < audioDevices.length - 1; i++) {
      if (audioDevices[i] != null) {
        const temp = {
          value: i + 2, displayText: audioDevices[i]
        }

        TempAudioSources.push(temp);
      }
    }
    setAudioSourceOptions(TempAudioSources);
    setAudioSource(TempAudioSources[0].displayText);
    dispatch(getUsersIdsAsync())
    EvidenceAgent.getEvidence(props.rowData.id).then((response: any) => {
      setAsset(response.assets.master)
      setButtonState(false)
    })
  }, []);

  useEffect(() => {
    if (users.data && users.data.length > 0) {
      const userNames = users.data.map((user: any) => {
        return {
          userid: user.recId,
          loginId: user.loginId,
        } as UserNameAndValue;
      });
      sendOptionList(userNames);
    }
  }, [users])

  const sendOptionList = (data: any[]): void => {
    const dateOfArry: any = [];
    data?.forEach((item, index) => {
      dateOfArry.push({
        id: item.userid,
        label: item.loginId,
      });
    });
    setUserOption(dateOfArry);
  };

  const onSubmitForm = async () => {
    if(asset){

      const AssetBody : any = {
        id: asset.id,
        name: asset.name,
        typeOfAsset: asset.typeOfAsset,
        state: asset.state,
        status: asset.status,
        unitId: asset.unitId,
        duration: asset.duration,
        bookMarks: [],
        files: [],
        owners: asset.owners,
        lock: asset.lock,
        recording: asset.recording,
        isRestrictedView: asset.isRestrictedView,
        buffering: asset.buffering,
        isOverlaid: asset.isOverlaid,
        notes: [],
        redactionStatus: RedactionStatus.SubmitForAnalysis
      };

      EvidenceAgent.getAssetFile("/Evidences/" + `${props.rowData.id}` + "/assets/" + `${asset.id}` + "/Files").then((response: File[]) => {
        FileAgent.getDownloadUrl("/download/" + `${response[0].url}`).then((responseURL: string) => {
          if (responseURL != null) {
            let accessToken = cookies.get('access_token');
            let tenantId
            if (accessToken) {
                let decodedAccessToken: any = jwt_decode(accessToken);
                tenantId = decodedAccessToken.TenantId;
            }
            let url = new URL(responseURL)
            let project: Project = {
              id: 0,
              projectName: "Project_"+moment(new Date()).local().format("YYYYMMDDHHmmss"),
              type: ProjectTypeEnum['Video Analyzing'],
              state: ProjectStateEnum.Submit,
              status: ProjectStatusEnum.Active,
              notes: notes,
              assetId: props.rowData.assetId,
              assetName: props.rowData.assetName,
              assetUrl: responseURL,
              assetFileSize: props.rowData.size,
              assetDuration: props.rowData.duration,
              recordedBy: props.rowData.recordedBy[0],
              fileType: url.pathname.split('.')[1],
              submitBy: parseInt(localStorage.getItem('User Id') ?? "0"),
              evidenceId: props.rowData.evidence.id,
              tenantId: tenantId,
              modifiedOn: new Date(),
              job: undefined,
              jobs: []
            }
            AICoordinatorAgent.addProject(project)
            .then(() => {
              EvidenceAgent.updateAsset(`/Evidences/${props.rowData.id}/assets/${asset.id}`, AssetBody)
              .then(() =>{ 
                props.setOnClose();
                props.showToastMsg({
                  message: "Asset submitted to Getac AI",
                  variant: "success",
                  duration: 7000,
                })
              })
              .catch((ex) => {
                console.error(ex)
                props.showToastMsg({
                  message: ex.message,
                  variant: "error",
                  duration: 7000,
                })
              })
            })
            .catch((error) => {
              props.showToastMsg({
                message: error.message,
                variant: "error",
                duration: 7000,
              })
            })
          }
        })
      })
    }
    else
      console.error("Asset not found")
  }

  const handleChange = (e: any, colIdx: number, v: any, reason: any, detail: any) => {
    setSelectedCategoryValues(() => [...v]);
    // if (reason === 'remove-option') {
    //   // Show "Remove Category Reason" Modal Here.
    //   // Set value of removed option in to parent state.
    //   if (isNewlyAddedCategory(detail.option.label)) {
    //     props.setRemovedOption(detail.option);
    //     props.setActiveForm((prev) => prev + 3);
    //   } else {
    //     props.setIsformUpdated(false);
    //   }
    // }
  };

  return (
    <>
      <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
        {() => (
          <>
            <Form style={{marginTop:45, marginBottom:45}}>
              <i>* indicates required field</i>
              <div style={{marginTop:30}}>&lt;Please make your preferred selections for your submission&gt;</div>
              <div style={{display:'flex', marginTop:45, marginBottom:60, alignItems:'baseline'}}>
                {t("Audio_Source")}
                <div style={{display:'flex', flexDirection:'column'}}>
                  <div style={{marginLeft:40}}>
                    <CRXCheckBox
                      inputProps={"audioSourceCheck"}
                      className="relatedAssetsCheckbox"
                      lightMode={true}
                      checked={audioSourceCheck}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAudioSourceCheck(e.target.checked)}
                    />
                    <span>{t("Select_Audio_Source")}</span>
                    <IconButton
                      ref={anchorRef}
                      aria-haspopup="true"
                      className="dataIconButton"
                      disableRipple={true}
                      style={{ fontSize: "14px" }}
                    >
                      <CRXTooltip iconName='fas fa-info-circle' title="Choose from list of audio sources" arrow={true} placement="right"></CRXTooltip>
                    </IconButton>
                  </div>
                  <CRXSelectBox
                    disabled={!audioSourceCheck}
                    className={`adVSelectBox createUserSelectBox`}
                    id="selectBoxAudioSource"
                    value={audioSource}
                    onChange={(e: any) => setAudioSource(e.target.value)}
                    options={audioSourceOptions}
                    icon={true}
                    popover={"crxSelectPermissionGroup"}
                  />
                </div>
              </div>
              <p>Please select which type(s) you want to submit for redaction analysis:</p>
              <div style={{display:'flex',marginTop: 45, marginBottom: 45}}>
                <div style={{display:'flex',alignSelf: 'baseline', marginTop:10}}>
                  {t("Analysis Type")}*
                </div>
                <div style={{display:'flex', flexDirection:'column', marginLeft:30}}>
                  <div>
                    <CRXCheckBox
                      inputProps={"videoAnalysisCheck"}
                      className="relatedAssetsCheckbox"
                      lightMode={true}
                      checked={videoAnalysisCheck}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideoAnalysisCheck(e.target.checked)}
                    />
                    {t("Video_Analysis")}
                    <IconButton
                      ref={anchorRef}
                      aria-haspopup="true"
                      className="dataIconButton"
                      disableRipple={true}
                      style={{ fontSize: "14px" }}
                    >
                      <CRXTooltip iconName='fas fa-info-circle' title="Video analysis includes both face and license plate" arrow={true} placement="right"></CRXTooltip>
                    </IconButton>
                  </div>
                  <div>
                    <CRXCheckBox
                      inputProps={"audioAnalysisCheck"}
                      className="relatedAssetsCheckbox"
                      lightMode={true}
                      checked={audioAnalysisCheck}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>) => setAudioAnalysisCheck(e.target.checked)}
                    />
                    {t("Audio_Analysis")}
                    <IconButton
                      ref={anchorRef}
                      aria-haspopup="true"
                      className="dataIconButton"
                      disableRipple={true}
                      style={{ fontSize: "14px" }}
                    >
                      <CRXTooltip iconName='fas fa-info-circle' title="Audio analysis includes transcription" arrow={true} placement="right"></CRXTooltip>
                    </IconButton>
                  </div>
                </div>
              </div>
              <div style={{display:'flex'}}>
                {t("Notes")}
                <textarea placeholder='Example: Redacting the persons face' value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} cols={52} style={{marginLeft:90}}></textarea>
              </div>
              <div style={{display:'flex', marginTop:45, marginBottom:45}}>
                <div style={{display:'flex',alignSelf: 'baseline', marginTop:10}}>
                  {t("Evidence Group")}
                </div>
                <div style={{display:'flex', flexDirection:'column', marginLeft:30}}>
                  <div>
                    <CRXCheckBox
                      inputProps={"audioSourceCheck"}
                      className="relatedAssetsCheckbox"
                      lightMode={true}
                      checked={evidenceGroupCheck}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEvidenceGroupCheck(e.target.checked)}
                    />
                    <span>{t("Create New Evidence Group")}</span>
                    <IconButton
                      ref={anchorRef}
                      aria-haspopup="true"
                      className="dataIconButton"
                      disableRipple={true}
                      style={{ fontSize: "14px" }}
                    >
                      <CRXTooltip iconName='fas fa-info-circle' title="Makes a physical copy of all evidence of original group, and with redacted video of, but with a new owner" arrow={true} placement="right"></CRXTooltip>
                    </IconButton>
                  </div>
                  {evidenceGroupCheck && 
                    <>
                      <div style={{display:'flex', alignItems:'center', marginTop:20}}>
                      <div>
                          {t('Owner(s)')}
                        </div>
                        <div >
                        <CRXMultiSelectBoxLight
                          className="categoryBox"
                          placeHolder=""
                          multiple={true}
                          CheckBox={true}
                          required={false}
                          options={userOption}
                          value={owner}
                          autoComplete={false}
                          isSearchable={true}
                          onChange={(e: React.SyntheticEvent, value: AutoCompleteOptionType[]) => {
                            setOwner(value)
                          }}
                        />
                        </div>
                      </div>
                      <div style={{display:'flex', alignItems:'center', marginTop:20}}>
                        <div>
                          {t('Category')}
                        </div>
                        <div >
                          <MultiSelectBoxCategory
                            className='categoryBox'
                            multiple={true}
                            CheckBox={true}
                            visibility={true}
                            options={filterCategory(categoryOptions)}
                            value={selectedCategoryValues}
                            autoComplete={false}
                            isSearchable={true}
                            onChange={(event: any, newValue: any, reason: any, detail: any) => {
                              return handleChange(event, 1, newValue, reason, detail);
                            }}
                          />
                        </div>
                      </div>
                    </>
                  }
                </div>
              </div>
              <div className='modalFooter CRXFooter'>
                <div className='nextBtn'>
                  <CRXButton disabled={buttonState} type='submit' className='primary'>
                    {props.isSubmittedForRedaction ? t("Submit_again_to_Getac_AI") : t("Submit_to_Getac_AI")}
                  </CRXButton>
                </div>
                <div className='cancelBtn'>
                  <CRXButton onClick={() => props.setOnClose()} className='cancelButton secondary'>
                    {t("Cancel")}
                  </CRXButton>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default SubmitAnalysis;
