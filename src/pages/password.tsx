import React, { useState, useEffect } from "react";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import SelectBox from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import {
  Validator,
  RequiredRule,
  AsyncRule,
  CompareRule,
  CustomRule,
} from "devextreme-react/validator";
import TextArea from "devextreme-react/text-area";
import { NumberBox } from "devextreme-react/number-box";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import Toolbar, { Item } from "devextreme-react/toolbar";
import DateBox from "devextreme-react/date-box";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import PageConfig from "../classes/page-config";
import Assist from "../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate } from "react-router-dom";

const Password = () => {
  //user
  const { user } = useAuth();

  const navigate = useNavigate();

  //posting
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const [code, setCode] = useState("");
  //the server emails the code and checks it
  const [codeTicket, setCodeTicket] = useState<string | null>(null);

  const [stage, setStage] = useState(1);

  const pageConfig = new PageConfig(
    "Update Password",
    `users/${user.userid}`,
    "",
    "Password",
    "",
    [1, 2],
  );

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendEmailCode();
  };

  const sendEmailCode = () => {
    setLoading(true);
    Assist.postPutData(
      "Email Code",
      "auth/email-code",
      { email: user.sub, purpose: "password" },
      0,
    )
      .then((data: any) => {
        setLoading(false);
        setCodeTicket(data.ticket);
        setCode("");
        setStage(2);
        Assist.showMessage(
          `A verification code has been sent to ${data.email_hint}`,
          "success",
        );
      })
      .catch((message) => {
        setLoading(false);
        Assist.showMessage(message, "error");
      });
  };

  const onOTPFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    Assist.postPutData(
      "Verify Code",
      "auth/email-code/verify",
      { ticket: codeTicket, code: code },
      0,
    )
      .then((verified: any) => {
        const formData = new FormData();

        formData.append("username", user.sub);
        formData.append("current_password", currentPassword);
        formData.append("new_password", password);

        return Assist.postPutData(
          pageConfig.Title,
          `users/update-password`,
          formData,
          1,
          { "X-Email-Verification": verified.verified_token },
        );
      })
      .then(() => {
        setSaving(false);

        Assist.showMessage(
          "You have successfully updated your password!",
          "success",
        );

        setStage(1);
        setCurrentPassword("");
        setConfirmPassword("");
        setPassword("");
        setCode("");
      })
      .catch((message) => {
        setSaving(false);
        Assist.showMessage(message, "error");
      });
  };

  return (
    <div id="pageRoot" className="page-content">
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        position={{ of: "#pageRoot" }}
        visible={loading}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />
      <Titlebar
        title={pageConfig.Title}
        section={"Configuration"}
        icon={"gear"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={7}>
          <Card title="Properties" showHeader={true}>
            {stage == 1 && (
              <form id="formMain" onSubmit={onFormSubmit}>
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Current Password</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Password</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Password"
                        mode="password"
                        value={currentPassword}
                        onValueChange={(text) => setCurrentPassword(text)}
                      >
                        {" "}
                        <Validator>
                          <RequiredRule message="Current password is required" />
                        </Validator>
                      </TextBox>
                    </div>
                  </div>
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">New Password</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Password</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Password"
                        mode="password"
                        value={password}
                        onValueChange={(text) => setPassword(text)}
                      >
                        {" "}
                        <Validator>
                          <RequiredRule message="Password is required" />
                          <CustomRule
                            validationCallback={(e) =>
                              e.value == confirmPassword
                            }
                            message={`Password does not match confirm password`}
                          />
                        </Validator>
                      </TextBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Confirm Password</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Confirm Password"
                        mode="password"
                        value={confirmPassword}
                        onValueChange={(text) => setConfirmPassword(text)}
                      >
                        {" "}
                        <Validator>
                          <RequiredRule message="Please confirm password" />
                          <CustomRule
                            validationCallback={(e) => e.value == password}
                            message={`Confirm password does not match password`}
                          />
                        </Validator>
                      </TextBox>
                    </div>
                  </div>
                  <div className="form-group">
                    <ValidationSummary id="summary6" />
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label"></div>
                    <Button
                      width="100%"
                      type={saving ? "normal" : "default"}
                      disabled={loading || error || saving}
                      useSubmitBehavior={true}
                    >
                      <LoadIndicator
                        className="button-indicator"
                        visible={saving}
                      />
                      <span className="dx-button-text">Update Password</span>
                    </Button>
                  </div>
                </div>
              </form>
            )}
            {stage == 2 && (
              <form
                className="register-form"
                id="login-form"
                onSubmit={onOTPFormSubmit}
              >
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">One Time Password</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Code</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Code"
                      value={code}
                      onValueChange={(text) => setCode(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="OTP code required" />
                        <CustomRule
                          validationCallback={(e) => /^\d{6}$/.test(e.value)}
                          message={`The code is the 6 digits in the email`}
                        />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="form-group">
                  <ValidationSummary id="summary" />
                </div>
                <div className="form-group form-button">
                  <Button
                    width="100%"
                    text="Update Password"
                    type={saving ? "normal" : "default"}
                    disabled={saving}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={saving}
                    />
                    <span className="dx-button-text">Verify OTP</span>
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Password;
