import React, { useRef } from "react";
import {
  Menu,
  MenuItem,
  MenuButton
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Restricted from "../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import { urlList, urlNames } from "../../../utils/urlList";
import { useHistory } from "react-router-dom";
import { CRXConfirmDialog, CRXAlert } from "@cb/shared";
import { HotListAgent } from "../../../utils/Api/ApiAgent";
import { PageiGrid } from "../../../GlobalFunctions/globalDataTableFunctions";
import { GetAllHotListData } from "../../../Redux/AlprHotListReducer";
import { useDispatch } from "react-redux";
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { CRXToaster } from "@cb/shared";
import { AlprGlobalConstants, alprToasterMessages } from "../AlprGlobal";

type Props = {
  selectedItems?: any;
  row?: any;
  gridData: any;
  pageiGrid: PageiGrid;
};

const HotListActionMenu: React.FC<Props> = ({ selectedItems, row, gridData, pageiGrid}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation<string>();
  const history = useHistory();
  const [primary, setPrimary] = React.useState<string>("");
  const [secondary, setSecondary] = React.useState<string>("");
  const [IsOpen, setIsOpen] = React.useState<boolean>(false);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const toasterRef = useRef<typeof CRXToaster>(null);
  
  const editHotList = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.HotListDetail)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id, t("Edit_Hot_List"));
  };

  const deleteHotlist = () => {
    setPrimary(t("Yes"));
    setSecondary(t("No"));
    setIsOpen(true);
    // setModalType("deactivate");
  }
  const onConfirm = (e:any) => {
    dispatch(setLoaderValue({isLoading: true}));
    const seletedIds = selectedItems.map((item:any)=>item.id).join(",");
    HotListAgent.deleteHotListItemAsync("/HotList" + ((selectedItems.length > 1) ? "?hotlistIds=" + seletedIds : "/" + row?.id)).then(()=>{
      dispatch(setLoaderValue({isLoading: false}));
      setIsOpen(false);
      alprToasterMessages?.({
        message: t("Hotlist_deleted"),
        variant: AlprGlobalConstants.TOASTER_SUCCESS_VARIANT,
      },toasterRef);
      dispatch(GetAllHotListData(pageiGrid));
    }).catch((error:any)=>{
      dispatch(setLoaderValue({isLoading: false}));
      console.log(error);
      setIsOpen(false);

      if(error && error.response && error.response.status == 405){
        let names:string = "";
        let ids = error.response.data.split(',')

        if(selectedItems.length > 0){
          selectedItems.forEach((item:any)=>{
            if(names.length >= 70){            
              return false;
            }
  
            if(ids.indexOf(item.id.toString()) >= 0){
              if(names.length + item.Name.length < 70){
                names += ", " + item.Name 
              }else{
                names += "...";
              }            
            }
          });
  
          names = names.substring(2);
        }else{
          names = row.Name;
        }
        

        alprToasterMessages?.({
          message: t("Hotlist_delete_not_allowed").replace("[hotlistnames]", names),
          variant: AlprGlobalConstants.TOASTER_ERROR_VARIANT,
        },toasterRef);
      }else if(error && error.response && error.response.status == 403){
        alprToasterMessages?.({
          message: t("Hotlist_delete_failed_invalid_parameter"),
          variant:  AlprGlobalConstants.TOASTER_ERROR_VARIANT,
        },toasterRef);
      }
      else{
        alprToasterMessages?.({
          message: t("Hotlist_delete_failed"),
          variant:  AlprGlobalConstants.TOASTER_ERROR_VARIANT,
        },toasterRef);
      }

      
      return error;
    })
  }

  return (
    
    <React.Fragment>
    <CRXToaster ref={toasterRef}/>
      <CRXConfirmDialog
        className="crx-unblock-modal"
        title="Delete an Entry"
        setIsOpen={setIsOpen}
        onConfirm={onConfirm}
        isOpen={IsOpen}
        primary={primary}
        secondary={secondary}
      >
        {
          <>
            {showAlert && (
              <CRXAlert
                className="UserActionAlert"
                message={""}
                alertType="inline"
                type="error"
                open={showAlert}
                setShowSucess={() => null}
              />
            )}
            <div className="crxUplockContent">
              <p>
                {t("You_are_about_to_delete_")} <b>{row?.Name}</b> {t("this_entry")}
              </p>
            </div>
          </>
        }
      </CRXConfirmDialog>

      <div className="table_Inner_Action">

        <Menu
          key="right"
          align="center"
          viewScroll="close"
          direction="right"
          position="auto"
          offsetX={-15}
          offsetY={0}
          portal={true}
          className="menuCss "
          menuButton={
            <MenuButton>
              <i className="far fa-ellipsis-v"></i>
            </MenuButton>
          }
        >
          {selectedItems.length <= 1 ? (
            <MenuItem onClick={editHotList}>
              <Restricted moduleId={54}>
                <div className="crx-meu-content   crx-spac"  >
                  <div className="crx-menu-icon">
                    <i className="far fa-pencil"></i>
                  </div>
                  <div className="crx-menu-list">
                    {t("Edit_Hot_List")}
                  </div>
                </div>
              </Restricted>
            </MenuItem>
          ) : (
            <div></div>
          )}
          <MenuItem onClick={deleteHotlist}>
            <Restricted moduleId={11}>
              <div className="crx-meu-content" >
                <div className="crx-menu-icon"></div>
                <div className="crx-menu-list">{t("Delete")}</div>
              </div>
            </Restricted>
          </MenuItem>
        </Menu>
      </div>
    </React.Fragment>
  );
};
export default HotListActionMenu;