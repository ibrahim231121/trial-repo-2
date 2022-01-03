import { urlList, urlNames } from "../../utils/urlList"
const textDisplay = (text: string, classes: string | undefined) => {

  let idIndex = text.lastIndexOf("_");
  let groupId = text.substring(idIndex + 1, text.length);
  let subPath = urlList.filter((item:any) => item.name === urlNames.adminUserGroupId)[0].url

  return <a href={subPath.substring(0, subPath.lastIndexOf('/'))  + "/" + groupId} className={classes} >{text.substring(0, idIndex)}</a>
};

export default textDisplay;
