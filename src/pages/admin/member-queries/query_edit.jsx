import { useState, useEffect, useMemo, useRef } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import { TextBox } from "devextreme-react/text-box";
import { Validator, RequiredRule } from "devextreme-react/validator";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../../context/AuthContext";
import PageConfig from "../../../classes/page-config";
import Assist from "../../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import HtmlEditor, { MediaResizing } from "devextreme-react/html-editor";
import AppInfo from "../../../classes/app-info";

const MemberQueryEdit = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //posting
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const hasRun = useRef(false);

  const pageConfig = new PageConfig(
    "Announcement",
    "",
    "",
    "Announcement",
    "",
    [Assist.ROLE_ADMIN],
  );

  pageConfig.id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //check if initialized
    if (hasRun.current) return;
    hasRun.current = true;

    //check permissions and audit
    if (!Assist.checkPageAuditPermission(pageConfig, user)) {
      Assist.redirectUnauthorized(navigate);
      return;
    }

    //only load if updating item
    if (pageConfig.id != 0) {
      setLoading(true);

      setTimeout(() => {
        Assist.loadData(pageConfig.Title, `announcements/id/${pageConfig.id}`)
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

  const updateVaues = (data) => {
    setTitle(data.title);
    setContent(data.content);
  };

  const onFormSubmit = (e) => {
    setSaving(true);

    e.preventDefault();

    const postData = {
      user_id: user.userid,
      title: title,
      content: content,
      status_id: 1,
      stage_id: 1,
      approval_levels: 1,
    };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.id == 0
          ? `announcements/create`
          : `announcements/update/${pageConfig.id}`,
        postData,
        pageConfig.id,
      )
        .then((data) => {
          setSaving(false);
          updateVaues(data);

          Assist.showMessage(
            `You have successfully updated the ${pageConfig.Title}!`,
            "success",
          );

          if (pageConfig.id == 0) {
            //navigate
            navigate(`/admin/announcements/edit/${data.id}`);
          }
        })
        .catch((message) => {
          setSaving(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };

  const toolbar = useMemo(() => {
    return AppInfo.htmlToolbar;
  }, []);

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
        title={`${pageConfig.verb()} ${pageConfig.Title}`}
        section={"Configuration"}
        icon={"gear"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <Row>
        <Col sz={12} sm={12} lg={7}>
          <Card title="Properties" showHeader={true}>
            <form id="formMain" onSubmit={onFormSubmit}>
              <div className="form">
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Title</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Announcement Title</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Announcement Title"
                      value={title}
                      disabled={error || saving}
                      onValueChange={(text) => setTitle(text)}
                    >
                      <Validator>
                        <RequiredRule message="Announcement title is required" />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Content</div>
                  <div className="dx-field">
                    <HtmlEditor
                      height="525px"
                      defaultValue={content}
                      value={content}
                      toolbar={toolbar}
                      onValueChanged={(e) => setContent(e.value)}
                    >
                      <MediaResizing enabled={true} />
                      <Validator>
                        <RequiredRule message="Content is required" />
                      </Validator>
                    </HtmlEditor>
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">
                    <ValidationSummary id="summaryMain" />
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label"></div>
                  <Button
                    width="100%"
                    type={saving ? "normal" : "default"}
                    disabled={loading || error || saving}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={saving}
                    />
                    <span className="dx-button-text">
                      {pageConfig.verb()} {pageConfig.Title}
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MemberQueryEdit;
