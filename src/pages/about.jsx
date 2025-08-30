import { useState } from "react";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";

const About = () => {
  const [count, setCount] = useState(4666);

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
    </div>
  );
};

export default About;