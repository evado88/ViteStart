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
  const [name, setName] = useState(null);
  const [type, setType] = useState(null);

  const [methodCode, setMethodCode] = useState(null);
  const [methodNumber, setMethodNumber] = useState(null);
  const [methodName, setMethodName] = useState(null);

  const [bankName, setBankName] = useState(null);
  const [branchName, setBranchName] = useState(null);
  const [branchCode, setBranchCode] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [accountNo, setAccountNo] = useState(null);
  //config
  const [config, setConfig] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(
    `New Payment Method`,
    "",
    "",
    "Payment Method",
    ""
  );

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //only load config for new items to get approval levels and other data
    setLoading(true);
    setTimeout(() => {
      Assist.loadData("Configuration", AppInfo.configApiUrl)
        .then((data) => {
          if (pageConfig.Id != 0) {
            Assist.loadData(pageConfig.Single, `paymentmethods/id/${eId}`)
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
    //details
    setName(data.name);
    setType(data.type);

    //mobile
    setMethodName(data.method_name);

    const code = String(data.method_code);
    const mobile = String(data.method_number);

    setMethodCode(code);

    //check if this phone and code are aligned
    if (code.length != 0) {
      const index = mobile.indexOf(code.substring(1));
      if (index != -1) {
        setMethodNumber(mobile.substring(index + code.length - 1));
      }
    }

    //bank
    setBankName(data.bank_name);
    setBranchName(data.bank_branch_name);
    setBranchCode(data.bank_branch_code);
    setAccountName(data.bank_account_name);
    setAccountNo(data.bank_account_no);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    let result = confirm(
      `Are you sure you want to submit this ${pageConfig.Single}?`,
      "Confirm submission"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitArticle();
      }
    });
  };

  const submitArticle = () => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      //details
      name: name,
      type: type,
      //mobile
      method_code: methodCode,
      method_number: methodNumber,
      method_name: methodName,
      //bank
      bank_name: bankName,
      bank_branch_name: branchName,
      bank_branch_code: branchCode,
      bank_account_name: accountName,
      bank_account_no: accountNo,
      //service
      status_id: Assist.STATUS_SUBMITTED,
      stage_id: Assist.STAGE_SUBMITTED,
      approval_levels: config.approval_levels,
    };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.Id == 0
          ? `paymentmethods/create`
          : `paymentmethods/update/${pageConfig.Id}`,
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
          navigate(`/my/payment-methods/list`);
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
                  <div className="dx-fieldset-header">Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Name</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Name"
                      value={name}
                      disabled={error || saving}
                      onValueChange={(text) => setName(text)}
                    >
                      <Validator>
                        <RequiredRule message="Name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Type</div>
                    <SelectBox
                      placeholder="Type"
                      className="dx-field-value"
                      dataSource={AppInfo.memberPaymentMethodList}
                      onValueChange={(value) => setType(value)}
                      validationMessagePosition="left"
                      value={type}
                      disabled={error}
                    >
                      <Validator>
                        <RequiredRule message="Type is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                </div>
                {type == "Mobile" && (
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Mobile</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Name</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Name"
                        value={methodName}
                        disabled={error || saving}
                        onValueChange={(text) => setMethodName(text)}
                      >
                        <Validator>
                          <RequiredRule message="Mobile name is required" />
                        </Validator>
                      </TextBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Country Code</div>
                      <SelectBox
                        className="dx-field-value"
                        placeholder="Country Code"
                        displayExpr="dial_code"
                        valueExpr="dial_code"
                        value={methodCode}
                        itemTemplate={(item) =>
                          `${item.name} ${item.dial_code}`
                        }
                        dataSource={AppInfo.countryCodes}
                        onValueChange={(value) => setMethodCode(value)}
                        validationMessagePosition="left"
                        disabled={error}
                      >
                        <Validator>
                          <RequiredRule message="Country code is required" />
                        </Validator>
                      </SelectBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Number</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Number"
                        value={methodNumber}
                        disabled={error || saving}
                        onValueChange={(text) => setMethodNumber(text)}
                      >
                        <Validator>
                          <RequiredRule message="Mobile number is required" />
                        </Validator>
                      </TextBox>
                    </div>
                  </div>
                )}
                {type != "Mobile" && (
                  <div className="dx-fieldset">
                    <div className="dx-fieldset-header">Bank</div>
                    <div className="dx-field">
                      <div className="dx-field-label">Name</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Bank"
                        value={bankName}
                        disabled={error || saving}
                        onValueChange={(text) => setBankName(text)}
                      >
                        <Validator>
                          <RequiredRule message="Bank name is required" />
                        </Validator>
                      </TextBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Branch name</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Branch name"
                        value={branchName}
                        disabled={error || saving}
                        onValueChange={(text) => setBranchName(text)}
                      >
                        <Validator>
                          <RequiredRule message="Branch name is required" />
                        </Validator>
                      </TextBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Branch code</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Branch code"
                        value={branchCode}
                        disabled={error || saving}
                        onValueChange={(text) => setBranchCode(text)}
                      >
                        <Validator>
                          <RequiredRule message="Branch code is required" />
                        </Validator>
                      </TextBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Account name</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Account name"
                        value={accountName}
                        disabled={error || saving}
                        onValueChange={(text) => setAccountName(text)}
                      >
                        <Validator>
                          <RequiredRule message="Account name is required" />
                        </Validator>
                      </TextBox>
                    </div>
                    <div className="dx-field">
                      <div className="dx-field-label">Account no</div>
                      <TextBox
                        className="dx-field-value"
                        placeholder="Account no"
                        value={accountNo}
                        disabled={error || saving}
                        onValueChange={(text) => setAccountNo(text)}
                      >
                        <Validator>
                          <RequiredRule message="Account no is required" />
                        </Validator>
                      </TextBox>
                    </div>
                  </div>
                )}
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
