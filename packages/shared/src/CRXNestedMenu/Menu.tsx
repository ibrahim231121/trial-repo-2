import React, { useState, useEffect } from 'react';
import { classNames } from './ClassNames';
import CRXMenuSub from './CRXMenuSub'
import { CSSTransition } from 'react-transition-group';
import UniqueComponentId from './UniqueComponentId';
import { Portal } from './Portal';
import './menu.scss'
type propsType = {
    popup? : boolean,
    model : any[],
    style? : React.CSSProperties,
    className? :  string,
    baseZIndex? : number,
    autoZIndex? : boolean,
    appendTo? : HTMLElement | null,
    disabled? : boolean
}
const CRXNestedMenu = ({popup = false, model, style, className, disabled , appendTo} : propsType) => {
    const menuRef:React.RefObject<any> = React.createRef();
    const [visible, setVisible] = useState<boolean>();

    const id:string = UniqueComponentId()

    const onEnter = () => {

    }
    const onEntered = () => {

    }

    const onExit = () => {

    }

    const onExited = () => {

    }

    const onPanelClick = () => {

    }

    useEffect(() => {
        setVisible(!popup)
    }, [visible])

    const renderElement = () => {
        
        const classDYNames : any = classNames('p-tieredmenu p-component', { 'p-tieredmenu-overlay': popup });
        return (
            <CSSTransition nodeRef={menuRef} classNames="p-connected-overlay" in={visible} timeout={{ enter: 120, exit: 100 }}
                unmountOnExit onEnter={onEnter} onEntered={onEntered} onExit={onExit} onExited={onExited}>
                <div ref={menuRef} id={id} className={classDYNames + " " + className} style={style} onClick={onPanelClick}>
                    <CRXMenuSub props model={model} root popup={popup} disabled ={disabled}/>
                </div>
            </CSSTransition>
        );
    }

    const element = renderElement();
    return (
        <>
        
        {popup ? <Portal element={element} appendTo={appendTo} /> : element }
        </>
    );

}

export default CRXNestedMenu;