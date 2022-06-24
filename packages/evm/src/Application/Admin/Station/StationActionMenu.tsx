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

import { BASE_URL_UNIT_SERVICE, EVIDENCE_SERVICE_URL } from '../../../utils/Api/url'
import { getStationsInfoAsync } from '../../../Redux/StationReducer';
import Restricted from "../../../ApplicationPermission/Restricted";
import Cookies from 'universal-cookie';

type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
};

const cookies = new Cookies();

const StationActionMenu: React.FC<Props> = ({ selectedItems, row, showToastMsg }) => {
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);

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
    setTitle('Unlock user account');
    setPrimary('Yes, unlock user account');
    setSecondary('No, do not unlock');
    setIsOpen(true);
    setModalType('unlock');
  };
  const deactivateUser = () => {
    setTitle('Deactivate user account');
    setPrimary('Yes, deactivate user account');
    setSecondary('No, do not deactivate');
    setIsOpen(true);
    setModalType('deactivate');
  };
  const dispatchNewCommand = (e: any) => {
    switch (modalType) {
      case 'unlock': {
        showToastMsg({ message: 'You have unlocked the user account.', variant: 'success', duration: 7000 });
        break;
      }
      case 'deactivate': {
        showToastMsg({ message: 'You have deactivated the user account.', variant: 'success', duration: 7000 });
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
    const url = EVIDENCE_SERVICE_URL + '/Evidences/' + `${row.id}` + '/isStationExistsinEvidence?Page=1&Size=100'
    const res = await fetch(url, {
      method: 'Get',
      headers: { 'Content-Type': 'application/json', TenantId: '1' },
    })
    var response = await res.json();
    return response
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
            message: "Station deleted", variant: "success", duration: 7000, clearButtton: true
          });
          dispatch(getStationsInfoAsync());
        }
        else //if (res.status == 500) {
          setAlert(true);
        setMessage(
          "We're sorry. The station was unable to be deleted. Please retry or contact your System Administrator."
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
          setMessage("The station can't be deleted, please check for dependent units and assets")
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
    setTitle("Delete station");
    setModalType("delete");
    setIsOpenDelete(true);
    setPrimary("Yes");
    setSecondary("No");
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
              You are attempting to <b>{modalType}</b> the following user account:
            </p>
            <p>
              {row?.firstName} {row?.lastName}: <b>{row?.userName}</b>
            </p>
            <p>Please confirm if you would like to {modalType} this user account.</p>
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
            <div className="_station_delete_pera _station_delete_body_style">You are attempting to delete the station <strong>`{stationName}`</strong>. You will not be able to undo this action.</div>
            
            <div className="_station_delete_note _station_delete_body_style">Are you sure you would like to delete the station?</div>
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
                <div className='crx-menu-list'>Edit station</div>
              </div>

            </Restricted>
          </MenuItem>
          <MenuItem onClick={openStationDeleteForm}>
            <Restricted moduleId={20}>

              <div className='crx-meu-content groupingMenu crx-spac'>
                <div className='crx-menu-icon'>
                  <i className='fas fa-trash'></i>
                </div>
                <div className='crx-menu-list'>Delete station</div>
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
              <div className='crx-menu-list'>View default unit templates</div>
            </div>
          </MenuItem>
        </Menu>
      }
    </>
  );
};
export default StationActionMenu;
