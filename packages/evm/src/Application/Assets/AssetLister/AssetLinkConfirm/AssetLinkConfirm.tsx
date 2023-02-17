import React, { useContext } from "react";
import { Formik, Form } from "formik";
import { CRXCheckBox, CRXSelectBox, CRXButton, CRXRadio, CRXInput } from "@cb/shared";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { EvidenceAgent } from "../../../../utils/Api/ApiAgent";
import { AssetSharingModel, AssetShareLink, AssetAction } from "../../../../utils/Api/models/EvidenceModels";
import { useTranslation } from "react-i18next";
import ApplicationPermissionContext from "../../../../ApplicationPermission/ApplicationPermissionContext";
import { RootState } from "../../../../Redux/rootReducer";
import { clearAllGroupedSelectedAssetsActions } from "../../../../Redux/groupedSelectedAssetsActions";
import { AssetThumbnail } from "../AssetDataTable/AssetThumbnail";

type AssetLinkConfirmProps = {
    items: any[];
    filterValue: any[];
    //setFilterValue: (param: any) => void;
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
const cookies = new Cookies();

const AssetLinkConfirm: React.FC<AssetLinkConfirmProps> = (props) => {
    const { t } = useTranslation<string>();
    const dispatch = useDispatch();
    const [email, setEmail] = React.useState<string>("")

    const [responseError, setResponseError] = React.useState<string>("");
    const [alert, setAlert] = React.useState<boolean>(false);
    const [emailError, setEmailError] = React.useState<string>("");
    const [assetsToBeLink, setassetsToBeLink] = React.useState<AssetLinkConfirm[]>([]);
    const [assetsLinkIn, setassetsLinkIn] = React.useState<AssetLinkConfirm[]>([]);


    const regex =
        /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;

    const linkExpireOptions = [
        { value: 1, displayText: t("Hour(s)") },
        { value: 2, displayText: t("Day(s)") },
        { value: 3, displayText: t("No_Expiration") },
    ];

    const [currentRetention, setCurrentRetention] = React.useState<string>("-");
    const [assetSharing, setAssetSharing] = React.useState<AssetSharingModel>();
    const { getTenantId } = useContext(ApplicationPermissionContext);
    const [error, setError] = React.useState({
        emailErr: "",

    });
    const groupedSelectedAssetsActions: any = useSelector(
        (state: RootState) => state.groupedSelectedAssetsActionsReducer.groupedSelectedAssetsActions
    );

    React.useEffect(() => {
        let confirmAssets: AssetLinkConfirm[] = [];
        let confirmAssetsLinkIn: AssetLinkConfirm[] = [];
        groupedSelectedAssetsActions.map((obj: any, index: number) => {
            confirmAssets.push({
                isChecked: true,
                assetId: obj.assetId,
                index: index
            });

        });
        setassetsToBeLink(confirmAssets);
        props.items.map((obj: any, index: number) => {
            confirmAssetsLinkIn.push({
                isChecked: true,
                assetId: obj.assetId,
                index: index
            });
        });
        setassetsLinkIn(confirmAssetsLinkIn);
        var row = props.rowData;
        var selectedItems = props.items;

    }, []);

    const onSubmitForm = async () => {
        let tempLinkedAssets: AssetAction[] = [];
        dispatch(clearAllGroupedSelectedAssetsActions());
        props.setOnClose();
    };
    const sendData = async () => {
        const url = '/Evidences/Share'// + `${props.items}`
        EvidenceAgent.shareAsset(url, assetSharing).then(() => {
            props.setOnClose();
            props.showToastMsg({
                message: "Share email sent to recipients",
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
            else
            {
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
            else
            {
                confirmAssets.push({
                    isChecked: assetsLinkIn[i].isChecked,
                    assetId: select.assetId,
                    index: i
                });
            }
            setassetsLinkIn(confirmAssets);
        });
    };
    const cancelBtn = () => {
        props.setOnClose();
    };

    return (
        <>
            <div className="__Crx__Share__Asset__Modal" style={{ height: '600px' }}>
                <Formik initialValues={{ email }} onSubmit={() => onSubmitForm()}>
                    {({ setFieldValue, values, errors, touched, dirty, isValid }) => (
                        <>
                            <Form>
                                <div className="CrxCreateUser">
                                    <div className="CrxIndicates">

                                        Are you sure want to link the selected asset(s)? <br></br>
                                        {groupedSelectedAssetsActions.map((obj: any, index: number) => {
                                            const id = `checkBox'+${index}`;
                                            return (
                                                <>
                                                    <div className="_asset_group_list_row" key={index}>
                                                        <div className="_asset_group_single_check">
                                                            <CRXCheckBox
                                                                inputProps={id}
                                                                className="relatedAssetsCheckbox"
                                                                checked={(assetsToBeLink[index]?.isChecked == undefined) ? true:assetsToBeLink[index].isChecked}
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
                                            //}
                                        })
                                        }
                                        <br></br>
                                        The Assets will be linked to the following Primary Asset(s) <br></br>

                                        {
                                            props.items.map((obj: any, index: number) => {
                                                const id = `checkBox'+${index}`;
                                                return (
                                                    <>
                                                        <div className="_asset_group_list_row" key={index}>
                                                            <div className="_asset_group_single_check">
                                                                <CRXCheckBox
                                                                    inputProps={id}
                                                                    className="relatedAssetsCheckbox"
                                                                    checked={(assetsLinkIn[index]?.isChecked == undefined) ? true:assetsLinkIn[index].isChecked}//{assetsLinkIn[index].isChecked}
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
                                                //}
                                            })
                                        }
                                    </div>
                                </div>





                                <div className="modalFooter CRXFooter">
                                    <div className="nextBtn">
                                        <CRXButton
                                            type="submit"
                                            className={"primeryBtn"}

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
