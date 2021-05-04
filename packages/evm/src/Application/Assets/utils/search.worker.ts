//always add these two lines at the top.
declare const self: Worker;
export default {} as typeof Worker & { new (): Worker };

self.addEventListener("message", async (event: MessageEvent) => {
  const { data:searchData, value } = event.data;

  if (value.length >= 3) {
    let found: string = "";

    var compactedSearchData = searchData.map((data:any) => {
        return {   
          assetName: data.asset.assetName, 
          recordedBy: data.asset.recordedBy,
          categories : data.categories,
          cadId: data.cadId 
        }
    });
 
    const keywordsResult = compactedSearchData.reduce((compactedSearch : Array<string>, item:any) => {
      compactedSearch.push(item.cadId);
      compactedSearch.push(item.assetName);
      compactedSearch =  compactedSearch.concat(item.categories);
      compactedSearch = compactedSearch.concat(item.recordedBy);
      return compactedSearch;
    }, []);

    var keywordSearched : Array<string> = [];
    keywordSearched = keywordsResult
                                    .filter((keyword : string, index:Number, self:string[]) => 
                                      keyword.toLowerCase().startsWith(value.toLowerCase()) 
                                      && self.indexOf(keyword) === index)
                                      
    self.postMessage(keywordSearched);
  }
});
