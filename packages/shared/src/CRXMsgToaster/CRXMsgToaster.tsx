import React, {forwardRef, useImperativeHandle} from 'react';
import '@material-ui/core'
import { useSnackbar } from "notistack/dist/index";
import './crxMsgToaster.scss';
import CRXTooltip from '../controls/CRXTooltip/CRXTooltip';
type Props = {
    message : string,
    showBar : boolean,
    variant : any,
    duration : number,
    persist? : boolean,
    TransitionComponent: any
    className? : string,
    isSessionExpired? : boolean
}

const CRXToaster : any = forwardRef((_, ref) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const action = (key:any) => (
        <div className='closeAction'>
            <CRXTooltip title="dismiss" disablePortal={true} arrow={false} placement='bottom' className='dismissIcon' content={
                <>
                    <button className="closeToaster" onClick={() => { closeSnackbar(key) }}>
                        <i className="icon icon-cross2"></i>
                    </button>
                </>
            }/>
        
        
        </div>
    );
  
    useImperativeHandle(ref, () => ({
        
        showToaster({message, variant,className, duration, TransitionComponent, persist = false, isSessionExpired} : Props) {
            let customMssg = <div className="toasterContent"><span className={className + " " + variant + "-stater"}>{variant + ":"}</span> {message}</div>;
            enqueueSnackbar(customMssg, {
                variant : variant,
                className: className,
                autoHideDuration : duration,
                preventDuplicate: false,
                persist: persist,
                TransitionComponent: TransitionComponent,
                action
            })
            if(isSessionExpired === true) {
                closeSnackbar()
            }
        }
        
      }));
    return (
        <div>
        </div>
    );
})

export default CRXToaster;