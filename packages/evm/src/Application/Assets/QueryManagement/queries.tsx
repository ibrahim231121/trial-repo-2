let GetAssetsBySatus = (status : string) =>{
    return {
        bool:{
            must:[
                {
                    match:{"asset.status": status}
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
                            "asset.recordingStarted": {
                            gte: `${startDate}`,
                            },
                        },
                    },
                    {
                        range: {
                            "asset.recordingStarted": {
                            lte: `${endDate}`,
                            },
                        },
                    },
                    {
                        script: {
                            script: 
                            {
                                source: "doc['categories.keyword'].length == 0"
                            }
                        }
                    }
                ]
            }           
    }
}

let GetAssetsApproachingDeletion = (startDate : string, endDate :string) => {

    var approachingDeletion =  {
        bool: {
            must: [
                {
                    range: {
                        "asset.expiryDate": {
                        gte: `${startDate}`,
                        },
                    },
                },
                {
                    range: {
                        "asset.expiryDate": {
                        lte: `${endDate}`,
                        },
                    },
                }
            ]
        }           
    }
    return approachingDeletion;
}

export default {
    GetAssetsBySatus,
    GetAssetsUnCategorized,
    GetAssetsApproachingDeletion
}