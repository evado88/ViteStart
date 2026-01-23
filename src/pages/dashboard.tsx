import React, { useState, useEffect, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";

const MyDashboard = () => {
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

  const [statisticsData, setStatisticsData] = useState([]);
  const [announcementsData, setAnnouncementData] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [articlesData, setArticleData] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading data...");

  const pageConfig = new PageConfig(
    `Dashboard`,
    user.role == 2
      ? `transactions/summary/all`
      : `transactions/member-summary/${user.userid}`,
    "",
    "User",
    `transactions/year-to-date/all`,
  );

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
    );

    setLoading(true);

    setTimeout(() => {
      Assist.loadData("Dashboard", pageConfig.Url)
        .then((data: any) => {
          updateValues(data);
          setLoading(false);
        })
        .catch((message) => {
          setLoading(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);

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
    () => ({
      icon: "add",
      text: "New Monthly Posting",
      onClick: () => navigate("/my/monthly-posting/post"),
    }),
    [],
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
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Announcements"} showHeader={true}>
            <Card showHeader={false}>
              <DataGrid
                className={"dx-card wide-card"}
                dataSource={announcementsData}
                showColumnHeaders={false}
                keyExpr={"id"}
                noDataText={"No accouncements added yet"}
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
                      <a href={`/announcements/view/id/${e.data.id}`}>
                        {e.text}
                      </a>
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
            </Card>
          </Card>
        </Col>
        <Col sz={12} sm={12} lg={6}>
          <Card title={"Knowledgebase"} showHeader={true}>
            <Card showHeader={false}>
              <DataGrid
                className={"dx-card wide-card"}
                dataSource={articlesData}
                keyExpr={"id"}
                showColumnHeaders={false}
                noDataText={`No How To's added yet`}
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
                      <a href={`/knowledge-base/article/view/id/${e.data.id}`}>
                        {e.text}
                      </a>
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
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyDashboard;
