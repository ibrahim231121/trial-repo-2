
import React, { useEffect } from "react";
import {
  CRXDrawer,
  CRXButton,
  CRXBadge,
  CRXIcon,
  CRXTooltip
} from "@cb/shared";
import NotificationsIcon from '@material-ui/icons/Notifications';
import './index.scss';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/rootReducer";
import { getNotificationMessages, removeNotificationMessages, clearAllNotificationMessages }  from "../../../Redux/notificationPanelMessages";
import { NotificationMessage, setIcon, messageType } from "./notificationsTypes"
import { useTranslation } from "react-i18next";

const ToggleBadge = (
  <CRXBadge itemCount={3} color="primary">
    <CRXIcon className='bucketIcon'>
      <i className='fas fa-bell'></i>
    </CRXIcon>
  </CRXBadge>
);

type panelProps = {
  otherPanel : any
}
const CRXNotficationPanel = ({otherPanel} : panelProps) => {
  const { t } = useTranslation<string>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isRead, setIsRead] = React.useState<boolean>(false);

  const toggleOpen = () => {
    
    setIsOpen((prevState: boolean) => !prevState);
    otherPanel(false)
  };
  //const toggleRead = () => setIsRead(false);
  const dispatch = useDispatch()

  const notificationMessage: NotificationMessage[] = useSelector(
    (state: RootState) => state.notificationReducer.notificationMessages
  );

  useEffect(() => {
    if(notificationMessage.length > 0)
      setIsRead(true)
    else
      setIsRead(false)
  },[notificationMessage])

  useEffect(() => {
    dispatch(getNotificationMessages());
  }, [])

  const ToggleDot = (
    <>
      <CRXIcon className='bucketIcon'>  
        <CRXTooltip iconName="fas fa-bell" arrow={false} title="notifications" placement="bottom" className="crxTooltipNotificationIcon"/>
      </CRXIcon>
      {isRead && <CRXIcon className='bucketIcon' >
      
        <i className="fas fa-circle" style={{fontSize:"5px", paddingRight:"10px"}}></i>
      </CRXIcon>
      }
    </>
  );

  const removeMessage = (e: React.DOMAttributes<HTMLButtonElement>, notificationMessage:NotificationMessage) => {
    dispatch(removeNotificationMessages(notificationMessage));
  }

  const clearAllMessage = (e: React.DOMAttributes<HTMLButtonElement>, notificationMessage:NotificationMessage[]) => {
    dispatch(clearAllNotificationMessages(notificationMessage));
  }

  const reverseArray = (arr: NotificationMessage[]) => {
    var newArray = [];
    for (var i = arr.length - 1; i >= 0; i--) {
      newArray.push(arr[i]);
    }
    return newArray;
  }
  
  return (
    <CRXDrawer
      className='CRXBucketPanel crxBucketPanelStyle'
      anchor='right'
      button={ToggleDot}
      btnStyle='NotificationIconButton'
      isOpen={isOpen}
      toggleState={toggleOpen}
    >    

          <div className="notification-panel">
            <div className="bucketPanelTitle">
            <label>{t("Notifications")}</label>
            </div>
            
            
              <div className="notification-close-btn" style={{width:"100%", textAlign:"right"}}>
                <CRXButton
                  className={"CRXCloseButton"}
                  disableRipple={true}
                  onClick={(e:React.DOMAttributes<HTMLButtonElement>) => clearAllMessage(e,notificationMessage)}
                >
                  {t("Clear_All")}
                </CRXButton>
              </div>
              <div className="notification-scroll">
                {reverseArray(notificationMessage).map((x:NotificationMessage) => {
                  return (
                    <>
                    
                      <div className="uploadContent">
                          <div className="iconArea">
                          <span className={"fas " + setIcon[x.type] + " notification_" + x.type} />
                          </div>
                          
                          <div className="textArea">
                          <div style={{display:"flex"}}> 
                            <div style={{flex: 6}}><b>{x.title}</b></div>
                            <div className="notification-date" style={{flex: 6}}>{x.date}</div>
                              
                            </div>
                          <div className="notification-message"></div>
                            <p>{x.message}</p>
                          </div>
                         
                          <div className="closeBtnArea">
                              <CRXButton
                                className={"notification-cross"}
                                disableRipple={true}
                                onClick={(e:React.DOMAttributes<HTMLButtonElement>) => removeMessage(e,x)}
                              >
                                <div className="icon icon-cross2"></div>
                              </CRXButton>
                            </div>
                        </div>

                    </>
                  )
                })}
              </div>
            
          </div>
    </CRXDrawer>
  );
};

export default CRXNotficationPanel;
