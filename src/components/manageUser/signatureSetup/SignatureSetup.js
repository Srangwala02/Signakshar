// original
import React, { useState } from "react";
import "./SignatureSetup.scss";
// import "devextreme/dist/css/dx.light.css";
import { TextBox } from "devextreme-react/text-box";
import { Item } from "devextreme-react/tabs";
import TabPanel from "devextreme-react/tab-panel";
import { Button } from "devextreme-react/button";
import SignSubPanel from "./SignSubPanel";
import InitialPanel from "./InitialPanel";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CompanyStampPanel from "./CompanyStampPanel";
import axios from "axios";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import SignatureContentMain from "./SignatureContentMain";

function SignatureSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [initials, setInitials] = useState("");

  const regEm = location.state?.regEmail;
  const regPw = location.state?.regPwd;
  const source = location.hash.includes('RegistrationForm') ? 'registrationform' : 'registrationform';

  const [signatureDrawingData, setSignatureDrawingData] = useState(null);
  const [signatureImageData, setSignatureImageData] = useState(null);
  const [initialDrawingData, setInitialDrawingData] = useState(null);
  const [initialImageData, setInitialImageData] = useState(null);
  const [companyStampImageData, setCompanyStampImageData] = useState(null);

  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [initialsCanvas, setInitialsCanvas] = useState(null);


  // console.log("reg Email: " , regEm);
  // console.log("reg Pwd: " , regPw);

  const handleFullNameChange = (e) => {
    setFullName(e.value);
  };

  const handleInitialsChange = (e) => {
    setInitials(e.value);
  };

  const handleBackClick = () => {
    navigate('/RegistrationForm');
  };

  const handleSkipBtn = async () =>{
    try {
        const response = await axios.post(
          "http://localhost:8000/api/register/",
          {
            email: regEm,
            password: regPw
          }
        );
        navigate("/SignInForm");
        toastDisplayer("success", "Registraion Successfully");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  const handleUserRegistration = async () => {
    try {
      if (fullName) {
        const response = await axios.post("http://localhost:8000/api/register/", {
        email: regEm,
        password: regPw,
        full_name: fullName,
        initial: initials,
        stamp_img_name: companyStampImageData,
        draw_img_name_signature: signatureDrawingData,
        img_name_signature: signatureImageData,
        draw_img_name_initials: initialDrawingData,
        img_name_initials: initialImageData
      });
        navigate("/SignInForm");
        toastDisplayer("success", "Registraion Successfully");
      } else {
        return toastDisplayer("error", "Enter your Full Name");
      }
      

    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <>
      <div className="container-main">
        <div className="box box-1"></div>
        <div className="box box-2">
          <div className="card">
            <div className="card-content">
              <div className="upper-section">Sign-akshar</div>
  
              <div className="lower-section">
                <div className="step">Step 3 of 3</div>
                <div className="main-title">Set up your signature details</div>
                <div className="sub-title">
                  Signature details for seamless document signing
                </div>
                <div className="user-detail">
                  <div className="userbox1">
                    <div className="user-text">
                      Full name <span className="required-field">*</span>
                    </div>
                    <TextBox
                      placeholder="Enter full name"
                      stylingMode="outlined"
                      className="input-user-data"
                      value={fullName}
                      onValueChanged={handleFullNameChange}
                    />
                  </div>
                  <div className="userbox2">
                    <div className="user-text">Initials</div>
                    <TextBox
                      placeholder="Enter initials"
                      stylingMode="outlined"
                      className="input-user-data"
                      value={initials}
                      onValueChanged={handleInitialsChange}
                    />
                  </div>
                </div>

                <div className="custom-tab-panel-container">
                  <TabPanel className="mytabpanel">
                    <Item title="Signature">
                      <div className="sub-tab-signature">
                        <SignSubPanel
                          setSignatureDrawingData={setSignatureDrawingData}
                          signatureDrawingData={signatureDrawingData}
                          setSignatureImageData={setSignatureImageData}
                          signatureImageData={signatureImageData}
                          source={"registrationform"} 
                          setSignatureCanvas={setSignatureCanvas}
                          signatureCanvas={signatureCanvas}
                        />
                      </div>
                    </Item>
                    <Item title="Initials">
                      <div className="sub-tab-signature">
                        <InitialPanel
                          setInitialDrawingData={setInitialDrawingData}
                          initialDrawingData={initialDrawingData}
                          setInitialImageData={setInitialImageData}
                          initialImageData={initialImageData}
                          source={"registrationform"} 
                          setInitialsCanvas={setInitialsCanvas}
                          initialsCanvas={initialsCanvas}
                        />
                      </div>
                    </Item>
                    <Item title="Company Stamp">
                      <div className="sub-tab-signature">
                        <CompanyStampPanel
                          setCompanyStampImageData={setCompanyStampImageData}
                          companyStampImageData={companyStampImageData}
                          source={"registrationform"}
                        />
                      </div>
                    </Item>
                  </TabPanel>
                  <div class="bottom-panel">
                    <div className="skip-step">
                      <span className="skip-step-text">
                        <a onClick={handleSkipBtn}>Skip this step</a>
                      </span>
                    </div>
                    <div className="button-container">
                      <Button
                        className="my-btn-cancel"
                        text="Back"
                        onClick={handleBackClick}
                      />
                      <Button
                        className="my-btn-continue"
                        text="Continue"
                        onClick={handleUserRegistration}
                      />
                    </div>
                  </div>
                </div>
                {/* <SignatureContentMain signSource="registrationSetup"/> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignatureSetup;
