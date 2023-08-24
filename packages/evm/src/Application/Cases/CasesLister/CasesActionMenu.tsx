import React, { useEffect, useRef, useState,useCallback,useLayoutEffect } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { CRXConfirmDialog } from '@cb/shared';
import { useDispatch,useSelector } from 'react-redux';
import './CasesActionMenu.scss';
import { useHistory } from 'react-router-dom';
import { urlList, urlNames } from '../../../utils/urlList';
import { getCasesInfoAsync } from '../../../Redux/CasesReducer';
import { CasesAgent } from '../../../utils/Api/ApiAgent';
import Restricted from "../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import CaseInternalSharingPermissionForm from '../CaseInternalSharingPermission/CaseInternalSharingPermissionForm';
import { formatString, getCaseIdOpenedForEvidence, removeCaseIdOpenedForEvidence, setCaseIdOpenedForEvidence } from '../utils/globalFunctions';
import { CASE_ACTION_MENU_PARENT_COMPONENT, CASE_STATE, CASE_VIEW_TYPE } from '../CaseTypes';
import CaseClose from '../CaseClose/CaseClose';
import { EvidenceAgent } from '../../../utils/Api/ApiAgent';
import { setLoaderValue } from "../../../Redux/loaderSlice";
import { DownloadAuditTrail } from "../utils/AuditTrailPdfDownload";
import { RootState } from '../../../Redux/rootReducer';

type Props = {
  row?: any;
  menuItems?: any,
  offsetX?: number,
  offsetY?: number,
  className?: string,
  hasEditMenu: boolean,
  selectedItems?: any,
  parentComponent: CASE_ACTION_MENU_PARENT_COMPONENT,
  showToastMsg(obj: any): any;
  callBack?:()=> void;
};

const CasesActionMenu: React.FC<Props> = React.memo(({ row, menuItems, offsetX, offsetY, className, hasEditMenu, parentComponent, showToastMsg,callBack }) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [primary, setPrimary] = React.useState<string>('');
  const [secondary, setSecondary] = React.useState<string>('');
  const [modalType, setModalType] = React.useState<string>('');
  const [caseName, setCaseName] = useState<string>('');
  const selectedRowRef = useRef<any>(null);
  const caseCloseIdRef = useRef<any>(null);
  const history = useHistory();
  const assetDataRef = useRef<any[]>([]);
  const caseAuditRef = useRef<any[]>([]);
  const caseAssetRef = useRef<any[]>([]);
  

  const caseActionMenuItemListRef = useRef<{label: string, icon: any, onClickHandler: (row?: any) => void}[]>([])
  const [modelOpen, setModelOpen] = React.useState<boolean>(false);
  const [caseCloseModelOpen, setCaseCloseModelOpen] = React.useState<boolean>(false);
  const tenantSettingsKeyValues: any = useSelector((state: RootState) => state.tenantSettingsReducer.keyValues);
  
  useEffect(() => {
    if (row?.caseSummary?.length > 0)
      setCaseNameProcess(row?.caseSummary);
      selectedRowRef.current = row;
  }, [row]);

  const openModelInternalSharing = () => setModelOpen(!modelOpen);

  // const fetchAllCaseCloseData = async () => {
  //   await CasesAgent.getCaseCloseByCaseId(`/Case/${row?.id}/CaseClosed/0`)
  //   .then((response: any) => {
  //     if(response != null && Array.isArray(response)) {
  //       caseCloseIdRef.current = Number(response.map((x) => x.id).toString())
  //     }
  //     else {
  //       caseCloseIdRef.current = 0;
  //     }
  //     setCaseCloseModelOpen(!caseCloseModelOpen)
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   });
  // }

  const handleCaseCloseModal = (isOpen: boolean, isRefresh?: boolean) => {
    setCaseCloseModelOpen(Boolean(isOpen));
    if(isOpen === false && isRefresh === true && callBack)
    {      
      if ( typeof callBack === "function")
      {        
        callBack();     
      }
    }
  };

  const OnAuditTrailDownload = async ()  => {
      await CaseAuditData();
      if(!(row?.stateId == CASE_STATE.Closed)) {
        await CaseAssetData();
        await getAssetsTrail();
      }
      DownloadAuditTrail(row,caseAuditRef?.current,assetDataRef?.current, tenantSettingsKeyValues);
  }

  const CaseAuditData = async () => {
    if(row && row.id && row.id.length > 0) {
      const url = `/Case/${row.id}/CaseAudit/?Page=1&Size=1000`;
      dispatch(setLoaderValue({isLoading: true}));
      await CasesAgent.getAllCaseAudit(url)
      .then ((res :any) => {
        dispatch(setLoaderValue({isLoading: false}));
        if(res && res.data.length > 0) {
          caseAuditRef.current = res.data;
        }
      }).catch ((err:any) => {
        dispatch(setLoaderValue({isLoading: false}));
        showToastMsg({ message: err.response.data != null ? err.response.data : t('Something_went_wrong'), variant: "error" });
        console.error(err);
      })
    }
  }

  const CaseAssetData = async () => {
    if(row && row.id && row.id.length > 0) {
      const url = `/Case/${row?.id}/CaseAsset/?Page=1&Size=1000`
      await CasesAgent.getAllCaseAsset(url)
      .then((res : any) => {
        if(res && res.data.length > 0) {
          caseAssetRef.current = res.data;
        }
      }).catch ((err:any) => {
        showToastMsg({ message: err.response.data != null ? err.response.data : t('Something_went_wrong'), variant: "error" });
        console.error(err);
      })
    }
  }  
  const getAssetsTrail = useCallback(async () => {
    if(caseAssetRef.current && caseAssetRef.current.length > 0) {
      let evidenceIds = caseAssetRef.current.map((x:any) => x.evidenceId).join(',');
      let headers = [{ key: "EvidenceIds", value: evidenceIds }];
      let url = `/Evidences/MultipleAssetsTrail`
      dispatch(setLoaderValue({isLoading: true}));
      await EvidenceAgent.getMultipleAssetsTrail(url,headers).then((response) => {
        dispatch(setLoaderValue({isLoading: false}));
        if (response != null && response != undefined) 
        {
          let auditList = Object.entries(response).map((x) => {
            return {
                evidenceId : x[0],
                auditData : x[1]
              }
          })
          assetDataRef.current = auditList;
        }
      }).catch((e:any) => {
        dispatch(setLoaderValue({isLoading: false})); 
        showToastMsg({ message: e.response.data != null ? e.response.data : t('Something_went_wrong'), variant: "error" });
        console.error(e);
      });
    }
}, []) 


  const setCaseNameProcess = (text: string) => {
    let txt = text.split("_");
    setCaseName(txt[0]);
  }
  
  const deleteCase = async () => {
    const url = '/Cases/' + `${row.id}`
    CasesAgent.deleteCase(url).then(() => {
      setIsOpenDelete(false);
      showToastMsg?.({
        message: t("Case_deleted"),
        variant: "success",
        duration: 7000,
        clearButtton: true
      });
      dispatch(getCasesInfoAsync({
        gridFilter: {
          logic: "and",
          filters: []
        },
        page: 0,
        size: 25,
      }));
    })
      .catch(function (error) {
        showToastMsg?.({
          message: t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator"),
          variant: "error",
          duration: 5000,
          clearButtton: true
        });
        return error;
      });
  }
  const openCaseDetailForm = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.editCase)[0].url}`;
    history.push(path.substring(0, path.lastIndexOf("/")) + "/" + selectedRowRef.current?.id);
  };
  // const openCaseDeleteForm = () => {
  //   setTitle(t("Delete_case"));
  //   setModalType(t("delete"));
  //   setIsOpenDelete(true);
  //   setPrimary(t("Yes"));
  //   setSecondary(t("No"));
  // };
  const onConfirm = async () => {
    switch (modalType) {      
      case 'delete': {     
        await deleteCase();        
        break;
      }
      default: {
        break;
      }
    }
  };

  const onOpenCloseCaseForEvidenceClick = () => {
    const caseValue = getCaseIdOpenedForEvidence();
    if(caseValue != null && row != null && row.id === caseValue.id) {
      removeCaseIdOpenedForEvidence();
      showToastMsg?.({
        message: formatString(t("Case_{0}_is_close_for_evidence"), caseValue?.title),
        variant: "success",
        duration: 7000,
        clearButtton: true
      });
      history.push(urlList.filter((item: any) => item.name === urlNames.cases)[0].url);
    }
    else {
      setCaseIdOpenedForEvidence(row.caseId);
      const idIndex = row.caseId.lastIndexOf("_");
      const caseTitle = row.caseId.substring(0, idIndex);
      showToastMsg?.({
        message: formatString(t("Case_{0}_is_open_for_evidence"), caseTitle),
        variant: "success",
        duration: 7000,
        clearButtton: true
      });
      history.push(urlList.filter((item: any) => item.name === urlNames.cases)[0].url);
    }
  }

  const getOpenCaseForEvidenceContent = () => {
    const caseOpenedForEvidence = getCaseIdOpenedForEvidence();
    return (
    <MenuItem onClick={() => onOpenCloseCaseForEvidenceClick()}>
      <Restricted moduleId={0}>
        <div className='crx-meu-content groupingMenu crx-spac'>
          <div className='crx-menu-icon'>
            <i className='fas fa-pen'></i>
          </div>
          <div className='crx-menu-list'>
            {(caseOpenedForEvidence != null && row.id === caseOpenedForEvidence.id) ? t("Close_case_for_evidence") : t("Open_case_for_evidence")}
          </div>
        </div>
      </Restricted>
    </MenuItem>
    )
  }

  const onMenuButtonClick = () => {
    caseActionMenuItemListRef.current = Array.isArray(menuItems) ? menuItems : [];
    setIsOpen(true);
  }

  const getMenuItemContent = () => {
    return caseActionMenuItemListRef.current.map((item, idx: number) => {
      return (
        <MenuItem onClick={() => item.onClickHandler(row)} key={`${item.label}-${idx}`}>
          <Restricted moduleId={0}>
          <div className='crx-meu-content groupingMenu crx-spac'>
            <div className='crx-menu-icon'>
              {item.icon}
            </div>
            <div className='crx-menu-list'>{item.label}</div>
          </div>
          </Restricted>
        </MenuItem>
      )
    })
  }

    return (
      <>
      {
        modelOpen && row?.caseViewType == CASE_VIEW_TYPE.Contribute && 
       (<CaseInternalSharingPermissionForm id={0}  title={t("Share_Case_Internal")} openModel={openModelInternalSharing} formValues={selectedRowRef.current}/>)
      }
      {
        caseCloseModelOpen && 
        <CaseClose id ={selectedRowRef.current?.caseClosed[0]?.id ?? "0"} handleModal={(isRefresh: boolean) => handleCaseCloseModal(false, isRefresh)} caseId = {selectedRowRef.current?.id}  />
       
      }
      

      <CRXConfirmDialog
        title={title}
        setIsOpen={setIsOpenDelete}
        onConfirm={onConfirm}
        isOpen={isOpenDelete}
        primary="Yes, delete"
        secondary="No, do not delete"
      >
        <div className='caseDeleteBody'>
          <div className="_case_delete_pera _case_delete_body_style">You are attempting to <strong>delete</strong> the case <strong>`{caseName}`</strong>. {t("You_will_not_be_able_to_undo_this_action.")}</div>
          <div className="_case_delete_note _case_delete_body_style">Are you sure you would like to <strong>delete</strong> the case?</div>
        </div>
      </CRXConfirmDialog>
      
      {row !== null ?
        <Menu
          key="right"
          align='start'
          viewScroll='close'
          direction='right'
          position='auto'
          className={`menuCss ${className ?? 'caseActionMenu'}`}
          offsetX={offsetX ?? -18}
          offsetY={offsetY ?? -24}
          portal={true}
          menuButton={
            <MenuButton onClick={onMenuButtonClick}>
              <i className='far fa-ellipsis-v'></i>
            </MenuButton>
          }>
            { hasEditMenu === true && row?.caseViewType == CASE_VIEW_TYPE.Contribute ? (
              [
                getOpenCaseForEvidenceContent(),                              
                <MenuItem onClick={() => openModelInternalSharing()}>
                  <Restricted moduleId={80}>
                    <div className='crx-meu-content groupingMenu crx-spac'>
                      <div className='crx-menu-icon'>
                        <i className='fas fa-pen'></i>
                      </div>
                      <div className='crx-menu-list'>{t("Share_internal")}</div>
                    </div>
                  </Restricted>
                </MenuItem>,
                // <MenuItem onClick={() => {}}>
                //   <Restricted moduleId={82}>
                //     <div className='crx-meu-content groupingMenu crx-spac'>
                //       <div className='crx-menu-icon'>
                //         <i className='fas fa-pen'></i>
                //       </div>
                //       <div className='crx-menu-list'>{t("Share_external")}</div>
                //     </div>
                //   </Restricted>
                // </MenuItem>,
                // parentComponent === CASE_ACTION_MENU_PARENT_COMPONENT.CaseDetail ?
                //   <MenuItem onClick={() => {}}>
                //   <Restricted moduleId={0}>
                //     <div className='crx-meu-content groupingMenu crx-spac'>
                //       <div className='crx-menu-icon'>
                //         <i className='fas fa-pen'></i>
                //       </div>
                //       <div className='crx-menu-list'>{t("Share_selected_items")}</div>
                //     </div>
                //   </Restricted>
                //   </MenuItem>
                // : null,
                // <MenuItem onClick={() => {}}>
                //   <Restricted moduleId={0}>
                //     <div className='crx-meu-content groupingMenu crx-spac'>
                //       <div className='crx-menu-icon'>
                //         <i className='fas fa-pen'></i>
                //       </div>
                //       <div className='crx-menu-list'>{t("Share_with_DA")}</div>
                //     </div>
                //   </Restricted>
                // </MenuItem>,
                // <MenuItem onClick={() => {}}>
                //   <Restricted moduleId={0}>
                //     <div className='crx-meu-content groupingMenu crx-spac'>
                //       <div className='crx-menu-icon'>
                //         <i className='fas fa-pen'></i>
                //       </div>
                //       <div className='crx-menu-list'>{t("Request_evidence")}</div>
                //     </div>
                //   </Restricted>
                // </MenuItem>,
                <MenuItem onClick={() => { handleCaseCloseModal(true) }}>
                  <Restricted moduleId={83}>
                    <div className='crx-meu-content groupingMenu crx-spac'>
                      <div className='crx-menu-icon'>
                        <i className='fas fa-pen'></i>
                      </div>
                      <div className='crx-menu-list'>{t("Close_case")}</div>
                    </div>
                  </Restricted>
                </MenuItem>
              ])
            : row?.stateId == CASE_STATE.Closed ?
              ([
                <MenuItem onClick={() => {OnAuditTrailDownload()}}>
                  <Restricted moduleId={0}>
                    <div className='crx-meu-content groupingMenu crx-spac'>
                      <div className='crx-menu-icon'>
                        <i className='fas fa-pen'></i>
                      </div>
                      <div className='crx-menu-list'>{t("Download_audit_trail")}</div>
                    </div>
                  </Restricted>
                </MenuItem>
              ])
            : getMenuItemContent() }
        </Menu>
        :
        <Menu align='start'
          viewScroll='initial'
          direction='right'
          position='auto'
          className='menuCss'
          arrow
          menuButton={
            <MenuButton>
              <i className='far fa-ellipsis-v'></i>
            </MenuButton>
          }>
        </Menu>
      }
      </>
 
    );
})

export default CasesActionMenu;