import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectBox from "devextreme-react/select-box";
import Button from "devextreme-react/button";
import { Card } from "./card";
import Assist from "../classes/assist";

interface Props {
  param: any; //monthly-posting/param response
  onChanged: () => void; //reload after a request is made
}

//shown instead of the monthly posting form until the member has an approved
//guarantor and an approved payment method
export const PostingPrerequisites = ({ param, onChanged }: Props) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const hasGuarantor = param.guarantors.length > 0;
  const pendingGuarantors: any[] = param.pendingGuarantors ?? [];
  const hasPaymentMethod = param.paymentMethods.length > 0;
  //in the first month a payment method still awaiting approval is enough
  const approvalRequired = param.paymentMethodApprovalRequired !== false;
  const methodLabel = (p: any) =>
    p.status_id == Assist.STATUS_APPROVED ? p.name : `${p.name} (awaiting approval)`;

  useEffect(() => {
    if (!hasGuarantor) {
      Assist.loadData("Members", "members/directory")
        .then((data: any) => setMembers(data))
        .catch((message) => Assist.showMessage(message, "error"));
    }
  }, [hasGuarantor]);

  const requestGuarantor = () => {
    setSaving(true);
    Assist.postPutData("Guarantor", "guarantors/request", { guarantor_user_id: chosen }, 0)
      .then(() => {
        setSaving(false);
        setChosen(null);
        Assist.showMessage(
          "Your request has been sent. Your guarantor has been emailed to approve it.",
          "success",
        );
        onChanged();
      })
      .catch((message) => {
        setSaving(false);
        Assist.showMessage(message, "error");
      });
  };

  const done = (text: string) => (
    <p className="text-success mb-0">
      <i className="fa fa-check-circle"></i> {text}
    </p>
  );

  return (
    <Card title="Before you can make a monthly posting" showHeader={true}>
      <p>
        {approvalRequired
          ? "Every monthly posting needs an approved guarantor and an approved payment method. Complete the steps below; the posting form opens once both are approved."
          : "Every monthly posting needs an approved guarantor and a payment method. Complete the steps below; the posting form opens once both are in place."}
      </p>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">1. Guarantor</div>
        {hasGuarantor &&
          done(
            `Approved: ${param.guarantors
              .map((g: any) => `${g.guar_fname} ${g.guar_lname}`)
              .join(", ")}`,
          )}
        {!hasGuarantor && pendingGuarantors.length > 0 && (
          <p className="text-warning">
            <i className="fa fa-clock-o"></i> Waiting for{" "}
            {pendingGuarantors.map((g) => `${g.guar_fname} ${g.guar_lname}`).join(", ")} to
            approve your request. You can also ask someone else below.
          </p>
        )}
        {!hasGuarantor && (
          <>
            <p className="text-muted">
              Choose a fellow member to be your guarantor. They will be emailed and
              asked to approve.
            </p>
            <div className="dx-field">
              <div className="dx-field-label">Guarantor</div>
              <SelectBox
                className="dx-field-value"
                dataSource={members}
                valueExpr="user_id"
                displayExpr="name"
                searchEnabled={true}
                placeholder="Search for a member..."
                value={chosen}
                onValueChange={(value) => setChosen(value)}
              />
            </div>
            <Button
              text="Ask to be my guarantor"
              type="default"
              width="100%"
              disabled={!chosen || saving}
              onClick={requestGuarantor}
            />
          </>
        )}
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">2. Payment method</div>
        {hasPaymentMethod &&
          done(param.paymentMethods.map(methodLabel).join(", "))}
        {!hasPaymentMethod && param.pendingPaymentMethods > 0 && (
          <p className="text-warning">
            <i className="fa fa-clock-o"></i> Your payment method is waiting for an
            administrator to approve it.
          </p>
        )}
        {!hasPaymentMethod && param.pendingPaymentMethods == 0 && (
          <>
            <p className="text-muted">
              Add the bank account or mobile money number you pay from.{" "}
              {approvalRequired
                ? "An administrator will approve it."
                : "You can make your posting straight away; an administrator will approve it."}
            </p>
            <Button
              text="Add a payment method"
              type="default"
              width="100%"
              onClick={() => navigate("/my/payment-methods/add")}
            />
          </>
        )}
      </div>
    </Card>
  );
};
