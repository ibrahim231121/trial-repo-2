import { CRXBreadcrumb, CBXLink } from "@cb/shared";

const CRXActiveBreadcrumb = () => {
    return (
        <div className="CRXActiveBreadcrumb">
            <CRXBreadcrumb>
                <CBXLink className="brdLinks"  href="/" >
                    Home
                </CBXLink>
                <CBXLink  className="brdLinks active" href="#" >
                    Manage Assets
                </CBXLink>
            </CRXBreadcrumb>
        </div>
    )
}

export default CRXActiveBreadcrumb;