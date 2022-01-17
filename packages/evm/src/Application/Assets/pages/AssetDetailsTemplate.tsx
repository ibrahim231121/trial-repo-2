import React, { useEffect } from 'react'
import { CRXTabs, CrxTabPanel, CRXRows, CRXColumn } from "@cb/shared";

const AssetDetailsTemplate = (props: any) => {
    const [value, setValue] = React.useState(0);
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
        <div style={{ margin: '225px' }}>
            Asset Detail Page

            <CRXRows container spacing={0}>
                <CRXColumn item xs={8} className='topColumn'>
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
