import { urlList } from "../../utils/urlList"
const textDisplay = (text: string, classes: string | undefined) => {

  let idIndex = text.lastIndexOf("_");
  let groupId = text.substring(idIndex + 1, text.length);

  return <a href={Object.entries(urlList)[5][0].toString() + "/" + groupId} className={classes} >{text.substring(0, idIndex)}</a>
};

export default textDisplay;
