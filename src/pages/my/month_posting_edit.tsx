import React, { useState, useEffect } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import {
  Validator,
  RequiredRule,
  CustomRule,
} from "devextreme-react/validator";
import TextArea from "devextreme-react/text-area";
import { NumberBox } from "devextreme-react/number-box";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import DataGrid, {
  Column,
  Pager,
  Paging,
  Summary,
  GroupItem,
  TotalItem,
} from "devextreme-react/data-grid";
import { MemberHeader } from "../../components/memberHeader";
import { confirm } from "devextreme/ui/dialog";
import SelectBox from "devextreme-react/select-box";
import AppInfo from "../../classes/app-info";
const PostMonthly = () => {
  //user
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eId } = useParams(); // Destructure the parameter directly

  //posting
  //for dev
  //const [postingDate, setPostingDate] = useState("2025-05-18");
  const [postingDate, setPostingDate] = useState(() => {
    const today = new Date();
    const mysqlDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
    return mysqlDate;
    //return "2025-05-18";
  });

  const [postingDateText, setPostingDateText] = useState(() => {
    const friendly = Assist.getPostingPeriodText("2025-05-18");
    return friendly;
  });

  const [postingSavings, setPostingSavings] = useState<number | null>(null);
  const [postingShares, setPostingShares] = useState<number | null>(null);
  const [postingSocial, setPostingSocial] = useState<number | null>(null);
  const [postingPenalty, setPostingPenalty] = useState<number | null>(0);

  const [postingPayMethodData, setPostingPayMethodData] = useState<
    any[] | null
  >([]);

  const [postingPayMethod, setPostingPayMethod] = useState<string | null>(null);

  const [postingGuarantorData, setPostingGuarantorData] = useState<
    any[] | null
  >([]);

  const [postingGuarantor, setPostingGuarantor] = useState<string | null>(null);

  const [postingMember, setPostingMember] = useState<any | null>(null);
  const [postingAttendanceType, setPostingAttendanceType] = useState<
    string | null
  >(null);
  //interest payment - minimum 10% if not yet paid on loan
  const [postingLoanInterestPayment, setPostingLoanInterestPayment] = useState<
    number | null
  >(0);

  //loan payment - usual payment every month or 10% first month
  const [minPostingLoanMonthPayment, setMinPostingLoanMonthPayment] =
    useState(0);

  const [postingLoanMonthPayment, setPostingLoanMonthPayment] = useState<
    number | null
  >(0);

  //new loan loan application
  const [postingLoanApplication, setPostingLoanApplication] = useState<
    number | null
  >(0);


  //additiona
  const [postingComments, setPostingComments] = useState("No comments");

  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  //configuration
  //posting
  const [latePostingStartDate, setLatePostingStartDate] = useState<
    string | null
  >(null);
  const [latePostingStartDay, setLatePostingStartDay] = useState(1);

  const [savingsMultiple, setSavingsMultiple] = useState<number | null>(null);
  const [sharesMultiple, setSharesMultiple] = useState<number | null>(null);
  const [socialMin, setSocialMin] = useState<number | null>(null);
  const [approvalLevels, setApprovalLevels] = useState<number | null>(null);

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
  const [loanApplyLimit, setLoanApplyLimit] = useState<number | null>(null);

  //additional
  const [latePostingFee, setLatePostingFee] = useState<number | null>(null);
  const [missedMeetingFee, setMissedMeetingFee] = useState<number | null>(null);
  const [lateMeetingFee, setLateMeetingFee] = useState<number | null>(null);

  const [currentLoan, setCurrentLoan] = useState<any | null>(null);
  const [loanPayments, setLoanPayments] = useState<number>(0);
  const [loanBalance, setLoanBalance] = useState<number>(0);
  const [allowLoanAmountChange, setAllowLoanAmountChange] =
    useState<boolean>(true);

  const [loanData, setLoanData] = useState<any[] | null>([]);
  const [penaltyData, setPenaltyData] = useState<any[] | null>([]);
  const [totalSavingsAmount, setTotalSavingsAmount] = useState<number | null>(
    0,
  );

  const [summryData, setSummaryData] = useState<any[] | null>([]);

  const pageConfig = new PageConfig(
    `New Monthly Posting`,
    "",
    "",
    "User",
    `monthly-posting/param/${user.userid}`,
  );

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  //load posting param and id if a
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      Assist.loadData("Monthly Posting Param", pageConfig.UpdateUrl)
        .then((data) => {
          if (pageConfig.Id != 0) {
            Assist.loadData("Monthly Posting", `monthly-posting/id/${eId}`)
              .then((postData) => {
                setLoading(false);
                updateVaues(data);
                updatePosting(postData);
              })
              .catch((message) => {
                setLoading(false);
                setError(true);
                Assist.showMessage(message, "error");
              });
          } else {
            setLoading(false);
            updateVaues(data);
            setError(false);
          }
        })
        .catch((message) => {
          setLoading(false);
          setError(true);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  useEffect(() => {
    updateSummary();
  }, [
    postingSavings,
    postingShares,
    postingSocial,
    postingPenalty,
    postingLoanInterestPayment,
    postingLoanMonthPayment,
    postingLoanApplication,
    postingAttendanceType,
    postingDate,
    latePostingStartDate,
  ]);

  const updatePosting = (data: any) => {
    const postDate = data.date.split("T")[0];

    setPostingDate(postDate);
    setPostingSavings(data.saving);
    setPostingShares(data.shares);

    setPostingPayMethod(data.payment_method_id);
    setPostingGuarantor(data.guarantor_id);

    setPostingAttendanceType(data.meeting_attendance);

    setPostingLoanApplication(data.loan_application);
    setPostingComments(data.comments);

    if (data.status.status_name == "Submitted") {
      setError(true);
      Assist.showMessage(
        "This monthly posting has already been submitetd and cannt be edited",
        "error",
      );
    } else {
      setError(false);
    }
  };
  const updateVaues = (data: any) => {
    setPostingMember(data.member);

    setPostingPayMethodData(data.paymentMethods);
    setPostingGuarantorData(data.guarantors);

    setLatePostingStartDate(
      Assist.updateDateDay(postingDate, data.latePostingStartDay),
    );

    setLatePostingStartDay(data.latePostingStartDay);

    setSavingsMultiple(data.config.saving_multiple);
    setSharesMultiple(data.config.shares_multiple);
    setSocialMin(data.config.social_min);

    setTotalSavingsAmount(data.totalSavings);

    setLoanInterestPercent(data.config.loan_interest_rate);
    setLoanPaymentPercent(data.config.loan_repayment_rate);
    setLoanSavingsRatio(data.config.loan_saving_ratio);
    setLoanApplyLimit(data.config.loan_apply_limit);

    setLatePostingFee(data.config.late_posting_rate);
    setLateMeetingFee(data.config.late_meeting_rate);
    setMissedMeetingFee(data.config.missed_meeting_rate);

    setApprovalLevels(data.config.approval_levels);

    setPostingSocial(data.config.social_min);

    //load penlaties
    setPenaltyData(data.penalties);

    //use calculated penalty
    setPostingPenalty(data.totalPenaltiesAmount);

    //check loans
    if (data.loan) {
      const balance = data.loan.amount - data.totalLoanPaymentsAmount;

      setLoanBalance(balance);

      const loan = {
        ...data.loan,
        totalLoanPaymentsAmount: data.totalLoanPaymentsAmount,
        totalLoanPaymentsNo: data.totalLoanPaymentsNo,
        balanceAmount: balance,
      };

      //load loans
      const loans: any[] = [loan];

      setLoanData(loans);
      setLoanPayments(data.totalLoanPaymentsNo);
      setCurrentLoan(data.loan);

      //calculate amount for interest
      //check if user has loan and has not payment before
      if (data.loan != null && data.totalLoanPaymentsNo == 0) {
        //no payment
        const interestAmount =
          data.loan.amount * data.loan.interest_rate * 0.01;

        setPostingLoanInterestPayment(interestAmount);
      }

      //calculate amount for loan payment
      //check if user has loan
      if (data.loan != null) {
        //check if user has made payment before
        if (data.totalLoanPaymentsNo == 0) {
          //no payment. Must pay assigned percent
          const loanRepaymentAmount =
            data.loan.amount * data.config.loan_repayment_rate * 0.01;
          setPostingLoanMonthPayment(loanRepaymentAmount);
          setMinPostingLoanMonthPayment(loanRepaymentAmount);
          //setAllowLoanAmountChange(false);
        } else {
          //has paid, can pay any amount
          setPostingLoanMonthPayment(null);
        }
      }
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let result = confirm(
      "Are you sure you want to submit this monthly posting?",
      "Confirm submission",
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitPosting();
      }
    });
  };

  const submitPosting = () => {
    setSaving(true);

    const periodDate = new Date(postingDate);
    const periodId = Assist.getDatePeriodId(periodDate);

    const totalContributions = getContributions();

    const postData = {
      type: 1,
      user_id: user.userid,
      user_action_id: user.userid,
      period_id: periodId,
      meeting_attendance: postingAttendanceType,
      missed_meeting_penalty: isAbsenteePosting() ? missedMeetingFee : 0,
      mid_status: Assist.POSTING_MONTHLY,
      date: `${postingDate} ${Assist.getCurrentTime()}`,
      saving_mon: postingSavings,
      saving_mid: 0,
      saving: postingSavings,
      shares: postingShares,
      social: postingSocial,
      penalty: postingPenalty,
      penalty_list: penaltyData,
      loan_interest: postingLoanInterestPayment,
      loan_month_repayment: postingLoanMonthPayment,
      loan_application_mon: postingLoanApplication,
      loan_application_mid: 0,
      loan_application: postingLoanApplication,
      loan_refinance: getLoanRefinanceState(),
      guarantor_required: requireGuarantor()
        ? Assist.RESPONSE_YES
        : Assist.RESPONSE_NO,
      guarantor_user_email: postingMember.guar_email,
      late_post_penalty: islatePosting() ? latePostingFee : 0,
      status_id: Assist.STATUS_SUBMITTED,
      approval_levels: approvalLevels,
      comments: postingComments,
      contribution_total: totalContributions,
      deposit_total: getDepositAmount(),
      receive_total: getReceiveAmount(),
      payment_method_id: postingPayMethod,
      guarantor_id: postingGuarantor,
      stage_id: Assist.STAGE_SUBMITTED,
    };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.Id == 0
          ? `monthly-posting/create`
          : `monthly-posting/update/${pageConfig.Id}`,
        postData,
        pageConfig.Id,
      )
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            "You have successfully submitted the monthly posting!",
            "success",
          );

          navigate(`/my/monthly-posting/list`);
        })
        .catch((message) => {
          setSaving(false);

          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };

  const allowLoanInterestPayment = () => {
    //check if there is a loan and no payment has been made
    if (currentLoan != null && loanPayments == 0) {
      return true;
    } else {
      return false;
    }
  };

  const requireGuarantor = () => {
    //check if loan requires guarantor
    return postingLoanApplication! >= loanApplyLimit!;
  };

  const isMobileMoney = () => {
    //check if there is a loan
    if (postingPayMethod == null) {
      return false;
    } else {
      return postingPayMethod != "Bank Transfer";
    }
  };

  const allowLoanPayment = () => {
    //check if there is a loan
    return currentLoan != null;
  };

  const allowLoanApplication = () => {
    //check if there is a loan
    if (currentLoan == null) {
      return true;
    } else {
      return postingLoanMonthPayment! >= loanBalance;
    }
  };

  const getLoanRefinanceState = () => {
    if (currentLoan == null) {
      return Assist.LOAN_REFINANCE_NOLOAN;
    } else {
      return postingLoanMonthPayment! >= loanBalance
        ? Assist.LOAN_REFINANCE_YES
        : Assist.LOAN_REFINANCE_NO;
    }
  };

  const loanInterestLabel = () => {
    if (currentLoan != null && loanPayments == 0) {
      //loan available
      return `${currentLoan.interest_rate}% Loan Interest`;
    } else {
      //no loan available
      return "Loan Interest";
    }
  };

  const loanInterestValue = () => {
    if (currentLoan != null) {
      //loan available
      return "You have already paid interest on current loan";
    } else {
      //no loan available
      return "You do not have an active loan";
    }
  };

  const loanPaymentLabel = () => {
    if (currentLoan != null) {
      //loan available
      if (loanPayments == 0) {
        return `${loanPaymentPercent}% Loan Repayment`;
      } else {
        return `Loan Repayment`;
      }
    } else {
      //no loan available
      return "Loan Repayment";
    }
  };

  const islatePosting = () => {
    const isLate = postingDate >= latePostingStartDate!;
    return isLate;
  };

  const isAbsenteePosting = () => {
    const isAbsentee = postingAttendanceType == "No";
    return isAbsentee;
  };

  const getContributions = () => {
    let total =
      postingSavings! +
      postingShares! +
      postingSocial! +
      postingPenalty! +
      postingLoanInterestPayment! +
      postingLoanMonthPayment!;

    if (islatePosting()) {
      total += latePostingFee!;
    }
    if (isAbsenteePosting()) {
      total += missedMeetingFee!;
    }
    return total;
  };

  const getLoanAmount = () => {
    return allowLoanApplication() ? postingLoanApplication! * -1 : 0;
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

  const updateSummary = () => {
    const summaryItems = [];

    //savings
    summaryItems.push({
      id: 1,
      name: "Savings",
      type: "Contribution",
      amount: postingSavings ?? 0,
    });

    //shares
    summaryItems.push({
      id: 2,
      name: "Shares",
      type: "Contribution",
      amount: postingShares ?? 0,
    });

    //social
    summaryItems.push({
      id: 3,
      name: "Social",
      type: "Contribution",
      amount: postingSocial! ?? 0,
    });

    //penalty
    summaryItems.push({
      id: 4,
      name: "Penalty",
      type: "Contribution",
      amount: postingPenalty ?? 0,
    });

    //penalty
    if (islatePosting()) {
      summaryItems.push({
        id: 13,
        name: "Late Posting Fee",
        type: "Contribution",
        amount: latePostingFee ?? 0,
      });
    }

    if (isAbsenteePosting()) {
      summaryItems.push({
        id: 13,
        name: "Meeting Absence Fee",
        type: "Contribution",
        amount: missedMeetingFee ?? 0,
      });
    }
    //loan interest

    summaryItems.push({
      id: 13,
      name: "Loan Interest",
      type: "Contribution",
      amount: postingLoanInterestPayment ?? 0,
    });

    //loan repayment

    summaryItems.push({
      id: 13,
      name: "Loan Repaymeent",
      type: "Contribution",
      amount: postingLoanMonthPayment ?? 0,
    });

    //loan repayment

    summaryItems.push({
      id: 13,
      name: "Loan Application",
      type: "Earning",
      amount: getLoanAmount(),
    });

    setSummaryData(summaryItems);
  };

  return (
    <div id="pageRoot" className="page-content">
      <LoadPanel
        shadingColor="rgba(248, 242, 242, 0.9)"
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
        <Col sz={12} sm={12} lg={12}>
          <Card title="Applicant" showHeader={false}>
            <MemberHeader
              title={user.name}
              description="Current Cummulative Savings"
            />
            <h4 className="font-bold text-success">
              {Assist.formatCurrency(totalSavingsAmount!)}
            </h4>
          </Card>
        </Col>
      </Row>
      <form id="formMain" onSubmit={onFormSubmit}>
        <Row>
          <Col sz={12} sm={12} lg={7}>
            <Card title="Details" showHeader={false}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Period</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Current</div>
                    <div className="dx-field-value-static">
                      {" "}
                      {Assist.formatDateLong(postingDate)}
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Late Posting Start</div>
                    <div className="dx-field-value-static">
                      {" "}
                      {Assist.formatDateLong(latePostingStartDate!)}
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Posting Status</div>
                    <div className="dx-field-value-static">
                      <strong
                        className={`text-${
                          islatePosting() ? "danger" : "success"
                        }`}
                      >
                        {islatePosting() ? "Late" : "Early"} Posting
                      </strong>
                    </div>
                  </div>
                  {islatePosting() && (
                    <div className="dx-field">
                      <div className="dx-field-label">Late Posting Fee</div>
                      <div className="dx-field-value-static">
                        <strong className="text-danger">
                          {Assist.formatCurrency(latePostingFee!)}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            <Card title="Details" showHeader={false}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">
                    Savings & Contributions
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Savings</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingSavings!}
                      placeholder="Savings"
                      disabled={error || saving || saving}
                      onValueChange={(value) => setPostingSavings(value)}
                    >
                      <Validator>
                        <RequiredRule message="Savings amount required" />
                        <CustomRule
                          validationCallback={(e) => {
                            if (
                              Number(e.value) % savingsMultiple! == 0 &&
                              Number(e.value) > 0
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
                    <div className="dx-field-label">Shares</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingShares!}
                      placeholder="Shares"
                      disabled={error || saving || saving}
                      onValueChange={(value) => setPostingShares(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Shares amount required" />
                        <CustomRule
                          validationCallback={(e) => {
                            if (
                              Number(e.value) % sharesMultiple! == 0 &&
                              Number(e.value) != 0
                            ) {
                              return true;
                            } else {
                              return false;
                            }
                          }}
                          message={`Share amount must be in mutiples of ${sharesMultiple}`}
                        />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Social Fund</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingSocial!}
                      placeholder="Social Fund"
                      disabled={true}
                      onValueChange={(value) => setPostingSocial(value)}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Social fund amount required" />
                        <CustomRule
                          validationCallback={(e) =>
                            Number(e.value) >= socialMin!
                          }
                          message={`Social amount must be greater or equal to ${socialMin}`}
                        />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Penalty</div>
                    <NumberBox
                      className="dx-field-value"
                      value={postingPenalty!}
                      placeholder="Penalty"
                      disabled={true}
                      min={0.0}
                    >
                      <Validator>
                        <RequiredRule message="Penalty amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Payment Method</div>
                    <SelectBox
                      className="dx-field-value"
                      placeholder="Payment Method"
                      dataSource={postingPayMethodData}
                      valueExpr={"id"}
                      displayExpr={"name"}
                      itemTemplate={(twn) => `${twn.name} - ${twn.type}`}
                      onValueChange={(value) => setPostingPayMethod(value)}
                      validationMessagePosition="left"
                      value={postingPayMethod}
                      disabled={error}
                    >
                      <Validator>
                        <RequiredRule message="Prefered payment method is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Guarantor</div>
                    <SelectBox
                      className="dx-field-value"
                      placeholder="Guarantor"
                      dataSource={postingGuarantorData}
                      valueExpr={"id"}
                      displayExpr={"guar_email"}
                      itemTemplate={(twn) =>
                        `${twn.guar_fname} - ${twn.guar_lname}`
                      }
                      onValueChange={(value) => setPostingGuarantor(value)}
                      validationMessagePosition="left"
                      value={postingGuarantor}
                      disabled={error}
                    >
                      <Validator>
                        <RequiredRule message="Guarantor is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Details" showHeader={false}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Interest</div>
                  <div className="dx-field">
                    <div className="dx-field-label">{loanInterestLabel()}</div>
                    {allowLoanInterestPayment() && (
                      <NumberBox
                        className="dx-field-value"
                        value={postingLoanInterestPayment!}
                        placeholder={loanInterestLabel()}
                        disabled={
                          error ||
                          saving ||
                          saving ||
                          allowLoanInterestPayment()
                        }
                        onValueChange={(value) =>
                          setPostingLoanInterestPayment(value)
                        }
                      >
                        <Validator>
                          <RequiredRule
                            message={`${currentLoan.interest_rate}% Loan interest amount required`}
                          />
                        </Validator>
                      </NumberBox>
                    )}
                    {!allowLoanInterestPayment() && (
                      <div className="dx-field-value-static">
                        <strong>{loanInterestValue()}</strong>
                      </div>
                    )}
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Loan Repayment</div>
                  {allowLoanPayment() && (
                    <div className="dx-field">
                      <div className="dx-field-label">Loan Balance</div>
                      <div className="dx-field-value-static">
                        <strong className="text-danger">
                          {Assist.formatCurrency(loanBalance)}
                        </strong>
                      </div>
                    </div>
                  )}
                  <div className="dx-field">
                    <div className="dx-field-label">{loanPaymentLabel()}</div>
                    {allowLoanPayment() && (
                      <NumberBox
                        className="dx-field-value"
                        value={postingLoanMonthPayment!}
                        max={loanBalance}
                        placeholder={loanPaymentLabel()}
                        disabled={
                          error || saving || saving || !allowLoanAmountChange
                        }
                        onValueChange={(value) =>
                          setPostingLoanMonthPayment(value)
                        }
                      >
                        <Validator>
                          <RequiredRule
                            message={`${loanPaymentLabel()} amount requred`}
                          />
                          <CustomRule
                            validationCallback={(e) => {
                              if (loanPayments == 0) {
                                return (
                                  Number(e.value) >= minPostingLoanMonthPayment
                                );
                              } else {
                                return true;
                              }
                            }}
                            message={`Loan repayment must be >= ${Assist.formatCurrency(
                              minPostingLoanMonthPayment,
                            )}`}
                          />
                        </Validator>
                      </NumberBox>
                    )}
                    {!allowLoanPayment() && (
                      <div className="dx-field-value-static">
                        <strong>No active loan</strong>
                      </div>
                    )}
                  </div>

                  {allowLoanPayment() && (
                    <div className="dx-field">
                      <div className="dx-field-label">Loan Refinance</div>
                      <div className="dx-field-value-static">
                        <strong>
                          {getLoanRefinanceState() == Assist.LOAN_REFINANCE_YES
                            ? "Yes"
                            : "No"}
                        </strong>
                      </div>
                    </div>
                  )}
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
                          (totalSavingsAmount! + postingSavings!) *
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
                        value={postingLoanApplication!}
                        placeholder="Loan Amount"
                        disabled={error || saving || saving}
                        onValueChange={(value) =>
                          setPostingLoanApplication(value)
                        }
                        min={0.0}
                      >
                        <Validator>
                          <RequiredRule message="Loan amount required" />
                          <CustomRule
                            validationCallback={(e) =>
                              Number(e.value) <=
                              (totalSavingsAmount! + postingSavings!) *
                                loanSavingsRatio!
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
                              loanApplyLimit!,
                            )} and above`
                          : "No"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Details" showHeader={false}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Meeting Attendance</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Attending Meeting</div>
                    <SelectBox
                      className="dx-field-value"
                      placeholder="Meeting Attendance"
                      dataSource={AppInfo.yesNoList}
                      onValueChange={(value) => setPostingAttendanceType(value)}
                      validationMessagePosition="left"
                      value={postingAttendanceType}
                      disabled={error}
                    >
                      <Validator>
                        <RequiredRule message="Meeting attendance is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                  {isAbsenteePosting() && (
                    <div className="dx-field">
                      <div className="dx-field-label">Meeting Absence Fee</div>
                      <div className="dx-field-value-static">
                        <strong className="text-danger">
                          {Assist.formatCurrency(missedMeetingFee!)}
                        </strong>
                      </div>
                    </div>
                  )}
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
              </div>
            </Card>
          </Col>
          <Col sz={12} sm={12} lg={5}>
            <Card title="Loans & Penalties" showHeader={true}>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Loans</div>
                <div className="dx-field">
                  <DataGrid
                    className={"dx-card wide-card"}
                    dataSource={loanData}
                    keyExpr={"id"}
                    noDataText={"You have no active loans"}
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
                      visible={false}
                      hidingPriority={8}
                    ></Column>
                    <Column
                      dataField="date"
                      caption="Date"
                      dataType="date"
                      format={"dd MMM yyy"}
                      hidingPriority={7}
                      visible={true}
                    ></Column>
                    <Column
                      dataField="amount"
                      caption="Amount ZMW"
                      format={",##0.###"}
                      hidingPriority={6}
                    ></Column>
                    <Column
                      dataField="balanceAmount"
                      caption="Balance ZMW"
                      format={",##0.###"}
                      hidingPriority={5}
                    ></Column>
                    <Column
                      dataField="interest_rate"
                      caption="Interest (%)"
                      format={",##0.###"}
                      hidingPriority={4}
                    ></Column>
                    <Column
                      dataField="term_months"
                      caption="Term"
                      hidingPriority={3}
                    ></Column>
                    <Column
                      dataField="totalLoanPaymentsAmount"
                      caption="Total Paid (ZMW)"
                      format={",##0.###"}
                      hidingPriority={2}
                    ></Column>
                    <Column
                      dataField="totalLoanPaymentsNo"
                      caption="No Payments"
                      hidingPriority={1}
                    ></Column>
                  </DataGrid>
                </div>
                <div className="dx-fieldset-header">Penalties</div>
                <div className="dx-field">
                  <DataGrid
                    className={"dx-card wide-card"}
                    dataSource={penaltyData}
                    keyExpr={"id"}
                    noDataText={"You have no active penalties"}
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
                      visible={false}
                      hidingPriority={7}
                    ></Column>
                    <Column
                      dataField="date"
                      caption="Date"
                      dataType="date"
                      format={"dd MMM yyy"}
                      hidingPriority={6}
                    ></Column>
                    <Column
                      dataField="type.type_name"
                      caption="Type"
                      groupIndex={0}
                      format={",##0.###"}
                      hidingPriority={4}
                    ></Column>
                    <Column
                      dataField="amount"
                      caption="Amount ZMW"
                      format={",##0.###"}
                      hidingPriority={5}
                    ></Column>
                    <Column
                      dataField="ptype.type_name"
                      caption="Type"
                      format={",##0.###"}
                      hidingPriority={4}
                    ></Column>
                    <Summary>
                      <GroupItem
                        column="amount"
                        summaryType="sum"
                        valueFormat=",##0.##"
                        displayFormat="Total ZMW: {0}"
                        showInGroupFooter={true}
                      />
                    </Summary>
                  </DataGrid>
                </div>
              </div>
            </Card>
            <Card title="Posting Summary" showHeader={true}>
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Contribution & Loans</div>
                <div className="dx-field">
                  <DataGrid
                    className={"dx-card wide-card"}
                    dataSource={summryData}
                    keyExpr={"id"}
                    noDataText={"No contributions and loans"}
                    showBorders={false}
                    focusedRowEnabled={false}
                    defaultFocusedRowIndex={0}
                    columnAutoWidth={true}
                    columnHidingEnabled={true}
                  >
                    <Paging defaultPageSize={15} />
                    <Pager showPageSizeSelector={false} showInfo={true} />
                    <Column
                      dataField="id"
                      caption="ID"
                      visible={false}
                      hidingPriority={7}
                    ></Column>
                    <Column
                      dataField="type"
                      caption="Type"
                      groupIndex={0}
                      format={",##0.###"}
                      hidingPriority={4}
                    ></Column>
                    <Column
                      dataField="name"
                      caption="Name"
                      hidingPriority={4}
                    ></Column>
                    <Column
                      dataField="amount"
                      caption="Amount ZMW"
                      format={",##0.###"}
                      hidingPriority={5}
                    ></Column>
                    <Summary>
                      <GroupItem
                        column="amount"
                        summaryType="sum"
                        valueFormat=",##0.##"
                        displayFormat="Total ZMW: {0}"
                        showInGroupFooter={true}
                      />
                      <TotalItem
                        column="amount"
                        summaryType="sum"
                        displayFormat="Total Deposit Amount ZMW: {0}"
                      />
                    </Summary>
                  </DataGrid>
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
                <div className="dx-field">
                  <ValidationSummary id="summaryMain" />
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

export default PostMonthly;
