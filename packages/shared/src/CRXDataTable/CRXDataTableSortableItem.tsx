import React from 'react';
import { SortableElement } from "react-sortable-hoc";

const SortableItem = SortableElement(({value}: any, {index} : any) => (
    <li tabIndex={index}>
      {value}
    </li>
    
  ));

export default SortableItem;