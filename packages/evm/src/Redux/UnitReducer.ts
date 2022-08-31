import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { UnitsAndDevicesAgent , EvidenceAgent} from '../utils/Api/ApiAgent';
import { QueuedAssets, UnitInfo } from '../utils/Api/models/UnitModels';

export const getUnitInfoAsync: any = createAsyncThunk(
    'getUnitInfo',
    async (pageiFilter?: any) => {
        return await UnitsAndDevicesAgent.getUnitInfo(`/Stations/0/Units/getunitInfo?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`).then((response:UnitInfo[]) => response);
    }
);


export const getQueuedAssetInfoAsync: any = createAsyncThunk(
    'getQueuedAssetInfo',
    async (args: any) => {
        return await EvidenceAgent.getQueuedAssets(args.unitId).then((response:QueuedAssets[]) => response);

    }
);




export const unitSlice = createSlice({
    name: 'unit',
    initialState: { unitInfo: [] , queuedAssets: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUnitInfoAsync.fulfilled, (state: any, { payload }) => {
            state.unitInfo = payload;
        }).addCase(getQueuedAssetInfoAsync.fulfilled, (state: any, { payload })=>{
            state.queuedAssets = payload;
        })
    }
});

export default unitSlice;