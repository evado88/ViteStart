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
  const [guarantorFirstname, setGuarantorFirstname] = useState(null);
  const [guarantorLastname, setGuarantorLastname] = useState(null);
  const [guarantorMobileCode, setGuarantorMobileCode] = useState("+260");
  const [guarantorMobile, setGuarantorMobile] = useState(null);
  const [guarantorEmail, setGuarantorEmail] = useState(null);
  //config
  const [config, setConfig] = useState(null);

  //service
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const pageConfig = new PageConfig(`New Guarantor`, "", "", "Guarantor", "");

  pageConfig.Id = eId == undefined ? 0 : Number(eId);

  useEffect(() => {
    //only load config for new items to get approval levels and other data
    setLoading(true);
    setTimeout(() => {
      Assist.loadData("Configuration", AppInfo.configApiUrl)
        .then((data) => {
          if (pageConfig.Id != 0) {
            Assist.loadData(pageConfig.Single, `guarantors/id/${eId}`)
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
    setGuarantorFirstname(data.guar_fname);
    setGuarantorLastname(data.guar_lname);

    const code = String(data.guar_code);
    const mobile = String(data.guar_mobile);

    setGuarantorMobileCode(code);

    //check if this phone and code are aligned
    if (code.length != 0) {
      const index = mobile.indexOf(code.substring(1));
      if (index != -1) {
        setGuarantorMobile(mobile.substring(index + code.length - 1));
      }
    }

    setGuarantorEmail(data.guar_email);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    let result = confirm(
      `Are you sure you want to submit this ${pageConfig.Single}?`,
      "Confirm submission"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        submitGuarantor();
      }
    });
  };

  const submitGuarantor = () => {
    setSaving(true);

    const postData = {
      user_id: user.userid,
      guar_fname: guarantorFirstname,
      guar_lname: guarantorLastname,
      guar_code: guarantorMobileCode,
      guar_mobile: Assist.setMobile(guarantorMobileCode, guarantorMobile),
      guar_email: guarantorEmail,
      status_id: Assist.STATUS_SUBMITTED,
      stage_id: Assist.STAGE_SUBMITTED,
      approval_levels: config.approval_levels,
    };

    setTimeout(() => {
      Assist.postPutData(
        pageConfig.Title,
        pageConfig.Id == 0
          ? `guarantors/create`
          : `guarantors/update/${pageConfig.Id}`,
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
          navigate(`/my/guarantors/list`);
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
                    <div className="dx-field-label">First name</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="First name"
                      value={guarantorFirstname}
                      onValueChange={(text) => setGuarantorFirstname(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Guarantor first name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Last name</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="First name"
                      value={guarantorLastname}
                      onValueChange={(text) => setGuarantorLastname(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Gurantor last name is required" />
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
                      value={guarantorMobileCode}
                      itemTemplate={(item) => `${item.name} ${item.dial_code}`}
                      dataSource={AppInfo.countryCodes}
                      onValueChange={(value) => setGuarantorMobileCode(value)}
                      validationMessagePosition="left"
                      disabled={error}
                    >
                      <Validator>
                        <RequiredRule message="Country code is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Mobile</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Mobile i.e. 977123456"
                      value={guarantorMobile}
                      onValueChange={(text) => setGuarantorMobile(text)}
                    />
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Email</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Email"
                      value={guarantorEmail}
                      onValueChange={(text) => setGuarantorEmail(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Guarantor mobile is required" />
                      </Validator>
                    </TextBox>
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
