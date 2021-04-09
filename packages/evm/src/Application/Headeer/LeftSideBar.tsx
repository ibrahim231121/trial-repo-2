import React from "react";
import { CRXDrawer, CRXIcon } from '@cb/shared'
import CRXLefNavigation from './Navigation'
const ToggleButton = <CRXIcon className="toggleIcon"> <i className="fas fa-bars"></i> </CRXIcon>
const CRXLeftSideBar = () => {
    return (
        <CRXDrawer
        className="CRXLeftPanel"
        anchor="left"
        button={ToggleButton}
        >
            <CRXLefNavigation />
        </CRXDrawer>
    )
}

export default CRXLeftSideBar;