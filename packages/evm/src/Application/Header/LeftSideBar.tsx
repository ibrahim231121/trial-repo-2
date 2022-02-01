import React from "react";
import { CRXDrawer, CRXIcon, CRXFixedPanel } from '@cb/shared'
import CRXLefNavigation from './AppNavigation'
const ToggleButton = <CRXIcon className="toggleIcon"> <i className="fas fa-bars"></i> </CRXIcon>

interface propsTypes {
    onClick : (e : any) => void,
    onClose : (e : any) => void,
    open : boolean
}
const CRXLeftSideBar = ({onClick, onClose, open} : propsTypes) => {

    return (
        <CRXFixedPanel
        className="CRXLeftPanel"
        anchor="left"
        open={open}
        variant="persistent"
        onClick={onClick}
        onClose={onClose}
        >
            <CRXLefNavigation />
        </CRXFixedPanel>
       
    )
}

export default CRXLeftSideBar;