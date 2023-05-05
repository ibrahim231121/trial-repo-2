import React, { useEffect, useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { 
//     getCadGlobalDictionary
// } from "../../../Redux/CadSetupReducer";
import { useStyles } from "./cadSetupStyles";
import { CRXButton } from "@cb/shared";
import { RootState } from "../../../Redux/rootReducer";
import ConfigurationSettings from "./configurationSettings";
import MappingsTable from "./mappingsTable";

const CADSetup: React.FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [tabsContainerSize, setTabsContainerSize] = useState<any>('50%')
    const [xmlContainerSize, setXmlContainerSize] = useState<any>('50%')
    const [showXmlContainer, setShowXmlContainer] = useState<boolean>(true)
    const [showSettingsContent, setShowSettingsContent] = useState<boolean>(true)
    const [rootNode, setRootNode] = useState<string>('')
    // const cadGlobalFieldDictionary: any = useSelector((state: RootState) => state.cadSetupReducer.fieldMappingDictionary);

    useEffect(() => {
        // dispatch(getCadGlobalDictionary());
    }, [])

    // useEffect(() => {
    //     console.log(cadGlobalFieldDictionary)
    // }, [cadGlobalFieldDictionary])

    const openCADSettings = () => {
        if (!showXmlContainer) {
            setShowSettingsContent(true)
            setShowXmlContainer(true)
            setTabsContainerSize('50%')
            setXmlContainerSize('50%')
        } else {
            setShowSettingsContent(false)
            setShowXmlContainer(false)
            setTabsContainerSize('96.2%')
            setXmlContainerSize('3.8%')
        }
    }

    const getRootNode = (value: any) => {
        setRootNode(value)
    }

    return (
        <div className={classes.cadSetupMainContainer}>
            <div className={classes.mappingMainContainer}>
                <div className={classes.xmlContainer} style={{ width: xmlContainerSize }}>
                    <CRXButton
                        className={classes.settingsButton}
                        onClick={openCADSettings}
                        color='primary'
                        variant='contained'
                    > {showXmlContainer ? <i className="fas fa-angle-double-left" style={{ color: '#d1d2d4' }}></i> : <i className="fas fa-angle-double-right" style={{ color: '#d1d2d4' }}></i>}
                    </CRXButton>

                    {showSettingsContent && <ConfigurationSettings showSettingsContent={showSettingsContent} rootNode={getRootNode} />}
                </div>
                <div className={classes.tabsContainer} style={{ width: tabsContainerSize }}>
                    <MappingsTable extractedNode={rootNode} />
                </div>
            </div>
        </div>
    );
}

export default CADSetup