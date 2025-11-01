import { useState, useEffect, useCallback } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { MonthlyPostingsList } from "../../../components/monthlyPostingList";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";

const AdminMonthlyApprovedPostings = () => {
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(() => Assist.STATUS_APPROVED);
  const [period, setPeriod] = useState(() => {
    const periodDate = new Date();
    const periodId = `${periodDate.getFullYear()}${periodDate.getMonth() + 1}`;
    return periodId;
  });
  const [periodData, setPeriodData] = useState<any | null>(() => {
    const items: { text: string; value: string }[] = [];
    const years = [2025, 2026];

    years.forEach((year) => {
      for (let i = 1; i <= 12; i++) {
        items.push({
          text: `${Assist.getMonthName(i)} ${year}`,
          value: `${year}${i}`,
        });
      }
    });

    return items;
  });

  const pageConfig = new PageConfig(
    "Approved Monthly Postings",
    ``,
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
    loadData(`monthly-posting/period/${period}/status/${status}`);
  }, []);

  const changePostingPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
       loadData(`monthly-posting/period/${e.value}/status/${status}`);
    },
    []
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
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminMonthlyApprovedPostings;
