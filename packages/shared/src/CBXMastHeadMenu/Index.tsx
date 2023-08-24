import React, { useEffect, useState, useRef } from 'react'
import { Dropdown, DropdownMenuItem } from "./Dropdown";
import CRXTooltip from '../controls/CRXTooltip/CRXTooltip';
import "./mastHeadMenu.scss"

interface MenuTypes {
    model : any,
    activeSelection : any,
    setActiveSelection : any

}
const CBXMastHeadMenu = ({model, setActiveSelection, activeSelection} : MenuTypes) => {
    const [winSize, setWinSize] = useState<number>()
    const [isMoreActive, setIsMoreActive] = useState<boolean>(false)
    const mastHeadRefs = useRef<any>()

    const ResizeWindow = () => {
        setIsMoreActive(false)
        setWinSize(window.innerHeight)
    }

    useEffect(() => {

        ResizeWindow()
            window.addEventListener("resize", ResizeWindow, false);

        return () => {
            window.removeEventListener("resize", ResizeWindow, false);
        }

    }, [])

    const showMoreMenuItem = (name : any) => {
       
       let getItemId = model.length - 1
       let dataId:any = document.querySelector("#menuItem-" + getItemId);
       let homeId:any = document.querySelector("#" + name);
       
       if(isMoreActive == false) {
            setIsMoreActive(true)
            dataId.scrollIntoView({behavior:"smooth", block: "end", inline:"nearest"});
            
            homeId.style.position = "sticky";
       }else {
            setIsMoreActive(false)
            homeId.style.position = "relative"
            homeId.scrollIntoView({behavior:"smooth", block: "end", inline:"nearest"});
       }
    }

    const RenderMenu = (list : any) => {

        const CreatingMenu = list && list.map((x : any, index : number) => {
           
            if(x.items != undefined) {
            return (<Dropdown
            trigger={<div id={"menuItem-" + index} className={`menu-nested-items  ${activeSelection == x.label ? "selectedItem" : "" } ${isMoreActive && "addPaddingBottom"}`}>
                    <div className='menu-icon'>
                        <i className={x.icon}></i>
                        <i className='fas fa-caret-right rightArrowIcon'></i>
                    </div>
                    <div className='menu-label'>{x.label}</div>
                </div>}
            menu = {[
                x.items.map((d : any, _ : any) => {
                 return (   <DropdownMenuItem
                            onClick={() => { d.command(); return setActiveSelection(x.label)} }>
                                {d.label}
                            </DropdownMenuItem> )
                    })
                ]}
            />)
           
            }else {
                return (<DropdownMenuItem
                    id={"menuItem-" + index}
                    selected = {activeSelection == x.label ? true : false }
                    onClick ={() => {
                        if(x.command != undefined && typeof x.command === 'function') {
                            x.command(); return setActiveSelection(x.label)
                        } 
                    }}> 
                        <div className='menu-items'>
                            <div className='menu-icon'><i className={x.icon}></i></div>
                            <div className='menu-label'>{x.label}</div>
                        </div>
                    </DropdownMenuItem>)
            }
        })
        
        return CreatingMenu;
    }
    return (
        <>
        <div className="mast-head-menu" ref={mastHeadRefs}>
            {RenderMenu(model)}
        </div>
        { winSize && winSize < 630 ? <div className='seeMoreMenuItem'>
           
           {isMoreActive == false ? 
            <CRXTooltip
                iconName="fas fa-chevron-up"
                arrow={false}
                title="see more"
                placement="top"
                className="moreMenuItems"
                disablePortal={false}
                content={ <button onClick={() => { showMoreMenuItem("menuItem-0") }}><i className='fa-solid fa-chevron-down iconSeeMore'></i></button>}
            />
           : <CRXTooltip
                iconName="fas fa-chevron-up"
                arrow={false}
                title="see less"
                placement="top"
                className="moreMenuItems"
                disablePortal={false}
                content={ <button onClick={() => { showMoreMenuItem("menuItem-0") }}><i className='fa-solid fa-chevron-up iconSeeMore'></i></button>}
       />}
        </div> : ""}
        </>
    )
}

export default CBXMastHeadMenu;

