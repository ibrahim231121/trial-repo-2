import React, { useEffect } from 'react'


const AssetDetailsTemplate= (props:any) => {

    useEffect(()=>{
        document.title += " - " + props.match.params.id
    },[])

    return (
        <div style={{margin:'225px'}}>
            Asset Detail Page
        </div>
    )
}

export default AssetDetailsTemplate
