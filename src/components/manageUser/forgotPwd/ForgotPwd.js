// import React from "react";
// import TextBox from "devextreme-react/text-box";
// import  Button from "devextreme-react/button";

// // import { createAccount } from '../../api/auth';
// // import { createAccount } from "../../../api/auth";
// import "./ForgotPwd.scss";

// export default function ForgotPwd() {
//   return (
//     <>
//       <div className="container-main">
//         <div className="box box-1"></div>
//         <div className="box box-2">
//           <div className="card">
//             <div className="upper-section">Sign-akshar</div>

//             <div className="lower-section">
//               <div>
//                 <p className="resetText">Reset Password</p>
//                 <p className="resetTxtInfo">
//                   Enter your email address to get an OTP to reset your password
//                 </p>
//               </div>

//               <div>
//                 <p className="emailText">Email Address *</p>
//                 <TextBox
//                   placeholder="Enter email address"
//                   stylingMode="outlined"
//                   width={"100%"}
//                   className="custom-textbox"
//                 />

//                 <Button
//                   // text="Continue"
//                   type="default"
//                   width={"100%"}
//                   height={48}
//                   stylingMode="contained"
//                   className="custom-button"
//                 >Continue</Button>

//                 <p className="termsText">
//                   I agree with your <a href="" className="termslink">Terms of Service</a>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

////// adding new component of otpverification
// import React, { useState } from "react";
// import TextBox from "devextreme-react/text-box";
// import Button from "devextreme-react/button";
// import OtpVerification from "../otpVerification/OtpVerification"; // Import your OTP verification component
// import "./ForgotPwd.scss";

// export default function ForgotPwd() {
//   const [showOtpVerification, setShowOtpVerification] = useState(false); // State to manage whether to show OTP verification

//   // Function to handle continue button click
//   const handleContinue = () => {
//     // Perform any necessary actions here, like sending OTP
//     // Then update state to show OTP verification component
//     setShowOtpVerification(true);
//   };

//   return (
//     <>
//       <div className="container-main">
//         <div className="box box-1"></div>
//         <div className="box box-2">
//           <div className="card">
//             <div className="upper-section">Sign-akshar</div>

//             <div className="lower-section">
//               {/* Conditional rendering based on showOtpVerification state */}
//               {showOtpVerification ? (
//                 <OtpVerification /> // Render OTP verification component
//               ) : (
//                 <>
//                   <div>
//                     <p className="resetText">Reset Password</p>
//                     <p className="resetTxtInfo">
//                       Enter your email address to get an OTP to reset your
//                       password
//                     </p>
//                   </div>

//                   <div>
//                     <p className="emailText">Email Address *</p>
//                     <TextBox
//                       placeholder="Enter email address"
//                       stylingMode="outlined"
//                       width={"100%"}
//                       className="custom-textbox"
//                     />
//                     <Button
//                       onClick={handleContinue} // Call handleContinue function on button click
//                       type="default"
//                       width={"100%"}
//                       height={48}
//                       stylingMode="contained"
//                       className="custom-button"
//                     >
//                       Continue
//                     </Button>

//                     <p className="termsText">
//                       I agree with your{" "}
//                       <a href="" className="termslink">
//                         Terms of Service
//                       </a>
//                     </p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

///// validating email
// import React, { useState } from "react";
// import TextBox from "devextreme-react/text-box";
// import Button from "devextreme-react/button";
// import OtpVerification from "../otpVerification/OtpVerification"; // Import your OTP verification component
// import {
//     Validator,
//     EmailRule
//   } from 'devextreme-react/validator';
// import "./ForgotPwd.scss";

// export default function ForgotPwd() {
//   const [email, setEmail] = useState(""); // State to store the entered email
//   const [showOtpVerification, setShowOtpVerification] = useState(false); // State to manage whether to show OTP verification

//   // Function to handle continue button click
//   const handleContinue = () => {
//     // Perform validation using DevExtreme's Validator component
//     if (emailValidatorRef.current.instance.validate().isValid && email!=="") {
//       // Perform any necessary actions here, like sending OTP
//       // Then update state to show OTP verification component
//       setShowOtpVerification(true);
//     }
//   };

//   // Ref for email validator component
//   const emailValidatorRef = React.createRef();

//   return (
//     <>
//       <div className="container-main">
//         <div className="box box-1"></div>
//         <div className="box box-2">
//           <div className="card">
//             <div className="upper-section">Sign-akshar</div>

//             <div className="lower-section">
//               {/* Conditional rendering based on showOtpVerification state */}
//               {showOtpVerification ? (
//                 <OtpVerification email={email} /> // Pass email as prop to OTP verification component
//               ) : (
//                 <>
//                   <div>
//                     <p className="resetText">Reset Password</p>
//                     <p className="resetTxtInfo">
//                       Enter your email address to get an OTP to reset your
//                       password
//                     </p>
//                   </div>

//                   <div>
//                     <p className="emailText">Email Address *</p>
//                     <TextBox
//                       placeholder="Enter email address"
//                       stylingMode="outlined"
//                       width={"100%"}
//                       className="custom-textbox"
//                       value={email}
//                       onValueChanged={(e) => setEmail(e.value)} // Update email state on value change
//                     >
//                       {/* Apply email validation rule */}
//                       <Validator ref={emailValidatorRef}>
//                         <EmailRule message="Please enter a valid email address." />
//                       </Validator>
//                     </TextBox>
//                     <Button
//                       onClick={handleContinue} // Call handleContinue function on button click
//                       type="default"
//                       width={"100%"}
//                       height={48}
//                       stylingMode="contained"
//                       className="custom-button"
//                       // disabled={!email}
//                     >
//                       Continue
//                     </Button>

//                     <p className="termsText">
//                       I agree with your{" "}
//                       <a href="" className="termslink">
//                         Terms of Service
//                       </a>
//                     </p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React from "react";
import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import { Validator, EmailRule } from "devextreme-react/validator";
import "./ForgotPwd.scss";
import { useNavigate } from "react-router-dom";

export default function ForgotPwd({
  setEmail,
  email,
  handleContinue,
  emailValidatorRef,
}) {
  const navigate = useNavigate();
  const onbackClick = () => {
      navigate("/SignInForm");  
  }
  return (
    <>
      <Button
        icon="back"
        className="backBtn"
        text="Go Back"
        onClick={onbackClick}
        width={"auto"}
      />
      <div className="lower-section">
        <div>
          <p className="resetText">Reset Password</p>
          <p className="resetTxtInfo">
            Enter your email address to get an OTP to reset your password
          </p>
        </div>

        <div>
          <p className="emailText">
            Email Address <span className="required-field">*</span>
          </p>
          <TextBox
            placeholder="Enter email address"
            stylingMode="outlined"
            width={"100%"}
            className="custom-textbox"
            value={email}
            onValueChanged={(e) => setEmail(e.value)}
          >
            <Validator ref={emailValidatorRef}>
              <EmailRule message="Please enter a valid email address." />
            </Validator>
          </TextBox>
          <Button
            onClick={handleContinue} // Call handleContinue function on button click
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
      </div>
    </>
  );
}
