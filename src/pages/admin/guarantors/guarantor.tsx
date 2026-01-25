import { useState, useEffect, useMemo, useRef } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import { Validator, RequiredRule } from "devextreme-react/validator";
import Button from "devextreme-react/button";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../../context/AuthContext";
import PageConfig from "../../../classes/page-config";
import Assist from "../../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import HtmlEditor, { MediaResizing } from "devextreme-react/html-editor";
import AppInfo from "../../../classes/app-info";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { confirm } from "devextreme/ui/dialog";
import TextArea from "devextreme-react/text-area";
import ValidationSummary from "devextreme-react/validation-summary";
import { ArticleDetail } from "../../../components/articleDetail";
import { MemberQueryDetail } from "../../../components/memberQueryDetail";
import { PaymentMethodDetail } from "../../../components/paymentMethodDetail";
import { GuarantorDetail } from "../../../components/guarantorDetail";

const AdminGuarantor = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //posting
  const [queryDetail, setQueryDetail] = useState<null | any>(null);
  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stage, setStage] = useState("");
  const [stageId, setStageId] = useState(1);
  const [status, setStatus] = useState(null);
  const [createdBy, setCreatedBy] = useState("");
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    `${status == "Approved" ? "View" : "Review"} Guarantor`,
    "",
    "",
    "Guarantor",
    `guarantors/review-update/${eId}`,
    [Assist.ROLE_ADMIN],
  );

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //only load if viewing the item
    if (pageConfig.Id != 0) {
      setLoading(true);
      setTimeout(() => {
        Assist.loadData(pageConfig.Title, `guarantors/id/${pageConfig.Id}`)
          .then((data) => {
            setLoading(false);
            updateVaues(data);
            setError(false);
          })
          .catch((message) => {
            setLoading(false);
            setError(true);
            Assist.showMessage(message, "error");
          });
      }, Assist.DEV_DELAY);
    }
  }, []);

  const updateVaues = (res: any) => {
    setQueryDetail(res);
    setStatus(res.status.status_name);
    setStage(res.stage.stage_name);
    setStageId(res.stage_id);
    setCreatedBy(res.created_by);

  };


  return (
    <div id="pageRoot" className="page-content">
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        position={{ of: "#pageRoot" }}
        visible={loading}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />
      <Titlebar
        title={`${pageConfig.Title}`}
        section={"Administration"}
        icon={"cubes"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={6}>
          {queryDetail != null && (
            <GuarantorDetail guarantor={queryDetail} showMember={true} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminGuarantor;
