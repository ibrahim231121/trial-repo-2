import React from "react";
import { CRXBreadcrumb, CBXLink, CRXTitle } from "@cb/shared";
import clsx from "clsx";
import { CRXPanelStyle } from "@cb/shared";
import { withRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { enterPathActionCreator } from "../../Redux/pathNameReducer";

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
          key={name}
          to={routeTo}
          onClick={() => dispatch(enterPathActionCreator({ val: "" }))}
        >
          {name}
        </Link>
      );
    } else if (isLast && pathLastState.length == 0) {
      return <h5 key={name}>{name}</h5>;
    } else if (isLast && pathLastState.length != 0) {
      return (
        <div style={{ display: "flex" }}>
          <CBXLink key={name} href={routeTo}>
            {name}
          </CBXLink>
          /<h5 key={pathLastState}>{pathLastState}</h5>
        </div>
      );
    }
  };

  console.log(pathnames);
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
        <Link className="brdLinks" to="/">
          Home
        </Link>
        {pathnames.map((name: any, index: number) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          name = name.charAt(0).toUpperCase() + name.slice(1);
          return <div>{checkPath(isLast, name, routeTo)}</div>;
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
