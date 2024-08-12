import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import './dashUI.scss';
import SelectBox from "devextreme-react/select-box";
import { ReactComponent as FileIcon } from "../../../SVG/file-3-line.svg";
import { ReactComponent as CloseIcon } from "../../../icons/close-circle-line.svg";
import myfileIcon from "../../../SVG/file-3-line.svg";

function TemplateSelectionSection({
  TemplateOptions,
  onTemplateSelect,
  recipientCount,
  setSelectedTemplate,
  selectedTemplate,
  pageCount,
  templateOption,
  setTemplateOption,
  handleTemplateClear,
  selectedRowData,
}) {
  const templateDataSource = templateOption.map((template) => ({
    name: template.templateName,
    icon: myfileIcon,
    filename: template.createTempfile,
    pages: template.templateNumPages,
    tempid: template.template_id,
    recData: template.recipientData,
  }));

  useEffect(() => {
    if (selectedRowData) {
      setSelectedTemplate(selectedRowData);
    }
  }, [selectedRowData, setSelectedTemplate]);

  const handleTemplateSelect = (value) => {
    setSelectedTemplate(value);
    onTemplateSelect(value);
  };

  const CustomDropDownButton = ({ selectedTemplate }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
      <span>
        {selectedTemplate ? selectedTemplate.name : "Select Template"}
      </span>
    </svg>
  );

  console.log("selectedRowData:", selectedRowData);
  console.log("selectedTemplateeee:", selectedTemplate);

  return (
    <div className="section2">
      <div className="box-1">
        <div className="template-sec">
          Apply template for recipient signature fixed placement
        </div>
        <div className="templateselectiondropdown">
          <SelectBox
            className="yo"
            displayExpr="name"
            stylingMode="outlined"
            placeholder=""
            dataSource={templateDataSource}
            value={selectedTemplate}
            onValueChanged={(e) => handleTemplateSelect(e.value)}
            style={{
              border: "none",
            }}
            width={"30%"}
            dropDownButtonRender={({ selectedTemplate }) => (
              <CustomDropDownButton selectedTemplate={selectedTemplate} />
            )}
          />
        </div>
      </div>
      <span className="fileicon">
        {selectedTemplate ? (
          <>
            <FileIcon />
            <div className="file-box">
              <div className="file-box-name">
                {selectedTemplate.name || selectedTemplate.templateName} - {selectedTemplate.filename || selectedTemplate.createTempfile}
              </div>
              <div className="file-box-data">
                {selectedTemplate.recData ? `${selectedTemplate.recData.length} recipients` : "No recipients"} - {selectedTemplate.pages || selectedTemplate.templateNumPages} pages
              </div>
            </div>
            <div className="cancelicon" onClick={handleTemplateClear}>
              <CloseIcon />
            </div>
          </>
        ) : (
          ""
        )}
      </span>
    </div>
  );
}

TemplateSelectionSection.propTypes = {
  TemplateOptions: PropTypes.array.isRequired,
  onTemplateSelect: PropTypes.func.isRequired,
  recipientCount: PropTypes.number,
  setSelectedTemplate: PropTypes.func.isRequired,
  selectedTemplate: PropTypes.object,
  pageCount: PropTypes.number,
  templateOption: PropTypes.array.isRequired,
  setTemplateOption: PropTypes.func.isRequired,
  handleTemplateClear: PropTypes.func.isRequired,
  selectedRowData: PropTypes.object,
};

export default TemplateSelectionSection;
