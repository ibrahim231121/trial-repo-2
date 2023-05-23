import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const rows = [{
    id:1,
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
    id:2,
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
    id:3,
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
} ,
{
    id:4,
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
    id:5,
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
    id:6,
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
    id:7,
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
    async (param: any) => {
        let temp: any = rows;
        if (param !== undefined && param.gridFilter.filters.length > 0) {
            param.gridFilter.filters.map((item: any) => {
                if (item.value.includes('@')) {
                    temp = temp.filter((x: any) => item.value.toLowerCase().includes(x[`${item.field}`].toString().toLowerCase()));
                }
                else {
                    temp = temp.filter((x: any) => x[`${item.field}`].toString().toLowerCase().includes(item.value.toLowerCase()));
                }
            });
            return temp;
        }
        else {

            return rows;
        }
    }
);

export const UpdateLicensePlateData: any = createAsyncThunk(
    'UpdateLicensePlateData',
    async (params: any) => {
      return params.updateData;
    }
  );
  
export const LicensePlateSlice = createSlice({
    name: 'LicensePlate',
    initialState: { LicensePlateList: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetLicensePlateData.fulfilled, (state: any, { payload }) => {
            state.LicensePlateList = payload;
        })
    }
});

export default LicensePlateSlice;