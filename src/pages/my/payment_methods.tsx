import { useState, useEffect, useMemo, useRef } from "react";
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

const MemberQueries = () => {
  const gridRef = useRef<any>(null);
  //user
  const { user } = useAuth();
  //other
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "My Payment Methods",
    `paymentmethods/user/${user.userid}/list`,
    "",
    "Payment Method",
    "",
    [Assist.ROLE_MEMBER],
  );

  useEffect(() => {
    //check if initialized
    if (hasRun.current) return;
    hasRun.current = true;
   
    //check permissions and audit
    if (!Assist.checkPageAuditPermission(pageConfig, user)) {
      Assist.redirectUnauthorized(navigate);
      return;
    }

    setLoading(true);

    Assist.loadData(pageConfig.Title, pageConfig.Url)
      .then((res: any) => {
        setData(res);
        setLoading(false);

        if (res.length === 0) {
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

  const addButtonOptions = useMemo(
    () => ({
      icon: "add",
      text: "New Payment Method",
      onClick: () => navigate("/my/payment-methods/add"),
    }),
    [],
  );

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={pageConfig.Title}
        section={"Administration"}
        icon={"cubes"}
        url="/"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card showHeader={false}>
            <DataGrid
              ref={gridRef}
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
              <Toolbar>
                <Item
                  location="before"
                  locateInMenu="auto"
                  showText="always"
                  widget="dxButton"
                  options={addButtonOptions}
                />
                <Item name="columnChooserButton" />
                <Item
                  location="after"
                  locateInMenu="auto"
                  showText="always"
                  widget="dxButton"
                  options={{
                    icon: "save",
                    text: " Excel Export",
                    onClick: () =>
                      Assist.downloadExcel(
                        pageConfig.Title,
                        data,
                        gridRef.current?.instance.getVisibleColumns(),
                      ),
                  }}
                />
              </Toolbar>
              <Column dataField="id" caption="ID" hidingPriority={6}></Column>
              <Column
                dataField="name"
                caption="Name"
                hidingPriority={6}
                cellRender={(e) => {
                  const getLink = () => {
                    if (e.data.status.status_name == "Draft") {
                      return `/my/payment-methods/edit/${e.data.id}`;
                    } else {
                      return `/my/payment-methods/view/${e.data.id}`;
                    }
                  };

                  return <a href={getLink()}>{e.text}</a>;
                }}
              ></Column>
              <Column
                dataField="type"
                caption="Type"
                hidingPriority={5}
              ></Column>
              <Column
                dataField="method_number"
                caption="Pay Number"
                hidingPriority={5}
              ></Column>
              <Column
                dataField="bank_name"
                caption="Bank Name"
                hidingPriority={5}
              ></Column>
              <Column
                dataField="bank_branch_name"
                caption="Branch Name"
                hidingPriority={4}
                visible={false}
              ></Column>
              <Column
                dataField="bank_branch_code"
                caption="Branch Code"
                hidingPriority={3}
              ></Column>
              <Column
                dataField="bank_account_name"
                caption="Account Name"
                hidingPriority={2}
              ></Column>
              <Column
                dataField="bank_account_no"
                caption="Account No"
                hidingPriority={2}
              ></Column>
              <Column
                dataField="method_name"
                caption="Pay Name"
                hidingPriority={5}
              ></Column>
              <Column
                dataField="status.status_name"
                caption="Status"
                hidingPriority={4}
              ></Column>
              <Column
                dataField="stage.stage_name"
                caption="Stage"
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

export default MemberQueries;
