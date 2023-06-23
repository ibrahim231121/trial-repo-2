import { PageiGrid } from "../../GlobalFunctions/globalDataTableFunctions"

export type GetAlprCapturePayload = {
    pageiGrid:PageiGrid,
    userId:number,
    startDate: string,
    endDate:string,
    hotListId:number
}

export type GetAlprPlateHistoryPayload = {
    pageiGrid:PageiGrid,
    numberPlateId:number
}