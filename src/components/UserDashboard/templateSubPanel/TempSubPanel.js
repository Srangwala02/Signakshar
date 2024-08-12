import { List } from "devextreme-react/list";
import ContextMenu, { Position } from "devextreme-react/context-menu";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { TextBox } from "devextreme-react/text-box";
import { Button, Icon } from "devextreme-react";
import moreIcon from "../../../SVG/more-2-fill (1).svg";
import React, { useState, useEffect } from "react";
import MySplitBtn from "../mySplitBtn/MySplitBtn";
import "./TempSubPanel.scss";
import axios from "axios";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useNavigate } from 'react-router-dom';

function TempSubPanel() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const handleSearchChange = (e) => {
    setSearchValue(e.value);
  };

  const [templateData, settemplateData] = useState();

  async function fetchTemplateData() {
    try {
      const jwtToken = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:8000/api/templateapi/",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const mytemplatesData = await Promise.all(
        response.data.map(async (template) => {
          const recipientResponse = await axios.get(
            `http://localhost:8000/api/TemplateRecipientByTemplateId/${template.template_id}/`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          template.recData = recipientResponse.data;
          return template;
        })
      );

      settemplateData(mytemplatesData);
    } catch (error) {
      console.error("Error fetching template data:", error);
    }
  }
  useEffect(() => {
    fetchTemplateData();
    return () => {};
  }, []);

  var selectedRowData = "";
  const onCloneClick = (e) => {
    // console.log("eeee",e)
    selectedRowData = e;
  };

  const templateDelete=async ()=>{
    try {
      const responseDel = await axios.post(`http://127.0.0.1:8000/api/deleteTemplate/`,{
        "templateID" : selectedRowData.template_id
      })

      if(responseDel.data.message ==="Template deleted successfully" && responseDel.data.status===200){
        fetchTemplateData();
        return toastDisplayer("success","Template deleted successfully");
      }
    } catch (error) {
      console.log(error)
    }
  }

  function ItemTemplate(data) {
    const moreMenuMode = "context3";
    const moreMenuItems = [
      // {
      //   text: "Edit",
      // },
      {
        text: "Apply",
        onClick : () =>{
          console.log("selectedRowData: ",selectedRowData);
          navigate("/DashUI?template=Document", { state: { selectedRowData: selectedRowData } });
        }
      },
      {
        text: "Delete",
        onClick :()=>{
          templateDelete(selectedRowData);
        }
      },
    ];
    return (
      <>
        <div className="listBox">
          <div className="pdfImg"></div>
          <div className="listContent">
            <div className="listInfo">
              <div className="listDocName">{data.templateName}</div>
              <div className="listRec">
                {data.recData.length} Recipients / {data.templateNumPages}{" "}   Pages
              </div>
            </div>
            <div className="listAction">
              <Button
                icon={moreIcon}
                height={44}
                className="listBtn"
                onClick={() => onCloneClick(data)}
                width={44}
                stylingMode={"outlined"}
              />
              {moreMenuMode === "context3" && (
                <ContextMenu
                  items={moreMenuItems}
                  target={".listBtn"}
                  showEvent={"dxclick"}
                  cssClass={"moreMenu"}
                ></ContextMenu>
              )}
              {moreMenuMode === "list" && (
                <List
                  className={"dx-toolbar-menu-action"}
                  items={moreMenuItems}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="docHead">
        <p className="doctext">Templates</p>
        <div className="mainSplit">
          <MySplitBtn />
        </div>
      </div>

      {templateData && <>
        <div className="tempInfo">
        <div className="tempTool">
          <Toolbar>
            <Item location={"before"} cssClass={"tempText"}>
              You have created {templateData.length} templates
            </Item>
            <Item location={"after"} cssClass={"header-title2"}>
              <TextBox
                width={300}
                height={44}
                placeholder="Search Templates"
                mode="search"
                stylingMode="outlined"
                valueChangeEvent="keyup"
                onValueChanged={handleSearchChange}
              ></TextBox>
            </Item>
          </Toolbar>
        </div>
        <div className="tempMainList">
          <List
            searchValue={searchValue}
            dataSource={templateData}
            searchExpr="templateName"
            itemRender={ItemTemplate}
          />
        </div>
      </div>
      </>}
      
    </>
  );
}

export default TempSubPanel;
