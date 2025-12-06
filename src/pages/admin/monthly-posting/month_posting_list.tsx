import { useState, useEffect, useCallback, useMemo } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";

import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { MonthlyPostingsList } from "../../../components/monthlyPostingList";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
import { usePeriod } from "../../../context/PeriodContext";
import { useNavigate } from "react-router-dom";

const AdminMonthlyPostings = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const {
    periodYear,
    periodMonth,
    UpdatePeriodYear,
    UpdatePeriodMonth,
    periodYearData,
    periodMonthData,
    periodId,
    periodData,
    UpdatePeriodId,
  } = usePeriod();
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);

  const pageConfig = new PageConfig(
    "All Monthly Postings",
    `monthly-posting/period/${periodId}`,
    "",
    "Monthly Posting",
    ""
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
    loadData(`monthly-posting/period/${periodId}`);
  }, []);

  const changePostingPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      UpdatePeriodId(e.value);
      loadData(`monthly-posting/period/${e.value}`);
    },
    []
  );

  const periodFilterComponent = () => {
    return (
      <SelectBox
        dataSource={periodData}
        displayExpr="text"
        valueExpr="value"
        value={periodId}
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
            title={pageConfig.Title}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminMonthlyPostings;
