import React, { useEffect, useState } from "react";
import { CRXBreadcrumb, CBXLink, CRXTitle } from "@cb/shared";
import clsx from "clsx";
import { CRXPanelStyle } from "@cb/shared";
import { withRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { urlList, urlNames } from "../../../utils/urlList"

type BreadCrumbItem = {
  type: string,
  routeTo: string,
  label: string
}

const Breadcrumb: React.FC<any> = (props) => {
  console.log("In BreadCrumb",props)

  const [urlPath, setUrlPath] = React.useState("")
  const { location: { pathname }, } = props;
  const [width, setWidth] = React.useState<number>(window.innerHeight);
  const [otherLabels, setOtherLabels] = React.useState<string>("")

  const breadCrumbValueRedux = useSelector((state: any) => state.pathName);
  // const breadCrumbPathRedux: any = {
  //   name: urlNames.assets,
  //   url: "/assets",
  //   details: [
  //     { routeTo: "/assets", type: "CBXLink", label: "Assets", },
  //     { type: "text", label: breadCrumbValueRedux, }
  //   ],
  // }

  React.useEffect(() => {
    setOtherLabels("")
    console.log("In BreadCrumb 2")
  },[])

  React.useEffect(() => {
    if (breadCrumbValueRedux) {
      setOtherLabels(breadCrumbValueRedux)
    }
  },[breadCrumbValueRedux])

  React.useEffect(() => {
    
    let lastQueryParam = pathname.substring(props.location.pathname.lastIndexOf('/') + 1);
    
    if (!isNaN(lastQueryParam)) {
      
      //if id comes at the end so remove it, because urllist dont have dynamic route
      lastQueryParam = pathname.substring(0, props.location.pathname.lastIndexOf('/')) + "/:id"
      console.log("Hello1",lastQueryParam)
      setUrlPath(lastQueryParam)
    }
    else {
      console.log("Hello2",pathname)
      setUrlPath(pathname)
    }

    if (pathname[pathname.length - 1] === "/") {
      setUrlPath(pathname.substring(0, pathname.length - 1))
    }
  }, [pathname])

  function debounce(fn: () => void, ms: number) {
    let timer: any = null
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn();
      }, ms); 
    };
  }

  React.useEffect(() => {
    const debouncedEvent = debounce(function handleResize() {
      setWidth(window.innerWidth);
    }, 1000);

    window.addEventListener("resize", debouncedEvent);
    return () => {
      window.removeEventListener('resize', debouncedEvent)
    }
  });

  const classes = CRXPanelStyle();

  const getTitle = () => {
    const paths = urlList.filter((item:any) => item.url === urlPath)[0].details;
    if (paths) {
      const pathName = paths[paths.length - 1].label
      return pathName
    }
    else
      return ""
  }

  const updatePathDetails = (pathDetails: any, Pathurl: string) => {
    console.log("path detail");
    let details = pathDetails.map((item:any) => {
      if(item === pathDetails[pathDetails.length-1]) {
        return {
          routeTo: Pathurl,
          type: "CBXLink",
          label: item.label
        }
      }
      else {
        return item
      }
    })
    return details
  }

  const getPaths = () => {
    let paths: BreadCrumbItem[] = urlList.filter((item:any) => item.url === urlPath)[0].details;
    let Pathurl =  urlList.filter((item:any) => item.url === urlPath)[0].url;
    if (breadCrumbValueRedux) {
      paths = updatePathDetails(paths, Pathurl)
    }
    return (
      paths && paths.map((path: BreadCrumbItem) => {
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
        }
      )
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
      {console.log("urlPath",urlPath)}
      {console.log("urlList.filter",urlList.filter((item:any) => item.url === urlPath)[0])}
      {urlList.filter((item:any) => item.url === urlPath)[0] &&
        <>
          <CRXBreadcrumb maxItems={width <= 650 ? 3 : 100}>
            <Link className="brdLinks breadCrumbItem" to="/">
              Home
            </Link>
            {getPaths()} 
            {otherLabels && <label>{otherLabels}</label>}
          </CRXBreadcrumb>
          <CRXTitle text={getTitle()} className="titlePage" />
        </>
      }
    </div>
  );
};

export default withRouter(Breadcrumb);
