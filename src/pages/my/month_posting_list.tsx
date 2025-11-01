import { useState, useEffect, useMemo, useCallback } from "react";
import { Titlebar } from "../../components/titlebar";
import { Row } from "../../components/row";
import { Col } from "../../components/column";

import Assist from "../../classes/assist";
import PageConfig from "../../classes/page-config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MonthlyPostingsList } from "../../components/monthlyPostingList";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";

const MonthlyPostings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        items.push({ text: `${Assist.getMonthName(i)} ${year}`, value: `${year}${i}` });
      }
    });

    return items;
  });
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);

  const pageConfig = new PageConfig(
    "Monthly Postings",
    `monthly-posting/user/${user.userid}`,
    "",
    "Monthly Posting",
    ""
  );

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((data: any) => {
          setData(data);
          setLoading(false);

          if (data.length === 0) {
            setLoadingText("You have no monthly posts");
          } else {
            setLoadingText("");
          }
        })
        .catch((ex) => {
          Assist.showMessage(ex.Message, "error");
          setLoadingText("Could not show information");
        });
    }, Assist.DEV_DELAY);
  }, []);

  const addButtonOptions = useMemo(
    () => ({
      icon: "add",
      text: "New Monthly Posting",
      onClick: () => navigate("/my/monthly-posting/post"),
    }),
    []
  );


  const changePostingPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      const newGrouping = e.value;
      console.log("toggle", e);
    },
    []
  );

  const periodFilterComponent = () => {
    return (
      <SelectBox
        width="225"
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
        section={"My"}
        icon={"home"}
        url="/"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <MonthlyPostingsList
            data={data}
            loadingText={loadingText}
            addButtonOptions={addButtonOptions}
            filterComponent={periodFilterComponent()}
            isMember={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MonthlyPostings;
