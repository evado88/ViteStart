import { useState, useEffect, useRef } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import Button from "devextreme-react/button";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import { useNavigate, useParams } from "react-router-dom";
import { confirm } from "devextreme/ui/dialog";
import TextArea from "devextreme-react/text-area";
import Validator, { RequiredRule } from "devextreme-react/validator";

import ValidationSummary from "devextreme-react/validation-summary";
import { MonthlyPostDetail } from "../../components/monthlyPostDetail";
import LoadIndicator from "devextreme-react/load-indicator";

const MyMonthlyPosting = ({ props }: any) => {
  //user
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eId } = useParams(); // Destructure the parameter directly

  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [stage, setStage] = useState(null);
  const [guarantorUserId, setGuarantorUserId] = useState(null);
  const [approvalLevels, setApprovalLevels] = useState(1);

  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");

  const [monthlyPosting, setMonthlyPosting] = useState<any | null>(null);

  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Approve Monthly Posting",
    `monthly-posting/id/${eId}`,
    "",
    "Monthly Posting",
    `monthly-posting/review-update/${eId}`,
    [Assist.ROLE_MEMBER],
  );

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //check if initialized
    if (hasRun.current) return;
    hasRun.current = true;

    //check permissions and audit
    if (!Assist.checkPageAuditPermission(pageConfig, user)) {
      Assist.redirectUnauthorized(navigate);
      return;
    }

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
    setGuarantorUserId(res.guarantor_user_email);
    setName(`${res.user.fname} ${res.user.lname}`);
  };

  const onFormApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //simulate process
    let result = confirm(
      `Are you sure you want to approve this monthly posting for ${name}?`,
      "Confirm changes",
    );

    result.then((dialogResult) => {
      if (dialogResult) {
        submitPostingReview(Assist.RESPONSE_YES, approvalComments, "approved");
      }
    });

    return;
  };
  const onFormRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //simulate process

    let result = confirm(
      `Are you sure you want to reject this monthly posting for ${name}?`,
      "Confirm changes",
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitPostingReview(1, rejectionReason, "rejected");
      }
    });
  };

  const requiresApproval = () => {
    if (
      status == "Submitted" &&
      stage == "Guarantor Approval" &&
      guarantorUserId == user.sub
    ) {
      return true;
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
    };

    setTimeout(() => {
      Assist.postPutData(pageConfig.Title, pageConfig.UpdateUrl, postData, 1)
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully ${verb} the monthly posting!`,
            "success",
          );

          navigate(`/my/monthly-posting/approvals`);
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
        section={"My"}
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
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MyMonthlyPosting;
