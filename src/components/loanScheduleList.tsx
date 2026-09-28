import { useEffect, useState } from "react";
import DataGrid, {
  Column,
  MasterDetail,
  Pager,
  Paging,
  SearchPanel,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import Assist from "../classes/assist";
import { Card } from "./card";

//the repayment plan of one loan: interest and the first-month percentage in
//month 1, the rest spread over the remaining months of the term
const ScheduleDetail = ({ data }: { data: any }) => (
  <DataGrid
    dataSource={data.data.schedule}
    keyExpr="month"
    showBorders={true}
    columnAutoWidth={true}
  >
    <Column dataField="month" caption="Month" />
    <Column
      dataField="period_id"
      caption="Period"
      calculateCellValue={(row: any) =>
        `${Assist.getMonthName(Number(row.period_id.slice(4)))} ${row.period_id.slice(0, 4)}`
      }
    />
    <Column dataField="interest" caption="Interest ZMW" format={",##0.##"} />
    <Column dataField="repayment" caption="Repayment ZMW" format={",##0.##"} />
    <Summary>
      <TotalItem column="interest" summaryType="sum" valueFormat=",##0.##" />
      <TotalItem column="repayment" summaryType="sum" valueFormat=",##0.##" />
    </Summary>
  </DataGrid>
);

//open loans with their schedules, repayments and arrears (administrators)
export const LoanScheduleList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loadingText, setLoadingText] = useState("Loading loans...");

  useEffect(() => {
    Assist.loadData("Loan Schedules", "monthly-posting/loan-schedules")
      .then((rows: any) => {
        setData(rows);
        setLoadingText(rows.length === 0 ? "There are no open loans" : "");
      })
      .catch((message) => {
        Assist.showMessage(message, "error");
        setLoadingText("Could not load the loan schedules");
      });
  }, []);

  return (
    <Card title="Open Loans - Repayment Schedules & Arrears" showHeader={true}>
      <DataGrid
        className={"dx-card wide-card"}
        dataSource={data}
        keyExpr="loan_id"
        noDataText={loadingText}
        showBorders={false}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <SearchPanel visible={true} />
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <Column dataField="name" caption="Member" hidingPriority={10} />
        <Column dataField="email" caption="Email" hidingPriority={2} />
        <Column dataField="amount" caption="Loan ZMW" format={",##0.##"} hidingPriority={9} />
        <Column dataField="interest_rate" caption="Interest %" hidingPriority={4} />
        <Column
          caption="Month"
          calculateCellValue={(row: any) => `${row.month} of ${row.term_months}`}
          hidingPriority={6}
        />
        <Column dataField="paid" caption="Repaid ZMW" format={",##0.##"} hidingPriority={5} />
        <Column dataField="balance" caption="Balance ZMW" format={",##0.##"} hidingPriority={8} />
        <Column
          dataField="arrears"
          caption="Arrears ZMW"
          format={",##0.##"}
          hidingPriority={7}
          cellRender={(cell: any) => (
            <span className={cell.value > 0 ? "text-danger font-bold" : ""}>
              {Assist.formatCurrency(cell.value)}
            </span>
          )}
        />
        <Column
          dataField="must_clear"
          caption="Term Ended"
          calculateCellValue={(row: any) => (row.must_clear ? "Yes" : "No")}
          hidingPriority={3}
        />
        <Summary>
          <TotalItem column="balance" summaryType="sum" valueFormat=",##0.##" />
          <TotalItem column="arrears" summaryType="sum" valueFormat=",##0.##" />
        </Summary>
        <MasterDetail enabled={true} render={(detail) => <ScheduleDetail data={detail} />} />
      </DataGrid>
    </Card>
  );
};
