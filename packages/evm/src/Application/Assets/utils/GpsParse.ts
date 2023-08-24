import { GPS } from "../../../utils/Api/models/GpsModel";

const parseNmea = (nmea : string, recordingStarted : Date, preBufferTime : number) : GPS[] => {
    
    if (!nmea) return [];
    var list : GPS[] = [];  
    var data : GPS = {
        logTime : 0,
        lat : 0,
        lon : 0,
        alt : 0,
        speed : 0,
        spAcc : 0,
        error : 0,
    };
    
    var preBufferSeconds = preBufferTime / 1000;
    recordingStarted.setSeconds(recordingStarted.getSeconds() - preBufferSeconds);
    var startTime = recordingStarted;
    var gpsCount : number = 0;
    var gpsNmeaSentences = nmea.split("\n");
    gpsNmeaSentences.forEach((oneLine:any) => {
        let sentenceFromLine = oneLine.split('$');
        for (let j = 1; j < sentenceFromLine.length; j++)
        {
            if (oneLine)
            {
                oneLine = "$" + sentenceFromLine[j];
                try
                {
                    let tmpsplit : string[] = oneLine.split('*');  // remove the checksum from the end first

                    let splittedNmea : string[] = tmpsplit[0].split(',');
                    if (splittedNmea.length > 0)
                    {
                        switch (splittedNmea[0])
                        {
                            case "$GNGGA":
                            case "$GPGGA":

                                // #region GPS data
                                let i : number = 1;

                                i++;
                                let lat : number = !splittedNmea[i] ? 0 : MinuteToDegree(Number(splittedNmea[i]));
                                i++;
                                let alat : string = splittedNmea[i++];
                                if (alat == "S") {lat = -1 * lat};
                                let lon : number = !splittedNmea[i] ? 0 : MinuteToDegree(Number(splittedNmea[i]));
                                i++;
                                let alon : string = splittedNmea[i++];
                                if (alon == "W") {lon = -1 * lon};
                                let code : number = !splittedNmea[i] ? Number(0) : Number(splittedNmea[i]);
                                i++;
                                let numSat : number = !splittedNmea[i] ? 0 : Number(splittedNmea[i]);
                                i++;
                                let accuracy : number = !splittedNmea[i] ? 0 : Number(splittedNmea[i]);
                                i++;
                                let alt : number = !splittedNmea[i] ? 0 : Number(splittedNmea[i]);
                                i++;
                                let altunit : string = splittedNmea[i];

                                try
                                {

                                    data.lat = Number(lat.toFixed(5));
                                    data.lon = Number(lon.toFixed(5));
                                    data.error = code;
                                    data.alt = Number(alt.toFixed(5));
                                    data.spAcc = accuracy;

                                }
                                finally
                                {
                                }

                                // #endregion

                                break;
                            case "$GNVTG":
                            case "$GPVTG":

                                // #region Speed Data

                                let speed : number = !splittedNmea[7] ? 0 : Number(splittedNmea[7]);
                                try
                                {
                                    let snum = speed / 1.61;
                                    data.speed = Number(snum.toFixed(5));
                                }
                                finally
                                {
                                }

                                // #endregion

                                break;
                            case "$GNRMC":
                            case "$GPRMC":
                                if (gpsCount > 0)
                                    list.push(data);

                                data = {
                                    logTime : 0,
                                    lat : 0,
                                    lon : 0,
                                    alt : 0,
                                    speed : 0,
                                    spAcc : 0,
                                    error : 0,
                                };
                                if (splittedNmea[2] == "A" || splittedNmea[2] == "V")
                                {
                                    let date : string = splittedNmea[9];
                                    let utc : string = splittedNmea[1];

                                    if (utc.length > 0 && date.length > 0)
                                    {
                                        try
                                        {
                                            let day : number = Number(date.substring(0, 2));
                                            let month : number = Number(date.substring(2, 2));
                                            let year : number = 2000 + Number(date.substring(4, 2));

                                            let hour : number = Number(utc.substring(0, 2));
                                            let minute : number = Number(utc.substring(2, 2));
                                            let second : number = Number(utc.substring(4, 2));
                                            data.logTime = new Date(year, month, day, hour, minute, second).getTime();
                                        }
                                        catch
                                        {
                                            data.logTime = startTime.getTime();
                                        }
                                    }
                                    else
                                    {
                                        data.logTime = startTime.getTime();
                                    }
                                }
                                else
                                {
                                    data.logTime = startTime.getTime();
                                }

                                // #region Speed Data

                                let speedK : number = 0;
                                if (splittedNmea[2] == "A")
                                {
                                    speedK = !splittedNmea[7] ? 0 : Number(splittedNmea[7]);
                                }
                                try
                                {
                                    let snum : number = speedK * 1.15078
                                    data.speed = Number(snum.toFixed(5));
                                }
                                finally
                                {
                                    startTime.setSeconds(recordingStarted.getSeconds() + 1);
                                    gpsCount++;
                                }

                                // #endregion

                                break;

                            case "$GNGSA":
                            case "$GPGSA":
                                break;
                            case "$GNGSV":
                            case "$GLGSV":
                            case "$GPGSV":

                                break;
                        }
                    }
                }
                catch { }
            }
            else
            { // end of transmission 
                break;
            }

        }
    });
    return list;
}

const MinuteToDegree = (value: number) => {
    let tmp = value % 100;
    let t = (value - (tmp)) / 100;
    return t + (tmp / 60);
};

  export default parseNmea;