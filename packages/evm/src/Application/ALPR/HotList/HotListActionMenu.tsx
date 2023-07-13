import React from "react";
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

type Props = {
  selectedItems?: any;
  row?: any;
  gridData: any;
  pageiGrid: PageiGrid;
  showToastMsg(obj:any): any;
};

const HotListActionMenu: React.FC<Props> = ({ selectedItems, row, gridData, pageiGrid, showToastMsg}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation<string>();
  const history = useHistory();
  const [primary, setPrimary] = React.useState<string>("");
  const [secondary, setSecondary] = React.useState<string>("");
  const [IsOpen, setIsOpen] = React.useState<boolean>(false);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  const editHotList = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.HotListDetail)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + row?.id, t("Edit Hot List"));
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
      showToastMsg?.({
        message: t("Hotlist_deleted"),
        variant: "success",
        duration: 7000,
        clearButtton: true
      });
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
        

        showToastMsg?.({
          message: t("Hotlist_delete_not_allowed").replace("[hotlistnames]", names),
          variant: "error",
          duration: 7000,
          clearButtton: true
        });
      }else if(error && error.response && error.response.status == 403){
        showToastMsg?.({
          message: t("Hotlist_delete_failed_invalid_parameter"),
          variant: "error",
          duration: 7000,
          clearButtton: true
        });
      }
      else{
        showToastMsg?.({
          message: t("Hotlist_delete_failed"),
          variant: "error",
          duration: 7000,
          clearButtton: true
        });
      }

      
      return error;
    })
  }

  return (
    <React.Fragment>
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
                {t("You are about to delete ")} <b>{row?.Name}</b> {t("this_entry")}
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
                    {t("Edit Hot List")}
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