import React, { useEffect, useState } from "react";
import {
  EVIDENCE_ASSET_DATA_URL,
  STATION_INFO_DATA_PERMISSION_GET_URL,
} from "../../../utils/Api/url";
import { useDispatch, useSelector } from "react-redux";
import { CRXSelectBox, CRXMultiSelectBoxLight } from "@cb/shared";
import { RootState } from "../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import { getAllCategories } from "../../../Redux/SetupConfigurationReducer";
import { CRXButton } from "@cb/shared";
import CategoryFormOFAssetBucket from "./SubComponents/CategoryFormOFAssetBucket";
import NoFormAttachedOfAssetBucket from "./SubComponents/NoFormAttachedOfAssetBucket";
import Cookies from "universal-cookie";

interface Props {
  onClose: any;
  setCloseWithConfirm: any;
  uploadFile: any;
  uploadAssetBucket: any;
  activeScreen: number;
  setAddEvidence: any;
}

type NameAndValue = {
  id: string;
  value: string;
};

type MasterNameAndValue = {
  id: string;
  value: string;
};

type MasterAssetBucket = {
  id: string;
  value: string;
};

type UserNameAndValue = {
  userid: string;
  userName: string;
};

type CategoryNameAndValue = {
  categoryId: string;
  categoryName: string;
  categroyForm: string[];
};

interface addMetadata {
  station: string;
  owner: string[];
  category: string[];
  masterAsset: any;
}

type masterAsset = {
  id: number;
  name: string;
  typeOfAsset: string;
  status: string;
  state: string;
  unitId: number;
  isRestrictedView: boolean;
  duration: number;
  recording: {
    started: string;
    ended: string;
  };
  buffering: {
    pre: number;
    post: number;
  };
  owners: any;
  audioDevice: string;
  camera: string;
  isOverlaid: boolean;
  recordedByCSV: string;
  bookMarks: any;
  notes: any;
  files: any;
};

type masterAssetFile = {
  id: number;
  assetId: number;
  filesId: number;
  name: string;
  type: string;
  extension: string;
  url: string;
  size: number;
  duration: number;
  recording: {
    started: string;
    ended: string;
  };
  sequence: number;
  checksum: {
    checksum: string;
    status: boolean;
    algorithm: string;
  };
  version: string;
};

type masterAssetStation = {
  CMTFieldValue: number;
};

type retentionPolicyId = {
  CMTFieldValue: number;
};

const AddMetadataForm: React.FC<Props> = ({
  onClose,
  setCloseWithConfirm,
  setAddEvidence,
  uploadFile,
  uploadAssetBucket,
  activeScreen,
}) => {
  const [formpayload, setFormPayload] = React.useState<addMetadata>({
    station: "",
    masterAsset: "",
    owner: [],
    category: [],
  });

  const [optionList, setOptionList] = useState<any>([]);
  const [userOption, setUserOption] = useState<any>([]);
  const [categoryOption, setCategoryOption] = useState<any>([]);
  const [masterAssetOption, setMasterAssetOption] = useState<any>([]);
  const [isNext, setNextButton] = useState<boolean>(false);
  const [stationDisable, setStationDisable] = useState<boolean>(false);
  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const categories: any = useSelector(
    (state: RootState) => state.setupConfigurationReducer.categoryInfo
  );
  const stations: any = useSelector(
    (state: RootState) => state.stationReducer.stationInfo
  );
  const dispatch = useDispatch();
  const cookies = new Cookies();

  React.useEffect(() => {
    fetchStation();
    masterAssets();
    dispatch(getUsersInfoAsync());
    dispatch(getAllCategories());
  }, []);

  React.useEffect(() => {
    fetchUser();
    fetchCategory();
  }, [users, categories, stations]);

  React.useEffect(() => {
    if (formpayload.category.length == 0) {
      setNextButton(false);
    } else {
      formpayload.category.forEach((index: any) => {
        if (index.form.length == 0) {
          setNextButton(false);
        } else {
          setNextButton(true);
        }
      });
    }
  }, [formpayload]);

  React.useEffect(() => {
    let checkSubmitType: any = uploadAssetBucket.filter(
      (x: any) => x.evidence.masterAsset.assetName === formpayload.masterAsset
    );

    if (checkSubmitType.length != 0) {
      var assetName: string = "";
      var station: string = "";
      var categoryData: any = [];
      var owners: any = [];
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
      let a = optionList
        .filter((x: any) => station == x.value)
        .forEach((x: any) => {
          stationString = x.value;
        });

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
    } else if (checkSubmitType.length == 0) {
      setStationDisable(false);
      setFormPayload({ ...formpayload, category: [], station: "", owner: [] });
    }
  }, [formpayload.masterAsset]);

  let displayIdIndex = uploadFile[0].uploadedFileName.lastIndexOf(".");
  let displayText = uploadFile[0].uploadedFileName.substring(0, displayIdIndex);
  useEffect(() => {
    setFormPayload({ ...formpayload, masterAsset: displayText });
  }, [uploadFile]);

  const fetchStation = async () => {
    const res = await fetch(STATION_INFO_DATA_PERMISSION_GET_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json", TenantId: "1" },
    });
    var response = await res.json();
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
    if (users && users.length > 0) {
      var userNames = users.map((user: any) => {
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
        };
        return j;
      });
    }
    sendCategoryOptionList(categoryName);
  };

  const sendCategoryOptionList = (data: any[]) => {
    const dateOfArry: any = [];
    data?.forEach((item, index) => {
      dateOfArry.push({
        id: item.categoryId,
        label: item.categoryName,
        form: item.categroyForm,
      });
    });

    return setCategoryOption(dateOfArry);
  };

  const checkAssetType = (assetType: string) => {
    var answer: string = "";
    switch (assetType) {
      case ".mp4":
      case ".mp3":
      case ".avi":
      case ".mkv":
        answer = "Video";
        break;

      case ".mp3":
      case ".wma":
      case ".aac":
        answer = "Audio";
        break;

      case ".jpeg":
      case ".png":
      case ".gif":
      case ".tiff":
      case ".psd":
      case ".ai":
        answer = "Image";
        break;

      case ".wmv":
        answer = "WMV_Video";
        break;

      case ".doc":
        answer = "WordDoc";
        break;

      case ".pdf":
        answer = "PDFDoc";
        break;

      case ".txt":
        answer = "Text";
        break;

      case ".zip":
      case ".rar":
        answer = "Zip";
        break;

      case ".xlsx":
      case ".xlsm":
      case ".xlsb":
      case ".xltx":
      case ".xltm":
      case ".xml":
        answer = "ExcelDoc";
        break;

      case ".ppt":
        answer = "PowerPointDoc";
        break;

      case ".icm":
        answer = "AvenueSource";
        break;

      case ".dll":
        answer = "DLL";
        break;

      case ".exe":
        answer = "Exe";
        break;

      case ".msi":
        answer = "Msi";
        break;
      case ".bin":
        answer = "bin";
        break;

      default:
        answer = "Others";
    }
    return answer
  };
  const currentStartDate = () => {
    var currentDate = new Date();
    var mm = "" + (currentDate.getMonth() + 1);
    var dd = "" + currentDate.getDate();
    var yyyy = currentDate.getFullYear();

    if (mm.length < 2) mm = "0" + mm;
    if (dd.length < 2) dd = "0" + dd;
    return [yyyy, mm, dd].join("-") + "T00:00:00" + ".537Z";
  };

const insertCategory = (payloadCategory: any) => {
  const categoryArrayIndex = new Array();
  payloadCategory.forEach((catIndexs: any, i: any) => {
      if (catIndexs.form.length != 0) {
        catIndexs.form.forEach((formIndex: any) =>
          formIndex.fields.forEach((index: any) => {
            let j = {
              formId: index.id,
              fields: [
                {
                  fieldId: index.id,
                  key: "Button",
                  value: index.name,
                  datatype: index.type,
                  version: "",
                },
              ],
            };

            categoryArrayIndex[i] = { id: catIndexs.id, formData: [j] };
          })
        );
      } else {
        categoryArrayIndex[i] = { id: catIndexs.id, formData: [] };
      }
    });
    return categoryArrayIndex
    
}


  const onAddMetaData = () => {
    const categories = insertCategory(formpayload.category);
     
    const uploadedFile = uploadFile.map((index: any) => {
      let masterAssetValueIndex = index.uploadedFileName.lastIndexOf(".");
      let name = index.uploadedFileName;
      let extension = index.uploadedFileName.substring(
        masterAssetValueIndex,
        name.length
      );

      return {
        id: index.uploadedFileId,
        name: index.uploadedFileName.substring(0, masterAssetValueIndex),
        typeOfAsset: checkAssetType(extension),
        status: "Available",
        state: "Normal",
        unitId: 20,
        isRestrictedView: true,
        duration: 0,
        recording: {
          started: currentStartDate(),
          ended: currentStartDate(),
        },
        buffering: {
          pre: 20,
          post: 20,
        },
        audioDevice: "Youraudio",
        camera: "Yourcam",
        isOverlaid: true,
        recordedByCSV: "Alice",
      };
    });

    const asset = uploadedFile.find(
      (x: any) => x.name === formpayload.masterAsset
    );
    let master: any = {};

    if (asset != undefined) {
      const files: masterAssetFile = {
        id: 0,
        assetId: 0,
        filesId: 10002,
        name: asset.name,
        type: asset.typeOfAsset,
        extension: "mp4",
        url: "www.hdc.com",
        size: 430,
        duration: 10,
        recording: {
          started: currentStartDate(),
          ended: currentStartDate(),
        },
        sequence: 0,
        checksum: {
          checksum: "bc527343c7ffc103111f3a694b004e2f",
          status: true,
          algorithm: "SHA-257",
        },
        version: "",
      };

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
          started: currentStartDate(),
          ended: currentStartDate(),
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
        files: [files],
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
          started: currentStartDate(),
          ended: currentStartDate(),
        },
        buffering: {
          pre: childAsset.buffering.pre,
          post: childAsset.buffering.post,
        },
        bookMarks: [],
        notes: [],
        audioDevice: childAsset.audioDevice,
        camera: childAsset.camera,
        isOverlaid: childAsset.isOverlaid,
        recordedByCSV: childAsset.recordedByCSV,
      };
    });

    const station = optionList.find(
      (x: any) => x.value === formpayload.station
    );
    const stationId: masterAssetStation = {
      CMTFieldValue: station ? +station.id : 5,
    };

    const retentionPolicyId: retentionPolicyId = {
      CMTFieldValue: 1,
    };

    return {
      categories,
      assets: { master, children },
      retainUntil: "2020-07-25T12:35:28.537Z",
      stationId,
      retentionPolicyId,
      computerAidedDispatch: "911",
      tag: "Crime Scene",
      version: "",
    };
  };


  const onAdd = async () => {
    const payload = onAddMetaData();
    await fetch(EVIDENCE_ASSET_DATA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        TenantId: "1",
        Authorization: `Bearer ${cookies.get("access_token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.ok) {
          onClose();
          setAddEvidence(true);
        }
      })
      .catch(function (error) {
        return error;
      });
  };

  const setEditPayload = () => {
    const masterDataArray: any = [];
    const ownerDataArray: any = [];
    const categoryDataArray: any = [];
    let assetBucketData: any = uploadAssetBucket.filter(
      (x: any) => x.evidence.masterAsset.assetName === formpayload.masterAsset
    );
    assetBucketData.forEach((index: any) => {
      index.categories.forEach((categoryIndex: any) => {
        categoryDataArray.push(categoryIndex);
      });
      index.evidence.asset.forEach((x: any) => {
        if (x.assetName === formpayload.masterAsset) {
          masterDataArray.push(x);
        }
        masterDataArray.forEach((o: any) => {
          o.owners.forEach((ownerIndex: any) => {
            ownerDataArray.push(ownerIndex);
          });
        });
      });
    });

    //category that are recently added
    let formpayloadCategory: any = [];
    formpayload.category.forEach((x: any) => {
      formpayloadCategory.push(x.label);
    });

    const categoriesPayload: any = [];
    const b = formpayloadCategory.filter(
      (element: any) => !categoryDataArray.includes(element)
    );
    categoryOption.forEach((x: any) => {
      b.forEach((index: any) => {
        if (index == x.label) {
          categoriesPayload.push(x);
        }
      });
    });

    const owners: any = [];
    formpayload.owner.forEach((owner: any) => {
      owners.push({
        CMTFieldValue: owner.id,
      });
    });

    const children = new Array();
    let master: any = {};
    let masterAssetType: any = uploadAssetBucket.filter(
      (x: any) => x.evidence.masterAsset.assetName === formpayload.masterAsset
    );
    masterAssetType.forEach((index: any) => {
      let j = {
        id: index.evidence.masterAsset.assetId,
        name: index.evidence.masterAsset.assetName,
        typeOfAsset: index.evidence.masterAsset.assetType,
        status: index.evidence.masterAsset.status,
        state: index.evidence.masterAsset.state,
        unitId: 20,
        isRestrictedView: index.evidence.masterAsset.isRestrictedView,
        duration: index.evidence.masterAsset.duration,
        recording: {
          started: currentStartDate(),
          ended: currentStartDate(),
        },
        buffering: {
          pre: index.evidence.masterAsset.preBuffer,
          post: index.evidence.masterAsset.postBuffer,
        },
        owners,
        bookMarks: [],
        notes: [],
        audioDevice: index.evidence.masterAsset.audioDevice,
        camera: index.evidence.masterAsset.camera,
        isOverlaid: index.evidence.masterAsset.isOverlaid,
        recordedByCSV: "Alice",
      };
      master = j;
    });

    const asset = masterAssetType.map((index: any) => {
      return index.evidence.asset.filter(
        (x: any) => x.assetName != formpayload.masterAsset
      );
    });
    asset.forEach((index: any, counter: any) => {
      index.forEach((i: any) => {
        let j = {
          id: i.assetId,
          name: i.assetName,
          typeOfAsset: i.assetType,
          status: i.status,
          state: i.state,
          unitId: 20,
          isRestrictedView: i.isRestrictedView,
          duration: i.duration,
          recording: {
            started: currentStartDate(),
            ended: currentStartDate(),
          },
          buffering: {
            pre: i.preBuffer,
            post: i.postBuffer,
          },

          bookMarks: [],
          notes: [],
          audioDevice: i.audioDevice,
          camera: i.camera,
          isOverlaid: i.isOverlaid,
          recordedByCSV: "Alice",
        };
        children[counter] = j;
        counter++;
      });
    });

    // newly uploaded file in seprate array
    const uploadedFile = uploadFile.map((index: any) => {
      let masterAssetValueIndex = index.uploadedFileName.lastIndexOf(".");
      let name = index.uploadedFileName;
      let extension = index.uploadedFileName.substring(
        masterAssetValueIndex,
        name.length
      );

      return {
        id: 0,
        name: index.uploadedFileName.substring(0, masterAssetValueIndex),
        typeOfAsset: checkAssetType(extension),
        status: "Available",
        state: "Normal",
        unitId: 20,
        isRestrictedView: true,
        duration: 0,
        recording: {
          started: "2020-07-25T12:35:28.537Z",
          ended: "2020-07-25T12:35:28.537Z",
        },
        buffering: {
          pre: 20,
          post: 20,
        },
        bookMarks: [],
        notes: [],
        owners: [
          {
            cmtFieldValue: 1,
          },
        ],
        audioDevice: "Youraudio",
        camera: "Yourcam",
        isOverlaid: true,
        recordedByCSV: "Alice",
      };
    });

    const station = optionList.find(
      (x: any) => x.value === formpayload.station
    );
    const stationId: masterAssetStation = {
      CMTFieldValue: station ? +station.id : 5,
    };

    const retentionPolicyId: retentionPolicyId = {
      CMTFieldValue: 1,
    };
    // category included in formpayload
    const prevCategoriesPayloads: any = [];
    const payloadCategory = formpayloadCategory.filter((element: any) =>
      categoryDataArray.includes(element)
    );

    categoryOption.forEach((x: any) => {
      payloadCategory.forEach((index: any) => {
        if (index == x.label) {
          prevCategoriesPayloads.push(x);
        }
      });
    });

   const categories =  insertCategory(prevCategoriesPayloads)

    // formatted data for posting the recently added category
    let formCategory: any = {};
    let assignedCategories: any = [];
    if (categoriesPayload.length != 0 && categoriesPayload) {
      categoriesPayload.forEach((catIndex: any, i: any) => {
        if (catIndex.form.length != 0) {
          catIndex.form.forEach((formIndex: any) =>
            formIndex.fields.forEach((index: any) => {
              let j = {
                formId: +index.id,
                fields: [
                  {
                    id: +index.id,
                    key: "Button",
                    value: index.name,
                    datatype: index.type,
                    version: "",
                  },
                ],
              };
              assignedCategories.push({
                id: +catIndex.id,
                formData: [j],
              });
              formCategory = {
                unAssignCategories: [],
                assignedCategories,
                assignedOn: "2022-05-16T08:51:06.608Z",
                updateCategories: [],
              };
            })
          );
        } else {
          assignedCategories.push({
            id: +catIndex.id,
            formData: [],
          });
          formCategory = {
            unAssignCategories: [],
            assignedCategories,
            assignedOn: "2022-05-16T08:51:06.608Z",
            updateCategories: [],
          };
        }
      });
    }

    const payload = {
      categories,
      assets: { master, children },
      retainUntil: "2020-07-25T12:35:28.537Z",
      stationId,
      retentionPolicyId,
      computerAidedDispatch: "911",
      tag: "Crime Scene",
      version: "",
    };
    return [payload, uploadedFile, owners, formCategory];
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
      body: JSON.stringify(payload[1]),
    }).then(function (res) {
      if (res.status == 200) {
        if (payload[3].length != 0 && Object.keys(payload[3]).length != 0) {
          let urlAddCategories =
            EVIDENCE_ASSET_DATA_URL + "/" + ids + "/Categories";
          fetch(urlAddCategories, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              TenantId: "1",
              Authorization: `Bearer ${cookies.get("access_token")}`,
            },
            body: JSON.stringify(payload[3]),
          }).then(function (res) {
            return res.status;
          });
        }

        let urlUpdate = EVIDENCE_ASSET_DATA_URL + "/" + ids;
        fetch(urlUpdate, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            TenantId: "1",
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
          body: JSON.stringify(payload[0]),
        }).then(function (response) {
          return response.json();
        });
      }
      if (res.ok) {
        onClose();
        setAddEvidence(true);
      }
    });
  };

  const onSubmit = async (e: any) => {
    var ids: number = 0;
    var assetId: number = 0;
    debugger;
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
      await onAdd();
    }
  };

  const categoryDropdownOnChangeHandler = (
    event: React.SyntheticEvent,
    value: string[]
  ) => {
    event.isDefaultPrevented();
    setFormPayload({ ...formpayload, category: value });
    setNextButton(true);
  };

  const handleActiveScreen = (activeScreen: number) => {
    switch (activeScreen) {
      case 0:
        return (
          <>
            <div className="CrxCreateUser">
              <div className="CrxIndicates">
                <sup>*</sup> Indicates required field
              </div>
            </div>
            <div className="metaData-masterAsset">
              <div className="metaData-inner-masterAsset">
                <label>
                  Master Asset <span>*</span>
                </label>
                <CRXSelectBox
                  className={`metaData-Station-Select ${
                    formpayload.masterAsset === "" ? "" : "gepAddClass"
                  }`}
                  id={"select_" + "selectBox"}
                  defaultOptionText="Select Master Asset"
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
            <div className="metaData-station">
              <div
                className={`metaData-inner ${
                  formpayload.station === "" ? "" : "gepAddClass"
                }`}
              >
                <label>
                  Station <span>*</span>
                </label>
                <CRXSelectBox
                  className="metaData-Station-Select"
                  id={"select_" + "selectBox"}
                  value={formpayload.station === "" ? "" : formpayload.station}
                  disabled={stationDisable ? true : false}
                  onChange={(e: any) =>
                    setFormPayload({ ...formpayload, station: e.target.value })
                  }
                  defaultOptionText=""
                  options={optionList}
                  defaultValue=""
                />
              </div>
            </div>
            <div className="metaData-category">
              <CRXMultiSelectBoxLight
                className="categortAutocomplete CRXmetaData-owner"
                label="Owner(s)"
                placeHolder=""
                multiple={true}
                CheckBox={true}
                required={true}
                options={userOption}
                value={formpayload.owner}
                autoComplete={false}
                isSearchable={true}
                onChange={(e: React.SyntheticEvent, value: string[]) => {
                  setFormPayload({ ...formpayload, owner: value });
                }}
              />
            </div>
            <div className="metaData-category">
              <CRXMultiSelectBoxLight
                className="categortAutocomplete CRXmetaData-category"
                placeHolder=""
                label="Category"
                multiple={true}
                CheckBox={true}
                options={categoryOption}
                value={formpayload.category}
                autoComplete={false}
                isSearchable={true}
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
            {formpayload.category.some((o: any) => o.form.length > 0) ? (
              formpayload.category.map((obj: any) => (
                <CategoryFormOFAssetBucket categoryObject={obj} />
              ))
            ) : (
              <NoFormAttachedOfAssetBucket
                categoryCollection={formpayload.category}
              />
            )}
          </>
        );
    }
  };
  return (
    <div className="metaData-Station-Parent">
      {handleActiveScreen(activeScreen)}
      <div className="crxFooterEditFormBtn">
        {!isNext ? (
          <CRXButton className="primary" onClick={onSubmit}>
            Save
          </CRXButton>
        ) : (
          <CRXButton className="primary" onClick={onSubmit}>
            Next
          </CRXButton>
        )}
        <CRXButton className="secondary" onClick={onClose}>
          Cancel
        </CRXButton>
      </div>
    </div>
  );
};

export default AddMetadataForm;
