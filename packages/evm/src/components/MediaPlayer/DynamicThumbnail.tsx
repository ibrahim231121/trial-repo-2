import React, { useEffect, useRef, useState } from 'react';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { CRXAlert } from '@cb/shared';
import { TextField } from '@cb/shared';
import "./VideoPlayer.scss";


const DynamicThumbnail: React.FC = React.memo((props) => {
  
  return (
    <img src="https://www.w3schools.com/css/paris.jpg" alt="Paris" style={{width:"150px"}}/>
  );
});

export default DynamicThumbnail;