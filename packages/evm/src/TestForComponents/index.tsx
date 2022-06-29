import React from 'react';
import {
  CRXMultiSelectBoxLight,
} from '@cb/shared';

interface renderCheck {
  inputValue? : string,
  label?: string,
  id?: number,
}

const TabsDemo = () => {

  const searchAbleOpt:renderCheck[] =  [
    { label: 'The Shawshank Redemption', id: 1994 },
    { label: 'The Godfather', id: 1972 },
    { label: 'The Godfather: Part II', id: 1974 },
    { label: 'The Dark Knight', id: 2008 },
    { label: '12 Angry Men', id: 1957 },
    { label: "Schindler's List", id: 1993 },
    { label: 'Pulp Fiction', id: 1994 },
    { label: 'The Good, the Bad and the Ugly', id: 1966 },
    { label: 'Fight Club', id: 1999 },
    { label: 'Naked weppan', id: 2000 },
    { label: 'Avengers', id: 2001 },
  ];
  
  const [singleSelect, setSingleSelect] = React.useState<renderCheck[]>();

  const onChangeSelectSingle = (e: React.SyntheticEvent, val: renderCheck[]) => {
    setSingleSelect(val);
  }

  return (
    <div className="App" style={{ marginTop: "130px", marginLeft: "90px" }}>
      <div className="inlineDiv">
        <div className="columnse">
          <CRXMultiSelectBoxLight
            id="multiSelect"
            multiple={true}
            value={singleSelect}
            onChange={(e: React.SyntheticEvent, option: renderCheck[]) => { return onChangeSelectSingle(e, option) }}
            options={searchAbleOpt}
            CheckBox={true}
            checkSign={false}
            required={true}
            freeSolo={true}
          />
        </div>
      </div>

    </div>
  );
}

export default TabsDemo;