import React from "react";
import { CRXDrawer, CRXIcon } from '@cb/shared'
import NotificationsIcon from '@material-ui/icons/Notifications';
import './CRXGlobalSearch.scss';
const ToggleButton = <CRXIcon className="bucketIcon"> <i className="fas fa-search"></i> </CRXIcon>

const CRXGlobalSearchPanel = () => {
    return (
        <CRXDrawer
        className="CRXGlobalSearchPanel"
        anchor="right"
        button={ToggleButton}
        btnStyle="GlobalSearchIconButton"
        >
           Global Search panel
        </CRXDrawer>
    )
}

export default CRXGlobalSearchPanel;