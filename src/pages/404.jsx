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
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useShopping } from "../context/ShoppingBasketContext";

const NotFound = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();
  const { items, addItem} = useShopping();

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
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 1"}>
            <form onSubmit={onFormSubmit}>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Properties</div>

                <div className="dx-field">
                  <div className="dx-field-label">Name</div>
                  <div className="dx-field-value">
                    <TextBox
                      value={name}
                      onValueChange={(text) => setName(text)}
                    >
                      <Validator>
                        <RequiredRule message="Item name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
              </div>

              <div className="dx-fieldset">
                <ValidationSummary id="summary" />
                <br></br>
                <Button
                  width="100%"
                  id="button"
                  text="Save"
                  type="danger"
                  useSubmitBehavior={true}
                  onClick={toggleTheme}
                />
              </div>
            </form>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Card 2"}>
            <ul>
              {items.map((i) => <li>{i}</li>)}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotFound;
