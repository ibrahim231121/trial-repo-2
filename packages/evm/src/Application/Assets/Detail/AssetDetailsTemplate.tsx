import React, { useEffect } from "react";
import { CRXTabs, CrxTabPanel, CRXRows, CRXColumn } from "@cb/shared";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "./assetDetailTemplate.scss";
import ActionMenu, { AssetBucket } from "../AssetLister/ActionMenu";
import Restricted from "../../../ApplicationPermission/Restricted";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { addAssetToBucketActionCreator } from "../../../Redux/AssetActionReducer";
import FormContainer from "../AssetLister/Category/FormContainer";
import useGetFetch from "../../../utils/Api/useGetFetch";
import { EVIDENCE_SERVICE_URL } from "../../../utils/Api/url";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import moment from "moment";

const AssetDetailsTemplate = (props: any) => {
  const historyState = props.location.state;
  let evidenceId: number = historyState.evidenceId;
  let assetId: string = historyState.assetId;
  let assetName: string = historyState.assetName;

  type EvidenceReformated = {
    id: number;
    categories: string[];

    assetId: string;
    assetName: string;
    assetType: string;
    recordingStarted: string;
  };

  let evidenceObj: EvidenceReformated = {
    id: evidenceId,
    categories: [],

    assetId: assetId,
    assetName: "",
    assetType: "",
    recordingStarted: "",
  };

  type AssetReformated = {
    categories: string[];
    owners: string[];
    unit: number[];
    capturedDate: string;
    checksum: number[];
    duration: string;
    size: number[];
    retention: string;
    categoriesForm: string[];
  };
  let assetObj: AssetReformated = {
    categories: [],
    owners: [],
    unit: [],
    capturedDate: "",
    checksum: [],
    duration: "",
    size: [],
    retention: "",
    categoriesForm: [],
  };
  const dispatch = useDispatch();
  let addToAssetBucketDisabled: boolean = false;
  const assetBucketData: AssetBucket[] = useSelector(
    (state: RootState) => state.assetBucket.assetBucketData
  );

  const [value, setValue] = React.useState(0);
  const [evidence, setEvidence] =
    React.useState<EvidenceReformated>(evidenceObj);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [isCategoryEmpty, setIsCategoryEmpty] = React.useState<boolean>(true);
  const [assetInfo, setAssetData] = React.useState<AssetReformated>(assetObj);
  const [openForm, setOpenForm] = React.useState(false);
  const handleChange = () => {
    setOpenForm(true);
  };

  const [getResponse, res] = useGetFetch<any>(
    EVIDENCE_SERVICE_URL + "/Evidences/" + evidenceId + "/Assets/" + assetId,
    {
      "Content-Type": "application/json",
      TenantId: "1",
    }
  );
  const [getEvidenceCategoriesResponse, evidenceCategoriesResponse] =
    useGetFetch<any>(
      EVIDENCE_SERVICE_URL + "/Evidences/" + evidenceId + "/Categories",
      {
        "Content-Type": "application/json",
        TenantId: "1",
      }
    );
  const [assetData, getAssetData] = useGetFetch<any>(
    EVIDENCE_SERVICE_URL + "/Evidences/" + "2",
    {
      "Content-Type": "application/json",
      TenantId: "1",
    }
  );
  useEffect(() => {
    getResponse();
    assetData();
    getEvidenceCategoriesResponse();
    dispatch(enterPathActionCreator({ val: "Asset Detail: " + assetName }));
  }, []);

  function tabHandleChange(event: any, newValue: number) {
    setValue(newValue);
  }
  useEffect(() => {
    if (res !== undefined) {
      setEvidence({
        ...evidence,
        assetName: res.name,
        assetType: res.typeOfAsset,
      });
    }
  }, [res]);

  useEffect(() => {
    if (evidenceCategoriesResponse !== undefined) {
      var categories: string[] = [];
      evidenceCategoriesResponse.map((x: any) =>
        x.formData.map((y: any) =>
          y.fields.map((z: any) => {
            categories.push(z.value);
          })
        )
      );

      if (categories?.length > 0) {
        setIsCategoryEmpty(false);
      } else {
        setIsCategoryEmpty(true);
      }

      setEvidence({ ...evidence, categories: categories });
     
    }
  }, [evidenceCategoriesResponse]);

  useEffect(() => {
    if (getAssetData !== undefined) {
      var categories: string[] = [];
      getAssetData.categories.map((x: any) =>
        x.formData.map((y: any) =>
          y.fields.map((z: any) => {
            categories.push(z.key);
          })
        )
      );

      var owners:any= [];
      owners.push(getAssetData.assets.master.owners);
      var ownerSeparated = owners.join(",");

      var unit: number[] = [];
      unit.push(getAssetData.assets.master.unitId);

      var checksum: number[] = [];
      getAssetData.assets.master.files.map((x: any) => {
        checksum.push(x.checksum.checksum);
      });

      var duration: number[] = [];
      duration.push(getAssetData.assets.master.duration);

      var size: number[] = [];
      getAssetData.assets.master.files.map((x: any) => {
        size.push(x.size);
      });
      
     
      var categoriesForm: string[] = [];
      getAssetData.categories.map((x: any) => {
        categoriesForm.push(x.record.cmtFieldName);
      });

      setAssetData({
        ...assetInfo,
        owners: ownerSeparated,
        unit: unit,
        capturedDate: moment(getAssetData.createdOn).format(
          "YYYY / MM / DD HH:mm:ss"
        ),
        checksum: checksum,
        duration: moment
          .utc(getAssetData.assets.master.duration)
          .format("h:mm"),
        size: size,
        retention: moment(getAssetData.retainUntil).format(
          "YYYY / MM / DD HH:mm:ss"
        ),
        categories: categories,
        categoriesForm: categoriesForm,
      });
    }
  }, [getAssetData]);
 

  const tabs = [
    { label: "Information", index: 0 },
    { label: "Map", index: 1 },
    { label: "Related Assets", index: 2 },
  ];
  
  const addToAssetBucket = () => {
    //if undefined it means header is clicked
    if (evidence !== undefined && evidence !== null) {
      const find = selectedItems.findIndex(
        (selected: any) => selected.id === evidence.id
      );
      const data = find === -1 ? evidence : selectedItems;
      dispatch(addAssetToBucketActionCreator(data));
    } else {
      dispatch(addAssetToBucketActionCreator(selectedItems));
    }
  };


  return (
    <div style={{ marginTop: "120px" }}>
      <p style={{ marginLeft: 50 }}>
        <h5>Captured Date : {assetInfo.capturedDate}</h5>
        <h5>Categories : {assetInfo.categoriesForm}</h5>
      </p>

      <div className="CRXAssetDetail">
        <FormContainer
          setOpenForm={() => setOpenForm(false)}
          openForm={openForm}
          rowData={evidence}
          isCategoryEmpty={isCategoryEmpty}
          setIsCategoryEmpty={() => setIsCategoryEmpty(true)}
        />

        <Menu
          align="start"
          viewScroll="initial"
          direction="bottom"
          position="auto"
          arrow
          menuButton={
            <MenuButton>
              <i className="fas fa-ellipsis-h"></i>
            </MenuButton>
          }
        >
          <MenuItem>
            <Restricted moduleId={0}>
              <div
                className="crx-meu-content groupingMenu crx-spac"
                onClick={addToAssetBucket}
              >
                <div className="crx-menu-icon"></div>
                <div
                  className={
                    addToAssetBucketDisabled === false
                      ? "crx-menu-list"
                      : "crx-menu-list disabledItem"
                  }
                >
                  Add to asset bucket
                </div>
              </div>
            </Restricted>
          </MenuItem>
          {isCategoryEmpty === false ? (
            <MenuItem>
              <Restricted moduleId={3}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">Edit Category and Form</div>
                </div>
              </Restricted>
            </MenuItem>
          ) : (
            <MenuItem>
              <Restricted moduleId={2}>
                <div className="crx-meu-content" onClick={handleChange}>
                  <div className="crx-menu-icon">
                    <i className="far fa-clipboard-list fa-md"></i>
                  </div>
                  <div className="crx-menu-list">Categorize</div>
                </div>
              </Restricted>
            </MenuItem>
          )}
        </Menu>

        {/* <CBXLink  children = "Exit"   onClick={() => history.goBack()} /> */}
      </div>
      <div></div>

      <CRXRows
        container
        spacing={0}
        style={{ marginTop: "50px", marginRight: "50px" }}
      >
        <CRXColumn item xs={6}>
          <div
            style={{
              marginLeft: "80px",
              marginRight: "80px",
              backgroundColor: "black",
              height: "70vh",
              color: "white",
              textAlign: "center",
            }}
          >
            Video Player Container
          </div>
        </CRXColumn>
        <CRXColumn item xs={4} className="topColumn">
          <div className="tabCreateTemplate">
            <CRXTabs value={value} onChange={tabHandleChange} tabitems={tabs} />
            <div className="tctContent">
              <CrxTabPanel value={value} index={0}>
                <div className="tctown">
                  <h1>Owners :</h1> <span>{assetInfo.owners}</span>
                </div>
                <div className="tctown">
                  <h1>Unit :</h1> <span>{assetInfo.unit}</span>
                </div>
                <div className="tctown">
                  <h1>CheckSum :</h1> <span>{assetInfo.checksum}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>Video Duration :</h1> <span>{assetInfo.duration}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>Size : </h1> <span>{assetInfo.size} MB</span>
                </div>
                <div className="tctown">
                  <h1>Retention :</h1>
                  <span>{assetInfo.retention}</span>{" "}
                </div>
                <div className="tctown">
                  <h1>Categories :</h1> <span>{assetInfo.categories}</span>
                </div>
              </CrxTabPanel>
              <CrxTabPanel value={value} index={1}>
                <div>Map</div>
              </CrxTabPanel>

              <CrxTabPanel value={value} index={2}>
                <div>Test</div>
              </CrxTabPanel>
            </div>
          </div>
        </CRXColumn>
      </CRXRows>
    </div>
  );
};

export default AssetDetailsTemplate;
