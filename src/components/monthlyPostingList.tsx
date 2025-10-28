import React from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "./card";
import Assist from "../classes/assist";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  ColumnChooser,
  Editing,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
interface MonthlyPostArgs {
  data: any;
  loadingText: string;
  addButtonOptions?: any;
}
export const MonthlyPostingsList = ({
  data,
  loadingText,
  addButtonOptions,
}: MonthlyPostArgs) => {
  return (
    /* start title */
    <Card showHeader={false}>
      <DataGrid
        className={"dx-card wide-card"}
        dataSource={data}
        keyExpr={"id"}
        noDataText={loadingText}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Editing
          mode="row"
          allowUpdating={false}
          allowDeleting={false}
          allowAdding={false}
        />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <LoadPanel enabled={true} />
        <ColumnChooser enabled={true} mode="select"></ColumnChooser>
        <Toolbar>
          {addButtonOptions != null && <Item
            location="before"
            locateInMenu="auto"
            showText="always"
            widget="dxButton"
            options={addButtonOptions}
          />}
          <Item name="columnChooserButton" />
        </Toolbar>
        <Column dataField="id" caption="ID" hidingPriority={13}></Column>
        <Column
          dataField="date"
          caption="Name"
          dataType="date"
          format={"dd MMMM yyy"}
          hidingPriority={12}
          cellRender={(e) => {
            if (
              e.data.status.status_name == "Submitted" &&
              e.data.stage.stage_name == "Awaiting POP Upload"
            ) {
              return (
                <a href={`/my/monthly-posting/pop-upload/${e.data.id}`}>
                  {e.text}
                </a>
              );
            } else {
              return (
                <a href={`/my/monthly-posting/view/${e.data.id}`}>{e.text}</a>
              );
            }
          }}
        ></Column>
        <Column
          dataField="stage.stage_name"
          caption="Stage"
          hidingPriority={11}
        ></Column>
        <Column
          dataField="status.status_name"
          caption="Status"
          hidingPriority={11}
        ></Column>
        <Column
          dataField="saving"
          caption="Saving"
          format={",##0.###"}
          hidingPriority={10}
        ></Column>
        <Column
          dataField="shares"
          caption="Shares"
          format={",##0.###"}
          hidingPriority={9}
        ></Column>
        <Column
          dataField="social"
          caption="Social"
          format={",##0.###"}
          hidingPriority={8}
        ></Column>
        <Column
          dataField="penalty"
          caption="Penalty"
          format={",##0.###"}
          hidingPriority={7}
        ></Column>
        <Column
          dataField="loan_interest"
          caption="Interest"
          format={",##0.###"}
          hidingPriority={6}
        ></Column>
        <Column
          dataField="loan_amount_payment"
          caption="Loan Payment"
          hidingPriority={5}
        ></Column>
        <Column
          dataField="loan_month_repayment"
          format={",##0.###"}
          caption="Loan Repayment"
          hidingPriority={4}
        ></Column>
        <Column
          dataField="loan_application"
          caption="Loan"
          hidingPriority={3}
        ></Column>
        <Column
          dataField="user.email"
          caption="User"
          minWidth={120}
          hidingPriority={2}
        ></Column>
        <Column
          dataField="created_at"
          caption="Date"
          dataType="date"
          format="dd MMM yyy HH:MM"
          hidingPriority={1}
        ></Column>
      </DataGrid>
    </Card>
  );
};
