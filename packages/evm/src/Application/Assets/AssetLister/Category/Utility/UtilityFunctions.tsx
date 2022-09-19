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

export { filterCategory };