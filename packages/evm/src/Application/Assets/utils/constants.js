const assetShortCutPrefix = "#";

const AssetStatus ={
    Deleted : "Deleted",
    Trash : "Trash",   
}

const AssetShortCuts = {
  Trash:"Trash",
  NotCategorized : "Not Categorized",
  ApproachingDeletion:"Approaching Deletion"
}

const AssetShortCutsWithPrefix = {

  NotCategorized : assetShortCutPrefix + AssetShortCuts.NotCategorized,
  Trash:assetShortCutPrefix + AssetShortCuts.Trash,
  ApproachingDeletion:assetShortCutPrefix + AssetShortCuts.ApproachingDeletion,
}

const SearchType = {
   SimpleSearch: "SimpleSearch",
   AdvanceSearch: "AdvanceSearch",
   ShortcutSearch: "ShortcutSearch"
}

export const advancedSearchOptions= [
    {
      value: "User Name",
      key: "username",
      _id: "1",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    }, 
    {
      value: "Unit ID",
      key: "unit",
      _id: "2",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
    {
      value: "Category",
      key: "category",
      _id: "3",
      usedBy: null,
      isUsed: false,
      inputValue: "",
    },
  ]

const AssetUnCategorized  = "UnCategorized";


export default { AssetStatus, AssetUnCategorized, SearchType, AssetShortCuts, AssetShortCutsWithPrefix, assetShortCutPrefix}