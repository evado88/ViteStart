import React from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "./card";
import Assist from "../classes/assist";
interface MonthlyPostArgs {
  monthlyPosting: any;
  unsubmitComponent?: React.ReactElement | null;
}
export const MonthlyPostDetail = ({
  monthlyPosting,
  unsubmitComponent,
}: MonthlyPostArgs) => {
  const isMobileMoney = () => {
    //check if there is a loan
    if (monthlyPosting.payment_method_type == null) {
      return false;
    } else {
      return monthlyPosting.payment_method_type != "Bank Transfer";
    }
  };

  return (
    /* start title */
    <Card title="Properties" showHeader={true}>
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Personal Details</div>
          <div className="dx-field">
            <div className="dx-field-label">Full Name</div>
            <div className="dx-field-value-static">
              <strong>
                {monthlyPosting.user.fname} {monthlyPosting.user.lname}
              </strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Period</div>
            <div className="dx-field-value-static">
              <strong>{monthlyPosting.period.period_name}</strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Savings & Contrbutions</div>
          <div className="dx-field">
            <div className="dx-field-label">Savings</div>
            <div className="dx-field-value-static">
              <strong>{Assist.formatCurrency(monthlyPosting.saving)}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Shares</div>
            <div className="dx-field-value-static">
              <strong>{Assist.formatCurrency(monthlyPosting.shares)}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Social Fund</div>
            <div className="dx-field-value-static">
              <strong>{Assist.formatCurrency(monthlyPosting.social)}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Penalty</div>
            <div className="dx-field-value-static">
              <strong>{Assist.formatCurrency(monthlyPosting.penalty)}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Payment Method Type</div>
            <div className="dx-field-value-static">
              <strong>{monthlyPosting.payment_method_type}</strong>
            </div>
          </div>
          {isMobileMoney() && (
            <div className="dx-field">
              <div className="dx-field-label">Payment Method Number</div>
              <div className="dx-field-value-static">
                <strong>{monthlyPosting.payment_method_number}</strong>
              </div>
            </div>
          )}
          {isMobileMoney() && (
            <div className="dx-field">
              <div className="dx-field-label">Payment Method Name</div>
              <div className="dx-field-value-static">
                <strong>{monthlyPosting.payment_method_name}</strong>
              </div>
            </div>
          )}
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Interest</div>
          <div className="dx-field">
            <div className="dx-field-label">Loan Interest</div>
            <div className="dx-field-value-static">
              <strong>
                {Assist.formatCurrency(monthlyPosting.loan_interest)}
              </strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Loan Repayment</div>
          <div className="dx-field">
            <div className="dx-field-label">Loan Payment</div>
            <div className="dx-field-value-static">
              <strong>
                {Assist.formatCurrency(monthlyPosting.loan_month_repayment)}
              </strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Loan Application</div>
          <div className="dx-field">
            <div className="dx-field-label">Loan Amount</div>
            <div className="dx-field-value-static">
              <strong>
                {Assist.formatCurrency(monthlyPosting.loan_application)}
              </strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Summary</div>
          <div className="dx-field">
            <div className="dx-field-label">Contribution Total</div>
            <div className="dx-field-value-static">
              <strong>
                {Assist.formatCurrency(monthlyPosting.contribution_total)}
              </strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Deposit Total</div>
            <div className="dx-field-value-static">
              <strong className="text-danger">
                {Assist.formatCurrency(monthlyPosting.deposit_total)}
              </strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Receive Total</div>
            <div className="dx-field-value-static">
              <strong className="text-success">
                {Assist.formatCurrency(monthlyPosting.receive_total)}
              </strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Comments & feedback</div>
          <div className="dx-field">
            <div className="dx-field-label">Comments</div>
            <div className="dx-field-value-static">
              {monthlyPosting.comments}
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Submission</div>
          <div className="dx-field">
            <div className="dx-field-label">Status</div>
            <div className="dx-field-value-static">
              <strong>{monthlyPosting.status.status_name}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Approval Levels</div>
            <div className="dx-field-value-static">
              <strong>{monthlyPosting.approval_levels}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Stage</div>
            <div className="dx-field-value-static">
              <strong>{monthlyPosting.stage.stage_name}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Date Submitted</div>
            <div className="dx-field-value-static">
              <strong>{Assist.getDateText(monthlyPosting.created_at)}</strong>
            </div>
          </div>
          {unsubmitComponent}
        </div>
      </div>
    </Card>
  );
};
