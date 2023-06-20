import { Field, Form, Formik } from "formik";
import React, { FC, useContext, useEffect, useRef } from "react";
import { HotListdataTemplateAudio, HotListFileData, HotListTemplate } from "../../../utils/Api/models/HotListModels";
import Grid from '@material-ui/core/Grid';
import { Link, Route, Router, Switch } from 'react-router-dom';
import { urlList, urlNames } from "../../../utils/urlList";
import { useTranslation } from "react-i18next";
import { useStyles } from "./HotListCss";
import {
  CRXAlert,
  CRXButton,
  TextField,
  CRXToaster,
  CRXMultiSelectBoxLight,
  CRXConfirmDialog
} from '@cb/shared';
import { useParams, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { GetAllHotListData, GetHotListData } from "../../../Redux/AlprHotListReducer";
import './HotListDetail.scss';
import AudioPlayerBase from "../../../components/MediaPlayer/AudioPlayer/AudioPlayerBase";
import { assetdata } from "../../Assets/Detail/AssetDetailsTemplateModel";
import { CRXTooltip } from "@cb/shared";
import { HotListAgent } from "../../../utils/Api/ApiAgent";
import moment from "moment";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { GetAlprDataSourceList } from "../../../Redux/AlprDataSourceReducer";


const HotListPayload:HotListTemplate= {
  id: 0,
  name: "",
  description: "",
  sourceId: 0,
  sourceName: "",
  rulesExpression: "",
  alertPriority: 0,
  stationId: 0,
  color: "",
  audio: "",
  lastTimeStamp: [],
  createdOn: "",
  lastUpdatedOn: ""
}

const HotListDetail = () => {
  let evidenceId: any = {};
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation<string>();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isFirstTime = React.useRef<boolean>(true);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const hotListDetails: any = useSelector((state: RootState) => state.hotListReducer.hotListDetails);
  const hotListDatasourceData: any = useSelector((state: RootState)=> state.alprDataSourceReducer.DataSource);

  const [sourceOptions, setSourceOptions] = React.useState([]);

  const TenantOptions =
    [{
      id: 1,
      label: "Tenant 1"
    },
    {
      id: 2,
      label: "Tenant 2"
    }];
  const [, setIsStateUpdate] = React.useState<boolean>(false);
  const openAudioPlayer = React.useRef<boolean>(false);
  const isOpen = React.useRef<boolean>(false);

  const [HotListInitialState, setHotListInitialState] = React.useState<HotListTemplate>(HotListPayload);

  //audio work
  let [audioDataState, setAudioDataState] = React.useState<assetdata[]>([{
    name: '',
    files: [
      {
        filename: '',
        fileurl: '',
        fileduration: 0,
        downloadUri: '',
        typeOfAsset: ''
      }
    ],
    assetduration: 0,
    assetbuffering: { pre: 20, post: 20 },
    recording: {ended:'0',started:'',timeOffset:0},
    bookmarks: [],
    id: 0,
    unitId: 0,
    typeOfAsset: '',
    notes: '',
    camera: '',
    status: '',

  }])

  useEffect(() => {
    if(!isFirstTime.current){
      if (hotListDetails && HotListInitialState !== undefined) {
        setHotListInitialState(hotListDetails)
      }
    }
    
  }, [hotListDetails])

  useEffect(()=>{
    if(hotListDatasourceData && hotListDatasourceData.data){
      let sources: any = [];
      hotListDatasourceData.data.map((x: any) => {
        sources.push({ id: x.sysSerial, label: x.sourceName });
        });
      setSourceOptions(sources);
    }
    
  }, [hotListDatasourceData.data])

  //audio work end
  useEffect(() => {
    if(!isNaN(Number(+id))){
      dispatch(GetHotListData(id))
    }
    var sourcesPageiGrid = {
      gridFilter: {
        logic: "and",
        filters: []
      },
      page: 0,
      size: 1000
    }

    dispatch(GetAlprDataSourceList(sourcesPageiGrid))
    
    isFirstTime.current = false;
  }, [])



  const fileUpload = () => {
    if (hiddenFileInput?.current)
      hiddenFileInput.current.click();
  };

  const handleClose = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.HotList)[0].url
    );
    isOpen.current = false;
    setIsStateUpdate(prevState => !prevState)
  };
  const closeDialog = () => {

    isOpen.current = true;
    setIsStateUpdate(prevState => !prevState)
  };
  const closeConfirmDialog = () => {

    isOpen.current = false;
    setIsStateUpdate(prevState => !prevState)
  };

  const HotListValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const onSubmit = (values: any) => {
    if (parseInt(id) > 0) {//updation
      let selectedData = hotListDetails;
      let keys = Object.keys(selectedData)

      let newDataObject = selectedData
      values.lastUpdatedOn = moment(new Date()).toISOString()

      if(!values.audio){
        values.audio = ""
      }

      if(!values.color){
        values.color = ""
      }

      keys.map((item: any) => {
        newDataObject = { ...newDataObject, [item]: values[item] }
      })

      dispatch(setLoaderValue({isLoading: true}));
      HotListAgent.updateHotListItemAsync("/HotList/" + id, newDataObject).then(()=>{
        dispatch(setLoaderValue({isLoading: false}));
        history.push(
          urlList.filter((item: any) => item.name === urlNames.HotList)[0].url
        );
      }).catch((error:any)=>{
        dispatch(setLoaderValue({isLoading: false, message: "", error: true }));
        console.error(error);
      })
    }
    else//Insertion
    {
      let selectedData = HotListInitialState;
      let keys = Object.keys(selectedData)
      let newDataObject = selectedData;

      keys.map((item: any) => {
        newDataObject = { ...newDataObject, [item]: values[item] }
      })

      newDataObject.createdOn = moment(new Date()).toISOString()
      newDataObject.lastUpdatedOn = moment(new Date()).toISOString()
      newDataObject.lastTimeStamp = [];
      
      dispatch(setLoaderValue({isLoading: true}));
      HotListAgent.addHotListItemAsync("/HotList", newDataObject).then((res)=>{
        dispatch(setLoaderValue({isLoading: false}));
        history.push(
          urlList.filter((item: any) => item.name === urlNames.HotList)[0].url
        );
      }).catch((error:any) => {
        dispatch(setLoaderValue({isLoading: false, message: "", error: true }));
        console.error(error);
      })
    }
    
  }
  const getDuration = (file: any) => {
    const reader = new FileReader();
    let audioDataTemp = audioDataState;
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
        audioDataState[0].recording = recordingData;
        audioDataState[0].assetduration = file.size;
        setAudioDataState(audioDataTemp);
        // setOpenAudioPlayer(true)
        openAudioPlayer.current = true;
        setIsStateUpdate(prevState => !prevState)
      }, error => {
        // this is the error callback
        console.error(error);
      });
    };
  };
  const afterFileUpload = (event: any) => {
    let reader = new FileReader();
    let audioDataTemp = audioDataState
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
      setAudioDataState(audioDataTemp);

    };
  }

  const uploadFileData = (fileUpdatedData: any, audioFlag: boolean) => {
    setAudioDataState(fileUpdatedData);
    openAudioPlayer.current = audioFlag;
    setIsStateUpdate(prevState => !prevState)

    setTimeout(() => {
      openAudioPlayer.current = false;
      setIsStateUpdate(prevState => !prevState)
    }, 10);
  }
  return (
    <div>
      <div className="MainTabsPanel">
        <div className="tabsBodyControl">
          {<CRXTooltip iconName="fas fa-certificate" arrow={false} title="primary asset" placement="left" className="crxTooltipNotificationIcon" />}
          <div className="tabsBodyControl">
            <div style={{ display: false ? "block" : "none" }}>
              {!openAudioPlayer.current ? <AudioPlayerBase data={audioDataState} evidenceId={evidenceId} uploadedFileData={uploadFileData} /> : ''}
            </div>
          </div>

        </div>
      </div>
      <div className="createHotList CrxCreateUser CreatHotListUi hotListSearchComponents">
        <div >

        </div>
        <div >
          <div className='CrxIndicates'>
            <sup>*</sup> {t("Indicates_required_field")}
          </div>
          <div className="modalEditCrx">
            <Formik
              enableReinitialize={true}
              initialValues={HotListInitialState}
              validationSchema={HotListValidationSchema}
              onSubmit={(values) => {
                console.log("SUBMIT : " + values);
              }}
            >
              {({ setFieldValue, values, errors, isValid, dirty ,touched}) => (
                <Form>
                  <div className="CrxEditForm">

                    <Grid container>
                      <Grid item xs={11} sm={12} md={12} lg={5} >

                        <div >
                          <TextField
                            id="name"
                            required={true}
                            label={t("Name") + ':'}
                            value={values.name}
                            onChange={(e: any) => {
                              console.log(e);
                              setFieldValue("name", e.target.value)
                            }}
                            error={errors.name != undefined && touched.name}
                            errorMsg={t("Name_field_required")}
                          />
                        </div>
                        <div className='crxEditFilter editFilterUi'>
                          <CRXMultiSelectBoxLight

                            className="categortAutocomplete CrxUserEditForm"
                            label={t("Source_Id") + ':'}
                            multiple={false}
                            CheckBox={true}
                            options={sourceOptions}
                            required={false}
                            isSearchable={true}
                            value={{id: values.sourceId, label:values.sourceName == null ? "":values.sourceName}}
                            
                            onChange={(
                              e: React.SyntheticEvent,
                              value: any
                            ) => {
                              setFieldValue("sourceId", value === null ? -1 : Number.parseInt(value?.id))
                              setFieldValue("sourceName", value === null ? "" : value?.label)
                            }
                            }
                            onOpen={(e: any) => {

                            }}
                          />
                        </div>
                        <div className={classes.HotlistAutoComplete}></div>
                        <div >
                          <TextField
                              required={false}
                              label={t("Tenant") + ':'}
                              value={values.stationId}
                              onChange={(e: any) => setFieldValue("stationId", e.target.value)}

                            />
                          
                        </div>
                        <div className={classes.HotlistAutoComplete}>
                          <TextField
                            required={false}
                            label={t("Alert_Priority") + ':'}
                            value={values.alertPriority === 0 ? "" : values.alertPriority}
                            onChange={(e: any) => setFieldValue("alertPriority", e.target.value)}

                          />
                        </div>

                      </Grid>
                      <div className='grid_spacer'>
                      </div>
                      <Grid item xs={12} sm={12} md={12} lg={5} >

                        <div className="createHotlistColorContainer">
                          <label className="createHotlistColorLabel">Color:</label>
                          <input type="color" id="hotlistcolor" name="color" value={values.color} className="createHotlistColorInput" onChange={(e:any)=>{
                            setFieldValue("color", e.target.value);
                            }}></input>
                          {/* <TextField
                            required={false}
                            label={t("Color") + ':'}
                            value={values.color}
                            onChange={(e: any) => setFieldValue("color", e.target.value)}

                          /> */}
                        </div>
                        <div >
                          <TextField
                            required={false}
                            label={t("Rule_Expression") + ':'}
                            multiline={true}
                            value={values.rulesExpression}
                            onChange={(e: any) => setFieldValue("rulesExpression", e.target.value)}

                          />
                        </div>
                        <div >
                          <TextField
                            required={false}
                            label={t("Description") + ':'}
                            multiline={true}
                            value={values.description}
                            onChange={(e: any) => setFieldValue("description", e.target.value)}

                          />
                        </div>

                      </Grid>
                    </Grid>
                  </div>
                  <div className='crxFooterEditFormBtn'>
                    <div className='__crxFooterBtnUser__'>
                      <CRXButton className='primary'
                        disabled={!isValid}
                        onClick={() => onSubmit(values)}
                      >
                        {t("Save")}
                      </CRXButton>

                      <Link to={urlList.filter((item: any) => item.name === urlNames.HotList)[0].url} className="btnCancelAssign">
                        {t("Cancel")}
                      </Link>
                    </div>
                    <div className='__crxFooterBtnUser__'>
                      <CRXButton
                        onClick={closeDialog}
                        className="groupInfoTabButtons-Close secondary"
                        color="secondary"
                        variant="outlined"
                      >
                        Close
                      </CRXButton>
                    </div>
                  </div>

                  <CRXConfirmDialog
                    setIsOpen={closeConfirmDialog}
                    onConfirm={()=>handleClose()}
                    isOpen={isOpen.current}
                    className="Categories_Confirm"
                    primary={t("Yes_close")}  
                    secondary={t("No,_do_not_close")}
                    text="retention policy form"
                  >
                    <div className="confirmMessage">
                      {t("You_are_attempting_to")} <strong> {t("close")}</strong> {t("the")}{" "}
                      <strong>{ }</strong>. {t("If_you_close_the_form")},
                      {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}
                      <div className="confirmMessageBottom">
                        {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("the_form?")}
                      </div>
                    </div>
                  </CRXConfirmDialog>


                </Form>
              )}
            </Formik>
          </div>



        </div>
      </div>
    </div>
  );
}


export default HotListDetail;