import { SearchModel } from '../../../../utils/Api/models/SearchModel';

export type DateTimeProps = {
    dateTimeObj: DateTimeObject;
    colIdx: number;
};

export type DateTimeObject = {
    startDate: string;
    endDate: string;
    value: string;
    displayText: string;
};

export type MasterAsset = {
    assetId: string;
    assetName: string;
    assetType: string;
    unit: string;
    owners: string[];
    recordingStarted: string;
    status: string;
};

export type MasterMainProps = {
    rowsData: SearchModel.Evidence[];
    dateOptionType: string;
    dateTimeDetail: DateTimeObject;
    showDateCompact: boolean;
    showAdvanceSearch?: boolean;
    showSearchPanel? : any,
    searchResultText ? : Object,
    advanceSearchText? : any,
};

export interface AssetDetailRouteStateType {
    evidenceId: number;
    assetId: number;
    assetName: string;
    evidenceSearchObject: SearchModel.Evidence;
}

export interface renderCheckMultiselect {
    value: string;
    id: string;
};

export type EvidenceObjectToPassInActionMenu = {
    assetId: number;
    evidence : SearchModel.Evidence;
}