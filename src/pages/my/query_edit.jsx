import { useState, useEffect, useMemo } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import { TextBox } from "devextreme-react/text-box";
import { Validator, RequiredRule } from "devextreme-react/validator";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import SelectBox from "devextreme-react/select-box";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import HtmlEditor, { MediaResizing } from "devextreme-react/html-editor";
import AppInfo from "../../classes/app-info";
import FileUploader from "devextreme-react/file-uploader";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { confirm } from "devextreme/ui/dialog";

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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  //config
  const [config, setConfig] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(`New Member Query`, "", "", "Member Query", "");

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    Assist.loadData("Categories", "member-query-types/list")
      .then((res) => {
        setCategories(res);
      })
      .catch((ex) => {
        Assist.showMessage(ex.Message, "error");
      });
  }, []);

  useEffect(() => {
    //only load config for new items to get approval levels and other data
    setLoading(true);
    setTimeout(() => {
      Assist.loadData("Configuration", AppInfo.configApiUrl)
        .then((data) => {
          if (pageConfig.Id != 0) {
            Assist.loadData(
              pageConfig.Single,
              `member-queries/id/${eId}`
            )
              .then((postData) => {
                setLoading(false);
                updateVaues(postData, true);
                setConfig(data);
              })
              .catch((message) => {
                setLoading(false);
                setError(true);
                Assist.showMessage(message, "error");
              });
          } else {
            setLoading(false);
            setConfig(data);
            setError(false);
          }
        })
        .catch((message) => {
          setLoading(false);
          setError(true);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  }, []);

  const updateVaues = (data, isLoading) => {
    setTitle(data.title);
    setCategory(data.type_id);
    setContent(data.content);
    setUploadedFiles([data.attachment]);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    let result = confirm(
      `Are you sure you want to submit this ${pageConfig.Single}?`,
      "Confirm submission"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitItem();
      }
    });
  };

  const submitItem = () => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      attachment_id: uploadedFiles[0].id,
      title: title,
      type_id: category,
      content: content,
      status_id: Assist.STATUS_SUBMITTED,
      stage_id: Assist.STAGE_SUBMITTED,
      approval_levels: config.approval_levels,
    };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.Id == 0
          ? `member-queries/create`
          : `member-queries/update/${pageConfig.Id}`,
        postData,
        pageConfig.Id
      )
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully submitted the ${pageConfig.Title}!`,
            "success"
          );

          //navigate
          navigate(`/my/member-queries/list`);
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
        title={`${pageConfig.Title}`}
        section={"Configuration"}
        icon={"gear"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      <form id="formMain" onSubmit={onFormSubmit}>
        <Row>
          <Col sz={12} sm={12} lg={7}>
            <Card title="Properties" showHeader={true}>
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
                        <RequiredRule message="Meeting title is required" />
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
                  <div className="dx-fieldset-header">Attachment File</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Upload File (5MB Max)</div>
                    <FileUploader
                      className="dx-field-value"
                      multiple={false}
                      accept="*"
                      name="file"
                      uploadMode="instantly"
                      onUploaded={(e) => {
                        if (e.request.status === 200) {
                          const res = JSON.parse(e.request.response);

                          console.log("runq", res);

                          if (res === null) {
                            Assist.showMessage(
                              `The response from the server is invalid. Please try again`,
                              "error"
                            );
                          } else {
                            setUploadedFiles([res.attachment]);
                            setAttendanceList(res.attendance);
                          }
                        } else {
                          Assist.showMessage(
                            `Unable to upload attachment file. Please try again`,
                            "error"
                          );
                        }
                      }}
                      uploadUrl={`${AppInfo.apiUrl}attachments/create/type/${pageConfig.Single}/parent/0`}
                    />
                  </div>
                  <div className="dx-field">
                    <DataGrid
                      className={"dx-card wide-card"}
                      dataSource={uploadedFiles}
                      keyExpr={"id"}
                      noDataText={"No attachment file uploaded"}
                      showBorders={false}
                      focusedRowEnabled={false}
                      defaultFocusedRowIndex={0}
                      columnAutoWidth={true}
                      columnHidingEnabled={true}
                    >
                      <Paging defaultPageSize={10} />
                      <Pager showPageSizeSelector={true} showInfo={true} />
                      <Column
                        dataField="id"
                        caption="ID"
                        hidingPriority={7}
                      ></Column>
                      <Column
                        dataField="name"
                        caption="Name"
                        hidingPriority={4}
                        cellRender={(e) => {
                          return (
                            <a
                              href={encodeURI(
                                `${AppInfo.apiUrl}static/${e.data.path}`
                              )}
                              target="_null"
                            >
                              {e.text}
                            </a>
                          );
                        }}
                      ></Column>
                      <Column
                        dataField="filesize"
                        caption="Size"
                        format={",##0.###"}
                        hidingPriority={4}
                      ></Column>
                      <Column
                        dataField="filetype"
                        caption="Type"
                        hidingPriority={5}
                      ></Column>
                    </DataGrid>
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
                    type={saving ? "normal" : "success"}
                    disabled={loading || error || saving}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={saving}
                    />
                    <span className="dx-button-text">Submit for Review</span>
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default MemberQueryEdit;
