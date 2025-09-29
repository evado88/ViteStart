import { useState } from "react";
import { Ticker } from "../components/ticker";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import { NotificationList } from "../components/notificationList";
import Button from "devextreme-react/button";
import Form from "devextreme-react/form";
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Label,
  Format,
  Legend,
  Export,
} from "devextreme-react/chart";
import { grossProductData } from "./data.js";

const Dashboard = () => {
  function onPointClick(e) {
    e.target.select();
  }

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={"My Dashboard"}
        section={"Home"}
        icon={"home"}
      ></Titlebar>
      {/* start widget */}
      <Row>
        <Col xl={3} lg={6}>
          <Ticker
            title={"Savings"}
            value={4586}
            color={"green"}
            percent={80}
          ></Ticker>
        </Col>
        <Col xl={3} lg={6}>
          <Ticker
            title={"Loans"}
            value={589}
            color={"red"}
            percent={40}
          ></Ticker>
        </Col>
        <Col xl={3} lg={6}>
          <Ticker
            title={"Interest"}
            value={48}
            color={"orange"}
            percent={70}
          ></Ticker>
        </Col>
        <Col xl={3} lg={6}>
          <Ticker
            title={"Penalty"}
            value={2479}
            color={"red"}
            percent={90}
          ></Ticker>
        </Col>
      </Row>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"SACCO Activity"}>
            <Chart
              id="chart"
              title="Yearly SACCO Activity"
              dataSource={grossProductData}
              onPointClick={onPointClick}
            >
              <CommonSeriesSettings
                argumentField="state"
                type="bar"
                hoverMode="allArgumentPoints"
                selectionMode="allArgumentPoints"
              >
                <Label visible={true}>
                  <Format type="fixedPoint" precision={0} />
                </Label>
              </CommonSeriesSettings>
              <Series argumentField="state" valueField="year2018" name="2018" />
              <Series valueField="year2017" name="2017" />
              <Series valueField="year2016" name="2016" />
              <Legend
                verticalAlignment="bottom"
                horizontalAlignment="center"
              ></Legend>
              <Export enabled={true} />
            </Chart>
          </Card>
        </Col>
           <Col sz={12} sm={12} lg={6}>
          <Card title={"Notifications"} padding={false}>
            <NotificationList></NotificationList>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
