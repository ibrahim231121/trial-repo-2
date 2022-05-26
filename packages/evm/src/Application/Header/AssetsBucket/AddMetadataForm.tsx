import { url } from "inspector";
import React, { useContext, useRef, useState } from "react";
import { STATION_INFO_GET_URL } from "../../../utils/Api/url";
import { useDispatch, useSelector } from "react-redux";
import { addNotificationMessages } from "../../../Redux/notificationPanelMessages";
import { CRXToaster, CRXSelectBox, CRXMultiSelectBoxLight } from "@cb/shared";
import ApplicationPermissionContext from "../../../ApplicationPermission/ApplicationPermissionContext";
import { RootState } from "../../../Redux/rootReducer";
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import { getAllCategories } from "../../../Redux/SetupConfigurationReducer";
import { CRXButton } from "@cb/shared";
import CategoryFormOFAssetBucket from "./SubComponents/CategoryFormOFAssetBucket";
import NoFormAttachedOfAssetBucket from "./SubComponents/NoFormAttachedOfAssetBucket";

interface Props {
  onClose: any;
  setCloseWithConfirm: any;
  // onSave: any;
  uploadFile: any;
  uploadAssetBucket: any;
  activeScreen: number;
  setNextButton: (param: boolean) => void;
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
}

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
  masterAsset: string;
}

const AddMetadataForm: React.FC<Props> = ({
  onClose,
  setCloseWithConfirm,
  setNextButton,
  // onSave,
  uploadFile,
  uploadAssetBucket,
  activeScreen
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
  const users: any = useSelector(
    (state: RootState) => state.userReducer.usersInfo
  );
  const category: any = useSelector(
    (state: RootState) => state.setupConfigurationReducer.categoryInfo
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    fetchStation();
    masterAssets();
    dispatch(getUsersInfoAsync());
    dispatch(getAllCategories());
  }, []);

  React.useEffect(() => {
    fetchUser();
    fetchCategory();
  }, [users, category]);

  React.useEffect(() => {
    if (formpayload.category.length == 0) {
      setNextButton(false);
    } else {
      formpayload.category.map((index: any) => {
        if (index.form.length == 0) {
          setNextButton(false);
        } else {
          setNextButton(true);
        }
      });
    }
  }, [formpayload]);

  const fetchStation = async () => {
    const res = await fetch(STATION_INFO_GET_URL, {
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
        value: x.assetName
      };
      return j;
    })
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
    data?.map((item, index) => {
      dateOfArry.push({
        id: item.userid,
        label: item.userName,
      });
    });
    return setUserOption(dateOfArry);
  };

  const fetchCategory = () => {
    if (category && category.length > 0) {
      var categoryName = category.map((category: any) => {
        let j: CategoryNameAndValue = {
          categoryId: category.id,
          categoryName: category.name,
          categroyForm: category.forms,
        };
        return j;
      });
    }
    sendCategoryOptionList(categoryName);
  };

  const sendCategoryOptionList = (data: any[]) => {
    const dateOfArry: any = [];
    data?.map((item, index) => {
      dateOfArry.push({
        id: item.categoryId,
        label: item.categoryName,
        form: item.categroyForm,
      });
    });
    return setCategoryOption(dateOfArry);
  };

  let displayIdIndex = uploadFile[0].uploadedFileName.lastIndexOf(".");
  let displayText = uploadFile[0].uploadedFileName.substring(0, displayIdIndex);

  const categoryDropdownOnChangeHandler = (event: React.SyntheticEvent, value: string[]) => {
    event.isDefaultPrevented();
    setFormPayload({ ...formpayload, category: value });
    setNextButton(true);
  }

  const handleActiveScreen = (activeScreen: number) => {
    console.log('formpayload', formpayload.category);
    switch (activeScreen) {
      case 0:
        return (
          <>
            <div className="CrxCreateUser">
              <div className='CrxIndicates'>
                <sup>*</sup> Indicates required field
              </div>
            </div>
            <div className="metaData-masterAsset">
              <div className="metaData-inner-masterAsset">
                <label>Master Asset <span>*</span></label>
                <CRXSelectBox
                  className={`metaData-Station-Select ${formpayload.masterAsset === "" ? "" : "gepAddClass"}`}
                  id={"select_" + "selectBox"}
                  defaultOptionText="Select Master Asset"
                  disabled={uploadFile.length == 1 && uploadAssetBucket.length == 0 ? true : false}
                  value={
                    formpayload.masterAsset === ""
                      ? displayText
                      : formpayload.masterAsset
                  }
                  onChange={(e: any) =>
                    setFormPayload({ ...formpayload, masterAsset: e.target.value })
                  }
                  options={masterAssetOption}
                  defaultValue=""
                />
              </div>
            </div>
            <div className="metaData-station">
              <div className={`metaData-inner ${formpayload.station === "" ? "" : "gepAddClass"}`}>
                <label>Station <span>*</span></label>
                <CRXSelectBox
                  className="metaData-Station-Select"
                  id={"select_" + "selectBox"}
                  value={
                    formpayload.station === ""
                      ? ""
                      : formpayload.station
                  }
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
                onChange={(e: React.SyntheticEvent, value: string[]) => categoryDropdownOnChangeHandler(e, value)}
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            {formpayload.category.some((o: any) => o.form.length > 0)
              ?
              formpayload.category.map((obj: any) => (
                <CategoryFormOFAssetBucket categoryObject={obj} />
              ))
              :
              <NoFormAttachedOfAssetBucket categoryCollection={formpayload.category} />}
          </>
        );
    }
  }
  return (
    <div className="metaData-Station-Parent">
      {handleActiveScreen(activeScreen)}
    </div>
  );
};

export default AddMetadataForm;

