import { useState, useEffect, useCallback } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { MonthlyPostingsList } from "../../../components/monthlyPostingList";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
import { usePeriod } from "../../../context/PeriodContext";
import { MonthlyPostingsListDDAC } from "../../../components/monthlyPostingListDDAC";
import { useNavigate, useParams } from "react-router-dom";

const AdminMonthlyApprovedPostings = () => {
  const { eId } = useParams(); // Destructure the parameter directly

  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(() => Assist.STATUS_APPROVED);

  const pageConfig = new PageConfig(
    "Monthly Postings - DDAC Report",
    ``,
    "",
    "Monthly Posting",
    ""
  );

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
    loadData(`posting-periods/ddac/${eId}`);
  }, []);

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
          <MonthlyPostingsListDDAC
            data={data}
            loadingText={loadingText}
            isMember={false}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminMonthlyApprovedPostings;
