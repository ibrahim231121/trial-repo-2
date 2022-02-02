import React, { useEffect } from 'react'
import { CRXTabs, CrxTabPanel, CRXRows, CRXColumn } from "@cb/shared";
import {  Menu, MenuButton , MenuItem } from "@szhsin/react-menu";
import { CBXLink } from "@cb/shared";
import "./assetDetailTemplate.scss";
import { useHistory, useParams } from "react-router";
const AssetDetailsTemplate = (props: any) => {
    const [value, setValue] = React.useState(0);
    const history = useHistory();
    function handleChange(event: any, newValue: number) {
        setValue(newValue);
    }
    useEffect(() => {
        document.title += " - " + props.match.params.id
    }, [])
    const tabs = [
        { label: "Map", index: 0 },
        { label: "Related Assets", index: 1 },
    ];

    return (
        
       
            <div style={{ marginTop: '105px' }}>
                <div className='CRXAssetDetail' >
        <Menu
                align="start"
                viewScroll="initial"
                direction="bottom"
                position="auto"
               
                arrow
                menuButton={
                    <MenuButton>
                        <i className="fas fa-ellipsis-h"></i>
                    </MenuButton>
                }
            >
            <MenuItem >
                {/* <Link to="/admin/unitsdevicestemplate/clonetemplate"> */}
                <div className="crx-meu-content groupingMenu crx-spac">
                <div className="crx-menu-icon">
                </div>
                <div className="crx-menu-list">Add to asset bucket</div>
                </div>
                {/* </Link>     */}
            </MenuItem>
            <MenuItem >
                <div className="crx-meu-content groupingMenu crx-spac">
                <div className="crx-menu-icon">
                </div>
                <div className="crx-menu-list">Categorize</div>
                </div>
            </MenuItem>
            </Menu >
            <CBXLink  children = "Exit"   onClick={() => history.goBack()} />
        </div>
 
           
            <CRXRows container spacing={0}  style={{ marginTop:'50px' ,marginRight:"50px"}}>
                <CRXColumn item xs={6}  >
                    <div>
                        Video Player Container
                    </div>
                </CRXColumn>
                <CRXColumn item xs={4} className='topColumn'>
                    <div className="tabCreateTemplate">
                        <CRXTabs value={value} onChange={handleChange} tabitems={tabs} />
                        <div className="tctContent">
                            <CrxTabPanel value={value} index={0}  >
                                <div>Map</div>
                            </CrxTabPanel>

                            <CrxTabPanel value={value} index={1}  >
                                <div>Test</div>
                            </CrxTabPanel>
                        </div>
                    </div>
                </CRXColumn>
            </CRXRows>

</div>
       
       

    )
}

export default AssetDetailsTemplate
