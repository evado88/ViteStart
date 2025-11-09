import { useState, useEffect } from "react";
import { Titlebar } from "../../components/titlebar";
import { Card } from "../../components/card";
import { Row } from "../../components/row";
import { Col } from "../../components/column";
import Button from "devextreme-react/button";
import { LoadPanel } from "devextreme-react/load-panel";
import { useAuth } from "../../context/AuthContext";
import PageConfig from "../../classes/page-config";
import Assist from "../../classes/assist";
import { useNavigate, useParams } from "react-router-dom";
import { confirm } from "devextreme/ui/dialog";
import TextArea from "devextreme-react/text-area";
import Validator, { RequiredRule } from "devextreme-react/validator";
import SelectBox from "devextreme-react/select-box";
import AppInfo from "../../classes/app-info";
import ValidationSummary from "devextreme-react/validation-summary";
import { MonthlyPostDetail } from "../../components/monthlyPostDetail";
import LoadIndicator from "devextreme-react/load-indicator";
import FileUploader from "devextreme-react/file-uploader";
import DataGrid, {
  Column,
  Pager,
  Paging,
  Summary,
  GroupItem,
  TotalItem,
} from "devextreme-react/data-grid";

const MyMonthlyPosting = ({ props }: any) => {
  //user
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eId } = useParams(); // Destructure the parameter directly

  //service
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attachmentID, setAttachmentID] = useState<Number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any | null>([]);

  const [status, setStatus] = useState(null);
  const [stage, setStage] = useState(null);

  const [approvalComments, setApprovalComments] = useState("");

  const [monthlyPosting, setMonthlyPosting] = useState<any | null>(null);

  const pageConfig = new PageConfig(
    "Upload Proof of Payment (POP)",
    `monthly-posting/id/${eId}`,
    "",
    "Monthly Posting",
    `monthly-posting/review-update/${eId}`
  );

  pageConfig.id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      Assist.loadData(pageConfig.Title, pageConfig.Url)
        .then((res: any) => {
          setLoading(false);
          updateVaues(res);
          setMonthlyPosting(res);
          setError(false);
        })
        .catch((ex) => {
          setLoading(false);
          setError(true);
        });
    }, Assist.DEV_DELAY);
  }, [eId]);

  const updateVaues = (res: any) => {
    setStatus(res.status.status_name);
    setStage(res.stage.stage_name);
  };

  const requiresApproval = () => {
    if (status == "Submitted") {
      if (
        stage == "Guarantor Approval" ||
        stage == "Awaiting Submission" ||
        stage == "Approved"
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const onFormApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedFiles.length == 0) {
      //simulate process
      let result = confirm(
        "Are you sure you want to submit the POP without attaching a file?",
        "Confirm changes"
      );

      result.then((dialogResult) => {
        if (dialogResult) {
          submitPostingReview(Assist.REVIEW_ACTION_APPROVE, approvalComments);
        }
      });
    } else {
      //simulate process
      let result = confirm(
        "Are you sure you want to submit the POP for this monthly posting?",
        "Confirm changes"
      );

      result.then((dialogResult) => {
        if (dialogResult) {
          submitPostingReview(Assist.REVIEW_ACTION_APPROVE, approvalComments);
        }
      });
    }

  };

  const submitPostingReview = (action: number, reviewComments: string) => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      review_action: action,
      comments: reviewComments,
      attachment_id: attachmentID,
    };

    setTimeout(() => {
      Assist.postPutData(pageConfig.Title, pageConfig.updateUrl, postData, 1)
        .then((data) => {
          setSaving(false);

          Assist.showMessage(
            `You have successfully submitted the Proof of Payment!`,
            "success"
          );

          navigate(`/admin/monthly-postings/list`);
        })
        .catch((message) => {
          setSaving(false);
          console.log(message);

          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };
  return (
    <div id="pageRoot" className="page-content" style={{ minHeight: "862px" }}>
      <LoadPanel
        shadingColor="rgba(248, 242, 242, 0.)"
        position={{ of: "#pageRoot" }}
        visible={loading}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />
      <Titlebar
        title={pageConfig.Title}
        section={"My"}
        icon={"home"}
        url="#"
      ></Titlebar>
      {/* end widget */}

      {/* chart start */}
      {monthlyPosting != null && (
        <Row>
          <Col sz={12} sm={12} lg={7}>
            <MonthlyPostDetail monthlyPosting={monthlyPosting} />
          </Col>
          <Col sz={12} sm={12} lg={5}>
            {requiresApproval() && (
              <Card title="Proof of Payment (POP)" showHeader={true}>
                <div className="form">
                  <form id="formMain" onSubmit={onFormApproveSubmit}>
                    <div className="dx-fieldset">
                      <div className="dx-fieldset-header">Submission</div>
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
                                setUploadedFiles([res.attachment]);
                                setAttachmentID(res.attachment.id);
                              }
                            } else {
                              Assist.showMessage(
                                `Unable to upload POP. Please try again`,
                                "error"
                              );
                            }
                          }}
                          uploadUrl={`${AppInfo.apiUrl}attachments/create/type/monthlyPost/parent/${eId}`}
                        />
                      </div>
                      <div className="dx-field">
                        <DataGrid
                          className={"dx-card wide-card"}
                          dataSource={uploadedFiles}
                          keyExpr={"id"}
                          noDataText={"No POP uploaded"}
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
                      <div className="dx-field">
                        <div className="dx-field-label">
                          Comments / Reference
                        </div>
                        <TextArea
                          className="dx-field-value"
                          placeholder="Comments / Reference"
                          disabled={error || saving || saving}
                          height={80}
                          value={approvalComments}
                          onValueChange={(value) => setApprovalComments(value)}
                        >
                          <Validator validationGroup="Approve">
                            <RequiredRule message="Comments / reference required" />
                          </Validator>
                        </TextArea>
                      </div>
                    </div>

                    <div className="dx-field">
                      <ValidationSummary
                        id="summaryApprove"
                        validationGroup="Approve"
                      />
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label"></div>
                      <Button
                        width="100%"
                        useSubmitBehavior={true}
                        type={saving ? "normal" : "success"}
                        disabled={loading || error || saving}
                        validationGroup="Approve"
                      >
                        <LoadIndicator
                          className="button-indicator"
                          visible={saving}
                        />
                        <span className="dx-button-text">
                          Submit Proof of Payment (POP)
                        </span>
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MyMonthlyPosting;
