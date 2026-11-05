import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Titlebar } from "../../components/titlebar";
import { Row } from "../../components/row";
import { Col } from "../../components/column";

import Assist from "../../classes/assist";
import PageConfig from "../../classes/page-config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { TransactionList } from "../../components/transactionList";
import { LoanScheduleList } from "../../components/loanScheduleList";
import { usePeriod } from "../../context/PeriodContext";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";

//the open loan the import made from each member's spreadsheet balance: not new
//lending, so it is left out of the list, as on the administrators' page
const BALANCE_BF_REFERENCE = "BALANCE-BF";

//the same view as Administration - Approved Loans, for the member's own loans
const MyLoans = () => {
  const { periodYear, UpdatePeriodYear, periodYearData } = usePeriod();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "My Loans",
    `transactions/user/${user.userid}/type/${Assist.TRANSACTION_LOAN}/status/${Assist.STATUS_APPROVED}`,
    "",
    "My Loans",
    "",
    [Assist.ROLE_MEMBER],
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

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((rows: any) => {
          const loans = rows.filter(
            (row: any) =>
              new Date(row.date).getFullYear() === Number(year) &&
              row.reference !== BALANCE_BF_REFERENCE,
          );
          setData(loans);
          setLoading(false);

          if (loans.length === 0) {
            setLoadingText(`You have no loans for the ${year} period`);
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

  const addButtonOptions = useMemo(
    () => ({
      icon: "add",
      text: "New Monthly Posting",
      onClick: () => navigate("/my/monthly-posting/post"),
    }),
    [],
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

      <Row>
        <Col sz={12} sm={12} lg={12}>
          <TransactionList
            data={data}
            loadingText={loadingText}
            addButtonOptions={addButtonOptions}
            isLoan={true}
            isPenalty={false}
            title={pageConfig.Title}
            filterComponent={periodYearFilterComponent()}
          />
        </Col>
      </Row>
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <LoanScheduleList userId={user.userid} />
        </Col>
      </Row>
    </div>
  );
};

export default MyLoans;
