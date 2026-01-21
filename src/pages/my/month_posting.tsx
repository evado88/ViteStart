import { useState, useEffect } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import { useNavigate, useParams } from "react-router-dom";
import { confirm } from "devextreme/ui/dialog";
import { MonthlyPostDetail } from "../../components/monthlyPostDetail";
import Button from "devextreme-react/button";
import { LoadIndicator } from "devextreme-react/load-indicator";

const MyMonthlyPosting = ({ props }: any) => {
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
    "View Monthly Posting",
    `monthly-posting/id/${eId}`,
    "",
    "Monthly Posting",
    `monthly-posting/review-update/${eId}`
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

  const requiresApproval = () => {
    if (status == "Submitted") {
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
      Assist.postPutData(pageConfig.Title, pageConfig.UpdateUrl, postData, 1)
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
          console.log(message);

          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };

  const unsubmitButton = () => {
    if (stage == "Submitted" && status == "Submitted") {
      return (
        <div className="dx-field">
          <div className="dx-field-label"></div>
          <div className="dx-field-value">
            <Button
              width="100%"
              type={saving ? "normal" : "default"}
              disabled={loading || error || saving}
              onClick={() => onFormUnsubmit()}
            >
              <LoadIndicator className="button-indicator" visible={saving} />
              <span className="dx-button-text">Unsubmit Monthly Posting</span>
            </Button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const onFormUnsubmit = () => {
    let result = confirm(
      "Are you sure you want to unsubmit this monthly posting?",
      "Confirm submission"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        unsubmitPosting();
      }
    });
  };

  const unsubmitPosting = () => {
    setSaving(true);

    const newData = {
      status_id: Assist.STATUS_DRAFT,
      stage_id: Assist.STAGE_AWAITING_SUBMISSION,
    };
    const postData = { ...monthlyPosting, ...newData };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        `monthly-posting/update/${eId}`,
        postData,
        1
      )
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            "You have successfully unsubmitted the monthly posting!",
            "success"
          );

          navigate(`/my/monthly-posting/list`);
        })
        .catch((message) => {
          setSaving(false);

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
            <MonthlyPostDetail
              monthlyPosting={monthlyPosting}
              unsubmitComponent={unsubmitButton()}
            />
          </Col>
          <Col sz={12} sm={12} lg={5}>
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

export default MyMonthlyPosting;
