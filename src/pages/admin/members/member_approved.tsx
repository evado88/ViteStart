import { useState, useEffect, useRef } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import Assist from "../../../classes/assist";
import PageConfig from "../../../classes/page-config";
import { MemberList } from "../../../components/memberList";

const AdminMembersApproved = () => {
  const [data, setData] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading data...");
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Approved Members",
    `members/status/${Assist.STATUS_APPROVED}`,
    "",
    "Member",
    "",
    [Assist.ROLE_ADMIN],
  );

  useEffect(() => {
    setLoading(true);

    Assist.loadData(pageConfig.Title, pageConfig.Url)
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
  }, []);

  return (
    <div className="page-content" style={{ minHeight: "862px" }}>
      <Titlebar
        title={pageConfig.Title}
        section={"Administration"}
        icon={"home"}
        url="/"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={12}>
          <MemberList data={data} loadingText={loadingText} title="Member" />
        </Col>
      </Row>
    </div>
  );
};

export default AdminMembersApproved;
