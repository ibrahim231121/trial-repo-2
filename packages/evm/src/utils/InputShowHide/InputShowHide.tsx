import React from 'react';
import './InputShowHide.css';
import { useTranslation } from 'react-i18next';
type InputShowHideProps = {

}
const InputShowHide: React.FC<any> = ({ field, form }) => {
    const { t } = useTranslation<string>();
    const [showHideInputText, changeShowHideInputText] = React.useState(false);
    const hasError = form.touched[field.name] && form.errors[field.name];
    return (
        <>
            <input type={showHideInputText ? t("text") : t("password")} {...field} />
            <i className={"fa fa-key icon"}
                onClick={() => changeShowHideInputText(!showHideInputText)} style={{ cursor: 'pointer' }}>
                {showHideInputText ? t("Hide") : t("Show")}
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