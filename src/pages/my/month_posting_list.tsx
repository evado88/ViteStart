import { useState, useEffect, useMemo } from "react";
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
  Toolbar,
  Item,
} from "devextreme-react/data-grid";

import Assist from "../../classes/assist";
import PageConfig from "../../classes/page-config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MonthlyPostings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);

  const pageConfig = new PageConfig(
    "Monthly Postings",
    `monthly-posting/user/${user.userid}`,
    "",
    "Monthly Posting",
    ""
  );

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((data: any) => {
          setData(data);
          setLoading(false);

          if (data.length === 0) {
            setLoadingText("No Data");
          } else {
            setLoadingText("");
          }
        })
        .catch((ex) => {
          Assist.showMessage(ex.Message, "error");
          setLoadingText("Could not show information");
        });
    }, Assist.developmentDelay);
  }, []);

  const addButtonOptions = useMemo(
    () => ({
      icon: "add",
      text: "New Monthly Posting",
      onClick: () => navigate("/my/monthly-posting/post"),
    }),
    []
  );

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={pageConfig.Title}
        section={"My"}
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
                allowDeleting={false}
                allowAdding={false}
              />
              <Pager showPageSizeSelector={true} showInfo={true} />
              <FilterRow visible={true} />
              <LoadPanel enabled={true} />
              <ColumnChooser enabled={true} mode="select"></ColumnChooser>
              <Toolbar>
                <Item
                  location="before"
                  locateInMenu="auto"
                  showText="always"
                  widget="dxButton"
                  options={addButtonOptions}
                />
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
                  return (
                    <a href={`#/admin-department/edit/${e.data.id}`}>
                      {e.text}
                    </a>
                  );
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
        </Col>
      </Row>
    </div>
  );
};

export default MonthlyPostings;
