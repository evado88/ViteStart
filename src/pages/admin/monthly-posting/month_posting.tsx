import { useState, useEffect, useRef } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import Button from "devextreme-react/button";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../../context/AuthContext";
import PageConfig from "../../../classes/page-config";
import Assist from "../../../classes/assist";
import { useNavigate, useParams } from "react-router-dom";
import { confirm } from "devextreme/ui/dialog";
import TextArea from "devextreme-react/text-area";
import Validator, { RequiredRule } from "devextreme-react/validator";
import SelectBox from "devextreme-react/select-box";
import AppInfo from "../../../classes/app-info";
import ValidationSummary from "devextreme-react/validation-summary";
import { MonthlyPostDetail } from "../../../components/monthlyPostDetail";
import LoadIndicator from "devextreme-react/load-indicator";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { Field } from "../../../components/field";
import { Fieldset } from "../../../components/fieldset";

const AdminMonthlyPosting = ({ props }: any) => {
  //user
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const { eId } = useParams(); // Destructure the parameter directly

  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any | null>([]);

  const [status, setStatus] = useState(null);
  const [stage, setStage] = useState(null);
  const [approvalLevels, setApprovalLevels] = useState(1);

  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");

  const [monthlyPosting, setMonthlyPosting] = useState<any | null>(null);

  const [assignPenalty, setAssignPenalty] = useState<string | null>(null);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Review Monthly Posting",
    `monthly-posting/id/${eId}`,
    "",
    "Monthly Posting",
    `monthly-posting/review-update/${eId}`,
    [Assist.ROLE_ADMIN],
  );

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((res: any) => {
          setLoading(false);
          updateVaues(res);
          setMonthlyPosting(res);
          setError(false);
        })
        .catch((ex) => {
          setLoading(false);
          setError(true);
        });
    }, Assist.DEV_DELAY);
  }, [eId]);

  const updateVaues = (res: any) => {
    setStatus(res.status.status_name);
    setStage(res.stage.stage_name);
    setApprovalLevels(res.approval_levels);
    setUploadedFiles([res]);
  };

  const onFormApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //simulate process
    const additional =
      stage == "Awaiting POP Approval"
        ? " This will post all transactions in the this monthly post"
        : "";

    let result = confirm(
      `Are you sure you want to approve this monthly posting?${additional}`,
      "Confirm changes",
    );

    result.then((dialogResult) => {
      if (dialogResult) {
        submitPostingReview(
          Assist.REVIEW_ACTION_APPROVE,
          approvalComments,
          "approved",
        );
      }
    });

    return;
  };
  const onFormRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //simulate process

    let result = confirm(
      "Are you sure you want to reject this monthly posting?",
      "Confirm changes",
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitPostingReview(
          Assist.REVIEW_ACTION_REJECT,
          rejectionReason,
          "rejected",
        );
      }
    });
  };

  const isReviewed = () => {
    return status == "Approved" || status == "Rejected";
  };

  const requiresApproval = () => {
    if (status == "Submitted") {
      if (
        stage == "Guarantor Approval" ||
        stage == "Awaiting POP Upload" ||
        stage == "Awaiting Submission" ||
        stage == "Approved"
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const submitPostingReview = (
    action: number,
    reviewComments: string,
    verb: string,
  ) => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      review_action: action,
      comments: reviewComments,
      penalize: assignPenalty == "Yes" ? Assist.RESPONSE_YES : Assist.RESPONSE_NO,
    };

    setTimeout(() => {
      Assist.postPutData(pageConfig.Title, pageConfig.UpdateUrl, postData, 1)
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully ${verb} the monthly posting!`,
            "success",
          );

          navigate(`/admin/monthly-postings/list`);
        })
        .catch((message) => {
          setSaving(false);
          console.log(message);

          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };
  return (
    <div id="pageRoot" className="page-content" style={{ minHeight: "862px" }}>
      <LoadPanel
        shadingColor="rgba(248, 242, 242, 0.)"
        position={{ of: "#pageRoot" }}
        visible={loading}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />
      <Titlebar
        title={pageConfig.Title}
        section={"Administration"}
        icon={"home"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      {monthlyPosting != null && (
        <Row>
          <Col sz={12} sm={12} lg={7}>
            <MonthlyPostDetail monthlyPosting={monthlyPosting} />
          </Col>
          <Col sz={12} sm={12} lg={5}>
            {requiresApproval() && (
              <Card title="Rejection" showHeader={true}>
                <div className="form">
                  <form id="formMain" onSubmit={onFormRejectSubmit}>
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">Submission</div>
                      <div className="dx-field">
                        <div className="dx-field-label">Assign Penalty</div>
                        <SelectBox
                          className="dx-field-value"
                          dataSource={AppInfo.yesNoList}
                          onValueChange={(value) => setAssignPenalty(value)}
                          validationMessagePosition="left"
                          value={assignPenalty}
                          disabled={error}
                        >
                          <Validator validationGroup="Reject">
                            <RequiredRule message="Assign penalty is required" />
                          </Validator>
                        </SelectBox>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Rejection Reason</div>
                        <TextArea
                          className="dx-field-value"
                          placeholder="Rejection Reason"
                          disabled={error || saving || saving}
                          height={80}
                          value={rejectionReason}
                          onValueChange={(value) => setRejectionReason(value)}
                        >
                          <Validator validationGroup="Reject">
                            <RequiredRule message="Rejection reason required" />
                          </Validator>
                        </TextArea>
                      </div>
                    </div>
                    <div className="dx-field">
                      <ValidationSummary
                        id="summaryReject"
                        validationGroup="Reject"
                      />
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label"></div>
                      <Button
                        width="100%"
                        useSubmitBehavior={true}
                        validationGroup="Reject"
                        type={saving ? "normal" : "danger"}
                        disabled={loading || error || saving}
                      >
                        <LoadIndicator
                          className="button-indicator"
                          visible={saving}
                        />
                        <span className="dx-button-text">
                          Reject Monthly Post
                        </span>
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            )}
            {requiresApproval() && (
              <Card title="Approval" showHeader={true}>
                <div className="form">
                  <form id="formMain" onSubmit={onFormApproveSubmit}>
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">Submission</div>
                      {stage == "Awaiting POP Approval" && (
                        <Field
                          staticContent={true}
                          title="POP Comments / Reference"
                        >
                          <strong>{monthlyPosting.pop_comments}</strong>
                        </Field>
                      )}
                      {stage == "Awaiting POP Approval" && (
                        <div className="dx-field">
                          <DataGrid
                            className={"dx-card wide-card"}
                            dataSource={[monthlyPosting.attachment]}
                            keyExpr={"id"}
                            noDataText={"No POP uploaded"}
                            showBorders={false}
                            focusedRowEnabled={false}
                            defaultFocusedRowIndex={0}
                            columnAutoWidth={true}
                            columnHidingEnabled={true}
                          >
                            <Paging defaultPageSize={10} />
                            <Pager
                              showPageSizeSelector={true}
                              showInfo={true}
                            />
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
                                      `${AppInfo.apiUrl}static/${e.data.path}`,
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
                      )}
                      <div className="dx-field">
                        <div className="dx-field-label">
                          Comments (Optional)
                        </div>
                        <TextArea
                          className="dx-field-value"
                          placeholder="Comments"
                          disabled={error || saving || saving}
                          height={80}
                          value={approvalComments}
                          onValueChange={(value) => setApprovalComments(value)}
                        ></TextArea>
                      </div>
                    </div>

                    <div className="dx-field">
                      <ValidationSummary
                        id="summaryApprove"
                        validationGroup="Approve"
                      />
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label"></div>
                      <Button
                        width="100%"
                        useSubmitBehavior={true}
                        type={saving ? "normal" : "success"}
                        disabled={loading || error || saving}
                        validationGroup="Approve"
                      >
                        <LoadIndicator
                          className="button-indicator"
                          visible={saving}
                        />
                        <span className="dx-button-text">
                          Approve Monthly Post
                        </span>
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            )}
            {isReviewed() && (
              <Card title="Review" showHeader={true}>
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Primary Review</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Date</div>
                      <div className="dx-field-value-static">
                        <strong>
                          {Assist.getDateText(monthlyPosting.review1_at)}
                        </strong>
                      </div>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Reviewer</div>
                      <div className="dx-field-value-static">
                        <strong>{monthlyPosting.review1_by}</strong>
                      </div>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Comments</div>
                      <div className="dx-field-value-static">
                        <strong>{monthlyPosting.review1_comments}</strong>
                      </div>
                    </div>
                  </div>
                  {approvalLevels >= 2 && (
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">Secondary Review</div>
                      <div className="dx-field">
                        <div className="dx-field-label">Date</div>
                        <div className="dx-field-value-static">
                          {" "}
                          <strong>
                            {Assist.getDateText(monthlyPosting.review2_at)}
                          </strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Reviewer</div>
                        <div className="dx-field-value-static">
                          <strong> {monthlyPosting.review2_by}</strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Comments</div>
                        <div className="dx-field-value-static">
                          <strong>{monthlyPosting.review2_comments}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                  {approvalLevels == 3 && (
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">Approval</div>
                      <div className="dx-field">
                        <div className="dx-field-label">Date</div>
                        <div className="dx-field-value-static">
                          {" "}
                          <strong>
                            {Assist.getDateText(monthlyPosting.review3_at)}
                          </strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Reviewer</div>
                        <div className="dx-field-value-static">
                          <strong>{monthlyPosting.review3_by}</strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Comments</div>
                        <div className="dx-field-value-static">
                          <strong>{monthlyPosting.review3_comments}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                  {monthlyPosting.guarantor_required == Assist.RESPONSE_YES && (
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">
                        Guarantor Approval
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Date</div>
                        <div className="dx-field-value-static">
                          {" "}
                          <strong>
                            {Assist.getDateText(monthlyPosting.guarantor_at)}
                          </strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Reviewer</div>
                        <div className="dx-field-value-static">
                          <strong>{monthlyPosting.guarantor_by}</strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Comments</div>
                        <div className="dx-field-value-static">
                          <strong>{monthlyPosting.guarantor_comments}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">
                      Proof of Payment Approval
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Date</div>
                      <div className="dx-field-value-static">
                        {" "}
                        <strong>
                          {Assist.getDateText(monthlyPosting.pop_review_at)}
                        </strong>
                      </div>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Reviewer</div>
                      <div className="dx-field-value-static">
                        <strong>{monthlyPosting.pop_review_by}</strong>
                      </div>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Comments</div>
                      <div className="dx-field-value-static">
                        <strong>{monthlyPosting.pop_review_comments}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AdminMonthlyPosting;
