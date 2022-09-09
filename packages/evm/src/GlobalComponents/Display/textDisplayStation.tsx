import { Link } from "react-router-dom";

const textDisplayStation = (text: string, classes: string | undefined) => {
    return <Link to={'#'} className={"textDisplayStation " + classes}>{text}</Link>;
}

export default textDisplayStation;