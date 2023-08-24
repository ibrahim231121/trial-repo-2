import moment from "moment";

const checkAssetType = (assetType: string) => {
    let typeOfAsset: string = "";
    assetType = assetType.toLocaleLowerCase();
    switch (assetType) {
      case ".mp4":
      case ".avi":
      case ".mkv":
      case ".3gp":
      case ".3gpp":
      case ".webm":
      case ".wmv":
        typeOfAsset = "Video";
        break;

      case ".mp3":
      case ".wma":
      case ".aac":
      case ".wav":
        typeOfAsset = "Audio";
        break;

      case ".jpeg":
      case ".png":
      case ".gif":
      case ".tiff":
      case ".psd":
      case ".ai":
      case ".jpg":
      case ".jfif":
      case ".bmp":
        typeOfAsset = "Image";
        break;

      case ".xlsx":
      case ".xlsm":
      case ".xlsb":
      case ".xltx":
      case ".xltm":
      case ".xml":
      case ".doc":
      case ".docx":
      case ".pdf":
      case ".txt":
      case ".ppt":
      case ".csv":
        typeOfAsset = "Doc";
        break;

      case ".dll":
      case ".exe":
      case ".msi":
      case ".bin":
        typeOfAsset = "Executable";
        break;

      case ".zip":
      case ".rar":
      case ".icm":
        typeOfAsset = "Others";
        break;

      default:
        typeOfAsset = "Others";
    }
    return typeOfAsset;
  };

  const checkFileType = (fileType: string) => {
    let typeOfFile: string = "";
    fileType = fileType.toLocaleLowerCase();
    switch (fileType) {

      case ".mp4":
      case ".avi":
      case ".mkv":
      case ".3gp":
      case ".3gpp":
      case ".webm":
        typeOfFile = "Video";
        break;

      case ".mp3":
      case ".wma":
      case ".aac":
      case ".wav":
        typeOfFile = "Audio";
        break;

      case ".jpeg":
      case ".png":
      case ".gif":
      case ".tiff":
      case ".psd":
      case ".ai":
      case ".jpg":
      case ".jfif":
      case ".bmp":
        typeOfFile = "Image";
        break;

      case ".wmv":
        typeOfFile = "WMVVideo";
        break;

      case ".icm":
        typeOfFile = "AvenueSource";
        break;

      case ".doc":
      case ".docx":
        typeOfFile = "WordDoc";
        break;

      case ".pdf":
        typeOfFile = "PDFDoc";
        break;

      case ".csv":
        typeOfFile = "CSVDoc";
        break;

      case ".txt":
        typeOfFile = "Text";
        break;

      case ".xlsx":
      case ".xlsm":
      case ".xlsb":
      case ".xltx":
      case ".xltm":
      case ".xls":
        typeOfFile = "ExcelDoc";
        break;

      case ".ppt":
      case ".pptx":
        typeOfFile = "PowerPointDoc";
        break;

      case ".dll":
        typeOfFile = "DLL";
        break;
      case ".exe":
        typeOfFile = "Exe";
        break;
      case ".msi":
        typeOfFile = "Msi";
        break;
      case ".bin":
        typeOfFile = "bin";
        break;

      case ".crt":
      case ".cer":
      case ".ca-bundle":
      case ".p7b":
      case ".p7c":
      case ".p7s":
      case ".pem":
        typeOfFile = "BW2Certificate";
        break;

      case ".zip":
      case ".rar":
        typeOfFile = "Zip";
        break;

      case ".xml":
      case ".wpt":
      case ".dat":
      case ".ppc":
      case ".wpr":
      case ".trl":
        typeOfFile = "GPS";
        break;

      default:
        typeOfFile = "Others";
    }
    return typeOfFile;
  };

  const checkFileStatus = (fileStatus: string) => {
    if (fileStatus === "Uploaded") {
      return "Available"
    }
    else {
      return fileStatus
    }
  };

  const getDecimalPart = (num: any) => num % 1;

  const currentStartDate = () => moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS');

  export {checkAssetType, checkFileType, checkFileStatus, getDecimalPart, currentStartDate};