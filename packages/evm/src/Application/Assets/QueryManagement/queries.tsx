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

export default {
    GetAssetsBySatus,
    GetAssetsUnCategorized
}