import { FC, useEffect, useRef, useState } from "react";
import { CRXMultiSelectBoxLight, CRXButton, CRXTruncation, CRXAlert, CRXCheckBox } from "@cb/shared";
import { useTranslation } from 'react-i18next';
import './AssignToCase.scss';
import moment from "moment";
import { CasesAgent } from '../../../../utils/Api/ApiAgent';
import { CASE_ASSET_TYPE, TCaseAsset } from "../../../Cases/CaseTypes";
import { AssetThumbnail } from "../AssetDataTable/AssetThumbnail";
import { AssetDetailRouteStateType } from "../AssetDataTable/AssetDataTableModel";
import { Link } from "react-router-dom";
import { SearchModel } from "../../../../utils/Api/models/SearchModel";
import { urlList, urlNames } from "../../../../utils/urlList";
import { useDispatch } from "react-redux";
import { setLoaderValue } from "../../../../Redux/loaderSlice";
import { formatString, getAssetTypeEnumValue, getCaseIdOpenedForEvidence, getChildAssetsSequenceNumber, getMaxCaseAssetSequenceNumber } from "../../../Cases/utils/globalFunctions";
import { CheckEvidenceExpire } from "../../../../GlobalFunctions/CheckEvidenceExpire";
import { resetRelatedAsset } from "../../../../Redux/FilteredRelatedAssetsReducer";

type AssignToCasePropType = {
    selectedItems: any[],
    rowData: any,
    isCaseOpenedForEvidence?: boolean,
    selectedCaseData?: any,
    showToastMsg?: (obj: any) => void,
    onClose: (refreshGrid?: boolean) => void
}

type AutoCompleteOptionType = {
    label?: string;
    id: number;
}

type PredictiveSearchCaseIdsType = {
    recId: number,
    title: string
}

const AssignToCase: FC<AssignToCasePropType> = (props) => {

    const [caseIdAutoCompleteOptions, setCaseIdAutoCompleteOptions] = useState<AutoCompleteOptionType[]>([]);
    const [selectedCaseId, setSelectedCaseId] = useState<AutoCompleteOptionType>({id: 0, label: ""});
    const [inputValue, setInputValue] = useState<string>("");
    const [showAdditionalAssets, setShowAdditionalAssets] = useState(false);
    const [showAssetsAlreadyExists, setShowAssetsAlreadyExists] = useState(false);
    const [selectedCaseData, setSelectedCaseData] = useState<any>(null);
    const [, setUpdateState] = useState<boolean>(false);

    const predictiveSearchTimeoutRef = useRef<number>(0);
    const predictiveSearchItemsRef = useRef<any>([]);
    const selectedAssetsRef = useRef<any[]>(props.selectedItems);
    const alreadyExistAssetsRef = useRef<any[]>([]);
    const availableAssetsRef = useRef<any[]>([]);
    const isFirstRenderRef = useRef<boolean>(true);

    const { t } = useTranslation<string>();
    const dispatch = useDispatch();

    useEffect(() => {
        if(isFirstRenderRef.current == false )
            checkAssetsAlreadyTagged();
    }, [selectedCaseData])

    useEffect(() => {
        isFirstRenderRef.current = false;
        if(props.isCaseOpenedForEvidence === true) {
            const caseOpenedForEvidence = getCaseIdOpenedForEvidence();
            if(caseOpenedForEvidence != null) {
                const caseId = parseInt(caseOpenedForEvidence.id);
                if(caseId > 0) {
                    setSelectedCaseId({id: caseId, label: caseOpenedForEvidence.title});
                    setSelectedCaseData(props.selectedCaseData);
                }   
            }
        }
    }, [])

    const getPredictiveCaseIds = (value: string) => {
        CasesAgent.getPredictiveCaseIds(value)
        .then((res: PredictiveSearchCaseIdsType) => {
            if(Array.isArray(res)) {
                predictiveSearchItemsRef.current = res;
                const options = res.map(item => ({
                        id: item.recId,
                        label: item.title
                }))
                setCaseIdAutoCompleteOptions(options);
            }
            else {
                clearSelectedItem();
                setCaseIdAutoCompleteOptions([]);
            }
        });
    }

    const getCaseById = (caseId: number) => {
        CasesAgent.getCase(`/Case/${caseId}`)
        .then(res => {
            if(res != null)
                setSelectedCaseData(res);
            else
                setSelectedCaseData(null);
        })
        .catch(ex => {
            setSelectedCaseData(null);
        });
    }

    const onTagAssetsToCase = (assets: any[]) => {
        if(Array.isArray(assets) && selectedCaseId.id > 0) {
            const selectedAssets = assets.filter(x => x.isSelected === true) ?? [];
            let sequenceNumber = getMaxCaseAssetSequenceNumber(selectedCaseData.caseAssets);
            dispatch(setLoaderValue({isLoading: true}));
            const caseAssetList: TCaseAsset[] = [];
            selectedAssets.forEach((item) => {
                if(!CheckEvidenceExpire(item.evidence)) {
                    sequenceNumber++;
                    let masterAsset: SearchModel.Asset | null = null;
                    const childAssets: SearchModel.Asset[] = [];

                    if(item.evidence && Array.isArray(item.evidence.asset)) {
                        const assets = item.evidence.asset;
                        for(let i = 0; i < assets.length; i++) {
                            if(assets[i].assetId === item.assetId) {
                                masterAsset = assets[i];
                            }
                            else {
                                childAssets.push(assets[i]);
                            }
                        }
                    }

                    if(masterAsset != null) {
                        addAssetToCaseAssetList(item.id, selectedCaseId.id, masterAsset, sequenceNumber.toString(), caseAssetList);
                    }
                    if(Array.isArray(childAssets) && childAssets.length > 0) {
                        childAssets.forEach((obj, idx) => {
                            const formattedSequence = getChildAssetsSequenceNumber((idx + 1).toString(), 3);
                            addAssetToCaseAssetList(item.id, selectedCaseId.id,  obj, sequenceNumber + '_' + formattedSequence, caseAssetList);
                        });
                    }
                }
            });
            if(Array.isArray(caseAssetList) && caseAssetList.length > 0) {
                CasesAgent.tagAssetsToCase(caseAssetList)
                .then(res => {
                    dispatch(setLoaderValue({isLoading: false}));
                    typeof props.showToastMsg === "function" && props.showToastMsg({
                        message: formatString(t("The_selected_assets_have_been_added_to_Case_{0}"), selectedCaseId.label),
                        variant: "success",
                        duration: 5000,
                    });
                    props.onClose(true);
                })
                .catch(ex => {
                    console.log(ex);
                    dispatch(setLoaderValue({isLoading: false}));
                });
            }
            dispatch(resetRelatedAsset()) 
        }
    }

    const addAssetToCaseAssetList = (evidenceId: number, caseId: number, asset: SearchModel.Asset, sequenceNumber: string, caseAssetList: TCaseAsset[]) => {
        caseAssetList.push({
          id: '0',
          caseId: caseId,
          assetId: asset.assetId,
          evidenceId: evidenceId,
          notes: '',
          sequenceNumber: sequenceNumber.toString(),
          assetName: asset.assetName,
          assetType: getAssetTypeEnumValue(asset.assetType) ?? CASE_ASSET_TYPE.Others,
          fileId: asset?.files[0]?.filesId,
          fileName: asset?.files[0]?.fileName ?? "",
          fileType: asset?.files[0]?.type,
        });
      }

    const getSelectedAssetsCountFromAvailableAssets = () => {
        let arr = [];
        if(Array.isArray(availableAssetsRef.current)) {
            arr = availableAssetsRef.current.filter(x => x.isSelected === true) ?? [];
        }
        return Array.isArray(arr) ? arr.length : 0;
    }

    const clearSelectedItem = () => {
        setSelectedCaseData(null);
        setSelectedCaseId({id: 0, label: ""});
        setShowAdditionalAssets(false);
        setShowAssetsAlreadyExists(false);
    }

    const checkAssetsAlreadyTagged = () : boolean => {
        alreadyExistAssetsRef.current = [];
        availableAssetsRef.current = [];
        let existingAssetsCount = 0;
        if(props.rowData != null && Array.isArray(selectedAssetsRef.current)) {
            if(selectedAssetsRef.current.find(x => x.id === props.rowData.id) === undefined) {
                selectedAssetsRef.current.push(props.rowData);
            }
        }
        selectedAssetsRef.current = selectedAssetsRef.current.map((assetItem: any) => {
            const itemCopy = Object.assign({}, assetItem);
            if(selectedCaseData != null && Array.isArray(selectedCaseData.caseAssets)) {
                if(selectedCaseData.caseAssets.find((x: any) => x.assetId === itemCopy.assetId) != null) {
                    itemCopy.isSelected = false;
                    existingAssetsCount++;
                    alreadyExistAssetsRef.current.push(itemCopy);
                }
                else {
                    itemCopy.isSelected = true;
                    availableAssetsRef.current.push(itemCopy);
                }
            }
            return itemCopy;
        });
        if(existingAssetsCount > 0) {
            if(existingAssetsCount === selectedAssetsRef.current.length) {
                setShowAssetsAlreadyExists(true);
            }
            else {
                setShowAdditionalAssets(true);
            }
        }
        return existingAssetsCount > 0;
    }

    const onAddToCaseClick = () => {
        if(checkAssetsAlreadyTagged() == false) {
            onTagAssetsToCase(selectedAssetsRef.current);
        }
    }

    const onCancelClick = () => {
        props.onClose();
    }

    const onChangeCaseId = (e: any, value: any) => {
        e.preventDefault();
        if(value != null && value.id > 0) {
            getCaseById(value.id);
            setSelectedCaseId(value);
        }
        else
            clearSelectedItem();

        setShowAdditionalAssets(false);
        setShowAssetsAlreadyExists(false);
    }

    const onChangeInput = (e: any) => {
        clearTimeout(predictiveSearchTimeoutRef.current);
        if (e && e.target && e.target != null) {
            const { value } = e.target;
            if(value != null) {
                if (value && value.length >= 3 && !value.startsWith("#")) {
                    predictiveSearchTimeoutRef.current = window.setTimeout(() => {
                        getPredictiveCaseIds(value);
                    }, 1000)
                }
                else {
                    setInputValue(value);
                    setCaseIdAutoCompleteOptions([]);
                }
            }
            else {
                setInputValue("");
                clearSelectedItem();
                setCaseIdAutoCompleteOptions([]);
            }
        }
    }

    const onAssetSelectionChange = (e: any, item: any) => {
        const availableAssetsCopy = availableAssetsRef.current.map(item => ({...item}));
        const existingIndex = availableAssetsCopy.findIndex(x => x.id === item.id);
        if(existingIndex > -1) {
            availableAssetsCopy[existingIndex].isSelected = e.target.checked;
        }
        availableAssetsRef.current = availableAssetsCopy;
        setUpdateState(prevState => !prevState);
    }

    const getAssetContent = (item: any, idx: number, isExistingAsset: boolean) => {
        return  <div key={`additionalAssetItem${idx}`} className="additionalAssetSubContainer">
            <div className="additionalAssetCheckbox">
                {
                    isExistingAsset === true ?
                    null :
                    <CRXCheckBox
                        checked={item.isSelected === true && isExistingAsset === false}
                        onChange={(e: any) => onAssetSelectionChange(e, item)}
                        name={item.assetId}
                        lightMode={true}
                        disabled={isExistingAsset}
                    />
                }
            </div>
            <div className="additionalAssetDetail">
                <div className="additionalAssetThumbnail">
                    <AssetThumbnail
                        assetName={item.assetName}
                        assetType={item.assetType}
                        fileType={item?.evidence?.masterAsset?.files[0]?.type}
                        fontSize="61pt"
                    />
                </div>
                <div className="additionalAssetNameContainer">
                    <div className="additionalAssetName">{assetNameTemplate(item.assetName, item.evidence)}</div>
                </div>
            </div>
        </div>
    }

    return (
        <>
            {
                showAssetsAlreadyExists === true ?
                    <div className="assetsAlreadyExistsContent">
                        <div className="assetsAlreadyExistsIcon">
                            <i className="fas fa-exclamation-circle" />
                        </div>
                        <div className="assetsAlreadyExistsText">{ t("The_selected_assets_already_exist_in_the_destination_Case") }</div>
                        <div className="assetsAlreadyExistsModalFooter">
                            <CRXButton
                                className="assetsAlreadyExistsOkButton secondary"
                                color="secondary"
                                variant="outlined"
                                onClick={() => props.isCaseOpenedForEvidence === true ? props.onClose() : setShowAssetsAlreadyExists(false)}
                            >
                                {t("OK")}
                            </CRXButton>
                        </div>
                    </div>
                :
                <div className={`${showAdditionalAssets === true ? 'confirmAdditionalAssetsContainer' : 'assignToCaseContainer'}`}>
                    <div className="assignToCaseContent">
                        <div className={`caseInformationContainer ${showAdditionalAssets === true ? '-additionalAssetsPadding' : ''}`}>
                            <div className="caseId-container">
                                {
                                    props.isCaseOpenedForEvidence === true ?
                                        <>
                                            <label>{t('Case_ID')}</label>
                                            <label style={{marginLeft: '10px'}}>{selectedCaseId.label}</label>
                                        </>
                                    :
                                    <CRXMultiSelectBoxLight
                                        id="CaseId"
                                        className="caseIdAutoComplete"
                                        label= "Case ID"
                                        multiple={false}
                                        value={ selectedCaseId }
                                        options={Array.isArray(caseIdAutoCompleteOptions) ? caseIdAutoCompleteOptions : []}
                                        onChange={(e: any, value: any) => onChangeCaseId(e, value) }
                                        onOpen={(e: any) => {
                                            e.preventDefault();
                                        }}
                                        onInputChange={onChangeInput}
                                        CheckBox={true}
                                        checkSign={false}
                                        required={false}
                                    />
                                }
                            </div>
                            {
                                selectedCaseData != null ?
                                <>
                                <label className="caseInformationHeading">{t('Case_Information')}</label>
                                <div className="caseInformationRow">
                                    <div className="caseInformationContent">
                                        <label>{t('Case_Lead')}:</label>
                                        <label>{selectedCaseData != null ? selectedCaseData.userName : null}</label>
                                    </div>
                                    <div className="caseInformationContent">
                                        <label>{t('Created_On')}:</label>
                                        <label>
                                            {selectedCaseData != null && selectedCaseData.history?.createdOn != null ?
                                                moment(selectedCaseData.history?.createdOn).format("MM/DD/YYYY") : null}
                                        </label>
                                    </div>
                                </div>
                                <div className="caseDescriptionContent">
                                    <label>{t('Case_Description')}:</label>
                                    <label className="caseInformation-caseDescription">
                                        {selectedCaseData != null && selectedCaseData.description != null ?
                                            selectedCaseData.description.plainText : null}
                                    </label>
                                </div>
                                </>
                                : null
                            }                            
                        </div>
                        <div className="assignToCaseModalFooter">
                            <CRXButton
                                className="assignToCaseAddButton"
                                color="primary"
                                variant="contained"
                                onClick={() => showAdditionalAssets === true ? onTagAssetsToCase(availableAssetsRef.current) : onAddToCaseClick()}
                                disabled={!(selectedCaseId.id > 0 && selectedCaseData != null) || !(showAdditionalAssets === true ? getSelectedAssetsCountFromAvailableAssets() > 0 : true)}
                                >
                                {t("Add_To_Case")}
                            </CRXButton>
                            <CRXButton
                                className="assignToCaseCancelButton secondary"
                                color="secondary"
                                variant="outlined"
                                onClick={() => onCancelClick()}
                                >
                                {t("Cancel")}
                            </CRXButton>
                        </div>
                    </div>
                    {
                        showAdditionalAssets === true ?
                        <div className="confirmAdditionalAssetsContent">
                            <label className="additionalAssetsSubHeading">{t('Select_the_additional_assets_you_want_to_add_to_the_case')}</label>
                            <div className="additionalAssetContainer">
                            {
                                alreadyExistAssetsRef.current.map((item: any, idx: number) => (
                                    getAssetContent(item, idx, true)
                                ))
                            }
                            </div>
                            {
                                alreadyExistAssetsRef.current.length > 0 ?
                                <div className="additionalAssetWarningContainer">
                                    <CRXAlert
                                        className="additionalAssetWarningMessage"
                                        message= {t("The_assets_above_already_exists_in_the_destination_case")}
                                        type="info"
                                        alertType="inline"
                                        open={true}
                                        setShowSucess={() => null}
                                        showCloseButton={false}
                                    />
                                </div>
                                : null
                            }
                            <div className="additionalAssetContainer">
                            {
                                availableAssetsRef.current.map((item: any, idx: number) => (
                                    getAssetContent(item, idx, false)
                                ))
                            }
                            </div>
                        </div>
                        : null
                    }
                </div>
            }
        </>   
    )
}

const assetNameTemplate = (assetName: string, evidence: SearchModel.Evidence) => {
    let masterAsset = evidence.masterAsset;
    let assets = evidence.asset.filter(x => x.assetId != masterAsset.assetId);
    let dataLink = 
    <>
      <Link
        className="linkColor"
        to={{
          pathname: urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url,
          state: {
            evidenceId: evidence.id,
            assetId: masterAsset.assetId,
            assetName: assetName,
            evidenceSearchObject: evidence
          } as AssetDetailRouteStateType,
        }}
      >
        <div className="assetName">
        <CRXTruncation placement="top" content={assetName} />
        </div>
      </Link>
    </>
    return dataLink;
};

export default AssignToCase;
