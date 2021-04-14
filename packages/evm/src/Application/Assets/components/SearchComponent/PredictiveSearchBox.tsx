import React, { useState, useRef } from "react";
import "./PredictiveSearchBox.scss";


interface Props {
  onSet: (e: any) => void;
}
const PredictiveSearchBox: React.FC<Props> = ({ children, onSet }) => {
  const [searchData, setSearchData] = useState<any>();
  const [searchQuerry, setSearchQuerry] = useState<any>();
  const [showSearch, setShowSearch] = useState<any>(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleOnChange = async (e: any) => {
    const { value } = e.target;
    onSet(value);
    // let emptyArray: string[] = [];
    // if (value) {
    //   emptyArray = DATA.filter((val) =>
    //     val.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
    //   );
    // }
    // setShowSearch(true)
    // setSearchData(emptyArray);
    setSearchQuerry(value);

    if (value.length > 2) {
     await fetchData();
    }
    setShowSearch(true);
  };
  const url = "/Evidence?Size=10&Page=1";
  const querry = {
    bool: {
      must: [
        {
          query_string: {
            query: `${searchQuerry}*`,
            fields: [
              "asset.assetName",
              "categories",
              "cADId",
              "asset.recordedBy",
            ],
          },
        },
      ],
    },
  };
  // fetchData
  const fetchData = () => {
    fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Group-Ids": "1,2,3,4,5",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(querry),
    })
      .then((response) => response.json())
      .then((res) => {
        setSearchData(res);
      });
    setShowSearch(true);
  };
  const handleClickOutSide = (e: MouseEvent) => {
    const { current: wrap } = wrapperRef;
    if (
      wrapperRef.current !== null &&
      !wrapperRef.current.contains(e.target as HTMLElement)
    ) {
      setShowSearch(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);
  // console.log(showSearch);
  // console.log(searchQuerry);
  return (
    <div className="wrapper" ref={wrapperRef}>
      <div className="search-input">
        <a href="" target="_blank" hidden></a>
        <input
          type="text"
          placeholder="Type to search.."
          onChange={handleOnChange}
        />
        <div className="autocom-box">
          {searchData &&
            showSearch &&
            searchQuerry &&
            searchData.map((e:any) => {
              
              if(e.asset.assetName.toLocaleLowerCase().includes(searchQuerry.toLocaleLowerCase()))
              {
                return <div>{e.asset.assetName}</div>
              }
              if(e.cadId.toLocaleLowerCase().includes(searchQuerry.toLocaleLowerCase()))
              {
                return <div>{e.cadId}</div>
              }
              if (e.categories.length>0) {
             
                e.categories.map((cat:any) => {
                  if(cat.toLocaleLowerCase().includes(searchQuerry.toLocaleLowerCase()))
                  {
                    return <div>{cat}</div>
                  }
                }
                )
              } 
              
             
//  else if(e.cadId.toLowerCase().includes(searchQuerry.split(" "))) return <div>e.cadId</div>
//  else if (e.asset.recordedBy.length > 0){
//    return e.asset.recordedBy.map((r:any) => {
//      if(r.toLowerCase().includes(searchQuerry))
//      {
//      return <div>{r}</div>;}

//    });
//  }

// return  <div tabIndex={-1}  className="option">
// {/* {val.asset.recordedBy.map((x: any) => (
//   <div>{x}</div>
// ))} */}
// {e.asset.assetName}
// </div>



            })
            }
        </div>
        {children}
      </div>
    </div>
  );
};

export default PredictiveSearchBox;

{
  /* <PredictiveSearchBox>
<button className="icon" onClick={() => alert()}>
  <TodayIcon />
</button>
</PredictiveSearchBox> */
}
