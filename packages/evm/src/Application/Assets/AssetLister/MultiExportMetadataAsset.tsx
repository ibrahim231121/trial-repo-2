import React from 'react';
import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import { useTranslation } from "react-i18next";
import "./MultiExportMetadataAsset.scss";
type MultiExportMetadataAssetProps = {
    openOrCloseModal: boolean;
    setOpenOrCloseModal: (param: boolean) => void;
    onConfirmBtnHandler: () => void;
    isError: boolean;
    errorMessage: string;
    setCloseButton : React.Dispatch<React.SetStateAction<boolean>>;
    message : string;
    title : string;
    primaryMessage : string;
}
const MultiExportMetadataAsset: React.FC<MultiExportMetadataAssetProps> = (props) => {
    const { t } = useTranslation<string>();
    return (
        <div className='multiExport-modal-dialogue'>
            <CRXConfirmDialog
                className="crx-unblock-modal CRXMultiExportAssetModal _multiExport_asset_model_"
                title={t(props.title)}
                setIsOpen={props.setOpenOrCloseModal}
                onConfirm={props.onConfirmBtnHandler}
                isOpen={props.openOrCloseModal}
                primary={t(props.primaryMessage)}
                secondary={t("No_only_selected_assets")}
                isCloseButton={true}
                setCloseButton={props.setCloseButton}
            >
                <div className='modalContentText'>
                    {props.isError &&
                        <CRXAlert
                            className='cateoryAlert-Error errorMessageCategory'
                            message={props.errorMessage}
                            type='error'
                            alertType='inline'
                            open={true}
                        />
                    }
                    <div className='cancelConfrimText'>
                        {props.message}
                        <br/>
                        {t("along_with_the_primary_that_are_selected")}
                    </div>
                </div>
            </CRXConfirmDialog>
        </div >
    );
}
export default MultiExportMetadataAsset;