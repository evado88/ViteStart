import { useState, useEffect, useMemo, useCallback } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  ColumnChooser,
  Editing,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";

import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { useNavigate } from "react-router-dom";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
import { usePeriod } from "../../../context/PeriodContext";
import { PostingPeriodingsList } from "../../../components/postingPeriodsList";

const AdminPostingPeriods = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const {
    periodYear,
    periodMonth,
    UpdatePeriodYear,
    UpdatePeriodMonth,
    periodYearData,
    periodMonthData,
  } = usePeriod();
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);

  const pageConfig = new PageConfig("All Posting Periods", "", "", "", "");

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
    loadData(
      `posting-periods/year/${periodYear}/month/${periodMonth}/status/0`
    );
  }, [periodYear, periodMonth]);

  const changePostingYearPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      console.log("period year changed", e);
      UpdatePeriodYear(e.value);
    },
    []
  );

  const changePostingMonthPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      console.log("period month changed", e);
      UpdatePeriodMonth(e.value);
    },
    []
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
  const periodMonthFilterComponent = () => {
    return (
      <SelectBox
        dataSource={periodMonthData}
        displayExpr={"text"}
        valueExpr={"value"}
        value={periodMonth}
        onValueChanged={changePostingMonthPeriod}
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
          <PostingPeriodingsList
            data={data}
            loadingText={loadingText}
            filterYearComponent={periodYearFilterComponent()}
            filterMonthComponent={periodMonthFilterComponent()}
            isMember={false}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminPostingPeriods;
