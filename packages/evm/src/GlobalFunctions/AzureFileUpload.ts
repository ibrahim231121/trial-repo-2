import { BlobServiceClient, BlockBlobParallelUploadOptions, BlobHTTPHeaders, } from "@azure/storage-blob";
import { AbortSignalLike, AbortController, AbortSignal } from "@azure/abort-controller";
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
        const getFileSize = (bytes: number) => {
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
        }
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
                    fileName: file.name
                };
                window.dispatchEvent(window.onRecvData);
                // console.log("fileUpload", {
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
                console.log(response)
                if (response.errorCode != null) {
                    console.log("failed", file)
                }
            }).catch(e => {
                if (e.name == 'AbortError') {
                    window.onRecvData.data = {
                        removed: true,
                        fileName: file.name
                    };
                }
                else if (e.name == "RestError") {
                    window.onRecvData.data = {
                        error: true,
                        fileName: file.name
                    };
                }
                //                 e.name
                // 'AbortError'

                //                 e.name
                // 'RestError'
                // e.code
                // 'REQUEST_SEND_ERROR'


                // window.onRecvData.data = {
                //     error: true,
                //     fileName: file.name
                // };
                //window.tasks["Cricket1_202203081238415924.avi"].abort()

                window.dispatchEvent(window.onRecvData);
            })
        );

    }
    await Promise.all(promises);
};

export default uploadFiles;



