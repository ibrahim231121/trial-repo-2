import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { CRXCheckBox, CRXSelectBox, CRXButton, CRXRadio, CRXInput } from "@cb/shared";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { EvidenceAgent } from "../../../../utils/Api/ApiAgent";
import { AssetSharingModel, AssetShareLink, AssetAction, AssetsLinking, EvidenceAssetAction, EvidenceRetention } from "../../../../utils/Api/models/EvidenceModels";
import { useTranslation } from "react-i18next";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import { RootState } from "../../../../Redux/rootReducer";
import { clearAllGroupedSelectedAssetsActions } from "../../../../Redux/groupedSelectedAssetsActions";
import { AssetThumbnail } from "../AssetDataTable/AssetThumbnail";
import { CRXConfirmDialog } from "@cb/shared";
import { useHistory } from "react-router-dom";
import { urlList, urlNames } from "../../../../utils/urlList";
import { getAssetSearchInfoAsync } from "../../../../Redux/AssetSearchReducer";
import { SearchType } from "../../utils/constants";
import { CRXAlert } from "@cb/shared";

type AssetLinkConfirmProps = {
    items: any[];
    filterValue: any[];
    //setFilterValue: (param: any) => void
    rowData: any;
    setOnClose: () => void;
    setRemovedOption: (param: any) => void;
    showToastMsg: (obj: any) => any;
};

type AssetLinkConfirm = {
    assetId: number;
    index: number;
    isChecked: boolean;
}
type AssetModel = {
    assetId: number;
    masterId: number;
    evidenceId: number;
    actionType: string;
    assetName: string;
    expireOn: Date;
    holduntil: Date;
    fileType: string;
    assetType: string;
    isValid: boolean;
}
const cookies = new Cookies();

const AssetLinkConfirm: React.FC<AssetLinkConfirmProps> = (props) => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const [email, setEmail] = React.useState<string>("")

    const [responseError, setResponseError] = React.useState<string>("");
    const [alert, setAlert] = React.useState<boolean>(false);
    const [assetsToBeLink, setassetsToBeLink] = React.useState<AssetLinkConfirm[]>([]);
    const [assetsLinkIn, setassetsLinkIn] = React.useState<AssetLinkConfirm[]>([]);

    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [linkAssets, setLinkAssets] = React.useState<AssetsLinking[]>([]);
    const [confirmModaltxt, setConfirmModaltxt] = React.useState<string>("");
    const [assetModel, setAssetModel] = React.useState<AssetModel[]>([]);
    const [buttonState, setButtonState] = React.useState(true);


    const groupedSelectedAssetsActions: any = useSelector(
        (state: RootState) => state.groupedSelectedAssetsActionsReducer.groupedSelectedAssetsActions
    );
    const history = useHistory();
    const validate = (assetId: number) => {

        var isValid = true;
        if (props.items.length > 0) {
            props.items.forEach((obj: any) => {
                if (obj.evidence.asset.filter((a: any) => a.assetId == assetId).length > 0) {
                    isValid = false;
                    return isValid;
                }
            })
        }
        else {
            if (props.rowData.evidence.asset.filter((a: any) => a.assetId == assetId).length > 0) {
                isValid = false;
                return isValid;
            }
        }
        return isValid;
    }
    React.useEffect(() => {
        let inValidCount = 0;
        assetModel.forEach((a: any, i) => {
            if (a.isValid == false) {
                inValidCount++;
            }
        })
        if (inValidCount > 0) {
            setButtonState(true);
        }
        else {
            setButtonState(false);
        }
    }, [assetModel])
    React.useEffect(() => {
        let inValidCount = 0;
        assetModel.forEach((a: any, i) => {
            if (a.isValid == false) {
                if (assetsToBeLink[i].isChecked == true) {
                    inValidCount++;
                }
            }
        })

        if (inValidCount > 0 || assetsToBeLink.filter(x => x.isChecked == true).length == 0) {
            setButtonState(true);
        }
        else {
            setButtonState(false);
        }

    }, [assetsToBeLink])
    const checkValidation = (tempAssetLinkIn: any[]) => {
        let newAssetModel: AssetModel[] = [];
        var masterChildAssets: any[] = [];
        var allChildAssets: any[] = [];
        if (props.items.length > 0) {
            var checkedMaster = tempAssetLinkIn.filter((x: any) => x.isChecked == true);
            checkedMaster.forEach((m) => {
                props.items
                    .filter(c => c.assetId == m.assetId)[0].evidence.asset
                    .forEach((f: any) => {
                        allChildAssets.push(f.assetId);
                    });
            })
            masterChildAssets.forEach((e) => {
                e?.evidence?.asset?.forEach((f: any) => {
                    allChildAssets.push(f.assetId);
                });
            });
            assetModel.forEach((a: any) => {
                newAssetModel.push({
                    assetId: a.assetId,
                    masterId: a.masterId,
                    evidenceId: a.evidenceId,
                    actionType: a.actionType,
                    assetName: a.assetName,
                    expireOn: a.expireOn,
                    holduntil: a.holduntil,
                    fileType: a.fileType,
                    assetType: a.assetType,
                    isValid: allChildAssets.filter(c => c == a.assetId).length > 0 ? false : true,
                })
            })
            setAssetModel(newAssetModel);
        }

    }
    React.useEffect(() => {
        let confirmAssets: AssetLinkConfirm[] = [];
        let confirmAssetsLinkIn: AssetLinkConfirm[] = [];

        let tempModel: AssetModel[] = [];
        groupedSelectedAssetsActions.map((obj: any, index: number) => {
            confirmAssets.push({
                isChecked: true,
                assetId: obj.assetId,
                index: index
            });
            tempModel.push({
                assetId: obj.assetId,
                masterId: obj.masterId,
                evidenceId: obj.evidenceId,
                actionType: obj.actionType,
                assetName: obj.assetName,
                expireOn: obj.expireOn,
                holduntil: obj.holduntil,
                fileType: obj.fileType,
                assetType: obj.assetType,
                isValid: validate(obj.assetId),
            });
            setAssetModel(tempModel);
        });
        setassetsToBeLink(confirmAssets);
        (props.items.length > 0) ?
            props.items.map((obj: any, index: number) => {
                confirmAssetsLinkIn.push({
                    isChecked: true,
                    assetId: obj.assetId,
                    index: index
                });
            })
            :
            confirmAssetsLinkIn.push({
                isChecked: true,
                assetId: props.rowData.assetId,
                index: 0
            });



        setassetsLinkIn(confirmAssetsLinkIn);

    }, []);
    React.useEffect(() => {
        if (confirmModaltxt.length > 0) { 
            //setIsModalOpen(true)
            sendData();
        }
        else if (linkAssets[0]?.evidenceRetentionList.length == 0 && linkAssets?.length > 0) {
            sendData();
        }
    }, [linkAssets])

    const closeDialog = () => {
        sendData();
        setIsModalOpen(false);
        props.setOnClose();
        history.push(
            urlList.filter((item: any) => item.name === urlNames.assets)[0].url
        );
    };
    const onMove = async () => {
        let temp: EvidenceRetention[] = [];
        let tempEvidenceAsset: EvidenceAssetAction[] = [];
        let tempAssetsLinking: AssetsLinking[] = [];

        ////EvidenceAssetAction////
        groupedSelectedAssetsActions.map((sobj: any, index: number) => {
            if (assetsToBeLink[index].isChecked) {

                if (assetsLinkIn[0].isChecked) {
                    tempAssetsLinking.push({
                        evidenceId: props.rowData.id,
                        assetId: sobj.assetId,
                        action: "add",
                        evidenceRetentionList:temp,
                    })
                    tempAssetsLinking.push({
                        evidenceId: sobj.evidenceId,
                        assetId: sobj.assetId,
                        action: "delete",
                        evidenceRetentionList:temp,
                    })
                }
            }
        });

        setLinkAssets(tempAssetsLinking);


    }
    const onLink = async () => {
        let temp: EvidenceRetention[] = [];
        let tempEvidenceAsset: EvidenceAssetAction[] = [];
        let tempAssetsLinking: AssetsLinking[] = [];
        let maxDestinationExpiry: any;
        setConfirmModaltxt("");

        ////check duplicate assets////


        ////maxDestinationExpiry////
        if (props.items.length > 0) {
            props.items.map((obj: any, index: number) => {
                if (assetsLinkIn[index].isChecked) {
                    if (index == 0) {
                        maxDestinationExpiry = obj.holdUntil == null ? obj.expireOn : obj.holdUntil;
                    }
                    if (maxDestinationExpiry < (obj.holdUntil == null ? obj.expireOn : obj.holdUntil)) {
                        maxDestinationExpiry = obj.holdUntil == null ? obj.expireOn : obj.holdUntil;
                    }
                }
            })
        }
        else {
            if (assetsLinkIn[0].isChecked) {

                maxDestinationExpiry = props.rowData.holdUntil == null ? props.rowData.expireOn : props.rowData.holdUntil;
            }
        }
        ////EvidenceAssetAction////

        groupedSelectedAssetsActions.map((sobj: any, index: number) => {
            if (assetsToBeLink[index].isChecked) {
                if (props.items.length > 0) {

                    props.items.map((obj: any, index: number) => {
                        if (assetsLinkIn[index].isChecked) {
                            tempEvidenceAsset.push({
                                evidenceId: obj.id,
                                assetId: sobj.assetId,
                                action: "add",
                            })
                        }
                    })
                }
                else {
                    if (assetsLinkIn[0].isChecked) {
                        tempEvidenceAsset.push({
                            evidenceId: props.rowData.id,
                            assetId: sobj.assetId,
                            action: "add",
                        })
                    }
                }

            }

        });
        ////EvidenceHoldUntil List Insertion////
        let assetsRetChange = "";
        groupedSelectedAssetsActions.map((sobj: any, index: number) => {
            if (assetsToBeLink[index].isChecked) {
                if ((sobj.holduntil == null ? sobj.expireOn : sobj.holduntil) < maxDestinationExpiry) {
                    assetsRetChange = assetsRetChange + sobj.assetName + ",";
                    if (temp.filter(x => x.evidenceId == sobj.evidenceId).length == 0) {
                        temp.push(
                            {
                                evidenceId: sobj.evidenceId,
                                holdUntil: maxDestinationExpiry,
                            }
                        )
                    }
                }
            }
        });
        if (assetsRetChange.length > 0) // Show confirm popup
        {
            setConfirmModaltxt(assetsRetChange);

        }
        tempEvidenceAsset.forEach((x) => {
            tempAssetsLinking.push({
                assetId:x.assetId,
                evidenceId:x.evidenceId,
                action:x.action,
                evidenceRetentionList:temp
            })
        })
        setLinkAssets(tempAssetsLinking);
    }
    const onSubmitForm = async () => {
        if (groupedSelectedAssetsActions[0].actionType == "move") {
            onMove();
        }
        else if (groupedSelectedAssetsActions[0].actionType == "link") {
            onLink();
        }

    };
    const sendData = async () => {
        let actionType = "linked";
        if (linkAssets.filter(x => x.action == 'delete').length > 0) {
            actionType = "moved";
        }
        const url = '/Evidences/LinkAssets'
        EvidenceAgent.linkAsset(url, linkAssets).then(() => {
            setTimeout(() => {
                dispatch(getAssetSearchInfoAsync({ QUERRY: "", searchType: SearchType.SimpleSearch }));
            }, 1510);
            dispatch(clearAllGroupedSelectedAssetsActions());
            props.setOnClose();
            props.showToastMsg({
                message: "Asset(s) " + actionType + " successfully",
                variant: "success",
                duration: 7000,
                clearButtton: true,
            });

        })
            .catch(function (error) {
                setAlert(true);
                setResponseError(
                    "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
                );
                return error;
            });
    }
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, assetId: number) => {
        let confirmAssets: AssetLinkConfirm[] = [];
        let checkedAssets = assetsToBeLink.map((select: AssetLinkConfirm, i: number) => {
            if (select.assetId === assetId) {
                confirmAssets.push({
                    isChecked: e.target.checked,
                    assetId: select.assetId,
                    index: i
                });
            }
            else {
                confirmAssets.push({
                    isChecked: assetsToBeLink[i].isChecked,
                    assetId: select.assetId,
                    index: i
                });
            }
            setassetsToBeLink(confirmAssets);
        });
    };
    const handleCheckMaster = (e: React.ChangeEvent<HTMLInputElement>, assetId: number) => {
        let confirmAssets: AssetLinkConfirm[] = [];
        let checkedAssets = assetsLinkIn.map((select: AssetLinkConfirm, i: number) => {
            if (select.assetId === assetId) {
                confirmAssets.push({
                    isChecked: e.target.checked,
                    assetId: select.assetId,
                    index: i
                });
            }
            else {
                confirmAssets.push({
                    isChecked: assetsLinkIn[i].isChecked,
                    assetId: select.assetId,
                    index: i
                });
            }

            setassetsLinkIn(confirmAssets);
        });
        checkValidation(confirmAssets);
    };
    const cancelBtn = () => {
        props.setOnClose();
    };
    const masterAssetList = (obj1: any) => {
        return (
            obj1.map((obj: any, index: number) => {

                const id = `checkBox'+${index}`;
                return (
                    <>

                        <div className="_asset_group_list_row" key={index}>
                            <div className="_asset_group_single_check">
                                <CRXCheckBox
                                    inputProps={id}
                                    className="relatedAssetsCheckbox"
                                    checked={(assetsLinkIn[index]?.isChecked == undefined) ? true : assetsLinkIn[index].isChecked}//{assetsLinkIn[index].isChecked}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => handleCheckMaster(e, assetsLinkIn[index].assetId)}
                                    lightMode={true}
                                />
                            </div>
                            <div className="_asset_group_list_thumb">
                                <AssetThumbnail
                                    assetName={obj.assetName}
                                    assetType={obj.assetType}
                                    fileType={obj.evidence.asset[0].files[0].type}
                                    accessCode={obj.evidence.asset[0].files[0].accessCode}
                                    className={"CRXPopupTableImage"}
                                />
                            </div>
                            <div className="_asset_group_list_detail">

                                <div className="_asset_group_list_link">
                                    {obj.assetName}
                                </div>
                            </div>
                        </div>


                    </>
                );
            }))
    }

    return (
        <>
            <div className="__Crx__Share__Asset__Modal" style={{ height: '600px' }}>

                <Formik initialValues={{ email }} onSubmit={() => onSubmitForm()}>
                    {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
                        <>
                            <Form>
                                <div className="CrxCreateUser">
                                    <div className="CrxIndicates">
                                    {assetModel.filter(e => e.isValid == false).length == assetModel.length &&
                                            <>
                                            <CRXAlert
                                                    className="formFieldError"
                                                    message={t("Asset_already_exists_in_the_destination_group_Link_action_cant_be_performed")}
                                                    type="error"
                                                    showCloseButton={false}
                                                    alertType="inline"
                                                    open={true}
                                                />
                                                {/* <i className="fas fa-exclamation-circle errorIcon"></i> */}
                                                
                                                {/* <div style={{ color: 'red' }}>
                                                    {t("Asset_already_exists_in_the_destination_group. Link_action_cant_be_performed.")}
                                                </div> */}
                                            </>

                                        }
                                        Are you sure want to link the selected asset(s)? <br></br>
                                        
                                        {assetModel.map((obj: any, index: number) => {

                                            const id = `checkBox'+${index}`;
                                            return (
                                                <>
                                                    <div >
                                                        <div className="_asset_group_list_row" key={index} style={{ border: (assetModel.filter(e => e.isValid == false).length < assetModel.length && obj.isValid === false) ? "2px solid red" : "0px solid white" }} >
                                                            <div className="_asset_group_single_check">
                                                                <CRXCheckBox
                                                                    inputProps={id}
                                                                    className="relatedAssetsCheckbox"
                                                                    checked={(assetsToBeLink[index]?.isChecked == undefined) ? true : assetsToBeLink[index].isChecked}
                                                                    onChange={(
                                                                        e: React.ChangeEvent<HTMLInputElement>
                                                                    ) => handleCheck(e, assetsToBeLink[index].assetId)}
                                                                    lightMode={true}
                                                                />
                                                            </div>
                                                            <div className="_asset_group_list_thumb">
                                                                <AssetThumbnail
                                                                    assetName={obj.assetName}
                                                                    assetType={obj.assetType}
                                                                    fileType={obj.fileType}
                                                                    accessCode={obj.accessCode}
                                                                    className={"CRXPopupTableImage"}
                                                                />
                                                            </div>
                                                            <div className="_asset_group_list_detail">

                                                                <div className="_asset_group_list_link">
                                                                    {obj.assetName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {assetModel.filter(e => e.isValid == false).length < assetModel.length &&
                                                            obj.isValid === false &&
                                                            <>
                                                                <CRXAlert
                                                                    className="formFieldError"
                                                                    message={t("Asset_already_exists_in_the_destination_group")}
                                                                    type="warning"
                                                                    showCloseButton={false}
                                                                    alertType="inline"
                                                                    open={true}
                                                                />

                                                            </>
                                                        }
                                                    </div>
                                                    <CRXConfirmDialog
                                                        setIsOpen={() => setIsModalOpen(false)}
                                                        onConfirm={closeDialog}
                                                        isOpen={isModalOpen}
                                                        className="userGroupNameConfirm"
                                                        primary={t("Link asset(s)")}
                                                        secondary={t("No, do not link")}
                                                        text="user group form"
                                                    >
                                                        <div className="confirmMessage">
                                                            {t("The_retention_of_the_following_assets_will_be_increased")}<br></br>
                                                            {t("_by_the_retention_of_destination_evidence")}.<br></br>
                                                            <strong>{confirmModaltxt}</strong>
                                                            <br></br>
                                                            {t("Do_you_want_to_link.")}

                                                            <div className="confirmMessageBottom">
                                                                {t("Are_you_sure_you_would_like_to")}{" "}
                                                                <strong>{t("close")}</strong> {t("the_form?")}
                                                            </div>
                                                        </div>
                                                    </CRXConfirmDialog>
                                                </>
                                            );

                                        })
                                        }
                                        <br></br>
                                        The Assets will be linked to the following Primary Asset(s) <br></br>
                                        {

                                            (props.items.length > 0) ?

                                                masterAssetList(props.items)

                                                : masterAssetList([props.rowData])
                                        }

                                    </div>
                                </div>
                                <div className="modalFooter CRXFooter">
                                {assetModel.filter(e => e.isValid == false).length != assetModel.length &&
                                <>
                                    <div className="nextBtn">
                                        <CRXButton
                                            type="submit"
                                            className={"primeryBtn"}
                                            disabled={buttonState}
                                        >
                                            {t("Submit")}
                                        </CRXButton>
                                    </div>
                                    <div className="cancelBtn">
                                        <CRXButton
                                            onClick={cancelBtn}
                                            className="cancelButton secondary"
                                        >
                                            {t("Cancel")}
                                        </CRXButton>
                                    </div>
                                    </>
                                }
                                {assetModel.filter(e => e.isValid == false).length == assetModel.length &&
                                    <div className="cancelBtn">
                                <CRXButton
                                    onClick={cancelBtn}
                                    className="cancelButton secondary"
                                >
                                    {t("Close")}
                                </CRXButton>
                            </div>
                            }
                                </div>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default AssetLinkConfirm;
