import { CRXTruncation } from "@cb/shared"
const textDisplay = (text: string, classes: string | undefined, placement? : string) => {
  return <div className={"dataTableText " + classes}>
    <CRXTruncation placement={placement} content={text}/>
    </div>;
};

export default textDisplay;
