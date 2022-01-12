import React, { useState, createRef, useRef, useEffect } from 'react';
import { classNames } from './ClassNames';

type itemsProps = {
    disabled : string,
    style : object,
    command : (e : any) => void,
    items : any[],
    url : string,
    separator : string,
    icon : string,
    label : string,
    template : any,
    target : React.AnchorHTMLAttributes<HTMLAnchorElement> | any,
    className : string,
    classes? : string,
}

interface propsT {
    
    model : any[],
    root? : boolean,
    popup : boolean,
    iconClassName ? : string,
    props? : any,
    onLeafClick? : (e : any) => void,
    onKeyDown? : (e : any) => void,
    parentActive? :boolean,
    disabled? :boolean
}
const CRXMenuSub = ({model, root, popup, parentActive, disabled} : propsT) => {

    const [activeItem, setActiveItem] = useState<any>(null);
    let MeuRef : React.RefObject<any> = createRef();
    const ref : any = useRef();
    
    const renderSeparator = (index : number) => {
        return (
            <li key={'separator_' + index} className="p-menu-separator" role="separator"></li>
        );
    }

    const onLeafClick = () => {
        setActiveItem(
            null
        );
    }
    const onChildItemKeyDown = () => {

    }

    const onItemClick = (event: any, item : itemsProps) => {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url) {
            event.preventDefault();
        }

        if (item.command) {
            
            item.command({
                originalEvent: event,
                item: item
            });
        }

        if (root) {
            if (item.items) {
                if (activeItem && item === activeItem) {
                    setActiveItem(
                         null
                    );
                }
                else {
                    setActiveItem(item);
                }
            }
        }
        
        if (!item.items) {
            onLeafClick();
        }
    }

    const onItemMouseEnter = (event : any, item : itemsProps) => {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (root) {
            if (activeItem || popup) {
                setActiveItem(item);
            }
        }
        else {
            setActiveItem(item);
        }
    }
  
    const renderSubmenu = (item : itemsProps) => {
        if(item.items) {
            return (
                <CRXMenuSub 
                    model={item.items}
                    onLeafClick={onLeafClick}
                    popup={false}
                    onKeyDown={onChildItemKeyDown} 
                    parentActive={parentActive === activeItem}
                />
            );
        }

        return null;
    }

    const renderMenuitem = (item : itemsProps, index : number ) => {
        const active = activeItem === item;
        const className : any = classNames('p-menuitem', {'p-menuitem-active': active}, item.className);
        const linkClassName : any = classNames('p-menuitem-link', {'p-disabled': item.disabled});
        const iconClassName : any = classNames('p-menuitem-icon', item.icon);
        const submenuIconClassName = 'p-submenu-icon fas fa-caret-right';
        const icon = item.icon && <span className={iconClassName}></span>;
        const label = item.label && <span className="p-menuitem-text">{item.label}</span>;
        const submenuIcon = item.items && <span className={submenuIconClassName}></span>;
        const submenu = renderSubmenu(item);
        let content = (
            <a href={item.url || '#'} className={linkClassName + " " + item.classes} target={item.target} role="menuitem" aria-haspopup={item.items != null}
                onClick={(event) => onItemClick(event, item)} >
                {icon}
                {label}
                {submenuIcon}
                
            </a>
        );

        return (
            !disabled &&
            <li ref={ref} key={item.label + '_' + index} className={className}  style={item.style} onMouseEnter={(event) => onItemMouseEnter(event, item)} role="none">
                {content}
               {submenu}
            </li>
        );
    }

    const renderItem = (item : itemsProps, index : any) => {
        if (item.separator)
            return renderSeparator(index);
        else
            return renderMenuitem(item, index);
    }

    const renderMenu = () => {
        if (model) {
            return (
                model.map((item, index) => {
                    return renderItem(item, index);
                })
            );
        }

        return null;
    }
    
    const removeParent = () => {
        if(activeItem != null)
            setActiveItem(null)
    }

    useEffect(() => {
        if(activeItem != null) {
            document.addEventListener('mousedown', removeParent);
        }
        return () => {
            document.removeEventListener('mousedown', removeParent);
        }
    }, [activeItem])

    const className : any = classNames({'p-submenu-list': !root});
    const submenu = renderMenu();
    return (
        <>
        <ul ref={MeuRef} className={className} role={root ? 'menubar' : 'menu'} aria-orientation="horizontal">
                {submenu}
        </ul>
        </>
    )
}

export default CRXMenuSub;