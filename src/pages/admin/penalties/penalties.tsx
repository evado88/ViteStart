import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";

import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { TransactionList } from "../../../components/transactionList";
import config from "devextreme/core/config";
import { usePeriod } from "../../../context/PeriodContext";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
import { Popup } from "devextreme-react/popup";
import { NumberBox } from "devextreme-react/number-box";
import TextArea from "devextreme-react/text-area";
import Button from "devextreme-react/button";
import { Validator, RequiredRule, RangeRule } from "devextreme-react/validator";
import ValidationSummary from "devextreme-react/validation-summary";

const AdminPenalties = () => {
  const { periodYear, UpdatePeriodYear, periodYearData } = usePeriod();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  //post a penalty against a member's account; it stays outstanding until
  //the member pays it with their next monthly posting
  const [showPost, setShowPost] = useState(false);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [penaltyTypes, setPenaltyTypes] = useState<any[]>([]);
  const [penaltyUser, setPenaltyUser] = useState<number | null>(null);
  const [penaltyType, setPenaltyType] = useState<number | null>(null);
  const [penaltyAmount, setPenaltyAmount] = useState<number | null>(null);
  const [penaltyComments, setPenaltyComments] = useState("");

  const pageConfig = new PageConfig(
    "Administration - Approved Penalties",
    `transactions/type/${Assist.TRANSACTION_PENALTY_CHARGED}/status/${Assist.STATUS_APPROVED}`,
    "",
    "Penalty",
    "",
    [Assist.ROLE_ADMIN],
  );

  const loadData = (year: number) => {
    setLoading(true);

    //put audit action
    Assist.auditAction(
      user.userid,
      user.sub,
      user.jti,
      pageConfig.Title,
      null,
      `View - ${year}`,
      null,
      null,
      null,
    );

    const url = `transactions/type/${Assist.TRANSACTION_PENALTY_CHARGED}/status/${Assist.STATUS_APPROVED}/year/${year}`;

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, url)
        .then((data: any) => {
          setData(data);
          setLoading(false);

          if (data.length === 0) {
            setLoadingText(`There are no penalties for the ${year} period`);
          } else {
            setLoadingText("");
          }
        })
        .catch((ex) => {
          Assist.showMessage(ex.Message, "error");
          setLoadingText("Could not show information");
        });
    }, Assist.DEV_DELAY);
  };

  useEffect(() => {
    //check if initialized
    if (hasRun.current) return;
    hasRun.current = true;

    //check permissions and audit
    if (
      !Assist.checkPageAuditPermission(pageConfig, user, `View - ${periodYear}`)
    ) {
      Assist.redirectUnauthorized(navigate);
      return;
    }

    loadData(periodYear);
  }, []);

  const changePostingYearPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      console.log("period year changed", e);
      UpdatePeriodYear(e.value);
      loadData(e.value);
    },
    [],
  );

  const periodYearFilterComponent = () => {
    return (
      <SelectBox
        dataSource={periodYearData}
        value={periodYear}
        onValueChanged={changePostingYearPeriod}
      />
    );
  };

  const openPostPenalty = () => {
    setPenaltyUser(null);
    setPenaltyType(null);
    setPenaltyAmount(null);
    setPenaltyComments("");
    setShowPost(true);

    if (members.length === 0) {
      Promise.all([
        Assist.loadData("Members", `members/status/${Assist.STATUS_APPROVED}`),
        Assist.loadData("Penalty Types", "penalty-types/"),
      ])
        .then(([memberData, typeData]: any[]) => {
          setMembers(
            memberData
              .filter((m: any) => m.user_id != null)
              .map((m: any) => ({
                id: m.user_id,
                name: `${m.fname} ${m.lname} (${m.email})`,
              })),
          );
          setPenaltyTypes(typeData);
        })
        .catch((message) => Assist.showMessage(message, "error"));
    }
  };

  const onPostPenalty = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    Assist.postPutData(
      "Penalty",
      "transactions/penalty",
      {
        user_id: penaltyUser,
        penalty_type_id: penaltyType,
        amount: penaltyAmount,
        comments: penaltyComments,
      },
      0,
    )
      .then(() => {
        setSaving(false);
        setShowPost(false);
        Assist.showMessage(
          "The penalty has been posted to the member's account",
          "success",
        );
        loadData(periodYear);
      })
      .catch((message) => {
        setSaving(false);
        Assist.showMessage(message, "error");
      });
  };

  const addButtonOptions = useMemo(
    () => ({
      icon: "add",
      text: "Post Penalty",
      onClick: () => openPostPenalty(),
    }),
    [members],
  );

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={pageConfig.Title}
        section={"My"}
        icon={"home"}
        url="/"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <TransactionList
            data={data}
            loadingText={loadingText}
            addButtonOptions={addButtonOptions}
            isLoan={false}
            isPenalty={true}
            title={pageConfig.Title}
            filterComponent={periodYearFilterComponent()}
          />
        </Col>
      </Row>
      <Popup
        visible={showPost}
        onHiding={() => setShowPost(false)}
        title="Post Penalty"
        showCloseButton={true}
        width={560}
        height="auto"
        maxWidth="95vw"
      >
        <form onSubmit={onPostPenalty}>
          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-label">Member</div>
              <SelectBox
                className="dx-field-value"
                dataSource={members}
                valueExpr="id"
                displayExpr="name"
                searchEnabled={true}
                placeholder="Member"
                value={penaltyUser}
                onValueChange={(value) => setPenaltyUser(value)}
              >
                <Validator>
                  <RequiredRule message="Member is required" />
                </Validator>
              </SelectBox>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Penalty Type</div>
              <SelectBox
                className="dx-field-value"
                dataSource={penaltyTypes}
                valueExpr="id"
                displayExpr="type_name"
                placeholder="Penalty Type"
                value={penaltyType}
                onValueChange={(value) => setPenaltyType(value)}
              >
                <Validator>
                  <RequiredRule message="Penalty type is required" />
                </Validator>
              </SelectBox>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Amount ZMW</div>
              <NumberBox
                className="dx-field-value"
                placeholder="Amount"
                value={penaltyAmount!}
                onValueChange={(value) => setPenaltyAmount(value)}
              >
                <Validator>
                  <RequiredRule message="Amount is required" />
                  <RangeRule min={1} message="Amount must be more than zero" />
                </Validator>
              </NumberBox>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Comments</div>
              <TextArea
                className="dx-field-value"
                height={70}
                value={penaltyComments}
                onValueChange={(value) => setPenaltyComments(value)}
              />
            </div>
            <ValidationSummary />
            <Button
              width="100%"
              type="success"
              text="Post Penalty"
              disabled={saving}
              useSubmitBehavior={true}
            />
          </div>
        </form>
      </Popup>
    </div>
  );
};

export default AdminPenalties;
