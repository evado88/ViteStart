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
import { usePeriod } from "../../context/PeriodContext.jsx";
import SelectBox from "devextreme-react/select-box.js";

const employees = [
  {
    id: 0,
    text: "Monthly Interest Sharing",
  },
  {
    id: 1,
    text: "Monthly Savings",
  },
  {
    id: 2,
    text: "Total Monthly Savings",
  },
  {
    id: 3,
    text: "Total Monthly Loan",
  },
  {
    id: 4,
    text: "Total Monthly Interest",
  },
  {
    id: 5,
    text: "Monthly Saving Loan Proportion",
  },
  {
    id: 6,
    text: "Monthly Interest Rates",
  },
];

const MemberInterestSharing = () => {
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
  const [data, setData] = useState<null | any>([]);
  const [savingsData, setSavingsData] = useState<null | any>([]);
  const [loansData, setLoansData] = useState<null | any>([]);
  const [interestData, setInterestData] = useState<null | any>([]);
  const [interestRatesData, setInterestRatesData] = useState<null | any>([]);
  const [savingProportionData, setSavingProportionData] = useState<null | any>(
    [],
  );

  const [loadingText, setLoadingText] = useState("Loading data...");

  const [selectedItem, setSelectedItem] = useState(employees[0]);

  const onSelectionChanged = useCallback(
    (args: any) => {
      console.log("args", args);
      setSelectedItem(args.selectedItem || args.addedItems[0]);

      //put audit action
      Assist.auditAction(
        user.userid,
        user.sub,
        user.jti,
        args.addedItems[0].text,
        null,
        "View",
        null,
        null,
        null,
      );
    },
    [setSelectedItem],
  );

  const pageConfig = new PageConfig(
    `Member Interest Sharing`,
    `transactions/summary/all`,
    "",
    "User",
    `transactions/interest-sharing/all`,
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

    const statisticUrl = `transactions/summary/${year}`;

    const url = `transactions/interest-sharing/${year}`;

    setLoading(true);

    setLoading(true);

    setTimeout(() => {
      Assist.loadData("Dashboard", statisticUrl)
        .then((data: any) => {
          Assist.loadData("Members", url)
            .then((memberData: any) => {
              setLoading(false);
              setData(memberData.members);
              setSavingsData([memberData.totals.t1]);
              setLoansData([memberData.totals.t3]);
              setInterestData([memberData.totals.t5]);
              setInterestRatesData([memberData.totals.r3]);
              setSavingProportionData([
                memberData.totals.r1,
                memberData.totals.r2,
              ]);
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
      selectedItem.text,
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
        title={selectedItem.text}
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
            title={"Interest"}
            value={Assist.formatCurrency(interest)}
            color={"orange"}
            percent={70}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Penalty"}
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
          <Tabs
            dataSource={employees}
            onSelectionChanged={onSelectionChanged}
            selectedItem={selectedItem}
          />

          {selectedItem.id == 0 && (
            <InterestSharingList
              data={data}
              loadingText={loadingText}
              title={selectedItem.text}
            />
          )}
          {selectedItem.id == 1 && (
            <MemberMonthlySavingsList
              data={data}
              loadingText={loadingText}
              title={selectedItem.text}
            />
          )}
          {selectedItem.id == 2 && (
            <MonthlyTotalList
              data={savingsData}
              loadingText={loadingText}
              title={selectedItem.text}
            />
          )}
          {selectedItem.id == 3 && (
            <MonthlyTotalList
              data={loansData}
              loadingText={loadingText}
              title={selectedItem.text}
            />
          )}
          {selectedItem.id == 4 && (
            <MonthlyTotalList
              data={interestData}
              loadingText={loadingText}
              title={selectedItem.text}
            />
          )}
          {selectedItem.id == 5 && (
            <MonthlyTotalList
              data={savingProportionData}
              loadingText={loadingText}
              title={selectedItem.text}
            />
          )}
          {selectedItem.id == 6 && (
            <MonthlyTotalList
              data={interestRatesData}
              loadingText={loadingText}
              title={selectedItem.text}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MemberInterestSharing;
