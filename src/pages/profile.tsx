import React, { useState, useEffect } from "react";
import { Titlebar } from "../components/titlebar";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import SelectBox from "devextreme-react/select-box";
import { Validator, RequiredRule } from "devextreme-react/validator";
import Button from "devextreme-react/button";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../context/AuthContext";
import PageConfig from "../classes/page-config";
import Assist from "../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate } from "react-router-dom";
import { MemberDetail } from "../components/memberDetail";

const Profile = () => {
  //user
  const { user } = useAuth();

  const navigate = useNavigate();

  //additiona

  const [memberDetail, setMemberDetail] = useState<null | any>(null);

  const [guarantors, setGuarantors] = useState([]);
  const [guarantor, setGuarantor] = useState<number | undefined>(undefined);

  const [paymnetMethods, setPaymentMethods] = useState([]);
  const [paymnetMethod, setPaymentMethod] = useState<number | undefined>(
    undefined,
  );
  const [payoutMethod, setPayouttMethod] = useState<number | undefined>(
    undefined,
  );
  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(
    "Profile",
    `members/user/${user.userid}`,
    "",
    "Profile",
    ``,
    [1],
  );

  useEffect(() => {
    //put audit action
    Assist.auditAction(
      user.userid,
      user.sub,
      user.jti,
      pageConfig.Title,
      null,
      "Update",
      null,
      null,
    );

    if (!pageConfig.Permissions?.includes(user.role)) {
      navigate("/404");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((data) => {
          setLoading(false);
          updateVaues(data);
          setError(false);
        })
        .catch((message) => {
          setLoading(false);
          setError(true);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Assist.loadData(
        pageConfig.Title,
        `guarantors/user/${user.userid}/approved/list`,
      )
        .then((data: any) => {
          setGuarantors(data);
        })
        .catch((message) => {
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Assist.loadData(
        pageConfig.Title,
        `paymentmethods/user/${user.userid}/approved/list`,
      )
        .then((data: any) => {
          setPaymentMethods(data);
        })
        .catch((message) => {
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  const updateVaues = (data: any) => {
    setMemberDetail(data);

    setGuarantor(data.guarantor_id);
    setPaymentMethod(data.payment_method_id);
    setPayouttMethod(data.payout_method_id);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    setSaving(true);

    e.preventDefault();

    const newData = {
      guarantor_id: guarantor,
      payment_method_id: paymnetMethod,
      payout_method_id: payoutMethod,
    };
    const postData = { ...memberDetail, ...newData };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        `members/update/user/${user.userid}`,
        postData,
        1,
      )
        .then((data) => {
          setSaving(false);
          updateVaues(data);

          Assist.showMessage(
            "You have successfully updated your profile!",
            "success",
          );

          //put audit action
          Assist.auditAction(
            user.userid,
            user.sub,
            user.jti,
            pageConfig.Title,
            null,
            "Updated",
            memberDetail,
            data,
          );
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
        title={pageConfig.Title}
        section={"Configuration"}
        icon={"gear"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={5}>
          {memberDetail != null && <MemberDetail member={memberDetail} />}
        </Col>
        <Col sz={12} sm={12} lg={7}>
          {memberDetail != null && (
            <Card title="Payment Methods & Guarantor" showHeader={true}>
              <form id="formMain" onSubmit={onFormSubmit}>
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Guarantors</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Guarantor</div>
                      <SelectBox
                        className="dx-field-value"
                        placeholder="Guarantor"
                        dataSource={guarantors}
                        valueExpr={"id"}
                        displayExpr={"guar_fname"}
                        itemTemplate={(twn) =>
                          `${twn.guar_fname} - ${twn.guar_lname}`
                        }
                        onValueChange={(value) => setGuarantor(value)}
                        validationMessagePosition="left"
                        value={guarantor}
                        disabled={error || saving}
                      >
                        <Validator>
                          <RequiredRule message="Guarantor is required" />
                        </Validator>
                      </SelectBox>
                    </div>
                  </div>
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Payment Methods</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Payment Method</div>
                      <SelectBox
                        className="dx-field-value"
                        placeholder="Payment Method"
                        dataSource={paymnetMethods}
                        valueExpr={"id"}
                        displayExpr={"name"}
                        itemTemplate={(c) => `${c.name} - ${c.type}`}
                        onValueChange={(value) => setPaymentMethod(value)}
                        validationMessagePosition="left"
                        value={paymnetMethod}
                        disabled={error || saving}
                      >
                        <Validator>
                          <RequiredRule message="Payment method is required" />
                        </Validator>
                      </SelectBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Payout Method</div>
                      <SelectBox
                        className="dx-field-value"
                        placeholder="Payout Method"
                        dataSource={paymnetMethods}
                        valueExpr={"id"}
                        displayExpr={"name"}
                        itemTemplate={(c) => `${c.name} - ${c.type}`}
                        onValueChange={(value) => setPayouttMethod(value)}
                        validationMessagePosition="left"
                        value={payoutMethod}
                        disabled={error || saving}
                      >
                        <Validator>
                          <RequiredRule message="Payout method is required" />
                        </Validator>
                      </SelectBox>
                    </div>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label"></div>
                    <Button
                      width="100%"
                      type={saving ? "normal" : "default"}
                      disabled={loading || error || saving}
                      useSubmitBehavior={true}
                    >
                      <LoadIndicator
                        className="button-indicator"
                        visible={saving}
                      />
                      <span className="dx-button-text">Update Profile</span>
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
