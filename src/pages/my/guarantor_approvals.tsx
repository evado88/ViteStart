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

const MyGuarantorApprovals = () => {
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
    "Guarantor Approvals",
    `guarantors/email/${user.sub}/list`,
    "",
    "Guarantor",
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
                allowDeleting={false}
                allowAdding={false}
              />
              <Pager showPageSizeSelector={true} showInfo={true} />
              <FilterRow visible={true} />
              <LoadPanel enabled={loading} />
              <ColumnChooser enabled={true} mode="select"></ColumnChooser>
              <Toolbar>
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
                dataField="member.email"
                caption="Member"
                hidingPriority={9}
                cellRender={(e) => {
                  const getLink = () => {
                    return `/my/guarantors/review/${e.data.id}`;
                  };

                  return <a href={getLink()}>{e.text}</a>;
                }}
              ></Column>
              <Column
                dataField="member.fname"
                caption="Member First Name"
                hidingPriority={8}
              ></Column>
              <Column
                dataField="member.lname"
                caption="Member Last Name"
                hidingPriority={8}
              ></Column>
              <Column
                dataField="guar_fname"
                caption="First Name"
                hidingPriority={8}
              ></Column>
              <Column
                dataField="guar_lname"
                caption="Last Name"
                hidingPriority={8}
              ></Column>
              <Column
                dataField="guar_mobile"
                caption="Mobile"
                hidingPriority={7}
              ></Column>
              <Column
                dataField="guar_email"
                caption="Email"
                hidingPriority={6}
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

export default MyGuarantorApprovals;
