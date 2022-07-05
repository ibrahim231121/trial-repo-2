import React from 'react';
import './InputShowHide.css';
type InputShowHideProps = {

}
const InputShowHide: React.FC<any> = ({ field, form }) => {
    const [showHideInputText, changeShowHideInputText] = React.useState(false);
    const hasError = form.touched[field.name] && form.errors[field.name];
    return (
        <>
            <input type={showHideInputText ? "text" : "password"} {...field} />
            <i className={"fa fa-key icon"}
                onClick={() => changeShowHideInputText(!showHideInputText)} style={{ cursor: 'pointer' }}>
                {showHideInputText ? "Hide" : "Show"}
            </i>
            {hasError && (
                <div className="errorStationStyle">
                    <i className="fas fa-exclamation-circle"></i>
                    {hasError}
                </div>
            )}
        </>
    );
}

export default InputShowHide;