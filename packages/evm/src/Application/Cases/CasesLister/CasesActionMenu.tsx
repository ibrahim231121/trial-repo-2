import React, { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { CRXConfirmDialog } from '@cb/shared';
import { useDispatch, useSelector } from 'react-redux';
import './CasesActionMenu.scss';
import { useHistory } from 'react-router-dom';
import { urlList, urlNames } from '../../../utils/urlList';
import { getCasesInfoAsync } from '../../../Redux/CasesReducer';
import { CasesAgent } from '../../../utils/Api/ApiAgent';
import Restricted from "../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';
import CaseInternalSharingPermissionForm from '../CaseInternalSharingPermission/CaseInternalSharingPermissionForm';
import { getUsersInfoAsync } from "../../../Redux/UserReducer";
import { getGroupAsync } from '../../../Redux/GroupReducer';


type Props = {
  row?: any;
  menuItems?: any,
  offsetX?: number,
  offsetY?: number,
  className?: string,
  hasEditMenu: boolean,
  showToastMsg(obj: any): any;
};

const CasesActionMenu: React.FC<Props> = ({ row, menuItems, offsetX, offsetY, className, hasEditMenu, showToastMsg }) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [primary, setPrimary] = React.useState<string>('');
  const [secondary, setSecondary] = React.useState<string>('');
  const [modalType, setModalType] = React.useState<string>('');
  const [caseName, setCaseName] = useState<string>('')
  const selectedRowRef = useRef<any>(null);
  const history = useHistory();

  const caseActionMenuItemListRef = useRef<{label: string, icon: any, onClickHandler: (row?: any) => void}[]>([])
  const [createFormInternalSharing,setCreateFormInternalSharing] = useState<boolean>(false)
  
  const userPagerData = {
    gridFilter: {
      logic: "and", 
      filters: []
    },
    page: 0,
    size: 100,
    gridSort: {
      field: "LoginId",
      dir: "asc"
    }
  }

  useEffect(() => {
    if (row?.caseSummary?.length > 0)
      setCaseNameProcess(row?.caseSummary);
      selectedRowRef.current = row;
  }, [row]);

  const groupPagerData = {
    gridFilter: {
        logic: "and",
        filters: []
      },
      page: 0,
      size: 100,
      gridSort: {
        field: "Name",
        dir: "asc"
      }
}

  const updateOpenModel = () => {
    let modelOpen = true;
    setCreateFormInternalSharing(modelOpen);
    dispatch(getUsersInfoAsync(userPagerData));
    dispatch(getGroupAsync(groupPagerData))
  }

  useEffect(() => {
    caseActionMenuItemListRef.current = Array.isArray(menuItems) ? menuItems : [];
    if(hasEditMenu) {
      caseActionMenuItemListRef.current.unshift(
        {
          label: t('Edit_case'),
          icon: <i className='fas fa-pen'></i>,
          onClickHandler: openCaseDetailForm,
        }
      )
    }
    if(hasEditMenu) {
      caseActionMenuItemListRef.current.unshift(
        {
          label: t('Share_internal'),
          icon: <i className='fas fa-pen'></i>,
          onClickHandler: updateOpenModel,
        }
      )
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

  const getMenuItemContent = () => {
    return caseActionMenuItemListRef.current.map((item, idx: number) => {
      return (
        <MenuItem onClick={() => item.onClickHandler(row)} key={`${item.label}-${idx}`}>
          <Restricted moduleId={19}>
          <div className='crx-meu-content groupingMenu crx-spac osama'>
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
        createFormInternalSharing &&
       (<CaseInternalSharingPermissionForm id={0}  title={t("Share_Case_Internal")} openModel={updateOpenModel} formValues={selectedRowRef.current}/>)
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
            <MenuButton>
              <i className='far fa-ellipsis-v'></i>
            </MenuButton>
          }>
          {/* <MenuItem onClick={openCaseDetailForm}>
            <Restricted moduleId={19}>
              <div className='crx-meu-content groupingMenu crx-spac osama'>
                <div className='crx-menu-icon'>
                  <i className='fas fa-pen'></i>
                </div>
                <div className='crx-menu-list'>{t("Edit_case")}</div>
              </div>

            </Restricted>
          </MenuItem> */}
          { getMenuItemContent() }
          {/* <MenuItem onClick={openCaseDeleteForm}>
            <Restricted moduleId={20}>
              <div className='crx-meu-content groupingMenu crx-spac osama'>
                <div className='crx-menu-icon'>
                  <i className='fas fa-trash-alt'></i>
                </div>
                <div className='crx-menu-list'>{t("Delete_case")}</div>
              </div>
            </Restricted>
          </MenuItem> */}
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
}

export default CasesActionMenu;