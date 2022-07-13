import React, { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { CRXModalDialog, CRXToaster } from '@cb/shared';

import { CRXConfirmDialog, CRXAlert } from '@cb/shared';
import { updateUsersInfoAsync, getUsersInfoAsync } from '../../../Redux/UserReducer';
import { useDispatch } from 'react-redux';
import './StationActionMenu.scss';
import { useHistory } from 'react-router-dom';
import { urlList, urlNames } from '../../../utils/urlList';

import { BASE_URL_UNIT_SERVICE } from '../../../utils/Api/url'
import { getStationsInfoAsync } from '../../../Redux/StationReducer';
import Restricted from "../../../ApplicationPermission/Restricted";
import Cookies from 'universal-cookie';
import { useTranslation } from 'react-i18next';
import { EvidenceAgent } from '../../../utils/Api/ApiAgent';

type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
};

const cookies = new Cookies();

const StationActionMenu: React.FC<Props> = ({ selectedItems, row, showToastMsg }) => {
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);
  const { t } = useTranslation<string>();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [primary, setPrimary] = React.useState<string>('');
  const [secondary, setSecondary] = React.useState<string>('');
  const [modalType, setModalType] = React.useState<string>('');
  const [alert, setAlert] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const toasterRef = useRef<typeof CRXToaster>(null);
  const [stationName, setStationName] = useState<string>('')

  const unlockUser = () => {
    setTitle(t("Unlock_user_account"));
    setPrimary(t("Yes_unlock_user_account"));  
    setSecondary(t("No_do_not_unlock"));
    setIsOpen(true);
    setModalType(t("unlock"));
  };
  const deactivateUser = () => {
    setTitle(t("Deactivate_user_account"));
    setPrimary(t("Yes_deactivate_user_account"));
    setSecondary(t("No_do_not_deactivate"));
    setIsOpen(true);
    setModalType(t("deactivate"));
  };
  const dispatchNewCommand = (e: any) => {
    switch (modalType) {
      case 'unlock': {
        showToastMsg({ message: t("You_have_unlocked_the_user_account."), variant: 'success', duration: 7000 });
        break;
      }
      case 'deactivate': {
        showToastMsg({ message: t("You_have_deactivated_the_user_account"), variant: 'success', duration: 7000 });
        break;
      }
      default: {
        break;
      }
    }
    dispatch(e);
  };

  const isStationExistsInUnits = async () => {
    const url = BASE_URL_UNIT_SERVICE + '/Stations/' + `${row.id}` + '/Units'

    const res = await fetch(url, {
      method: 'Get',
      headers: { 'Content-Type': 'application/json', TenantId: '1' },
    })
    var response = await res.json();
    if (response != null && response.length > 0)
      return response.length
    else
      return 0
  }

  const isStationExistsInAssets = async () => {
    const url = '/Evidences/' + `${row.id}` + '/isStationExistsinEvidence?Page=1&Size=100'
    return await EvidenceAgent.isStationExistsinEvidence(url).then((response:number) => response);
  }

  const deleteStation = async () => {
    const url = BASE_URL_UNIT_SERVICE + '/Stations/' + `${row.id}`
    const res = await fetch(url, {
      method: 'Delete',
      headers: { 'Content-Type': 'application/json', TenantId: '1', 'Authorization': `Bearer ${cookies.get('access_token')}` },
    })
      .then(function (res) {
        if (res.ok) {
          setIsOpenDelete(false);
          toasterRef.current.showToaster({
            message: t("Station_deleted"), variant: "success", duration: 7000, clearButtton: true
          });
          dispatch(getStationsInfoAsync());
        }
        else //if (res.status == 500) {
          setAlert(true);
        setMessage(
          t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")
        );
      })
      .catch(function (error) {
        return error;
      });

  }

  const onConfirm = async () => {
    switch (modalType) {
      case 'unlock': {
        dispatch(
          updateUsersInfoAsync({
            dispatchNewCommand,
            userId: row?.id,
            columnToUpdate: '/account/status',
            valueToUpdate: 'Active'
          })
        );
        break;
      }
      case 'deactivate': {
        dispatch(
          updateUsersInfoAsync({
            dispatchNewCommand,
            userId: row?.id,
            columnToUpdate: '/account/status',
            valueToUpdate: 'Deactivated'
          })
        );
        break;
      }
      case 'delete': {
        let units = await isStationExistsInUnits();
        let assets = await isStationExistsInAssets();
        if (units > 0 || assets > 0) {
          setAlert(true);
          setMessage(t("The_station_cant_be_deleted__please_check_for_dependent_units_and_assets"))
        }
        else {
          await deleteStation();
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  const history = useHistory();

  const openStationDetailForm = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.adminStationCreate)[0].url}/${row?.id}`;
    history.push(path);
  };

  const defaultUnitTemplateClickHandler = () => {
    const path = `${urlList.filter((item: any) => item.name === urlNames.manageUnitDeviceTemplate)[0].url}`;
    history.push(path);
  }

  const openStationDeleteForm = () => {
    setTitle(t("Delete_station"));
    setModalType(t("delete"));
    setIsOpenDelete(true);
    setPrimary(t("Yes"));
    setSecondary(t("No"));
    setAlert(false);
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    dispatch(getUsersInfoAsync());
  };

  const setStationNameProcess = (text: string) => {
    let txt = text.split("_");
    setStationName(txt[0]);
  }

  useEffect(() => {
    if (row?.name.length > 0)
      setStationNameProcess(row?.name)
  }, [row])

  return (
    <>
      <CRXToaster ref={toasterRef} />
      <CRXConfirmDialog
        className='crx-unblock-modal'
        title={title}
        setIsOpen={setIsOpen}
        onConfirm={onConfirm}
        isOpen={isOpen}
        primary={primary}
        secondary={secondary}>
        {
          <div className='crxUplockContent'>
            <p>
            {t("You_are_attempting_to")} <b>{modalType}</b> {t("the_following_user_account")}:
            </p>
            <p>
              {row?.firstName} {row?.lastName}: <b>{row?.userName}</b>
            </p>
            <p>{t("Please_confirm_if_you_would_like_to")} {modalType} {t("this_user_account.")}</p>
          </div>
        }
      </CRXConfirmDialog>

      <CRXConfirmDialog
        title={title}
        setIsOpen={setIsOpenDelete}
        onConfirm={onConfirm}
        isOpen={isOpenDelete}
        primary={primary}
        secondary={secondary}>
        {
          <>
          {/* <CRXAlert
            message={message}
            alertType="inline"
            type="error"
            open={alert}
            setShowSucess={() => null}
          /> */}
          <div className='stationDeleteBody'>
            <div className="_station_delete_pera _station_delete_body_style">{t("You_are_attempting_to_delete_the_station")} <strong>`{stationName}`</strong>. {t("You_will_not_be_able_to_undo_this_action.")}</div>
            
            <div className="_station_delete_note _station_delete_body_style">{t("Are_you_sure_you_would_like_to_delete_the_station?")}</div>
          </div>
          </>

        }
      </CRXConfirmDialog>

      {row !== null ?
        <Menu
          align='start'
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
          <MenuItem onClick={openStationDetailForm}>
            <Restricted moduleId={19}>
              <div className='crx-meu-content groupingMenu crx-spac'>
                <div className='crx-menu-icon'>
                  <i className='fas fa-pen'></i>
                </div>
                <div className='crx-menu-list'>{t("Edit_station")}</div>
              </div>

            </Restricted>
          </MenuItem>
          <MenuItem onClick={openStationDeleteForm}>
            <Restricted moduleId={20}>

              <div className='crx-meu-content groupingMenu crx-spac'>
                <div className='crx-menu-icon'>
                  <i className='fas fa-trash'></i>
                </div>
                <div className='crx-menu-list'>{t("Delete_station")}</div>
              </div>

            </Restricted>
          </MenuItem>
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
          <MenuItem onClick={defaultUnitTemplateClickHandler}>
            <div className='crx-meu-content groupingMenu crx-spac'>
              <div className='crx-menu-icon'>
                <i className='fas fa-folder-open'></i>
              </div>
              <div className='crx-menu-list'>{t("View_default_unit_templates")}</div>
            </div>
          </MenuItem>
        </Menu>
      }
    </>
  );
};
export default StationActionMenu;
