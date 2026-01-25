import { useState, useEffect, useCallback, useRef } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { MonthlyPostingsList } from "../../../components/monthlyPostingList";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
import { usePeriod } from "../../../context/PeriodContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminMonthlySubmittedPostings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState([]);
  const { period, periodData, updateSelectedPeriod } = usePeriod();
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(() => Assist.STATUS_SUBMITTED);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Submitted Monthly Postings",
    ``,
    "",
    "Monthly Posting",
    "",
    [Assist.ROLE_ADMIN],
  );

  const loadData = (url: string) => {
    setLoading(true);
    Assist.loadData(pageConfig.Title, url)
      .then((res: any) => {
        setData(res);
        setLoading(false);

        if (res.length === 0) {
          setLoadingText("No Data");
        } else {
          setLoadingText("");
        }
      })
      .catch((ex) => {
        Assist.showMessage(ex.Message, "error");
        setLoadingText("Could not show information");
      });
  };

  useEffect(() => {
    //check if initialized
    if (hasRun.current) return;
    hasRun.current = true;

    //check permissions and audit
    if (!Assist.checkPageAuditPermission(pageConfig, user)) {
      Assist.redirectUnauthorized(navigate);
      return;
    }

    loadData(`monthly-posting/period/${period}/status/${status}`);
  }, []);

  const changePostingPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      updateSelectedPeriod(e.value);
      loadData(`monthly-posting/period/${e.value}/status/${status}`);
    },
    [],
  );

  const periodFilterComponent = () => {
    return (
      <SelectBox
        dataSource={periodData}
        displayExpr="text"
        valueExpr="value"
        value={period}
        onValueChanged={changePostingPeriod}
      />
    );
  };

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={pageConfig.Title}
        section={"Administration"}
        icon={"cubes"}
        url="/"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <MonthlyPostingsList
            data={data}
            loadingText={loadingText}
            filterComponent={periodFilterComponent()}
            isMember={false}
            title="Monthly Postings"
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminMonthlySubmittedPostings;
