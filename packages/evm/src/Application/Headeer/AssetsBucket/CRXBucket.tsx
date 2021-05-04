import React from "react";
import { CRXDrawer, CRXIcon } from '@cb/shared'
import './CRXBucket.scss';
const ToggleButton = <CRXIcon className="bucketIcon"> <i className="fas icon-drawer2"></i> </CRXIcon>

const CRXAssetsBucketPanel = () => {
    return (
        <CRXDrawer
        className="CRXBucketPanel"
        anchor="right"
        button={ToggleButton}
        btnStyle="bucketIconButton"
        >
           Assets Bucket
        </CRXDrawer>
    )
}

export default CRXAssetsBucketPanel;