import { useState } from "react";
import { Ticker } from "../components/ticker";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import { NotificationList } from "../components/notificationList";
import Button from "devextreme-react/button";
import Form from "devextreme-react/form";

const Dashboard = () => {
  const [count, setCount] = useState(4666);
  const [notes, setNotes] = useState(
    'Sandra is a CPA and has been our controller since 2008. She loves to interact with staff so if you`ve not met her, be certain to say hi.\r\n\r\nSandra has 2 daughters both of whom are accomplished gymnasts.'
  );
  const employee = {
    ID: 7,
    FirstName: "Sandra",
    LastName: "Johnson",
    Prefix: "Mrs.",
    Position: "Controller",
    Picture: "images/employees/06.png",
    BirthDate: new Date("1974/11/15"),
    HireDate: new Date("2005/05/11"),
    Notes: notes,
    Address: "4600 N Virginia Rd.",
  };

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={"My DashboardXXXX"}
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
            <Button text="Click me" onClick={() => alert("Hello world!")} />
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 2"}>
            <Form
              id={"form"}
              defaultFormData={employee}
              onFieldDataChanged={(e) =>
                e.dataField === "Notes" && setNotes(e.value)
              }
              labelLocation={"top"}
              colCountByScreen={colCountByScreen}
            />
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

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4
};

export default Dashboard;
