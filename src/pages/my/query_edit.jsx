import React, { useState, useEffect, useMemo } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import SelectBox from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import {
  Validator,
  RequiredRule,
  AsyncRule,
  CompareRule,
  CustomRule,
} from "devextreme-react/validator";
import TextArea from "devextreme-react/text-area";
import { NumberBox } from "devextreme-react/number-box";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import DateBox from "devextreme-react/date-box";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import axios from "axios";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import HtmlEditor, {
  Toolbar,
  Item,
  MediaResizing,
} from "devextreme-react/html-editor";
import AppInfo from "../../classes/app-info";

const MemberQueryEdit = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //posting
  const [title, setTitle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [content, setContent] = useState(null);



  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig("Member Query", "", "", "Member Query", "");

  pageConfig.id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    Assist.loadData("Categories", "member-query-types")
      .then((res) => {
        setCategories(res);
      })
      .catch((ex) => {
        Assist.showMessage(ex.Message, "error");
      });
  }, []);

  useEffect(() => {
    //only load if updating item
    if (pageConfig.id != 0) {
      setLoading(true);

      setTimeout(() => {
        Assist.loadData(pageConfig.Title, `member-queries/id/${pageConfig.id}`)
          .then((data) => {
            setLoading(false);
            updateVaues(data, true);
            setError(false);
          })
          .catch((message) => {
            setLoading(false);
            setError(true);
            Assist.showMessage(message, "error");
          });
      },  Assist.developmentDelay);
    }
  }, []);

  const updateVaues = (data, isLoading) => {
    setTitle(data.title);
    setCategory(isLoading ? data.type.id : data.type_id);
    setContent(data.content);
  };

  const onFormSubmit = (e) => {
    setSaving(true);

    e.preventDefault();

    const postData = {
      user_id: user.userid,
      type_id: category,
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
          ? `member-queries/create`
          : `member-queries/update/${pageConfig.id}`,
        postData,
        pageConfig.id
      )
        .then((data) => {
          setSaving(false);
          updateVaues(data, false);

          Assist.showMessage(
            `You have successfully updated the ${pageConfig.Title}!`,
            "success"
          );

          if (pageConfig.id == 0) {
            //navigate
            navigate(`/my/member-queries/edit/${data.id}`);
          }
        })
        .catch((message) => {
          setSaving(false);
          Assist.showMessage(message, "error");
        });
    },  Assist.developmentDelay);
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
                    <div className="dx-field-label">Title</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Title"
                      value={title}
                      disabled={error || saving}
                      onValueChange={(text) => setTitle(text)}
                    >
                      <Validator>
                        <RequiredRule message="Title is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Category</div>
                    <SelectBox
                      className="dx-field-value"
                      dataSource={categories}
                      onValueChange={(value) => setCategory(value)}
                      validationMessagePosition="left"
                      value={category}
                      disabled={error}
                      valueExpr={"id"}
                      displayExpr={"query_type_name"}
                    >
                      <Validator>
                        <RequiredRule message="Category is required" />
                      </Validator>
                    </SelectBox>
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
