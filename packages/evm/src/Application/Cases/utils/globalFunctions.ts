import moment from "moment";
import { CASE_ASSET_TYPE, TCaseAsset } from "../CaseTypes";

export const getCaseIdOpenedForEvidence = () : { id: string, title: string } | null => {
    try {
        const value = localStorage.getItem("caseOpenedForEvidence");
        if(value != null) {
            const idIndex = value.lastIndexOf("_");
            const caseId = value.substring(idIndex + 1, value.length);
            const caseTitle = value.substring(0, idIndex);
            console.log("Case ID: " + caseId + " Case Title: " + caseTitle);
            return { id: caseId, title: caseTitle };
        }
        return null;
    }
    catch(ex) {
        return null;
    }    
}

export const setCaseIdOpenedForEvidence = (caseId: string) => {
    localStorage.setItem("caseOpenedForEvidence", caseId);
}

export const removeCaseIdOpenedForEvidence = () => {
    localStorage.removeItem("caseOpenedForEvidence");
}

export const formatString = (template: string, ...args: any[]) => {
    return template.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
}

export const getMaxCaseAssetSequenceNumber = (caseAssets: TCaseAsset[]) => {
    let sequenceNumber = 0;
    if(Array.isArray(caseAssets) && caseAssets.length > 0) {
        const value = caseAssets.reduce((prev, current) => (parseInt(prev.sequenceNumber) > parseInt(current.sequenceNumber)) ? prev : current).sequenceNumber; 
        sequenceNumber = !isNaN(parseInt(value)) ? parseInt(value) : 0;
    }
    return sequenceNumber;
}

export const getChildAssetsSequenceNumber = (sequenceNumber: string, width: number) => {
    return (sequenceNumber.length >= width) ? sequenceNumber : (new Array(width).join('0') + sequenceNumber).slice(-width);
}

export const getAssetTypeEnumValue = (assetType: string) => {
    return CASE_ASSET_TYPE[assetType as keyof typeof CASE_ASSET_TYPE];
  }

export const getFormattedDateTime = (value: string, tenantSetting: any) => {
    if(typeof value === "string") {
        let dateFormat = "DD/MM/YYYY";
        let timeFormat = "HH:mm:ss";
        if(tenantSetting != null) {
            if(tenantSetting["DateFormat"] != null) {
                dateFormat = tenantSetting["DateFormat"];
            }
            if(tenantSetting["TimeFormat"] != null && tenantSetting["TimeFormat"] == "AM/PM") {
                timeFormat = "hh:mm:ss a";
            }
        }
        const formatedDateTime = moment(value).format(`${dateFormat} ${timeFormat}`);
        return formatedDateTime === "Invalid date" ? "" : formatedDateTime;
    }
    return "";
}

export const convertDateTimeToLocalInString = (text: string, tenantSetting: any) => {
    if(text != null) {
      const dateTimeMatched = text.match(/((\d{1,4}[/.-]\d{1,4}[/.-]\d{1,4}) (\d{1,2}[.:-]\d{1,2}(?:[.:-]\d{1,2})?(?: [a-zA-Z]{2})?))/);
      if(dateTimeMatched != null && dateTimeMatched.index != null && dateTimeMatched.index > -1) {
        const dateTime = text.slice(dateTimeMatched.index, dateTimeMatched.index + dateTimeMatched[0].length);
        let dateTimeToFormat = dateTime;
        if(moment(dateTimeToFormat).isUTC() === false) {
          dateTimeToFormat = moment.utc(dateTimeToFormat).toISOString();
        }
        const formattedDateTime = getFormattedDateTime(dateTimeToFormat, tenantSetting);
        return text.replace(dateTime, formattedDateTime);
      }
    }
    return text;
  }
