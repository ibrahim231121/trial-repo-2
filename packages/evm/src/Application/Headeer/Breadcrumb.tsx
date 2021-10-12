import React, { useEffect, useState } from "react";
import { CRXBreadcrumb, CBXLink, CRXTitle } from "@cb/shared";
import clsx from "clsx";
import { CRXPanelStyle } from "@cb/shared";
import { withRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../Redux/breadCrumbReducer";
import { urlList } from "../../utils/urlList"

type BreadCrumbItem = {
  type: string,
  routeTo: string,
  label: string
}

const Breadcrumb: React.FC<any> = (props) => {
const [urlPath,setUrlPath] =React.useState("")
  const {
    location: { pathname  },
  } = props;
  const [width, setWidth] = React.useState<number>(window.innerHeight);
React.useEffect(()=>{
  setUrlPath(pathname)

  if(pathname[pathname.length-1] === "/")
  {
    setUrlPath(pathname.substring(0, pathname.length-1))
  }
},[pathname])
  function debounce(fn:()=>void, ms:number) {
    let timer:any=null
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn();
      }, ms);
    };
  }

  React.useEffect(() => {
    const debouncedEvent= debounce(function handleResize() {
      setWidth(window.innerWidth);
    }, 1000);

    window.addEventListener("resize", debouncedEvent);
    return ()=> {
      window.removeEventListener('resize', debouncedEvent)
}
  });

  const breadCrumbValueRedux = useSelector((state: any) => state.pathName);
  const breadCrumbPathRedux :any={
  "/assets": [
      { routeTo: "/assets", type: "CBXLink", label: "Assets", },
      { type: "text",  label:breadCrumbValueRedux, }
    ],
  }

  const classes = CRXPanelStyle();

  const getTitle = () => {
    const paths = urlList[urlPath];
    if(paths)
    {
      const pathName = paths[paths.length - 1].label
      return pathName
    }
    else    
     return ""
  }

  const getPaths = () => 
  {
    let paths:BreadCrumbItem[] = urlList[urlPath];
    
    if(breadCrumbValueRedux){
      paths= breadCrumbPathRedux[urlPath]
    }
    return ( 
      paths && paths.map((path:BreadCrumbItem)=>{
        if (path.type === "link") {
          return ( 
            <Link className="brdLinks breadCrumbItem" to={path.routeTo}>
                {path.label}
            </Link>
          );
        } 
        else if (path.type === "text") {
          return ( 
            <span > 
              <label className="breadCrumbItem">{path.label}</label>
            </span>
          );
        } 
        else {
          return ( 
            <>
              <CBXLink className="active" href={path.routeTo}>
                  {path.label}
              </CBXLink>
              
            </>
          );
        }
      })
    )
  };

  return (
    <div
      className={
        "CRXActiveBreadcrumb " +
        clsx(classes.bradCrumscontent, {
          [classes.bradCrumscontentShift]: props.shiftContent,
        })
      }
    >
      {urlList[urlPath] &&
      <>
        <CRXBreadcrumb  maxItems={width <= 650 ? 3 : 100}>
          <Link className="brdLinks breadCrumbItem" to="/">
            Home
          </Link>

          { getPaths()}
        </CRXBreadcrumb>
        <CRXTitle text={getTitle()} className="titlePage"/>
      </>
      }
    </div>
  );
};

export default withRouter(Breadcrumb);
