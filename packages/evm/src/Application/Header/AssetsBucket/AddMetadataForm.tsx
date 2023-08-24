import React, { useState } from "react";
import { EVIDENCE_ASSET_DATA_URL } from "../../../utils/Api/url";
import { useDispatch, useSelector } from "react-redux";
import { CRXSelectBox, CRXMultiSelectBoxLight } from "@cb/shared";
import { RootState } from "../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import { CRXButton } from "@cb/shared";
import NoFormAttachedOfAssetBucket from "./SubComponents/NoFormAttachedOfAssetBucket";
import Cookies from "universal-cookie";
import { CRXAlert } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { EvidenceAgent, FileAgent } from "../../../utils/Api/ApiAgent";
import { PageiGrid } from "../../../GlobalFunctions/globalDataTableFunctions";
import { addMetadata, AddMetadataFormProps, masterAsset, MasterAssetBucket, masterAssetFile, masterAssetStation, MasterNameAndValue, StationIdandLabel, UserNameAndValue } from "./SubComponents/types";
import { SubmitType } from "../../Assets/AssetLister/Category/Model/CategoryFormModel";
import DisplayCategoryForm from "../../Assets/AssetLister/Category/SubComponents/DisplayCategoryForm";
import { applyValidation, CategoryScenarioCallingFrom, CreateCategoryFormObjectCollection, filterCategory, RemapFormFieldKeyName } from "../../Assets/AssetLister/Category/Utility/UtilityFunctions";
import { addAssetToBucketActionCreator } from "../../../Redux/AssetActionReducer";
import { FieldsFunctionType } from "../../Assets/AssetLister/Category/Model/DisplayCategoryForm";
import { AddMetaDataUtility } from './Utility';
import { checkAssetType, checkFileStatus, checkFileType, currentStartDate, getDecimalPart } from "./AssetBucketMetaDataUtil";
import { getStationsInfoAllAsync } from "../../../Redux/StationReducer";
import { getAllCategoriesFilter } from "../../../Redux/Categories";
import { findMaximumDescriptorId } from "../../../GlobalFunctions/SecurityDescriptor";

const AddMetadataForm: React.FC<AddMetadataFormProps> = ({
  onClose,
  setAddEvidence,
  setEvidenceId,
  uploadFile,
  uploadAssetBucket,
  activeScreen,
  uploadInfo,
  setActiveScreen,
  setIsformUpdated
}) => {
  let displayText = "";
  if (uploadFile.length != 0) {
    displayText = uploadFile[0].uploadedFileName
  }
  
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [formpayload, setFormPayload] = useState<addMetadata>({
    station: {},
    masterAsset: "",
    owner: [],
    category: []
  });
  const [formpayloadErr, setformpayloadErr] = useState({
    masterAssetErr: "",
    stationErr: "",
    ownerErr: "",
  });
  const [userOption, setUserOption] = useState<any>([]);
  const [masterAssetOption, setMasterAssetOption] = useState<any>([]);
  const [isNext, setIsNext] = useState<boolean>(true);
  const [isEditCase, setIsEditCase] = useState<boolean>(false);
  const [stationDisable, setStationDisable] = useState<boolean>(false);
  const [isSaveBtnDisable, setIsSaveBtnDisable] = useState<boolean>(false);
  const [isOwnerDisable, setIsOwnerDisable] = useState<boolean>(false);
  const [isCategoryDisable, setIsCategoryDisable] = useState<boolean>(false);
  const [initialValuesOfFormForFormik, setInitialValuesOfFormForFormik] = React.useState<any>({});
  const [meteDataErrMsg, setMetaDataErrMsg] = useState({
    required: "",
  });
  const [fileId,setFileId] = useState<any>([])
  const [alertType, setAlertType] = useState<string>("inline");
  const [alert, setAlert] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("error");
  const [isCategoryFormEmpty, setIsCategoryFormEmpty] = useState<boolean>(false);
  const [validationSchema, setValidationSchema] = React.useState<any>();
  const [formpayloadForstoredValue, setFormPayloadForStoredValues] = useState<addMetadata>({
    station: {},
    masterAsset: "",
    owner: [],
    category: []
  });

  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const categories: any = useSelector((state: any) => state.categoriesSlice.filterCategories);

  const stations: any = useSelector(
    (state: RootState) => state.stationReducer.stationInfo
  );
  const [pageiGrid] = useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 0,
    size: 1000
  });

  const getCategories = React.useCallback(async () => {
    dispatch(getAllCategoriesFilter({
      pageiGrid: pageiGrid,
      search: "deep"
    }));
  }, [dispatch]);

  React.useEffect(() => {
    if (!stations || stations?.length == 0) {
      dispatch(getStationsInfoAllAsync());
    }
    masterAssets();
    dispatch(getUsersInfoAsync(pageiGrid));
  }, []);

  React.useEffect(() => {
    if(categories && Object.keys(categories).length == 0)
       getCategories();
   }, [getCategories]);

  React.useEffect(() => {
    fetchUser();
  }, [users.data]);

  React.useEffect(() => {
    if (formpayload.category.length == 0) {
      setIsNext(false);
    } else {
      if (isEditCase) {
        setIsNext(false);
      }
      /***
       * !  NOTE: Commenting below code because of violation of Category Form VD Design, not removing it for future reference
       * */
      // else {
      //   let checkFormExist = formpayload.category.some(
      //     (index: any) => index.form.length > 0
      //   );
      //   if (checkFormExist) {
      //     setIsNext(true);
      //   } else {
      //     setIsNext(false);
      //   }
      // }
    }
    if (
      !formpayload.masterAsset ||
      !formpayload.station ||
      formpayload.owner.length == 0
    ) {
      setIsSaveBtnDisable(true);
    } else {
      setIsSaveBtnDisable(false);
    }

    if (formpayload && (Object.keys(formpayload.station).length !== 0 || formpayload.owner.length > 0 || formpayload.category.length > 0)) {
      setIsformUpdated(true)
    }
    else {
      setIsformUpdated(false)
    }

    if (formpayload && (Object.keys(formpayload.station).length !== 0 && formpayload.owner.length > 0)) {
      setIsSaveBtnDisable(false);
    }
    else {
      setIsSaveBtnDisable(true);
    }

  }, [formpayload]);

  React.useEffect(() => {
    let checkSubmitType: any = uploadAssetBucket.filter(
      (x: any) => {
        if (x.evidence) {
          if (x.evidence.masterAsset.assetName === formpayload.masterAsset && x.id != undefined) {
            return x;
          }
        }
      }
    )

    if (checkSubmitType.length != 0) {
      let assetName: string = "";
      let station: string = "";
      let categoryData: any = [];
      let owners: any = [];
      checkSubmitType
        .filter((checkSubmit: any) => checkSubmit.evidence.masterAsset.assetName === formpayload.masterAsset)
        .forEach((checkSubmit: any) => {
          assetName = checkSubmit.assetName;
          station = checkSubmit.station;
          checkSubmit.evidence.masterAsset.owners.forEach((owner: any) => {
            owners.push(owner);
          });
          checkSubmit.categories.forEach((category: any) => {
            categoryData.push(category);
          });
        });
      const stationObject = stations.filter((s: any) => station == s.name)
        .map((o: any) => {
          return {
            id: o.id,
            label: o.name
          }
        })[0];
      const ownerDateOfArry: any = [];
      userOption.map((user: any) =>
        owners.forEach((owner: any) => {
          if (user.label == owner) {
            ownerDateOfArry.push(user);
            return user;
          }
        })
      );
      const categoryDateOfArry: any = [];
      categories.data.map((category: any) =>
        categoryData.forEach((previousCategory: any) => {
          if (category.name == previousCategory) {
            categoryDateOfArry.push({
              id : category.id,
              label : category.name,
              retentionId: category.policies.retentionPolicyId,
              form: RemapFormFieldKeyName(category.forms, category.id)
             });
          }
        })
      );
      setFormPayload({
        masterAsset: assetName,
        station: stationObject,
        category: categoryDateOfArry,
        owner: ownerDateOfArry,
      });
      setStationDisable(true);
      setIsOwnerDisable(true);
      setIsCategoryDisable(true);
      setIsNext(false);
      setIsEditCase(true);
      setMetaDataErrMsg({ ...meteDataErrMsg, required: "" });
    } else if (checkSubmitType.length == 0) {
      
      setStationDisable(false);
      setIsOwnerDisable(false);
      setIsCategoryDisable(false);
      setIsEditCase(false);
      if(formpayloadForstoredValue.masterAsset) 
       setFormPayload({...formpayloadForstoredValue,station : formpayloadForstoredValue.station, category : formpayloadForstoredValue.category, owner: formpayloadForstoredValue.owner}) 

    }
  }, [formpayload.masterAsset]);

  

  React.useEffect(() => {
    setFormPayload({ ...formpayload, masterAsset: displayText });
    uploadInfo.map((x:any) => {
     
     setFileId((fileId: any) => [...fileId , x.fileId]);
         });
  }, [uploadFile]);

  React.useEffect(() => {
    const Initial_Values: Array<any> = [];
    formpayload.category.forEach((formIndex: any) => {
      if (formIndex.form.length > 0) {
        formIndex.form.forEach((form: any) => {
          form.fields.forEach((field: any) => {
            Initial_Values.push({
              fieldId: field.id,
              formId: form.id,
              key: field.name,
              value: "",
              fieldType: field.type,
              version: "",
              isRequired: field.isRequired
            });
          });
        });
        const key_value_pair = Initial_Values.reduce((obj: any, item: any) => ((obj[item.key] = item.value), obj), {});
        setInitialValuesOfFormForFormik(key_value_pair);
        const validation = applyValidation(Initial_Values);
        setValidationSchema(validation);
      }
    });
    /**
      ** Checking either Current Category Contains any Empty Form.
      ** Then Maintaining State for Visiblity of 'Skip_category_form_and_save' Button. 
    **/
    if(formpayload.category.length > 0){
      const isFormExist = formpayload.category.every((x: any) => x.form.length === 0);
      setIsCategoryFormEmpty(isFormExist);
      setIsSaveBtnDisable(false);
    }
   
    if (formpayload && (Object.keys(formpayload.station).length !== 0 && formpayload.owner.length > 0)) {
      setIsSaveBtnDisable(false);
    }
    else {
      setIsSaveBtnDisable(true);
    }
  }, [formpayload.category]);

  React.useEffect(() => {
    //NOTE: Check disable state of save button either on reaching or currently displaying categorize screen.
    setSaveButtonDisablePropertyIfCategoryFormIsValid();
  }, [initialValuesOfFormForFormik, activeScreen]);

  const UpdateFormFields = React.useCallback(({ name, value }: FieldsFunctionType) => {
    setInitialValuesOfFormForFormik((previous: any) => {
      let args = { ...previous };
      args[name] = value;
      return args;
    });
  }, []);

  const setSaveButtonDisablePropertyIfCategoryFormIsValid = () => {
    if ((activeScreen === 1) && !(isCategoryFormEmpty)) {
      const isFormValid = validationSchema.isValidSync(initialValuesOfFormForFormik);
      isFormValid ? setIsSaveBtnDisable(false) : setIsSaveBtnDisable(true);
    }
  }
  const masterAssets = () => {
    let assetName = uploadFile.map((x: any) => {
      var j: MasterNameAndValue = {
        id: x.uploadedFileId,
        value: x.uploadedFileName,
      };
      return j;
    });
    let masterAssetBucket: MasterAssetBucket[] = [];
    uploadAssetBucket.filter((x: any) => x.id != undefined).map((x: any) => {
      let descriptor = findMaximumDescriptorId(x?.evidence?.securityDescriptors ?? []);
      if (descriptor && descriptor >= 3) {
        masterAssetBucket.push({
          id: x.assetId,
          value: x.assetName,
        });
      }
    });
    setMasterAssetOption([...assetName, ...masterAssetBucket]);
  };

  const fetchUser = () => {
    if (users.data && users.data.length > 0) {
      const userNames = users.data.map((user: any) => {
        return {
          userid: user.recId,
          loginId: user.loginId,
        } as UserNameAndValue;
      });
      sendOptionList(userNames);
    }
  };

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

  const checkOwners = () => {
    if (!formpayload.owner || formpayload.owner.length === 0) {
      setformpayloadErr({
        ...formpayloadErr,
        ownerErr: "Owner is required",
      });
    } else {
      setformpayloadErr({ ...formpayloadErr, ownerErr: "" });
    }
  };

  const checkStation = () => {
    if (!formpayload.station || Object.keys(formpayload.station).length === 0) {
      setformpayloadErr({
        ...formpayloadErr,
        stationErr: "Station is required",
      });
    } else {
      setformpayloadErr({ ...formpayloadErr, stationErr: "" });
    }
  };

  const recordingEnded = (fileName: string) => {
    const filterObject = uploadFile.find(
      (x: any) =>  x.uploadedFileName.replaceAll(" ", "_") === fileName
    );

    let hh = 0;
    let mm = 0;
    let ss = 0;

    if (filterObject != undefined) {
      const fileNameExtension = filterObject.name.substring(
        filterObject.name.lastIndexOf("."),
        filterObject.name.length
      );
      if (
        fileNameExtension === ".mp4" ||
        fileNameExtension === ".mp3" ||
        fileNameExtension === ".mkv" ||
        fileNameExtension === ".webm" ||
        fileNameExtension === ".3gp" ||
        fileNameExtension === ".wav"
      ) {
        let myVideos: any = [];
        myVideos.push(filterObject);
        myVideos[myVideos.length - 1].duration = filterObject.duration;
      } else {
        return currentStartDate();
      }
    }

    const hours = filterObject.duration / 3600;
    hh = Math.trunc(hours);
    const minutes = getDecimalPart(hours) * 60;
    mm = Math.trunc(minutes);
    const seconds = getDecimalPart(minutes) * 60;
    ss = Math.trunc(seconds);
    const milliSecond = getDecimalPart(seconds) * 1000;
    let today = new Date();
    today.setUTCHours(today.getUTCHours() + hh);
    today.setUTCMinutes(today.getUTCMinutes() + mm);
    today.setUTCSeconds(today.getUTCSeconds() + ss);
    today.setUTCMilliseconds(today.getUTCMilliseconds() + milliSecond);
    let m = "" + (today.getUTCMonth() + 1);
    let dd = "" + today.getUTCDate();
    let yyyy = today.getUTCFullYear();
    let currentHour = today.getUTCHours().toString();
    let currentMinute = today.getUTCMinutes().toString();
    let currentSecond = today.getUTCSeconds().toString();
    let currentMiliSecond = today.getUTCMilliseconds().toString();
    if (currentHour.length < 2) currentHour = "0" + currentHour;
    if (currentMinute.length < 2) currentMinute = "0" + currentMinute;
    if (currentSecond.length < 2) currentSecond = "0" + currentSecond;

    return (
      [yyyy, m, dd].join("-") +
      "T" +
      currentHour +
      ":" +
      currentMinute +
      ":" +
      currentSecond +
      "." +
      currentMiliSecond
    );
  };

  const onAddMetaData = async (submitType: SubmitType) => {
    let station: any = formpayload.station;
    const categories = CreateCategoryFormObjectCollection(formpayload.category, (submitType === SubmitType.WithForm), initialValuesOfFormForFormik, CategoryScenarioCallingFrom.AddAssetMetaData);
    const uploadedFile = uploadFile.map((index: any) => {
      let extension = index.name.slice(index.name.indexOf('.'));
      const files: masterAssetFile = {
        id: 0,
        assetId: 0,
        filesId: index.uploadedFileId,
        accessCode: index.accessCode,
        name: index.uploadedFileName,
        type: checkFileType(extension),
        extension: extension,
        url: index.url,
        size: index.size,
        duration: index.duration != undefined ? (index.duration * 1000) : 0,
        recording: {
          started: currentStartDate(),
          ended: recordingEnded(index.uploadedFileName),
        },
        sequence: 0,
        checksum: null,
        version: "",
      };
      return {
        id: index.uploadedFileId,
        name: index.uploadedFileName,
        typeOfAsset: checkAssetType(extension),
        status: checkFileStatus(index.state),
        state: "Normal",
        unitId: 0,
        isRestrictedView: false,
        duration: files.duration,
        recording: {
          started: files.recording.started,
          ended: files.recording.ended,
        },
        buffering: {
          pre: 20,
          post: 20,
        },
        files: [files],
        audioDevice: null,
        camera: null,
        isOverlaid: true,
        recordedByCSV: localStorage.getItem('loginId'),
      };
    });

    const asset = uploadedFile.find(
      (x: any) => x.name === formpayload.masterAsset
    );
    let master: any = {};

    if (asset != undefined) {
      const owners = formpayload.owner.map((x: any) => {
        return {
          CMTFieldValue: x.id,
        };
      });

      const masterAssetData: masterAsset = {
        id: asset.id,
        name: asset.name,
        typeOfAsset: asset.typeOfAsset,
        status: asset.status,
        state: asset.state,
        unitId: asset.unitId,
        isRestrictedView: asset.isRestrictedView,
        duration: asset.duration,
        recording: {
          started: asset.recording.started,
          ended: asset.recording.ended,
        },
        buffering: {
          pre: asset.buffering.pre,
          post: asset.buffering.post,
        },
        owners,
        bookMarks: [],
        notes: [],
        audioDevice: asset.audioDevice,
        camera: asset.camera,
        isOverlaid: asset.isOverlaid,
        recordedByCSV: asset.recordedByCSV,
        files: asset.files,
        lock: null,
      };
      master = masterAssetData;
    }

    const FilteringchildAsset = uploadedFile.filter(
      (x: any) => x.id != master.id
    );

    const children = FilteringchildAsset.map((childAsset: any) => {
      const owners = formpayload.owner.map((x: any) => {
        return {
          CMTFieldValue: x.id,
        };
      });

      return {
        id: childAsset.id,
        name: childAsset.name,
        typeOfAsset: childAsset.typeOfAsset,
        status: childAsset.status,
        state: childAsset.state,
        unitId: childAsset.unitId,
        isRestrictedView: childAsset.isRestrictedView,
        duration: childAsset.duration,
        recording: {
          started: childAsset.recording.started,
          ended: childAsset.recording.ended,
        },
        buffering: {
          pre: childAsset.buffering.pre,
          post: childAsset.buffering.post,
        },
        owners: owners,
        bookMarks: [],
        notes: [],
        files: childAsset.files,
        audioDevice: childAsset.audioDevice,
        camera: childAsset.camera,
        isOverlaid: childAsset.isOverlaid,
        recordedByCSV: childAsset.recordedByCSV,
        lock: null
      };
    });

    const stationId: masterAssetStation = {
      CMTFieldValue: station ? +station.id : 0,
    };

    return {
      categories,
      assets: { master, children },
      stationId,
      tag: null,
      version: "",
    };
  };

  const dispatchTobucket = (res: any, x: any) => {
    let asset = {
      "isMetaData": true,
      "id": x.assetId == res.masterAssetId ? res.id : undefined,
      "assetId": x.assetId,
      "assetName": x.assetName,
      "assetType": x.assetType,
      "unit": x.unit,
      "description": res.description,
      "categories": res.categories,
      "categorizedBy": res.categorizedBy,
      "devices": res.devices,
      "station": res.station,
      "recordedBy": x.recordedBy,
      "recordingStarted": x.recordingStarted,
      "status": x.status,
      "holdUntil": res.holdUntil,
      "expireOn": res.expireOn,
      "duration": x.duration,
      "size": x.size,
      //"retentionSpanText":x.retentionSpanText,
      "isMaster": x.assetId == res.masterAssetId,
      "evidence": {
        "id": res.id,
        "tenantId": res.tenantId,
        "masterAssetId": res.masterAssetId,
        "holdUntil": res.holdUntil,
        "station": res.station,
        "cadId": res.cadId,
        "retentionPolicyName": res.retentionPolicyName,
        "devices": res.devices,
        "categories": res.categories,
        "categorizedBy": res.categorizedBy,
        "formData": res.formData,
        "masterAsset": res.masterAsset,
        "asset": res.asset,
        "assetEventGeoData": res.assetEventGeoData,
        "securityDescriptors": res.securityDescriptors,
        "expireOn": res.expireOn,
        "description": res.description
      }
    };
    dispatch(addAssetToBucketActionCreator(asset));
  }

  const getUploadedEvidence = async (evidenceId: any, assetsToAddBucket: any) => {
    EvidenceAgent.getUploadedEvidence(evidenceId).then((res) => {
      if (res != null && res != undefined) {
        res.asset.map((x: any) => {
          if (assetsToAddBucket != null) {
            let value = assetsToAddBucket.find((y: any) => y.name == x.assetName);
            if (value != undefined) {
              dispatchTobucket(res, x);
            }
          }
          else {
            dispatchTobucket(res, x);
          }
        })
      }
    }).catch((error: any) => {

    })
  }

  const onAdd = async (submitType: SubmitType) => {
    const payload: any = await onAddMetaData(submitType);
    EvidenceAgent.addEvidence(payload).then((res) => {
      onClose();
      setAddEvidence(true);
      setEvidenceId(+res);
      setActiveScreen(0);
      setTimeout(() => {
        getUploadedEvidence(res, null);
      }, 2000);
      const fileArr: any = [];
      fileId.map((x: any) => uploadInfo.forEach((y: any) => {
        if (x == y.fileId && y.isCompleted == true) {
          fileArr.push(x)
        }
      }
      ))
      if (fileArr.length) {
        FileAgent.uploadAssetChecksum(fileArr.toString()).then((res) => {
        });
      }
      return res;
    }).catch((error: any) => {
      setIsSaveBtnDisable(false);
      if (error.response.status === 500) {
        setAlert(true);
        setResponseError(
          t(
            "We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"
          )
        );
      }
      else {
        let resp = error.response.data
        if (resp != undefined) {
          let error = JSON.parse(resp);
          if (!isNaN(+error)) {
            
          }
          else {
            setAlert(true);
            setResponseError(error);
          }
        }
      }
    });
  };

  const setEditPayload = () => {
    const owners = formpayload.owner.map((x: any) => {
      return {
        CMTFieldValue: x.id,
      };
    });
    // newly uploaded file in seprate array
    const uploadedFile = uploadFile.map((index: any) => {

      let extension = index.name.slice(index.name.indexOf('.'));

      
      const files: masterAssetFile = {
        id: 0,
        assetId: 0,
        filesId: index.uploadedFileId,
        accessCode: index.accessCode,
        name: index.uploadedFileName,
        type: checkFileType(extension),
        extension: extension,
        url: index.url,
        size: index.size,
        duration: index.duration != undefined ? (index.duration * 1000) : 0,
        recording: {
          started: currentStartDate(),
          ended: recordingEnded(index.uploadedFileName),
        },
        sequence: 0,
        checksum: null,
        version: "",
      };

      return {
        id: 0,
        name: index.uploadedFileName,
        typeOfAsset: checkAssetType(extension),
        status: checkFileStatus(index.state),
        state: "Normal",
        unitId: 0,
        isRestrictedView: false,
        duration: files.duration,
        recording: {
          started: files.recording.started,
          ended: files.recording.ended,
        },
        buffering: {
          pre: 20,
          post: 20,
        },
        bookMarks: [],
        notes: [],
        owners: owners,
        files: [files],
        audioDevice: null,
        camera: null,
        isOverlaid: true,
        recordedByCSV: localStorage.getItem('loginId'),
      };
    });
    return uploadedFile;
  };

  const onEdit = async (ids: any, assetId: any) => {
    let payload = setEditPayload();
    let urlEdit = EVIDENCE_ASSET_DATA_URL + "/" + ids + "/Assets/AddBulkAsset";
    await fetch(urlEdit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("access_token")}`,
      },
      body: JSON.stringify(payload),
    }).then(function (res) {
      if (res.status == 200) {
        setTimeout(() => {
          getUploadedEvidence(ids, payload);
        }, 2000);
      }
      if (res.status == 500 || res.status == 400) {
        setAlert(true);
        setIsSaveBtnDisable(false);
        setResponseError(
          t(
            "We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"
          )
        );
      }
      if (res.ok) {
        onClose();
        setAddEvidence(true);
        setActiveScreen(0);
      }
    });
  };

  const onSubmit = async (submitType: SubmitType) => {
    let ids: number = 0;
    let assetId: number = 0;
    let checkSubmitType: any = uploadAssetBucket
      .filter(
        (x: any) => x.evidence.masterAsset.assetName === formpayload.masterAsset && x.id != undefined
      )
      .map((x: any) => {
        ids = x.id;
        assetId = x.assetId;
        return x;
      });

    if (checkSubmitType.length) {
      await onEdit(ids, assetId);
    } else {
      await onAdd(submitType);
    }
  };


  const categoryDropdownOnChangeHandler = (
    event: React.SyntheticEvent,
    value: any[]
  ) => {
    event.isDefaultPrevented();
    const filteredCategories = categories.data.filter((category: any) => value.some((value) => value.id == category.id));
    //NOTE: Remap fields of Form with FormId.
    const categoryForm: any = filteredCategories.map((filteredCategory: any) => {
      return {
        id: filteredCategory.id,
        label: filteredCategory.name,
        retentionId: filteredCategory.policies.retentionPolicyId,
        form: RemapFormFieldKeyName(filteredCategory.forms, filteredCategory.id)
      }
    });
    
    setFormPayloadForStoredValues({...formpayloadForstoredValue, category : categoryForm})
    setFormPayload({ ...formpayload, category: categoryForm });
    setIsNext(true);
  };

  const nextBtnHandler = () => {
    setActiveScreen(activeScreen + 1);
    setIsNext(false);
  }

  const backBtnHandler = () => {
    setActiveScreen(activeScreen - 1);
    setIsNext(true);
    setIsSaveBtnDisable(false);
  }

  const SaveBtnSubmitForm = () => {
    //NOTE: Added to Seperate Submit Button Handler to handle Submission of Categories With No Form.
    setIsSaveBtnDisable(true);
    isCategoryFormEmpty ? onSubmit(SubmitType.WithoutForm) : onSubmit(SubmitType.WithForm);
  }


  const handleActiveScreen = (activeScreen: number) => {
    switch (activeScreen) {
      case 0:
        return (
          <>
            <CRXAlert
              message={responseError}
              className={`crxAlertUserEditForm ${alert === true
                ? "__crx__Set_MetaData_Show"
                : "__crx__Set_MetaData_Hide"
                } }`}
              alertType={alertType}
              type={errorType}
              open={alert}
              setShowSucess={() => null}
            />
            <div className="CrxCreateUser">
              <div className="CrxIndicates">
                <sup>*</sup> {t("Indicates_required_field")}
              </div>
            </div>
            <div className="metaData-masterAsset">
              <div className="metaData-inner-masterAsset">
                <label className="masterAsset_label_ui">
                  {t("Master_Asset")} <span>*</span>
                </label>
                <CRXSelectBox
                  className={`metaData-Station-Select  ${formpayload.masterAsset === "" ? "" : "gepAddClass"
                    }`}
                  id={"select_" + "selectBox"}
                  defaultOptionText={t("Select_Master_Asset")}
                  disabled={
                    uploadFile.length == 1 && uploadAssetBucket.length == 0
                      ? true
                      : false
                  }
                  value={
                    formpayload.masterAsset === ""
                      ? displayText
                      : formpayload.masterAsset
                  }
                  onChange={(e: any) => {
                    setFormPayloadForStoredValues({...formpayloadForstoredValue, masterAsset : e.target.value})
                    setFormPayload({
                      ...formpayload,
                      masterAsset: e.target.value,
                    })
                  }
                  }
                  options={masterAssetOption}
                  defaultValue=""
                  zIndex={13001}
                  popover="popover_master_asset"
                />
              </div>
            </div>
            <div
              className={`metaData-station  ${meteDataErrMsg.required == ""
                ? ""
                : "__Crx_MetaData__Station_Error"
                }`}
            >
              <div
                className={`metaData-inner ${Object.keys(formpayload.station).length === 0 ? "" : "gepAddClass"
                  }`}
              >
                <div className={`metaData-category ${formpayloadErr.stationErr == ""
                  ? ""
                  : "__Crx_MetaData__Station_Error"
                  }`}>

                  <CRXMultiSelectBoxLight
                    className="metaData-Station-Select metaData-Station-Select_ui_field"
                    label={t("Station")}
                    placeHolder=""
                    multiple={false}
                    CheckBox={true}
                    required={true}
                    options={AddMetaDataUtility.filterStation(stations)}
                    value={formpayload.station}
                    autoComplete={false}
                    isSearchable={true}
                    disabled={stationDisable ? true : false}
                    error={!!formpayloadErr.stationErr}
                    errorMsg={formpayloadErr.stationErr}
                    onBlur={checkStation}
                    onChange={(e: React.SyntheticEvent, value: StationIdandLabel) => {
                      setFormPayloadForStoredValues({...formpayloadForstoredValue, station: (value == null) ? {} : value })
                      setFormPayload({ ...formpayload, station: (value == null) ? {} : value });
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`metaData-category ${formpayloadErr.ownerErr == ""
                ? ""
                : "__Crx_MetaData__Station_Error"
                }`}
            >
              <CRXMultiSelectBoxLight
                className="categortAutocomplete CRXmetaData-owner"
                label={t("Owner(s)")}
                placeHolder=""
                multiple={true}
                CheckBox={true}
                required={true}
                options={userOption}
                value={formpayload.owner}
                autoComplete={false}
                isSearchable={true}
                disabled={isOwnerDisable}
                error={!!formpayloadErr.ownerErr}
                errorMsg={formpayloadErr.ownerErr}
                onBlur={checkOwners}
                onChange={(e: React.SyntheticEvent, value: string[]) => {
                  let filteredValues = value.filter((x: any) => x.inputValue !== x.label);
                  setFormPayloadForStoredValues({...formpayloadForstoredValue, owner : filteredValues})
                  setFormPayload({ ...formpayload, owner: filteredValues });
                }}
              />
            </div>
            <div className="metaData-category __metaData__Category__">
              <CRXMultiSelectBoxLight
                className="categortAutocomplete CRXmetaData-category"
                placeHolder=""
                label={t("Category")}
                multiple={true}
                CheckBox={true}
                options={filterCategory(categories.data)}
                value={formpayload.category}
                autoComplete={false}
                isSearchable={true}
                disabled={isCategoryDisable}
                onChange={(e: React.SyntheticEvent, value: string[]) =>
                  categoryDropdownOnChangeHandler(e, value)
                }
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <CRXAlert
              message={responseError}
              className={`crxAlertUserEditForm ${alert === true
                ? "__crx__Set_MetaData_Show"
                : "__crx__Set_MetaData_Hide"
                } }`}
              alertType={alertType}
              type={errorType}
              open={alert}
              setShowSucess={() => null}
            />
            <div className="__CRX__Asset_MetaData__Form__">
              {formpayload.category.some((o: any) => o.form.length > 0) ? (
                <DisplayCategoryForm
                  formCollection={formpayload.category}
                  initialValueObjects={initialValuesOfFormForFormik}
                  validationSchema={validationSchema}
                  setFieldsFunction={(e: FieldsFunctionType) => UpdateFormFields(e)}
                />
              )
                : (
                  <NoFormAttachedOfAssetBucket
                    categoryCollection={formpayload.category}
                  />
                )}
            </div>
          </>
        );
    }
  }

  return (
    <div className="metaData-Station-Parent">
      {handleActiveScreen(activeScreen)}
      <div className="modalFooter metaDataModalFooter">
        {!isNext ? (
          <div className="saveBtn">
            <CRXButton
              className="primary"
              disabled={isSaveBtnDisable}
              onClick={() => SaveBtnSubmitForm()}
            >
              {t("Save")}
            </CRXButton>
          </div>
        ) : (
          <div className="nextBtn">
            <CRXButton
              className="primary"
              disabled={isSaveBtnDisable}
              onClick={nextBtnHandler}
            >
              {t("Next")}
            </CRXButton>
          </div>
        )}
        <div className="cancelBtn">
          {(activeScreen === 1) ?
            <>
              <CRXButton className='cancelButton secondary' color='secondary' variant='contained' onClick={backBtnHandler}>
                {t("Back")}
              </CRXButton>
              {/* Won't render if Categories Don't have Form in it. */}
              {(!isCategoryFormEmpty) &&
                <CRXButton className='skipButton' onClick={() => onSubmit(SubmitType.WithoutForm)}>
                  {t("Skip_category_form_and_save")}
                </CRXButton>
              }
            </>
            :
            <CRXButton className="secondary" onClick={onClose}>
              {t("Cancel")}
            </CRXButton>
          }
        </div>
      </div>
    </div>
  );
};

export default AddMetadataForm;