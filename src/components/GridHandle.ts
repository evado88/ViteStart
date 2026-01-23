// GridHandle.ts
import type DataGrid from "devextreme/ui/data_grid";

export interface GridHandle {
  exportToExcel: (includeHidden?: boolean) => void;
  refresh: () => void;
  getInstance: () => DataGrid;
}