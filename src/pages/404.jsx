import React, { useState, useEffect } from "react";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import SelectBox from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import { NumberBox } from "devextreme-react/number-box";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { Validator, RequiredRule } from "devextreme-react/validator";
import DateBox from "devextreme-react/date-box";
import { TestComponent } from '../components/TestComponent'

const NotFound = () => {

  const [name, setName] = useState("Evans");

  const onFormSubmit = async (e) => {
    e.preventDefault();
    
    addItem(name);

  };

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={"404"}
        section={"Administration"}
        icon={"home"}
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
      </Row>
    </div>
  );
};

export default NotFound;
