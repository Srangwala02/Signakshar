import React, { useState, useRef, useEffect } from "react";
import MyHeader from "../handle-document/main-display/MyHeader";
import axios from "axios";
import btnReset from "../../icons/restart-line.svg";
import { Button, DropDownButton } from "devextreme-react";
import { useLocation } from "react-router-dom";
import { pdfjs } from "react-pdf";
import { toastDisplayer } from "../toastDisplay/toastDisplayer";
import SelectBox from "devextreme-react/select-box";
import {
  generateThumbnails,
  handleScroll,
  generateSignedPdfonAws,
  getDimensionsBasedOnScreenSize,
  generateBucketName,
  handleThumbnailClick,
  getCroppingRect,
  getNonEmptyPixels,
  processImage,
} from "../manageUser/signatureSetup/PdfUtils";
import { useNavigate } from "react-router-dom";
import "../handle-document/main-display/CreateOrSignDocument.scss";
import "../handle-document/main-display/DocumentMain.scss";
import "../handle-document/main-display/TitlePanel.scss";
import "../handle-document/main-display/DetailPanel.scss";
import PopupMain from "../customPopup/PopupMain";
import SidebarMainLeft from "../handle-document/main-display/leftSidebar/SidebarMainLeft";
import SidebarRight from "../handle-document/main-display/rightSidebar/SidebarRight";
import { useAuth } from "../../contexts/auth";
import { format } from "date-fns";
import { toDate, formatInTimeZone } from 'date-fns-tz';
import { LoadPanel } from "devextreme-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function RecieverPanel() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [correctRecData, setCorrectRecData] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [mainContentUrls, setMainContentUrls] = useState([]);
  const mainContainerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [pdfImageSize, setPdfImageSize] = useState({ width: 0, height: 0 });
  const thumbnailContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recieverfile, setRecieverFile] = useState(null);
  const [pdfImageRect, setpdfImageRect] = useState({ width: 0, height: 0 });
  const [draggedData, setDraggedData] = useState([]);
  const [defaultColor, setDefaultColor] = useState("transperant");
  const [documentData, setDocumentData] = useState([]);
  const [useTempRec, setuseTempRec] = useState([]);
  const [popupActiveTab, setPopupActiveTab] = useState(null);
  const [signString, setSignString] = useState(null);
  const [signImage, setSignImage] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const docid = queryParams.get("did");
  const rid = queryParams.get("rid");
  const typeReciever = queryParams.get("type");
  const tempRec = queryParams.get("tempRec");
  const sender = queryParams.get("sender");
  const tid = queryParams.get("tid");
  const docType = queryParams.get("docType");

  const [signerOptions, setsignerOptions] = useState([]);
  const [selectedSignerName, setSelectedSignerName] = useState("");
  const [popupSignVisible, setPopupSignVisible] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);

  // signature canvas refererence and its data
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [applySignatureData, setApplySignatureData] = useState(null);
  const [initialsCanvas, setInitialsCanvas] = useState(null);
  const [applyInitialsData, setApplyInitialsData] = useState(null);
  const [applyCompanyStampData, setApplyCompanyStampData] = useState(null);

  const [dateFormatIndex, setDateFormatIndex] = useState(0);
  const [fontStyleIndex, setFontStyleIndex] = useState(0);

  // const [correctRecData, setCorrectRecData] = useState(null);
  const [errorDisplayed, setErrorDisplayed] = useState(false);

  // apply sign
  const [drawingData, setDrawingData] = useState({});
  const [signPositions, setSignPositions] = useState(
    Array.from({ length: numPages }, () => ({ x: 0, y: 0 }))
  );
  const [signatureSize, setSignatureSize] = useState([]);
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    // console.log("source : ", source);

    if (jwtToken != null) {
      const getLoggedInUser = async () => {
        const response = await axios
          .get("http://localhost:8000/api/user/", {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          })
          .then((response) => {
            console.log("USER DATA : ", response.data);
            setLoggedInUserdetail(response.data);
            // setApplySignatureData(response.data.signature_details.draw_img_name);
          });
      };
      getLoggedInUser();
    } else {
      return;
    }
  }, []);

  // const [loggedInRecipientDetail, setLoggedInUserdetail] = useState([]);
  // const drawingBoardRef = useRef(null);

  const handlesetApplySigature = (data) => {
    console.log("===================");
    setApplySignatureData(data);
  };

  useEffect(() => {
    if (recieverfile) {
      // Generate thumbnails and content URLs
      // setLoading(true);
      generateThumbnails(recieverfile)
        .then(({ thumbnailUrls, contentUrls }) => {
          
          setNumPages(thumbnailUrls.length);
          setThumbnails(thumbnailUrls);
          setMainContentUrls(contentUrls);
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
        });
        // setLoading(false);
    }
  }, [recieverfile]);

  const fields = [
    { id: 1, name: "Signature" },
    { id: 2, name: "Name" },
    { id: 3, name: "Initials" },
    { id: 4, name: "Date" },
    { id: 5, name: "Text" },
    { id: 6, name: "Company Stamp" },
  ];

  const handleContainerScroll = (event) => {
    handleScroll(
      event,
      numPages,
      positions,
      pdfImageSize,
      thumbnailContainerRef,
      setCurrentPage,
      setPositions
    );
  };

  const [senderData, setSenderData] = useState();
  const fetchDocumentData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/DocumentByDocId/${docid}/`
      );
      setDocumentData(response.data);

      if (response.data) {
        const senderResp = await axios.get(
          `http://localhost:8000/api/user-details/${response.data.creator_id}/`
        );
        setSenderData(senderResp.data);
        fetchPdfFile(senderResp.data, response.data);
      }
    } catch (error) {
      return toastDisplayer("error", "Failed to fetch document data");
    }
  };

  const fetchUseTemplateRec = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/use_template_recipient_didTidCid/${docid}/${tid}/${sender}`
      );

      if (response.data.length > 0) {
        const processedData = response.data.map((data) => ({
          id: data.id,
          name: data.RecipientName,
          role: data.role,
          color: "#ffb6c1",
          email: data.RecipientEmail,
          templateRec: data.templateRec,
        }));
        setuseTempRec(processedData);
        setsignerOptions(processedData);
      }
    } catch (error) {
      return toastDisplayer("error", "Can't fetch the reciever");
    }
  };

  const fetchUseDocRec = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt");
      const header = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const response = await axios.get(
        `http://localhost:8000/api/DocAllRecipientById/${docid}`,
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
          // templateRec: data.templateRec,
        }));
        setsignerOptions(processedData);
      }
    } catch (error) {
      return toastDisplayer("error", "Can't fetch the reciever");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (signerOptions.length > 0) {
          let isToastDisplayed = false;
          signerOptions.forEach((s) => {
            if (s.id == rid) {
              if (s.email === response.data.user.email) {
                setCorrectRecData(response.data);
              } else {
                if (!isToastDisplayed) {
                  // Display toast message only if it hasn't been displayed before
                  toastDisplayer(
                    "error",
                    "You are not allowed to access signing page!"
                  );
                  isToastDisplayed = true; // Set flag to true after displaying toast
                }
                navigate("/userDashboard");
              }
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [signerOptions]);

  const fetchPdfFile = async (senderData1, documentData1) => {

    setLoading(true)

    try {
      const bucketName = generateBucketName(
        senderData1.user.id,
        senderData1.user.email
      );
      const response = await axios.get(
        `http://localhost:8000/api/fetch_pdf_from_s3/${bucketName}/${
          documentData1.name + ".pdf"
        }`,
        {
          responseType: "blob",
        },
        
      );

      setRecieverFile(response.data); // Set the received PDF blob
      setLoading(false);

    } catch (error) {
      // setLoading(false);
      console.error("Error fetching PDF file:", error);
      toastDisplayer("error", "Failed to fetch PDF file");
      // setLoading(false);
    }
    // setLoading(false);
  };

  const fetchDocumentDraggedData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/GetDraggedDataByDocRec/${docid}/${rid}`
      );
      setDraggedData(response.data);
      console.log("response.data : ",response.data)
    } catch (error) {
      console.error("Error fetching dragged data:", error);
      toastDisplayer("error", "Failed to fetch dragged data");
    }
  };

  const ApproveDocument = async () => {
    try {
      setLoading(true);
      const payload = {
        doc_id: docid,
        email_id: rid,
      };
      const response = await axios.post(
        `http://localhost:8000/api/DocApprove/`,
        payload
      );

      if (response.status === 200) {
        setLoading(false);
        if (senderData) {

          const draggedArray=[];
          const positionsByPage = {};
          draggedData.forEach((item) => {
            const { pageNum, x, y } = item;
            if (!positionsByPage[pageNum]) {
              setLoading(false);
              positionsByPage[pageNum] = [];
            }
            positionsByPage[pageNum].push({ x, y });
            console.log("draggedData.signatureData:",item.signatureData);
            if(item.signatureData){
              draggedArray.push(item.signatureData);
            }
          });
          generateSignedPdfonAws(
            recieverfile,
            draggedArray,
            senderData,
            documentData
          );

          setLoading(false);

          // navigate("/userDashboard");
        }
      } else {
        setLoading(false);
        toastDisplayer("error", "Failed to approve document");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error approving document:", error);
      toastDisplayer("error", "Failed to approve document");
    }
  };

  useEffect(() => {
    if (docid) {
      fetchDocumentData();
      if (docType == "temp") {
      } else if (docType == "doc") {
        fetchUseDocRec();
        fetchDocumentDraggedData();
      }
    }
  }, [docid, tid, sender]);

  // useEffect(() => {
  //   if (documentData.s3Key && senderData) {
  //     // fetchPdfFile();
  //   }
  // }, [senderData]);

  useEffect(() => {
    if (recieverfile) {
      generateThumbnails(recieverfile)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          setMainContentUrls(contentUrls);
          if (typeReciever === "signer") {
            // fetchDraggedData();
            fetchDocumentDraggedData();
          }
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
        });
    }
  }, [recieverfile]);

  useEffect(() => {
    if (correctRecData && mainContentUrls.length > 0) {
      const mypdfImage = new Image();
      mypdfImage.src = mainContentUrls[0];
      const pdfImage = document.querySelector(".tmpid");
      const pdfImageRect = pdfImage.getBoundingClientRect();

      mypdfImage.onload = () => {
        setPdfImageSize({
          width: mypdfImage.width,
          height: mypdfImage.height,
        });

        setpdfImageRect({
          width: pdfImageRect.width,
          height: pdfImageRect.height,
        });
      };
    }
  }, [mainContentUrls]);

  const findSignerByTemplateRec = (templateRec) => {
    return useTempRec.find((signer) => signer.templateRec === templateRec);
  };

  const handleApplySignatureModal = (recipient) => {
    console.log("recipient in modal: ", recipient);
    let tabValue = null;
    switch (recipient.fieldName) {
      case "Signature":
        tabValue = 1;
        setPopupActiveTab(tabValue);
        setPopupSignVisible(true);
        break;
      case "Initials":
        tabValue = 2;
        setPopupActiveTab(tabValue);
        setPopupSignVisible(true);
        break;
      case "Company Stamp":
        tabValue = 3;
        setPopupActiveTab(tabValue);
        setPopupSignVisible(true);
        break;
      case "Name":
        handleNameDone();
        break;
      case "Date":
        handleDateDone();
        break;
      default:
        tabValue = null;
    }
  };

  const handleSignatureDone = () => {
    let signatureData = applySignatureData;

    if (applySignatureData == null) {
      console.log(
        "blank canvas on RP, using loggedInUserDetail signature image"
      );

      if (loggedInUserDetail.signature_details.draw_img_name) {
        processImage(
          loggedInUserDetail.signature_details.draw_img_name,
          (croppedDataURL) => {
            if (croppedDataURL) {
              signatureData = croppedDataURL;
              finalizeSignature(signatureData);
            } else {
              console.error(
                "Failed to process loggedInUserDetail signature image"
              );
            }
          }
        );
      } else {
        setPopupSignVisible(false);
      }
    } else {
      processImage(applySignatureData, (croppedDataURL) => {
        if (croppedDataURL) {
          signatureData = croppedDataURL;
          finalizeSignature(signatureData);
        } else {
          console.error("Failed to process applySignatureData image");
          setPopupSignVisible(false);
        }
      });
    }
  };

  const finalizeSignature = (signatureData) => {
    const updatedDraggedData = [...draggedData];

    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Signature") {
        const { x, y, width, height, pageNum } = field;

        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;

        field.signatureData = {
          imageData: signatureData,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
    console.log("Updated draggedData with signatures: ", updatedDraggedData);
  };

  const handleInitialsDone = () => {
    let initialData = applyInitialsData;

    if (applyInitialsData == null) {
      console.log(
        "blank canvas on RP, using loggedInUserDetail initials image"
      );

      if (loggedInUserDetail.initials_details.draw_img_name) {
        processImage(
          loggedInUserDetail.initials_details.draw_img_name,
          (croppedDataURL) => {
            if (croppedDataURL) {
              initialData = croppedDataURL;
              finalizeInitials(initialData);
            } else {
              console.error(
                "Failed to process loggedInUserDetail initials image"
              );
              setPopupSignVisible(false);
            }
          }
        );
      } else {
        setPopupSignVisible(false);
      }
    } else {
      processImage(applyInitialsData, (croppedDataURL) => {
        if (croppedDataURL) {
          initialData = croppedDataURL;
          finalizeInitials(initialData);
        } else {
          console.error("Failed to process applySignatureData image");
          setPopupSignVisible(false);
        }
      });
    }
  };

  const finalizeInitials = (initialData) => {
    const updatedDraggedData = [...draggedData];
    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Initials") {
        const { x, y, width, height, pageNum } = field;

        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;

        field.signatureData = {
          imageData: initialData,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
    console.log("Updated draggedData with signatures: ", updatedDraggedData);
  };

  const handleCompanyStampDone = () => {
    let companyStampData = applyCompanyStampData;

    if (applyCompanyStampData == null) {
      console.log(
        "blank canvas on RP, using loggedInUserDetail company stamp image"
      );

      if (loggedInUserDetail.user.stamp_img_name) {
        processImage(
          loggedInUserDetail.user.stamp_img_name,
          (croppedDataURL) => {
            if (croppedDataURL) {
              companyStampData = croppedDataURL;
              finalizeCompanyStamp(companyStampData);
            } else {
              console.error(
                "Failed to process loggedInUserDetail company stamp image"
              );
              setPopupSignVisible(false);
            }
          }
        );
      } else {
        setPopupSignVisible(false);
      }
    } else {
      processImage(applyCompanyStampData, (croppedDataURL) => {
        if (croppedDataURL) {
          companyStampData = croppedDataURL;
          finalizeCompanyStamp(companyStampData);
        } else {
          console.error("Failed to process applyCompanyStampData image");
          setPopupSignVisible(false);
        }
      });
    }
  };

  const finalizeCompanyStamp = (companyStampData) => {
    const updatedDraggedData = [...draggedData];
    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Company Stamp") {
        const { x, y, width, height, pageNum } = field;

        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;

        field.signatureData = {
          imageData: companyStampData,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });
    setDraggedData(updatedDraggedData);
    setPopupSignVisible(false);
    console.log("Updated draggedData with signatures: ", updatedDraggedData);
  };

  const handleDateDone = () => {
    const dateFormats = [
      "MM/dd/yyyy", //"06/01/2024"
      "dd/MM/yyyy", // "01/06/2024"
      "dd-MM-yyyy", // "01-06-2024"
      "MMMM dd, yyyy", //"June 1, 2024"
      "eeee, MMMM do yyyy", //"Saturday, June 1st 2024"
    ];

    const currentDateFormat = dateFormats[dateFormatIndex];
    setDateFormatIndex((prevIndex) => (prevIndex + 1) % dateFormats.length);
    const now = new Date();
    // Convert to Indian Standard Time (IST)
    const timeZone = 'Asia/Kolkata';
    const istDate = toDate(now, { timeZone });
    // Format the IST date and time
    const currentDate = format(istDate, currentDateFormat);
    const currentTime = formatInTimeZone(istDate, 'IST', "'T'HH:mm:ss.SSS'Z'");
    const dateTime = `${currentDate} ${currentTime}`; // Combine date and time

    const updatedDraggedData = [...draggedData];

    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Date") {
        const { x, y, width, height, pageNum } = field;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        context.fillStyle = "transparent";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "14px Inter";
        context.fillStyle = "#344450";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(dateTime, canvas.width / 2, canvas.height / 2);

        const imageDataURL = canvas.toDataURL();

        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;

        field.signatureData = {
          imageData: imageDataURL,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });

    setDraggedData(updatedDraggedData);
    console.log("Updated draggedData with dates: ", updatedDraggedData);
  };

  const handleNameDone = () => {
    const fontStyles = [
      "20px Inter",
      "20px Arial",
      // "20px Courier New",
      // "20px Sans Serif",
      "20px Times New Roman",
      // "20px Georgia",
      // "20px Gill Sans",
      // "20px Segoe UI",
      "20px Brush Script MT",
      "20px Lucida Handwriting",
      "20px Pacifico",
      // "20px Great Vibes",
      // "20px Dancing Script",
      // "20px Allura",
      // "20px Satisfy",
    ];

    const currentFontStyle = fontStyles[fontStyleIndex];
    setFontStyleIndex((prevIndex) => (prevIndex + 1) % fontStyles.length);

    const currentName = loggedInUserDetail.user.full_name;
    console.log("currentName", currentName);

    const updatedDraggedData = [...draggedData];

    updatedDraggedData.forEach((field) => {
      if (field.fieldName === "Name") {
        const { x, y, width, height, pageNum } = field;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        context.fillStyle = "transparent";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = currentFontStyle;
        context.fillStyle = "#344450";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(currentName, canvas.width / 2, canvas.height / 2);

        const imageDataURL = canvas.toDataURL();

        const adjustedLeft = (x / pdfImageSize.width) * pdfImageRect.width;
        const adjustedTop = (y / pdfImageSize.height) * pdfImageRect.height;
        const adjustedWidth =
          (parseFloat(width) / pdfImageSize.width) * pdfImageRect.width;
        const adjustedHeight =
          (parseFloat(height) / pdfImageSize.height) * pdfImageRect.height;

        field.signatureData = {
          imageData: imageDataURL,
          x: adjustedLeft,
          y: adjustedTop,
          width: adjustedWidth,
          height: adjustedHeight,
          pageNumber: pageNum,
        };
      }
    });

    setDraggedData(updatedDraggedData);
    console.log("Updated draggedData with names: ", updatedDraggedData);
  };

  const handleSelectedSignerChange = (signerName) => {
    setSelectedSignerName(signerName);
  };

  const handleResetButtonClick = () => {
    const updatedDraggedData = draggedData.map((field) => {
      return {
        ...field,
        signatureData: null,
      };
    });

    setDraggedData(updatedDraggedData);
    console.log("Reset draggedData: ", updatedDraggedData);
  };

  return (
    <>
      {/* {correctRecData && ( */}
      {loading ? <LoadPanel visible="true" /> : ""}
      <div className="my-container">
        <MyHeader title={"Sign-akshar"} typeReciever={typeReciever} screenValue={"recipient-panel"}/>
        {/* {console.log("draggedData : ",draggedData)} */}
        <div className="my-main-container">
          <div className="main-title-panel">
            <div className="panel-title">{documentData.name}</div>
            <div className="splitBtnInMainPage">
              {typeReciever && typeReciever === "signer" && (
                <Button
                  stylingMode="contained"
                  text="Done"
                  className="templateBtn"
                  onClick={ApproveDocument}
                />
              )}
              {typeReciever && typeReciever === "viewer" && (
                <Button
                  stylingMode="contained"
                  text="Viewed"
                  className="templateBtn"
                  onClick={ApproveDocument}
                />
              )}
            </div>
          </div>

          <div className="main-detail-panel">
            <div className="outer-section">
              <div className="first-inner-section">
                <Button
                  icon={btnReset}
                  className="btn-reset"
                  onClick={handleResetButtonClick}
                />
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
            </div>
          </div>
        </div>

        <div className="main-container">
          {console.log("draggedData[0].color",draggedData[0])}
          <SidebarMainLeft
            fields={fields}
            allrecipients={signerOptions}
            onSelectedSignerChange={handleSelectedSignerChange}
            sidebarLeftSorce="reciever-panel"
            recipientPanelColor={draggedData[0]?.color || defaultColor} 
          />

          <div className="main-pdf-container">
            <div className="main-pdf-view">
              <div className="pdf-inner-container-main-body-content">
                <div className="pdf-viewer">
                  <div className="pdf-display">
                    <div
                      className="pdf-scrollable-container "
                      ref={mainContainerRef}
                      onScroll={handleContainerScroll}
                    >
                      {Array.from({ length: numPages }, (_, index) => (
                        <div className="mainpage" key={index}>
                          <div className="main-pdf-page-container">
                            <img
                              src={mainContentUrls[index]}
                              alt={`Page ${index + 1}`}
                              className="tmpid"
                              draggable="false"
                            />
                            {draggedData && draggedData.map((recipient, i) => {
                              if (parseInt(recipient.pageNum) === index) {
                                const adjustedLeft =
                                  (recipient.x / pdfImageSize.width) *
                                  pdfImageRect.width;
                                const adjustedTop =
                                  (recipient.y / pdfImageSize.height) *
                                  pdfImageRect.height;
                                const adjustedWidth =
                                  (parseFloat(recipient.width) /
                                    pdfImageSize.width) *
                                  pdfImageRect.width;
                                const adjustedHeight =
                                  (parseFloat(recipient.height) /
                                    pdfImageSize.height) *
                                  pdfImageRect.height;

                                const signer = findSignerByTemplateRec(
                                  recipient.templateRec
                                );
                                const signatureData = recipient.signatureData;

                                // Render draggable box if signature data is not available
                                if (!signatureData) {
                                  return (
                                    <div
                                      className="drag-box"
                                      key={i}
                                      style={{
                                        position: "absolute",
                                        left: adjustedLeft,
                                        top: adjustedTop,
                                        width: adjustedWidth,
                                        height: adjustedHeight,
                                        backgroundColor: recipient.color,
                                      }}
                                      onClick={(e) => {
                                        handleApplySignatureModal(recipient);
                                      }}
                                    >
                                      <div className="recipient-box">
                                        <div className="recipient-box-data">
                                          <p className="dropped-box-field-name">
                                            {recipient.fieldName}
                                          </p>
                                          <p className="dropped-box-recipient-name">
                                            {recipient.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  // Render applied signature/initial if signature data is available
                                  return (
                                    <div
                                      className="drag-box"
                                      key={i}
                                      style={{
                                        position: "absolute",
                                        left: signatureData.x,
                                        top: signatureData.y,
                                        width: signatureData.width,
                                        height: signatureData.height,
                                        backgroundColor: recipient.color,
                                      }}
                                      onClick={(e) => {
                                        handleApplySignatureModal(recipient);
                                      }}
                                    >
                                      {/* {console.log("reci",recipient)} */}
                                      <img
                                        src={signatureData.imageData}
                                        alt={`Value for ${recipient.fieldName} field`}
                                      />
                                    </div>
                                  );
                                }
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SidebarRight
            thumbnails={thumbnails}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            numPages={numPages}
            mainContainerRef={mainContainerRef}
            selectedSignerName={selectedSignerName}
            handleThumbnailClick={(pageNumber) =>
              handleThumbnailClick(
                pageNumber,
                mainContainerRef,
                setCurrentPage,
                numPages
              )
            }
            fields={fields}
            title={documentData.name}
            pdfFile={recieverfile}
            // activeFieldId={activeFieldId}
            // pdfFileName={pdfFileName}
            // isAnyFieldClicked={isAnyFieldClicked}
            // activeFieldData={activeFieldData}
            // handleDeleteRecipient={handleDeleteRecipient}
            // copyCurrentBoxToAllPages={copyCurrentBoxToAllPages}
            // copyCurrentBoxToBelowPages={copyCurrentBoxToBelowPages}
          />
        </div>

        <PopupMain
          onClose={() => setPopupSignVisible(false)}
          visible={popupSignVisible}
          mainTitle="Edit your signature"
          subTitle="Customise it for specific document"
          mainBtnText="Continue"
          // onNavigate={() => navigate("/")}
          source="editpen"
          popupWidth="848px"
          mainTabItemValue={popupActiveTab}
          // setSignString={setSignString}
          // signString={signString}
          // setSignImage={setSignImage}
          signImage={signImage}
          loggedInUserDetail={loggedInUserDetail}
          setApplySignatureData={setApplySignatureData}
          applySignatureData={applySignatureData}
          setSignatureCanvas={setSignatureCanvas}
          signatureCanvas={signatureCanvas}
          handleSignatureDone={handleSignatureDone}
          setApplyInitialsData={setApplyInitialsData}
          applyInitialsData={applyInitialsData}
          handleInitialsDone={handleInitialsDone}
          setInitialsCanvas={setInitialsCanvas}
          initialsCanvas={initialsCanvas}
          setApplyCompanyStampData={setApplyCompanyStampData}
          applyCompanyStampData={applyCompanyStampData}
          handleCompanyStampDone={handleCompanyStampDone}
        />
      </div>
      {/* )} */}
    </>
  );
}

export default RecieverPanel;
