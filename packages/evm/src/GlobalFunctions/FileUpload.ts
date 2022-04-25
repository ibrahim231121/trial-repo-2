import { FILE_SERVICE_URL } from '../../src/utils/Api/url';
import uploadFiles from "../GlobalFunctions/AzureFileUpload";
declare const window: any;

interface FileInfo {
    fileId: string,
    name: string,
    size: {
        total: number,
        remaining: number
    },
    state: string,
    type: string,
    stationId: number,
    history: {
        uploader: {
            type: string,
            by: number
        }
    }
}
let filesId = [0];
let fileCountAtError = 0;
export const AddFilesToFileService = async (files: any) => {
    const promises = [];
    filesId = [];
    fileCountAtError = files.length;
    for (const file of files) {
        filesId.push(file.id);
        const fileInfo: FileInfo = {
            fileId: file.name.replaceAll(' ', '_'),
            name: file.name.replaceAll(' ', '_'),
            size: {
                total: file.size,
                remaining: file.size,
            },
            state: "Uploading",
            type: "Evidence",
            history: {
                uploader: {
                    type: "User",
                    by: 1
                }
            },
            stationId: 70
        }
        promises.push(
            new Promise((resolve, reject) => {
                onAddFile(fileInfo, file, resolve, reject);
                //resolve("");
            }));
    }
    await Promise.all(promises).then((messages) => {
        uploadFiles(files);//here we can find the blob url either amazon or azure
    }).catch((e) => {
        console.log("error", e)
    });
}
const onAddFile = async (payload: any, file: any, resolve: any, reject: any) => {

    await fetch(FILE_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', TenantId: '1' },
        body: JSON.stringify(payload)
    })
        .then(function (res) {
            if (res.ok) return res.json();
            else if (res.status == 500) {
                window.onRecvError.data = {
                    message: "We're sorry. The file was unable to be saved. Please retry or contact your System Administrator.",
                    variant: "error", duration: 7000, clearButtton: true
                };
                window.dispatchEvent(window.onRecvError);
            }
            else return res.text();
        }).then(function (resp) {
            if (resp !== undefined) {
                let error = JSON.parse(resp);
                if (error.errors !== undefined) {
                }
                else if (!isNaN(+error)) {
                    //console.log("post", resp)
                    fetchFile(resp, file, resolve);
                }
                else {
                    // toasterRef.current.showToaster({
                    //     message: payload.name + " " + error, variant: "error", duration: 7000, clearButtton: true
                    // });
                    window.onRecvError.data = {
                        message: payload.name + " " + error,
                        variant: "error", duration: 7000, clearButtton: true,
                        fileCountAtError: fileCountAtError,
                        filesId: filesId
                    };
                    window.dispatchEvent(window.onRecvError);
                }
            }
            else {
                window.onRecvError.data = {
                    message: "We're sorry. The file was unable to be saved. Please retry or contact your System Administrator.",
                    variant: "error", duration: 7000, clearButtton: true
                };
                window.dispatchEvent(window.onRecvError);
            }
        })
        .catch(function (error) {
            return error;
        });
}
const fetchFile = async (id: string, file: any, resolve: any) => {

    await fetch(`${FILE_SERVICE_URL}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', TenantId: '1' }
    }).then(function (res) {
        if (res.ok) {
            return res.json();
        }
        else if (res.status == 500) {

            window.onRecvError.data = {
                message: "We're sorry. The file was unable to be saved. Please retry or contact your System Administrator.",
                variant: "error", duration: 7000, clearButtton: true
            };
            window.dispatchEvent(window.onRecvError);
        }
        else return res.text();
    }).then(function (resp) {
        if (resp !== undefined) {
            //console.log("resp", resp);
            file.uploadUri = resp.upload.uri;
            file.uploadedFileName = resp.name;
            file.uploadedFileId = resp.id;
            resolve("resolve", resp)
        }
        else {
            window.onRecvError.data = {
                message: "We're sorry. The file was unable to be saved. Please retry or contact your System Administrator.",
                variant: "error", duration: 7000, clearButtton: true
            };
            window.dispatchEvent(window.onRecvError);
        }
    })
        .catch(function (error) {
            return error;
        });
}

export const getFileSize = (bytes: number) => {
    if (bytes < 1024) {
        return bytes + " Byte";
    }
    else if (bytes / 1024 < 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }
    else if (bytes / (1024 * 1024) < 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    else if (bytes / (1024 * 1024 * 1024) < 1024) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
    else if (bytes / (1024 * 1024 * 1024 * 1024) < 1024) {
        return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " TB";
    }
    else return "";
}