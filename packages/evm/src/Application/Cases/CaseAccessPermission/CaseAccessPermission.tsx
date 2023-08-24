import { Link,useLocation } from "react-router-dom";
import './CaseAccessPermission.scss'
interface Type {
    pathname : string
 }

 let accessDenied = {
    heading : "Access Denied",
    subHeading : "You don't have permission to view this case."
 }

 let caseExpiry = {
    heading : "Case Expired",
    subHeading : "Sorry, the case has been expired."
 }

 const Content = (pathname:any) => {
    const content = pathname === '/accessDenied' ? accessDenied : caseExpiry
    return (
        <>
            <span className='PageHeading'>{content.heading}</span>
            <span className='PageFirst'>{content.subHeading}.<br/></span>
        </>
    )
 }

const CaseAccessPermission = () => {
    const { pathname } = useLocation<Type>();
    return (
        <div className="PageMain">
        {Content(pathname)}
        <span className='PageSuggestion'>Here are some suggestions:</span>
        <span >
         <ul>
             <li>Go back to the <Link to="/cases">Case Lister page</Link></li>
         </ul>
         </span> 
     </div>
    )
}

export default CaseAccessPermission
