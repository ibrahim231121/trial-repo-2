
// const assetShortCutPrefix = "#";

// const AssetStatus = {
//     Deleted : i18n.t("Deleted"),
//     Trash : i18n.t("Trash"),   
// }

// const AssetShortCuts = {
//   Trash: i18n.t("Trash"),  
//   NotCategorized : i18n.t("Not_Categorized"),
//   ApproachingDeletion: i18n.t("Approaching_Deletion")
// }

// const AssetShortCutsWithPrefix = {

//   NotCategorized : assetShortCutPrefix + AssetShortCuts.NotCategorized,
//   Trash:assetShortCutPrefix + AssetShortCuts.Trash,
//   ApproachingDeletion:assetShortCutPrefix + AssetShortCuts.ApproachingDeletion,
// }

// const SearchType = {
//    SimpleSearch: i18n.t("SimpleSearch"),
//    AdvanceSearch: i18n.t("AdvanceSearch"),
//    ShortcutSearch: i18n.t("ShortcutSearch")
// }

// export const advancedSearchOptions= [

//     {
//       value: i18n.t("User_Name"),
//       key: "username",
//       _id: "1",
//       usedBy: null,
//       isUsed: false,
//       inputValue: "",
//     }, 
//     {
//       value: i18n.t("Unit_ID"),
//       key: "unit",
//       _id: "2",
//       usedBy: null,
//       isUsed: false,
//       inputValue: "",
//     },
//     {
//       value: i18n.t("Category"),
//       key: "category",
//       _id: "3",
//       usedBy: null,
//       isUsed: false,
//       inputValue: "",
//     },
//   ]

//const AssetUnCategorized  = i18n.t("UnCategorized");


const SearchType = {
    SimpleSearch: "SimpleSearch",
    AdvanceSearch: "AdvanceSearch",
    ShortcutSearch: "ShortcutSearch",
    ViewOwnAssets: "ViewOwnAssets"
}

const GenerateLockFilterQuery = (decoded) => {
    const Allowed_Access_To_Restricted_Assets = "29";
    const shouldGroup = [];
    const isAllowed = decoded.AssignedModules.includes(Allowed_Access_To_Restricted_Assets);
    if (!isAllowed) {
        // const groupIds = decoded.AssignedGroups.split(',');
        shouldGroup.push({
            "bool": {
                "must_not": {
                    "exists": {
                        "field": "masterAsset.lock"
                    }
                }
            }
        });
        // for (const id of groupIds) {
        //     shouldGroup.push({
        //         "bool": {
        //             "must": {
        //                 "match": {
        //                     "masterAsset.lock.groupRecId": id
        //                 }
        //             }
        //         }
        //     });
        // }
    }
    // else {
    //     shouldGroup.push({
    //         "bool": {
    //             "must_not": {
    //                 "exists": {
    //                     "field": "masterAsset.lock"
    //                 }
    //             }
    //         }
    //     });
    // }
    return {
        "bool": {
            "should": shouldGroup
        }
    }
}

export { SearchType, GenerateLockFilterQuery }

//export default { AssetStatus, AssetUnCategorized, SearchType, AssetShortCuts, AssetShortCutsWithPrefix, assetShortCutPrefix}
