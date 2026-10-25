import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Ticker } from "../components/ticker.jsx";
import { Titlebar } from "../components/titlebar.js";
import { Card } from "../components/card.js";
import { Row } from "../components/row.jsx";
import { Col } from "../components/column.js";
import { NotificationList } from "../components/notificationList.jsx";
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Label,
  Format,
  Legend,
  Export,
} from "devextreme-react/chart";
import { grossProductData } from "./data.js";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../context/AuthContext.jsx";
import PageConfig from "../classes/page-config.js";
import Assist from "../classes/assist.js";
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
import { Link, useNavigate } from "react-router-dom";
import { usePeriod } from "../context/PeriodContext.jsx";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";

const MyDashboard = () => {
  //user
  const {
    periodYear,
    UpdatePeriodYear,
    periodYearData,
  } = usePeriod();

  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user.role == 2;
  const [sharesOsawe, setSharesOsawe] = useState(0);
  const [social, setSocial] = useState(0);
  const [share, setShare] = useState(0);
  const [interest, setInterest] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);

  const [loading, setLoading] = useState(false);

  const [statisticsData, setStatisticsData] = useState([]);
  const [announcementsData, setAnnouncementData] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [articlesData, setArticleData] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(user.role == 2 ? `Group Dashboard` : `My Dashboard`, "", "", "User", ``);

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

    const url =
      user.role == 2
        ? `transactions/summary/${year}`
        : `transactions/member-summary/${user.userid}/${year}`;

    setTimeout(() => {
      Assist.loadData("Dashboard", url)
        .then((data: any) => {
          updateValues(data);
          setLoading(false);
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
    //put audit action
    Assist.auditAction(
      user.userid,
      user.sub,
      user.jti,
      pageConfig.Title,
      null,
      `View - ${periodYear}`,
      null,
      null,
      null,
    );

    loadData(periodYear);

    setLoadingAnnouncements(true);
    setTimeout(() => {
      Assist.loadData("Annnocements", "announcements/recent")
        .then((data: any) => {
          setLoadingAnnouncements(false);
          setAnnouncementData(data);
        })
        .catch((message) => {
          setLoadingAnnouncements(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);

    setLoadingArticles(true);
    setTimeout(() => {
      Assist.loadData("How tos", "knowledge-base-articles/recent")
        .then((data: any) => {
          setLoadingArticles(false);
          setArticleData(data);
        })
        .catch((message) => {
          setLoadingArticles(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  const updateValues = (data: any) => {
    const savingItem = data.find(
      (item: any) => item.id == Assist.TRANSACTION_SAVINGS,
    );

    setSharesOsawe(savingItem.amount);

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

    // loan balance = loans + interest charged - (loan payments + interest paid)
    const amountOf = (typeId: number) =>
      Number(data.find((item: any) => item.id == typeId)?.amount ?? 0);

    setLoanBalance(
      amountOf(Assist.TRANSACTION_LOAN) +
        amountOf(Assist.TRANSACTION_INTEREST_CHARGED) -
        amountOf(Assist.TRANSACTION_LOAN_PAYMENT) -
        amountOf(Assist.TRANSACTION_INTEREST_PAID),
    );

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
        title={`${user.name} - ${pageConfig.Title}`}
        section={"Home"}
        icon={"home"}
        url={""}
      ></Titlebar>
      {/* start widget */}
      <Row>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Shares (Osawe)"}
            value={Assist.formatCurrency(sharesOsawe)}
            color={"green"}
            icon={"fa fa-life-saver"}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={isAdmin ? "Loans Outstanding" : "Loan Balance"}
            value={Assist.formatCurrency(loanBalance)}
            color={"red"}
            icon={"fa fa-credit-card"}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={isAdmin ? "Interest Earned" : "Interest Charged"}
            value={Assist.formatCurrency(interest)}
            color={"orange"}
            icon={"fa fa-percent"}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Penalties"}
            value={Assist.formatCurrency(penalty)}
            color={"red"}
            icon={"fa fa-exclamation-circle"}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Shares (Osacco)"}
            value={Assist.formatCurrency(share)}
            color={"blue"}
            icon={"fa fa-money"}
          ></Ticker>
        </Col>
        <Col xl={2} lg={2}>
          <Ticker
            title={"Social Fund"}
            value={Assist.formatCurrency(social)}
            color={"green"}
            icon={"fa fa-users"}
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
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Announcements"} showHeader={true}>
            <DataGrid
              className={"dx-card wide-card"}
              dataSource={announcementsData}
              showColumnHeaders={false}
              keyExpr={"id"}
              noDataText={"No announcements yet"}
              showBorders={false}
              focusedRowEnabled={false}
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
              <Column
                dataField="id"
                caption="ID"
                hidingPriority={3}
                visible={false}
              ></Column>
              <Column
                dataField="title"
                caption="Title"
                hidingPriority={2}
                cellRender={(e) => {
                  return (
                    <Link to={`/announcements/view/id/${e.data.id}`}>{e.text}</Link>
                  );
                }}
              ></Column>
              <Column
                dataField="created_at"
                caption="Date"
                dataType="date"
                format={"dd MMMM yyy HH:mm"}
                hidingPriority={1}
              ></Column>
            </DataGrid>
            <p className="mt-3 mb-0">
              <Link to="/announcements">View all announcements</Link>
            </p>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Knowledge Base"} showHeader={true}>
            <DataGrid
              className={"dx-card wide-card"}
              dataSource={articlesData}
              keyExpr={"id"}
              showColumnHeaders={false}
              noDataText={`No knowledge base articles yet`}
              showBorders={false}
              focusedRowEnabled={false}
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

              <Column
                dataField="id"
                caption="ID"
                hidingPriority={3}
                visible={false}
              ></Column>
              <Column
                dataField="title"
                caption="Title"
                hidingPriority={2}
                cellRender={(e) => {
                  return (
                    <Link to={`/knowledge-base/article/view/id/${e.data.id}`}>
                      {e.text}
                    </Link>
                  );
                }}
              ></Column>
              <Column
                dataField="created_at"
                caption="Date"
                dataType="date"
                format={"dd MMMM yyy HH:mm"}
                hidingPriority={1}
              ></Column>
            </DataGrid>
            <p className="mt-3 mb-0">
              <Link to="/knowledge-base">View all articles</Link>
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyDashboard;
