import moment from 'moment';
import { IDecoded } from '../../../Login/API/auth';
import { GenerateLockFilterQuery } from '../utils/constants';

let GetAssetsByState = (status: string, decoded: IDecoded) => {
    const lockQuery = GenerateLockFilterQuery(decoded);
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
    let trimmedUserName: string;
    if (userName.includes('@'))
        trimmedUserName = userName.split('@')[0];
    else
        trimmedUserName = userName;
    return {
        bool: {
            must: [
                {
                    match: { "asset.owners": trimmedUserName }
                }
            ]
        }
    }
}

let GetAssetsUnCategorized = (startDate: string, endDate: string, decoded: IDecoded) => {
    let lockQuery = GenerateLockFilterQuery(decoded);
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
    let filterQuery: any = {
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

let GetAssetsApproachingDeletion = (startDate: string, endDate: string, decoded: IDecoded) => {
    const lockQuery = GenerateLockFilterQuery(decoded);
    const infinite = '9999-12-31T00:00:00Z';
    let approachingDeletion = {
        bool: {
            "must": [
                {
                    "bool": {
                        "must": {
                            "bool": {
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
                                ]
                            }
                        },
                        "should": [
                            ...lockQuery.bool.should
                        ]
                    }
                }
            ]
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