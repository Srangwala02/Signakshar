//new code with selection handling
import React, { useState } from "react";
import "./DetailPanel.scss";
import Button from "devextreme-react/cjs/button";
import btnReset from "../../../icons/restart-line.svg";
import arrowDown from "../../../icons/arrow-drop-down-line.svg";
import DropDownButton, {
  DropDownButtonTypes,
  Item,
} from "devextreme-react/drop-down-button";
import SelectBox from "devextreme-react/select-box";
import { useNavigate } from "react-router-dom";
import { useDragDropContext } from "./CustomDragDropContext";

function DetailPanel({
  signerOptions,
  emailTitle,
  signOpt,
  Expiration,
  emailMessage,
  reminderDays,
  docapiData,
  screenValue,
  did,
  tid,
  tempYEs,
  selectedFile,
  templateapiData,
  scheduledDate,
  setIsAnyFieldClicked,
  templateDraggedData,
  recipientTempData,
  draggedDataTemp
}) {
  const navigate = useNavigate();
  const [mysel, setmysel] = useState(null);
  const [mySelectedRecipient, setMySelectedRecipient] = useState(null);
  const [mySelectedDocument, setMySelectedDocument] = useState(null);
  const { resetDraggedData } = useDragDropContext();

  const documentSource = [
    { value: 1, docName: "QIT Demo", pages: 4 },
    { value: 2, docName: "Participate", pages: 8 },
    { value: 3, docName: "Guide", pages: 4 },
    { value: 4, docName: "Winning pdf", pages: 2 },
  ];

  const handlePreviewBtn = () => {
    navigate(
      `/previewpage?template=${screenValue}&tempYEs=${tempYEs}&tid=${tid}&did=${did}&preview=yes`,
      {
        state: {
          selectedFile: selectedFile,
          Expiration: Expiration,
          draggedDataTemp:draggedDataTemp,
          docapiData: docapiData,
          scheduledDate: scheduledDate,
          reminderDays: reminderDays,
          emailMessage: emailMessage,
          emailTitle: emailTitle,
          signOpt: signOpt,
          templateapiData: templateapiData,
          signerOptions: signerOptions,
          templateDraggedData: templateDraggedData,
          recipientTempData:recipientTempData
        },
      }
    );
  };

  const handleBgCLicked = () => {
    setIsAnyFieldClicked(false);
  };

  const handleResetButtonClick = () => {
    resetDraggedData();
    handleBgCLicked();
  };

  return (
    <>
      <div className="main-detail-panel">
        <div className="outer-section">
          <div className="first-inner-section">
            <Button
              icon={btnReset}
              className="btn-reset"
              onClick={handleResetButtonClick}
            />

            {selectedFile ? (
              <>
                <div className="single-document-sign">1 Document</div>
              </>
            ) : (
              <SelectBox
                width="13%"
                className="document-selection"
                valueExpr={(documentSource) => documentSource}
                valueRender={(item) => `${item.docName} (${item.pages})`}
                displayRender={(item) => `${item.docName} (${item.pages})`}
                stylingMode="outlined"
                onItemClick={(e) => {
                  console.log("e : ", e.itemData);
                  setMySelectedDocument(e.itemData);
                  // console.log(mySelectedRecipient)
                }}
                dataSource={documentSource}
                value={mySelectedDocument} // Set initial value
                selectedItem={mySelectedDocument}
                itemTemplate={(item) => {
                  return `<div class="custom-item">
                    <div class="recipient-name">${item.docName}</div>
                    <div class="recipient-role"}>${item.pages} pages</div>
                    </div>`;
                }}
                placeholder={
                  mySelectedDocument != null
                    ? mySelectedDocument.docName
                    : documentSource.length + " Documents"
                }
              />
            )}
            {/* <SelectBox
              width="11%"
              className="recipient-selection"
              stylingMode="outlined"
              // onItemClick={(e) => {
              //   setMySelectedRecipient(signerOptions.length + " Recipients");
              // }}
              dataSource={signerOptions.length > 0 ? signerOptions : signOpt}
              // dataSource={[1,2,3]}
              value={"1"}
              text="1"
              // selectedItem={1}

//Siddhi dropdown 
//               onItemClick={(e) => {
//                 setMySelectedRecipient(e.itemData.name);
//               }}
//               dataSource={signerOptions}
//               value={mySelectedRecipient}
//               selectedItem={mySelectedRecipient}

              itemTemplate={(item) => {
                const role = item.role === 1 ? "Signer" : "Viewer";
                return `<div class="custom-item">
                    <div class="recipient-name">${item.name}</div>
                    <div class="recipient-role">${role}</div>
                  </div>`;
              }}
              // placeholder={
              //   mySelectedRecipient != null
              //     ? mySelectedRecipient
              //     : signerOptions.length + " Recipients"
              // }
              placeholder={
                signerOptions.length > 1
                  ? signerOptions.length + " Recipients"
                  : signerOptions.length + " Recipient"
              }
              // placeholder={signerOptions.length + " Recipients"}
            /> */}
            {signerOptions.length != 1 ? (
              <div className="splitbtnRecipients">
                <DropDownButton
                  splitButton={true}
                  stylingMode="text"
                  // items={[
                  //   { text: "Send" },
                  //   { text: "Schedule Send" },
                  //   { text: "Download" },
                  // ]}
                  className="recipient-selection"
                  dataSource={
                    signerOptions.length > 0 ? signerOptions : signOpt
                  }
                  itemTemplate={(item) => {
                    const role = item.role === 1 ? "Signer" : "Viewer";
                    // return `<div class="custom-item">
                    //     <div class="recipient-name">${item.name}</div>
                    //     <div class="recipient-role">${role}</div>
                    //   </div>`;
                    return `<div class="custom-item">
                    <div class="recipient-name" style="font-size: 14px; font-weight: 500; font-family: 'Inter';">
                      ${item.name}
                    </div>
                    <div class="recipient-role" style="color: #687787; font-size: 12px; font-weight: 500; font-family: 'Inter';">
                      ${role}
                    </div>
                  </div>`;
                  }}
                  text={signerOptions.length + " Recipients"}
                />
              </div>
            ) : (
              <>
                <div className="single-document-sign">1 Recipient</div>
              </>
            )}

            {/* <DropDownButton
                // icon={arrowDown}
                splitButton={true}
                width="13%"
                className="recipient-selection"
                stylingMode="text"
                dataSource={signerOptions.length > 0 ? signerOptions : signOpt}
                value={1}
                itemTemplate={(item) => {
                  console.log("item: ", item);
                  const role = item.role === 1 ? "Signer" : "Viewer";
                  return `<div class="custom-signer-item">
                  <div class="recipient-name">${item.name}</div>
                  <div class="recipient-role">${role}</div>
                </div>`;
                }}
                text={
                  signerOptions.length > 1
                    ? signerOptions.length + " Recipients"
                    : signerOptions.length + " Recipient"
                }
              /> */}
          </div>
          <div className="second-inner-section">
            {/* {screenValue && screenValue==="Document" &&
              <Button
              className="btn-preview"
              text="Preview"
              onClick={handlePreviewBtn}
            />
            } */}
            
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPanel;
