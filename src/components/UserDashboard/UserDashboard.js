import React, { useState ,useEffect} from "react";
import { Item } from "devextreme-react/tabs";
import TabPanel from "devextreme-react/tab-panel";
import "./Dashboard.scss";
import "../../layouts/side-nav-outer-toolbar/side-nav-outer-toolbar.scss";
import DocSubPanel from "./docSubPanel/DocSubPanel";
import folderIconPink from "./../../SVG/folder-fill.svg";
import layoutIconPink from "./../../SVG/layout-left-fill (1).svg";
import bulkIconPink from "./../../SVG/checkbox-multiple-blank-fill (1).svg";
import folderIconGrey from "./../../SVG/folder-fill (1).svg";
import layoutIconGrey from "./../../SVG/layout-left-fill.svg";
import bulkIconGrey from "./../../SVG/checkbox-multiple-blank-fill.svg";
import Header from "../header/Header";
import TempSubPanel from "./templateSubPanel/TempSubPanel";
import {Navigate} from "react-router-dom";

function UserDashboard() {
  useEffect(() => {
    const storedUrl = localStorage.getItem('initialUrl');
    if (storedUrl) {
      setRedirectUrl(storedUrl);
      localStorage.removeItem('initialUrl'); 
    }
  }, []);
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelectionChanged = (e) => {
    setSelectedIndex(e.component.option("selectedIndex"));
  };

  const [redirectUrl, setRedirectUrl] = useState(null);

  

  return (
    <>
      {redirectUrl && redirectUrl ? (<>
        <Navigate to={redirectUrl} replace />
      </>) : (<>
        <div className={"side-nav-outer-toolbar"}>
        <Header
          menuToggleEnabled
          // toggleMenu={toggleMenu}
          title={"Sign-akshar"}
        ></Header>

        <div className="mainDiv">
          <div className="custom-tab-panel-container">
            <TabPanel
              className="mytabpanel"
              iconPosition="start"
              selectedIndex={selectedIndex}
              onSelectionChanged={handleSelectionChanged}
            >
              <Item
                title="Documents"
                icon={selectedIndex === 0 ? folderIconPink : folderIconGrey}
              >
                <div className="document-tab-">
                  <DocSubPanel />
                </div>
              </Item>
              <Item
                title="Templates"
                icon={selectedIndex === 1 ? layoutIconPink : layoutIconGrey}
              >
                <div className="sub-tab-signature">
                  {/* <SignSubPanel/>template */}
                  <TempSubPanel />
                </div>
              </Item>
              <Item
                title="Bulk Signing"
                icon={selectedIndex === 2 ? bulkIconPink : bulkIconGrey}
              >
                <div className="sub-tab-signature">
                  {/* <SignSubPanel/>bulk */}
                </div>
              </Item>
            </TabPanel>
          </div>
        </div>
      </div>
      </>)}

      
    </>
  );
}

export default UserDashboard;
