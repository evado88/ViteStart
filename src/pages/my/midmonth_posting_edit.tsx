import { useState, useEffect } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import {
  Validator,
  RequiredRule,
  CustomRule,
} from "devextreme-react/validator";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import { confirm } from "devextreme/ui/dialog";
import DateBox from "devextreme-react/date-box";
import { NumberBox } from "devextreme-react/number-box";
import { MemberHeader } from "../../components/memberHeader";
import { MonthlyPostMidDetail } from "../../components/monthlyPostMidDetail";
import TextArea from "devextreme-react/text-area";

const KnowledgebaseArticleEdit = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //
  const [date, setDate] = useState(() => {
    const today = new Date();
    const mysqlDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
    return mysqlDate;
    //return "2025-05-18";
  });

  const [postingContributions, setPostingContributions] = useState<
    number | null
  >(0);
  const [postingId, setPostingId] = useState<number | null>(0);

  const [midPostingSavings, setMidPostingSavings] = useState<number | null>(
    null,
  );
  const [postingSavings, setPostingSavings] = useState<number | null>(null);
  //additional

  const [postingComments, setPostingComments] = useState("No comments");

  //new loan loan application
  const [midPostingLoanApplication, setMidPostingLoanApplication] = useState<
    number | null
  >(0);

  const [postingLoanApplication, setPostingLoanApplication] = useState<
    number | null
  >(0);

  const [postingLoanRefinance, setPostingLoanRefinance] = useState<
    number | null
  >(null);

  //config
  const [totalSavingsAmount, setTotalSavingsAmount] = useState<number | null>(
    0,
  );

  const [savingsMultiple, setSavingsMultiple] = useState<number | null>(null);

  const [currentLoan, setCurrentLoan] = useState<any | null>(null);
  const [currentLoanAmount, setCurrentLoanAmount] = useState<number | null>(
    null,
  );
  const [currentLoanPaidAmount, setCurrentLoanPaidAmount] = useState<number>(0);

  const [loanSavingsRatio, setLoanSavingsRatio] = useState<number | null>(null);
  const [loanApplyLimit, setLoanApplyLimit] = useState<number | null>(null);

  const [config, setConfig] = useState(null);
  const [monthlyPosting, setMonthlyPosting] = useState(null);
  const [approvalLevels, setApprovalLevels] = useState<number | null>(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(
    `New Mid-Month Posting`,
    "",
    "",
    "Mid-Month Posting",
    `monthly-posting/param/${user.userid}`,
  );

  useEffect(() => {
    //only load config for new items to get approval levels and other data
    setLoading(true);
    setTimeout(() => {
      Assist.loadData("Configuration", pageConfig.UpdateUrl)
        .then((data: any) => {
          if (pageConfig.Id != 0) {
            Assist.loadData(pageConfig.Single, `transactions/id/${eId}`)
              .then((postData: any) => {
                setLoading(false);
                updateVaues(postData);
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

  const updatePostingParam = (data: any) => {
    setConfig(data.config);

    setLoanSavingsRatio(data.config.loan_saving_ratio);
    setLoanApplyLimit(data.config.loan_apply_limit);
    setApprovalLevels(data.config.approval_levels);

    setSavingsMultiple(data.config.saving_multiple);

    setTotalSavingsAmount(data.totalSavings);

    if (data.loan != null) {
      setCurrentLoan(data.loan);
      setCurrentLoanAmount(data.loan.amount);
      setCurrentLoanPaidAmount(data.totalLoanPaymentsAmount);
    }

    if (data.monthlyPosting == null) {
      Assist.showMessage(
        "You must submit your Monthly posting before applying for a mid-month posting",
        "error",
      );
      setError(true);
    } else {
      setMonthlyPosting(data.monthlyPosting);

      setPostingId(data.monthlyPosting.id);

      setPostingSavings(data.monthlyPosting.saving);

      setPostingLoanApplication(data.monthlyPosting.loan_application);
      setPostingContributions(data.monthlyPosting.contribution_total);

      setPostingLoanRefinance(data.monthlyPosting.loan_refinance);
    }
  };

  const getTotalSavingAmount = () => {
    return postingSavings! + midPostingSavings! + totalSavingsAmount!;
  };

  useEffect(() => {
    getTotalSavingAmount();
  }, [postingSavings, midPostingSavings, totalSavingsAmount]);

  const updateVaues = (data: any) => {
    setPostingComments(data.comments_mid);
  };

  const allowLoanApplication = () => {
    //check if there is a loan
    if (currentLoan == null) {
      //no loan
      return true;
    } else {
      if (postingLoanRefinance == Assist.LOAN_REFINANCE_YES) {
        //loan repaid, allow
        return true;
      } else {
        //dont allow
        return false;
      }
    }
  };
  const requireGuarantor = () => {
    //check if loan requires guarantor
    return (
      midPostingLoanApplication! + postingLoanApplication! >= loanApplyLimit!
    );
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let result = confirm(
      `Are you sure you want to submit this ${pageConfig.Single}?`,
      "Confirm submission",
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitItem();
      }
    });
  };
  const getContributions = () => {
    return postingContributions! + midPostingSavings!;
  };

  const getLoanAmount = () => {
    return allowLoanApplication()
      ? (postingLoanApplication! + midPostingLoanApplication!) * -1
      : 0;
  };

  const getDepositAmount = () => {
    const contributions = getContributions();
    const loan = getLoanAmount();

    if (contributions >= Math.abs(loan)) {
      return contributions - Math.abs(loan);
    } else {
      return 0;
    }
  };

  const getReceiveAmount = () => {
    const contributions = getContributions();
    const loan = getLoanAmount();

    if (contributions < Math.abs(loan)) {
      return Math.abs(loan) - contributions;
    } else {
      return 0;
    }
  };

  const submitItem = () => {
    const newData = {
      type: 1,
      user_id: user.userid,
      mid_status: Assist.POSTING_MIDMONTH,
      date: `${date} ${Assist.getCurrentTime()}`,
      saving_mid: midPostingSavings,
      saving: midPostingSavings! + postingSavings!,
      loan_application_mid: midPostingLoanApplication,
      loan_application: midPostingLoanApplication! + postingLoanApplication!,
      contribution_total: getContributions(),
      deposit_total: getDepositAmount(),
      receive_total: getReceiveAmount(),
      comments_mid: postingComments,
    };
    const postData = { ...(monthlyPosting as unknown as object), ...newData };
    console.log("Mid month", postData);

    setSaving(true);
    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        `monthly-posting/update/${postingId!}`,
        postData,
        postingId!,
      )
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully submitted the ${pageConfig.Title}!`,
            "success",
          );

          //navigate
          navigate(`/my/monthly-posting/list`);
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
              {Assist.formatCurrency(getTotalSavingAmount())}
            </h4>
          </Card>
        </Col>
      </Row>
      {/* chart start */}
      <form id="formMain" onSubmit={onFormSubmit}>
        <Row>
          <Col sz={12} sm={12} lg={7}>
            <Card title="Mid-Month" showHeader={true}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Period</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Date</div>
                    <div className="dx-field-value-static">
                      {" "}
                      {Assist.formatDateLong(date)}
                    </div>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">
                    Savings & Contribution
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Savings</div>
                    <NumberBox
                      className="dx-field-value"
                      value={midPostingSavings!}
                      placeholder="Savings"
                      disabled={error || saving || saving}
                      onValueChange={(value) => {
                        setMidPostingSavings(value);
                      }}
                    >
                      <Validator>
                        <RequiredRule message="Savings amount required" />
                        <CustomRule
                          validationCallback={(e) => {
                            if (
                              Number(e.value) % savingsMultiple! == 0 &&
                              Number(e.value) >= 0
                            ) {
                              return true;
                            } else {
                              return false;
                            }
                          }}
                          message={`Savings amount must be in mutiples of ${savingsMultiple}`}
                        />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Total Savings (Monthly + Mid-month Posting)
                    </div>
                    <div className="dx-field-value-static">
                      <strong>
                        {Assist.formatCurrency(
                          midPostingSavings! + postingSavings!,
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Loan Application</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Max Loan Amount ({loanSavingsRatio}X Savings)
                    </div>
                    <div className="dx-field-value-static">
                      <strong className="text-success">
                        {Assist.formatCurrency(
                          (totalSavingsAmount! +
                            midPostingSavings! +
                            postingSavings!) *
                            loanSavingsRatio!,
                        )}
                      </strong>
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Loan Amount</div>
                    {allowLoanApplication() && (
                      <NumberBox
                        className="dx-field-value"
                        value={midPostingLoanApplication!}
                        placeholder="Loan Amount"
                        disabled={error || saving || saving}
                        onValueChange={(value) =>
                          setMidPostingLoanApplication(value)
                        }
                        min={0.0}
                      >
                        <Validator>
                          <RequiredRule message="Loan amount required" />
                          <CustomRule
                            validationCallback={(e) =>
                              Number(e.value) + postingLoanApplication! <=
                              (totalSavingsAmount! +
                                midPostingSavings! +
                                postingSavings!) *
                                loanSavingsRatio!
                            }
                            message={`Total loan amount must be ≤ ${loanSavingsRatio} savings`}
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
                  {!allowLoanApplication() && currentLoan != null && (
                    <div className="dx-field">
                      <div className="dx-field-label">Current Loan Amount</div>
                      <div className="dx-field-value-static">
                        <strong>
                          {Assist.formatCurrency(currentLoanAmount!)}
                        </strong>
                      </div>
                    </div>
                  )}
                  {!allowLoanApplication() && currentLoan != null && (
                    <div className="dx-field">
                      <div className="dx-field-label">Current Loan Balance</div>
                      <div className="dx-field-value-static">
                        <strong className="text-danger">
                          {Assist.formatCurrency(currentLoanAmount! - currentLoanPaidAmount)}
                        </strong>
                      </div>
                    </div>
                  )}
                  {allowLoanApplication() && (
                    <div className="dx-field">
                      <div className="dx-field-label">
                        Total Loan (Monthly + Mid-month Posting)
                      </div>
                      <div className="dx-field-value-static">
                        <strong>
                          {Assist.formatCurrency(
                            midPostingLoanApplication! +
                              postingLoanApplication!,
                          )}
                        </strong>
                      </div>
                    </div>
                  )}
                  {allowLoanApplication() && (
                    <div className="dx-field">
                      <div className="dx-field-label">
                        Require Guarantor Approval
                      </div>
                      <div className="dx-field-value-static">
                        <strong>
                          {requireGuarantor()
                            ? `Yes, ${Assist.formatCurrency(
                                loanApplyLimit!,
                              )} and above`
                            : "No"}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Summary</div>
                  <div className="dx-field">
                    <div className="dx-field-label">
                      Total Contributions ZMW
                    </div>
                    <div className="dx-field-value-static">
                      <strong className="text-danger">
                        {Assist.formatCurrency(getContributions())}
                      </strong>
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Deposit Amount ZMW</div>
                    <div className="dx-field-value-static">
                      <strong className="text-danger">
                        {Assist.formatCurrency(getDepositAmount())}
                      </strong>
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Receive Amount ZMW</div>
                    <div className="dx-field-value-static">
                      <strong className="text-success">
                        {Assist.formatCurrency(getReceiveAmount())}
                      </strong>{" "}
                    </div>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Comments & feedback</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Comments</div>
                    <TextArea
                      className="dx-field-value"
                      placeholder="Comments"
                      disabled={error || saving || saving}
                      height={80}
                      value={postingComments}
                      onValueChange={(value) => setPostingComments(value)}
                    >
                      <Validator>
                        <RequiredRule message="Comments required" />
                      </Validator>
                    </TextArea>
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
          <Col sz={12} sm={12} lg={5}>
            {monthlyPosting && (
              <MonthlyPostMidDetail monthlyPosting={monthlyPosting} />
            )}
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default KnowledgebaseArticleEdit;
