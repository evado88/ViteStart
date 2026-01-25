import React, { useState, useEffect, useMemo } from "react";
import { Ticker } from "../../components/ticker.jsx";
import { Titlebar } from "../../components/titlebar.js";
import { Card } from "../../components/card.js";
import { Row } from "../../components/row.jsx";
import { Col } from "../../components/column.js";
import { NotificationList } from "../../components/notificationList.jsx";
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Label,
  Format,
  Legend,
  Export,
} from "devextreme-react/chart";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../context/AuthContext.jsx";
import PageConfig from "../../classes/page-config.js";
import Assist from "../../classes/assist.js";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  ColumnChooser,
  Editing,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import { useNavigate } from "react-router-dom";
import {
  PivotGrid,
  type PivotGridTypes,
  Scrolling,
} from "devextreme-react/pivot-grid";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { usePeriod } from "../../context/PeriodContext.jsx";
import SelectBox from "devextreme-react/select-box.js";

const MonthlySummary = () => {
  //user
  const { periodYear, UpdatePeriodYear, periodYearData } = usePeriod();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savings, setSavings] = useState(0);
  const [social, setSocial] = useState(0);
  const [share, setShare] = useState(0);
  const [interest, setInterest] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [loan, setLoan] = useState(0);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");

  const pageConfig = new PageConfig(
    user.role == 2 ? `Monthly Group Summary` : `Monthly Member Summary`,
    user.role == 2
      ? `transactions/summary/all`
      : `transactions/member-summary/${user.userid}`,
    "",
    "User",
    `transactions/transaction-summary/$all`,
  );

  const loadData = (year: number) => {
    const statisticUrl =
      user.role == 2
        ? `transactions/summary/${year}`
        : `transactions/member-summary/${user.userid}/${year}`;

    const url = `transactions/transaction-summary/${year}`;

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
      Assist.loadData("Dashboard", statisticUrl)
        .then((data: any) => {
          Assist.loadData("Members", url)
            .then((memberData: any) => {
              setLoading(false);
              setData(memberData);
              updateValues(data);
            })
            .catch((message) => {
              setLoading(false);
              Assist.showMessage(message, "error");
            });
        })
        .catch((message) => {
          setLoading(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };

  useEffect(() => {
    //put audit action
    Assist.auditAction(
      user.userid,
      user.sub,
      user.jti,
      pageConfig.Title,
      null,
      "View",
      null,
      null,
      null,
    );

    loadData(periodYear);
  }, []);

  const updateValues = (data: any) => {
    const savingItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_SAVINGS,
    );

    setSavings(savingItem.amount);

    const socialItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_SOCIAL_FUND,
    );

    setSocial(socialItem.amount);

    const interestItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_INTEREST_CHARGED,
    );

    const shareItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_SHARE,
    );

    setShare(shareItem.amount);

    setInterest(interestItem.amount);

    const loanItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_LOAN,
    );

    setLoan(loanItem.amount);

    const penaltyItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_PENALTY_CHARGED,
    );

    setPenalty(penaltyItem.amount);
  };

  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: "Member",
        width: 120,
        dataField: "name",
        area: "row",
      },
      {
        caption: "Type",
        dataField: "type",
        width: 150,
        area: "row",
      },
      {
        dataField: "period",
        dataType: "date",
        area: "column",
        groupInterval: "month",
      },
      {
        caption: "Amount",
        dataField: "amount",
        dataType: "number",
        summaryType: "sum",
        format: ",##0.###",
        area: "data",
      },
    ],
    store: data,
  });

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <LoadPanel
        shadingColor="rgba(248, 242, 242, 0.9)"
        position={{ of: "#pageRoot" }}
        visible={loading}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />
      <Titlebar
        title={pageConfig.Title}
        section={"Home"}
        icon={"home"}
        url={""}
      ></Titlebar>
      {/* start widget */}
      <Row>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Savings"}
            value={Assist.formatCurrency(savings)}
            color={"green"}
            percent={80}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Loans"}
            value={Assist.formatCurrency(loan)}
            color={"red"}
            percent={40}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Interest Charged"}
            value={Assist.formatCurrency(interest)}
            color={"orange"}
            percent={70}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Penalty Charged"}
            value={Assist.formatCurrency(penalty)}
            color={"red"}
            percent={90}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Share"}
            value={Assist.formatCurrency(share)}
            color={"blue"}
            percent={90}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Social"}
            value={Assist.formatCurrency(social)}
            color={"green"}
            percent={90}
          ></Ticker>
        </Col>
      </Row>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card title={"Knowledgebase"} showHeader={false}>
            <Row>
              <Col sz={12} sm={12} lg={2}>
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-field">
                      <div className="dx-field-label">Period</div>
                      <SelectBox
                        className="dx-field-value"
                        placeholder="Meeting Attendance"
                        dataSource={periodYearData}
                        onValueChange={(value) => {
                          UpdatePeriodYear(value);
                          loadData(value);
                        }}
                        validationMessagePosition="left"
                        value={periodYear}
                      ></SelectBox>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={12}>
          <Card title={"Members"} showHeader={false}>
            <Card showHeader={false}>
              <PivotGrid
                allowSorting={true}
                allowSortingBySummary={true}
                allowFiltering={true}
                height={620}
                showBorders={true}
                rowHeaderLayout="tree"
                dataSource={dataSource}
              >
                <Scrolling mode="virtual" />
              </PivotGrid>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MonthlySummary;
