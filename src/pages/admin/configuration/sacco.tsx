import React, { useState, useEffect } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import SelectBox from "devextreme-react/select-box";
import { Validator, RequiredRule } from "devextreme-react/validator";
import { NumberBox } from "devextreme-react/number-box";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../../context/AuthContext";
import PageConfig from "../../../classes/page-config";
import Assist from "../../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate } from "react-router-dom";
import AppInfo from "../../../classes/app-info";

const Configuration = () => {
  //user
  const { user } = useAuth();

  const navigate = useNavigate();

  //posting
  const [savingsMultiple, setSavingsMultiple] = useState<number | null>(null);
  const [sharesMultiple, setSharesMultiple] = useState<number | null>(null);
  const [socialMin, setSocialMin] = useState<number | null>(null);

  //interest payment - minimum 10% if not yet paid on loan
  const [loanInterestPercent, setLoanInterestPercent] = useState<number | null>(
    null,
  );

  //loan payment -  minimum 10% if not yet paid on loan
  const [loanPaymentPercent, setLoanPaymentPercent] = useState<number | null>(
    null,
  );

  //new loan loan application
  const [loanSavingsRatio, setLoanSavingsRatio] = useState<number | null>(null);
  const [loanDuration, setLoanDuration] = useState<number | null>(null);
  const [approvalLevels, setApprovalLevels] = useState<number | null>(null);
  const [enable2FA, setEnable2FA] = useState<string | null>(null);
  const [loanApplyLimit, setLoanApplyLimit] = useState<number | null>(null);
  //additiona
  const [incorrectPostingFee, setIncorrectPostingFee] = useState<number | null>(
    null,
  );
  const [latePostingFee, setLatePostingFee] = useState<number | null>(null);
  const [missedMeetingFee, setMissedMeetingFee] = useState<number | null>(null);
  const [lateMeetingFee, setLateMeetingFee] = useState<number | null>(null);
  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(
    "SACCO Configuration",
    "sacco-config/1",
    "",
    "SACCO Configuration",
    "sacco-config/update/1",
    [2],
  );

  useEffect(() => {
    if (!pageConfig.Permissions?.includes(user.role)) {
      navigate("/404");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((data) => {
          setLoading(false);
          updateVaues(data);
          setError(false);
        })
        .catch((message) => {
          setLoading(false);
          setError(true);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  const updateVaues = (data: any) => {
    setSavingsMultiple(data.saving_multiple);
    setSharesMultiple(data.shares_multiple);
    setSocialMin(data.social_min);

    setLoanInterestPercent(data.loan_interest_rate);
    setLoanPaymentPercent(data.loan_repayment_rate);
    setLoanSavingsRatio(data.loan_saving_ratio);
    setLoanDuration(data.loan_duration);
    setLoanApplyLimit(data.loan_apply_limit);

    setLatePostingFee(data.late_posting_rate);
    setIncorrectPostingFee(data.incorrect_posting_rate);
    setLateMeetingFee(data.late_meeting_rate);
    setMissedMeetingFee(data.missed_meeting_rate);

    setApprovalLevels(data.approval_levels);
    setEnable2FA(data.enable_2FA == 1 ? "Yes" : "No");
  };

  const onFormSubmit = (e: React.FormEvent) => {
    setSaving(true);

    e.preventDefault();

    const postData = {
      user_id: user.userid,
      saving_multiple: savingsMultiple,
      shares_multiple: sharesMultiple,
      social_min: socialMin,
      loan_interest_rate: loanInterestPercent,
      loan_repayment_rate: loanPaymentPercent,
      loan_saving_ratio: loanSavingsRatio,
      loan_duration: loanDuration,
      loan_apply_limit: loanApplyLimit,
      late_posting_rate: latePostingFee,
      missed_meeting_rate: missedMeetingFee,
      late_meeting_rate: lateMeetingFee,
      incorrect_posting_rate: incorrectPostingFee,
      approval_levels: approvalLevels,
      enable_2FA: enable2FA == "Yes" ? 1 : 2,
    };

    setTimeout(() => {
      Assist.postPutData(pageConfig.Title, pageConfig.UpdateUrl, postData, 1)
        .then((data) => {
          setSaving(false);
          updateVaues(data);

          Assist.showMessage(
            "You have successfully updated the configuration!",
            "success",
          );
        })
        .catch((message) => {
          setSaving(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
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
            <form id="formMain" onSubmit={onFormSubmit}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Security</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Enable Two-Factor Authentication
                    </div>
                    <SelectBox
                      className="dx-field-value"
                      dataSource={AppInfo.yesNoList}
                      onValueChange={(value) => setEnable2FA(value)}
                      validationMessagePosition="left"
                      value={enable2FA}
                      disabled={error}
                    >
                      <Validator>
                        <RequiredRule message="Enable Two-Factor authentication is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Appprovals</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Appproval level</div>
                    <SelectBox
                      className="dx-field-value"
                      dataSource={[1, 2, 3]}
                      onValueChange={(value) => setApprovalLevels(value)}
                      validationMessagePosition="left"
                      value={approvalLevels}
                      disabled={error}
                    >
                      <Validator>
                        <RequiredRule message="Appproval level is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                </div>

                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">
                    Savings & Contributions Limits
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Savings Multiple</div>
                    <NumberBox
                      className="dx-field-value"
                      value={savingsMultiple!}
                      placeholder="Savings Multiple"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setSavingsMultiple(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Savings multiple required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Shares Multiple</div>
                    <NumberBox
                      className="dx-field-value"
                      value={sharesMultiple!}
                      placeholder="Shares Multiple"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setSharesMultiple(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Shares multiple required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Social Fund Minimum</div>
                    <NumberBox
                      className="dx-field-value"
                      value={socialMin!}
                      placeholder="Social Fund Minimum"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setSocialMin(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Social fund minnimum amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Interest</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Loan Interest Percentage
                    </div>
                    <NumberBox
                      className="dx-field-value"
                      value={loanInterestPercent!}
                      placeholder="Loan Interest Percentage"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setLoanInterestPercent(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Loan interest percent required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Loan Repayment</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Loan Payment Percentage
                    </div>
                    <NumberBox
                      className="dx-field-value"
                      value={loanPaymentPercent!}
                      disabled={error || saving}
                      placeholder="Loan Payment Percentage"
                      format={",##0.###"}
                      onValueChange={(value) => setLoanPaymentPercent(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Loan payment percent required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Loan Application</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Loan Savings Ratio </div>
                    <NumberBox
                      className="dx-field-value"
                      value={loanSavingsRatio!}
                      placeholder="Loan Savings Ratio"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setLoanSavingsRatio(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Loan saving ratio required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Loan Duraton (Months) </div>
                    <NumberBox
                      className="dx-field-value"
                      value={loanDuration!}
                      placeholder="Loan Duraton (Months)"
                      disabled={error || saving}
                      onValueChange={(value) => setLoanDuration(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Loan saving ratio required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Loan Guarantor Limit</div>
                    <NumberBox
                      className="dx-field-value"
                      value={loanApplyLimit!}
                      placeholder="Loan Guarantor Limit"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setLoanApplyLimit(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Loan guarantor limit required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Penalties</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Incorrect Posting Fee</div>
                    <NumberBox
                      className="dx-field-value"
                      value={incorrectPostingFee!}
                      placeholder="Incorrect Posting Fee"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setIncorrectPostingFee(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Incorrect posting fee required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Late Posting Fee</div>
                    <NumberBox
                      className="dx-field-value"
                      value={latePostingFee!}
                      placeholder="Late Posting Fee"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setLatePostingFee(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Late posting fee required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Missed Meeting Fee</div>
                    <NumberBox
                      className="dx-field-value"
                      value={missedMeetingFee!}
                      placeholder="Missed Meeting Fee"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setMissedMeetingFee(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Missed meeting fee required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Late Meeting Attendance Fee
                    </div>
                    <NumberBox
                      className="dx-field-value"
                      value={lateMeetingFee!}
                      placeholder="Late Meeting Attendance Fee"
                      format={",##0.###"}
                      disabled={error || saving}
                      onValueChange={(value) => setLateMeetingFee(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Late meeting fee required" />
                      </Validator>
                    </NumberBox>
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
                    type={saving ? "normal" : "default"}
                    disabled={loading || error || saving}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={saving}
                    />
                    <span className="dx-button-text">Update Configuration</span>
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

export default Configuration;
