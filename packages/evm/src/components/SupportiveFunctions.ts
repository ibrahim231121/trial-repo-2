import moment from "moment";

export type Order = "asc" | "desc";

export type ValueString = {
  value: string;
};

export type SearchObject = {
  columnName: string;
  colIdx: number;
  value: any;
};

export type Asset = {
  assetId: string;
  assetName: string;
  camera: string;
  assetType: string;
  recordingStarted: string;
};

export interface HeadCellProps {
  id: any;
  label: string;
  align: string;
  sort?: boolean;
  visible?: boolean;
  minWidth: string;
  maxWidth?: string;
  dataComponent?: any;
  searchFilter?: boolean;
  searchComponent?: any; // (Dropdown / Multiselect / Input / Custom Component)
  keyCol?: boolean; // This is a Key column. Do not assign it to maximum 1 column
  headerArray?: ValueString[];
  headerObject?: any;
  detailedDataComponentId?: string;
}

export function DateFormat(value: string) {
  const stillUtc = moment.utc(value).toDate();
  const localDate = moment(stillUtc).local().format("YYYY-MM-DD");
  return localDate;
}

export const onResizeRow = (
  e: {
    colIdx: number;
    deltaX: number;
  },
  headCells: HeadCellProps[]
) => {
  const { colIdx, deltaX } = e;
  let value = headCells[colIdx].minWidth;

  let x = parseInt(value) + deltaX;
  //headCells[colIdx].minWidth = x.toString()

  let headCellReset = headCells.map(
    (headCell: HeadCellProps, index: number) => {
      if (index === colIdx) headCell.minWidth = x.toString();
      return headCell;
    }
  );
  return headCellReset;
};

export const onClearAll = (headCells: HeadCellProps[]) => {
  let headCellReset = headCells.map((headCell: HeadCellProps) => {
    headCell.headerArray = [{ value: "" }];
    return headCell;
  });
  return headCellReset;
};

export const onTextCompare = (
  dataRows: any[],
  headCells: HeadCellProps[],
  el: SearchObject
) => {
  dataRows = dataRows.filter((x: any) => {
    return (
      (x[headCells[el.colIdx].id] === undefined
        ? ""
        : x[headCells[el.colIdx].id]
      )
        .toLowerCase()
        .indexOf(el.value[0].toLowerCase()) !== -1
    );
  });
  return dataRows;
};

export const onMultipleCompare = (
  dataRows: any[],
  headCells: HeadCellProps[],
  el: SearchObject
) => {
  dataRows = dataRows.filter((x: any) => {
    return el.value.includes(x[headCells[el.colIdx].id]);
  });
  return dataRows;
};

export const onMultiToMultiCompare = (
  dataRows: any[],
  headCells: HeadCellProps[],
  el: SearchObject
) => {
  dataRows = dataRows.filter((x: any) => {
    return x[headCells[el.colIdx].id]
      .map((y: any) => el.value.includes(y))
      .includes(true);
  });
  return dataRows;
};

export const onDateCompare = (
  dataRows: any[],
  headCells: HeadCellProps[],
  el: SearchObject
) => {
  dataRows = dataRows.filter(
    (x: any) =>
      DateFormat(x[headCells[el.colIdx].id]) >= DateFormat(el.value[0]) &&
      DateFormat(x[headCells[el.colIdx].id]) <= DateFormat(el.value[1])
  );
  return dataRows;
};

export const onSetHeadCellVisibility = (headCells: HeadCellProps[]) => {
  let headCellsArray = headCells.map((headCell: HeadCellProps) => {
    headCell.visible =
      headCell.visible || headCell.visible === undefined ? true : false;
    return headCell;
  });
  return headCellsArray;
};

export const onSaveHeadCellData = (headCells: HeadCellProps[]) => {
  let getHeadCells = localStorage.getItem("headCells");
  if (getHeadCells === null) {
    localStorage.setItem("headCells", JSON.stringify(headCells));
  }
};

export const onSetSingleHeadCellVisibility = (
  prevheadCells: HeadCellProps[],
  currheadCells: HeadCellProps[]
) => {
  let headCellsArray = prevheadCells.map(
    (headCell: HeadCellProps, index: number) => {
      headCell.visible = currheadCells[index].visible;
      return headCell;
    }
  );
  return headCellsArray;
};

export const onSetSearchDataValue = (
  value: ValueString[],
  headCells: HeadCellProps[],
  colIdx: number
) => {
  let searchDataValue = {
    columnName: headCells[colIdx].id.toString(),
    colIdx,
    value: value.map((x, i) => {
      return x["value"];
    }),
  };
  return searchDataValue;
};