import { useState, useEffect, useRef } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  ColumnChooser,
  Editing,
} from "devextreme-react/data-grid";

import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";

const AdminMemberQueries = () => {
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Guarantors",
    "guarantors/list",
    "",
    "Duarantor",
    "",
    [Assist.ROLE_ADMIN],
  );

  useEffect(() => {
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
              <Column dataField="id" caption="ID" hidingPriority={6}></Column>
              <Column
                dataField="guar_lname"
                caption="First Name"
                hidingPriority={5}
                cellRender={(e) => {
                  return (
                    <a href={`/admin/guarantors/view/${e.data.id}`}>
                      {e.text}
                    </a>
                  );
                }}
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
                dataField="member.fname"
                caption="Member First Mame"
                hidingPriority={5}
              ></Column>
              <Column
                dataField="member.lname"
                caption="Member Last Name"
                hidingPriority={5}
              ></Column>
              <Column
                dataField="member.email"
                caption="Member Email"
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

export default AdminMemberQueries;
