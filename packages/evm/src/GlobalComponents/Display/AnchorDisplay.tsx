import { Link } from "react-router-dom";



export default (text: string, classes: string | undefined, urlPathName: string) => {

  let idIndex = text.lastIndexOf("_");

  let Id = text.substring(idIndex + 1, text.length);

  return <><Link to={urlPathName.substring(0, urlPathName.lastIndexOf('/'))  + "/" + Id} className={"linkColor" +  classes} >{text.substring(0, idIndex)}</Link>

   <div className="touch-baseLink">

    <Link to={urlPathName.substring(0, urlPathName.lastIndexOf('/'))  + "/" + Id}></Link>

    </div>

  </>

};