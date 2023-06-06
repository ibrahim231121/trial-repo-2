import { PageiGrid } from "../../GlobalFunctions/globalDataTableFunctions"

export type GetAlprCapturePayload = {
    pageiGrid:PageiGrid,
    userId:number,
    startDate: string,
    endDate:string,
    hotListIds:any[]
}