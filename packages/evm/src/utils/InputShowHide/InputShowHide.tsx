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
            <i className={ showHideInputText ? "fas fa-eye-slash passEyeIcon" : " fas fa-eye passEyeIcon"  }
                onClick={() => changeShowHideInputText(!showHideInputText)} style={{ cursor: 'pointer' }}>
                <span> {showHideInputText ? t("Hide") : t("Show")}</span> 
            </i>
            {hasError && (
                <div className="errorStationStyle passErrorStyle">
                    <i className="fas fa-exclamation-circle"></i>
                    {t(hasError)}
                </div>
            )}
        </>
    );
}

export default InputShowHide;