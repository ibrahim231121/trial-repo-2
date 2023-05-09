import React, { useRef, useEffect } from 'react'

const Buffering = (props:any)  => {

  const {width, id} = props;
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draw = (ctx: { fillStyle: string; beginPath: () => void; arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void; fill: () => void }) => {
    ctx.beginPath()
  }
  
  
  useEffect(() => {
    var video = document.getElementById(id) as HTMLVideoElement
    const canvas:any = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#333';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#333';
    context.strokeStyle = '#333';
    var inc = canvas.width / width;

    for (let i = 0; i < video.buffered?.length; i++) {
      let startX = video.buffered.start(i) * inc;
      let endX = video.buffered.end(i) * inc;
      let width = endX - startX;

      context.fillRect(startX, 0, width, canvas.height);
      context.rect(startX, 0, width, canvas.height);
      context.stroke();
    };
    draw(context)
  }, [draw])
  return <canvas ref={canvasRef}  {...props}/>
}

export default Buffering