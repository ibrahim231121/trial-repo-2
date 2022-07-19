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

const uploadFiles = async (file: any, resolve: any, reject: any) => {

    const allTasksController = new AbortController();
    window.tasks = window.tasks || [];

    const blockBlobInfo = await getBlockBlobInfo(file.uploadUri);
    const blockBlobClient = blockBlobInfo.blockBlobClient;
    const fileName = blockBlobInfo.fileName;

    window.tasks[fileName] = {}
    window.tasks[fileName].abortSignal = new AbortController(allTasksController.signal);

    let maxBlockSize = 50 * 1024 * 1024;
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
    await uploadStageBlock(usb)
};


const uploadStageBlock = async (usb: UploadStageBlockInfo) => {

    if (usb.remainingBytes == 0) {
        const blockBlobCommitBlockListOptions: BlockBlobCommitBlockListOptions = {
            abortSignal: window.tasks[usb.fileName].abortSignal.signal
        };
        usb.blockBlobClient.commitBlockList(window.tasks[usb.fileName].blockIds.map((x: any) => x.blockId), blockBlobCommitBlockListOptions)
            .then((response) => {
                console.log("response", response)
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

            window.onRecvData.data = {
                loadedBytes: getFileSize(Math.ceil(abc)),
                percent: Math.round((Math.ceil(abc) / usb.file.size) * 100),
                fileSize: getFileSize(usb.file.size),
                fileName: usb.file.uploadedFileName,
                fileId: usb.file.uploadedFileId,
                url: usb.file.url,
                error: false,
                removed: false,
            };
            window.dispatchEvent(window.onRecvData);
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
                await uploadStageBlock(usb)
            }
        }).catch(e => {
            if (e.name == 'AbortError') {
                if (!window.tasks[usb.file.uploadedFileName].isPause) {
                    window.onRecvData.data = {
                        removed: true,
                        fileName: usb.file.uploadedFileName

                    };
                }
            }
            else if (e.name == "RestError") {
                window.onRecvData.data = {
                    error: true,
                    fileName: usb.file.uploadedFileName,
                    fileId: usb.file.uploadedFileId
                    //fileid is required for abondard status
                };
            }

            window.dispatchEvent(window.onRecvData);
        })
}

export const resumeFile = async (fileName: string) => {
    const allTasksController = new AbortController();
    window.tasks[fileName].abortSignal = new AbortController(allTasksController.signal);
    const blockBlobInfo = await getBlockBlobInfo(window.tasks[fileName].file.uploadUri);
    const blockBlobClient = blockBlobInfo.blockBlobClient;
    let currentFilePointer: number = 0;
    window.tasks[fileName].blockIds.map(async (x: any) => {
        if (x.maxBlockSize == x.loadedBytes) {
            currentFilePointer = currentFilePointer + x.loadedBytes;
        }
        else {
            let file: any = window.tasks[fileName].file;
            let remainingBytes = file.size - currentFilePointer;
            window.tasks[fileName].blockIds.pop();//remove last not complete block
            let usb: UploadStageBlockInfo = {
                blockBlobClient: blockBlobClient,
                file,
                remainingBytes,
                maxBlockSize: x.maxBlockSize,
                fileName,
                currentFilePointer,
                reject: () => { console.log("reject") },
                resolve: () => { console.log("resolve") }
            }
            await uploadStageBlock(usb);
        }
    });
};
export default uploadFiles;



