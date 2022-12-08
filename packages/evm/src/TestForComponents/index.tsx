import React, { useState } from 'react';
import {
  TextField, CBXMultiSelectForDatatable, CBXMultiCheckBoxDataFilter,  NumberField
} from '@cb/shared';
import "./Test.scss"
const TabsDemo = () => {
 const [value, setValue] = React.useState<any>();
 const [val, setNumberVal] = useState<number>(1)
 const [values, setValues] = React.useState<any>();
 const [ShowHideTextVlaue, setShowHideText] = React.useState<boolean>(false);

 const [getVal, setGetVal] = React.useState([])
 const handleChange = (e : any) => {
  setValue(e.target.value);
 }
 const handleChanged = (e : any) => {
  setValues(e.target.value)
 }

  const changeEyeIcon =() => {
    setShowHideText(!ShowHideTextVlaue)
  }
  // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { value: 'The Shawshank Redemption', id: 1994 },
  { value: 'The Godfather', id: 1972 },
  { value: 'The Godfather: Part II', id: 1974 },
  { value: 'The Dark Knight', id: 2008 },
  { value: '12 Angry Men', id: 1957 },
  { value: "Schindler's List", id: 1993 },
  { value: 'Pulp Fiction', id: 1994 },
  { value: 'The Lord of the Rings: The Return of the King', id: 2003 },
  { value: 'The Good, the Bad and the Ugly', id: 1966 },
  { value: 'Fight Club', id: 1999 },
  { value: 'The Lord of the Rings: The Fellowship of the Ring', id: 2001 },
  { value: 'Star Wars: Episode V - The Empire Strikes Back', id: 1980 },
  { value: 'Forrest Gump', id: 1994 },
  { value: 'Inception', id: 2010 },
  { value: 'The Lord of the Rings: The Two Towers', id: 2002 },
  { value: "One Flew Over the Cuckoo's Nest", id: 1975 },
  { value: 'Goodfellas', id: 1990 },
  { value: 'The Matrix', id: 1999 },
  { value: 'Seven Samurai', id: 1954 },
  { value: 'Star Wars: Episode IV - A New Hope', id: 1977 },
  { value: 'City of God', id: 2002 },
  { value: 'Se7en', id: 1995 },
  { value: 'The Silence of the Lambs', id: 1991 },
  { value: "It's a Wonderful Life", id: 1946 },
  { value: 'Life Is Beautiful', id: 1997 },
  { value: 'The Usual Suspects', id: 1995 },
  { value: 'Léon: The Professional', id: 1994 },
  { value: 'Spirited Away', id: 2001 },
  { value: 'Saving Private Ryan', id: 1998 },
  { value: 'Once Upon a Time in the West', id: 1968 },
  { value: 'American History X', id: 1998 },
  { value: 'Interstellar', id: 2014 },
  { value: 'Casablanca', id: 1942 },
  { value: 'City Lights', id: 1931 },
  { value: 'Psycho', id: 1960 },
  { value: 'The Green Mile', id: 1999 },
  { value: 'The Intouchables', id: 2011 },
  { value: 'Modern Times', id: 1936 },
  { value: 'Raiders of the Lost Ark', id: 1981 },
  { value: 'Rear Window', id: 1954 },
  { value: 'The Pianist', id: 2002 },
  { value: 'The Departed', id: 2006 },
  { value: 'Terminator 2: Judgment Day', id: 1991 },
  { value: 'Back to the Future', id: 1985 },
  { value: 'Whiplash', id: 2014 },
  { value: 'Gladiator', id: 2000 },
  { value: 'Memento', id: 2000 },
  { value: 'The Prestige', id: 2006 },
  { value: 'The Lion King', id: 1994 },
  { value: 'Apocalypse Now', id: 1979 },
  { value: 'Alien', id: 1979 },
  { value: 'Sunset Boulevard', id: 1950 },
  { value: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', id: 1964 },
  { value: 'The Great Dictator', id: 1940 },
  { value: 'Cinema Paradiso', id: 1988 },
  { value: 'The Lives of Others', id: 2006 },
  { value: 'Grave of the Fireflies', id: 1988 },
  { value: 'Paths of Glory', id: 1957 },
  { value: 'Django Unchained', id: 2012 },
  { value: 'The Shining', id: 1980 },
  { value: 'WALL·E', id: 2008 },
  { value: 'American Beauty', id: 1999 },
  { value: 'The Dark Knight Rises', id: 2012 },
  { value: 'Princess Mononoke', id: 1997 },
  { value: 'Aliens', id: 1986 },
  { value: 'Oldboy', id: 2003 },
  { value: 'Once Upon a Time in America', id: 1984 },
  { value: 'Witness for the Prosecution', id: 1957 },
  { value: 'Das Boot', id: 1981 },
  { value: 'Citizen Kane', id: 1941 },
  { value: 'North by Northwest', id: 1959 },
  { value: 'Vertigo', id: 1958 },
  { value: 'Star Wars: Episode VI - Return of the Jedi', id: 1983 },
  { value: 'Reservoir Dogs', id: 1992 },
  { value: 'Braveheart', id: 1995 },
  { value: 'M', id: 1931 },
  { value: 'Requiem for a Dream', id: 2000 },
  { value: 'Amélie', id: 2001 },
  { value: 'A Clockwork Orange', id: 1971 },
  { value: 'Like Stars on Earth', id: 2007 },
  { value: 'Taxi Driver', id: 1976 },
  { value: 'Lawrence of Arabia', id: 1962 },
  { value: 'Double Indemnity', id: 1944 },
  { value: 'Eternal Sunshine of the Spotless Mind', id: 2004 },
  { value: 'Amadeus', id: 1984 },
  { value: 'To Kill a Mockingbird', id: 1962 },
  { value: 'Toy Story 3', id: 2010 },
  { value: 'Logan', id: 2017 },
  { value: 'Full Metal Jacket', id: 1987 },
  { value: 'Dangal', id: 2016 },
  { value: 'The Sting', id: 1973 },
  { value: '2001: A Space Odyssey', id: 1968 },
  { value: "Singin' in the Rain", id: 1952 },
  { value: 'Toy Story', id: 1995 },
  { value: 'Bicycle Thieves', id: 1948 },
  { value: 'The Kid', id: 1921 },
  { value: 'Inglourious Basterds', id: 2009 },
  { value: 'Snatch', id: 2000 },
  { value: '3 Idiots', id: 2009 },
  { value: 'Monty Python and the Holy Grail', id: 1975 },
];

const defaultValue = [
  {value: 'Monty Python and the Holy Grail', id: 1975}
]

const changeHanlder = (e : any, val : any) => {
  setGetVal(val)
}

const onSelectedClear = () => {
  setGetVal([])
}

  return (
    <>
    
    <div className="App" style={{ marginTop: "130px", marginLeft: "90px" }}>
      <div className="inlineDiv">
          <TextField 
            name="demo"
            type="number"
            value={value}
            onChange={(e : any) => handleChange(e)}
          />


          <TextField 
            name="demo"
            type={ShowHideTextVlaue == false ? "password" : "text"}
            value={values}
            eyeIcon={true}
            showHideText={ShowHideTextVlaue}
            showPassword={() => changeEyeIcon()}
            onChange={(e : any) => handleChanged(e)}
          />

          
      </div>
      {/* <CBXMultiSelectForDatatable option={top100Films} multiple={true} defaultValue={defaultValue} styled="checkBox" /> */}

      <div className='demoDiv'>
      <CBXMultiCheckBoxDataFilter 
      width = {300} 
      option={top100Films} 
      defaultValue={defaultValue} 
      value={getVal} 
      onChange={(e: any, value : any) => changeHanlder(e, value)}
      onSelectedClear = {() => onSelectedClear()}
      isCheckBox={false}
      multiple={true}
      
      />
      </div>
     
    </div>
    
    </>
  );
}

export default TabsDemo;