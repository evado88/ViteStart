import React from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "./card";
import Assist from "../classes/assist";

interface MonthlyPostArgs {
  monthlyPosting: any;
}
export const MonthlyPostDetail = ({ monthlyPosting }: MonthlyPostArgs) => {
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
        </div>
      </div>
    </Card>
  );
};
