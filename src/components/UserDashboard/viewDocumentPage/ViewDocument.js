import React, { useEffect, useState } from "react";
import MyHeader from "../../handle-document/main-display/MyHeader";
// import "./CreateOrSignDocument.scss";
import TitlePanel from "../../handle-document/main-display/TitlePanel";
import DetailPanel from "../../handle-document/main-display/DetailPanel";
import Header from "../../header/Header";
import DocumentMain from "../../handle-document/main-display/DocumentMain";
import { useLocation, useNavigate } from "react-router-dom";
import btnReset from "../../../icons/restart-line.svg";
// import { AuthProvider, useAuth } from "../../../../src/contexts/auth";
import axios from "axios";
import { Button, DropDownButton } from "devextreme-react";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { LoadPanel } from "devextreme-react";
import { generateBucketName } from "../../manageUser/signatureSetup/PdfUtils";
import { useAuth } from "../../../contexts/auth";

function ViewDocument() {
  const [screenValue, setScreenValue] = useState("");

  const location = useLocation();
  const { docData } = location.docData || {}; // Access passed state
  // const params = new URLSearchParams(location.search);
  // const docStatus = params.get('docStatus'); // Access query parameter
  const [signerOptions, setsignerOptions] = useState([]);
  const [draggedData, setDraggedData] = useState([]);
  const [fullDocumentData, setFullDocumentData] = useState([]);
  const [recieverfile, setRecieverFile] = useState(null);

  const documentData = location.state.docData;
  // console.log("Document Data:", documentData);
  // console.log("Document Name:", documentData.name);
  // console.log("Document Status:", documentData.status);

  const { user } = useAuth();
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);
  const [mySignStatus, setMySignStatus] = useState("done");
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");

    if (jwtToken != null) {
      const getLoggedInUser = async () => {
        const response = await axios
          .get("http://localhost:8000/api/user/", {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          })
          .then((response) => {
            // console.log("USER DATA : ", response.data);
            setLoggedInUserdetail(response.data);
          });
      };
      getLoggedInUser();
    } else {
      return;
    }
  }, []);

  const fetchPdfFile = async (sender_data, document_data) => {
    try {
      const bucketName = generateBucketName(
        sender_data.user.id,
        sender_data.user.email
      );
      console.log("bucketName:", bucketName);
      const response = await axios.get(
        `http://localhost:8000/api/fetch_pdf_from_s3/${bucketName}/${
          documentData.name + ".pdf"
        }`,
        {
          responseType: "blob",
        }
      );
      // console.log("response pdf: ", response);
      setRecieverFile(response.data); // Set the received PDF blob
    } catch (error) {
      console.error("Error fetching PDF file:", error);
      toastDisplayer("error", "Failed to fetch PDF file");
    }
  };

  const fetchDocumentData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/DocumentByDocId/${documentData.id}/`
      );
      setFullDocumentData(response.data);
      console.log("fullDocumentData: ", response.data);

      if (response.data) {
        const senderResp = await axios.get(
          `http://localhost:8000/api/user-details/${response.data.creator_id}/`
        );
        // setSenderData(senderResp.data);
        fetchPdfFile(senderResp.data, response.data);
      }
    } catch (error) {
      return toastDisplayer("error", "Failed to fetch document data");
    }
  };

  const fetchDocumentRecipientStatus = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_email_list/`
      );
      // setFullDocumentData(response.data);
      console.log("fetchDocumentRecipientStatus : ", response.data);
    } catch (error) {
      return toastDisplayer(
        "error",
        "Failed to fetch document recipient status data"
      );
    }
  };

  const fetchUseDocRec = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt");
      const header = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const response = await axios.get(
        `http://localhost:8000/api/DocAllRecipientById/${documentData.id}`,
        {
          headers: header,
        }
      );

      if (response.data.length > 0) {
        const processedData = response.data.map((data) => ({
          id: data.id,
          name: data.name,
          role: data.roleId,
          color: "#ffb6c1",
          email: data.email,
        }));
        setsignerOptions(processedData);
      }
    } catch (error) {
      return toastDisplayer("error", "Can't fetch the reciever");
    }
  };

  const fetchDocumentDraggedData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/GetDraggedDataByDocRec/${documentData.id}/16`
      );
      // console.log("dragged data : ", response.data);
      setDraggedData(response.data);
    } catch (error) {
      console.error("Error fetching dragged data:", error);
      toastDisplayer("error", "Failed to fetch dragged data");
    }
  };

  const fetchRecipientSignStatusData = async () => {
    console.log("DOC ID : ", documentData.id);
    // console.log("DOC REC EMAIL : ", loggedInUserDetail.user.email);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/email-list/${documentData.id}/${loggedInUserDetail.user.email}/`
      );
      console.log("response recipient : ", response.data);
      console.log("response.data.status : ", response.data[0].status);
      setMySignStatus(response.data[0].status);

      // Call fetchRecipientDetailData after successfully setting sign status
      await fetchRecipientDetailData(response.data[0].status);
    } catch (error) {
      console.error("Error fetching recipient sign status data:", error);
      // toastDisplayer("error", "Failed to fetch recipient sign status data");
    }
  };

  const fetchRecipientDetailData = async (recStatus) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/document-recipient-detail/${documentData.id}/${loggedInUserDetail.user.email}/`
      );
      console.log("response single recipient data : ", response.data);

      if (response.data) {
        console.log("recStatus", recStatus);
        if (recStatus !== "done" && recStatus === "sent") {
          console.log("my sign pending");
          const role = response.data[0].roleId;

          if (role === 1) {
            console.log("12345");
            const url = `/recieverPanel?docType=doc&type=signer&did=${documentData.id}&rid=${response.data[0].id}`;
            navigate(url);
          } else if (role === 2) {
            const url = `/recieverPanel?docType=doc&type=viewer&did=${documentData.id}&rid=${response.data[0].id}`;

            navigate(url);
          } else {
            console.log("Invalid role id");
          }
        } else {
          console.log("my sign status - done");
        }
      }
    } catch (error) {
      console.error("Error fetching recipient sign status data:", error);
    }
    // toastDisplayer("error", "Failed to fetch recipient sign status data");
  };

  useEffect(() => {
    if (documentData.id) {
      fetchDocumentData();
      fetchUseDocRec();
      fetchDocumentDraggedData();
      fetchDocumentRecipientStatus();
    }
  }, []);

  useEffect(() => {
    if (loggedInUserDetail) {
      fetchRecipientSignStatusData();
      // fetchRecipientDetailData();
    }
  }, [loggedInUserDetail]);

  return (
    <>
      <div className="my-container">
        <MyHeader title={"Sign-akshar"} screenValue={"viewDocument"} />
        <div className="my-main-container">
          <TitlePanel
            title={documentData.name}
            statusSoure={documentData.status}
          />
          <div className="main-detail-panel">
            <div className="outer-section">
              <div className="first-inner-section">
                <div className="single-document-sign">1 Documnet</div>

                {signerOptions.length != 1 ? (
                  <div className="splitbtnRecipients">
                    <DropDownButton
                      splitButton={true}
                      stylingMode="text"
                      className="recipient-selection"
                      dataSource={signerOptions}
                      itemTemplate={(item) => {
                        const role = item.role === 1 ? "Signer" : "Viewer";
                        return `<div class="custom-item">
                          <div class="recipient-name" style="font-size: 14px; font-weight: 500; font-family: 'Inter';">
                            ${item.name}
                          </div>
                          <div class="recipient-role" style="color: #687787; font-size: 12px; font-weight: 500; font-family: 'Inter';">
                            ${role}
                          </div>
                          </div>`;
                      }}
                      text={signerOptions.length + " Recipients"}
                    />
                  </div>
                ) : (
                  <>
                    <div className="single-document-sign">1 Recipient</div>
                  </>
                )}
              </div>
              <div className="second-inner-section"></div>
            </div>
          </div>
        </div>
        {/* {console.log("ViewDoc screenval: ", screenValue)} */}

        <DocumentMain
          selectedFile={recieverfile}
          screenValue={"viewDocument"}
          signerOptions={"signerOptions"}
          title={documentData.name}
        />
      </div>
    </>
  );
}

export default ViewDocument;