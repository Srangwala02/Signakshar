import React, { useState, useEffect } from "react";
import "./SignatureContentMain.scss";
import { TextBox } from "devextreme-react/text-box";
import Tabs, { Item } from "devextreme-react/tabs";
import TabPanel from "devextreme-react/tab-panel";
import { Button } from "devextreme-react/button";
import SignSubPanel from "./SignSubPanel";
import InitialPanel from "./InitialPanel";
import { useNavigate } from "react-router-dom";
import CompanyStampPanel from "./CompanyStampPanel";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useAuth } from "../../../contexts/auth";

function SignatureContentMain({
  signSource,
  signString,
  setSignString,
  mainTabItemValue,
  onClose,
  setSignImage,
  signImage,
  setApplySignatureData,
  applySignatureData,
  setSignatureCanvas,
  signatureCanvas,
  handleSignatureDone,
  setApplyInitialsData,
  applyInitialsData,
  handleInitialsDone,
  setInitialsCanvas,
  initialsCanvas,
  loggedInUserDetail,
  setApplyCompanyStampData,
  applyCompanyStampData,
  handleCompanyStampDone
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const regEm = location.state?.regEmail;
  const regPw = location.state?.regPwd;

  const [userSetupData, setUserSetupData] = useState();
  const [signatureDrawingData, setSignatureDrawingData] = useState(null);
  const [signatureImageData, setSignatureImageData] = useState(null);
  // const [loggedInUserId, setLoggedInUserId] = useState([]);
  const { user } = useAuth();
  // const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);

  // useEffect(() => {
  //   const getLoggedInUser = async () => {
  //     const response = await axios
  //       .get("http://localhost:8000/api/user/", {
  //         headers: {
  //           Authorization: `Bearer ${user}`,
  //         },
  //       })
  //       .then((response) => {
  //         console.log("USER DATA : ", response.data);
  //         setLoggedInUserId(response.data.id);
  //         // loggedInUserId = response.data.id;
  //       });
  //   };

  //   getLoggedInUser();
  // }, []);

  // useEffect(() => {
  //   const jwtToken = localStorage.getItem("jwt");
  //   // console.log("source : ", source);

  //   if (jwtToken != null) {
  //     const getLoggedInUser = async () => {
  //       const response = await axios
  //         .get("http://localhost:8000/api/user/", {
  //           headers: {
  //             Authorization: `Bearer ${user}`,
  //           },
  //         })
  //         .then((response) => {
  //           // console.log("USER DATA : ", response.data);
  //           setLoggedInUserdetail(response.data);
  //           // setApplySignatureData(response.data.signature_details.draw_img_name);
  //         });
  //     };
  //     getLoggedInUser();
  //   } else {
  //     return;
  //   }
  // }, []);

  const renderTabContent = () => {
    switch (mainTabItemValue) {
      case 1:
        return (
          <Item title="Signature">
            <div className="sub-tab-signature">
              <SignSubPanel
                signString={signString}
                setSignString={setSignString}
                setSignImage={setSignImage}
                signImage={signImage}
                source={"signingPopup"}
                setApplySignatureData={setApplySignatureData}
                applySignatureData={applySignatureData}
                setSignatureCanvas={setSignatureCanvas}
                signatureCanvas={signatureCanvas}
                loggedInUserDetail={loggedInUserDetail}
                // setSignatureDrawingData={setSignatureDrawingData}
                // signatureDrawingData={signatureDrawingData}
                // setSignatureImageData={setSignatureImageData}
                // signatureImageData={signatureImageData}
              />
            </div>
          </Item>
        );
      case 2:
        return (
          <Item title="Initials">
            <div className="sub-tab-signature">
              <InitialPanel
                signString={signString}
                setSignString={setSignString}
                source={"signingPopup"}
                setApplyInitialsData={setApplyInitialsData}
                applyInitialsData={applyInitialsData}
                setInitialsCanvas={setInitialsCanvas}
                initialsCanvas={initialsCanvas}
                loggedInUserDetail={loggedInUserDetail}
              />
            </div>
          </Item>
        );
      case 3:
        return (
          <Item title="Company Stamp">
            <div className="sub-tab-signature">
              {/* {console.log("Render CS")} */}
              <CompanyStampPanel
                source={"signingPopup"}
                loggedInUserDetail={loggedInUserDetail}
                setApplyCompanyStampData={setApplyCompanyStampData}
                applyCompanyStampData={applyCompanyStampData}
              />
            </div>
          </Item>
        );
      default:
        return null;
    }
  };

  // useEffect(() => {
  //   // Fetch user data when the component mounts
  //   const fetchUserData = async () => {
  //     try {
  //       const jwtToken = localStorage.getItem("jwt");
  //       const response = await axios.get("http://localhost:8000/api/user/", {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`, // Pass JWT token in the Authorization header
  //         },
  //       });
  //       // console.log("resp",response);
  //       setUserSetupData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();

  //   return () => {
  //     // Cleanup function
  //     console.log("userSetupData : ",userSetupData)
  //   };
  // }, [userSetupData]);

  const handleBtnClick = () => {
    console.log("B1 clicked");
  };

  const handleBtnApplySignClick = async () => {
    if (mainTabItemValue === 1) {
      handleSignatureDone();
    } else if (mainTabItemValue === 2) {
      console.log("tab 2");
      handleInitialsDone();
    }else if (mainTabItemValue === 3) {
      console.log("CS");
      // console.log("applyCompanyStampData :", applyCompanyStampData);
      handleCompanyStampDone();
    }
  };

  return (
    <>
      <div className="popup-custom-tab-panel-container">
        <TabPanel className="mytabpanel">{renderTabContent()}</TabPanel>

        {/* {signSource !== "signPopup" && ( */}
        <div className="bottom-panel-popup">
          <div className="skip-step">
            {signSource !== "signPopup" && (
              <span className="skip-step-text">
                <a onClick={handleBtnApplySignClick}>Skip this step</a>
              </span>
            )}
          </div>
          <div className="button-container">
            <Button className="my-btn-cancel" text="Cancel" onClick={onClose} />
            <Button
              className="my-btn-continue"
              text="Apply Sign"
              onClick={handleBtnApplySignClick}
            />
          </div>
        </div>
        {/* )} */}
      </div>
    </>
  );
}

export default SignatureContentMain;
