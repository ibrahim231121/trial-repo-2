export namespace AddMetaDataUtility {
    type StationAutoSelectModel = {
        id: string;
        label: string;
    };

     export const filterStation = (arr: Array<any>): Array<StationAutoSelectModel> => {
        let sortedArray: Array<StationAutoSelectModel> = [];
        if (arr?.length > 0) {
            for (const element of arr) {
                sortedArray.push({
                    id: element.id,
                    label: element.name
                });
            }
        }
        sortedArray = sortedArray.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1));
        return sortedArray;
    };  
}


