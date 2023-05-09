import { createAsyncThunk } from "@reduxjs/toolkit";
import { EvidenceAgent } from "../utils/Api/ApiAgent";
import { AssetLog, AssetLogType } from "../utils/Api/models/EvidenceModels";

export const addAssetLog = createAsyncThunk(
    'addAssetLog',
    async (args: AssetLogType) => {
        var body : AssetLog = { action: args.action , notes: args.notes}; 
        const url = '/Evidences/'+ args.evidenceId + '/Assets/'+ args.assetId + '/AssetLog';
        EvidenceAgent.addAssetLog(url, body)
        .catch((e: any) =>{
            console.error("Failed To save log")
        })
    }
);