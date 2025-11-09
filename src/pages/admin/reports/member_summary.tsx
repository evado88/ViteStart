import React, { useState, useEffect, useMemo } from "react";
import { Ticker } from "../../../components/ticker.jsx";
import { Titlebar } from "../../../components/titlebar.js";
import { Card } from "../../../components/card.js";
import { Row } from "../../../components/row.jsx";
import { Col } from "../../../components/column.js";
import { NotificationList } from "../../../components/notificationList.jsx";
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
import { useAuth } from "../../../context/AuthContext.jsx";
import PageConfig from "../../../classes/page-config.js";
import Assist from "../../../classes/assist.js";
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

const MemberSummary = () => {
  //user
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
    `Dashboard`,
    user.role == 2
      ? `transactions/summary/all`
      : `transactions/member-summary/${user.userid}`,
    "",
    "User",
    `transactions/year-to-date/all`
  );

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      Assist.loadData("Dashboard", pageConfig.Url)
        .then((data: any) => {
          Assist.loadData("Members", pageConfig.updateUrl)
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
  }, []);

  const updateValues = (data: any) => {
    const savingItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_SAVINGS
    );

    setSavings(savingItem.amount);

    const socialItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_SOCIAL_FUND
    );

    setSocial(socialItem.amount);

    const interestItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_INTEREST_CHARGED
    );

    const shareItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_SHARE
    );

    setShare(shareItem.amount);

    setInterest(interestItem.amount);

    const loanItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_LOAN
    );

    setLoan(loanItem.amount);

    const penaltyItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_PENALTY_CHARGED
    );

    setPenalty(penaltyItem.amount);
  };

  const addButtonOptions = useMemo(
    () => ({
      icon: "add",
      text: "New Monthly Posting",
      onClick: () => navigate("/my/monthly-posting/post"),
    }),
    []
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
        section={"Home"}
        icon={"home"}
        url={""}
      ></Titlebar>
      {/* start widget */}
      <Row>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Savings"}
            value={savings}
            color={"green"}
            percent={80}
          ></Ticker>
        </Col>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Loans"}
            value={loan}
            color={"red"}
            percent={40}
          ></Ticker>
        </Col>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Interest Charged"}
            value={interest}
            color={"orange"}
            percent={70}
          ></Ticker>
        </Col>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Interest Paid"}
            value={interest}
            color={"orange"}
            percent={70}
          ></Ticker>
        </Col>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Penalty Charged"}
            value={penalty}
            color={"red"}
            percent={90}
          ></Ticker>
        </Col>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Penalty Paid"}
            value={penalty}
            color={"red"}
            percent={90}
          ></Ticker>
        </Col>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Share"}
            value={share}
            color={"blue"}
            percent={90}
          ></Ticker>
        </Col>
        <Col xl={3} lg={3}>
          <Ticker
            title={"Social"}
            value={social}
            color={"green"}
            percent={90}
          ></Ticker>
        </Col>
      </Row>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <Card title={"Members"} showHeader={false}>
            <Card showHeader={false}>
              <DataGrid
                className={"dx-card wide-card"}
                dataSource={data}
                keyExpr={"id"}
                noDataText={loadingText}
                showBorders={false}
                focusedRowEnabled={true}
                defaultFocusedRowIndex={0}
                columnAutoWidth={true}
                columnHidingEnabled={true}
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
                </Toolbar>
                <Column
                  dataField="id"
                  caption="ID"
                  hidingPriority={13}
                ></Column>
                <Column
                  dataField="fname"
                  caption="First Name"
                  hidingPriority={12}
                ></Column>
                <Column
                  dataField="lname"
                  caption="Last name"
                  hidingPriority={11}
                ></Column>
                <Column
                  dataField="email"
                  caption="Email"
                  visible={false}
                  hidingPriority={11}
                ></Column>
                <Column
                  dataField="phone"
                  caption="Phone"
                  visible={false}
                  hidingPriority={11}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_SAVINGS}`}
                  caption="Savings"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_SHARE}`}
                  caption="Shares"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_LOAN}`}
                  caption="Loans"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_LOAN_PAYMENT}`}
                  caption="Loan Payment"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_INTEREST_CHARGED}`}
                  caption="Interest Charged"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_INTEREST_PAID}`}
                  caption="Interest Paid"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_SOCIAL_FUND}`}
                  caption="Social Fund"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_PENALTY_CHARGED}`}
                  caption="Penalty Charged"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
                <Column
                  dataField={`tid${Assist.TRANSACTION_PENALTY_PAID}`}
                  caption="Penalty Paid"
                  format={",##0.###"}
                  hidingPriority={10}
                ></Column>
              </DataGrid>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MemberSummary;
