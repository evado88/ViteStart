import { useState, useEffect } from "react";
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
const AdminMonthlyPosting = ({ props }: any) => {
  //user
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const { eId } = useParams(); // Destructure the parameter directly

  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState(null);
  const [stage, setStage] = useState(null);
  const [approvalLevels, setApprovalLevels] = useState(1);

  const [requireGuarantorApproval, setRequireGuarantorApproval] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");

  const [monthlyPosting, setMonthlyPosting] = useState<any | null>(null);

  const pageConfig = new PageConfig(
    "Review Monthly Posting",
    `monthly-posting/id/${eId}`,
    "",
    "Monthly Posting",
    `monthly-posting/review-update/${eId}`
  );

  pageConfig.id = eId == undefined ? 0 : Number(eId);

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
    }, Assist.developmentDelay);
  }, [eId]);

  const updateVaues = (res: any) => {
    setStatus(res.status.status_name);
    setStage(res.stage.stage_name);
    setApprovalLevels(res.approval_levels);
  };

  const isGuarantorRequired = () => {
    return requireGuarantorApproval == "No" ? 1 : 2;
  };

  const onFormApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //simulate process
    let result = confirm(
      "Are you sure you want to approve this monthly posting?",
      "Confirm changes"
    );

    result.then((dialogResult) => {
      if (dialogResult) {
        const addGurantorApproval =
          stage == "Submitted" ? isGuarantorRequired() : null;

        submitPostingReview(
          2,
          addGurantorApproval,
          approvalComments,
          "approved"
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
      "Confirm changes"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitPostingReview(1, 1, rejectionReason, "rejected");
      }
    });
  };

  const isReviewed = () => {
    return status == "Approved" || status == "Rejected";
  };

  const submitPostingReview = (
    action: number,
    requireGuarantor: any,
    reviewComments: string,
    verb: string
  ) => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      review_action: action,
      require_guarantor_approval: requireGuarantor,
      comments: reviewComments,
    };

    setTimeout(() => {
      Assist.postPutData(pageConfig.Title, pageConfig.updateUrl, postData, 1)
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully ${verb} the monthly posting!`,
            "success"
          );

          navigate(`/admin/monthly-postings/list`);
        })
        .catch((message) => {
          setSaving(false);
          console.log(message)

          Assist.showMessage(message, "error");
        });
    }, Assist.developmentDelay);
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
            {status == "Submitted" && (
              <Card title="Rejection" showHeader={true}>
                <div className="form">
                  <form id="formMain" onSubmit={onFormRejectSubmit}>
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">Submission</div>
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
            {status == "Submitted" && (
              <Card title="Approval" showHeader={true}>
                <div className="form">
                  <form id="formMain" onSubmit={onFormApproveSubmit}>
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">Submission</div>
                      {stage == "Submitted" && (
                        <div className="dx-field">
                          <div className="dx-field-label">
                            Require Guarantor Approval
                          </div>
                          <SelectBox
                            className="dx-field-value"
                            dataSource={AppInfo.yesNoList}
                            placeholder="Require Guarantor Approval"
                            onValueChange={(value) =>
                              setRequireGuarantorApproval(value)
                            }
                            validationMessagePosition="left"
                            value={requireGuarantorApproval}
                            disabled={error}
                          >
                            <Validator validationGroup="Approve">
                              <RequiredRule message="Require Guarantor Approval is required" />
                            </Validator>
                          </SelectBox>
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
