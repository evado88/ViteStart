import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import { useNavigate } from "react-router-dom";
import { usePeriod } from "../../context/PeriodContext.jsx";
import SelectBox from "devextreme-react/select-box.js";

//columns with a total at the foot of the table
const TOTALLED = [
  Assist.TRANSACTION_SAVINGS,
  Assist.TRANSACTION_SHARE,
  Assist.TRANSACTION_LOAN,
  Assist.TRANSACTION_LOAN_PAYMENT,
  Assist.TRANSACTION_INTEREST_CHARGED,
  Assist.TRANSACTION_INTEREST_PAID,
  Assist.TRANSACTION_SOCIAL_FUND,
  Assist.TRANSACTION_PENALTY_CHARGED,
  Assist.TRANSACTION_PENALTY_PAID,
  Assist.TRANSACTION_MEMBERSHIP_FEE,
];

const MemberSummary = () => {
  const gridRef = useRef<any>(null);
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
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Member Summary",
    user.role == 2
      ? `transactions/summary/all`
      : `transactions/member-summary/${user.userid}`,
    "",
    "User",
    `transactions/year-to-date/all`,
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

    const statisticUrl =
      user.role == 2
        ? `transactions/summary/${year}`
        : `transactions/member-summary/${user.userid}/${year}`;

    const url = `transactions/year-to-date/${year}`;

    setLoading(true);

    setTimeout(() => {
      Assist.loadData("Dashboard", statisticUrl)
        .then((data: any) => {
          Assist.loadData("Members", url)
            .then((memberData: any) => {
              setLoading(false);
              setData(
                memberData.map((r: any) => ({ ...r, member: `${r.fname} ${r.lname}` })),
              );
              setLoadingText(`Nothing recorded for ${year}`);
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
    if (hasRun.current) return;
    hasRun.current = true;
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

  const addButtonOptions = useMemo(
    () =>
      user.role == Assist.ROLE_MEMBER
        ? {
            icon: "add",
            text: "New Monthly Posting",
            onClick: () => navigate("/my/monthly-posting/post"),
          }
        : { icon: "refresh", text: "Refresh", onClick: () => loadData(periodYear) },
    [periodYear],
  );

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
        section={"Reports"}
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
          <Card title={"Period"} showHeader={false}>
            <Row>
              <Col sz={12} sm={12} lg={2}>
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-field">
                      <div className="dx-field-label">Period</div>
                      <SelectBox
                        className="dx-field-value"
                        placeholder="Year"
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
              <DataGrid
                ref={gridRef}
                className={"dx-card wide-card"}
                dataSource={data}
                keyExpr={"id"}
                noDataText={loadingText}
                showBorders={false}
                focusedRowEnabled={true}
                defaultFocusedRowIndex={0}
                columnAutoWidth={true}
              >
                <Paging defaultPageSize={10} />
                <Editing
                  mode="row"
                  allowUpdating={false}
                  allowDeleting={false}
                  allowAdding={false}
                />
                <Pager showPageSizeSelector={true} showInfo={true} />
                <FilterRow visible={true} />
                <ColumnChooser enabled={true} mode="select"></ColumnChooser>
                <Toolbar>
                  <Item
                    location="before"
                    locateInMenu="auto"
                    showText="always"
                    widget="dxButton"
                    options={addButtonOptions}
                  />
                  <Item name="columnChooserButton" />
                  <Item
                    location="after"
                    locateInMenu="auto"
                    showText="always"
                    widget="dxButton"
                    options={{
                      icon: "save",
                      text: " Excel Export",
                      onClick: () =>
                        Assist.downloadExcel(
                          pageConfig.Title,
                          data,
                          gridRef.current?.instance.getVisibleColumns(),
                        ),
                    }}
                  />
                </Toolbar>
                <Column
                  caption="Member"
                  dataField="member"
                  fixed={true}
                  defaultSortOrder="asc"
                  minWidth={170}
                ></Column>
                <Column
                  dataField="email"
                  caption="Email"
                  visible={false}
                ></Column>
                <Column
                  dataField="phone"
                  caption="Phone"
                  visible={false}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_SAVINGS}`}
                  caption="Savings"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_SHARE}`}
                  caption="Shares"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_LOAN}`}
                  caption="Loans"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_LOAN_PAYMENT}`}
                  caption="Loan Payment"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_INTEREST_CHARGED}`}
                  caption="Interest Charged"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_INTEREST_PAID}`}
                  caption="Interest Paid"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_SOCIAL_FUND}`}
                  caption="Social Fund"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_PENALTY_CHARGED}`}
                  caption="Penalty Charged"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_PENALTY_PAID}`}
                  caption="Penalty Paid"
                  format={",##0.###"}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_MEMBERSHIP_FEE}`}
                  caption="Membership Fee"
                  format={",##0.###"}
                ></Column>
                <Summary>
                  <TotalItem column="member" displayFormat="{0} members" summaryType="count" />
                  {TOTALLED.map((id) => (
                    <TotalItem
                      key={id}
                      column={`tid${id}`}
                      summaryType="sum"
                      valueFormat={",##0.##"}
                      displayFormat="{0}"
                    />
                  ))}
                </Summary>
              </DataGrid>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MemberSummary;
