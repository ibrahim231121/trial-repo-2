import moment from 'moment';
import { SearchModel } from '../../../../utils/Api/models/SearchModel';
import { EvidenceObjectToPassInActionMenu } from './AssetDataTableModel';

const ReFormatPropsForActionMenu = (evidence: SearchModel.Evidence, assetId: number): EvidenceObjectToPassInActionMenu => {
    let o: EvidenceObjectToPassInActionMenu = {} as EvidenceObjectToPassInActionMenu;
    o.assetId = assetId;
    o.evidence = evidence;
    return o;
};

const checkIndefiniteDate = (date : Date, isEvidenceRelations : boolean) => {
    let differenceOfYears = date.getFullYear() - moment().year();
    if(differenceOfYears > 50 || isEvidenceRelations == true)
      return true;
    return false;
  }

export { ReFormatPropsForActionMenu, checkIndefiniteDate };