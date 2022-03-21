import React, { useRef, useEffect } from 'react'

const Buffering = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.CanvasHTMLAttributes<HTMLCanvasElement>)  => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draw = (ctx: { fillStyle: string; beginPath: () => void; arc: (arg0: number, arg1: number, arg2: number, arg3: number, arg4: number) => void; fill: () => void }) => {
    ctx.beginPath()
  }
  
  useEffect(() => {
    var video = document.getElementById('Video-1') as HTMLVideoElement
    const canvas:any = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = 'green';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'grey';
    context.strokeStyle = 'green';
    var inc = canvas.width / video.duration;

   
      for (var i = 0; i < video.buffered.length; i++) {

        let startX = video.buffered.start(i) * inc;
        let endX = video.buffered.end(i) * inc;
        let width = endX - startX;

        context.fillRect(startX, 0, width, canvas.height);
        context.rect(startX, 0, width, canvas.height);
        context.stroke();
      
    };
    draw(context)
  }, [draw])
  return <canvas ref={canvasRef}  height="15" {...props}/>
}

export default Buffering