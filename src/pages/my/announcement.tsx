import { useState, useEffect } from "react";
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

const Aannouncement = ({ props }: any) => {
  //user
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const { eId } = useParams(); // Destructure the parameter directly

  //names
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  //posting
  const [postingDate, setPostingDate] = useState(null);
  const [postingSavings, setPostingSavings] = useState<number | null>(null);
  const [postingShares, setPostingShares] = useState<number | null>(null);
  const [postingSocial, setPostingSocial] = useState<number | null>(null);
  const [postingPenalty, setPostingPenalty] = useState<number | null>(null);

  //interest payment - minimum 10% if not yet paid on loan
  const [postingLoanInterestPayment, setPostingLoanInterestPayment] = useState<
    number | null
  >(null);

  //loan payment -  minimum 10% if not yet paid on loan
  const [postingLoanAmountPayment, setPostingLoanAmountPayment] = useState<
    number | null
  >(null);

  //loan payment - usual payment every month
  const [postingLoanMonthPayment, setPostingLoanMonthPayment] = useState<
    number | null
  >(null);

  //new loan loan application
  const [postingLoanApplication, setPostingLoanApplication] = useState<
    number | null
  >(null);

  //additiona
  const [postingComments, setPostingComments] = useState(null);
  const [postingLateMeeting, setPostingLateMeetings] = useState(null);
  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [status, setStatus] = useState(null);
  const [stage, setStage] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

  const pageConfig = new PageConfig(
    "Monthly Posting",
    `monthly-posting/id/${eId}`,
    "",
    "Monthly Posting",
    ""
  );

  pageConfig.id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((res: any) => {
          setLoading(false);
          console.log("rs", res);
          updateVaues(res);
          setError(false);
        })
        .catch((ex) => {
          setLoading(false);
          setError(true);
        });
    },  Assist.developmentDelay);
  }, [eId]);

  const updateVaues = (res: any) => {
    setFirstName(res.data.user.fname);
    setLastName(res.data.user.lname);

    setPostingDate(res.data.saving);
    setPostingSavings(res.data.saving);
    setPostingShares(res.data.shares);
    setPostingSocial(res.data.social);
    setPostingPenalty(res.data.penalty);

    setPostingLoanInterestPayment(res.data.loan_interest);
    setPostingLoanAmountPayment(res.data.loan_amount_payment);
    setPostingLoanMonthPayment(res.data.loan_month_repayment);
    setPostingLoanApplication(res.data.loan_application);
    setPostingComments(res.data.comments);

    setStatus(res.data.status.status_name);
    setStage(res.data.stage.stage_name);
    setCreatedAt(res.data.created_at);
  };

  return (
    <div id="pageRoot" className="page-content" style={{ minHeight: "862px" }}>
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
        section={"Administration"}
        icon={"home"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={7}>
          <Card title="Properties" showHeader={true}>
            <div className="form">
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Personal Details</div>
                <div className="dx-field">
                  <div className="dx-field-label">Full Name</div>
                  <div className="dx-field-value-static">
                    {firstName} {lastName}
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Period</div>
                  <div className="dx-field-value-static">{postingDate}</div>
                </div>
              </div>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Savings & Contrbutions</div>
                <div className="dx-field">
                  <div className="dx-field-label">Savings</div>
                  <div className="dx-field-value-static">{postingSavings}</div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Shares</div>
                  <div className="dx-field-value-static">{postingShares}</div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Social Fund</div>
                  <div className="dx-field-value-static">{postingSocial}</div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Penalty</div>
                  <div className="dx-field-value-static">{postingPenalty}</div>
                </div>
              </div>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Interest</div>
                <div className="dx-field">
                  <div className="dx-field-label">
                    Minimum 10% Loan Interest
                  </div>
                  <div className="dx-field-value-static">
                    {postingLoanInterestPayment}
                  </div>
                </div>
              </div>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Loan Repayment</div>
                <div className="dx-field">
                  <div className="dx-field-label">Minimum 10% Loan Payment</div>
                  <div className="dx-field-value-static">
                    {postingLoanAmountPayment}
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Loan Repayment</div>
                  <div className="dx-field-value-static">
                    {postingLoanAmountPayment}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={5}>
          <Card title="Properties" showHeader={true}>
            <div className="form">
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Loan Application</div>
                <div className="dx-field">
                  <div className="dx-field-label">Loan Amount</div>
                  <div className="dx-field-value-static">
                    {postingLoanApplication}
                  </div>
                </div>
              </div>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Comments & feedback</div>
                <div className="dx-field">
                  <div className="dx-field-label">Comemnts</div>
                  <div className="dx-field-value-static">{postingComments}</div>
                </div>
              </div>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Submission</div>
                <div className="dx-field">
                  <div className="dx-field-label">Status</div>
                  <div className="dx-field-value-static">{status}</div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Stage</div>
                  <div className="dx-field-value-static">{stage}</div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Date</div>
                  <div className="dx-field-value-static">{createdAt}</div>
                </div>
              </div>
              <div className="dx-field">
                <div className="dx-field-label"></div>
                <Button
                  width="100%"
                  useSubmitBehavior={true}
                  type="success"
                  visible={!error}
                  onClick={() => {
                    let result = confirm(
                      "Are you sure you want to review this monthly posting?",
                      "Confirm changes"
                    );
                    result.then((dialogResult) => {
                      if(dialogResult){
                        navigate(`/admin/monthly-postings/review/${eId}`);
                      }
                    });
                  }}
                >
                  <span className="dx-button-text">Review Monthly Post</span>
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Aannouncement;
