import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ALPRDataSource } from '../utils/Api/ApiAgent';
import { setLoaderValue } from './loaderSlice';
const rows = [{
  id: 1,
  Name: 'John',
  SourceName: 'No Source',
  SourceType: 0,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 1,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
  ,
{
  id: 2,
  Name: 'Webster',
  SourceName: 'No Source',
  SourceType: 1,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 2,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
  ,
{
  id: 3,
  Name: 'adam',
  SourceName: 'No Source',
  SourceType: 3,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 3,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
  ,
{
  id: 4,
  Name: 'Brock',
  SourceName: 'No Source',
  SourceType: 3,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 0,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
  ,
{
  id: 5,
  Name: 'Lesnar',
  SourceName: 'No Source',
  SourceType: 2,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 0,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
  ,
{
  id: 6,
  Name: 'Hack',
  SourceName: 'No Source',
  SourceType: 1,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 0,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
  ,
{
  id: 7,
  Name: 'hacker',
  SourceName: 'Source 1',
  SourceType: 2,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 0,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
  ,
{
  id: 8,
  Name: 'bytebytego',
  SourceName: 'Source 2',
  SourceType: 3,
  UserId: '',
  Password: '',
  ConfirmPassword: '',
  ConnectionType: 0,
  SchedulePeriod: 0,
  LocationPath: '',
  Port: '',
  LastRun: '',
  Status: '',
  StatusDescription: '',
}
];
//Source Options DropDown
const SourceOptions =
  [{
    id: 2,
    label: "CSV"
  },
  {
    id: 1,
    label: "Manual"
  },
  {
    id: 3,
    label: "XML"
  }
  ];

const ConnectionTypeOptions = 
  [{
    id: 1,
    label: "FTP"
  },
  {
    id: 2,
    label: "Local"
  },
  {
    id: 3,
    label: "UNC"
  }
  ];

const MappingData=[
  {
    LicensePlate: 'ASF-123',
    DateOfInterest: '2021/02/02',
    LicenseType: 'dummy',
    AgencyId: 'AG-000001',
    StateId: '000222',
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
  }]
  let Datasource="HotListDataSource";

export const GetAlprDataSourceList: any = createAsyncThunk(
  'GetAlprDataSourceList',
    async (pageiFilter: any, thunkAPI) => {
      thunkAPI.dispatch(setLoaderValue({isLoading: true}))
      const url = Datasource+`?Page=${pageiFilter.page+1}&Size=${pageiFilter.size}`
      let headers = [
          {   
              key : 'GridFilter', 
              value : JSON.stringify(pageiFilter.gridFilter)
          },
          {
              key: 'GridSort', 
              value : JSON.stringify(pageiFilter.gridSort)
          }]
      return await ALPRDataSource.getDataSourceInfoAsync(url, headers)
      .then((response:any) => {
        debugger;
          thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "" }))
          return response
      }).catch((error: any) => {
          thunkAPI.dispatch(setLoaderValue({isLoading: false, message: "", error: true }))
          console.error(error.response.data);
        });
  }
);

export const SourceTypeDropDown:any=createAsyncThunk(
  'SourceTypeDropDown',
  async () => {
    return SourceOptions 
  }
)

export const ConnectionTypeDropDown:any=createAsyncThunk(
  'ConnectionTypeDropDown',
  async () => {
    return ConnectionTypeOptions 
  }
)


export const UpdateAlprDataSourceData: any = createAsyncThunk(
  'UpdateAlprDataSourceData',
  async (params: any) => {
    return params.newGridData;
  }
);

export const SourceMapping:any=createAsyncThunk
(
  'AlprDataSourceMapping',
  async()=>
  {
    return MappingData;
  }
)


export const AlprDataSourceSlice = createSlice({
  
  name: 'AlprDataSource',
  initialState: { DataSource: [], ConnectionType:[],SourceType:[] ,SourceMapping:[]},
  reducers: {},
  
  extraReducers: (builder) => {
    builder.addCase(GetAlprDataSourceList.fulfilled, (state: any, { payload }) => {
      state.DataSource = payload;
    })
      .addCase(ConnectionTypeDropDown.fulfilled, (state: any, { payload }) => {
        state.ConnectionType = payload;
      })
      .addCase(SourceTypeDropDown.fulfilled, (state: any, { payload }) => {
        state.SourceType = payload;
      })
      .addCase(SourceMapping.fulfilled, (state: any, { payload }) => {
        state.SourceMapping = payload;
      })
  }
});

export default AlprDataSourceSlice;