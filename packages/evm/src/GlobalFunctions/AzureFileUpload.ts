import { BlobServiceClient, BlockBlobParallelUploadOptions, BlobHTTPHeaders } from "@azure/storage-blob";
import { AbortSignalLike, AbortController, AbortSignal } from "@azure/abort-controller";
import { getFileSize } from "./FileUpload";
declare const window: any;



const uploadFiles = async (files: any) => {

    const promises = [];
    const allTasksController = new AbortController();
    window.tasks = window.tasks || [];
    for (const file of files) {
        const blobSasUrl = file.uploadUri;
        const containerWithFile = blobSasUrl.substring(blobSasUrl.indexOf('.net') + 5, blobSasUrl.indexOf('?'));
        const sasurl = blobSasUrl.replace(containerWithFile, '')
        const blobServiceClient = new BlobServiceClient(sasurl);

        const fc = containerWithFile.replaceAll('%2F', '/');
        const containerName = fc.replace(fc.substring(fc.lastIndexOf('/')), '');//get container name only
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const fileName = fc.substring(fc.lastIndexOf('/') + 1);


        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const blobHTTPHeaders: BlobHTTPHeaders = { blobContentType: file.type }

        window.tasks[fileName] = new AbortController(allTasksController.signal);


        const blockBlobParallelUploadOptions: BlockBlobParallelUploadOptions = {
            blockSize: 4 * 1024 * 1024,
            abortSignal: window.tasks[fileName].signal,
            onProgress: (ev) => {
                //console.log(`you have upload ${ev.loadedBytes} bytes ${Math.round((ev.loadedBytes / file.size) * 100)}%`);
                window.onRecvData.data = {
                    loadedBytes: getFileSize(ev.loadedBytes),
                    percent: Math.round((ev.loadedBytes / file.size) * 100),
                    fileSize: getFileSize(file.size),
                    fileName: file.uploadedFileName,
                    fileId: file.uploadedFileId
                };
                window.dispatchEvent(window.onRecvData);
                //
                //     loadedBytes: (ev.loadedBytes / (1024 * 1024)).toFixed(2),
                //     percent: Math.round((ev.loadedBytes / file.size) * 100),
                //     fileSize: (file.size / (1024 * 1024)).toFixed(2),
                //     fileName: file.name
                // })
            },
            blobHTTPHeaders: blobHTTPHeaders
        };

        promises.push(blockBlobClient.uploadData(file,
            blockBlobParallelUploadOptions)
            .then(response => {
               
                if (response.errorCode != null) {
                   
                }
            }).catch(e => { 
                if (e.name == 'AbortError') {
                    window.onRecvData.data = {
                        removed: true,
                        fileName: file.uploadedFileName
                    };
                }
                else if (e.name == "RestError") {
                    window.onRecvData.data = {
                        error: true,
                        fileName: file.uploadedFileName,
                        fileId : file.uploadedFileId
                    };
                }

                window.dispatchEvent(window.onRecvData);
            })
        );

    }
    await Promise.all(promises);
};

export default uploadFiles;



