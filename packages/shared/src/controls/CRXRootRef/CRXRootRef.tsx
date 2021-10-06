import React from 'react';
import RootRef from "@material-ui/core/RootRef";

interface Props {
    provided: any;
    children?: React.ReactNode;
  }

const CRXRootRef = ({provided,children} : Props) => {

    return (
        <>
        <RootRef rootRef={provided.innerRef}>
            {children}
            
        </RootRef>
        </>
    )
}

export default CRXRootRef;