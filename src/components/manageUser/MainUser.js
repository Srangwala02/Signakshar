import axios from "axios";
import React,{useState} from "react";
import "../manageUser/forgotPwd/ForgotPwd";
import ForgotPwd from "../manageUser/forgotPwd/ForgotPwd";
import { toastDisplayer } from "../toastDisplay/toastDisplayer";
import OtpVerification from "./otpVerification/OtpVerification";

export default function MainUser() {


    const [email, setEmail] = useState(""); // State to store the entered email
    const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  
  const handleContinue =async () => {
    if (emailValidatorRef.current.instance.validate().isValid && email!=="") {

      const response = await axios.post(`http://localhost:8000/api/sendOtp/`,
      {
               email : email,
               "filter":"F"
      
      })

      if(response.data.success===false && response.data.message==="User already verified but still you can request after 5 min..!!"){
        return toastDisplayer("error","User already verified but still you can request after 5 min..!!")
      }

      setShowOtpVerification(true);
    }
    else{
      return toastDisplayer("error","Invalid Email Address");
    }
  };
  
  const emailValidatorRef = React.createRef();
  return (
    <div className="container-main">
      <div className="box box-1"></div>

      
      <div className="box box-2">
        <div className="card">
          <div className="upper-section">Sign-akshar</div>

          {/* <div className="lower-section"> */}
          {showOtpVerification ? (
                <OtpVerification  showOtpVerification={showOtpVerification} setShowOtpVerification={setShowOtpVerification} email={email} setEmail={setEmail} handleContinue={handleContinue} emailValidatorRef={emailValidatorRef}  />
              ) : (
                <ForgotPwd 
                  emailValidatorRef={emailValidatorRef} 
                  email={email}
                  handleContinue={handleContinue} 
                  setEmail={setEmail} 
                />

              )}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
