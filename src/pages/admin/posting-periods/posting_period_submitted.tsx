import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
  const { period, periodData, updateSelectedPeriod } = usePeriod();
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig("Submitted Posting Periods", "", "", "", "",
    [Assist.ROLE_ADMIN],);

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
    loadData(`posting-periods/current/${period}/status/${Assist.STATUS_SUBMITTED}`);
  }, []);

  const changePostingPeriod = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent) => {
      updateSelectedPeriod(e.value);
      loadData(`posting-periods/current/${e.value}`);
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
          <PostingPeriodingsList
            data={data}
            loadingText={loadingText}
            isMember={false}
            
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminPostingPeriods;
