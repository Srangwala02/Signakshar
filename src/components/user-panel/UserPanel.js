import React, { useMemo, useCallback,useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "devextreme-react/button";
import ContextMenu, { Position } from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import { useAuth } from "../../contexts/auth";
import "./UserPanel.scss";
import downArrowIcon from "../../SVG/arrow-down-s-line.svg";
import profileIcon from "../../SVG/account-circle-line.svg";
import logoutIcon from "../../SVG/logout-circle-r-line.svg";
import axios from "axios";

export default function UserPanel({ menuMode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   try{
  //     const jwtToken = localStorage.getItem("jwt");
  //     console.log("hwtToken",jwtToken);
  //   }catch(error){

  //   }
  //   return () => {
      
  //   }
  // }, [])

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Pass JWT token in the Authorization header
          },
        });
        // console.log("resp",response);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      // Cleanup function
    };
  }, [user.data]);
  

  const navigateToProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);
  
  const menuItems = useMemo(
    () => [
      {
        text: "My Profile",
        icon: profileIcon,
        onClick: navigateToProfile,
      },
      {
        text: "Logout",
        icon: logoutIcon,
        onClick: signOut,
      },
    ],
    [navigateToProfile, signOut]
  );
  return (
    <div className={"user-panel"}>
      <div className={"user-info"}>
        <div className={"image-container"}>
          <div
            style={{
              //background: `url(${user.avatarUrl}) no-repeat #fff`,
              backgroundSize: "cover",
              boxShadow: "none",
            }}
            className={"user-image"}
          />
        </div>
        <div className={"user-name"}>{userData ? userData.user.email : "" }</div>

        <Button
          className={"user-button authorization"}
          width={44}
          height={44}
          icon={downArrowIcon}
          stylingMode={"text"}
          onClick={() => {
            // Handle button click event here
            console.log("hey");
          }}
        />
      </div>

      {menuMode === "context" && (
        <ContextMenu
          items={menuItems}
          target={".user-button"}
          showEvent={"dxclick"}
          // width={226}
          // height={128}
          cssClass={"user-menu"}
        >
          <Position
            my={{ x: "center", y: "top" }}
            at={{ x: "center", y: "bottom" }}
          />
        </ContextMenu>
      )}
      {menuMode === "list" && (
        <List className={"dx-toolbar-menu-action"} items={menuItems} />
      )}
    </div>
  );
}
