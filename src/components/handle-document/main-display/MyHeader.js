//In diff popup
import React, { useState, useCallback } from "react";
import Toolbar, { Item } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import "./MyHeader.scss";
import leftarrow from "../../../icons/left-arrow.svg";
import closeBtn from "../../../icons/close-line.svg";
import { useNavigate } from "react-router-dom";
import PopupMain from "../../customPopup/PopupMain";

export default function MyHeader({ menuToggleEnabled, title, toggleMenu,screenValue,typeReciever,previewScreenValue,tempYesState,
  selectedFile,signerOptions,
  docId,tempID,templateDraggedData
}) {
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleCloseBtnInHeader = () => {
    setPopupVisible(!popupVisible);
  };

  const handleGoBackBtn = () =>{
    if(screenValue==="Template"){    
      navigate("/dashui?template=Template");
    }else if(screenValue==="Document"){
      // console.log("--------------------------------------------------------------,",docId);
      navigate("/dashui?template=Document", { state: { docId: docId } });
    }
    else if(typeReciever==="reciever"){
      navigate("/userdashboard");
    }else if(previewScreenValue==="Document" && tempYesState==="yes" && docId && tempID){
      navigate(`/createorsigndocument?template=Document&tempYes=yes&did=${docId}&tid=${tempID}`,{ state: {signOpt:signerOptions, selectedFile: selectedFile,templateDraggedData:templateDraggedData } });
    }
    else if(screenValue==="viewDocument"){
      navigate("/userdashboard");
    }
    else if(screenValue==="recipient-panel"){
      navigate("/userdashboard");
    }
  }

  const handleBackToDashboardBtn = () => {
    navigate("/userdashboard");
  };

  return (
    <div className="headertest2">
      <header className={"header2-component"}>
        <Toolbar className={"header-toolbar"}>
          <Item
            
            location={"before"}
            cssClass={"header-title"}
            text={title}
            visible={!!title}
          />
          <Item location={"before"} locateInMenu={"auto"} cssClass="demo">
            <Button icon={leftarrow} text="Go back" className="button-custom" onClick={handleGoBackBtn} />
          </Item>
          <Item location={"after"} cssClass="demo2">
            <Button icon={closeBtn} className="navigate-to-dashboard" onClick={handleCloseBtnInHeader} />
          </Item>
        </Toolbar>

        <PopupMain
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          onNavigate={() => navigate("/userdashboard")}
          mainTitle="Back to home page"
          subTitle="Document will be saved as a draft"
          mainBtnText="Back to home page"
          source="header"
          popupWidth="480px"
        />
      </header>
    </div>
  );
}
