import React, { useState, useEffect } from "react";
import { TextBox } from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import { Validator, RequiredRule } from "devextreme-react/validator";
import DateBox from "devextreme-react/date-box";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link, NavLink, useLocation } from "react-router-dom";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFormSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    setTimeout(() => {
      setLoading(false);

      login(username);
    }, 1000);
  };
  return (
    <section className="sign-in">
      <div className="container">
        <div className="signin-content">
          <div className="signin-image">
            <figure>
              <img src="./images/key.png" alt="sing up image"></img>
            </figure>
            <Link to={"/signup"} className="signup-image-link">
              Create an account
            </Link>
          </div>
          <div className="signin-form">
            <h2 className="form-title">SACCO</h2>
            <form
              className="register-form"
              id="login-form"
              onSubmit={onFormSubmit}
            >
              <div className="dx-fieldset">
                <div className="dx-fieldset-header">Login</div>
                <div className="dx-field">
                  <div className="dx-field-label">Username</div>
                  <TextBox
                    className="dx-field-value"
                    validationMessagePosition="left"
                    inputAttr={{ "aria-label": "Userame" }}
                    placeholder="Username"
                    disabled={loading}
                    value={username}
                    onValueChange={(text) => setUsername(text)}
                  >
                    {" "}
                    <Validator>
                      <RequiredRule message="Username is required" />
                    </Validator>
                  </TextBox>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Password</div>
                  <TextBox
                    className="dx-field-value"
                    validationMessagePosition="left"
                    inputAttr={{ "aria-label": "Password" }}
                    placeholder="Password"
                    disabled={loading}
                    mode="password"
                    value={password}
                    onValueChange={(text) => setPassword(text)}
                  >
                    {" "}
                    <Validator>
                      <RequiredRule message="Password is required" />
                    </Validator>
                  </TextBox>
                </div>
              </div>
              <div className="form-group">
                <ValidationSummary id="summary" />
              </div>
              <div className="form-group form-button">
                <Button
                  width="100%"
                  text="Login"
                  type={loading ? "normal" : "default"}
                  disabled={loading}
                  useSubmitBehavior={true}
                >
                  <LoadIndicator
                    className="button-indicator"
                    visible={loading}
                  />
                  <span className="dx-button-text">Login</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
