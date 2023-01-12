import { duration } from 'moment';
import { AbortController } from "@azure/abort-controller";
import { BlobServiceClient, BlockBlobStageBlockOptions, BlockBlobCommitBlockListOptions, BlockBlobClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { getFileSize } from "./FileUpload";
declare const window: any;

interface UploadStageBlockInfo {
    blockBlobClient: BlockBlobClient,
    file: any,
    remainingBytes: number,
    maxBlockSize: number,
    fileName: string,
    currentFilePointer: number,
    resolve: any,
    reject: any
}

const getBlockBlobInfo = async (uploadUri: string) => {
    const blobSasUrl = uploadUri;
    const containerWithFile = blobSasUrl.substring(blobSasUrl.indexOf('.net') + 5, blobSasUrl.indexOf('?'));
    const sasurl = blobSasUrl.replace(containerWithFile, '')
    const blobServiceClient = new BlobServiceClient(sasurl);

    const fc = containerWithFile.replaceAll('%2F', '/');
    const containerName = fc.replace(fc.substring(fc.lastIndexOf('/')), '');//get container name only
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const fileName = fc.substring(fc.lastIndexOf('/') + 1);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    return { blockBlobClient, fileName };
}

const uploadFiles = async (file: any, onRecvData: any, resolve: any, reject: any) => {

    const allTasksController = new AbortController();
    window.tasks = window.tasks || [];

    const blockBlobInfo = await getBlockBlobInfo(file.uploadUri);
    const blockBlobClient = blockBlobInfo.blockBlobClient;
    const fileName = blockBlobInfo.fileName;

    window.tasks[fileName] = {}
    window.tasks[fileName].abortSignal = new AbortController(allTasksController.signal);

    let maxBlockSize = 5 * 1024 * 1024;
    if (maxBlockSize > file.size) {
        maxBlockSize = file.size;
    }
    let remainingBytes = file.size;
    window.tasks[fileName].blockIds = [];
    window.tasks[fileName].file = file;
    let currentFilePointer = 0;

    let usb: UploadStageBlockInfo = {
        blockBlobClient: blockBlobClient,
        file,
        remainingBytes,
        maxBlockSize,
        fileName,
        currentFilePointer,
        reject,
        resolve
    }
    await uploadStageBlock(usb, onRecvData)
};

const saveFileToLocalStorage = async (usb: UploadStageBlockInfo) => {

    var uploadItem = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
    var index = uploadItem.findIndex((x: any) => x.fileName == usb.fileName);

    var selectedItem = {
        fileName: usb.fileName,
        blockIds: window.tasks[usb.fileName].blockIds,
        //abortSignal: Object.assign({}, window.tasks[usb.fileName].abortSignal),
        file: {
            duration: usb.file.duration,
            uploadUri: usb.file.uploadUri,
            uploadedFileId: usb.file.uploadedFileId,
            uploadedFileName: usb.file.uploadedFileName,
            url: usb.file.url,
            lastModified: usb.file.lastModified,
            lastModifiedDate: usb.file.lastModifiedDate,
            name: usb.file.name,
            size: usb.file.size,
            type: usb.file.type,
            state:usb.file.state,
        }
    };
    if (index == -1)
        uploadItem.push(selectedItem);
    else
        uploadItem[index] = selectedItem;

    localStorage.setItem("uploadedFiles", JSON.stringify(uploadItem));
}

const uploadStageBlock = async (usb: UploadStageBlockInfo,  onRecvData: any) => {
    if (usb.remainingBytes == 0) {
        const blockBlobCommitBlockListOptions: BlockBlobCommitBlockListOptions = {
            abortSignal: window.tasks[usb.fileName].abortSignal.signal
        };
        usb.blockBlobClient.commitBlockList(window.tasks[usb.fileName].blockIds.map((x: any) => x.blockId), blockBlobCommitBlockListOptions)
            .then((response) => {
                console.log("response", response)
                //this is the case when user uploaded the file and refresh the page wihout add metadata
                if(onRecvData && onRecvData.type == "onUploadStatusUpdate"){
                    saveFileToLocalStorage(usb);
                }
            }).catch(e => {
                console.log("error", e)
            })
        return false;
    }
    const blockId = btoa(uuidv4());
    window.tasks[usb.fileName].blockIds.push({ blockId, maxBlockSize: usb.maxBlockSize, loadedBytes: 0 });

    const blockBlobParallelUploadOptions: BlockBlobStageBlockOptions = {
        abortSignal: window.tasks[usb.fileName].abortSignal.signal,
        onProgress: (ev) => {

            window.tasks[usb.fileName].blockIds.find((x: any) => x.blockId == blockId).loadedBytes = ev.loadedBytes;
            var abc = window.tasks[usb.fileName].blockIds.map((x: any) => x.loadedBytes).reduce((partialSum: number, a: number) => partialSum + a, 0);

            onRecvData.data = {
                loadedBytes: getFileSize(Math.ceil(abc)),
                percent: Math.round((Math.ceil(abc) / usb.file.size) * 100),
                fileSize: getFileSize(usb.file.size),
                fileName: usb.file.uploadedFileName,
                fileId: usb.file.uploadedFileId,
                url: usb.file.url,
                error: false,
                removed: false,
            };
            window.dispatchEvent(onRecvData);
        }
    };

    usb.blockBlobClient.stageBlock(blockId, usb.file.slice(usb.currentFilePointer, usb.currentFilePointer + usb.maxBlockSize), usb.maxBlockSize,

        blockBlobParallelUploadOptions)
        .then(async (response) => {

            console.log("response", response)
            if (response.errorCode != null) {
                console.log("failed", usb.file)
                usb.reject("reject");
            }
            if (response._response.status == 201) {
                usb.resolve("resolve");

                usb.remainingBytes = usb.remainingBytes - usb.maxBlockSize;
                usb.currentFilePointer = usb.currentFilePointer + usb.maxBlockSize;
                if (usb.remainingBytes < usb.maxBlockSize) {
                    usb.maxBlockSize = usb.remainingBytes;
                }
                //recursive call                
                await uploadStageBlock(usb, onRecvData)
            }
        }).catch(e => {
            if (e.name == 'AbortError') {
                if (!window.tasks[usb.file.uploadedFileName].isPause) {
                    onRecvData.data = {
                        removed: true,
                        fileName: usb.file.uploadedFileName

                    };
                }
            }
            else if (e.name == "RestError") {
                onRecvData.data = {
                    error: true,
                    fileName: usb.file.uploadedFileName,
                    fileId: usb.file.uploadedFileId
                    //fileid is required for abondard status
                };
            }

            window.dispatchEvent(onRecvData);
        })
}

export const resumeFile = async (fileName: string, onRecvData: any) => {
    const allTasksController = new AbortController();
    let fileObject = window.tasks[fileName];
    fileObject.abortSignal = new AbortController(allTasksController.signal);
    const blockBlobInfo = await getBlockBlobInfo(fileObject.file.uploadUri);
    const blockBlobClient = blockBlobInfo.blockBlobClient;
    let currentFilePointer: number = 0;
    let file: any = fileObject.file;
    fileObject.blockIds.map(async (x: any) => {
        if (x.maxBlockSize == x.loadedBytes) {

            if (fileObject.blockIds[fileObject.blockIds.length - 1].blockId == x.blockId) {
                resumeFileStage(currentFilePointer, fileObject, x.maxBlockSize, blockBlobClient, fileName, onRecvData)
            }
            currentFilePointer = currentFilePointer + x.loadedBytes;
        }
        else {
            resumeFileStage(currentFilePointer, fileObject, x.maxBlockSize, blockBlobClient, fileName, onRecvData)
        }
    });
};
const resumeFileStage = async (currentFilePointer: number, fileObject: any, maxBlockSize: number, blockBlobClient: any, fileName: string, onRecvData: any) => {
    let remainingBytes = fileObject.file.size - currentFilePointer;
    fileObject.blockIds.pop();//remove last not complete block
    let usb: UploadStageBlockInfo = {
        blockBlobClient: blockBlobClient,
        file: fileObject.file,
        remainingBytes,
        maxBlockSize: maxBlockSize,
        fileName,
        currentFilePointer,
        reject: () => { console.log("reject") },
        resolve: () => { console.log("resolve") }
    }
    await uploadStageBlock(usb, onRecvData);
}
export default uploadFiles;



