import React from 'react';
import { CRXDrawer, CRXIcon ,CRXBadge } from '@cb/shared';
import NotificationsIcon from '@material-ui/icons/Notifications';
import './CRXNotificationPanel.scss';

const ToggleButton = (
  <CRXBadge itemCount={1}>
    <CRXIcon className='bucketIcon'>
      <i className='fas fa-bell'></i>
    </CRXIcon>
  </CRXBadge>
);

const toggleState = () => {};

const CRXNotficationPanel = () => {
  return (
    <CRXDrawer
      className='CRXNotficationPanel'
      anchor='right'
      button={ToggleButton}
      btnStyle='NotificationIconButton'
      toggleState={toggleState}
    >
      Notification panel
    </CRXDrawer>
  );
};

export default CRXNotficationPanel;
