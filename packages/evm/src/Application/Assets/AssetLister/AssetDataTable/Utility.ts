import { SearchModel } from '../../../../utils/Api/models/SearchModel';
import { EvidenceObjectToPassInActionMenu } from './AssetDataTableModel';

const ReFormatPropsForActionMenu = (evidence: SearchModel.Evidence, assetId: number): EvidenceObjectToPassInActionMenu => {
    let o: EvidenceObjectToPassInActionMenu = {} as EvidenceObjectToPassInActionMenu;
    o.assetId = assetId;
    o.evidence = evidence;
    return o;
};

export { ReFormatPropsForActionMenu };
