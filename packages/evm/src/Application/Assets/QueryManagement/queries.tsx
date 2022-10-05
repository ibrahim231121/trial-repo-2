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

let GetAssetsByUserName = (userName: string, groupIds: string) => {
    const lockQuery = GenerateLockFilterQuery(groupIds);
    return {
        bool: {
            should: [
                {
                    match: { "asset.owners": userName }
                }
            ],
            "filter": lockQuery
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
        }
    ];
    let filterQuery : any = {
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
    let approachingDeletion = {
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
            ],
            "filter": lockQuery
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