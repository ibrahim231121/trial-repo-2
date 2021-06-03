import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import './CBXBreadcrumb.scss'

interface BreadcrumbProps {
    children : React.ReactNode,
}
const CRXBreadcrumb = ({children} : BreadcrumbProps) => {
  return (
    <Breadcrumbs className="CRXBreadcrumb" aria-label="breadcrumb">
      { children }
    </Breadcrumbs>
  );
}

export default CRXBreadcrumb;