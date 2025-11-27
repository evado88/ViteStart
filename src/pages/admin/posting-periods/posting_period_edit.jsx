import { useState, useEffect, useMemo } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import { TextBox } from "devextreme-react/text-box";
import { Validator, RequiredRule } from "devextreme-react/validator";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import DateBox from "devextreme-react/date-box";
import { useAuth } from "../../../context/AuthContext";
import PageConfig from "../../../classes/page-config";
import Assist from "../../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import HtmlEditor, { MediaResizing } from "devextreme-react/html-editor";
import AppInfo from "../../../classes/app-info";
import FileUploader from "devextreme-react/file-uploader";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { confirm } from "devextreme/ui/dialog";
import { NumberBox } from "devextreme-react/number-box";
import SelectBox from "devextreme-react/select-box";

const PostingPeriodEdit = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //posting
  const [name, setName] = useState(null);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [description, setDescription] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  //config
  const [config, setConfig] = useState(null);

  //posting
  const [maxPostDate, setMaxPostDate] = useState(null);
  const [cashAtBank, setCashAtBank] = useState(null);
  const [savingsMultiple, setSavingsMultiple] = useState(null);
  const [sharesMultiple, setSharesMultiple] = useState(null);
  const [socialMin, setSocialMin] = useState(null);

  //interest payment - minimum 10% if not yet paid on loan
  const [loanInterestPercent, setLoanInterestPercent] = useState(null);

  //loan payment -  minimum 10% if not yet paid on loan
  const [loanPaymentPercent, setLoanPaymentPercent] = useState(null);

  //new loan loan application
  const [loanSavingsRatio, setLoanSavingsRatio] = useState(null);
  const [loanDuration, setLoanDuration] = useState(null);
  const [approvalLevels, setApprovalLevels] = useState(null);
  const [loanApplyLimit, setLoanApplyLimit] = useState(null);
  //additiona
  const [latePostingFee, setLatePostingFee] = useState(null);
  const [missedMeetingFee, setMissedMeetingFee] = useState(null);
  const [lateMeetingFee, setLateMeetingFee] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(
    `Update Posting Period`,
    "",
    "",
    "Posting Period",
    ""
  );

  pageConfig.id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //only load config for new items to get approval levels and other data
    setLoading(true);
    setTimeout(() => {
      Assist.loadData("Configuration", "sacco-config/1")
        .then((data) => {
          updateConfigVaues(data);
          if (pageConfig.id != 0) {
            Assist.loadData(pageConfig.Single, `posting-periods/id/${eId}`)
              .then((postData) => {
                setLoading(false);
                updateVaues(postData);
                setConfig(data);
              })
              .catch((message) => {
                setLoading(false);
                setError(true);
                Assist.showMessage(message, "error");

                console.log(message);
              });
          } else {
            setLoading(false);
            setConfig(data);
            setError(false);
          }
        })
        .catch((message) => {
          setLoading(false);
          setError(true);
          Assist.showMessage(message, "error");

          console.log(message);
        });
    }, Assist.DEV_DELAY);
  }, []);

  const updateConfigVaues = (data) => {

    setMaxPostDate(data.late_posting_date_start);

    setSavingsMultiple(data.saving_multiple);
    setSharesMultiple(data.shares_multiple);
    setSocialMin(data.social_min);

    setLoanInterestPercent(data.loan_interest_rate);
    setLoanPaymentPercent(data.loan_repayment_rate);
    setLoanSavingsRatio(data.loan_saving_ratio);
    setLoanDuration(data.loan_duration);
    setLoanApplyLimit(data.loan_apply_limit);

    setLatePostingFee(data.late_posting_rate);
    setLateMeetingFee(data.late_meeting_rate);
    setMissedMeetingFee(data.missed_meeting_rate);

    setApprovalLevels(data.approval_levels);
  };

  const updateVaues = (data) => {
    setName(data.name);
    setYear(data.year);
    setMonth(data.month);
    setDescription(data.description);
    setCashAtBank(data.cash_at_bank);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    let result = confirm(
      "Are you sure you want to submit this posting period?",
      "Confirm submission"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitMeeting();
      }
    });
  };

  const submitMeeting = () => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      attachment_id: uploadedFiles.length == 0 ? null : uploadedFiles[0].id,
      period_name: name,
      year: year,
      month: month,
      description: description,
      //cash
      cash_at_bank: cashAtBank,
      //config
      late_posting_date_start: maxPostDate,
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
      approval_levels: approvalLevels,
      //service
      status_id: Assist.STATUS_SUBMITTED,
      stage_id: Assist.STAGE_SUBMITTED,
      approval_levels: config.approval_levels,
    };

    console.log(postData);

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.id == 0
          ? `posting-periods/create`
          : `posting-periods/update/${pageConfig.id}`,
        postData,
        pageConfig.id
      )
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully submitted the ${pageConfig.Title}!`,
            "success"
          );

          //navigate
          navigate(`/admin/posting-periods/list`);
        })
        .catch((message) => {
          setSaving(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };

  const toolbar = useMemo(() => {
    return AppInfo.htmlToolbar;
  }, []);

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
        title={`${pageConfig.Title}`}
        section={"Configuration"}
        icon={"gear"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <form id="formMain" onSubmit={onFormSubmit}>
        <Row>
          <Col sz={12} sm={12} lg={7}>
            <Card title="Properties" showHeader={true}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Name</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Title"
                      value={name}
                      disabled={error || saving}
                      onValueChange={(text) => setName(text)}
                    >
                      <Validator>
                        <RequiredRule message="Meeting title is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Year</div>
                    <div className="dx-field-value-static">
                      <strong>{year}</strong>
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Month</div>
                    <div className="dx-field-value-static">
                      <strong>{month}</strong>
                    </div>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Bank Balances</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Balance Brought Forward
                    </div>
                    <NumberBox
                      className="dx-field-value"
                      value={cashAtBank}
                      disabled={error || saving}
                      placeholder="Cash At Bank"
                      onValueChange={(value) => setCashAtBank(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Cash at bank required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Attachment File</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Upload File (5MB Max)</div>
                    <FileUploader
                      className="dx-field-value"
                      multiple={false}
                      accept="*"
                      name="file"
                      uploadMode="instantly"
                      onUploaded={(e) => {
                        if (e.request.status === 200) {
                          const res = JSON.parse(e.request.response);

                          if (res === null) {
                            Assist.showMessage(
                              `The response from the server is invalid. Please try again`,
                              "error"
                            );
                          } else {
                            setUploadedFiles([res.attachment]);
                          }
                        } else {
                          Assist.showMessage(
                            `Unable to upload meeting attendance list. Please try again`,
                            "error"
                          );
                        }
                      }}
                      uploadUrl={`${AppInfo.apiUrl}attachments/create/type/postingPeriod/parent/0`}
                      onUploadError={(e) => {
                        const error = JSON.parse(e.error.response);
                        Assist.showMessage(error.detail, "error");
                      }}
                    />
                  </div>
                  <div className="dx-field">
                    <DataGrid
                      className={"dx-card wide-card"}
                      dataSource={uploadedFiles}
                      keyExpr={"id"}
                      noDataText={"No attachment uploaded"}
                      showBorders={false}
                      focusedRowEnabled={false}
                      defaultFocusedRowIndex={0}
                      columnAutoWidth={true}
                      columnHidingEnabled={true}
                    >
                      <Paging defaultPageSize={10} />
                      <Pager showPageSizeSelector={true} showInfo={true} />
                      <Column
                        dataField="id"
                        caption="ID"
                        hidingPriority={7}
                      ></Column>
                      <Column
                        dataField="name"
                        caption="Name"
                        hidingPriority={4}
                        cellRender={(e) => {
                          return (
                            <a
                              href={encodeURI(
                                `${AppInfo.apiUrl}static/${e.data.path}`
                              )}
                              target="_null"
                            >
                              {e.text}
                            </a>
                          );
                        }}
                      ></Column>
                      <Column
                        dataField="filesize"
                        caption="Size"
                        format={",##0.###"}
                        hidingPriority={4}
                      ></Column>
                      <Column
                        dataField="filetype"
                        caption="Type"
                        hidingPriority={5}
                      ></Column>
                    </DataGrid>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Comments</div>
                  <div className="dx-field">
                    <HtmlEditor
                      height="525px"
                      defaultValue={description}
                      value={description}
                      toolbar={toolbar}
                      onValueChanged={(e) => setDescription(e.value)}
                    >
                      <MediaResizing enabled={true} />
                    </HtmlEditor>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col sz={12} sm={12} lg={5}>
            <Card title="Configuration" showHeader={true}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Posting Date</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Maximum Posting Date</div>
                    <DateBox
                      className="dx-field-value"
                      placeholder="Maximum Posting Date"
                      displayFormat={"dd"}
                      value={maxPostDate}
                      disabled={error || saving}
                      onValueChange={(text) => setMaxPostDate(text)}
                    >
                      <Validator>
                        <RequiredRule message="Maximum posting date required" />
                      </Validator>
                    </DateBox>
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
                      value={savingsMultiple}
                      placeholder="Savings Multiple"
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
                      value={sharesMultiple}
                      placeholder="Shares Multiple"
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
                      value={socialMin}
                      placeholder="Social Fund Minimum"
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
                      value={loanInterestPercent}
                      placeholder="Loan Interest Percentage"
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
                      value={loanPaymentPercent}
                      disabled={error || saving}
                      placeholder="Loan Payment Percentage"
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
                      value={loanSavingsRatio}
                      placeholder="Loan Savings Ratio"
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
                      value={loanDuration}
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
                      value={loanApplyLimit}
                      placeholder="Loan Guarantor Limit"
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
                    <div className="dx-field-label">Late Posting Fee</div>
                    <NumberBox
                      className="dx-field-value"
                      value={latePostingFee}
                      placeholder="Late Posting Fee"
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
                      value={missedMeetingFee}
                      placeholder="Missed Meeting Fee"
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
                      value={lateMeetingFee}
                      placeholder="Late Meeting Attendance Fee"
                      disabled={error || saving}
                      onValueChange={(value) => setLateMeetingFee(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Late meeting fee required" />
                      </Validator>
                    </NumberBox>
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">
                    <ValidationSummary id="summaryMain" />
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label"></div>
                  <Button
                    width="100%"
                    type={saving ? "normal" : "success"}
                    disabled={loading || error || saving}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={saving}
                    />
                    <span className="dx-button-text">Submit for Review</span>
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default PostingPeriodEdit;
