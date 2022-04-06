import React from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { CRXModalDialog } from '@cb/shared';

import { CRXConfirmDialog } from '@cb/shared';
import { updateUsersInfoAsync, getUsersInfoAsync } from '../../../Redux/UserReducer';
import { useDispatch } from 'react-redux';
import './StationActionMenu.scss';
import { useHistory } from 'react-router-dom';
import { urlList, urlNames } from '../../../utils/urlList';
type Props = {
  selectedItems?: any;
  row?: any;
  showToastMsg(obj: any): any;
};

const StationActionMenu: React.FC<Props> = ({ selectedItems, row, showToastMsg }) => {
  const [open, setOpen] = React.useState(false);
  const [closeWithConfirm, setCloseWithConfirm] = React.useState(false);

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [primary, setPrimary] = React.useState<string>('');
  const [secondary, setSecondary] = React.useState<string>('');
  const [modalType, setModalType] = React.useState<string>('');

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

  const onConfirm = () => {
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

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
    dispatch(getUsersInfoAsync());
  };

  return (
    <>
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
          <div className='crx-meu-content groupingMenu crx-spac'>
            <div className='crx-menu-icon'>
              <i className='fas fa-pen'></i>
            </div>
            <div className='crx-menu-list'>Edit station</div>
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};
export default StationActionMenu;
