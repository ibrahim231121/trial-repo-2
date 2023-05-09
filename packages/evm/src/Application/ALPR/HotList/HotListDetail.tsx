import { Field, Form, Formik } from "formik";
import React, { FC, useContext, useEffect, useRef } from "react";
import { HotListdataTemplateAudio, HotListFileData, HotListTemplate } from "../../../utils/Api/models/HotListModels";
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
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
import { Recording } from "../../../utils/Api/models/EvidenceModels";

type HotListDetailProps = {
  id: number,
  row: any[]
}


const HotListDetail: FC<HotListDetailProps> = (props: HotListDetailProps) => {


  //audio work
  const [audioPaylod, setAudioPaylod] = React.useState<any>([{}])
  const [timeDuration, setTimeDuration] = React.useState<any>(
    {
      started: '2023-05-09T07:52:27.000Z',
      ended: '2023-05-09T07:55:29.507Z',
      // ended: '2023-05-09T07:55:29.487Z',
      timeOffset: 0,
    })
  let [audioData, setAudioData] = React.useState<assetdata[]>([{
    name: '',
    files: [
      //   {
      //   filename: 'testing_123',
      //   fileurl: 'https://g204redactiontest.blob.core.usgovcloudapi.net/tn-1/st-70/us-1/Evidence/town-10169_202305090751483760_202305091111024700.mp3',
      //   fileduration: 5838889,
      //   downloadUri: 'https://g204redactiontest.blob.core.usgovcloudapi.net/evm4/tn-1/st-70/us-1/Evidence/town-10169_202305090751483760_202305091111024700.mp3?sv=2020-04-08&se=2023-05-12T22%3A31%3A15Z&sr=b&sp=rcw&sig=G4z5dOrvXDveuEEIUSqfamyjm%2BSy0YjC/tgN/426UPI%3D',
      //   typeOfAsset: 'Audio'
      // }
    ],
    assetduration: 0,
    assetbuffering: { pre: 0, post: 0 },
    recording: timeDuration,
    bookmarks: [],
    id: 0,
    unitId: 0,
    typeOfAsset: 'Audio',
    notes: '',
    camera: '',
    status: 'Available',

  }])
  // const [dummyData2, setdummyData2] = React.useState<HotListFileData[]>([{
  //   filename: '',
  //   fileurl: '',
  //   fileduration: 0,
  //   downloadUri: '',
  //   typeOfAsset: ''
  // }]);
  // const [audioData, setdummyData] = React.useState<HotListdataTemplateAudio[]>([
  //   {
  //     name: '',
  //     files: [{
  //           filename: '',
  //           fileurl: '',
  //           fileduration: 0,
  //           downloadUri: '',
  //           typeOfAsset: ''
  //         }],
  //     assetduration: 0,
  //     assetbuffering: '',
  //     recording: '',
  //     bookmarks: [],
  //     id: 0,
  //     unitId: 0,
  //     typeOfAsset: '',
  //     notes: '',
  //     camera: '',
  //     status: ''
  //   }
  // ]);
  const inputRef = useRef()
  //audio work end

  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation<string>();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [responseError, setResponseError] = React.useState<string>('');
  const [alert, setAlert] = React.useState<boolean>(false);
  const alertRef = useRef(null);
  const userMsgFormRef = useRef<typeof CRXToaster>(null);
  const [alertType, setAlertType] = React.useState<string>('inline');
  const [errorType, setErrorType] = React.useState<string>('error');
  const [ErrorCheck, setErrorCheck] = React.useState<boolean>(false);
  const hotListData: any = useSelector((state: RootState) => state.hotListReducer.HotList);
  const [GridData, setGridData]: any = React.useState<HotListTemplate[]>([]);
  const [HotListPaylod, setHotListPaylod] = React.useState<HotListTemplate>({
    id: 0,
    Name: "",
    description: "",
    sourceName: 0,
    ruleExpressions: "",
    alertPriority: 0,
    Tenant: 0,
    color: "",
    audio: "",
  });
  const [SourceOptions, setSourceOptions] = React.useState<any>(
    [{
      id: 1,
      label: "Source 1"
    },
    {
      id: 2,
      label: "Source 2"
    }]);
  const [TenantOptions, setTenantOptions] = React.useState<any>(
    [{
      id: 1,
      label: "Tenant 1"
    },
    {
      id: 2,
      label: "Tenant 2"
    }]);

  const [openAudioPlayer, setOpenAudioPlayer] = React.useState<boolean>(false);
  const [audioFlag, setAudioFlag] = React.useState<number>(0);
  const [audioFlag2, setAudioFlag2] = React.useState<boolean>(false);

  useEffect(() => {
    dispatch(GetHotListData())
    let reader = new FileReader();

    // reader.readAsDataURL(event[0]);

    // reader.onloadend = () => {
    //   let srcData = reader.result;
    //   console.log('base64:', srcData)
    //   // if (srcData !== undefined) 
    //   // {
    //   setHotListPaylod({ ...HotListPaylod, audio: srcData !== undefined && srcData !== null ? srcData.toString() : '' })
    //   // }
    // };
  }, [])

  useEffect(() => {
    if (hotListData.length > 0) {
      setGridData(hotListData);
      const selectedData = hotListData?.filter((item: any) => { return (item.id == id) })
      if (selectedData !== undefined && selectedData !== null && selectedData.length > 0)
        setHotListPaylod(selectedData[0])
    }
  }, [hotListData])

  const fileUpload = () => {
    if (hiddenFileInput?.current)
      hiddenFileInput.current.click();
  };
  let evidenceId: any = {};

  const handleClose = () => {
    history.push(
      urlList.filter((item: any) => item.name === urlNames.HotList)[0].url
    );
    setIsOpen(false)
  };
  const closeDialog = () => {
    setIsOpen(true);
  };

  const HotListValidationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required"),
  });

  const onSubmit = (values: any) => {
    if (parseInt(id) > 0) {//updation
      let selectedData = GridData?.filter((item: any) => { return (item.id == id) });
      let indexNew = GridData.indexOf(selectedData[0])
      let keys = Object.keys(selectedData[0])

      let newDataObject = selectedData[0]

      keys.map((item: any) => {
        newDataObject = { ...newDataObject, [item]: values[item] }
      })
      let newGridData = [...GridData]

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
  // function getDuration() {

  //  var audio = document.getElementById("audio");
  //   audio?.addEventListener("loadedmetadata", function(_event) {
  //     var duration = audio?.duration;
  //     document.getElementsByTagName("body")[0].removeChild(audio?);
  //   });
  // }
  const afterFileUpload = (event: any) => {
    let reader = new FileReader();
    let audioDataTemp=audioData
    reader.readAsDataURL(event[0]);
    reader.onloadend = () => {
      let srcData = reader.result;
      let audioPayload: any =
      {
        filename: event[0].name,
        fileurl: srcData?.toString(),
        fileduration: event[0].size,
        downloadUri: srcData?.toString(),
        typeOfAsset: 'Audio'
      }
      audioDataTemp[0].files.push(audioPayload)
      setOpenAudioPlayer(true)
      // setHotListPaylod({ ...HotListPaylod, audio: srcData !== undefined && srcData !== null ? srcData.toString() : '' })
      // setAudioPaylod(audioPayload);

      // let filedate = new Date();
      // filedate.setMinutes(filedate.getMinutes() + 3);
      // let recordingData = {
      //   started: new Date().toISOString(),
      //   ended: new Date(filedate).toISOString(),
      //   // ended: '2023-05-09T07:55:29.487Z',
      //   timeOffset: 0,
      // }
      // audioData[0].recording.push(recordingData);
      // audioData[0].assetduration = event[0].size;
      setAudioFlag(1)
      setAudioData(audioDataTemp);

    };
  }

  return (
    <div>
      <div className="MainTabsPanel">
        <div className="tabsBodyControl">
          <label>Audio: </label>
          <audio controls={true} src={HotListPaylod.audio}>
          </audio>
          <div className={classes.uploadButton} >
            <CRXButton
              onClick={fileUpload}
              variant="contained"
            >
              Audio Upload
            </CRXButton>
            <input
              type="file"
              accept=".mp3"
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              id="contained"
              name="fileDetails"
              onChange={(event) => {
                afterFileUpload(
                  event.currentTarget.files
                )
              }}
            />
          </div>
          <div style={{ display: audioFlag === 1 ? "block" : "none" }}>
            {openAudioPlayer && <AudioPlayerBase data={audioData} evidenceId={evidenceId} />}
          </div>
        </div>
      </div>
      <div className="createHotList CrxCreateUser CreatHotListUi hotListSearchComponents">
        <div >

        </div>
        <CRXToaster ref={userMsgFormRef} />
        <CRXAlert
          ref={alertRef}
          message={responseError}
          className='crxAlertHotListEditForm'
          alertType={alertType}
          type={errorType}
          open={alert}
          setShowSucess={() => null}
        />
        <div >
          <div className='CrxIndicates'>
            <sup>*</sup> {("Indicates required field")}
          </div>
          <div className="modalEditCrx">
            <Formik
              enableReinitialize={true}
              initialValues={HotListPaylod}
              validationSchema={HotListValidationSchema}
              onSubmit={(values) => {
                console.log("SUBMIT : " + values);
              }}
            >
              {({ setFieldValue, values, errors, isValid, dirty }) => (
                <Form>
                  <div className="CrxEditForm">

                    <Grid container>
                      <Grid item xs={11} sm={12} md={12} lg={5} >

                        <div >
                          <TextField
                            id="sourceName"
                            required={true}
                            label="Name:"
                            value={values.Name}
                            onChange={(e: any) => setFieldValue("Name", e.target.value)}
                            error={values.Name === ''}
                            errorMsg={"Name field required"}
                          />
                        </div>
                        <div className='crxEditFilter editFilterUi'>
                          <CRXMultiSelectBoxLight

                            className="categortAutocomplete CrxUserEditForm"
                            label="Source Id:"
                            // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
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
                          // disableClearable
                          // onOpen={(e: any) => {
                          //   handleBlur(e);
                          //   setTouched({
                          //     ...touched,
                          //     ["sourceName"]: true,
                          //   });
                          // }}
                          // err
                          />
                        </div>
                        <div className={classes.HotlistAutoComplete}></div>
                        <div className="crxEditFilter editFilterUi " >
                          {/* <TextField
                          required={false}
                          label="Tenant:"
                          onChange={(e: any) => setFieldValue("", e.target.value)}

                        /> */}
                          <CRXMultiSelectBoxLight

                            className="categortAutocomplete CrxUserEditForm"
                            label="Tenant:"
                            // onChange={(e: any) => setFieldValue("sourceName", e.target.value)}
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
                              // setFieldValue("sourceName", value === null ? -1 : Number.parseInt(value?.id))
                            }
                            }
                            onOpen={(e: any) => {

                            }} />
                        </div>
                        <div className={classes.HotlistAutoComplete}>
                          <TextField
                            required={false}
                            label="Alert Priority:"
                            value={values.alertPriority === 0 ? "" : values.alertPriority}
                            onChange={(e: any) => setFieldValue("alertPriority", e.target.value)}

                          />
                        </div>
                        <div><label>Audio: </label>
                          <audio controls={true} src={HotListPaylod.audio}>
                          </audio>
                          <div className={classes.uploadButton} >
                            <CRXButton
                              onClick={fileUpload}
                              variant="contained"
                            >
                              Audio Upload
                            </CRXButton>
                            <input
                              type="file"
                              accept=".mp3"
                              ref={hiddenFileInput}
                              style={{ display: 'none' }}
                              id="contained"
                              name="fileDetails"
                              onChange={(event) => {
                                afterFileUpload(
                                  event.currentTarget.files
                                )
                              }}
                            />
                          </div></div>
                      </Grid>
                      <div className='grid_spacer'>
                      </div>
                      <Grid item xs={12} sm={12} md={12} lg={5} >

                        <div >
                          <TextField
                            required={false}
                            label="Color:"
                            value={values.color}
                            onChange={(e: any) => setFieldValue("color", e.target.value)}

                          />
                        </div>
                        <div >
                          <TextField
                            required={false}
                            label="Rule Expression:"
                            multiline={true}
                            value={values.ruleExpressions}
                            onChange={(e: any) => setFieldValue("ruleExpressions", e.target.value)}

                          />
                        </div>
                        <div >
                          <TextField
                            required={false}
                            label="Description:"
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
                    setIsOpen={() => setIsOpen(false)}
                    onConfirm={handleClose}
                    isOpen={isOpen}
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