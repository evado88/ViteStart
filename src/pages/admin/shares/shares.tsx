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
import { usePeriod } from "../../../context/PeriodContext";
import { SelectBox } from "devextreme-react";
import { SelectBoxTypes } from "devextreme-react/select-box";

const AdminShares = () => {
  const { periodYear, UpdatePeriodYear, periodYearData } = usePeriod();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Administration - Approved Shares",
    `transactions/type/${Assist.TRANSACTION_SHARE}/status/${Assist.STATUS_APPROVED}`,
    "",
    "Share",
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

    const url = `transactions/type/${Assist.TRANSACTION_SHARE}/status/${Assist.STATUS_APPROVED}/year/${year}`;

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, url)
        .then((data: any) => {
          setData(data);
          setLoading(false);

          if (data.length === 0) {
            setLoadingText(`There are no shares for the ${year} period`);
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

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <TransactionList
            data={data}
            loadingText={loadingText}
            addButtonOptions={addButtonOptions}
            isLoan={false}
            isPenalty={false}
            title={pageConfig.Title}
            filterComponent={periodYearFilterComponent()}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminShares;
