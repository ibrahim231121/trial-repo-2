import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import './CBXBreadcrumb.scss'

interface BreadcrumbProps {
    children : React.ReactNode,
}
const CRXBreadcrumb : React.FC<BreadcrumbProps>= ({children, ...others}) => {
  return (
    <Breadcrumbs {...others} className="CRXBreadcrumb" aria-label="breadcrumb">
      { children }
    </Breadcrumbs>
  );
}

export default CRXBreadcrumb;