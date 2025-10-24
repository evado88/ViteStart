import { useState, useEffect } from "react";
import { TextBox } from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import {
  Validator,
  RequiredRule,
  EmailRule,
  AsyncRule,
  CompareRule
} from "devextreme-react/validator";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import notify from "devextreme/ui/notify";
import axios from "axios";
import { DateBox } from "devextreme-react";
import SelectBox from "devextreme-react/select-box";
import { v4 as uuidv4 } from "uuid";

const Signup = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //personal details
  const [firstname, setFirstname] = useState("Jane");
  const [lastname, setLastname] = useState("Doe");
  const [dateOfBirth, setDateOfBirth] = useState("1987-09-25");
  const [mobile2FA, setMobile2FA] = useState("+260978989259");
  const [mobileMoney, setMobileMoney] = useState("+260977123002");

  const [otp, setOTP] = useState("");
  const [code, setCode] = useState("");

  const [email, setEmail] = useState("jane2003@company.co.zm");
  const [idType, setIdType] = useState("NRC");
  const [idNo, setIdNo] = useState("147780/10/1");
  //guarantor details
  const [guarantorFirstname, setGuarantorFirstname] = useState("Joe");
  const [guarantorLastname, setGuarantorLastname] = useState("Doha");
  const [guarantorMobile, setGuarantorMobile] = useState("+260977123003");
  const [guarantorEmail, setGuarantorEmail] = useState("joe@company.co.zm");

  //bank details
  const [bank, setBank] = useState("ABSA");
  const [branch, setBranch] = useState("Lusaka Business Centre");
  const [accountName, setAccountName] = useState("Jane Doe");
  const [accountNumber, setAccountNumber] = useState("016-2469782");

  const [password, setPassword] = useState("12345677");
  const [confirmPassword, setConfirmPassword] = useState("12345678");

  const [stage, setStage] = useState(1);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFormSubmitPersonalDetails = async (e) => {
    e.preventDefault();

    setStage(2);
  };

  const onFormSubmitID = async (e) => {
    e.preventDefault();

    setStage(3);
  };

  const onFormSubmitMobile = async (e) => {
    e.preventDefault();

    sendWhatsappOTP();
  };

  const onFormVeriyMobile = async (e) => {
    e.preventDefault();

    if (parseInt(code) === otp) {
      setStage(5);
    }
  };

  const onFormSubmitGuarantor = async (e) => {
    e.preventDefault();

    setStage(6);
  };

  const onFormSubmitBank = async (e) => {
    e.preventDefault();

    setStage(7);
  };
  const showMessge = (msg, type = "info") => {
    notify(
      {
        message: msg,
      },
      type,
      4000
    );
  };

  const sendWhatsappOTP = (e) => {
    const newCode = Math.floor(100000 + Math.random() * 900000);

    console.log(`Now sending OTP ${newCode} to client ${mobile2FA}`);

    setOTP(newCode);

    const state = 3;

    if (state === 3) {
      setStage(4);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "App 05704a467eaab51ea1bd2aabaa652517-c006af8e-55e6-4254-aa46-440344a6e040",
        Accept: "application/json",
      },
    };

    const axParams = {
      messages: [
        {
          from: "12098869548",
          to: mobile2FA,
          messageId: uuidv4(),
          content: {
            templateName: "auth",
            templateData: {
              body: {
                placeholders: [newCode],
              },
              buttons: [
                {
                  type: "URL",
                  parameter: "Copy",
                },
              ],
            },
            language: "en",
          },
        },
      ],
    };

    axios
      .post(
        "https://xk85nl.api.infobip.com/whatsapp/1/message/template",
        axParams,
        config
      )
      .then((res) => {
        console.log("res", res);

        if (res.status === 200) {
          console.log("OTP Success:", res.data);
          showMessge(
            `The OTP has been successfully sent to ${mobile2FA}`,
            "success"
          );
          setStage(4);
        } else {
          console.warn("OTP Unexpected Status:", res.status);
          showMessge(
            `Unable to send OTP to ${mobile2FA}. Please try again`,
            "warn"
          );
        }
      })
      .catch((err) => {
        console.error("Error posting data:", err);
        showMessge(
          `Error sending OTP to ${mobile2FA}. Please try again`,
          "error"
        );
      });
  };

  const onFormSubmit = async (e) => {
    if (confirmPassword !== password) {
      showMessge(
        `The provided passwords do not match. Please try again`,
        "warn"
      );
      return;
    }

    setLoading(true);

    e.preventDefault();

    const postData = {
      fname: firstname,
      lname: lastname,
      mobile1: mobile2FA,
      mobile2: mobileMoney,
      id_type: idType,
      id_no: idNo,
      email: email,
      dob: dateOfBirth,
      guar_fname: guarantorFirstname,
      guar_lname: guarantorLastname,
      guar_mobile: guarantorMobile,
      guar_email: guarantorEmail,
      bank_name: bank,
      bank_branch: branch,
      bank_acc_name: accountName,
      bank_acc_no: accountNumber,
      password: password,
    };

    axios
      .post("http://localhost:8700/users/register", postData)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          console.log("Success:", res.data);
          showMessge("You have successfully submitted the form!", "success");
        } else {
          console.warn("Unexpected status:", res.status);
          showMessge(
            `Error submiting the form and wrong status: ${res.status}`,
            "success"
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error posting data:", err);

        if (err.response.data != null) {
          if (Array.isArray(err.response.data.detail)) {
            const field = err.response.data.detail[0].loc[1];
            showMessge(
              `Error submiting the form field: ${err.response.data.detail[0].msg}: ${field}`,
              "error"
            );
          } else {
            showMessge(
              `Error submiting the form single: ${err.response.data.detail}`,
              "error"
            );
          }
        } else {
          showMessge(`Error submiting the form general`, "error");
        }
      });
  };

  const setPreviousStage = (e) => {
    e.preventDefault();
    setStage((prev) => prev - 1);
  };

  function asyncValidation(params) {
    console.log("async", params.value);

    return new Promise(function (resolve) {
      setTimeout(function () {
        const existingUsernames = ["admin", "user123", "jane@company.co.zm"];
        const isUsernameTaken = existingUsernames.includes(params.value);
        resolve(!isUsernameTaken); // Resolve with true if valid, false if invalid
      },  Assist.developmentDelay); // Simulate a 1-second delay for the server call
    });
  }

  function asyncOTPValidation(params) {
    console.log("async otp", params.value);

    return new Promise(function (resolve) {
      resolve(parseInt(code) === otp); // Resolve with true if valid, false if invalid
      // Simulate a 1-second delay for the server call
    });
  }

  function asyncEmailVerification(params) {
    console.log("async email", params.value);

    return new Promise(function (resolve) {
      resolve(password === confirmPassword); // Resolve with true if valid, false if invalid
    });
  }
  return (
    <section className="signup">
      <div className="container">
        <div className="signup-content">
          <div className="signup-form">
            <h2 className="form-title">Sign up</h2>

            {stage == 1 && (
              <form
                className="register-form"
                id="formPersonalDetails"
                onSubmit={onFormSubmitPersonalDetails}
              >
                <p>Please provide your names and date of birth</p>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Personal Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">First name</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="First name"
                      value={firstname}
                      onValueChange={(text) => setFirstname(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="First name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Last name</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Last name"
                      value={lastname}
                      onValueChange={(text) => setLastname(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Last name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Date of birth</div>
                    <DateBox
                      className="dx-field-value"
                      placeholder="Date of birth"
                      displayFormat={"dd MMM yyy"}
                      value={dateOfBirth}
                      onValueChange={(text) => setDateOfBirth(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Date of birth is required" />
                      </Validator>
                    </DateBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Email</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Email"
                      value={email}
                      onValueChange={(text) => setEmail(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Email is required" />
                        <EmailRule message="Email is invalid" />
                        <AsyncRule
                          message="Email is already registered"
                          validationCallback={asyncValidation}
                        />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="form-group">
                  <ValidationSummary id="summary1" />
                </div>
                <div className="form-group form-button">
                  <Button
                    width="100%"
                    type="default"
                    text="Next"
                    useSubmitBehavior={true}
                  />
                </div>
              </form>
            )}
            {stage == 2 && (
              <form
                className="register-form"
                id="formID"
                onSubmit={onFormSubmitID}
              >
                <p>Please provide your identity details</p>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Identity Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">ID Type</div>
                    <SelectBox
                      className="dx-field-value"
                      dataSource={["NRC", "Passport", "Drivers License"]}
                      placeholder="ID Type"
                      value={idType}
                      onValueChanged={(e) => setIdType(e.value)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="ID Type is required" />
                      </Validator>
                    </SelectBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">ID No</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="ID No"
                      value={idNo}
                      onValueChange={(text) => setIdNo(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="ID No is required" />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="form-group">
                  <ValidationSummary id="summary2" />
                </div>
                <div className="form-group form-button">
                  <Button
                    width="100%"
                    type="default"
                    text="Next"
                    useSubmitBehavior={true}
                  />
                  <a
                    to={"#"}
                    className="signup-image-link"
                    onClick={setPreviousStage}
                  >
                    Personal Details
                  </a>
                </div>
              </form>
            )}
            {stage == 3 && (
              <form
                className="register-form"
                id="formMobile"
                onSubmit={onFormSubmitMobile}
              >
                <p>
                  Please provide your mobile phone for mobile money and for
                  verification
                </p>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Mobile phone</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Verification</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Mobile1"
                      value={mobile2FA}
                      onValueChange={(text) => setMobile2FA(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Mobile phone for verification required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Mobile money</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Mobile 2"
                      value={mobileMoney}
                      onValueChange={(text) => setMobileMoney(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Mobile phone for mobile money required" />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="form-group">
                  <ValidationSummary id="summary3" />
                </div>
                <div className="form-group form-button">
                  <Button
                    width="100%"
                    type="default"
                    text="Next"
                    useSubmitBehavior={true}
                  />
                  <a
                    to={"#"}
                    className="signup-image-link"
                    onClick={setPreviousStage}
                  >
                    Identity Details
                  </a>
                </div>
              </form>
            )}
            {stage == 4 && (
              <form
                className="register-form"
                id="formVerifyMobile"
                onSubmit={onFormVeriyMobile}
              >
                <p>Please enter the OTP that was sent to your phone</p>
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Verify OTP</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Code</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Code"
                      value={code}
                      onValueChange={(text) => setCode(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="OTP code required" />
                        <AsyncRule
                          message="The provided OTP is not correct"
                          validationCallback={asyncOTPValidation}
                        />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="form-group">
                  <ValidationSummary id="summary4" />
                </div>
                <div className="form-group form-button">
                  <Button
                    width="100%"
                    type="default"
                    text="Next"
                    useSubmitBehavior={true}
                  />
                  <a
                    to={"#"}
                    className="signup-image-link"
                    onClick={() => setStage(3)}
                  >
                    Mobile Phone details
                  </a>
                </div>
              </form>
            )}
            {stage == 5 && (
              <form
                className="register-form"
                id="form2"
                onSubmit={onFormSubmitGuarantor}
              >
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Guarantor Details</div>
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
                    <div className="dx-field-label">Mobile</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="First name"
                      value={guarantorMobile}
                      onValueChange={(text) => setGuarantorMobile(text)}
                    />
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Email</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="First name"
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
                <div className="form-group">
                  <ValidationSummary id="summary5" />
                </div>
                <div className="form-group form-button">
                  <Button width="100%" type="default" useSubmitBehavior={true}>
                    <span className="dx-button-text">Next</span>
                  </Button>
                  <a
                    to={"#"}
                    className="signup-image-link"
                    onClick={() => setStage(3)}
                  >
                    Mobile Phone Details
                  </a>
                </div>
              </form>
            )}
            {stage == 6 && (
              <form
                className="register-form"
                id="form3"
                onSubmit={onFormSubmitBank}
              >
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Bank Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Bank</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Bank"
                      value={bank}
                      onValueChange={(text) => setBank(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Bank name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Branch</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Branch"
                      value={branch}
                      onValueChange={(text) => setBranch(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Branch name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Account name</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Account name"
                      value={accountName}
                      onValueChange={(text) => setAccountName(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Account name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Account number</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Account number"
                      value={accountNumber}
                      onValueChange={(text) => setAccountNumber(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Account number is required" />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="form-group">
                  <ValidationSummary id="summary6" />
                </div>
                <div className="form-group form-button">
                  <Button
                    width="100%"
                    id="buttonSubmit"
                    type="default"
                    disabled={loading}
                    useSubmitBehavior={true}
                  >
                    <span className="dx-button-text">Next</span>
                  </Button>
                  <a
                    to={"#"}
                    className="signup-image-link"
                    onClick={setPreviousStage}
                  >
                    Guarantor Details
                  </a>
                </div>
              </form>
            )}
            {stage == 7 && (
              <form
                className="register-form"
                id="form3"
                onSubmit={onFormSubmit}
              >
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Account Password</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Password</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Password"
                      mode="password"
                      value={password}
                      onValueChange={(text) => setPassword(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Bank name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Confirm Password</div>
                    <TextBox
                      className="dx-field-value"
                      placeholder="Confirm Password"
                      mode="password"
                      value={confirmPassword}
                      onValueChange={(text) => setConfirmPassword(text)}
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Please confirm password" />
                        <AsyncRule
                          message="The provided passwords do not match"
                          validationCallback={asyncEmailVerification}
                        />
                      </Validator>
                    </TextBox>
                  </div>
                </div>
                <div className="form-group">
                  <ValidationSummary id="summary7" />
                </div>
                <div className="form-group form-button">
                  <Button
                    width="100%"
                    type={loading ? "normal" : "default"}
                    disabled={loading}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={loading}
                    />
                    <span className="dx-button-text">Register</span>
                  </Button>
                  <a
                    to={"#"}
                    className="signup-image-link"
                    onClick={setPreviousStage}
                  >
                    Bank Details
                  </a>
                </div>
              </form>
            )}
          </div>
          <div className="signup-image">
            <figure>
              <img src="./images/signup.jpg" alt="sing up image"></img>
            </figure>
            <Link to="/signin" className="signup-image-link">
              I am already member
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
