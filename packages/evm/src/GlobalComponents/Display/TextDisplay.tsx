const textDisplay = (text: string, classes: string | undefined) => {
  return <div className={"dataTableText" + classes}>{text}</div>;
};

export default textDisplay;
