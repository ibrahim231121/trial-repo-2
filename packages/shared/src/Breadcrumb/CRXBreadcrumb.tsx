import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

interface BreadcrumbProps {
    children : React.ReactNode,
}
const CRXBreadcrumb = ({children} : BreadcrumbProps) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      { children }
    </Breadcrumbs>
  );
}

export default CRXBreadcrumb;