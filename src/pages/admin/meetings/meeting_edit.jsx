import { useState, useEffect, useMemo } from "react";
import { Titlebar } from "../../../components/titlebar";
import { Card } from "../../../components/card";
import { Row } from "../../../components/row";
import { Col } from "../../../components/column";
import { TextBox } from "devextreme-react/text-box";
import { Validator, RequiredRule } from "devextreme-react/validator";
import Button from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadPanel } from "devextreme-react/load-panel";
import DateBox from "devextreme-react/date-box";
import { useAuth } from "../../../context/AuthContext";
import PageConfig from "../../../classes/page-config";
import Assist from "../../../classes/assist";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useNavigate, useParams } from "react-router-dom";
import HtmlEditor, { MediaResizing } from "devextreme-react/html-editor";
import AppInfo from "../../../classes/app-info";
import FileUploader from "devextreme-react/file-uploader";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { confirm } from "devextreme/ui/dialog";

const MeetingEdit = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //posting
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [date, setDate] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  //config
  const [config, setConfig] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [stage, setStage] = useState(1);

  const pageConfig = new PageConfig(
    `${stage == 1 ? "New" : "Review"} Meeting`,
    "",
    "",
    "Meeting",
    ""
  );

  pageConfig.id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //only load config for new items to get approval levels and other data
    if (pageConfig.id == 0) {
      setLoading(true);
      setTimeout(() => {
        Assist.loadData('Configuration', `sacco-config/1`)
          .then((data) => {
            setLoading(false);
            setConfig(data);
            setError(false);
          })
          .catch((message) => {
            setLoading(false);
            setError(true);
            Assist.showMessage(message, "error");
          });
      }, Assist.developmentDelay);
    }
    //only load if viewing the item
    if (pageConfig.id != 0) {
      setLoading(true);
      setTimeout(() => {
        Assist.loadData(pageConfig.Title, `meetings/id/${pageConfig.id}`)
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
      }, Assist.developmentDelay);
    }
  }, []);

  const updateVaues = (data) => {
    setTitle(data.title);
    setContent(data.content);
    setDate(data.date);
    setUploadedFiles([data.attachment]);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    if (uploadedFiles.length == 0) {
      Assist.showMessage(
        "Please upload a valid Attendance file first ",
        "error"
      );
      return;
    }

    //simulate process
    if (stage == 1) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStage(2);
      }, Assist.UX_DELAY);

      return;
    }

    if (stage == 2) {
      let result = confirm(
        "Are you sure you want to submit this meeting?",
        "Confirm submission"
      );
      result.then((dialogResult) => {
        if (dialogResult) {
          submitMeeting();
        }
      });
    }
  };

  const submitMeeting = () => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      attachment_id: uploadedFiles[0].id,
      title: title,
      date: date,
      content: content,
      status_id: Assist.STATUS_SUBMITTED,
      stage_id: Assist.STAGE_SUBMITTED,
      approval_levels: config.approval_levels,
    };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.id == 0
          ? `meetings/create`
          : `meetings/update/${pageConfig.id}`,
        postData,
        pageConfig.id
      )
        .then((data) => {
          setSaving(false);
          updateVaues(data);

          Assist.showMessage(
            `You have successfully updated the ${pageConfig.Title}!`,
            "success"
          );

          //navigate
          navigate(`/admin/meetings/list`);
        })
        .catch((message) => {
          setSaving(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.developmentDelay);
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
              {stage == 1 && (
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Title</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Title</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Meeting Title"
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
                      <div className="dx-field-label">Date</div>
                      <DateBox
                        className="dx-field-value"
                        placeholder="Meeting Date"
                        displayFormat={"dd MMMM yyyy"}
                        value={date}
                        disabled={error || saving}
                        onValueChange={(text) => setDate(text)}
                      >
                        <Validator>
                          <RequiredRule message="Meeting date is required" />
                        </Validator>
                      </DateBox>
                    </div>
                  </div>
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Attendance List</div>
                    <div className="dx-field">
                      <div className="dx-field-label">
                        Upload File (5MB Max)
                      </div>
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
                              setUploadedFiles([res]);
                            }
                          } else {
                            Assist.showMessage(
                              `Unable to upload meeting attendance list. Please try again`,
                              "error"
                            );
                          }
                        }}
                        uploadUrl={`${AppInfo.apiUrl}attachments/create/type/Attachment/parent/0`}
                      />
                    </div>
                    <div className="dx-field">
                      <DataGrid
                        className={"dx-card wide-card"}
                        dataSource={uploadedFiles}
                        keyExpr={"id"}
                        noDataText={"No attendance list uploaded"}
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
                      type={saving ? "normal" : "default"}
                      disabled={loading || error || saving}
                      useSubmitBehavior={true}
                    >
                      <LoadIndicator
                        className="button-indicator"
                        visible={saving}
                      />
                      <span className="dx-button-text">Next</span>
                    </Button>
                  </div>
                </div>
              )}
              {stage == 2 && (
                <div className="form">
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Title</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Title</div>
                      <div className="dx-field-value-static">
                        <strong>{title}</strong>
                      </div>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Date</div>
                      <div className="dx-field-value-static">
                        <strong>{Assist.getDateText(date)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Attendance List</div>
                    <div className="dx-field">
                      <DataGrid
                        className={"dx-card wide-card"}
                        dataSource={uploadedFiles}
                        keyExpr={"id"}
                        noDataText={"No attendance list uploaded"}
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
                        readOnly={true}
                        defaultValue={content}
                        value={content}
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
                    <div className="dx-field-label"></div>
                    <Button
                      width="100%"
                      type={"normal"}
                      disabled={loading || error || saving}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                        setLoading(true);
                        setTimeout(() => {
                          setLoading(false);
                          setStage(1);
                        }, Assist.UX_DELAY);
                      }}
                    >
                      <span className="dx-button-text">Go Back</span>
                    </Button>
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
              )}
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default MeetingEdit;
