import { SelectedCategoryModel } from "../Model/FormContainerModel";
const filterCategory = (arr: Array<any>): Array<SelectedCategoryModel> => {
  let sortedArray: Array<SelectedCategoryModel> = [];
  if (arr.length > 0) {
    for (const element of arr) {
      sortedArray.push({
        id: element.id,
        label: element.name
      });
    }
  }
  sortedArray = sortedArray.sort((a, b) =>
    a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
  );
  return sortedArray;
};
export { filterCategory };