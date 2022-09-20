import React from 'react'

type ColProps = {
    className : string,
    children : any,
    sx : string | number
} 
const VideoColumn = ({className, children, sx} : ColProps) => {
    return (
        <div 
        className={'_video_grid_col ' + className  + " vid_col_" + sx}
        >
            {children}
        </div>
    )
}

export default VideoColumn