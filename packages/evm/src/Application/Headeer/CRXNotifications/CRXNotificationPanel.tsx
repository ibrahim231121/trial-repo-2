
import React, { useEffect } from "react";
import {
  CRXDrawer,
  CRXRows,
  CRXColumn,
  CRXBadge,
  CRXIcon,
} from "@cb/shared";
import NotificationsIcon from '@material-ui/icons/Notifications';
import './CRXNotificationPanel.scss';

const ToggleBadge = (
  <CRXBadge itemCount={3} color="primary">
    <CRXIcon className='bucketIcon'>
      <i className='fas fa-bell'></i>
    </CRXIcon>
  </CRXBadge>
);





const CRXNotficationPanel = () => {

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isRead, setIsRead] = React.useState<boolean>(true);
  const toggleOpen = () => setIsOpen((prevState: boolean) => !prevState);
  const toggleRead = () => setIsRead(false);

  const ToggleDot = (
    <>
      <CRXIcon className='bucketIcon'>  
        <i className='fas fa-bell' ></i>
      </CRXIcon>
      {isRead && <CRXIcon className='bucketIcon' >
        <i className="fas fa-circle" style={{fontSize:"5px", paddingRight:"10px"}}></i>
      </CRXIcon>
      }
    </>
  );
  
  return (
    <CRXDrawer
      className='CRXBucketPanel crxBucketPanelStyle'
      anchor='right'
      button={ToggleDot}
      btnStyle='NotificationIconButton'
      isOpen={isOpen}
      toggleState={toggleOpen}
    >    
          <label>Notification panel</label>
          <br/><br/><br/>
          <div style={{textAlign:"center"}}>
            <button
              onClick={() => toggleRead()}
            >
              Read Notifications
            </button>
          </div>
    </CRXDrawer>
  );
};

export default CRXNotficationPanel;
