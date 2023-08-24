import { CRXTruncation } from "@cb/shared"

const multitextDisplay = (text: any, classes: string | undefined, placement? : string) => {
    return (
        <div className={"dataTableEllipsesText " + classes}>
            <CRXTruncation placement={placement} maxWidth={300} content={text?.map((item: any) => item).join(", ")}/>
        </div>
    )
  };
  
  export default multitextDisplay;
  