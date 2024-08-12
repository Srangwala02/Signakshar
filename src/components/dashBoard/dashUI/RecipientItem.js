import React, { useEffect, useState } from "react";
import SelectBox from "devextreme-react/select-box";
import { Button as TextBoxButton, TextBox } from "devextreme-react/text-box";
import { ReactComponent as DeleteIcon } from "../../../icons/delete-bin-line.svg";

const RecipientItem = ({
  recipient,
  handleDeleteRecipient,
  screenValue,
  handleRecipientChange,
  currentUser,
  OnceClicked,
  setOnceClicked,
}) => {
  const documentOptions = ["Signer", "Viewer"];
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    // console.log("onceClicked :",onceClicked)
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const CustomDropDownButton = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
    </svg>
  );

  const onDeleteClick = () => {
    handleDeleteRecipient(recipient.id); // Pass the index to the delete function
  };

  // const [onceClicked, setOnceClicked] = useState(true);

  const handleAddYourselfClick = () => {
    console.log(
      "---------------------------------------------------------------------"
    );
    setOnceClicked(false);
    console.log("hello", currentUser);
    handleRecipientChange(recipient.id, "emailId", currentUser.email);
    handleRecipientChange(recipient.id, "fullName", currentUser.full_name);
  };

  useEffect(() => {
    console.log(" :::::::", OnceClicked);
  }, [OnceClicked]);

  const addYourself = {
    text: "Add yourself",
    name: "Add",
    onClick: () => {
      handleAddYourselfClick();
    },
  };

  return (
    <>
      <div className="master-recipient1">
        <div className="recipient1">
          <button className="dragable-icon">
            <span className="number">{recipient.testID}</span>
          </button>

          {screenValue === "Template" && (
            <div className="fullname">
              <span>Recipient</span>
              <span className="star">*</span>
              <TextBox
                placeholder="Enter the default name"
                stylingMode="outlined"
                value={recipient.fullName}
                className="custom-textbox4"
                onValueChange={(e) =>
                  handleRecipientChange(recipient.id, "fullName", e)
                }
                onFocusIn={handleFocus}
                onFocusOut={handleBlur}
              />
            </div>
          )}

          {screenValue === "Document" && (
            <>
              <div className="fullname">
                <span>Full Name</span>
                <span className="star">*</span>
                <TextBox
                  placeholder="Enter the full name"
                  stylingMode="outlined"
                  className={
                    isFocused
                      ? "custom-textbox4 buttonshow"
                      : "custom-textbox4 buttonhide"
                  }
                  value={recipient.fullName}
                  onValueChange={(e) =>
                    handleRecipientChange(recipient.id, "fullName", e)
                  }
                  onFocusIn={handleFocus}
                  onFocusOut={handleBlur}
                >
                  <TextBoxButton
                    name="Add Yourself"
                    cssClass="add-yourself hide"
                    options={{
                      text: "Add yourself",
                      name: "Add",
                      visible: OnceClicked,
                      onClick: () => {
                        handleAddYourselfClick();
                      },
                    }}
                  />
                </TextBox>
              </div>
              <div className="fullname">
                <span>Email ID</span>
                <span className="star">*</span>
                <TextBox
                  placeholder="Enter the email id"
                  stylingMode="outlined"
                  className="custom-textbox4"
                  value={recipient.emailId}
                  onValueChanged={(e) =>
                    handleRecipientChange(
                      recipient.id,
                      "emailId",
                      e.value.toLowerCase()
                    )
                  }
                />
              </div>
            </>
          )}
          {/* ///sakshi changes */}
          {screenValue === "Bulk Signing" && (
            <>

            <div className="fullname">
              <span>Full Name</span>
              <span className="star">*</span>
              <TextBox
                placeholder="Enter the full name"
                stylingMode="outlined"
                className={
                    isFocused
                      ? "custom-textbox4 buttonshow"
                      : 
                      "custom-textbox4 buttonhide"
                }
                value={recipient.fullName}
                onValueChange={(e) =>
                  handleRecipientChange(recipient.id, "fullName", e)
                }
                onFocusIn={handleFocus}
                onFocusOut={handleBlur}
              >
                <TextBoxButton
                  name="Add Yourself"
                  cssClass="add-yourself hide"
                  options={{
                    text: "Add yourself",
                    name: "Add",
                    visible:OnceClicked,
                    onClick: () => {
                      handleAddYourselfClick();
                    },
                  }}
                />
              </TextBox>
            </div>
            <div className="fullname">
              <span>Email ID</span>
              <span className="star">*</span>
              <TextBox
                placeholder="Enter the email id"
                stylingMode="outlined"
                className="custom-textbox4"
                value={recipient.emailId}
                onValueChanged={(e) =>
                  handleRecipientChange(recipient.id, "emailId", e.value.toLowerCase())
                }
              />
            </div>
          </>
          )}

          <div className="dropdown-custom">
            <SelectBox
              displayExpr="this"
              stylingMode="outlined"
              placeholder="Role"
              className="custom-textbox4"
              dataSource={documentOptions}
              dropDownButtonComponent={CustomDropDownButton}
              value={recipient.role}
              onValueChanged={(e) =>
                handleRecipientChange(recipient.id, "role", e.value)
              }
            />
          </div>
          <button className="button-custom" onClick={onDeleteClick}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default RecipientItem;
