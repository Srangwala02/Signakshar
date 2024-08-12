// import React, { useState } from "react";
// import { Draggable } from "devextreme-react";
// import { Box } from "devextreme-react/box";
// import Button from "devextreme-react/cjs/button";
// import { ReactComponent as DragDropIcon } from "../../../icons/draggable-icon.svg";
// import { ReactComponent as EditPenIcon } from "../../../icons/edit-pen-icon.svg";
// import editPenIcon from "../../../icons/edit-pen-icon.svg";
// import dragDropIcon from "../../../icons/draggable-icon.svg";
// import "./DraggableFields.scss";

// function DraggableFields(selectedSignerColor) {
//   //   const fields = [
//   //       { name: "Signature", icon: {DragDropIcon}  },
//   //       { name: "Name", icon: {DragDropIcon}  },
//   //       { name: "Initials", icon: {DragDropIcon}  },
//   //       { name: "Date", icon: {DragDropIcon}  },
//   //       { name: "Text", icon: {DragDropIcon}  },
//   //       { name: "Company Stamp", icon: {DragDropIcon}  },
//   //   ];

//   const fields = [
//     { name: "Signature" },
//     { name: "Name" },
//     { name: "Initials" },
//     { name: "Date" },
//     { name: "Text" },
//     { name: "Company Stamp" },
//   ];
// console.log("selectedSignerColor : ",selectedSignerColor)
//   return (
//     <>
//       <div className="draggable-fields-inner-container">
//         {fields.map((field, index) => (
//           <Draggable key={index}>
//             <div className="draggable-fields" style={{backgroundColor:selectedSignerColor.userColor}}>
//             {/* <div className="draggable-fields" style={{ backgroundColor: `rgba(${selectedSignerColor.userColor}, 0.05)` }}> */}
//               <div className="draggable-icon">
//                 <DragDropIcon />
//               </div>
//               <div className="field-text">{field.name}</div>
//                 {/* <div className="edit-icon">
//                 <EditPenIcon />
//                 </div> */}
//                 <Button icon={editPenIcon} className="edit-pen" />
//             </div>
//           </Draggable>
//         ))}
//       </div>

//       {/* <Draggable >
//             <div
//             //   style={{
//             //     // padding: "8px",
//             //     // backgroundColor: "#f5f5f5",
//             //     // borderRadius: "4px",
//             //     cursor: "move",
//             //   }}
//             className="draggable-fields"
//             >
//               {/* <Box direction="row" align="center" width="100%" height="auto"> *}
//                 {/* <div className="draggable-icon"><DragDropIcon width="24" height="24" /></div> *}
//                 {/* <div>ICON</div> *}
//                 <div><DragDropIcon/></div>
//                 <div className="field-text">Signature</div>
//                 {/* <div style={{ marginLeft: "8px" }}>"text"</div> *}
//               {/* </Box> *}
//             </div>
//           </Draggable> */}
//     </>
//   );
// }

// export default DraggableFields;

import React, { useState } from "react";
import { Draggable } from "devextreme-react";
import { Box } from "devextreme-react/box";
import Button from "devextreme-react/cjs/button";
import { ReactComponent as DragDropIcon } from "../../../icons/draggable-icon.svg";
import { ReactComponent as EditPenIcon } from "../../../icons/edit-pen-icon.svg";
import editPenIcon from "../../../icons/edit-pen-icon.svg";
import dragDropIcon from "../../../icons/draggable-icon.svg";
import "./DraggableFields.scss";

function DraggableFields(selectedSigner, selectedSignerColor) {
  const fields = [
    { name: "Signature" },
    { name: "Name" },
    { name: "Initials" },
    { name: "Date" },
    { name: "Text" },
    { name: "Company Stamp" },
  ];
  console.log("selectedSignerColor : ", selectedSignerColor);

  // const handleDragStart = (e, field) => {
  //   const recipient = selectedRecipient
  //     ? {
  //         fieldName: field.name,
  //         color: selectedRecipient.color,
  //         name: selectedRecipient.name,
  //         email: selectedRecipientEmail, // Include the email property
  //       }
  //     : null;

  //   const newData = {
  //     fieldName: field.name,
  //     selectedRecipient: recipient,
  //   };

  //   e.dataTransfer.setData("text/plain", JSON.stringify(mydata));
  //   setMydata([...mydata, newData]);
  //   // console.log("selectedFiles in Sidebar 2",selectedFiles);
  // };

  return (
    <>
      <div className="draggable-fields-inner-container">
        {fields.map((field, index) => (
          <Draggable key={index}>
            <div
              className="draggable-fields"
              style={{ backgroundColor: selectedSignerColor.userColor }}
            >
              <div className="draggable-icon">
                <DragDropIcon />
              </div>
              <div className="field-text">{field.name}</div>
              <Button icon={editPenIcon} className="edit-pen" />
            </div>
          </Draggable>
        ))}

        {/* <div display="flex" flexWrap="wrap" marginTop="10px">
          {fields.map((field, index) => (
            <div
              key={index}
              // draggable={isRecipientSelected ? "true" : "false"}
              // onDragStart={(e) => handleDragStart(e, field)}
              // onDragEnd={handleDropRecipient}
              className="draggable-fields"
              style={{
                margin: "5px",
                flex: "0 0 100%",
                boxSizing: "border-box",
                // border: "4px solid",
                borderColor: selectedSignerColor && selectedSignerColor.userColor,
                borderRadius: "5px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                backgroundColor: selectedSignerColor.userColor,
              }}
            >
               <DragDropIcon />
              <span style={{ marginLeft: "5px" }}>{field.name}</span>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
}

export default DraggableFields;
