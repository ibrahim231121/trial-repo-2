import { urlList, urlNames } from "../../utils/urlList"
const textDisplay = (text: string, classes: string | undefined) => {

  let idIndex = text.lastIndexOf("_");
  let groupId = text.substring(idIndex + 1, text.length);

  return <a href={urlList.filter((item:any) => item.name === urlNames.adminUserGroup)[0].url + "/" + groupId} className={classes} >{text.substring(0, idIndex)}</a>
};

export default textDisplay;
