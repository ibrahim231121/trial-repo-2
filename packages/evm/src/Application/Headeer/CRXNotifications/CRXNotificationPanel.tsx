import React from "react";
import { CRXDrawer, CRXIcon } from '@cb/shared'
import NotificationsIcon from '@material-ui/icons/Notifications';
import './CRXNotificationPanel.scss';
const ToggleButton = <CRXIcon className="bucketIcon"> <i className="fas fa-bell"></i> </CRXIcon>

const CRXNotficationPanel = () => {
    return (
        <CRXDrawer
        className="CRXNotficationPanel"
        anchor="right"
        button={ToggleButton}
        btnStyle="NotificationIconButton"
        >
           Notification panel
        </CRXDrawer>
    )
}

export default CRXNotficationPanel;