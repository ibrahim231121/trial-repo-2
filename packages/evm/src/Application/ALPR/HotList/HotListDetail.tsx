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
import { GetHotListData, UpdateHotListData } from "../../../Redux/AlprHotListReducer";
import './HotListDetail.scss';
import AudioPlayerBase from "../../../components/MediaPlayer/AudioPlayer/AudioPlayerBase";
import { assetdata } from "../../Assets/Detail/AssetDetailsTemplateModel";
import { CRXTooltip } from "@cb/shared";


const HotListPayload:HotListTemplate= {
  id: 0,
  Name: "",
  description: "",
  sourceName: 0,
  ruleExpressions: "",
  alertPriority: 0,
  Tenant: 0,
  color: "",
  audio: "",
}

const HotListDetail = () => {
  let evidenceId: any = {};
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation<string>();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const hotListData: any = useSelector((state: RootState) => state.hotListReducer.HotList);

  const SourceOptions =
    [{
      id: 1,
      label: "Source 1"
    },
    {
      id: 2,
      label: "Source 2"
    }];
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
  //audio work end
  useEffect(() => {
    dispatch(GetHotListData())
  }, [])

  useEffect(() => {
    if (hotListData.length > 0) {
      const selectedData = hotListData?.filter((item: any) => { return (item.id == id) })
      if (HotListInitialState !== undefined && selectedData !== null && selectedData.length > 0)
      setHotListInitialState(selectedData[0])
    }
  }, [hotListData])

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
    Name: Yup.string().required("Name is required"),
  });

  const onSubmit = (values: any) => {
    if (parseInt(id) > 0) {//updation
      let selectedData = hotListData?.filter((item: any) => { return (item.id == id) });
      let indexNew = hotListData.indexOf(selectedData[0])
      let keys = Object.keys(selectedData[0])

      let newDataObject = selectedData[0]

      keys.map((item: any) => {
        newDataObject = { ...newDataObject, [item]: values[item] }
      })
      let newGridData = [...hotListData]

      newGridData.map((item: any, index: any) => {
        if (index == indexNew) {
          newGridData[index] = newDataObject
        }
      })
      dispatch(UpdateHotListData({ newGridData }));
    }
    //else//Insertion
    //{
    //}
    history.push(
      urlList.filter((item: any) => item.name === urlNames.HotList)[0].url
    );
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
                            id="sourceName"
                            required={true}
                            label={t("Name") + ':'}
                            value={values.Name}
                            onChange={(e: any) => setFieldValue("Name", e.target.value)}
                            error={errors.Name != undefined && touched.Name}
                            errorMsg={t("Name_field_required")}
                          />
                        </div>
                        <div className='crxEditFilter editFilterUi'>
                          <CRXMultiSelectBoxLight

                            className="categortAutocomplete CrxUserEditForm"
                            label={t("Source_Id") + ':'}
                            multiple={false}
                            CheckBox={true}
                            options={SourceOptions}
                            required={false}
                            isSearchable={true}
                            value={values.sourceName === 0 ? "" : { id: values.sourceName, label: SourceOptions.find((x: any) => x.id === values.sourceName)?.label }}

                            onChange={(
                              e: React.SyntheticEvent,
                              value: any
                            ) => {
                              setFieldValue("sourceName", value === null ? -1 : Number.parseInt(value?.id))
                            }
                            }
                            onOpen={(e: any) => {

                            }}
                          />
                        </div>
                        <div className={classes.HotlistAutoComplete}></div>
                        <div className="crxEditFilter editFilterUi " >

                          <CRXMultiSelectBoxLight

                            className="categortAutocomplete CrxUserEditForm"
                            label={t("Tenant") + ':'}
                            multiple={false}
                            CheckBox={true}
                            options={TenantOptions}
                            required={false}
                            isSearchable={true}
                            value={values.Tenant === 0 ? "" : { id: values.Tenant, label: TenantOptions.find((x: any) => x.id === values.Tenant)?.label }}

                            onChange={(
                              e: React.SyntheticEvent,
                              value: any
                            ) => {
                              setFieldValue("Tenant", value === null ? -1 : Number.parseInt(value?.id))
                            }
                            }
                            onOpen={(e: any) => {

                            }} />
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

                        <div >
                          <TextField
                            required={false}
                            label={t("Color") + ':'}
                            value={values.color}
                            onChange={(e: any) => setFieldValue("color", e.target.value)}

                          />
                        </div>
                        <div >
                          <TextField
                            required={false}
                            label={t("Rule_Expression") + ':'}
                            multiline={true}
                            value={values.ruleExpressions}
                            onChange={(e: any) => setFieldValue("ruleExpressions", e.target.value)}

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