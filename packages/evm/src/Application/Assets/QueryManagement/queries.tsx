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

let GetAssetsUnCategorized = () =>{
    return {
            bool: {
                must: [
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
    return {
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
}

export default {
    GetAssetsBySatus,
    GetAssetsUnCategorized,
    GetAssetsApproachingDeletion
}