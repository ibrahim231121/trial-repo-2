export const assetSizeFormat = (size: number) => {
    const sizes = ["MB", "GB", "TB"]
    if (size == 0) {
        return size + " " + sizes[size]
    }
    const i = Math.floor(Math.log(size) / Math.log(1024))

    if (i == 0) {
        return size + " " + sizes[i]
    }
    return (size / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}


export const assetDurationFormat = (duration: number) => {
    const time = ["Second(s)", "Minute(s)", "Hour(s)"]
    let assetDuration: string = ""
    let h = Math.floor(duration / 3600);
    let m = Math.floor(duration % 3600 / 60);
    let s = Math.floor(duration % 3600 % 60);
    switch (true) {
        case duration >= 3600 :
            assetDuration = h + " " + time[2] + " " + (m > 0 ?  m + " " + time[1] : " ")
            break;

        case duration >= 60 && duration < 3600:
            assetDuration = m + " " + time[1] + " " + (s > 0 ? s + " " +  time[0] : " ")
            break;

        case duration <= 60 && duration > 0 :
            assetDuration = s + " " + time[0]
            break;

            default:
            assetDuration = duration + " " + time[duration];
    }
    return assetDuration
}
