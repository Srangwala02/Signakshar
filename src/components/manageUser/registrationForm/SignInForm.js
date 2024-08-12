import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextBox from "devextreme-react/text-box";
import CheckBox from "devextreme-react/check-box";
import Button from "devextreme-react/button";
import Validator from "devextreme-react/validator";
import { ReactComponent as IconCheckbox } from "../../../icons/checkbox-line.svg";
import { ReactComponent as IconCheckboxblankline } from "../../../icons/checkbox-blank-line.svg";
import { Button as TextBoxButton } from "devextreme-react/text-box";
import {
  CustomRule,
  EmailRule,
} from "devextreme-react/form";
// import { createAccount } from '../../api/auth';
import { createAccount } from "../../../api/auth";
// import {mysignIn} from "../../../contexts/auth"
import "./RegistrationForm.scss";
import GoogleIcon from "./google.jpeg";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../../contexts/auth";

export default function SignInForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedLowercase, setCheckedLowercase] = useState(false);
  const [checkedUppercase, setCheckedUppercase] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedSpecialCharacter, setCheckedSpecialCharacter] = useState(false);
  const [password, setPassword] = useState("");
  const formData = useRef({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const emailValidatorRef = React.createRef();
  const passwordValidatorRef = React.createRef();
  const { signIn, signInWithGoogle } = useAuth();
  const [showpwd, setshowpwd] = useState(false);
  const [passwordMode, setPasswordMode] = useState("password");

  const handlePasswordChange = (e) => {
    setPassword(e.value);
    if (e.value.length >= 8) {
      setChecked(true);
    } else {
      setChecked(false);
    }
    const hasLowercase = /[a-z]/.test(e.value);
    setCheckedLowercase(hasLowercase);

    const hasUppercase = /[A-Z]/.test(e.value);
    setCheckedUppercase(hasUppercase);

    const hasNumber = /[0-9]/.test(e.value);
    setCheckedNumber(hasNumber);

    const hasSpecialCharacter = /[^\w\s]/.test(e.value);
    setCheckedSpecialCharacter(hasSpecialCharacter);
  };
  const validatePassword = () => {
    return (
      checked &&
      checkedLowercase &&
      checkedUppercase &&
      checkedNumber &&
      checkedSpecialCharacter
    );
  };

  const handleContinue = async () => {
    const isEmailValid = emailValidatorRef.current.instance.validate().isValid;

    const isPasswordValid =
      passwordValidatorRef.current.instance.validate().isValid;
    console.log("isEmailValid", isEmailValid);
    console.log("isPasswordValid", isPasswordValid);
    if (!isEmailValid) {
      return toastDisplayer("error", "Enter correct Email");
    }
    if (!isPasswordValid) {
      return toastDisplayer("error", "Enter correct password");
    }
    if (isEmailValid && isPasswordValid) {
      const result = await signIn(email, password);
    }
  };

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => signInWithGoogle(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  return (
    <>
      <div className="container-main">
        <div className="box box-1"></div>

        <div className="box box-2">
          <div className="card">
            <div className="upper-section">Sign-akshar</div>
            <div className="lower-section">
              {/* <div className="step">Step 1 of 3</div> */}
              <div className="create-acc">
                Login into an account to sign document easily
              </div>
              <div className="already">
                Don’t have an account?{" "}
                <Link to="/RegistrationForm" className="login">
                  Create an account
                </Link>
              </div>
              <div className="email-add">
                Email Address <span className="required">*</span>
              </div>
              <TextBox
                placeholder="Enter Email address"
                stylingMode="outlined"
                width={"100%"}
                className="custom-textbox"
                value={email}
                onValueChanged={(e) => setEmail(e.value.toLowerCase())}
              >
                <Validator ref={emailValidatorRef}>
                  <EmailRule message="Please enter a valid email address." />
                </Validator>
              </TextBox>

              <div className="email-add">
                Password <span className="required">*</span>
              </div>
              <TextBox
                mode={passwordMode}
                stylingMode="outlined"
                placeholder="Enter password"
                className="custom-textbox"
                onFocusIn={() => {
                  setIsPasswordFocused(true);
                }}
                valueChangeEvent="keyup"
                onValueChanged={handlePasswordChange}
              >
                <Validator ref={passwordValidatorRef}>
                  <CustomRule
                    message="Password must meet the specified criteria."
                    validationCallback={validatePassword}
                  />
                </Validator>
                <TextBoxButton
                    name="password"
                    location="after"
                    options={{
                      icon: `${showpwd ? "eyeopen" : "eyeclose"}`,
                      stylingMode: "text",
                      onClick: () => {
                        setshowpwd(!showpwd);
                        setPasswordMode((prevPasswordMode) =>
                          prevPasswordMode === "text" ? "password" : "text"
                        );
                      },
                    }}
                  />
              </TextBox>
              {isPasswordFocused && (
                <>
                  <div
                    className="password-container"
                    style={{
                      backgroundColor: "#FBFBFB",
                      padding: "12px",
                      marginTop: "4px",
                    }}
                  >
                    <div className="password">Password must be</div>
                    {/* <div className="all-checkBox"> */}
                    <span className="checkbox">
                      {checked ? <IconCheckbox /> : <IconCheckboxblankline />}
                      Minimum of 8 character
                    </span>
                    <span className="checkbox">
                      {checkedLowercase ? (
                        <IconCheckbox />
                      ) : (
                        <IconCheckboxblankline />
                      )}{" "}
                      Include at least one lowercase letter (a-z)
                    </span>
                    <span className="checkbox">
                      {checkedUppercase ? (
                        <IconCheckbox />
                      ) : (
                        <IconCheckboxblankline />
                      )}{" "}
                      Include at least one Uppercase letter (A-Z)
                    </span>
                    <span className="checkbox">
                      {checkedNumber ? (
                        <IconCheckbox />
                      ) : (
                        <IconCheckboxblankline />
                      )}{" "}
                      Include at least number (0-9)
                    </span>
                    <span className="checkbox">
                      {checkedSpecialCharacter ? (
                        <IconCheckbox />
                      ) : (
                        <IconCheckboxblankline />
                      )}{" "}
                      Include 1 special character
                    </span>
                  </div>
                </>
              )}
              <div className="forgot-pass">
                <Link to="/MainUser" className="forgot-pass">
                  Forgot Password?
                </Link>
              </div>
              <Button
                className="submit-button"
                text="Continue"
                type="default"
                textTransform="none"
                onClick={handleContinue}
              />
              <div className="or">or</div>
              <Button
                className="google-button"
                // text="Continue with Google"
                type="default"
                textTransform="none"
                onClick={login}
              >
                <img
                  src={GoogleIcon}
                  width={25}
                  alt="Google Icon"
                  className="google-icon"
                />
                Continue with Google
              </Button>
              <div className="agree">
                I agree with your{" "}
                <Link to="/login" className="agree">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
