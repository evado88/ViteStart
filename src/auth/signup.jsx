import { useState, useEffect } from "react";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";
import { TextBox } from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import { Validator, RequiredRule } from "devextreme-react/validator";
import DateBox from "devextreme-react/date-box";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link, NavLink, useLocation } from "react-router-dom";

const Signup = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState(1);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFormSubmit1 = async (e) => {
    e.preventDefault();

    setStage(2);
  };

  const onFormSubmit2 = async (e) => {
    e.preventDefault();

    setStage(3);
  };

  const onFormSubmit3 = async (e) => {
    setLoading(true);

    e.preventDefault();

    setTimeout(() => {
      setLoading(false);

      login(username);
    }, 3000);
  };

  return (
    <section className="signup">
      <div className="container">
        <div className="signup-content">
          <div className="signup-form">
            <h2 className="form-title">Sign up</h2>

            {stage == 1 && (
              <form
                className="register-form"
                id="form1"
                onSubmit={onFormSubmit1}
              >
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Personal Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">First name</div>
                    <TextBox
                      className="dx-field-value"
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
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Last name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Mobile 1</div>
                    <TextBox
                      className="dx-field-value"
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Mobile 1 is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Mobile 2</div>
                    <TextBox
                      className="dx-field-value"
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Mobile 2 is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Email</div>
                    <TextBox
                      className="dx-field-value"
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Email is required" />
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
                    id="button"
                    type="default"
                    disabled={loading}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={loading}
                    />
                    <span className="dx-button-text">
                      {stage == 3 ? "Register" : "Next"}
                    </span>
                  </Button>
                </div>
              </form>
            )}
            {stage == 2 && (
              <form
                className="register-form"
                id="form2"
                onSubmit={onFormSubmit2}
              >
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Guarantor Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">First name</div>
                    <TextBox
                      className="dx-field-value"
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Gurantor first name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Last name</div>
                    <TextBox
                      className="dx-field-value"
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Gurantor last name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Mobile</div>
                    <TextBox className="dx-field-value" />
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Email</div>
                    <TextBox className="dx-field-value">
                      {" "}
                      <Validator>
                        <RequiredRule message="Gurantor mobile is required" />
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
                    id="button"
                    type="default"
                    disabled={loading}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={loading}
                    />
                    <span className="dx-button-text">
                      {stage == 3 ? "Register" : "Next"}
                    </span>
                  </Button>
                </div>
              </form>
            )}
            {stage == 3 && (
              <form
                className="register-form"
                id="form3"
                onSubmit={onFormSubmit3}
              >
                <div className="dx-fieldset">
                  <div className="dx-fieldset-header">Bank Details</div>
                  <div className="dx-field">
                    <div className="dx-field-label">Bank</div>
                    <TextBox
                      className="dx-field-value"
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
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Branch name is required" />
                      </Validator>
                    </TextBox>
                  </div>
                  <div className="dx-field">
                    <div className="dx-field-label">Account name</div>
                    <TextBox className="dx-field-value">
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
                    >
                      {" "}
                      <Validator>
                        <RequiredRule message="Account number is required" />
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
                    id="button"
                    type="default"
                    disabled={loading}
                    useSubmitBehavior={true}
                  >
                    <LoadIndicator
                      className="button-indicator"
                      visible={loading}
                    />
                    <span className="dx-button-text">
                      {stage == 3 ? "Register" : "Next"}
                    </span>
                  </Button>
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
