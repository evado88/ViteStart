import React from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "./card";
import Assist from "../classes/assist";
import { MonthlyPostingsList } from "./monthlyPostingList";
interface PostingPeriodArgs {
  postingPeriod: any;
  postingsData: any;
  loadingText: string;
}
export const PostingPeriodDetail = ({
  postingPeriod,
  postingsData: data,
  loadingText,
}: PostingPeriodArgs) => {
  return (
    /* start title */
    <Card title="Properties" showHeader={true}>
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Period Details</div>
          <div className="dx-field">
            <div className="dx-field-label">Name</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.name}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Year</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.year}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Month</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.month}</strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Monthly Postings</div>
          <div className="dx-field">
            <MonthlyPostingsList
              data={data}
              loadingText={loadingText}
              isMember={false}
            />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Statistics</div>
          <div className="dx-field">
            <div className="dx-field-label">Awaiting Submission</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid1}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Submitted</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid2}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Primary Approval</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid3}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Secondary Approval</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid4}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Guarantor Approval</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid5}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Awaiting POP Upload</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid6}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Awaiting POP Approval</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid7}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Approved</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.sid8}</strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Submission</div>
          <div className="dx-field">
            <div className="dx-field-label">Status</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.status}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Approval Levels</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.approval_levels}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Stage</div>
            <div className="dx-field-value-static">
              <strong>{postingPeriod.stage}</strong>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
