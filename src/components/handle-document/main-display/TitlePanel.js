import React, { useState, useEffect } from "react";
import "./TitlePanel.scss";
import { Item } from "devextreme-react/cjs/toolbar";
import SplitButtonSign from "./SplitButtonSign";
import { Button } from "devextreme-react";
import { useAuth } from "../../../contexts/auth";
import axios from "axios";
import {
  generateSignedPdf,
  generateSignedPdfonAws,
} from "../../manageUser/signatureSetup/PdfUtils";

function TitlePanel({
  tid,
  did,
  title,
  selectedFile,
  creatorid,
  signerOptions,
  updateRecData,
  previewScreenValue,
  tempYEs,
  signStatus,
  screenValue,
  templateDraggedData,
  emailAction,
  Expiration,
  statusSoure,
  docapiData,
  downloadDraggedData,
}) {
  const { user } = useAuth();
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    // console.log("source : ", source);

    if (jwtToken != null) {
      const getLoggedInUser = async () => {
        const response = await axios
          .get("http://localhost:8000/api/user/", {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          })
          .then((response) => {
            console.log("USER DATA : ", response.data);
            setLoggedInUserdetail(response.data);
          });
      };
      getLoggedInUser();
      console.log("bbbbb : ", downloadDraggedData);
    } else {
      return;
    }
  }, []);

  const renderButtons = () => {
    switch (statusSoure) {
      case "Completed":
        return (
          <Button width={150} className="btn-statusCompleted" text="Download" />
        );
      case "Lapsed":
        return (
          <Button width={150} className="btn-statusLapsed" text="Delete" />
        );
      case "Pending":
        // return <></>;
        return (
          <Button width={150} className="btn-statusCompleted" text="Save" />
        );
      case "Draft":
        return (
          <Button width={150} className="btn-statusCompleted" text="Send" />
        );
      // return (
      //   <SplitButtonSign
      //     tempYEs={tempYEs}
      //     creatorid={creatorid}
      //     did={did}
      //     previewScreenValue={previewScreenValue}
      //     signerOptions={signerOptions}
      //     selectedFile={selectedFile}
      //     className="split-btn"
      //     tid={tid}
      //     screenValue={screenValue}
      //     templateDraggedData={templateDraggedData}
      //     updateRecData={updateRecData}
      //     emailAction={emailAction}
      //     Expiration={Expiration}
      //   />
      // );
      default:
        console.log("signerOptions ---",signerOptions)
        if (signerOptions.length == 1) {
          // console.log("1 ---- ",loggedInUserDetail.user.email);
          // console.log("2 ---- ",signerOptions[0].email);
          if (signerOptions[0].email == loggedInUserDetail.user.email) {
            return (
              <>
                {console.log("selectedFile", selectedFile)}
                {console.log("downloadDraggedData", downloadDraggedData)}
                <Button
                  width={150}
                  className="btn-statusCompleted"
                  text="Download"
                  onClick={() => {
                    console.log("d1 : ",downloadDraggedData)
                    generateSignedPdf(selectedFile, downloadDraggedData)
                  }}
                />
              </>
            );
          } else {
            return (
              <SplitButtonSign
                tempYEs={tempYEs}
                creatorid={creatorid}
                did={did}
                previewScreenValue={previewScreenValue}
                signerOptions={signerOptions}
                selectedFile={selectedFile}
                className="split-btn"
                tid={tid}
                screenValue={screenValue}
                templateDraggedData={templateDraggedData}
                updateRecData={updateRecData}
                emailAction={emailAction}
                Expiration={Expiration}
                docapiData={docapiData}
              />
            );
          }
        } else {
          return (
            <SplitButtonSign
              tempYEs={tempYEs}
              creatorid={creatorid}
              did={did}
              previewScreenValue={previewScreenValue}
              signerOptions={signerOptions}
              selectedFile={selectedFile}
              className="split-btn"
              tid={tid}
              screenValue={screenValue}
              templateDraggedData={templateDraggedData}
              updateRecData={updateRecData}
              emailAction={emailAction}
              Expiration={Expiration}
              docapiData={docapiData}
            />
          );
        }
    }
  };
  return (
    <>
      <div className="main-title-panel">
        {statusSoure != null ? (
          <div class="statusDetails">
            <div class="statusBtn" statustype={statusSoure}>
              <div class="statusCircle" statustype={statusSoure}></div>
              <div class="statusText" statustype={statusSoure}>
                {statusSoure}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="panel-title">{title}</div>
        {/* <SplitButtonSign
          tempYEs={tempYEs}
          creatorid={creatorid}
          did={did}
          previewScreenValue={previewScreenValue}
          signerOptions={signerOptions}
          selectedFile={selectedFile}
          className="split-btn"
          tid={tid}
          screenValue={screenValue}
          templateDraggedData={templateDraggedData}
          updateRecData={updateRecData}
          emailAction={emailAction}
          Expiration={Expiration}
        /> */}
        {renderButtons()}
      </div>
    </>
  );
}

export default TitlePanel;
