import React, { useState } from "react";
import { Link, Route } from "react-router-dom";
import Button from "devextreme-react/button";
import { confirm } from "devextreme/ui/dialog";
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

interface PostingPeriodArgs {
  data: any;
  loadingText: string;
  addButtonOptions?: any;
  filterYearComponent?: React.ReactElement | null;
  filterMonthComponent?: React.ReactElement | null;
  isMember: boolean;
}
export const PostingPeriodingsList = ({
  data,
  loadingText,
  addButtonOptions,
  filterYearComponent,
  filterMonthComponent,
  isMember,
}: PostingPeriodArgs) => {
  //periods opened or closed on this page (overrides the loaded rows)
  const [states, setStates] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const stateOf = (row: any) => states[row.id] ?? row;

  const toggle = async (row: any) => {
    const open = stateOf(row).posting_state == Assist.STATE_OPEN;
    const ok = await confirm(
      open
        ? `Close ${row.name} for postings? Members will not be able to submit new postings; ones already submitted carry on through review.`
        : `Open ${row.name} for postings? Members will be able to submit their monthly postings and will be emailed that postings are open.`,
      open ? "Close postings" : "Open postings",
    );
    if (!ok) return;
    setBusy(row.id);
    Assist.postPutData(
      "Posting Period",
      `posting-periods/${open ? "close" : "open"}/${row.id}`,
      {},
      1,
    )
      .then((period: any) => {
        setBusy(null);
        setStates({ ...states, [row.id]: period });
        Assist.showMessage(
          `${row.name} is now ${open ? "closed" : "open"} for postings`,
          "success",
        );
      })
      .catch((message) => {
        setBusy(null);
        Assist.showMessage(message, "error");
      });
  };

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
        <Paging defaultPageSize={12} />
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
          {filterYearComponent != null && (
            <Item location="before" locateInMenu="auto">
              {filterYearComponent}
            </Item>
          )}
          {filterMonthComponent != null && (
            <Item location="before" locateInMenu="auto">
              {filterMonthComponent}
            </Item>
          )}
          <Item name="columnChooserButton" />
        </Toolbar>
        <Column
          dataField="id"
          caption="ID"
          hidingPriority={12}
          sortOrder="asc"
        ></Column>
        <Column
          dataField="name"
          caption="Name"
          dataType="date"
          format={"MMMM yyy"}
          hidingPriority={11}
          cellRender={(e) => {
            const getLink = () => {
              if (e.data.status == "Draft") {
                return `/admin/posting-periods/edit/${e.data.id}`;
              } else {
                return `/admin/posting-periods/view/${e.data.id}`;
              }
            };

            return <a href={getLink()}>{e.text}</a>;
          }}
        ></Column>
        <Column
          dataField="posting_state"
          caption="Member postings"
          hidingPriority={12}
          cellRender={(e) => {
            const current = stateOf(e.data);
            const open = current.posting_state == Assist.STATE_OPEN;
            const since = current.posting_state_at
              ? ` since ${new Date(current.posting_state_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
              : "";
            return (
              <div className="d-flex align-items-center" style={{ gap: 8 }}>
                <span
                  className={`badge ${open ? "badge-success" : "badge-secondary"}`}
                  title={current.posting_state_by ? `by ${current.posting_state_by}${since}` : ""}
                >
                  {open ? "Open" : "Closed"}
                </span>
                {!isMember && (
                  <Button
                    text={open ? "Close" : "Open"}
                    stylingMode="outlined"
                    type={open ? "normal" : "success"}
                    disabled={busy === e.data.id}
                    onClick={() => toggle(e.data)}
                  />
                )}
              </div>
            );
          }}
        ></Column>
        <Column
          dataField="status"
          caption="Status"
          hidingPriority={10}
          cellRender={(e) => {
            // if (e.data.status == "Approved") {
            //draft
            return (
              <a href={`/admin/monthly-postings/ddac-report/${e.data.id}`}>
                {e.text}, View DDAC
              </a>
            );
            // } else {
            //  return e.text;
            //}
          }}
        ></Column>
        <Column dataField="stage" caption="Stage" hidingPriority={9}></Column>
        <Column
          dataField={`sid${Assist.STAGE_AWAITING_SUBMISSION}`}
          caption="Awaiting Submission"
          format={",##0.###"}
          hidingPriority={8}
        ></Column>
        <Column
          dataField={`sid${Assist.STAGE_SUBMITTED}`}
          caption="Submitted"
          format={",##0.###"}
          hidingPriority={7}
        ></Column>
        <Column
          dataField={`sid${Assist.STAGE_PRIMARY_APPROVAL}`}
          caption="Primary Approval"
          format={",##0.###"}
          hidingPriority={6}
        ></Column>
        <Column
          dataField={`sid${Assist.STAGE_SECONDARY_APPROVAL}`}
          caption="Secondary Approval"
          format={",##0.###"}
          hidingPriority={5}
        ></Column>
        <Column
          dataField={`sid${Assist.STAGE_GUARANTOR_APPROVAL}`}
          caption="Guarantor Approval"
          format={",##0.###"}
          hidingPriority={4}
        ></Column>
        <Column
          dataField={`sid${Assist.STAGE_AWAITING_POP_UPLOAD}`}
          caption="Awaiting POP Upload"
          format={",##0.###"}
          hidingPriority={3}
        ></Column>
        <Column
          dataField={`sid${Assist.STAGE_AWAITING_POP_APPROVAL}`}
          caption="Awaiting POP Approval"
          format={",##0.###"}
          hidingPriority={2}
        ></Column>
        <Column
          dataField={`sid${Assist.STAGE_APPROVED}`}
          caption="Approved"
          format={",##0.###"}
          hidingPriority={1}
        ></Column>
      </DataGrid>
    </Card>
  );
};
