import React from "react";
import { Link, Route } from "react-router-dom";
import { Card } from "./card";
import Assist from "../classes/assist";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import AppInfo from "../classes/app-info";
import HtmlEditor from "devextreme-react/html-editor";

interface GuarantorArgs {
  guarantor: any;
  showMember: boolean;
  unsubmitComponent?: React.ReactElement | null;
}
export const GuarantorDetail = ({
  guarantor: gurantorDetail,
  showMember: showMemberDetails,
  unsubmitComponent,
}: GuarantorArgs) => {
  return (
    /* start title */
    <Card title="Properties" showHeader={true}>
      <div className="form">
        {showMemberDetails && (
          <div className="dx-fieldset">
            <div className="dx-fieldset-header">Member Details</div>
            <div className="dx-field">
              <div className="dx-field-label">Full Name</div>
              <div className="dx-field-value-static">
                <strong>
                  {gurantorDetail.member.fname} {gurantorDetail.member.lname}
                </strong>
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Phone</div>
              <div className="dx-field-value-static">
                <strong>
                  {gurantorDetail.member.mobile1}
                </strong>
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Email</div>
              <div className="dx-field-value-static">
                <strong>{gurantorDetail.member.email}</strong>
              </div>
            </div>
          </div>
        )}
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Details</div>
          <div className="dx-field">
            <div className="dx-field-label">First name</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.guar_fname}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Last name</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.guar_lname}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Mobile</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.guar_mobile}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Email</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.guar_email}</strong>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Submission</div>
          <div className="dx-field">
            <div className="dx-field-label">User</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.created_by}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Status</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.status.status_name}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Approval Levels</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.approval_levels}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Stage</div>
            <div className="dx-field-value-static">
              <strong>{gurantorDetail.stage.stage_name}</strong>
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Date Submitted</div>
            <div className="dx-field-value-static">
              <strong>{Assist.getDateText(gurantorDetail.created_at)}</strong>
            </div>
          </div>
          {unsubmitComponent}
        </div>
      </div>
    </Card>
  );
};
