import { useState } from "react";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import Sidebar from "../components/sidebaran";
import Form from "devextreme-react/form";

const Home = () => {
  const [count, setCount] = useState(4666);
  const [notes, setNotes] = useState(
    "Sandra is a CPA and has been our controller since 2008. She loves to interact with staff so if you`ve not met her, be certain to say hi.\r\n\r\nSandra has 2 daughters both of whom are accomplished gymnasts."
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

  const colCountByScreen = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  };

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={"Home"}
        section={"Administration"}
        icon={"home"}
      ></Titlebar>
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
    </div>
  );
};

export default Home;
