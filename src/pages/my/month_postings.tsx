import { useState, useEffect } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  ColumnChooser,
  Editing,
} from "devextreme-react/data-grid";

import Assist from "../../classes/assist";
import PageConfig from "../../classes/page-config";

const MonthlyPostings = () => {
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);

  const pageConfig = new PageConfig(
    "Monthly Postings",
    "monthly-posting/",
    "",
    "Monthly Posting"
  );

  useEffect(() => {
    setLoading(true);

    Assist.loadData(pageConfig.Title, pageConfig.Url)
      .then((res: any) => {
        setData(res.Result);
        setLoading(false);

        if (res.Result.length === 0) {
          setLoadingText("No Data");
        } else {
          setLoadingText("");
        }
      })
      .catch((ex) => {
        Assist.showMessage(ex.Message, "error");
        setLoadingText("Could not show information");
      });
  }, []);

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={pageConfig.Title}
        section={"Administration"}
        icon={"home"}
        url="/"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
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
                allowDeleting={true}
                allowAdding={false}
              />
              <Pager showPageSizeSelector={true} showInfo={true} />
              <FilterRow visible={true} />
              <LoadPanel enabled={loading} />
              <ColumnChooser enabled={true} mode="select"></ColumnChooser>
              <Column dataField="id" caption="ID" hidingPriority={4}></Column>
              <Column
                dataField="date"
                caption="Name"
                dataType="date"
                format={"dd MMMM yyy"}
                cellRender={(e) => {
                  return (
                    <a href={`#/admin-department/edit/${e.data.id}`}>
                      {e.text}
                    </a>
                  );
                }}
              ></Column>
              <Column
                dataField="saving"
                caption="Saving"
                format={",##0.###"}
              ></Column>
              <Column
                dataField="shares"
                caption="Shares"
                format={",##0.###"}
              ></Column>
              <Column
                dataField="social"
                caption="Social"
                format={",##0.###"}
              ></Column>
              <Column
                dataField="penalty"
                caption="Penalty"
                format={",##0.###"}
              ></Column>
              <Column
                dataField="loan_interest"
                caption="Interest"
                format={",##0.###"}
              ></Column>
              <Column
                dataField="loan_amount_payment"
                caption="Loan Payment"
              ></Column>
              <Column
                dataField="loan_month_repayment"
                format={",##0.###"}
                caption="Loan Repayment"
              ></Column>
              <Column dataField="loan_application" caption="Loan"></Column>
              <Column
                dataField="user.email"
                caption="User"
                minWidth={120}
                hidingPriority={3}
              ></Column>
              <Column
                dataField="created_at"
                caption="Date"
                dataType="date"
                format="dd MMM yyy HH:MM"
                hidingPriority={2}
              ></Column>
            </DataGrid>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MonthlyPostings;
