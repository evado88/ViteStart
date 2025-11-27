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
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { PostingPeriodDetail } from "../../../components/postPeriodDetail";

const AdminPostingPeriod = ({ props }: any) => {
  //user
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const { eId } = useParams(); // Destructure the parameter directly

  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [postingsData, setPostingsData] = useState<any | null>([]);
  const [loadingText, setLoadingText] = useState("Loading data...");

  const [status, setStatus] = useState(null);
  const [stage, setStage] = useState(null);
  const [approvalLevels, setApprovalLevels] = useState(1);

  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");

  const [postingPeriod, setPostingPeriod] = useState<any | null>(null);

  const pageConfig = new PageConfig(
    "Review Posting Period",
    `posting-periods/id/${eId}`,
    "",
    "Posting Period",
    `posting-periods/review-update/${eId}`
  );

  pageConfig.id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      //load posting periods
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((res: any) => {
          //load postings
          const url = `monthly-posting/period/${eId}`;

          Assist.loadData(pageConfig.Title, url)
            .then((data: any) => {
              setLoading(false);
              updateVaues(res);
              setPostingsData(data);
              setPostingPeriod(res);
              setError(false);
           
              if (res.length === 0) {
                setLoadingText("No Data");
              } else {
                setLoadingText("");
              }
            })
            .catch((ex) => {
              console.log(ex);
              setLoading(false);
              setError(true);
              setLoadingText("Could not show information");
            });
        })
        .catch((ex) => {
          setLoading(false);
          setError(true);
        });
    }, Assist.DEV_DELAY);
  }, [eId]);

  const updateVaues = (res: any) => {
    setStatus(res.status);
    setStage(res.stage);
    setApprovalLevels(res.approval_levels);
    setPostingsData([res]);
  };

  const validatePostingApproval = () => {
    if (stage == "Awaiting POP Approval") {
      if (postingPeriod.sid7 != postingsData.length) {
        Assist.showMessage(
          `You can only approve this posting period once all ${postingsData.length} monthly posting(s) have been approved`,
          "error"
        );
      }
      return false;
    } else if (stage == "Submitted") {
      if (postingsData.length == 0) {
        Assist.showMessage(
          `You can only approve posting periods that have monthly postings!`,
          "error"
        );
      }
      return false;
    } else {
      return true;
    }
  };

  const onFormApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //simulate process
    let result = confirm(
      "Are you sure you want to approve this posting period?",
      "Confirm changes"
    );

    result.then((dialogResult) => {
      if (dialogResult) {
        if (validatePostingApproval()) {
          submitPostingPeriodReview(
            Assist.REVIEW_ACTION_APPROVE,
            approvalComments,
            "approved"
          );
        }
      }
    });

    return;
  };
  const onFormRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //simulate process

    let result = confirm(
      "Are you sure you want to reject this posting period?",
      "Confirm changes"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitPostingPeriodReview(
          Assist.REVIEW_ACTION_REJECT,
          rejectionReason,
          "rejected"
        );
      }
    });
  };

  const isReviewed = () => {
    return status == "Approved" || status == "Rejected";
  };

  const requiresApproval = () => {
    if (status == "Submitted" || status == "Rejected") {
      if (
        stage == "Guarantor Approval" ||
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

  const submitPostingPeriodReview = (
    action: number,
    reviewComments: string,
    verb: string
  ) => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      review_action: action,
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

          navigate(`/admin/posting-periods/list`);
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
      {postingPeriod != null && (
        <Row>
          <Col sz={12} sm={12} lg={8}>
            <PostingPeriodDetail
              postingPeriod={postingPeriod}
              postingsData={postingsData}
              loadingText={loadingText}
            />
          </Col>
          <Col sz={12} sm={12} lg={4}>
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
            {isReviewed() && (
              <Card title="Review" showHeader={true}>
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Primary Review</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Date</div>
                      <div className="dx-field-value-static">
                        <strong>
                          {Assist.getDateText(postingPeriod.review1_at)}
                        </strong>
                      </div>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Reviewer</div>
                      <div className="dx-field-value-static">
                        <strong>{postingPeriod.review1_by}</strong>
                      </div>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Comments</div>
                      <div className="dx-field-value-static">
                        <strong>{postingPeriod.review1_comments}</strong>
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
                            {Assist.getDateText(postingPeriod.review2_at)}
                          </strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Reviewer</div>
                        <div className="dx-field-value-static">
                          <strong> {postingPeriod.review2_by}</strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Comments</div>
                        <div className="dx-field-value-static">
                          <strong>{postingPeriod.review2_comments}</strong>
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
                            {Assist.getDateText(postingPeriod.review3_at)}
                          </strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Reviewer</div>
                        <div className="dx-field-value-static">
                          <strong>{postingPeriod.review3_by}</strong>
                        </div>
                      </div>
                      <div className="dx-field">
                        <div className="dx-field-label">Comments</div>
                        <div className="dx-field-value-static">
                          <strong>{postingPeriod.review3_comments}</strong>
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

export default AdminPostingPeriod;
