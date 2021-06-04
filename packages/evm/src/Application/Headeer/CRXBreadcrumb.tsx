import React from "react";
import { CRXBreadcrumb, CBXLink, CRXTitle } from "@cb/shared";
import clsx from "clsx";
import { CRXPanelStyle } from "@cb/shared";
import { withRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../Redux/breadCrumbReducer";

const ActiveBreadcrumb: React.FC<any> = (props) => {
  const dispatch = useDispatch();
  const pathLastState = useSelector((state: any) => state.pathName);
  const {
    history,
    location: { pathname },
  } = props;
  const pathnames = pathname.split("/").filter((x: any) => x);

  const checkPath = (isLast: any, name: string, routeTo: string) => {
    if (!isLast) {
      return (
        <Link
          to={routeTo}
          onClick={() => dispatch(enterPathActionCreator({ val: "" }))}
        >
          {name}
        </Link>
      );
    } else if (isLast && pathLastState.length == 0) {
      return <a className="breadCrumbItem" key={name}>{name}</a>;
    } else if (isLast && pathLastState.length != 0) {
      return (
        <div>
          <CBXLink className="active" key={name} href={routeTo}>
            {name}
          </CBXLink> 
           <span className="spratorBread">/</span> <a className="breadCrumbItem" key={pathLastState}>{pathLastState}</a>
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
      <CRXBreadcrumb>
        <Link className="brdLinks breadCrumbItem" to="/">
          Home
        </Link>
        {pathnames.map((name: any, index: number) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          name = name.charAt(0).toUpperCase() + name.slice(1);
          return <span>{checkPath(isLast, name, routeTo)}</span>;
        })}
      </CRXBreadcrumb>
      <CRXTitle
        text={
          pathnames.length > 0
            ? pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1)
            : "Home"
        }
        className="titlePage"
      />
    </div>
  );
};

export default withRouter(ActiveBreadcrumb);
