import React, { useEffect, useState } from "react";
import { CRXBreadcrumb, CBXLink, CRXTitle } from "@cb/shared";
import clsx from "clsx";
import { CRXPanelStyle } from "@cb/shared";
import { withRouter, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../../Redux/breadCrumbReducer";
import { urlList, urlNames } from "../../../utils/urlList"
import { useTranslation } from "react-i18next";
import { RootState } from "../../../Redux/rootReducer";

type BreadCrumbItem = {
  type: string,
  routeTo: string,
  label: string
}

const Breadcrumb: React.FC<any> = (props) => {
  
  const { t } = useTranslation<string>();
  const [urlPath, setUrlPath] = React.useState("")
  const { location: { pathname }, } = props;
  const [width, setWidth] = React.useState<number>(window.innerHeight);
  const [otherLabels, setOtherLabels] = React.useState<string>("")
  const [assetClass,setAssetClass] = React.useState<string>("")

  const breadCrumbValueRedux = useSelector((state: any) => state.pathName);
  const isPrimaryAsset: boolean = useSelector((state: RootState) => state.AssetDetailPrimaryBreadcrumbSlice.isPrimaryAsset);

  React.useEffect(() => {
    setOtherLabels("")
    
  },[])

  React.useEffect(() => {
      setOtherLabels(breadCrumbValueRedux)
  },[breadCrumbValueRedux])

  React.useEffect(() => {
    
    let lastQueryParam = pathname.substring(props.location.pathname.lastIndexOf('/') + 1);
    
    if (!isNaN(lastQueryParam)) {
      
      //if id comes at the end so remove it, because urllist dont have dynamic route
      lastQueryParam = pathname.substring(0, props.location.pathname.lastIndexOf('/')) + "/:id"
      
      setUrlPath(lastQueryParam)
    }
    else {
      
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
      const pathName = (otherLabels 
                     && otherLabels !== t("Search_Results") ? otherLabels  
                     :
                     paths[paths.length - 1].label && paths[paths.length - 1].label == t("Search_Results") ? paths[paths.length - 2].label : paths[paths.length - 1].label) 

      return pathName
    }
    else
      return ""
  }

  const updatePathDetails = (pathDetails: any, Pathurl: string) => {
    
    let details = pathDetails.map((item:any) => {
      if(item === pathDetails[pathDetails.length-1]) {
        return {
          routeTo: (item.routeTo === undefined) ? Pathurl : item.routeTo,
          type: "link",
          label: item.label
        }
      }
      else {
        return item
      }
    })
    return details
  }

  const homePageLinks = ["/assets"]

  const getPaths = () => {
    let paths: BreadCrumbItem[] = urlList.filter((item:any) => item.url === urlPath)[0].details;
    let Pathurl =  urlList.filter((item:any) => item.url === urlPath)[0].url;
    if (breadCrumbValueRedux) {
      
      paths = updatePathDetails(paths, Pathurl)
    }
    return (
      paths && paths.map((path: BreadCrumbItem, index: number) => {
          if (path.type === "link") {
            return (
              <Link 
                key={index} className="brdLinks breadCrumbItem" 
                to={path.routeTo}
                //to={homePageLinks.includes(path.routeTo) ? "/" : path.routeTo}
              >
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
  let location: any = useLocation();
  useEffect(()=>{
    
    let pageDetailClass = location.pathname.split("/").includes("assetdetail");
    setAssetClass(pageDetailClass ? "assetDetail_Title" : "page_Title");

    let pathBody = document.querySelector("body");
    let path = window.location.pathname;
    let htmlElement: any = document.querySelector("html");
    
    if (path == urlList.filter((item: any) => item.name === urlNames.testVideoPlayer)[0].url) {
      pathBody?.classList.add("pathVideoPlayer");
      htmlElement.style.overflow = "hidden";
    } else if (path == urlList.filter((item: any) => item.name === urlNames.assetsDetail)[0].url) {
      pathBody?.classList.add("pathAssetDetail");
      htmlElement.style.overflow = "hidden";
    } else {
      pathBody?.classList.remove("pathVideoPlayer");
      pathBody?.classList.remove("pathAssetDetail");
      htmlElement.style.overflow = "auto";
    }

  },[location])

  return (
    <div
      className={
        "CRXActiveBreadcrumb " +
        clsx(classes.bradCrumscontent, {
          [classes.bradCrumscontentShift]: props.shiftContent,
        })
      }
    >
      {urlList.filter((item:any) => item.url === urlPath)[0] &&
        <>
          <CRXBreadcrumb maxItems={width <= 650 ? 3 : 100}>
            <Link className="brdLinks breadCrumbItem" to="/assets/">
              {t("Home")}
            </Link>
            {getPaths()} 
            {otherLabels && <label>{otherLabels}</label>}
          </CRXBreadcrumb>
          <div className={`titlePrimaryBtn ${assetClass}`}>
          <CRXTitle key={otherLabels} text={getTitle()} className="titlePage" />
          {isPrimaryAsset && <div className="assetDetailPrimaryBtn">Primary</div> }
          </div>

        </>
      }
    </div>
  );
};

export default withRouter(Breadcrumb);
