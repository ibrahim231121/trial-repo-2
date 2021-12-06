import React, {forwardRef, useImperativeHandle} from 'react';
import '@material-ui/core'
import { useSnackbar } from "notistack/dist/index";
import './crxMsgToaster.scss'
type Props = {
    message : string,
    showBar : boolean,
    variant : any,
    duration : number
}

const CRXToaster = forwardRef((_, ref) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const action = (key:any) => (
        <>
            <button className="closeToaster" onClick={() => { closeSnackbar(key) }}>
                <i className="icon icon-cross2"></i>
            </button>
        </>
    );
    useImperativeHandle(ref, () => ({
        showToaster({message, variant, duration} : Props) {
            let customMssg = <div className="toasterContent"><span className={variant + "-stater"}>{variant + ":"}</span> {message}</div>;
            enqueueSnackbar(customMssg, {
                variant : variant,
                autoHideDuration : duration,
                preventDuplicate: false,
                action
            })
        }
      }));
    return (
        <>
        </>
    );
})

export default CRXToaster;