const textDisplay = (text: string, classes: string | undefined) => {
  return <div className={"dataTableSimpleText " + classes}>{text}</div>;
};

export default textDisplay;
