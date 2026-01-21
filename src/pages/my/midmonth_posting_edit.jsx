import { useState, useEffect, useMemo } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import { TextBox } from "devextreme-react/text-box";
import {
  Validator,
  RequiredRule,
  CustomRule,
} from "devextreme-react/validator";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import SelectBox from "devextreme-react/select-box";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import HtmlEditor, { MediaResizing } from "devextreme-react/html-editor";
import AppInfo from "../../classes/app-info";
import FileUploader from "devextreme-react/file-uploader";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { confirm } from "devextreme/ui/dialog";
import DateBox from "devextreme-react/date-box";
import { NumberBox } from "devextreme-react/number-box";
import { MemberHeader } from "../../components/memberHeader";

const KnowledgebaseArticleEdit = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //
  const [date, setDate] = useState(() => {
    const today = new Date();
    500;
    const iso = today.toISOString();

    const mysqlDate = `${iso[0]} ${iso[1]}`; // "YYYY-MM-DD"
    return iso;
    //return "2025-05-18";
  });
  const [amount, setAmount] = useState(null);
  const [comments, setComments] = useState(null);
  const [reference, setReference] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  //config

  const [totalSavingsAmount, setTotalSavingsAmount] = useState(0);
  const [loanSavingsRatio, setLoanSavingsRatio] = useState(0);
  const [loanApplyLimit, setLoanApplyLimit] = useState(0);
  const [currentLoan, setCurrentLoan] = useState(null);

  const [config, setConfig] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(
    `New Mid-Month Posting`,
    "",
    "",
    "Mid-Month Posting",
    `monthly-posting/param/${user.userid}`
  );

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //only load config for new items to get approval levels and other data
    setLoading(true);
    setTimeout(() => {
      Assist.loadData("Configuration", pageConfig.UpdateUrl)
        .then((data) => {
          if (pageConfig.Id != 0) {
            Assist.loadData(pageConfig.Single, `transactions/id/${eId}`)
              .then((postData) => {
                setLoading(false);
                updateVaues(postData, true);
                setConfig(data.config);
                updatePostingParam(data);
              })
              .catch((message) => {
                setLoading(false);
                setError(true);
                Assist.showMessage(message, "error");
              });
          } else {
            setLoading(false);
            setConfig(data.config);
            updatePostingParam(data);
          }
        })
        .catch((message) => {
          setLoading(false);
          setError(true);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  const updatePostingParam = (data, isLoading) => {
    setTotalSavingsAmount(data.totalSavings);
    setLoanApplyLimit(data.config.loan_apply_limit);
    setLoanSavingsRatio(data.config.loan_saving_ratio);
    console.log("Param", data);

    if (data.monthlyPosting == null) {
      Assist.showMessage(
        "You must submit your Monthly posting before applying for a mid-month loang",
        "error"
      );
      setError(true);
    }
  };

  const updateVaues = (data, isLoading) => {
    setDate(data.date);
    setAmount(data.amount);

    setComments(data.comments);
    setReference(data.reference);
    setUploadedFiles([data.attachment]);
  };

  const allowLoanApplication = () => {
    //check if there is a loan
    if (currentLoan == null) {
      return true;
    } else {
      return false;
    }
  };
  const requireGuarantor = () => {
    //check if loan requires guarantor
    return amount >= loanApplyLimit;
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    let result = confirm(
      `Are you sure you want to submit this ${pageConfig.Single}?`,
      "Confirm submission"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitArticle();
      }
    });
  };

  const submitArticle = () => {
    const postData = {
      user_id: user.userid,
      attachment_id: uploadedFiles.length == 0 ? null : uploadedFiles[0].id,
      type_id: Assist.TRANSACTION_LOAN,
      date: `${date}`,
      amount: amount,
      interest_rate: config.loan_interest_rate,
      term_months: config.loan_duration,
      comments: comments,
      reference: reference,
      state_id: Assist.STATE_OPEN,
      status_id: Assist.STATUS_SUBMITTED,
      stage_id: Assist.STAGE_SUBMITTED,
      approval_levels: config.approval_levels,
    };

    setSaving(true);
    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.Id == 0
          ? `transactions/create`
          : `transactions/update/${pageConfig.Id}`,
        postData,
        pageConfig.Id
      )
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully submitted the ${pageConfig.Title}!`,
            "success"
          );

          //navigate
          navigate(`/my/loans/submitted`);
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
        title={`${pageConfig.Title}`}
        section={"Configuration"}
        icon={"gear"}
        url="#"
      ></Titlebar>
      {/* end widget */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card title="Applicant" showHeader={false}>
            <MemberHeader title={user.name} description="Mid-Month Posting" />
            <h4 className="font-bold text-success">
              {Assist.formatCurrency(totalSavingsAmount)}
            </h4>
          </Card>
        </Col>
      </Row>
      {/* chart start */}
      <form id="formMain" onSubmit={onFormSubmit}>
        <Row>
          <Col sz={12} sm={12} lg={7}>
            <Card title="Properties" showHeader={true}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Detail</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Date</div>
                    <DateBox
                      className="dx-field-value"
                      placeholder="Date"
                      displayFormat={"dd MMMM yyyy"}
                      dateSerializationFormat="yyyy-MM-dd HH:mm"
                      value={date}
                      disabled={true}
                      onValueChange={(text) => setDate(text)}
                    >
                      <Validator>
                        <RequiredRule message="Date is required" />
                      </Validator>
                    </DateBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Comments</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Comments"
                      value={comments}
                      disabled={error || saving}
                      onValueChange={(text) => setComments(text)}
                    ></TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Reference</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Reference"
                      value={reference}
                      disabled={error || saving}
                      onValueChange={(text) => setReference(text)}
                    ></TextBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Loan Application</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Max Loan Amount ({loanSavingsRatio} Savings)
                    </div>
                    <div className="dx-field-value-static">
                      <strong className="text-success">
                        {Assist.formatCurrency(
                          totalSavingsAmount * loanSavingsRatio
                        )}
                      </strong>
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Loan Amount</div>
                    {allowLoanApplication() && (
                      <NumberBox
                        className="dx-field-value"
                        value={amount}
                        placeholder="Loan Amount"
                        disabled={error || saving || saving}
                        onValueChange={(value) => setAmount(value)}
                        min={0.0}
                      >
                        <Validator>
                          <RequiredRule message="Loan amount required" />
                          <CustomRule
                            validationCallback={(e) =>
                              Number(e.value) <=
                              totalSavingsAmount * loanSavingsRatio
                            }
                            message={`Loan amount must be ≤ ${loanSavingsRatio} savings`}
                          />
                        </Validator>
                      </NumberBox>
                    )}
                    {!allowLoanApplication() && (
                      <div className="dx-field-value-static">
                        <strong className="text-danger">
                          You already have an active loan
                        </strong>
                      </div>
                    )}
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Require Guarantor Approval
                    </div>
                    <div className="dx-field-value-static">
                      <strong>
                        {requireGuarantor()
                          ? `Yes, ${Assist.formatCurrency(
                              loanApplyLimit
                            )} and above`
                          : "No"}
                      </strong>
                    </div>
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
                      disabled={error || saving}
                      maxFileSize={5000000}
                      uploadMode="instantly"
                      onUploaded={(e) => {
                        if (e.request.status === 200) {
                          const res = JSON.parse(e.request.response);

                          console.log("runq", res);

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
                            `Unable to upload attachment file. Please try again`,
                            "error"
                          );
                        }
                      }}
                      uploadUrl={`${AppInfo.apiUrl}attachments/create/type/expenseEarning/parent/0`}
                    />
                  </div>
                  <div className="dx-field">
                    <DataGrid
                      className={"dx-card wide-card"}
                      dataSource={uploadedFiles}
                      keyExpr={"id"}
                      noDataText={"No attachment file uploaded"}
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

export default KnowledgebaseArticleEdit;
