import { PageiGrid } from '../../../../GlobalFunctions/globalDataTableFunctions';

export type RetentionPoliciesDetailModel = {
    id: number;
    title: string;
    pageiGrid: PageiGrid;
    openModel: React.Dispatch<React.SetStateAction<any>>;
};
