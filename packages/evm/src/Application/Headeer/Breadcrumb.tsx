import React from "react";
import { CRXBreadcrumb, CBXLink, CRXTitle } from "@cb/shared";
import clsx from "clsx";
import { CRXPanelStyle } from "@cb/shared";
import { withRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../Redux/breadCrumbReducer";

const ActiveBreadcrumb: React.FC<any> = React.memo((props) => {
  const ref:any = React.useRef()
  const dispatch = useDispatch();
  const pathLastState = useSelector((state: any) => state.pathName);
  const [width, setWidth] = React.useState<number>(window.innerHeight);

  const {
    location: { pathname },
  } = props;
  const getPathnames = () => {
    if (pathnames.length <= 0) {
      return "Home"
    }
    if (pathnames[pathnames.length - 1] === "usergroups") {
      return "Manage User Groups & Permissions"
    }
    if (pathnames[pathnames.length - 1] === "createusergroup") {
      return "Create User Group"
    }
    return pathnames[pathnames.length - 1].charAt(0).toUpperCase() +
      pathnames[pathnames.length - 1].slice(1)
  }
  const getPathUrl = (name: string) => {
    switch (name) {
      case 'Admin':
        return <span>Admin</span>
      case 'Usergroups':
        return <a className="breadCrumbItem" key={name + 1}>
          Manage User Groups & Permissions
        </a>
      case 'Createusergroup':
        return <a className="breadCrumbItem" key={name}>
          Create User Group
        </a>
      default:
        break;
    }
  }
  const getPathName = (name: string) => {
    switch (name) {
      case 'Admin':
        return 'Admin'
      case 'Usergroups':
        return "Manage User Groups & Permissions";
      case 'Createusergroup':
        return "Create User Group"
      default:
        break;
    }
  }
  const getLink = (name: string, routeTo: string) => {
    if (name.toLowerCase() === "admin") {
      return <span className="CRXBreadcrumb span breadCrumbItem">Admin</span>
    }
    return (
      <Link
        to={routeTo}
        onClick={() => dispatch(enterPathActionCreator({ val: "" }))}
      >
        {getPathName(name)}
      </Link>);
  }
  function debounce(fn:()=>void, ms:number) {
    let timer:any=null
    return () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        fn()
      }, ms)
    };
  }


  React.useEffect(() => {
    const h= ref.current
    const debouncedEvent= debounce(function handleResize() {
      setWidth(window.innerWidth);
    },1000)

    window.addEventListener("resize", debouncedEvent);
    return ()=> {
      window.removeEventListener('resize', debouncedEvent)
    
}
  });

  const pathnames = pathname.split("/").filter((x: any) => x);
  const checkPath = (isLast: any, name: string, routeTo: string) => {

    if (!isLast) {
      return getLink(name, routeTo);
    } else if (isLast && pathLastState.length == 0) {
      return (
        getPathUrl(name)
      );
    } else if (isLast && pathLastState.length != 0) {
      return (
        <div>
          <CBXLink className="active" key={name} href={routeTo}>
            {name}
          </CBXLink>
          <span className="spratorBread">/</span>{" "}
          <span className="breadCrumbItem" key={pathLastState}>
            {pathLastState}
          </span>
        </div>
      );
    }
  };

  const classes = CRXPanelStyle();
  return (
    <div
      className={
        "CRXActiveBreadcrumb " +
        clsx(classes.bradCrumscontent, {
          [classes.bradCrumscontentShift]: props.shiftContent,
        })
      }
    >
      <CRXBreadcrumb maxItems={width <= 650 ? 3 : 100}>
        <Link className="brdLinks breadCrumbItem" to="/" >
          Home
        </Link>
        {pathnames.map((name: any, index: number) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          name = name.charAt(0).toUpperCase() + name.slice(1);
          return <span key={name} ref={ref}>{checkPath(isLast, name, routeTo)}</span>;
        })}
      </CRXBreadcrumb>
      <CRXTitle
        text={
          getPathnames()
        }
        className="titlePage"
      />
    </div>
  );
});

export default withRouter(ActiveBreadcrumb);
