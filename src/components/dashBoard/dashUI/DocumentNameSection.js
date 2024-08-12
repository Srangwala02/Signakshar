// DocumentNameSection.js
import React, { useState, useEffect } from "react";
import TextBox from "devextreme-react/text-box";

function DocumentNameSection({
  screenValue,
  templateName,
  settemplateName,
  docName,
  setDocName,
}) {
  const handleTemplateNameChange = (e) => {
    settemplateName(e.value);
  };

  const handleDocNameChange = (e) => {
    setDocName(e.value);
  };

  return (
    <div className="doc-name">
      {screenValue === "Template" && (
        <>
          <span className="docSpan"> Template Name</span>
          <TextBox
            placeholder="Enter the template name"
            stylingMode="outlined"
            // style={{ width: 156 }}
            className="custom-textbox2 spaced-textbox"
            value={templateName} // Bind the value to the templateName state
            onValueChanged={handleTemplateNameChange}
          />
        </>
      )}
      {screenValue === "Document" && (
        <>
          <span className="docSpan"> Document Name</span>
          <TextBox
            placeholder="Enter the document name"
            stylingMode="outlined"
            // style={{ width: 156 }}
            className="custom-textbox2 spaced-textbox"
            value={docName}
            onValueChanged={handleDocNameChange}
          />
        </>
      )}
      {screenValue === "Bulk Signing" && (
        <>
          <span className="docSpan"> Document Name</span>
          <TextBox
            placeholder="Enter the document name"
            stylingMode="outlined"
            style={{ width: 156 }}
            className="custom-textbox2 spaced-textbox"
            value={docName}
            onValueChanged={handleDocNameChange}
          />
        </>
      )}
    </div>
  );
}

export default DocumentNameSection;
