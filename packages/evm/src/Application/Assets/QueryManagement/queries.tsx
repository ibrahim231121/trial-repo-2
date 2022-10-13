import moment from 'moment';
import { GenerateLockFilterQuery } from '../utils/constants';

let GetAssetsByState = (status: string, groupIds: string) => {
    const lockQuery = GenerateLockFilterQuery(groupIds);
    return {
        bool: {
            must: [
                {
                    match: { "asset.state": status }
                }
            ],
            "filter": lockQuery
        }
    }
};

let GetAssetsByUserName = (userName: string) => {
    return {
        bool: {
            must: [
                {
                    match: { "asset.owners": userName }
                }
            ]
        }
    }
}

let GetAssetsUnCategorized = (startDate: string, endDate: string, groupIds: string) => {
    let lockQuery = GenerateLockFilterQuery(groupIds);
    let mustQuery = [
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
        },
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
    ];
    let filterQuery : any = {
        "bool": {
            "should": [
               
            ]
        }
    };
   
    filterQuery.bool.should.push(...lockQuery.bool.should);
    const query = {
        bool: {
            must: mustQuery,
            "filter": filterQuery
        }
    };
    return query;
};

let GetAssetsApproachingDeletion = (startDate: string, endDate: string, groupIds: string) => {
    const lockQuery = GenerateLockFilterQuery(groupIds);
    const infinite = '9999-12-31T00:00:00Z';
    let approachingDeletion = {
        bool : {
            "should": [
                {
                    "bool": {
                        "must_not": {
                            "exists": {
                                "field": "holdUntil"
                            }
                        },
                        "must": [
                            {
                                "range": {
                                    "expireOn": {
                                        "gte": `${moment(startDate).toISOString()}`
                                    }
                                }
                            },
                            {
                                "range": {
                                    "expireOn": {
                                        "lte": `${moment(endDate).toISOString()}`
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    "bool": {
                        "must_not": {
                            "term": {
                                "holdUntil": `${infinite}`
                            }
                        },
                        "must": [
                            {
                                "exists": {
                                    "field": "holdUntil"
                                }
                            },
                            {
                                "range": {
                                    "holdUntil": {
                                        "gte": `${moment(startDate).toISOString()}`
                                    }
                                }
                            },
                            {
                                "range": {
                                    "holdUntil": {
                                        "lte": `${moment(endDate).toISOString()}`
                                    }
                                }
                            }
                        ]
                    }
                }
            ],
            "filter": lockQuery
        }
    };
    return approachingDeletion;
}

export default {
    GetAssetsByState,
    GetAssetsUnCategorized,
    GetAssetsApproachingDeletion,
    GetAssetsByUserName
}