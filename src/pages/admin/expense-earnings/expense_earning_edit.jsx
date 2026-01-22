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
import SelectBox from "devextreme-react/select-box";
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
import DateBox from "devextreme-react/date-box";
import { NumberBox } from "devextreme-react/number-box";

const KnowledgebaseArticleEdit = () => {
  //user
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eId } = useParams(); // Destructure the parameter directly

  //posting
  const [title, setTitle] = useState(null);
  const [type, setType] = useState(null);
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState(null);
  const [categories, setCategories] = useState([]);
  const [group, setGroup] = useState(null);
  const [comments, setComments] = useState(null);
  const [reference, setReference] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  //config
  const [config, setConfig] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(
    `New Expense / Earning`,
    "",
    "",
    "Exepnse / Earning",
    ""
  );

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    Assist.loadData("Categories", "transaction-groups/list")
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
              `transactions/id/${eId}`
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
    setType(data.type_id == Assist.TRANSACTION_GROUP_EARNING ? 'Earning' : 'Expense');
    setGroup(data.group_id);
    setComments(data.comments);
    setAmount(data.amount);
    setDate(data.date);
    setReference(data.reference);
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
    const postData = {
      user_id: user.userid,
      attachment_id: uploadedFiles.length == 0 ? null : uploadedFiles[0].id,
      type_id:
        type == "Expense"
          ? Assist.TRANSACTION_GROUP_EXPENSE
          : Assist.TRANSACTION_GROUP_EARNING,
      date: date,
      amount: amount,
      group_id: group,
      comments: comments,
      reference: reference,
      state_id: Assist.STATE_CLOSED,
      status_id: Assist.STATUS_SUBMITTED,
      stage_id: Assist.STAGE_SUBMITTED,
      approval_levels: config.approval_levels,
    };

    setSaving(true);
    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.Id == 0
          ? `transactions/create`
          : `transactions/update/${pageConfig.Id}`,
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
          navigate(`/admin/expenses-earnings/list`);
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
                  <div className="dx-fieldset-header">Detail</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Type</div>
                    <SelectBox
                      className="dx-field-value"
                      placeholder="Type"
                      dataSource={["Expense", "Earning"]}
                      onValueChange={(value) => setType(value)}
                      validationMessagePosition="left"
                      value={type}
                      disabled={error || saving}
                    >
                      <Validator>
                        <RequiredRule message="Type is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Date</div>
                    <DateBox
                      className="dx-field-value"
                      placeholder="Date"
                      displayFormat={"dd MMMM yyyy"}
                      value={date}
                      disabled={error || saving}
                      onValueChange={(text) => setDate(text)}
                    >
                      <Validator>
                        <RequiredRule message="Date is required" />
                      </Validator>
                    </DateBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Amount</div>
                    <NumberBox
                      className="dx-field-value"
                      value={amount}
                      placeholder="Amount"
                      disabled={error || saving || saving}
                      onValueChange={(value) => setAmount(value)}
                    >
                      <Validator>
                        <RequiredRule message="Amount required" />
                      </Validator>
                    </NumberBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Category</div>
                    <SelectBox
                      className="dx-field-value"
                      placeholder="Category"
                      dataSource={categories}
                      onValueChange={(value) => setGroup(value)}
                      validationMessagePosition="left"
                      value={group}
                      disabled={error}
                      valueExpr={"id"}
                      displayExpr={"group_name"}
                    >
                      <Validator>
                        <RequiredRule message="Category is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Comments</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Comments"
                      value={comments}
                      disabled={error || saving}
                      onValueChange={(text) => setComments(text)}
                    ></TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Reference</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Reference"
                      value={reference}
                      disabled={error || saving}
                      onValueChange={(text) => setReference(text)}
                    ></TextBox>
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
                      uploadUrl={`${AppInfo.apiUrl}attachments/create/type/expenseEarning/parent/0`}
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

export default KnowledgebaseArticleEdit;
