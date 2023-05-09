
import { FC, useRef, useState } from "react";
import { CRXMultiSelectBoxLight, CRXButton, CRXModalDialog, CRXAlert } from "@cb/shared";
import { useTranslation } from 'react-i18next';
import './AssignToCase.scss';
import moment from "moment";
import { CasesAgent } from '../../../../utils/Api/ApiAgent';
import ConfirmAdditionalAssets from "./ConfirmAdditionalAssets";

type AssignToCasePropType = {
    selectedItems: any[],
    rowData: any,
    onClose: () => void
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
    const [openAdditionalAssetsModal, setOpenAdditionalAssetsModal] = useState(false);
    const [selectedCaseData, setSelectedCaseData] = useState<any>(null);
    const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);

    const predictiveSearchTimeoutRef = useRef<number>(0);
    const predictiveSearchItemsRef = useRef<any>([]);
    const selectedAssetsRef = useRef<any[]>(props.selectedItems);

    const { t } = useTranslation<string>();

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
        })
    }

    const getCaseById = (caseId: number) => {
        CasesAgent.getCase(`/Case/${caseId}`)
        .then(res => {
            if(res != null)
                setSelectedCaseData(res);
            else
                setSelectedCaseData(null);
        })
        .catch(ex => {})
    }

    const clearSelectedItem = () => {
        setSelectedCaseData(null);
        setSelectedCaseId({id: 0, label: ""});
    }

    const checkAssetsAlreadyTagged = () : boolean => {
        let existingAssetsCount = 0;
        for(let assetItem of selectedAssetsRef.current) {
            if(selectedCaseData != null && Array.isArray(selectedCaseData.caseAssets)) {
                if(selectedCaseData.caseAssets.find((x: any) => x.assetId === assetItem.assetId) != null) {
                    assetItem.isDisabled = true;
                    existingAssetsCount++;
                }
                else {
                    delete assetItem['isDisabled'];
                }
            }
        }
        if(existingAssetsCount > 0) {
            if(existingAssetsCount === selectedAssetsRef.current.length) {
                setAlertIsOpen(true);
            }
            else {
                setOpenAdditionalAssetsModal(true);
            }
        }
        return existingAssetsCount > 0;
    }

    const onAddToCaseClick = () => {
        if(props.rowData != null && Array.isArray(selectedAssetsRef.current)) {
            if(selectedAssetsRef.current.find(x => x.id === props.rowData.id) === undefined) {
                selectedAssetsRef.current.push(props.rowData);
            }
            if(checkAssetsAlreadyTagged() == false) {

            }
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

    return (
        <div className="assignToCaseContent">
            <div className="caseId-container">
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
            </div>
            <div className="caseInformation-container">
                <label className="caseInformationHeading">{t('Case_Information')}</label>
                <div className="caseInformationRow">
                    <div className="caseInformationContent">
                        <label>{t('Case_Lead')}:</label>
                        <label>{selectedCaseData != null ? selectedCaseData.userId : null}</label>
                    </div>
                    <div className="caseInformationContent">
                        <label>{t('Created_On')}:</label>
                        <label>
                            {selectedCaseData != null && selectedCaseData.history?.createdOn != null ?
                                moment(selectedCaseData.history?.createdOn).format("MM/DD/YYYY") : null}
                        </label>
                    </div>
                </div>
                <div className="caseInformationRow">
                    <div className="caseInformationContent">
                        <label>{t('Case_Description')}:</label>
                        <label className="caseInformation-caseDescription">
                            {selectedCaseData != null && selectedCaseData.description != null ?
                                selectedCaseData.description.plainText : null}
                        </label>
                    </div>
                </div>
            </div>
            <div className="assignToCaseModalFooter">
                <CRXButton
                    className="assignToCaseAddButton secondary"
                    color="secondary"
                    variant="outlined"
                    onClick={() => onAddToCaseClick()}
                    disabled={!(selectedCaseId.id > 0)}
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
            <CRXModalDialog
                maxWidth="lg"
                title={t('')}
                className={"CRXModal CRXModalConfirmAdditionalAssets"}
                modelOpen={openAdditionalAssetsModal}
                onClose={() => setOpenAdditionalAssetsModal(false)}
                defaultButton={false}
            >
                <ConfirmAdditionalAssets selectedItems={Array.isArray(selectedAssetsRef.current) ? selectedAssetsRef.current : []} onClose={() => setOpenAdditionalAssetsModal(false)}/>
            </CRXModalDialog>
            {
                alertIsOpen === true ?
                <CRXAlert
                    className="formFieldError"
                    message={t("The_selected_assets_already_exist_in_the_destination_Case")}
                    type="error"
                    showCloseButton={false}
                    alertType="inline"
                    open={true}
                />
                : null
            }            
        </div>
    )
}

export default AssignToCase;
