import React, { useState, useEffect } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
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
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import axios from "axios";
import { LoadIndicator } from "devextreme-react/load-indicator";

const PostMonthly = () => {
  //user
  const { user, login, logout } = useAuth();

  //posting
  const [postingDate, setPostingDate] = useState("2025-01-13");
  const [postingSavings, setPostingSavings] = useState<number | null>(500);
  const [postingShares, setPostingShares] = useState<number | null>(1500);
  const [postingSocial, setPostingSocial] = useState<number | null>(300);
  const [postingPenalty, setPostingPenalty] = useState<number | null>(200);

  //interest payment - minimum 10% if not yet paid on loan
  const [postingLoanInterestPayment, setPostingLoanInterestPayment] = useState<
    number | null
  >(600);

  //loan payment -  minimum 10% if not yet paid on loan
  const [postingLoanAmountPayment, setPostingLoanAmountPayment] = useState<
    number | null
  >(600);

  //loan payment - usual payment every month
  const [postingLoanMonthPayment, setPostingLoanMonthPayment] = useState<
    number | null
  >(1800);

  //new loan loan application
  const [postingLoanApplication, setPostingLoanApplication] = useState<
    number | null
  >(0);

  //additiona
  const [postingComments, setPostingComments] = useState("No comments");

  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig("Monthly Posting", "users/", "", "User");

  const onFormSubmit = (e: React.FormEvent) => {
    console.log(new Date(), "hello");

    setLoading(true);

    e.preventDefault();

    const postData = {
      user_id: 1,
      date: postingDate,
      saving: postingSavings,
      shares: postingShares,
      social: postingSocial,
      penalty: postingPenalty,
      loan_interest: postingLoanInterestPayment,
      loan_amount_payment: postingLoanAmountPayment,
      loan_month_repayment: postingLoanMonthPayment,
      loan_application: postingLoanApplication,
      status_id: 1,
      approval_levels: 2,
      comments: postingComments,
    };

    console.log("Monthly Postibng ", postData);

    setTimeout(() => {
      axios
        .post("http://localhost:8700/monthly-posting/", postData)
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            console.log("Success:", res.data);
            Assist.showMessage(
              "You have successfully submitted the form!",
              "success"
            );
          } else {
            console.warn("Unexpected status:", res.status);
            Assist.showMessage(
              `Error submiting the form and wrong status: ${res.status}`,
              "success"
            );
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error posting data:", err);

          if (err.response.data != null) {
            if (Array.isArray(err.response.data.detail)) {
              const field = err.response.data.detail[0].loc[1];
              Assist.showMessage(
                `Error submiting the form field: ${err.response.data.detail[0].msg}: ${field}`,
                "error"
              );
            } else {
              Assist.showMessage(
                `Error submiting the form single: ${err.response.data.detail}`,
                "error"
              );
            }
          } else {
            Assist.showMessage(`Error submiting the form general`, "error");
          }
        });
    }, 3000);
  };

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
            <form id="formMain" onSubmit={onFormSubmit}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Personal Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Full Name</div>
                    <div className="dx-field-value-static">{user.name}</div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Period</div>
                    <DateBox
                      className="dx-field-value"
                      placeholder="Period"
                      displayFormat={"dd MMM yyy"}
                      value={postingDate}
                      onValueChange={(text) => setPostingDate(text)}
                    />
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">
                    Savings & Contrbutions
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Savings</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingSavings!}
                      placeholder="Savings"
                      onValueChange={(value) => setPostingSavings(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Savings amount required" />
                        <CustomRule
                          validationCallback={(e) => Number(e.value) % 500 == 0}
                          message="Savings amount must be in mutiples of 500"
                        />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Shares</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingShares!}
                      placeholder="Shares"
                      onValueChange={(value) => setPostingShares(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Shares amount required" />
                        <CustomRule
                          validationCallback={(e) =>
                            Number(e.value) % 1000 == 0
                          }
                          message="Share amount must be in mutiples of 1000"
                        />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Social Fund</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingSocial!}
                      placeholder="Social Fund"
                      onValueChange={(value) => setPostingSocial(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Social fund amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Penalty</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingPenalty!}
                      placeholder="Penalty"
                      onValueChange={(value) => setPostingPenalty(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Penalty amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Interest</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Minimum 10% Loan Interest
                    </div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingLoanInterestPayment!}
                      placeholder="Minimum 10% Loan Interest"
                      onValueChange={(value) =>
                        setPostingLoanInterestPayment(value)
                      }
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Minimum 10% loan interest amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Loan Repayment</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Minimum 10% Loan Payment
                    </div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingLoanAmountPayment!}
                      placeholder="Minimum 10% Loan Payment"
                      onValueChange={(value) =>
                        setPostingLoanAmountPayment(value)
                      }
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Minimum 10% loan payment required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Loan Repayment</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingLoanMonthPayment!}
                      placeholder="Loan Repayment"
                      onValueChange={(value) =>
                        setPostingLoanMonthPayment(value)
                      }
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Loan repayment amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Loan Application</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Loan Amount</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingLoanApplication!}
                      placeholder="Loan Amount"
                      onValueChange={(value) =>
                        setPostingLoanApplication(value)
                      }
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Loan amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Comments & feedback</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Comemnts</div>
                    <TextArea
                      className="dx-field-value"
                      placeholder="Comemnts"
                      height={80}
                      value={postingComments}
                      onValueChange={(value) => setPostingComments(value)}
                    >
                      <Validator>
                        <RequiredRule message="Comments required" />
                      </Validator>
                    </TextArea>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label"></div>
                    <ValidationSummary id="summaryMain" />
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label"></div>
                  <Button
                    width="100%"
                    type={loading ? "normal" : "default"}
                    disabled={loading}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={loading}
                    />
                    <span className="dx-button-text">Submit Monthly Post</span>
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PostMonthly;
