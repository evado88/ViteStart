import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  TotalItem,
  Summary,
} from "devextreme-react/data-grid";
import { useNavigate } from "react-router-dom";
import Tabs from "devextreme-react/tabs";
import { InterestSharingList } from "../../components/interestSharingList.js";
import { MonthlyTotalList } from "../../components/monthlyTotalList.js";
import { MemberMonthlySavingsList } from "../../components/memberMonthlySavingsList.js";
import { MemberTimeValueList } from "../../components/memberTimeValueList.js";
import config from "devextreme/core/config.js";
import { usePeriod } from "../../context/PeriodContext.jsx";
import SelectBox from "devextreme-react/select-box.js";

const MemberTimeValueSummary = () => {
  //user
  const { periodYear, UpdatePeriodYear, periodYearData } = usePeriod();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [savingsTotal, setSavingsTotal] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);
  const [proportionalFinalShare, setProportionalFinalShare] = useState(0);
  const [payoutBalance, setPayoutBalance] = useState(0);
  const [growthAmount, setGrowthAmount] = useState(0);
  const [growthPercent, setGrowthPercent] = useState(0);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | any>([]);
  const [savingsData, setSavingsData] = useState<null | any>([]);
  const [loansData, setLoansData] = useState<null | any>([]);
  const [interestData, setInterestData] = useState<null | any>([]);
  const [interestRatesData, setInterestRatesData] = useState<null | any>([]);
  const [savingProportionData, setSavingProportionData] = useState<null | any>(
    [],
  );

  const [loadingText, setLoadingText] = useState("Loading data...");

  const pageConfig = new PageConfig(
    `Member Time Value Summary`,
    `transactions/interest-sharing/all`,
    "",
    "User",
    ``,
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

    const url = `transactions/interest-sharing/${year}`;

    setLoading(true);


    setTimeout(() => {
      Assist.loadData("Members", url)
        .then((memberData: any) => {
          setLoading(false);
          setData(memberData.members);
          setSavingsData([memberData.totals.t1]);
          setLoansData([memberData.totals.t3]);
          setInterestData([memberData.totals.t5]);
          setInterestRatesData([memberData.totals.r3]);
          setSavingProportionData([memberData.totals.r1, memberData.totals.r2]);
          updateValues(memberData);
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
    setSavingsTotal(data.totals.group_share_total);
    setLoanBalance(data.totals.total_loan_balance);
    setProportionalFinalShare(data.totals.group_proportional_final_share);
    setPayoutBalance(data.totals.group_payout_balance);
    setGrowthAmount(data.totals.group_money_growth_total);
    setGrowthPercent(data.totals.group_money_growth_percent);
  };

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
            value={Assist.formatCurrency(savingsTotal)}
            color={"green"}
            percent={80}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Loan Balance"}
            value={Assist.formatCurrency(loanBalance)}
            color={"red"}
            percent={40}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Proportional Share"}
            value={Assist.formatCurrency(proportionalFinalShare)}
            color={"orange"}
            percent={70}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Payout Balance"}
            value={Assist.formatCurrency(payoutBalance)}
            color={"red"}
            percent={90}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Growth Amount"}
            value={Assist.formatCurrency(growthAmount)}
            color={"blue"}
            percent={90}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Growth Percent (%)"}
            value={growthPercent}
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
          <MemberTimeValueList
            data={data}
            loadingText={loadingText}
            title={pageConfig.Title}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MemberTimeValueSummary;
