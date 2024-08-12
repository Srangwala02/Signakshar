//PopupMain proper
import React, { useState } from "react";
import { Popup } from "devextreme-react/popup";
import Button from "devextreme-react/button";
import "./PopupMain.scss";
import closeBtn from "../../icons/close-line.svg";
import { useNavigate } from "react-router-dom";
import { Calendar, DateBox, TextBox } from "devextreme-react";
import SignatureSetup from "../manageUser/signatureSetup/SignatureSetup";
import SignSubPanel from "../manageUser/signatureSetup/SignSubPanel";
import SignatureContentMain from "../manageUser/signatureSetup/SignatureContentMain";

function PopupMain({
  mainTitle,
  subTitle,
  mainBtnText,
  visible,
  onClose,
  onNavigate,
  source,
  popupWidth,
  setSignString,
  signString,
  mainTabItemValue,
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
  loggedInUserDetail,
  setInitialsCanvas,
  initialsCanvas,
  setApplyCompanyStampData,
  applyCompanyStampData,
  handleCompanyStampDone,
}) {
  const navigate = useNavigate();
  const [navigationPath, setNavigationPath] = useState("");
  const timeLabel = { "aria-label": "Time" };
  const now = new Date();
  const dateBoxLabel = { "aria-label": "Date" };
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  const handleNavigate = () => {
    console.log(
      "selectedDate : ",
      selectedDate1,
      "selectedTime : ",
      selectedTime
    );
    onNavigate(selectedDate1, selectedTime);
  };

  const handleDateChange = (e) => {
    const date = new Date(e.value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    setSelectedDate(e.value);
    setSelectedDate1(formattedDate);
    // setCurrentDate()
  };

  const handleTimeChange = (e) => {
    // console.log("--------------");
    const date = new Date(e.value);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    console.log("formattedTime : ", formattedTime);
    setSelectedTime(formattedTime);
  };

  const renderMiddleSection = () => {
    if (source === "send") {
      return <div className="middle-send">Document Sent</div>;
    } else if (source === "schedulesend") {
      return (
        <div className="middle-schedule-send">
          <Calendar
            className="schedule-send-calender"
            onValueChanged={(e) => {
              handleDateChange(e);
            }}
            value={selectedDate}
            min={new Date()}
          />
          <div className="schedule-popup-userbox">
            <div className="date-inputs">
              <div className="user-text-calender">
                Date <span className="required-field">*</span>
              </div>
              <DateBox
                value={selectedDate}
                onValueChanged={handleDateChange}
                inputAttr={dateBoxLabel}
                displayFormat="dd/MM/yyyy"
                stylingMode="outlined"
                className="input-user-data-calender"
                defaultValue={currentDate}
                min={new Date()}
                placeholder="Date"
              />
              <div className="user-text-calender">
                Time <span className="required-field-schedule">*</span>
              </div>
              <DateBox
                defaultValue={now}
                onValueChanged={handleTimeChange}
                inputAttr={timeLabel}
                type="time"
                stylingMode="outlined"
                className="input-user-data-calender"
              />
            </div>
          </div>
        </div>
      );
    } else if (source == "editpen") {
      return (
        <>
          {/* <SignatureSetup/> */}
          {/*<SignatureContentMain signSource="signPopup" />*/}
          <SignatureContentMain
            signSource="signPopup"
            setSignString={setSignString}
            signString={signString}
            onClose={onClose}
            mainTabItemValue={mainTabItemValue}
            setSignImage={setSignImage}
            signImage={signImage}
            setApplySignatureData={setApplySignatureData}
            applySignatureData={applySignatureData}
            setSignatureCanvas={setSignatureCanvas}
            signatureCanvas={signatureCanvas}
            handleSignatureDone={handleSignatureDone}
            setApplyInitialsData={setApplyInitialsData}
            applyInitialsData={applyInitialsData}
            handleInitialsDone={handleInitialsDone}
            setInitialsCanvas={setInitialsCanvas}
            initialsCanvas={initialsCanvas}
            loggedInUserDetail={loggedInUserDetail}
            setApplyCompanyStampData={setApplyCompanyStampData}
            applyCompanyStampData={applyCompanyStampData}
            handleCompanyStampDone={handleCompanyStampDone}
            // setSignatureCanvas={setSignatureCanvas}
            // mainTabItemValue={mainTabItemValue}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const renderPopupBody = () => {
    if (source === "editpen") {
      return null; // Don't render the body if source is "editpen"
    }

    return (
      <div className="popup-custom-body">
        <div className="popup-button-container">
          <Button className="my-btn-cancel" text="Cancel" onClick={onClose} />
          <Button
            className="my-btn-continue"
            text={mainBtnText}
            onClick={handleNavigate}
          />
        </div>
      </div>
    );
  };

  return (
    <Popup
      visible={visible}
      showTitle={false}
      width={popupWidth}
      height="auto"
      className="abc"
      hideOnOutsideClick={true}
      onHiding={onClose}
    >
      <div className="popup-content">
        <div className="popup-custom-header">
          <div className="popup-headings">
            <div className="popup-head1">{mainTitle}</div>
            <div className="popup-head2">{subTitle}</div>
          </div>
          <Button
            icon={closeBtn}
            className="closeBtnInHeader"
            onClick={onClose}
          />
        </div>
        {renderMiddleSection()}
        {renderPopupBody()}
      </div>
    </Popup>
  );
}

export default PopupMain;
