import { CRXTruncation } from "@cb/shared"
const textDisplay = (text: string, classes: string | undefined, placement? : string , addclass ? : string) => {
  return <div className={"dataTableText " + classes}>
    <CRXTruncation placement={placement} addclass={addclass} content={text} maxWidth = {380}/>
    </div>;
};

export default textDisplay;
