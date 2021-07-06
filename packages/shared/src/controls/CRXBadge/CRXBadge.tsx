import React from 'react';
import { Badge } from '@material-ui/core';
import './CRXBadge.scss';

type badgeProps = {
  className?: string;
  itemCount: number;
};

const CRXBadge: React.FC<badgeProps> = ({ className, itemCount, children }) => {
  const [invisible, setInvisible] = React.useState(true);
  const [colorClass] = React.useState('Grey');

  React.useEffect(() => {
    const checkVisiblity = itemCount > 0 ? false : true;
    setInvisible(checkVisiblity);
  }, [itemCount]);

  return (
    <>
      <Badge
        badgeContent={itemCount}
        invisible={invisible}
        color='primary'
        className={`CRXBadge CRXBadgeComponent-${colorClass}  ${className}`} >
        {children}
      </Badge>
    </>
  );
};

export default CRXBadge;
