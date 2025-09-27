import { useState } from "react";
import { Card } from "../components/card";
import { Row } from "../components/row";
import { Col } from "../components/column";

const Signup = () => {
  return (
    <section className="signup">
      <div className="container">
        <div className="signup-content">
          <div className="signup-form">
            <h2 className="form-title">Sign up</h2>
            <form method="POST" className="register-form" id="register-form">
              <div className="form-group">
                <div className="">
                  <input
                    name="uname"
                    type="text"
                    placeholder="Your Name"
                    className="form-control input-height"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="">
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    className="form-control input-height"
                 />
                </div>
              </div>
              <div className="form-group">
                <div className="">
                  <input
                    name="pwd"
                    type="password"
                    placeholder="Password"
                    className="form-control input-height"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="">
                  <input
                    name="re-pwd"
                    type="password"
                    placeholder="Repeat Password"
                    className="form-control input-height"
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="checkbox"
                  name="agree-term"
                  id="agree-term"
                  className="agree-term"
                />
                <label htmlFor="agree-term" className="label-agree-term">
                  <span>
                    <span></span>
                  </span>
                  I agree all statements in{" "}
                  <a href="#" className="term-service">
                    Terms of service
                  </a>
                </label>
              </div>
              <div className="form-group form-button">
                <button
                  className="btn btn-round btn-primary"
                  name="signup"
                  id="register"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
          <div className="signup-image">
            <figure>
              <img
                src="./images/signup.jpg"
                alt="sing up image"
              ></img>
            </figure>
            <a href="login.html" className="signup-image-link">
              I am already member
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
