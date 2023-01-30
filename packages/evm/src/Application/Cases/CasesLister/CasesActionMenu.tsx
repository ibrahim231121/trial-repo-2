import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { CRXConfirmDialog } from '@cb/shared';
import { useDispatch } from 'react-redux';
import './CasesActionMenu.scss';
import { useHistory } from 'react-router-dom';
import { urlList, urlNames } from '../../../utils/urlList';
import { getCasesInfoAsync } from '../../../Redux/CasesReducer';
import { CasesAgent } from '../../../utils/Api/ApiAgent';
import Restricted from "../../../ApplicationPermission/Restricted";
import { useTranslation } from 'react-i18next';

type Props = {
  row?: any;
  showToastMsg(obj: any): any;
};

const CasesActionMenu: React.FC<Props> = ({ row, showToastMsg }) => {
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [primary, setPrimary] = React.useState<string>('');
  const [secondary, setSecondary] = React.useState<string>('');
  const [modalType, setModalType] = React.useState<string>('');
  const [caseName, setCaseName] = useState<string>('')
  const history = useHistory();

  useEffect(() => {
    if (row?.caseSummary.length > 0)
      setCaseNameProcess(row?.caseSummary);
  }, [row]);

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
        size: 25
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
    const path = `${urlList.filter((item: any) => item.name === urlNames.createCase)[0].url}/${row?.id}`;
    history.push(path);
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
    return (
      <>
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
          className='menuCss caseActionMenu'
          offsetX={-18}
          offsetY={-24}
          portal={true}
          menuButton={
            <MenuButton>
              <i className='far fa-ellipsis-v'></i>
            </MenuButton>
          }>
          <MenuItem onClick={openCaseDetailForm}>
            <Restricted moduleId={19}>
              <div className='crx-meu-content groupingMenu crx-spac osama'>
                <div className='crx-menu-icon'>
                  <i className='fas fa-pen'></i>
                </div>
                <div className='crx-menu-list'>{t("Edit_case")}</div>
              </div>

            </Restricted>
          </MenuItem>
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