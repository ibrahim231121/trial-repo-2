import moment from 'moment';

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
                            gte: `${moment(startDate).toISOString()}`,
                            },
                        },
                    },
                    {
                        range: {
                            "asset.recordingStarted": {
                            lte: `${moment(endDate).toISOString()}`,
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
                        gte: `${moment(startDate).toISOString()}`,
                        },
                    },
                }, 
                {
                    range: {
                        "asset.expiryDate": {
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
    GetAssetsBySatus,
    GetAssetsUnCategorized,
    GetAssetsApproachingDeletion
}