import { useState, useEffect, useMemo } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";

import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { TransactionList } from "../../../components/transactionList";

const MonthlyPostings = () => {
  const { statusId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);


  const pageConfig = new PageConfig(
    "All Expense & Earnings",
    `transactions/expense-earnings/list`,
    "",
    "Expense & Earning",
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
            setLoadingText("There are no expenses and earnings");
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
      text: "Add Expense / Earning",
      onClick: () => navigate("/admin/expenses-earnings/add"),
    }),
    []
  );

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
          <TransactionList
            data={data}
            loadingText={loadingText}
            addButtonOptions={addButtonOptions}
            isLoan={false}
            isPenalty={false}
            isExpenseEarning={true}
            title={pageConfig.Title}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MonthlyPostings;
