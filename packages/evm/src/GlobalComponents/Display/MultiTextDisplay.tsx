const multitextDisplay = (text: any, classes: string | undefined) => {
    return (
        <div className={"dataTableSimpleText " + classes}>
            {text.map((item: any) => item).join(", ")}
        </div>
    )
  };
  
  export default multitextDisplay;
  