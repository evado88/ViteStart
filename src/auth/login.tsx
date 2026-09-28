import React, { useState, useEffect } from "react";
import { TextBox, Button as TextBoxButton } from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import {
  Validator,
  RequiredRule,
  CustomRule,
} from "devextreme-react/validator";
import ValidationSummary from "devextreme-react/validation-summary";
import { LoadIndicator } from "devextreme-react/load-indicator";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Assist from "../classes/assist";
import { LoadPanel } from "devextreme-react/load-panel";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //two-factor: the server sends the code and checks it; the page only
  //holds the short-lived ticket that identifies this login attempt
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [mobileHint, setMobileHint] = useState("");
  const [code, setCode] = useState("");

  const [stage, setStage] = useState(1);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const startOTP = (data: any) => {
    setOtpToken(data.otp_token);
    setMobileHint(data.mobile_hint);
    setCode("");
    setStage(2);
    Assist.showMessage(
      `A one time password has been sent to your WhatsApp number ${data.mobile_hint} and your email ${data.email_hint}`,
      "success",
    );
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    setSaving(true);

    e.preventDefault();

    const formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);

    setTimeout(() => {
      Assist.postPutData("Login", "auth/login", formData, 0)
        .then((data: any) => {
          setSaving(false);

          if (data.otp_required) {
            startOTP(data);
          } else {
            login(data.access_token);
          }
        })
        .catch((message) => {
          setSaving(false);
          Assist.showMessage(message, "error");
        });
    }, Assist.DEV_DELAY);
  };

  const resendOTP = () => {
    setLoading(true);
    Assist.postPutData("Resend Code", "auth/resend-otp", { otp_token: otpToken }, 0)
      .then((data: any) => {
        setLoading(false);
        startOTP(data);
      })
      .catch((message) => {
        setLoading(false);
        Assist.showMessage(message, "error");
      });
  };

  const onOTPFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    Assist.postPutData(
      "Verify Code",
      "auth/verify-otp",
      { otp_token: otpToken, code: code },
      0,
    )
      .then((data: any) => {
        setLoading(false);
        login(data.access_token);
      })
      .catch((message) => {
        setLoading(false);
        Assist.showMessage(message, "error");
      });
  };
  return (
    <div id="pageRoot" className="auth-page">
      <LoadPanel
        shadingColor="rgba(0,0,0,0.2)"
        position={{ of: "#pageRoot" }}
        visible={loading}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />

      {/* brand panel */}
      <aside className="auth-brand">
        <div className="auth-brand-top">
          <div className="auth-logo">
            <span className="material-icons">people</span>
          </div>
          <div>
            <div className="auth-brand-name">OSAWE</div>
            <div className="auth-brand-sub">Village Bank</div>
          </div>
        </div>

        <div className="auth-brand-body">
          <h1>Your savings, loans and contributions in one place.</h1>
          <ul className="auth-features">
            <li>
              <span className="material-icons">account_balance_wallet</span>
              <div>
                <strong>Monthly postings</strong>
                <span>Submit savings, shares and repayments online.</span>
              </div>
            </li>
            <li>
              <span className="material-icons">account_balance</span>
              <div>
                <strong>Loans</strong>
                <span>See your balance, schedule and what is due.</span>
              </div>
            </li>
            <li>
              <span className="material-icons">receipt</span>
              <div>
                <strong>Statements</strong>
                <span>Every transaction, open to all members.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="auth-brand-foot">
          © {new Date().getFullYear()} OSAWE Cooperative (OSACCO)
        </div>
      </aside>

      {/* sign-in panel */}
      <main className="auth-main">
        <div className="auth-card">
          {stage == 1 && (
            <form id="login-form" onSubmit={onFormSubmit} noValidate>
              <h2 className="auth-title">Sign in</h2>
              <p className="auth-lead">
                Welcome back. Use the email address registered with the village bank.
              </p>

              <label className="auth-label" htmlFor="auth-email">
                Email address
              </label>
              <TextBox
                className="auth-input"
                stylingMode="outlined"
                mode="email"
                inputAttr={{ id: "auth-email", autocomplete: "username", "aria-label": "Email address" }}
                placeholder="name@example.com"
                disabled={saving}
                value={username}
                onValueChange={(text) => setUsername(text.trim())}
              >
                <Validator>
                  <RequiredRule message="Please enter your email address" />
                </Validator>
              </TextBox>

              <label className="auth-label" htmlFor="auth-password">
                Password
              </label>
              <TextBox
                className="auth-input"
                stylingMode="outlined"
                mode={showPassword ? "text" : "password"}
                inputAttr={{ id: "auth-password", autocomplete: "current-password", "aria-label": "Password" }}
                placeholder="Your password"
                disabled={saving}
                value={password}
                onValueChange={(text) => setPassword(text)}
              >
                <TextBoxButton
                  name="toggle"
                  location="after"
                  options={{
                    icon: showPassword ? "eyeclose" : "eyeopen",
                    stylingMode: "text",
                    hint: showPassword ? "Hide password" : "Show password",
                    onClick: () => setShowPassword(!showPassword),
                  }}
                />
                <Validator>
                  <RequiredRule message="Please enter your password" />
                </Validator>
              </TextBox>

              <ValidationSummary id="summary" className="auth-summary" />

              <Button
                className="auth-submit"
                width="100%"
                type="default"
                disabled={saving}
                useSubmitBehavior={true}
              >
                <LoadIndicator className="button-indicator" visible={saving} />
                <span className="dx-button-text">{saving ? "Signing in..." : "Sign in"}</span>
              </Button>

              <p className="auth-help">
                Forgotten your password? Please contact the secretariat.
              </p>
            </form>
          )}

          {stage == 2 && (
            <form id="otp-form" onSubmit={onOTPFormSubmit} noValidate>
              <div className="auth-otp-icon">
                <span className="material-icons">mail_outline</span>
              </div>
              <h2 className="auth-title">Check your phone and email</h2>
              <p className="auth-lead">
                We sent a 6-digit code to your WhatsApp number {mobileHint} and your email.
                Enter it below to finish signing in.
              </p>

              <label className="auth-label" htmlFor="auth-code">
                Verification code
              </label>
              <TextBox
                className="auth-input auth-code"
                stylingMode="outlined"
                inputAttr={{
                  id: "auth-code",
                  inputmode: "numeric",
                  autocomplete: "one-time-code",
                  maxlength: 6,
                  "aria-label": "Verification code",
                }}
                placeholder="000000"
                value={code}
                onValueChange={(text) => setCode(text.replace(/\D/g, ""))}
              >
                <Validator>
                  <RequiredRule message="Please enter the code" />
                  <CustomRule
                    validationCallback={(e) => /^\d{6}$/.test(e.value)}
                    message={`The code is the 6 digits sent to your WhatsApp and email`}
                  />
                </Validator>
              </TextBox>

              <ValidationSummary id="summary" className="auth-summary" />

              <Button
                className="auth-submit"
                width="100%"
                type="default"
                disabled={loading}
                useSubmitBehavior={true}
              >
                <LoadIndicator className="button-indicator" visible={loading} />
                <span className="dx-button-text">Verify and sign in</span>
              </Button>

              <div className="auth-links">
                <a href="#" onClick={(e) => { e.preventDefault(); resendOTP(); }}>
                  Send a new code
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); setStage(1); setCode(""); }}>
                  Back to sign in
                </a>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
