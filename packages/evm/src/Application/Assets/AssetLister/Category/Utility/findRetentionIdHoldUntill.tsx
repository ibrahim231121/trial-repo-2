import moment from "moment";
import { SETUP_CONFIGURATION_SERVICE_URL } from "../../../../../utils/Api/url";

const findRetentionAndHoldUntill = async (assignedCategories: any, categoryOptions: any, filterValue: any, rowData: any) => {
  let objToReturn: any;
  const retentionDetails: any = [];
  let retentionList = '';
  let count = 0;
  const categoriesWithRetention = categoryOptions.filter((o: any) => {
    return filterValue.some((e: any) => e.id === o.id);
  });
  for (const i of categoriesWithRetention) {
    const retentionId = i.policies.retentionPolicyId;
    retentionList +=
      filterValue.length !== count + 1 ? `PolicyIDList=${retentionId}&` : `PolicyIDList=${retentionId}`;
    count++;
  }
  const url = `${SETUP_CONFIGURATION_SERVICE_URL}/Policies/DataRetention?${retentionList}`;
  await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', TenantId: '1' }
  })
    .then(awaitJson)
    .then((response: any) => {
      for (let i = 0; i <= response.length - 1; i++) {
        retentionDetails.push({
          categoryName: categoriesWithRetention[i].name,
          retentionId: response[i].id,
          hours: response[i].detail.limit.hours + response[i].detail.limit.gracePeriodInHours
        });
      }
      const retentionDecrementedArray = retentionDetails.sort((a: any, b: any) => (a.hours > b.hours ? 1 : -1)).reverse();


      let attachedCategories = assignedCategories.map((i : any) => {
        return {
          id : i.id,
          name : filterValue.find((x : any) => x.id === i.id).label
        }
      });
      const isCategoryContainsHighestRetention = attachedCategories.some((e: any) => e.name === retentionDecrementedArray[0].categoryName)
      if (isCategoryContainsHighestRetention) {
        const recordingStarted = rowData.recordingStarted;
        const expiryDate = moment(recordingStarted).add(retentionDecrementedArray[0].hours, 'hours').utc();
        const highestRetentionId = categoryOptions.find((o: any) => o.name === retentionDecrementedArray[0].categoryName).policies.retentionPolicyId;
        objToReturn = {
          'retentionId': highestRetentionId,
          'expiryDate': expiryDate.format('YYYY-MM-DDTHH:mm:ss')
        };
      }
    })
  return objToReturn;
};

const awaitJson = (response: any) => {
  if (response.ok) {
    return response.json() as Object;
  }
  throw new Error(response.statusText);
};

export default findRetentionAndHoldUntill;