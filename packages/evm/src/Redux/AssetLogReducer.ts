import { createAsyncThunk } from "@reduxjs/toolkit";
import { EvidenceAgent } from "../utils/Api/ApiAgent";
import { AssetLog, AssetLogType, MultiAssetLog, PublicAssetLog } from "../utils/Api/models/EvidenceModels";

export const addAssetLog = createAsyncThunk(
    'addAssetLog',
    async (args: AssetLogType) => {
        var body : AssetLog = { action: args.assetLog.action, notes: args.assetLog.notes, auditTableNamesEnum: args.assetLog.auditTableNamesEnum};
        const url = '/Evidences/'+ args.evidenceId + '/Assets/'+ args.assetId + '/AssetLog';
        EvidenceAgent.addAssetLog(url, body)
        .catch((e: any) =>{
            console.error("Failed To save log")
        })
    }
);

export const addMultiAssetLog:any = createAsyncThunk(
    'addAssetLog',
    async (args: MultiAssetLog) => {
        const url = '/Evidences/MultiAssetLog';
        EvidenceAgent.addAssetLog(url, args)
        .catch((e: any) =>{
            console.error("Failed To save log")
        })
    }
);
export const addPublicAssetLog:any = createAsyncThunk(
    'addPublicAssetLog',
    async (args: PublicAssetLog) => {
        const url = '/Evidences/Share/LogAssetSharing';
        EvidenceAgent.addAssetLog(url, args)
        .catch((e: any) =>{
            console.error("Failed To save log")
        })
    }
);