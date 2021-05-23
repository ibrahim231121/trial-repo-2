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

}

export default {
    GetAssetsBySatus,
    GetAssetsUnCategorized
}