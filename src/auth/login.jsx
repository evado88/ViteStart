import React, { useState, useEffect } from "react";
import { TextBox } from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import { Validator, RequiredRule } from "devextreme-react/validator";
import DateBox from "devextreme-react/date-box";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      navigate("/home");
    }
  }, [user, navigate]);

  const onFormSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    setTimeout(() => {
      setLoading(false);

      login(username);
    }, 3000);
  };
  return (
    <section className="sign-in">
      <div className="container">
        <div className="signin-content">
          <div className="signin-image">
            <figure>
              <img src="./images/signin.jpg" alt="sing up image"></img>
            </figure>
            <a href="sign_up.html" className="signup-image-link">
              Create an account
            </a>
          </div>
          <div className="signin-form">
            <h2 className="form-title">Login</h2>
            <form
              className="register-form"
              id="login-form"
              onSubmit={onFormSubmit}
            >
              <div className="form-group">
                <div>
                  <TextBox
                    validationMessagePosition="left"
                    inputAttr={{ "aria-label": "Userame" }}
                    placeholder="Username"
                    disabled={error}
                    value={username}
                    onValueChange={(text) => setUsername(text)}
                  >
                    <Validator>
                      <RequiredRule message="Username is required" />
                    </Validator>
                  </TextBox>
                </div>
              </div>
              <div className="form-group">
                <div>
                  <TextBox
                    validationMessagePosition="left"
                    inputAttr={{ "aria-label": "Password" }}
                    placeholder="Password"
                    disabled={error}
                    mode="password"
                    value={password}
                    onValueChange={(text) => setPassword(text)}
                  >
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
                  id="button"
                  text="Login"
                  type="default"
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
