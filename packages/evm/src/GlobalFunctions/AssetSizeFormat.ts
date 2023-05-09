
export const assetSizeFormat = (size: number) => {
    const sizes = ["Bytes","KB","MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    if (size == 0) {
        return size + " " + sizes[size]
    }
    const i = Math.floor(Math.log(size) / Math.log(1024))

    if (i == 0) {
        return size + " " + sizes[i]
    }
    return (size / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}

export const assetDurationFormat = (duration:number) => {
    let assetDuration: string;
    if(duration == 0){
        return assetDuration = "N/A"
    }
    let date:Date = new Date(duration)
    let hourFormatting = date.getUTCHours() > 0 ? date.getUTCHours() : undefined
    let minuteFormatting = date.getUTCMinutes() > 0 ? date.getUTCMinutes() : undefined
    let secondFormatting = date.getUTCSeconds() > 0 ? date.getUTCSeconds() : undefined
    assetDuration = (hourFormatting ? hourFormatting + " Hour(s) " : "") + (minuteFormatting ? minuteFormatting + " Minute(s) " : "") + (secondFormatting ? secondFormatting + " Second(s)" : "")
    return   assetDuration ;
  }

