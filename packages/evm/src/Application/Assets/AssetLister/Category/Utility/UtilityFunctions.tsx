import { SetupConfigurationAgent } from "../../../../../utils/Api/ApiAgent";
import { SETUP_CONFIGURATION_SERVICE_URL } from "../../../../../utils/Api/url";
import { MaxRetentionPolicyDetail } from "../Model/MaxRetentionPolicyDetail";

const findRetentionAndHoldUntill = async (categoryOptions: any): Promise<MaxRetentionPolicyDetail> => SetupConfigurationAgent.getGetMaxRetentionDetail(`${SETUP_CONFIGURATION_SERVICE_URL}/Categories/GetMaxRetentionDetail`, categoryOptions.map((x: any) => parseInt(x.id))).then((response) => response);

const awaitJson = (response: any) => {
  if (response.status == 200) {
    return response.data;
  }
  throw new Error(response.statusText);
};

const filterCategory = (arr: Array<any>): Array<any> => {
  let sortedArray = [];
  if (arr.length > 0) {
    for (const element of arr) {
      sortedArray.push({
        id: element.id,
        label: element.name
      });
    }
  }
  sortedArray = sortedArray.sort((a: any, b: any) =>
    a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
  );
  return sortedArray;
};

export { findRetentionAndHoldUntill, awaitJson, filterCategory };