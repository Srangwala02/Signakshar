import React, { useState } from 'react'
import { DropDownButton } from 'devextreme-react';
import addIcon from '../../../SVG/add-line.svg';
import fileIcon from '../../../SVG/file-3-line.svg';
import './MySplitBtn.scss';
import { useNavigate } from "react-router-dom";

function MySplitBtn() {

  const [templateType  ,setTemplateType ]= useState("");
  const navigate = useNavigate();
  const items = [
    { text: 'Document' ,icon: fileIcon, 
},
// function MySplitBtn() {

//   const navigate = useNavigate();
//   const items = [
//     { text: 'Document' ,icon: fileIcon,
//       onClick: ()=>{
//         navigate("/dashui");
//       }
//   },
    { text: 'Template',icon: fileIcon },
    { text: 'Bulk Signing',icon: fileIcon },
    { text: 'CSV',icon: fileIcon },
  ];

  const handleTemplateClick =(e)=>{
    console.log(e);
    console.log(e.itemData.text)
    const TemplateTypeINFun = e.itemData.text ;

    navigate(`/dashUI?template=${TemplateTypeINFun}`);
    setTemplateType()
  }

  return (
    <>
        <div className='dropDownMain'>
      <DropDownButton
        splitButton={true}
        icon={addIcon}
        items={items}
        useSelectMode={false}
        width={"auto"}
        text="Create New"
        onItemClick={handleTemplateClick}
      />
    </div>
    </>
  )
}

export default MySplitBtn