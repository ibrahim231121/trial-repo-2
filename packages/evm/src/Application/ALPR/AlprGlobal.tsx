

export const alprToasterMessages = (obj: any,messageFormReference:any) => {
   messageFormReference.current.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: obj.duration,
      clearButtton: true,
    });
  }


