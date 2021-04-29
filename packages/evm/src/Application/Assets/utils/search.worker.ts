//always add these two lines at the top.
declare const self: Worker;
export default {} as typeof Worker & { new (): Worker };
const URL = "/Evidence?Size=10&Page=1";
let Data: any;
const fetchData = async (querry: any, value: string) => {
  let data = await fetch(URL, {
    method: "POST", // or 'PUT'
    headers: {
      "Group-Ids": "1,2,3,4,5",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(querry),
  });
  return (data = await data.json());
};

self.addEventListener("message", async (event: MessageEvent) => {
  const { searchData, value } = event.data;

  if (event.data.value.length >= 3) {
    const querry = {
      bool: {
        must: [
          {
            query_string: {
              query: `${value}*`,
              fields: [
                "asset.assetName",
                "categories",
                "cADId",
                "asset.recordedBy",
              ],
            },
          },
        ],
      },
    };
    let found: string = "";
    const newData = await fetchData(querry, value);
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
