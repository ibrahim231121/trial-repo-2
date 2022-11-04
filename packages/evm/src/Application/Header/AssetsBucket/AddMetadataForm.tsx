import React, { useState } from "react";
import { EVIDENCE_ASSET_DATA_URL } from "../../../utils/Api/url";
import { useDispatch, useSelector } from "react-redux";
import { CRXSelectBox, CRXMultiSelectBoxLight } from "@cb/shared";
import { RootState } from "../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import { CRXButton } from "@cb/shared";
import CategoryFormOFAssetBucket from "./SubComponents/CategoryFormOFAssetBucket";
import NoFormAttachedOfAssetBucket from "./SubComponents/NoFormAttachedOfAssetBucket";
import Cookies from "universal-cookie";
import { CRXAlert } from "@cb/shared";
import { useTranslation } from "react-i18next";
import { EvidenceAgent, SetupConfigurationAgent, UnitsAndDevicesAgent } from "../../../utils/Api/ApiAgent";
import { Station } from "../../../utils/Api/models/StationModels";
import { PageiGrid } from "../../../GlobalFunctions/globalDataTableFunctions";
import { SETUP_CONFIGURATION_SERVICE_URL } from "../../../utils/Api/url";
import { Policy } from "../../../utils/Api/models/PolicyModels";
import moment from "moment";
import { getCategoryAsync } from "../../../Redux/categoryReducer";
import { addMetadata, AddMetadataFormProps, CategoryNameAndValue, masterAsset, MasterAssetBucket, masterAssetFile, masterAssetStation, MasterNameAndValue, NameAndValue, UserNameAndValue } from "./SubComponents/types";
import { SubmitType } from "../../Assets/AssetLister/Category/Model/CategoryFormModel";
import { MAX_REQUEST_SIZE_FOR } from "../../../utils/constant";

const AddMetadataForm: React.FC<AddMetadataFormProps> = ({
  onClose,
  setCloseWithConfirm,
  setAddEvidence,
  uploadFile,
  uploadAssetBucket,
  activeScreen,
  setActiveScreen,
}) => {
  let displayText = "";
  if (uploadFile.length != 0) {
    displayText = uploadFile[0].uploadedFileName.substring(
      0,
      uploadFile[0].uploadedFileName.lastIndexOf(".")
    );
  }
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [formpayload, setFormPayload] = useState<addMetadata>({
    station: "",
    masterAsset: "",
    owner: [],
    category: []
  });
  const [formpayloadErr, setformpayloadErr] = useState({
    masterAssetErr: "",
    stationErr: "",
    ownerErr: "",
  });
  const [optionList, setOptionList] = useState<any>([]);
  const [userOption, setUserOption] = useState<any>([]);
  const [categoryOption, setCategoryOption] = useState<any>([]);
  const [masterAssetOption, setMasterAssetOption] = useState<any>([]);
  const [isNext, setIsNext] = useState<boolean>(true);
  const [isEditCase, setIsEditCase] = useState<boolean>(false);
  const [stationDisable, setStationDisable] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isOwnerDisable, setIsOwnerDisable] = useState<boolean>(false);
  const [isCategoryDisable, setIsCategoryDisable] = useState<boolean>(false);
  const [filteredForm, setFilteredForm] = useState<any>([]);
  const [InitialValues, setInitialValues] = React.useState<any>({});
  const [meteDataErrMsg, setMetaDataErrMsg] = useState({
    required: "",
  });
  const [alertType, setAlertType] = useState<string>("inline");
  const [alert, setAlert] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("error");
  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const categories: any = useSelector(
    (state: RootState) => state.assetCategory.category
  );

  const stations: any = useSelector(
    (state: RootState) => state.stationReducer.stationInfo
  );

  const [pageiGrid, setPageiGrid] = useState<PageiGrid>({
    gridFilter: {
      logic: "and",
      filters: []
    },
    page: 0,
    size: 1000
  })

  React.useEffect(() => {
    fetchStation();
    masterAssets();
    dispatch(getUsersInfoAsync(pageiGrid));
    dispatch(getCategoryAsync());
  }, []);

  React.useEffect(() => {
    fetchUser();
    fetchCategory();
  }, [users.data, categories, stations]);

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
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [formpayload]);

  React.useEffect(() => {
    let checkSubmitType: any = uploadAssetBucket.filter(
      (x: any) => {
        if (x.evidence) {
          if (x.evidence.masterAsset.assetName === formpayload.masterAsset) {
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
        .filter(
          (x: any) =>
            x.evidence.masterAsset.assetName === formpayload.masterAsset
        )
        .forEach((x: any) => {
          assetName = x.assetName;
          station = x.station;
          x.evidence.masterAsset.owners.forEach((owner: any) => {
            owners.push(owner);
          });
          x.categories.forEach((i: any) => {
            categoryData.push(i);
          });
        });
      let stationString: string = "";
      const ownerDateOfArry: any = [];
      userOption.map((item: any, counter: number) =>
        owners.forEach((x: any) => {
          if (item.label == x) {
            ownerDateOfArry.push(item);
            return item;
          }
        })
      );
      const categoryDateOfArry: any = [];
      categoryOption.map((item: any, counter: number) =>
        categoryData.forEach((x: any) => {
          if (item.label == x) {
            categoryDateOfArry.push(item);
            return item;
          }
        })
      );

      setFormPayload({
        masterAsset: assetName,
        station: stationString,
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
      setFormPayload({ ...formpayload, category: [], station: "", owner: [] });
    }
  }, [formpayload.masterAsset]);

  React.useEffect(() => {
    setFormPayload({ ...formpayload, masterAsset: displayText });
  }, [uploadFile]);

  React.useEffect(() => {
    if (activeScreen === 1) { // 'stationDisable' used For Edit Case.
      // NOTE : Submit Button Disable State, on the basis of Form Input.
      const isFormValidated: boolean = filteredForm.some((ele: any) => (ele.value.length === 0 || ele.value.length > 1024));
      if (!isFormValidated)
        setIsDisable(false);
      else
        setIsDisable(true);
    }
  }, [filteredForm, activeScreen]);

  React.useEffect(() => {
    const filteredArray: any = [];
    formpayload.category.forEach((formIndex: any) => {
      if (formIndex.form.length > 0) {
        formIndex.form.forEach((fieldIndex: any) => {
          fieldIndex.fields.forEach((x: any) => {
            filteredArray.push({
              fieldId: x.id,
              formId: x.formId,
              key: x.name,
              value: "",
              datatype: x.datatype,
              version: "",
            });
            setFilteredForm(filteredArray);
          });
        });
        const key_value_pair = filteredArray.reduce((obj: any, item: any) => ((obj[item.key] = item.value), obj), {});
        setInitialValues(key_value_pair);
      }
    });
  }, [formpayload.category]);

  const fetchStation = async () => {
    var response = await UnitsAndDevicesAgent.getAllStationInfo(`?Page=1&Size=${MAX_REQUEST_SIZE_FOR.STATION}`).then(
      (response: Station[]) => response
    );
    var stationNames = response.map((x: any, i: any) => {
      let j: NameAndValue = {
        id: x.id,
        value: x.name,
      };
      return j;
    });

    setOptionList(stationNames);
  };

  const masterAssets = () => {
    let assetName = uploadFile.map((x: any) => {
      var masterAssetId = x.uploadedFileName.lastIndexOf("_");
      let masterAssetValueIndex = x.uploadedFileName.lastIndexOf(".");
      var j: MasterNameAndValue = {
        id: x.uploadedFileName.substring(
          masterAssetId + 1,
          masterAssetValueIndex
        ),
        value: x.uploadedFileName.substring(0, masterAssetValueIndex),
      };
      return j;
    });

    let assetBucket = uploadAssetBucket.map((x: any) => {
      var j: MasterAssetBucket = {
        id: x.assetId,
        value: x.assetName,
      };
      return j;
    });
    setMasterAssetOption([...assetName, ...assetBucket]);
  };

  const fetchUser = () => {
    if (users.data && users.data.length > 0) {
      var userNames = users.data.map((user: any) => {
        let j: UserNameAndValue = {
          userid: user.recId,
          userName: user.userName,
        };
        return j;
      });
    }

    sendOptionList(userNames);
  };

  const sendOptionList = (data: any[]) => {
    const dateOfArry: any = [];
    data?.forEach((item, index) => {
      dateOfArry.push({
        id: item.userid,
        label: item.userName,
      });
    });
    return setUserOption(dateOfArry);
  };

  const fetchCategory = () => {
    if (categories && categories.length > 0) {
      var categoryName = categories.map((categories: any) => {
        let j: CategoryNameAndValue = {
          categoryId: categories.id,
          categoryName: categories.name,
          categroyForm: categories.forms,
          categoryRetentionId: categories.policies.retentionPolicyId
        };
        return j;
      });
    }
    sendCategoryOptionList(categoryName);
  };

  const sendCategoryOptionList = (data: any[]) => {
    const dateOfArry: any = [];
    const formOfArry: any = [];
    data?.forEach((item, index) => {
      if (item.categroyForm.length != 0) {
        item.categroyForm.forEach((index: any) => {
          index.fields.forEach((x: any) => {
            let formfields = {
              id: x.id,
              formId: index.id,
              name: x.name,
              datatype: x.type,
              display: {
                caption: x.display.caption,
              },
            };
            formOfArry.push(formfields);
          });
          const fields = formOfArry.filter((x: any) => x.formId === index.id);
          dateOfArry.push({
            id: item.categoryId,
            label: item.categoryName,
            retentionId: item.categoryRetentionId,
            form: [
              {
                id: index.id,
                name: index.name,
                fields,
              },
            ],
          });
        });
      } else {
        dateOfArry.push({
          id: item.categoryId,
          label: item.categoryName,
          retentionId: item.categoryRetentionId,
          form: [],
        });
      }
    });
    var distinctCategoryList = dateOfArry.filter((value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => (
        t.id === value.id
      ))
    )
    return setCategoryOption(distinctCategoryList);

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

  const checkAssetType = (assetType: string) => {
    var typeOfAsset: string = "";
    switch (assetType) {
      case ".mp4":
      case ".avi":
      case ".mkv":
      case ".3gp":
      case ".webm":
      case ".wmv":
        typeOfAsset = "Video";
        break;

      case ".mp3":
      case ".wma":
      case ".aac":
      case ".wav":
        typeOfAsset = "Audio";
        break;

      case ".jpeg":
      case ".png":
      case ".gif":
      case ".tiff":
      case ".psd":
      case ".ai":
      case ".jpg":
        typeOfAsset = "Image";
        break;

      case ".xlsx":
      case ".xlsm":
      case ".xlsb":
      case ".xltx":
      case ".xltm":
      case ".xml":
      case ".doc":
      case ".docx":
      case ".pdf":
      case ".txt":
      case ".ppt":
        typeOfAsset = "Doc";
        break;

      case ".dll":
      case ".exe":
      case ".msi":
      case ".bin":
        typeOfAsset = "Executable";
        break;

      case ".zip":
      case ".rar":
      case ".icm":
        typeOfAsset = "Others";
        break;

      default:
        typeOfAsset = "Other";
    }
    return typeOfAsset;
  };

  const checkFileType = (fileType: string) => {
    var typeOfFile: string = "";
    switch (fileType) {

      case ".mp4":
      case ".avi":
      case ".mkv":
      case ".3gp":
      case ".webm":
        typeOfFile = "Video";
        break;

      case ".mp3":
      case ".wma":
      case ".aac":
      case ".wav":
        typeOfFile = "Audio";
        break;

      case ".jpeg":
      case ".png":
      case ".gif":
      case ".tiff":
      case ".psd":
      case ".ai":
      case ".jpg":
        typeOfFile = "Image";
        break;

      case ".wmv":
        typeOfFile = "WMVVideo";
        break;

      case ".icm":
        typeOfFile = "AvenueSource";
        break;

      case ".doc":
      case ".docx":
        typeOfFile = "WordDoc";
        break;

      case ".pdf":
        typeOfFile = "PDFDoc";
        break;

      case ".txt":
        typeOfFile = "Text";
        break;

      case ".xlsx":
      case ".xlsm":
      case ".xlsb":
      case ".xltx":
      case ".xltm":
        typeOfFile = "ExcelDoc";
        break;

      case ".ppt":
      case ".pptx":
        typeOfFile = "PowerPointDoc";
        break;

      case ".dll":
        typeOfFile = "DLL";
        break;
      case ".exe":
        typeOfFile = "Exe";
        break;
      case ".msi":
        typeOfFile = "Msi";
        break;
      case ".bin":
        typeOfFile = "bin";
        break;

      case ".crt":
      case ".cer":
      case ".ca-bundle":
      case ".p7b":
      case ".p7c":
      case ".p7s":
      case ".pem":
        typeOfFile = "BW2Certificate";
        break;

      case ".zip":
      case ".rar":
        typeOfFile = "Zip";
        break;

      case ".xml":
      case ".csv":
      case ".wpt":
      case ".dat":
      case ".ppc":
      case ".wpr":
      case ".trl":
        typeOfFile = "GPS";
        break;

      default:
        typeOfFile = "Other";
    }
    return typeOfFile;
  };
  const currentStartDate = () => {

    return moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
  };

  const insertCategory = (payloadCategory: any) => {
    const categoryArrayIndex = new Array();
    payloadCategory.forEach((catIndexs: any, i: any) => {
      if (catIndexs.form.length != 0) {
        catIndexs.form.forEach((formIndex: any) => {
          let filteredValues = filteredForm.filter(
            (x: any) => x.formId === formIndex.id
          );
          let fields = filteredValues.map((x: any) => {
            return {
              fieldId: x.fieldId,
              key: x.key,
              value: x == undefined ? "" : x.value,
              dataType: x.dataType,
              version: "",
            };
          });

          categoryArrayIndex.push({
            id: catIndexs.id,
            retentionId: catIndexs.retentionId,
            formData: [
              {
                formId: formIndex.id,
                fields,
              },
            ],
          });
        });
      } else {
        categoryArrayIndex.push({ id: catIndexs.id, retentionId: catIndexs.retentionId, formData: [] });
      }
    });
    return categoryArrayIndex;
  };

  const getDecimalPart = (num: any) => {
    return num % 1;
  };

  const recordingEnded = (fileName: string) => {
    const filterObject = uploadFile.find(
      (x: any) =>
        x.uploadedFileName.substring(0, x.uploadedFileName.lastIndexOf(".")).replaceAll(" ", "_") ===
        fileName
    );

    var hh = 0;
    var mm = 0;
    var ss = 0;

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
        var myVideos: any = [];
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
    var today = new Date();
    today.setUTCHours(today.getUTCHours() + hh);
    today.setUTCMinutes(today.getUTCMinutes() + mm);
    today.setUTCSeconds(today.getUTCSeconds() + ss);
    today.setUTCMilliseconds(today.getUTCMilliseconds() + milliSecond);
    var m = "" + (today.getUTCMonth() + 1);
    var dd = "" + today.getUTCDate();
    var yyyy = today.getUTCFullYear();
    var currentHour = today.getUTCHours().toString();
    var currentMinute = today.getUTCMinutes().toString();
    var currentSecond = today.getUTCSeconds().toString();
    var currentMiliSecond = today.getUTCMilliseconds().toString();
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
    const station = optionList.find(
      (x: any) => x.value === formpayload.station
    );
    let categories: any[] = [];
    if (submitType === SubmitType.WithoutForm) {
      categories = insertCategory(formpayload.category).map((x: any) => {
        return {
          ...x,
          formData: []
        }
      });
    } else {
      categories = insertCategory(formpayload.category);
    }

    const uploadedFile = uploadFile.map((index: any) => {
      let masterAssetValueIndex = index.uploadedFileName.lastIndexOf(".");
      let name = index.uploadedFileName;
      let extension = index.uploadedFileName.substring(
        masterAssetValueIndex,
        name.length
      );
      const files: masterAssetFile = {
        id: 0,
        assetId: 0,
        filesId: index.uploadedFileId,
        name: index.uploadedFileName.substring(0, masterAssetValueIndex),
        type: checkFileType(extension),
        extension: extension,
        url: index.url,
        size: index.size,
        duration: index.duration != undefined ? (index.duration * 1000) : 0,
        recording: {
          started: currentStartDate(),
          ended: recordingEnded(index.uploadedFileName.substring(0, masterAssetValueIndex)),
        },
        sequence: 0,
        checksum: {
          checksum: "bc527343c7ffc103111f3a694b004e2f",
          status: true,
          algorithm: "SHA-257",
        },
        version: "",
      };
      return {
        id: index.uploadedFileId,
        name: index.uploadedFileName.substring(0, masterAssetValueIndex),
        typeOfAsset: checkAssetType(extension),
        status: "Uploading",
        state: "Normal",
        unitId: 20,
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
        recordedByCSV: localStorage.getItem('username'),
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

  const onAdd = async (submitType: SubmitType) => {
    const payload : any = await onAddMetaData(submitType);

    EvidenceAgent.addEvidence(payload).then((res) => {
      onClose();
      setAddEvidence(true);
      setActiveScreen(0);
      return res;
    }).catch((error:any) =>{
      if(error.response.status === 500){
        setAlert(true);
        setResponseError(
          t(
            "We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"
          )
        );
      }
      else{
        let resp = error.response.data
        if (resp != undefined) {
          let error = JSON.parse(resp);
          if (!isNaN(+error)) {
            console.error("evidence", error)
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

    // newly uploaded file in seprate array
    const uploadedFile = uploadFile.map((index: any) => {
      let masterAssetValueIndex = index.uploadedFileName.lastIndexOf(".");
      let name = index.uploadedFileName;
      let extension = index.uploadedFileName.substring(
        masterAssetValueIndex,
        name.length
      );

      const files: masterAssetFile = {
        id: 0,
        assetId: 0,
        filesId: index.uploadedFileId,
        name: index.uploadedFileName.substring(0, masterAssetValueIndex),
        type: checkFileType(extension),
        extension: extension,
        url: index.url,
        size: index.size,
        duration: index.duration != undefined ? (index.duration * 1000) : 0,
        recording: {
          started: currentStartDate(),
          ended: recordingEnded(index.uploadedFileName.substring(0, masterAssetValueIndex)),
        },
        sequence: 0,
        checksum: {
          checksum: "bc527343c7ffc103111f3a694b004e2f",
          status: true,
          algorithm: "SHA-257",
        },
        version: "",
      };

      return {
        id: 0,
        name: index.uploadedFileName.substring(0, masterAssetValueIndex),
        typeOfAsset: checkAssetType(extension),
        status: "Uploading",
        state: "Normal",
        unitId: 20,
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
        owners: [
          {
            cmtFieldValue: localStorage.getItem('User Id'),
          },
        ],
        files: [files],
        audioDevice: null,
        camera: null,
        isOverlaid: true,
        recordedByCSV: localStorage.getItem('username'),
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
        TenantId: "1",
        Authorization: `Bearer ${cookies.get("access_token")}`,
      },
      body: JSON.stringify(payload),
    }).then(function (res) {
      if (res.status == 200) {
      }
      if (res.status == 500 || res.status == 400) {
        setAlert(true);
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
    var ids: number = 0;
    var assetId: number = 0;
    let checkSubmitType: any = uploadAssetBucket
      .filter(
        (x: any) => x.evidence.masterAsset.assetName === formpayload.masterAsset
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
    value: string[]
  ) => {
    event.isDefaultPrevented();
    setFormPayload({ ...formpayload, category: value });
    setIsNext(true);
  };

  const stationSelectClose = (e: any) => {
    if (e.target.value == undefined || e.target.value != 0) {
      setMetaDataErrMsg({
        ...meteDataErrMsg,
        required: "Station is required",
      });
    } else {
      setMetaDataErrMsg({ ...meteDataErrMsg, required: "" });
    }
  };

  const setFormField = (e: any, formId: any, datatype: string) => {
    const { target } = e;
    let newArray = filteredForm.filter((o: any) => {
      return o.key !== target.name;
    });
    setFilteredForm(() => [
      ...newArray,
      {
        fieldId: target.id,
        formId: formId,
        key: target.name,
        value: target.value,
        dataType: datatype,
        version: "",
      },
    ]);
  };

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
                <label>
                  {t("Master_Asset")} <span>*</span>
                </label>
                <CRXSelectBox
                  className={`metaData-Station-Select ${formpayload.masterAsset === "" ? "" : "gepAddClass"
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
                  onChange={(e: any) =>
                    setFormPayload({
                      ...formpayload,
                      masterAsset: e.target.value,
                    })
                  }
                  options={masterAssetOption}
                  defaultValue=""
                />
              </div>
            </div>
            <div
              className={`metaData-station ${meteDataErrMsg.required == ""
                ? ""
                : "__Crx_MetaData__Station_Error"
                }`}
            >
              <div
                className={`metaData-inner ${formpayload.station === "" ? "" : "gepAddClass"
                  }`}
              >
                <label>
                  {t("Station")} <span>*</span>
                </label>
                <div className="__CrX_Station__metaData__">
                  <CRXSelectBox
                    className="metaData-Station-Select"
                    id={"select_" + "selectBox"}
                    value={
                      formpayload.station === "" ? "" : formpayload.station
                    }
                    disabled={stationDisable ? true : false}
                    onChange={(e: any) => {
                      setFormPayload({
                        ...formpayload,
                        station: e.target.value,
                      });
                    }}
                    onClose={(e: any) => stationSelectClose(e)}
                    isRequried={true}
                    error={meteDataErrMsg.required == "" ? true : false}
                    errorMsg={meteDataErrMsg.required}
                    defaultOptionText=""
                    options={optionList}
                    defaultValue=""
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
                options={categoryOption}
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
                formpayload.category.map((obj: any) => (
                  <CategoryFormOFAssetBucket
                    categoryObject={obj}
                    initialValues={InitialValues}
                    setFieldForm={(e: any, formId: any, datatype: string) =>
                      setFormField(e, formId, datatype)
                    }
                  />
                ))
              ) : (
                <NoFormAttachedOfAssetBucket
                  categoryCollection={formpayload.category}
                />
              )}
            </div>
          </>
        );
    }
  };

  const nextBtnHandler = () => {
    setActiveScreen(activeScreen + 1);
    setIsNext(false);
  }

  const backBtnHandler = () => {
    setActiveScreen(activeScreen - 1);
    setIsNext(true);
  }

  return (
    <div className="metaData-Station-Parent">
      {handleActiveScreen(activeScreen)}
      <div className="modalFooter CRXFooter">
        {!isNext ? (
          <div className="saveBtn">
            <CRXButton
              className="primary"
              disabled={isDisable}
              onClick={() => onSubmit(SubmitType.WithForm)}
            >
              {t("Save")}
            </CRXButton>
          </div>
        ) : (
          <div className="nextBtn">
            <CRXButton
              className="primary"
              disabled={isDisable}
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
              <CRXButton className='skipButton' onClick={() => onSubmit(SubmitType.WithoutForm)}>
                {t("Skip_category_form_and_save")}
              </CRXButton>
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