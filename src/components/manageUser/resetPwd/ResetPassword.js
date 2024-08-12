import React, { useState } from "react";
import { ReactComponent as IconCheckbox } from "../../../icons/checkbox-line.svg";
import { ReactComponent as IconCheckboxblankline } from "../../../icons/checkbox-blank-line.svg";
import Form, { CustomRule } from "devextreme-react/form";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import Validator from "devextreme-react/validator";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword({ email }) {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [checkedLowercase, setCheckedLowercase] = useState(false);
  const [checkedUppercase, setCheckedUppercase] = useState(false);
  const [checkedNumber, setCheckedNumber] = useState(false);
  const [checkedSpecialCharacter, setCheckedSpecialCharacter] = useState(false);
  const passwordValidatorRef = React.createRef();
  const navigate = useNavigate();

  const validatePassword = () => {
    return (
      checked &&
      checkedLowercase &&
      checkedUppercase &&
      checkedNumber &&
      checkedSpecialCharacter
    );
  };

  const handlePasswordChange = (e) => {
    setPassword(e.value); // Make sure this line is correctly updating the state
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

  const handlenewPasswordChange = (e) => {
    setNewPassword(e.value);
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

  const handlePwdContinue = async () => {
    if (password === newpassword) {
      const isPasswordValid =
        passwordValidatorRef.current &&
        passwordValidatorRef.current.instance.validate().isValid;

      if (isPasswordValid) {
        try {
          const newPwdResponse = await axios.post(
            `http://127.0.0.1:8000/api/forgetPassword/`,
            {
              email: email,
              newPassword: newpassword,
            }
          );
          

          if (
            newPwdResponse.data.success === true &&
            newPwdResponse.data.message === "New Password Generated..!!"
          ) {
            toastDisplayer("success", "New Password generated!");
            navigate("/SignInForm");
          } else {
            return toastDisplayer(
              "error",
              "Error while generating new password"
            );
          }
        } catch (error) {
          if (
            error.response.data.success === false &&
            error.response.data.message === "User matching query does not exist."
          ) {
            return toastDisplayer("error", "This user doesnot exist");
          }
        }
      } else {
        return toastDisplayer("error", "Password is invalid");
      }
    } else {
      return toastDisplayer(
        "error",
        "Password and confirm password should be same"
      );
    }
  };

  // const onbackClick=()=>{
  //   navigate('/SignInForm');
  // }

  return (
    <>
    {/* <Button
        icon="back"
        className="backBtn"
        text="Go Back"
        onClick={onbackClick}
        width={"auto"}
      /> */}
      <div className="lower-section">
        <div>
          <p className="resetText">New Password</p>
          <p className="resetTxtInfo">
            Enter new password to get the account setup
          </p>
        </div>

        <div className="pwdField">
          <div className="email-add">
            New Password <span className="required">*</span>
          </div>
          <TextBox
            mode="password"
            stylingMode="outlined"
            placeholder="Enter password"
            className="custom-textbox"
            onFocusIn={() => {
              setIsPasswordFocused(true);
            }}
            onFocusOut={() => {
              setIsPasswordFocused(false);
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
                  {checkedNumber ? <IconCheckbox /> : <IconCheckboxblankline />}{" "}
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
        </div>

        <div className="newPwdField">
          <div className="email-add">
            Confirm New Password <span className="required">*</span>
          </div>
          <TextBox
            mode="password"
            stylingMode="outlined"
            placeholder="Enter password"
            className="custom-textbox"
            onFocusIn={() => {
              setIsNewPasswordFocused(true);
            }}
            // onFocusOut={() => {
            //   setIsNewPasswordFocused(false);
            // }}
            valueChangeEvent="keyup"
            onValueChanged={handlenewPasswordChange}
          >
            <Validator ref={passwordValidatorRef}>
              <CustomRule
                message="Password must meet the specified criteria."
                validationCallback={validatePassword}
              />
            </Validator>
          </TextBox>
          {isNewPasswordFocused && (
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
                  {checkedNumber ? <IconCheckbox /> : <IconCheckboxblankline />}{" "}
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
        </div>

        <Button
          onClick={handlePwdContinue} // Call handleContinue function on button click
          type="default"
          width={"100%"}
          height={48}
          stylingMode="contained"
          className="custom-button"
          // disabled={!email}
        >
          Continue
        </Button>

        <p className="termsText">
          I agree with your{" "}
          <a href="" className="termslink">
            Terms of Service
          </a>
        </p>
      </div>
    </>
  );
}

export default ResetPassword;
