import { DeviceType } from '../../../../utils/Api/models/UnitModels';
import { StationFormType } from './../StationTypes';
export interface UnitTemplatesModel {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    values : StationFormType;
    deviceTypeCollection : DeviceType[];
    isAddCase : boolean;
    defaultUnitTemplateSelectBoxValues: any[];
    setDefaultUnitTemplateSelectBoxValues: (param: any) => void;
}