import React, { useState, useEffect } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
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
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";

const PostMonthly = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [name, setName] = useState("Evans");
  const [description, setDescription] = useState("");

  const [pespectiveList, setPespectiveList] = useState([]);
  const [pespective, setPespective] = useState(0);

  const [target, setTarget] = useState(0.0);
  const [actual, setActual] = useState(0.0);

  const [status, setStatus] = useState("");

  const notesLabel = { "aria-label": "Notes" };
  const addressLabel = { "aria-label": "Address" };
  const cityLabel = { "aria-label": "City" };

  const pageConfig = new PageConfig("Monthly Posting", "users/", "", "User");

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={pageConfig.Title}
        section={"Administration"}
        icon={"home"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={7}>
          <Card title="Properties" showHeader={true}>
            <div className="form">
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Simple Field Set</div>
                <div className="dx-field">
                  <div className="dx-field-label">Full Name</div>
                  <div className="dx-field-value-static">Kevin Carter</div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Position</div>
                  <div className="dx-field-value-static">Shipping Manager</div>
                </div>
              </div>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">
                  Field Set with DevExtreme Widgets
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Address</div>
                  <TextBox
                    inputAttr={addressLabel}
                    className="dx-field-value"
                    defaultValue="424 N Main St."
                  />
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">City</div>
                  <TextBox
                    inputAttr={cityLabel}
                    className="dx-field-value"
                    defaultValue="San Diego"
                    value={name}
                    onValueChanged={(e) => setName(e.value)}
                  />
                </div>
              </div>
              <div className="dx-fieldset" id="notes-container">
                <div className="dx-fieldset-header">
                  Field Set with Custom Value Width
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Notes</div>
                  <TextArea
                    className="dx-field-value"
                    inputAttr={notesLabel}
                    height={80}
                    defaultValue="Kevin is our hard-working shipping manager and has been helping that department work like clockwork for 18 months. When not in the office, he is usually on the basketball court playing pick-up games."
                  />
                </div>
              </div>
              <div className="dx-field">
                <div className="dx-field-label"></div>
                <Button
                  width={"100%"}
                  id="button"
                  text={"Next"}
                  type="danger"
                  disabled={error}
                  useSubmitBehavior={false}
                  onClick={user == null ? () => login(name) : logout}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PostMonthly;
