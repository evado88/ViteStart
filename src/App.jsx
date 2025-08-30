import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { Footer } from "./components/footer";
import { Ticker } from "./components/ticker";
import { Card } from "./components/card";
import { Row } from "./components/row";
import { NotificationList } from "./components/notificationList";

function App() {
  const [count, setCount] = useState(4666);

  return (
    <div className="page-wrapper">
      <Header></Header>
      {/* start page container */}
      <div className="page-container">
        <Sidebar></Sidebar>
        {/* start page content */}
        <div className="page-content-wrapper">
          <div className="page-content" style={{ minHeight: "862px" }}>
            <div className="page-bar">
              <div className="page-title-breadcrumb">
                <div className="pull-left">
                  <div className="page-title">Dashboard</div>
                </div>
                <ol className="breadcrumb page-breadcrumb pull-right">
                  <li>
                    <i className="fa fa-home"></i>&nbsp;
                    <a
                      className="parent-item"
                      href="https://www.einfosoft.com/templates/admin/smart/source/light/index.html"
                    >
                      Home
                    </a>
                    &nbsp;<i className="fa fa-angle-right"></i>
                  </li>
                  <li className="active">Dashboard</li>
                </ol>
              </div>
            </div>
            {/* start widget */}
            <Row>
              <div className="col-xl-3 col-lg-6">
                <Ticker
                  title={"Total Students"}
                  value={4586}
                  color={"purple"}
                  percent={80}
                ></Ticker>
              </div>
              <div className="col-xl-3 col-lg-6">
                <Ticker
                  title={"New Students"}
                  value={589}
                  color={"red"}
                  percent={40}
                ></Ticker>
              </div>
              <div className="col-xl-3 col-lg-6">
                <Ticker
                  title={"Total Courses"}
                  value={48}
                  color={"green"}
                  percent={70}
                ></Ticker>
              </div>
              <div className="col-xl-3 col-lg-6">
                <Ticker
                  title={"Visitors"}
                  value={2479}
                  color={"orange"}
                  percent={90}
                ></Ticker>
              </div>
            </Row>
            {/* end widget */}

            {/* chart start */}
            <Row>
              <div className="col-12 col-sm-12 col-lg-6">
                <Card title={"Card 1"}>
                  <h4>Hello</h4>
                </Card>
              </div>
              <div className="col-12 col-sm-12 col-lg-6">
                <Card title={"Card 2"}>
                  <h4>Hello</h4>
                </Card>
              </div>
            </Row>

            <Row>
              <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                <Card title={"Card 3"}></Card>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                <Card title={"Card 2"} padding={false}>
                  <NotificationList></NotificationList>
                </Card>
              </div>
            </Row>

            {/* start new student list */}
            <Row>
              <div className="col-md-12 col-sm-12">
                <Card title={"New List"}></Card>
              </div>
            </Row>
            {/* end new student list */}
          </div>
        </div>
        {/* end page content */}
      </div>
      {/* end page container */}

      <Footer></Footer>
    </div>
  );
}

export default App;
