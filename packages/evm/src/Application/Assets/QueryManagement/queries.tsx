import moment from 'moment';

let GetAssetsByState = (status: string) => {
    return {
        bool: {
            must: [
                {
                    match: { "asset.state": status }
                }
            ]
        }
    }
};

let GetAssetsByUserName = (userName : string) =>{
    return {
        
            bool:{
                should:[
                    {
                        match:{"asset.owners": userName}
                    }  
                ]
            }
        
        
    }
}    

let GetAssetsUnCategorized = (startDate : string, endDate :string) =>{
    return {
        bool: {
            must: [
                {
                    range: {
                        "masterAsset.recordingStarted": {
                            gte: `${moment(startDate).toISOString()}`,
                        },
                    },
                },
                {
                    range: {
                        "masterAsset.recordingStarted": {
                            lte: `${moment(endDate).toISOString()}`,
                        },
                    },
                }
            ],
            "filter": {
                "bool": {
                    "should": [
                        {
                            "bool": {
                                "must_not": {
                                    "exists": {
                                        "field": "categories"
                                    }
                                }
                            }
                        },
                        {
                            "script": {
                                "script": {
                                    "source": "doc['categories.keyword'].length == 0"
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
};

let GetAssetsApproachingDeletion = (startDate: string, endDate: string) => {

    var approachingDeletion = {
        bool: {
            must: [
                {
                    range: {
                        "expireOn": {
                            gte: `${moment(startDate).toISOString()}`,
                        },
                    },
                },
                {
                    range: {
                        "expireOn": {
                            lte: `${moment(endDate).toISOString()}`,
                        },
                    },
                }
            ]
        }
    }
    return approachingDeletion;
}

export default {
    GetAssetsByState,
    GetAssetsUnCategorized,
    GetAssetsApproachingDeletion,
    GetAssetsByUserName
}