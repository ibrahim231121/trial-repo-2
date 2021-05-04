//always add these two lines at the top.
declare const self: Worker;
export default {} as typeof Worker & { new (): Worker };


self.addEventListener("message", async (event: MessageEvent) => {
  const { searchData, value } = event.data;

  if (event.data.value.length >= 3) {

    
    let found: string = "";
    found = searchData.map((data: any) => {
      if (data.cadId.toLowerCase().startsWith(value.toLowerCase())) {
        self.postMessage(data.cadId);

        return data.cadId;
      }
      if (data.asset.assetName.toLowerCase().startsWith(value.toLowerCase())) {
        self.postMessage(data.asset.assetName);
        return data.asset.assetName;
      }
      if (data.categories.length > 0) {
        const findCat = data.categories.find((x: any) => {
          value
            .toLowerCase()
            .split(" ")
            .map((y: any) => {
              if (x.toLowerCase().startsWith(y) && y != "") {
                {
                  self.postMessage(x);
                  return x;
                }
              }
            });
        });
        if (findCat) {
          return findCat;
        }
      }

      if (data.asset.recordedBy.length > 0) {
        const findRecordedBy = data.asset.recordedBy.find((x: any) => {
          value
            .toLowerCase()
            .split(" ")
            .map((y: any) => {
              if (x.toLowerCase().startsWith(y) && y != "") {
                {
                  self.postMessage(x);
                  return x;
                }
              }
            });
        });
        if (findRecordedBy) {
          return findRecordedBy;
        }
      }
    });
  }
});
