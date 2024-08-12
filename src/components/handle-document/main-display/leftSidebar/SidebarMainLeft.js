import React, { useState, useEffect, useNavigate } from "react";
import "./SidebarMainLeft.scss";
import { Button, DropDownButton } from "devextreme-react";
import recipientLightPurple from "../../../../icons/recipient-colors/recipient-light-purple.svg";
import DraggableFields from "../DraggableFields";
import { ReactComponent as DragDropIcon } from "../../../../icons/draggable-icon.svg";
import editPenIcon from "../../../../icons/edit-pen-icon.svg";
import { useDragDropContext } from "../CustomDragDropContext";
import PopupMain from "../../../customPopup/PopupMain";
import axios from "axios";
import { Url } from "devextreme-react/cjs/chart";

function SidebarMainLeft({
  fields,
  allrecipients,
  onFieldActivation,
  onSelectedSignerChange,
  sidebarLeftSorce,
  loggedInUserDetail,
  setApplySignatureData,
  applySignatureData,
  setSignatureCanvas,
  signatureCanvas,
  handleSignatureDone,
  editPenSignPopupVisible,
  setPopupSignVisible,
  popupSignVisible,
  setInitialsCanvas,
  initialsCanvas,
  setApplyInitialsData,
  applyInitialsData,
  handleInitialsDone,
  applyCompanyStampData,
  handleCompanyStampDone,
  recipientPanelColor,
}) {
  const [signerOptions, setSignerOptions] = useState([]);
  const [selectedSigner, setSelectedSigner] = useState("");
  const [selectedSignerColor, setSelectedSignerColor] = useState();

  const [mydata, setMydata] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const { handleDragRecipient, handleDropRecipient } = useDragDropContext();

  const [popupTab, setPopupTab] = useState(1);
  // const [popupSignVisible, setPopupSignVisible] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [selectedSignerForDragDrop, setSelectedSignerForDragDrop] =
    useState(null);

  const [signerColors, setSignerColors] = useState({});
  const [colors, setColors] = useState([
    "rgba(184, 122, 254, 0.05)",
    "rgba(10, 143, 237, 0.05)",
    "rgba(10, 237, 188, 0.05)",
    "rgba(56, 117, 148, 0.05)",
    "rgba(237, 10, 165, 0.05)",
    "rgba(127, 86, 208, 0.05)",
    "rgba(12, 98, 48, 0.05)",
    "rgba(194, 65, 12, 0.05)",
    "rgba(72, 89, 137, 0.05)",
    "rgba(5, 1, 12,0.05)",
  ]);

  useEffect(() => {
    if (allrecipients && allrecipients.length > 0) {
      const filteredSigners = allrecipients.filter(
        (recipient) => recipient.role === 1
      );
      setSignerOptions(filteredSigners);

      const updatedSignerColors = {};
      filteredSigners.forEach((signer, index) => {
        updatedSignerColors[signer.name] = colors[index % colors.length];
      });
      setSignerColors(updatedSignerColors);

      if (!filteredSigners.find((signer) => signer.name === selectedSigner)) {
        setSelectedSigner("");
      }
      if (filteredSigners.length > 0 && !selectedSigner) {
        const firstSigner = filteredSigners[0];
        setSelectedSigner(firstSigner.name);
        setSelectedRecipient({
          name: firstSigner.name,
          color: updatedSignerColors[firstSigner.name],
          role: firstSigner.role,
          email: firstSigner.email,
        });
        onSelectedSignerChange(firstSigner.name);
      }
    }
  }, [allrecipients, selectedSigner]);

  const items = signerOptions.map((recipient) => ({
    name: recipient.name,
    text: recipient.name,
    color: signerColors[recipient.name],
    role: recipient.role,
    email: recipient.email,
  }));

  const handleItemClick = (e) => {
    setSelectedSigner(e.itemData.name);
    setSelectedSignerColor(e.itemData.color);
    setSelectedRecipient({
      name: e.itemData.name,
      color: e.itemData.color,
      role: e.itemData.role,
      email: e.itemData.email,
    });
    onSelectedSignerChange(e.itemData.name);
    setSelectedSignerForDragDrop(e.itemData.email);
  };

  const handleEditPenClick = (fieldName) => {
    let tabValue;
    switch (fieldName) {
      case "Signature":
        tabValue = 1;
        break;
      case "Initials":
        tabValue = 2;
        break;
      case "Company Stamp":
        tabValue = 3;
        break;
      default:
        tabValue = null;
    }

    setPopupTab(tabValue);
    setPopupSignVisible(true);
  };

  const handleDragStart = (e, field) => {
    const recipient = selectedRecipient
      ? {
          fieldName: field.name,
          color: selectedRecipient.color,
          name: selectedRecipient.name,
        }
      : null;

    const newData = {
      fieldName: field.name,
      selectedSigner: recipient,
    };

    e.dataTransfer.setData("text/plain", JSON.stringify(mydata));
    setMydata([...mydata, newData]);
    handleDragRecipient(recipient);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Pass JWT token in the Authorization header
          },
        });
        setLoggedInUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      // Cleanup function
    };
  }, []);

  return (
    <div className="inner-container-left-sidebar">
      {sidebarLeftSorce != "reciever-panel" ? (
        <div className="heading-indication">
          <div className="heading1">Select a signer for document.</div>
          <div className="heading2">
            Number of signers- {allrecipients.length}
          </div>
          {/* {console.log("loggedInUserData", loggedInUserData)}
              {console.log("allrecipients", allrecipients)} */}
        </div>
      ) : (
        <div className="heading-indication">
          <div className="heading1">Sign the document</div>
          <div className="heading2">Click on field to add the signature</div>
        </div>
      )}

      <div className="signer-selection">
        <div className="heading-signers">
          Signers<span className="required-field">*</span>
        </div>

        {sidebarLeftSorce == "reciever-panel" ? (
          <div className="singleSigner">
            {/* {console.log("COLOR: ",selectedRecipient)} */}
            <i
              class="ri-radio-button-line"
              style={{
                //  color: "rgb(184, 122, 254)",
                color: recipientPanelColor.replace(0.3, 1),
                marginRight: 5,
              }}
            ></i>
            <div className="single-signer-name">{selectedSigner}</div>
          </div>
        ) : (
          <>
            {allrecipients.length <= 1 ? (
              <div className="singleSigner">
                {/* <div className="single-signer-icon">
                <img src="../../../../icons/recipient-colors/recipient-light-purple.svg" alt="icon" style={{ width: '20px', height: '20px' }} />
              </div> */}
                <i
                  class="ri-radio-button-line"
                  style={{
                    color: "rgb(184, 122, 254)",
                    marginRight: 5,
                  }}
                ></i>
                <div className="single-signer-name">{selectedSigner}</div>
              </div>
            ) : (
              <div className="signerDropDownBox">
                <DropDownButton
                  splitButton={true}
                  // icon={'<i class="ri-radio-button-line"></i>'}
                  // icon="plus"
                  stylingMode="text"
                  items={items}
                  itemRender={(x) => {
                    // <i class="ri-radio-button-line"></i>
                    return (
                      <>
                        <i
                          class="ri-radio-button-line"
                          style={{
                            color: x.color.replace(0.05, 1),
                            marginRight: 8,
                          }}
                        ></i>
                        {x.name}
                      </>
                    );
                  }}
                  // dangerouslySetInnerHTML={{ __html: <h1>A</h1> }}
                  // itemRender={(x)=>{
                  //   return(
                  //     <>
                  //       <div>{x.email}</div>
                  //     </>
                  //   )
                  // }}
                  // text={selectedSigner || (items.length > 0 ? <>{items[0].name}</> : "")}
                  // ={()=>{ return(<h1>H</h1>)}}
                  text={
                    selectedSigner ||
                    (items.length > 0 ? <>{items[0].name}</> : "")
                  }
                  onItemClick={handleItemClick}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="drag-drop-title">
        Drag & Drop the sign for{" "}
        {selectedSigner || (items.length > 0 ? items[0].name : "")}
      </div>

      <div className="draggable-fields-inner-container">
        <div display="flex" flexWrap="wrap" marginTop="10px">
          {fields.map((field, index) => (
            <div
              key={index}
              // draggable={selectedSigner ? "true" : "false"}
              draggable={
                sidebarLeftSorce === "reciever-panel" ? "false" : "true"
              }
              onDragStart={(e) => handleDragStart(e, field)}
              onDragEnd={handleDropRecipient}
              className="draggable-fields"
              id={field.id}
              style={{
                // backgroundColor: selectedSignerColor,
                backgroundColor:
                  sidebarLeftSorce === "reciever-panel"
                    ? recipientPanelColor.replace(0.3, 0.05)
                    : selectedSignerColor,
              }}
            >
              {sidebarLeftSorce != "reciever-panel" ? (
                <div className="draggable-icon">
                  <DragDropIcon />
                </div>
              ) : (
                <></>
              )}

              <div className="field-text">{field.name}</div>
              {sidebarLeftSorce != "reciever-panel" ? (
                <>
                  {selectedRecipient &&
                    selectedRecipient.email === loggedInUserData?.user.email &&
                    (field.id === 1 || field.id === 3 || field.id === 6) && (
                      <Button
                        icon={editPenIcon}
                        className="edit-pen"
                        onClick={(e) => {
                          handleEditPenClick(field.name);
                        }}
                      />
                    )}
                </>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>

      {console.log("editPenSignPopupVisible", editPenSignPopupVisible)}
      <PopupMain
        // onClose={() => setPopupSignVisible(false)}
        onClose={() => setPopupSignVisible(!popupSignVisible)}
        visible={popupSignVisible}
        mainTitle="Edit your signature"
        subTitle="Customise it for specific document"
        mainBtnText="Apply Signature"
        source="editpen"
        popupWidth="700px"
        mainTabItemValue={popupTab}
        loggedInUserDetail={loggedInUserDetail}
        setApplySignatureData={setApplySignatureData}
        applySignatureData={applySignatureData}
        setSignatureCanvas={setSignatureCanvas}
        signatureCanvas={signatureCanvas}
        handleSignatureDone={handleSignatureDone}
        setInitialsCanvas={setInitialsCanvas}
        initialsCanvas={initialsCanvas}
        setApplyInitialsData={setApplyInitialsData}
        applyInitialsData={applyInitialsData}
        handleInitialsDone={handleInitialsDone}
        applyCompanyStampData={applyCompanyStampData}
        handleCompanyStampDone={handleCompanyStampDone}
      />
    </div>
  );
}

export default SidebarMainLeft;
