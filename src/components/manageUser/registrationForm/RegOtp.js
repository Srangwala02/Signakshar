import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "devextreme-react/button";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { ReactComponent as TickIcon } from "../../../SVG/checkbox-circle-fill.svg";

function RegOtp() {
  const location = useLocation();
  const regEm = location.state?.regEmail;
  const regPw = location.state?.regPwd;
  const navigate = useNavigate();
  const [regOtp, setregOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const length = 6;
  const [timer, setTimer] = useState(60);
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const [verified, setVerified] = useState(false);

  const handleRetryClick = () => {
    setTimer(60);
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const onRegOtpSubmit = async (combinedOtp) => {
    try {
      const verifyResponse = await axios.post(
        `http://localhost:8000/api/verifyOtp/`,
        {
          email: regEm,
          otp: combinedOtp,
        }
      );
      if (
        verifyResponse.data.Status === 200 &&
        verifyResponse.data.StatusMsg === "OTP veryfied..!!" || verifyResponse.data.StatusMsg==="OTP already veryfied..!!"
      ) {
        toastDisplayer("success", "OTP Verified!");
        setVerified(true);
        navigate('/SignatureSetup',{state: {regEmail : regEm ,regPwd : regPw}})
      }else if(verifyResponse.data.Status===400 && verifyResponse.data.StatusMsg==="Invalid Email or OTP ..!!" ){
        return toastDisplayer("error","Invalid OTP");
      }

      
    } catch (error) {
      if (error.response.data.success === false) {
        return toastDisplayer("error", "OTP verification failed");
      }
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...regOtp];
    newOtp[index] = value.substring(value.length - 1);
    setregOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onRegOtpSubmit(combinedOtp);

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval
  }, [timer]);

  const handleNotYouClick = () => {
    setVerified(false);
    navigate("/RegistrationForm");
  };

  

  return (
    <div className="container-main">
      <div className="box box-1"></div>

      <div className="box box-2">
        <div className="card">
          <div className="upper-section">Sign-akshar</div>
     
          <div className="lower-section">
            <div>
              <p className="step">Step 2 of 3</p>
              <p className="resetText">OTP Verification</p>
              <p className="resetTxtInfo">
                Sent to {regEm}{" "}
                <button className="notyouTxt" onClick={handleNotYouClick}>
                  Not you?
                </button>
              </p>
            </div>

            <div className="main-container1">
              <div className="otp-main">
                {regOtp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    className="otpInput"
                  />
                ))}
              </div>
            </div>

            <div className="footer-main">
              {verified ? (
                <div className="verified-parent">
                  <span className="verified-symbol">
                    <TickIcon />
                  </span>
                  <span className="verified-text">Verified Successfully</span>
                </div>
              ) : (
                <span className="Pre-text">
                  {timer > 0 ? (
                    <>
                      Didn't get an OTP ?{"  "}
                      <span className="boldText">
                        Retry in {minutes.toString().padStart(2, "0")} :{" "}
                        {seconds.toString().padStart(2, "0")}
                      </span>
                    </>
                  ) : (
                    "Didn’t get an OTP ? "
                  )}
                  {timer === 0 && (
                    <span className="notyouTxt" onClick={handleRetryClick}>
                      <span className="resendTxt">Click here to resend</span>
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegOtp;
