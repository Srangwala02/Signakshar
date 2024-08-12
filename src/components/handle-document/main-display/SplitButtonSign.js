import React, { useState,useEffect } from "react";
import { Button, DropDownButton } from "devextreme-react";
import "./SplitButtonSign.scss";
import { useNavigate } from "react-router-dom";
import PopupMain from "../../customPopup/PopupMain";
import axios from "axios";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useAuth } from "../../../contexts/auth";
import { generateBucketName } from "../../manageUser/signatureSetup/PdfUtils";
import { LoadPanel } from "devextreme-react";

function SplitButtonSign({
  tid,
  did,
  tempYEs,
  selectedFile,
  screenValue,
  updateRecData,
  previewScreenValue,
  signerOptions,
  creatorid,
  templateDraggedData,
  emailAction,
  Expiration,docapiData
}) {
  const {user} = useAuth();
  const [userObj, setuserObj] = useState([]);

  useEffect(() => {
    const fetchuserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        });
        setuserObj(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchuserData();
  }, [user]);
  const [popupVisibleSend, setPopupVisibleSend] = useState(false);
  const [popupVisibleSchedule, setPopupVisibleSchedule] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const mergeDateAndTime = (dateString, timeString) => {
    const [day, month, year] = dateString.split("/");
    const [hours, minutes] = timeString.split(":");
    const mergedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    const formattedDateTime = mergedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    });

    return formattedDateTime;
  };

  const handleSendButtonClick = async (scheduleTime, scheduleDate) => {
    if(updateRecData.length!==0){
      var Schedule = false;
    if (
      scheduleTime != "" &&
      scheduleTime != undefined &&
      scheduleTime != null &&
      scheduleDate != "" &&
      scheduleDate != undefined &&
      scheduleDate != null
    ) {
      Schedule = true;
    }
    var payloadArray = [];
    await Promise.all(
      updateRecData.map(async (oneRec, index) => {
        var templateRecipient = [];
        if (screenValue && screenValue === "Document" && tempYEs === "yes"){
          templateRecipient = templateDraggedData.find(
            (recipient) => recipient.fullName === oneRec.name
          );
        }else{
          templateRecipient = templateDraggedData.find(
            (recipient) => recipient.name === oneRec.name
          );
        }
        if (templateRecipient) {
          const apiObj = {
            fieldName: oneRec.fieldName,
            color: oneRec.color,
            boxId: oneRec.id,
            pageNum: oneRec.pageNum,
            x: oneRec.x,
            y: oneRec.y,
            width: oneRec.width,
            height: oneRec.height,
            // docId: templateDraggedData[0].docId,
            docId: did,
            signer_status: templateRecipient.roleId == 1 ? "Unsigned" : "null",
            reviewer_status:
              templateRecipient.roleId == 2 ? "Approved" : "null",
            // docRecipientdetails_id: templateRecipient.id,
            docRecipientdetails_id:
              screenValue === "Document" && tempYEs === "yes"
                ? oneRec.signerId
                : templateRecipient.id,

            emailAction: emailAction,
          };

          console.log("apiObjcttt:", apiObj);
          payloadArray.push(apiObj);
        }
      })
    );

    var scheduleDateAndTime = "";
    if (
      scheduleTime != "" &&
      scheduleTime != undefined &&
      scheduleTime != null &&
      scheduleDate != "" &&
      scheduleDate != undefined &&
      scheduleDate != null
    ) {
      scheduleDateAndTime = mergeDateAndTime(scheduleDate, scheduleTime);
    }
    const newPayload = {
      // docId: templateDraggedData[0].docId,
      docId: did,
      s_send: false,
      recipient_data: payloadArray,
      Expiration: Expiration,
      Schedule: Schedule,
      scheduleDateAndTime: scheduleDateAndTime,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/save_doc_positions/",
        newPayload
      );

      if (response && response.data && !response.data.error && userObj) {
        const formData2 = new FormData();
        const dynamic_bucketName= generateBucketName(userObj.user.id,userObj.user.email);
        formData2.append("file", selectedFile,docapiData.name+".pdf");
        formData2.append("bucket_name",dynamic_bucketName);
        const responseBucket = await axios.post('http://localhost:8000/api/upload_file_to_s3/', formData2,{
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPopupVisibleSend(true);
      } 
      // else {

      //   if (!response2.data.success) {
      //     setLoading(false);
      //     throw new Error("Failed to upload file to AWS S3");
      //   }
      //   setLoading(false);
      //   setPopupVisibleSend(true);
      // } 
      else {
        setLoading(false);

        return toastDisplayer(
          "error",
          response.data?.message || "Unknown error occurred"
        );
      }
    } catch (error) {

      setLoading(false);
      return toastDisplayer("error", error.message || "Network error");
    }
    }else{
      return toastDisplayer("error","Can't send Document, No Positions were alloted to recipients!")
    }
    setLoading(false);
  };

  const handleScheduleButtonClick = () => {
    setPopupVisibleSchedule(true);
  };

  const saveTemplateBtn = async () => {
    try {
      if (updateRecData.length != 0) {
        await Promise.all(
          updateRecData.map(async (oneRec, index) => {
            const templateRecipient = templateDraggedData.find(
              (recipient) => recipient.name === oneRec.name
            );

            if (templateRecipient) {
              const apiObj = {
                templateRec: templateRecipient.id,
                template: tid,
                fieldName: oneRec.fieldName,
                color: oneRec.color,
                recBoxid: oneRec.id,
                pageNum: oneRec.pageNum,
                width: oneRec.width,
                height: oneRec.height,
                created_by: templateRecipient.created_by,
                role: templateRecipient.role,
              };

              Object.keys(oneRec.pagePositions).forEach((pageNum) => {
                oneRec.pagePositions[pageNum].forEach((position) => {
                  const { x, y } = position;
                  apiObj.x = x;
                  apiObj.y = y;

                  const response = axios.post(
                    `http://localhost:8000/api/templateDraggedDataApi/`,
                    apiObj
                  );

                });
              });

              toastDisplayer("success","template save successfully!!.......")
              navigate("/userdashboard");

            } else {
              console.error(`TemplateRecipient not found for ${oneRec.name}`);
            }
          })
        );
        toastDisplayer("success","Template save successfully!!.......")
        navigate("/userdashboard");
      } else {

      //   await axios.post(`http://127.0.0.1:8000/api/deleteTemplate/`,{
      //   "templateID" : tid
      // })
        return toastDisplayer(
          "error",
          "Can't save template, No Positions were alloted to recipients!"
        );
      }
    } catch (error) {
      console.error("Error saving template data:", error);
    }
  };

  const handleSendTempDocClick = async () => {
    const apiforAws = "http://localhost:8000/api/upload_file_to_s3/";
    const formData2 = new FormData();
    formData2.append("file", selectedFile);
    try {
      const response2 = await axios.post(apiforAws, formData2, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response2.data.success) {
        throw new Error("Failed to upload file to AWS S3");
      }
      console.log("File uploaded to AWS S3:", response2.data);

      // Call send email API after file upload
      signerOptions.forEach(async (rec, index) => {
        let message, subject;
        console.log("rec.role:", rec);
        if (rec.role === 1) {
          subject = "Request for signing pdf";
          const url = `http://localhost:3000/#/recieverPanel?docType=temp&type=signer&did=${did}&rid=${rec.id}&tempRec=${rec.templateRec}&sender=${creatorid}&tid=${tid}`;
          message = `For signing click on below link : ${url} \nIf you already done the signature ignore this remainder`;
        } else if (rec.role === 2) {
          subject = "Request for reviewing pdf";
          const url = `http://localhost:3000/#/recieverPanel?docType=temp&type=viewer&did=${did}&rid=${rec.id}&tempRec=${rec.templateRec}&sender=${creatorid}&tid=${tid}`;
          message = `For viewing pdf click on below link: ${url}`;
        } else {
          console.error("Invalid role for recipient:", rec);
          return; // Skip sending email for this recipient
        }

        const requestBody = {
          recipient_emails: [rec.email],
          subject: subject,
          message: message,
        };

        const sendEmailResponse = await axios.post(
          setLoading(true),
          "http://localhost:8000/api/send-email/",
          requestBody
        );
        console.log("Send email API response:", sendEmailResponse.data);
        if (sendEmailResponse.data.success === "false") {
          setLoading(false);
          return toastDisplayer("error", "error in sending document");
        }
      });
      setPopupVisibleSend(true);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file to AWS S3:", error);
    }
  };

  const handleScheduleSend = (sdate, stime) => {
    console.log("Schedule Date : ", sdate, "Schedule Time : ", stime);
    // setScheduleDate(sdate);
    // setScheduleTime(stime);
    handleSendButtonClick(stime, sdate);
  };

  return (
    <>
    {loading ? <LoadPanel visible="true" /> : ""}
      {screenValue && screenValue === "Template" && (
        <div className="splitBtnInMainPage">
          <Button
            stylingMode="contained"
            text="Save"
            className="templateBtn"
            onClick={saveTemplateBtn}
          />
        </div>
      )}

      {screenValue && screenValue === "Document" && tempYEs === "no" && (
        <div className="splitBtnInMainPage">
          <DropDownButton
            splitButton={true}
            stylingMode="text"
            items={[
              { text: "Send", onClick: handleSendButtonClick },
              { text: "Schedule Send", onClick: handleScheduleButtonClick },
              // { text: "Download" },
            ]}
            text="Send"
            onButtonClick={()=>{handleSendButtonClick()}}
          />

          <PopupMain
            onClose={() => setPopupVisibleSend(false)}
            visible={popupVisibleSend}
            mainTitle="Document Sent Successfully"
            subTitle="It has been sent to recipients"
            mainBtnText="Back to home page"
            onNavigate={() => navigate("/userdashboard")}
            source="send"
            popupWidth="480px"
          />

          <PopupMain
            onClose={() => setPopupVisibleSchedule(false)}
            visible={popupVisibleSchedule}
            mainTitle="Pick Date & Time"
            subTitle="Set time and date for automatic sending"
            mainBtnText="Schedule Send"
            // onNavigate={() => navigate("/signatureSetup")}
            // onNavigate={() => navigate("/signatureSetup")}
            onNavigate={handleScheduleSend}
            source="schedulesend"
            popupWidth="50%"
          />
        </div>
      )}

      {screenValue && screenValue === "Document" && tempYEs === "yes" && (
        <div className="splitBtnInMainPage">
          <DropDownButton
            splitButton={true}
            stylingMode="text"
            items={[
              { text: "Send", onClick: handleSendButtonClick },
              // { text: "Send", onClick: handleSendTempDocClick },
              { text: "Schedule Send", onClick: handleScheduleButtonClick },
              // { text: "Schedule Send", onClick: handleScheduleButtonClick },
            ]}
            text="Send"
            onButtonClick={()=>{handleSendButtonClick()}}
          />

          <PopupMain
            onClose={() => setPopupVisibleSend(false)}
            visible={popupVisibleSend}
            mainTitle="Document Sent Successfully"
            subTitle="It has been sent to recipients"
            mainBtnText="Back to home page"
            onNavigate={() => navigate("/userdashboard")}
            source="send"
            popupWidth="480px"
          />

          <PopupMain
            onClose={() => setPopupVisibleSchedule(false)}
            visible={popupVisibleSchedule}
            mainTitle="Pick Date & Time"
            subTitle="Set time and date for automatic sending"
            mainBtnText="Schedule Send"
            onNavigate={handleScheduleSend}
            // onNavigate={() => navigate("/signatureSetup")}
            source="schedulesend"
            popupWidth="50%"
          />
        </div>
      )}

      {previewScreenValue && previewScreenValue === "Document" && (
        <div className="splitBtnInMainPage">
          <DropDownButton
            splitButton={true}
            stylingMode="text"
            items={[
              { text: "Send", onClick: handleSendTempDocClick },
              { text: "Schedule Send", onClick: handleScheduleButtonClick },
            ]}
            text="Send"
            onButtonClick={()=>{handleSendButtonClick()}}
          />

          <PopupMain
            onClose={() => setPopupVisibleSend(false)}
            visible={popupVisibleSend}
            mainTitle="Document Sent Successfully"
            subTitle="It has been sent to recipients"
            mainBtnText="Back to home page"
            onNavigate={() => navigate("/userdashboard")}
            source="send"
            popupWidth="480px"
          />

          <PopupMain
            onClose={() => setPopupVisibleSchedule(false)}
            visible={popupVisibleSchedule}
            mainTitle="Pick Date & Time"
            subTitle="Set time and date for automatic sending"
            mainBtnText="Schedule Send"
            onNavigate={() => navigate("/signatureSetup")}
            source="schedulesend"
            popupWidth="50%"
          />
        </div>
      )}
    </>
  );
}
export default SplitButtonSign;
