const textDisplayStation = (text: string, classes: string | undefined) => {
    return <a href={'#'} className={"textDisplayStation " + classes}>{text}</a>;
}

export default textDisplayStation;