import React, { useState, useEffect } from "react";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import Button from "devextreme-react/button";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  ColumnChooser,
  Editing,
} from "devextreme-react/data-grid";

import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const About = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();

  const [count, setCount] = useState(4666);
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // invalid url will trigger an 404 error
    axios
      .get("https://www.api-zm.online/zamtelkpi/department/list")
      .then((response) => {
        setLoading(false);
        setData(response.data.items);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={"About"}
        section={"Administration"}
        icon={"home"}
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card title={theme}>
            <DataGrid
              className={"dx-card wide-card"}
              dataSource={data}
              keyExpr={"dept_id"}
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
              <Column
                dataField="dept_id"
                caption="ID"
                hidingPriority={4}
              ></Column>
              <Column
                dataField="dept_name"
                caption="Name"
                dataType="date"
                hidingPriority={2}
                cellRender={(e) => {
                  return (
                    <a href={`#/admin-department/edit/${e.data.dept_id}`}>
                      {e.data.dept_name}
                    </a>
                  );
                }}
              ></Column>
              <Column
                dataField="dept_description"
                caption="Description"
                sortOrder="asc"
                hidingPriority={1}
              ></Column>
              <Column
                dataField="d_status"
                caption="Status"
                minWidth={120}
                hidingPriority={3}
              ></Column>
              <Column
                dataField="dept_lastupdateuser"
                caption="User"
                minWidth={120}
                hidingPriority={3}
              ></Column>
              <Column
                dataField="dept_lastupdatedate"
                caption="Date"
                dataType="date"
                format="dd MMM yyy HH:MM"
                hidingPriority={2}
              ></Column>
            </DataGrid>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 2"}>
            <h4>{user == null ? "(No user)" : user.name}</h4>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 2"}>
            <h4>Hello</h4>
            <div className="dx-fieldset">
              <br></br>
              {user == null && (
                <Button
                  width="100%"
                  id="button"
                  text={"Login Evans"}
                  type="danger"
                  useSubmitBehavior={false}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;
