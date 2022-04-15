import React from "react";

interface loadingProps {
    className : string
    rect : boolean,
    width: number,
    height : number,
    viewBox : string,
    fill : string,
    d : string,
    crFill : string,
    transform: string,
}


const SVGImage = ({className, rect, width, height, viewBox, fill, d, crFill, transform} : loadingProps) => {
    const crValue:number = width / 2;
    return (
        <svg
            className={className}
            height={height}
            width={width}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
        >
        <circle  cx={crValue} cy={crValue} r={crValue} fill={crFill}
        />
        { rect && <rect width={width} height={height} transform={transform}/>} 
        <path
            transform={transform}
            fill={fill}
            d={d}
        />
        </svg>
      );
}

export default SVGImage;