const SearchType = {
    SimpleSearch: "SimpleSearch",
    AdvanceSearch: "AdvanceSearch",
    ShortcutSearch: "ShortcutSearch",
    ViewOwnAssets: "ViewOwnAssets"
};
const Allowed_Access_To_Restricted_Assets = "29";
const GenerateLockFilterQuery = (decoded) => {
    const shouldGroup = [];
    const isAllowed = decoded.AssignedModules.includes(Allowed_Access_To_Restricted_Assets);
    if (!isAllowed) {
        shouldGroup.push({
            "bool": {
                "must_not": {
                    "exists": {
                        "field": "masterAsset.lock"
                    }
                }
            }
        });
    }
    return {
        "bool": {
            "should": shouldGroup
        }
    }
}

const BlockLockedAssets = (decoded, searchType, response, actionPlacement) => {
    if (decoded) {
        const isAllowed = decoded.AssignedModules.includes(Allowed_Access_To_Restricted_Assets);
        if ((!isAllowed) && (searchType !== 'ViewOwnAssets')) {
            let blockedAssets;
            if ((actionPlacement === "getAssetSearchInfoAsync")) {
                blockedAssets = response.map((evidence) => {
                    return {
                        ...evidence,
                        asset: evidence.asset.filter((x) => (x.lock === undefined) || (x.lock === null))
                    }
                });
                return blockedAssets;
            } else if (actionPlacement === "AssetDetailsTemplate") {
                blockedAssets = response.filter((x) => (x.lock === undefined) || (x.lock === null));
                return blockedAssets;
            }
            else if (actionPlacement === "AssetActionReducer") {
                blockedAssets = response.filter(res => {
                    const asset = res.evidence.asset.find((a) => a.assetId === res.assetId);
                    if ((asset.lock === undefined) || (asset.lock === null)) {
                        return res;
                    }
                });
                return blockedAssets;
            }
            else { }
        }
        return response;
    }
}

export { SearchType, GenerateLockFilterQuery, BlockLockedAssets }
