
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

  const removeMessage = (e: React.DOMAttributes<HTMLButtonElement>, x:NotificationMessage) => {
    dispatch(removeNotificationMessages(x));
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
          <label>Notification panel</label>
          <br/>
          <div style={{textAlign:"left"}}>
            <div style={{width:"100%", textAlign:"right"}}>
              <CRXButton
                className={"CRXCloseButton"}
                disableRipple={true}
                onClick={(e:React.DOMAttributes<HTMLButtonElement>) => clearAllMessage(e,notificationMessage)}
              >
                Clear All
              </CRXButton>
            </div>
            <div >
              {reverseArray(notificationMessage).map((x:NotificationMessage) => {
                return (
                  <>
                    <div style={{border: "1px solid black",display:"flex"}}>
                      <div style={{width:"5%",verticalAlign:"middle"}}>
                          <span className={"fas " + setIcon[x.type]} />
                      </div>
                      <div style={{width:"80%"}}>
                        <div style={{display:"flex"}}> 
                          <div style={{width:"30%"}}><b>{x.title}</b></div>
                          <div style={{width:"70%", textAlign:"right"}}>{x.date}</div>
                        </div>
                        <div style={{color: "gray"}}>
                          {x.message}
                        </div>
                      </div>
                      <div style={{textAlign:"right",width:"15%"}}>
                        <CRXButton
                          className={"CRXCloseButton"}
                          disableRipple={true}
                          onClick={(e:React.DOMAttributes<HTMLButtonElement>) => removeMessage(e,x)}
                        >
                          <div className="icon-cross2 detailPopupCloseIcon"></div>
                        </CRXButton>
                      </div>
                      
                    </div>
                    <div style={{height:"5px"}}></div>
                  </>
                )
              })}
            </div>
          </div>
    </CRXDrawer>
  );
};

export default CRXNotficationPanel;
