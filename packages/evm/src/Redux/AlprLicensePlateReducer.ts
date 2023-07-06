import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { LicensePlateAgent } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';
const rows = [{
    id: 1,
    LicensePlate: 'ASF-123',
    DateOfInterest: '',
    LicenseType: 'dummy',
    LicenseYear: 0,
    Agency: 'AG-000001',
    State: '000222',
    FirstName: 'John',
    LastName: 'bairstrow',
    Alias: '',
    VehicleYear: 2021,
    VehicleMake: 'Honda',
    VehicleModel: 'corolla',
    VehicleColor: 'black',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: 'AGSD-0001',
    ImportSerialId: '',
    ViolationInfo: ''
},
{
    id: 2,
    LicensePlate: 'ASF-123',
    DateOfInterest: '2021/02/02',
    LicenseType: 'dummy',
    LicenseYear: 0,
    Agency: 'AG-000001',
    State: '000222',
    FirstName: 'John',
    LastName: 'bairstrow',
    Alias: '',
    VehicleYear: 2021,
    VehicleMake: 'Honda',
    VehicleModel: 'corolla',
    VehicleColor: 'black',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: 'AGSD-0001',
    ImportSerialId: '',
    ViolationInfo: ''
},
{
    id: 3,
    LicensePlate: 'ASF-123',
    DateOfInterest: '2021/02/02',
    LicenseType: 'dummy',
    LicenseYear: 0,
    Agency: 'AG-000001',
    State: '000222',
    FirstName: 'John',
    LastName: 'bairstrow',
    Alias: '',
    VehicleYear: 2021,
    VehicleMake: 'Honda',
    VehicleModel: 'corolla',
    VehicleColor: 'black',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: 'AGSD-0001',
    ImportSerialId: '',
    ViolationInfo: ''
},
{
    id: 4,
    LicensePlate: 'ASF-123',
    DateOfInterest: '2021/02/02',
    LicenseType: 'dummy',
    LicenseYear: 0,
    Agency: 'AG-000001',
    State: '000222',
    FirstName: 'John',
    LastName: 'bairstrow',
    Alias: '',
    VehicleYear: 2021,
    VehicleMake: 'Honda',
    VehicleModel: 'corolla',
    VehicleColor: 'black',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: 'AGSD-0001',
    ImportSerialId: '',
    ViolationInfo: ''
},
{
    id: 5,
    LicensePlate: 'ASF-123',
    DateOfInterest: '2021/02/02',
    LicenseType: 'dummy',
    LicenseYear: 0,
    Agency: 'AG-000001',
    State: '000222',
    FirstName: 'John',
    LastName: 'bairstrow',
    Alias: '',
    VehicleYear: 2021,
    VehicleMake: 'Honda',
    VehicleModel: 'corolla',
    VehicleColor: 'black',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: 'AGSD-0001',
    ImportSerialId: '',
    ViolationInfo: ''
},
{
    id: 6,
    LicensePlate: 'ASF-123',
    DateOfInterest: '2021/02/02',
    LicenseType: 'dummy',
    LicenseYear: 0,
    Agency: 'AG-000001',
    State: '000222',
    FirstName: 'John',
    LastName: 'bairstrow',
    Alias: '',
    VehicleYear: 2021,
    VehicleMake: 'Honda',
    VehicleModel: 'corolla',
    VehicleColor: 'black',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: 'AGSD-0001',
    ImportSerialId: '',
    ViolationInfo: ''
},
{
    id: 7,
    LicensePlate: 'ASF-123',
    DateOfInterest: '2021/02/02',
    LicenseType: 'dummy',
    LicenseYear: 0,
    Agency: 'AG-000001',
    State: '000222',
    FirstName: 'John',
    LastName: 'bairstrow',
    Alias: '',
    VehicleYear: 2021,
    VehicleMake: 'Honda',
    VehicleModel: 'corolla',
    VehicleColor: 'black',
    VehicleStyle: '',
    Notes: '',
    NCICNumber: 'AGSD-0001',
    ImportSerialId: '',
    ViolationInfo: ''
}
]


export const GetLicensePlateData: any = createAsyncThunk(
    'GetLicensePlateData',
    async (pageiFilter: any, thunkAPI) => {
        let headers = [
            {
                key: 'GridFilter',
                value: JSON.stringify(pageiFilter.gridFilter)
            },
            {
                key: 'GridSort',
                value: JSON.stringify(pageiFilter.gridSort)
            }
        ]
        thunkAPI.dispatch(setLoaderValue({ isLoading: true }))
        const url = `?Page=${pageiFilter.page + 1}&Size=${pageiFilter.size}`
        return await LicensePlateAgent.getLicensePlates(url, headers)
            .then((response: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
                return response
            })
            .catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
            });
    }
);

export const GetLicensePlateById: any = createAsyncThunk(
    'GetLicensePlateById',
    async (id: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: true }))
        return await LicensePlateAgent.getLicensePlateById(id)
            .then((response: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
                return response
            })
            .catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
            });
    }
);

export const DeleteLicensePlateData: any = createAsyncThunk(
    'DeleteLicensePlateData',
    async (id: number = 0, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: true }))
        //return id > 0 ? 
        return await LicensePlateAgent.deleteLicensePlateById(id) //: LicensePlateAgent.deleteLicensePlates()
            .then((response: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
                return response;
            })
            .catch((error: any) => {
                let errMessage = { statusCode: error?.response?.status, message: error?.response?.data }
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
                return errMessage;
            });
    }
);

export const AddLicensePlateData: any = createAsyncThunk(
    'AddLicensePlateData',
    async (params: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: true }))
        return await LicensePlateAgent.addLicensePlate(params.body)
            .then((response: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
                return response;
            })
            .catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
                return error;
            });
    }
);


export const ClearLicensePlateProperty: any = createAsyncThunk(
    'ClearLicensePlateProperty',
    async (param: string) => {
        return param;
    }
);

export const UpdateLicensePlateData: any = createAsyncThunk(
    'UpdateLicensePlateData',
    async (param: any, thunkAPI) => {
        thunkAPI.dispatch(setLoaderValue({ isLoading: true }))
        return await LicensePlateAgent.updateLicensePlate(param.id, param.body)
            .then((response: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "" }))
                return response;
            })
            .catch((error: any) => {
                thunkAPI.dispatch(setLoaderValue({ isLoading: false, message: "", error: true }))
                return error;
            });
    }
);

export const LicensePlateSlice = createSlice({
    name: 'LicensePlateList',
    initialState: { LicensePlateList: [], LicensplateData: {}, LicensePlateToasterData: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetLicensePlateData.fulfilled, (state: any, { payload }) => {
            state.LicensePlateList = payload;
        })
        builder.addCase(GetLicensePlateById.fulfilled, (state: any, { payload }) => {
            state.LicensplateData = payload;
        })
        builder.addCase(UpdateLicensePlateData.fulfilled, (state: any, { payload }) => {
            state.LicensePlateToasterData = payload;
        })
        builder.addCase(AddLicensePlateData.fulfilled, (state: any, { payload }) => {
            state.LicensePlateToasterData = payload;
        })
        builder.addCase(DeleteLicensePlateData.fulfilled, (state: any, { payload }) => {
            state.LicensePlateToasterData = payload;
        })
        builder.addCase(ClearLicensePlateProperty.fulfilled, (state: any, { payload }) => {
            state[payload] = {};
        })
    }
});

export default LicensePlateSlice;