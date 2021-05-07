import { CRXBreadcrumb, CBXLink, CRXTitle } from "@cb/shared";
import clsx from 'clsx'
import { CRXPanelStyle } from "@cb/shared";

type propsType = {
    shiftContent? : boolean
}
const CRXActiveBreadcrumb = ({shiftContent = true} : propsType) => {
    const classes = CRXPanelStyle();
    return (
        <div className={"CRXActiveBreadcrumb " + clsx(classes.bradCrumscontent, {
            [classes.bradCrumscontentShift]: shiftContent,
          })}
        >
            <CRXBreadcrumb>
                <CBXLink className="brdLinks"  href="/" >
                    Home
                </CBXLink>
                <CBXLink  className="brdLinks active" href="#" >
                   Assets
                </CBXLink>
            </CRXBreadcrumb>
            <CRXTitle text="Assets" className="titlePage" />
        </div>
    )
}

export default CRXActiveBreadcrumb;