import { useState } from "react";
import { Ticker } from "../components/ticker";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import { NotificationList } from "../components/notificationList";

const Dashboard = () => {
  const [count, setCount] = useState(4666);

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={"My Dashboard"}
        section={"Administration"}
        icon={"home"}
      ></Titlebar>
      {/* start widget */}
      <Row>
        <Col xl={3} lg={6}>
          <Ticker
            title={"Total Students"}
            value={4586}
            color={"purple"}
            percent={80}
          ></Ticker>
        </Col>
        <Col xl={3} lg={6}>
          <Ticker
            title={"New Students"}
            value={589}
            color={"red"}
            percent={40}
          ></Ticker>
        </Col>
        <Col xl={3} lg={6}>
          <Ticker
            title={"Total Courses"}
            value={48}
            color={"green"}
            percent={70}
          ></Ticker>
        </Col>
        <Col xl={3} lg={6}>
          <Ticker
            title={"Visitors"}
            value={2479}
            color={"orange"}
            percent={90}
          ></Ticker>
        </Col>
      </Row>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 1"}>
            <h4>Hello</h4>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 2"}>
            <h4>Hello</h4>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 3"}></Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 2"} padding={false}>
            <NotificationList></NotificationList>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dashboard;