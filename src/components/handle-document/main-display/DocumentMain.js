import React, { useEffect, useState, useRef } from "react";
import "./DocumentMain.scss";
import SidebarMainLeft from "./leftSidebar/SidebarMainLeft";
import SidebarRight from "./rightSidebar/SidebarRight";
import { pdfjs } from "react-pdf";
import { LoadPanel } from "devextreme-react";
import {
  generateThumbnails,
  handleScroll,
  getDimensionsBasedOnScreenSize,
  handleThumbnailClick,
  processImage,
} from "../../manageUser/signatureSetup/PdfUtils";
// import { useDragDropContext } from "./NewDragDropContext";
import { useDragDropContext } from "./CustomDragDropContext";
import { Rnd } from "react-rnd";
import { Center } from "devextreme-react/cjs/map";
import { CircularGauge } from "devextreme-react";
import { ReactComponent as IconDelete } from "../../../icons/delete-icon.svg";
import { CleaningServices } from "@mui/icons-material";
import samplePdf from "../../../sample.pdf";
import { useAuth } from "../../../contexts/auth";
import axios from "axios";
import { format } from "date-fns";
import { toDate, formatInTimeZone } from 'date-fns-tz';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// function DocumentMain(props) {
function DocumentMain({
  signerOptions,
  tempYEs,
  updateRecData,
  selectedFile,
  screenValue,
  setupdateRecData,
  handleSetData,
  draggedDataTemp,
  setIsAnyFieldClicked,
  isAnyFieldClicked,
  recipientTempData,
  title,
  setDownloadDraggedData,
  downloadDraggedData,
}) {
  const [numPages, setNumPages] = useState(0);
  const [mainContentUrls, setMainContentUrls] = useState([]);
  const mainContainerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [pdfImageSize, setPdfImageSize] = useState({ width: 0, height: 0 });
  const thumbnailContainerRef = useRef(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // const { draggedRecipient, handleDropRecipient } = useDragDropContext();
  const { draggedRecipient, handleDropRecipient } = useDragDropContext();
  // const [draggedData, setDraggedData] = useState([]);
  const { draggedData, setDraggedData } = useDragDropContext();
  const [recipientBoxSize, setRecipientBoxSize] = useState({
    width: 180,
    height: 100,
  });
  const [recipients, setRecipients] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(selectedFile);
  const dimensions = getDimensionsBasedOnScreenSize();
  const [activeFieldId, setActiveFieldId] = useState(null); // State to store the ID of the active field
  const [activeField, setActiveField] = useState(null);

  const [selectedSignerName, setSelectedSignerName] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  const { user } = useAuth();
  const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [applySignatureData, setApplySignatureData] = useState(null);
  const [initialsCanvas, setInitialsCanvas] = useState(null);
  const [applyInitialsData, setApplyInitialsData] = useState(null);
  const [applyCompanyStampData, setApplyCompanyStampData] = useState(null);

  const [popupSignVisible, setPopupSignVisible] = useState(false);
  const [editPenSignPopupVisible, setEditPenSignPopupVisible] = useState(false);

  const [dateFormatIndex, setDateFormatIndex] = useState(0);
  const [fontStyleIndex, setFontStyleIndex] = useState(0);
  
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
            console.log("USER DATA : ", response.data);
            setLoggedInUserdetail(response.data);
          });
      };
      getLoggedInUser();
    } else {
      return;
    }
  }, []);

  const [activeFieldData, setActiveFieldData] = useState({
    recipientId: 1111,
    recipientName: "name",
    recipientColor: "blue",
    fieldName: "Field",
    x: 0,
    y: 0,
    width: 180,
    height: 100,
    currentPageNum: 0,
  });

  const handleSelectedSignerChange = (signerName) => {
    setSelectedSignerName(signerName);
  };

  const fields = [
    { id: 1, name: "Signature" },
    { id: 2, name: "Name" },
    { id: 3, name: "Initials" },
    { id: 4, name: "Date" },
    { id: 5, name: "Text" },
    { id: 6, name: "Company Stamp" },
  ];

  const [pdfImageRect, setpdfImageRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setLoading(true);
    if (mainContentUrls.length > 0) {
      const mypdfImage = new Image();
      mypdfImage.src = mainContentUrls[0];

      mypdfImage.onload = () => {
        const pdfImage = document.querySelector(".tmpid");
        const pdfImageRect = pdfImage.getBoundingClientRect();

        setPdfImageSize({
          width: mypdfImage.width,
          height: mypdfImage.height,
        });

        setpdfImageRect({
          width: pdfImageRect.width,
          height: pdfImageRect.height,
        });

        setLoading(false);
      };

      mypdfImage.onerror = () => {
        setLoading(false); // End loading even if there's an error
        console.error('Error loading image');
      };
    }
  }, [mainContentUrls]);

  useEffect(() => {
    if (selectedFile) {
      // Generate thumbnails and content URLs
      generateThumbnails(selectedFile)
        .then(({ thumbnailUrls, contentUrls }) => {
          setNumPages(thumbnailUrls.length);
          setThumbnails(thumbnailUrls);
          setMainContentUrls(contentUrls);
        })
        .catch((error) => {
          console.error("Error generating thumbnails:", error);
        });
    }
  }, [selectedFile]);

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

  function generateUniqueId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  const handleRecipientDrop = (draggedRecipient, position, pageIndex) => {
    // console.log("draggedRecipient 1",draggedRecipient);
    if (draggedRecipient) {
      const x =
        position.x -
        mainContainerRef.current.getBoundingClientRect().left -
        recipientBoxSize.width;
      const y =
        position.y -
        mainContainerRef.current.getBoundingClientRect().top -
        recipientBoxSize.height;

      const strippedColor = draggedRecipient[0].color.replace(
        /,\s*\d+(\.\d+)?\s*\)/,
        ")"
      );
      const newColor = strippedColor.replace(")", ", 0.30)");

      draggedRecipient.map((rdata) => {
        const updDraggedData = [...draggedData];
        const existingRecipientIndex = updDraggedData.find(
          (item) => item && item.id === rdata.id
        );
        if (existingRecipientIndex) {
          if (!existingRecipientIndex.pagePositions[pageIndex]) {
            existingRecipientIndex.pagePositions[pageIndex] = [];
          }
          existingRecipientIndex.pagePositions[pageIndex].push({ x, y });
        } else {
          const newRecipient = {
            fieldName: rdata.fieldName,
            color: newColor,
            id: generateUniqueId(),
            name: rdata.name,
            pageNum: pageIndex,
            x: x,
            y: y,
            width: recipientBoxSize.width,
            height: recipientBoxSize.height,

            fileName: selectedFile.name,
            selectedFiles: selectedFile.name,
            pagePositions: { [pageIndex]: [{ x, y }] },
            size: {
              width: recipientBoxSize.width,
              height: recipientBoxSize.height,
            },
          };
          // console.log("updDraggedData", updDraggedData);
          // console.log("newRecipient", newRecipient);
          updDraggedData.push(newRecipient);
        }
        setDraggedData(updDraggedData);
      });

      handleDropRecipient();
      setIsAnyFieldClicked(true);

      setActiveFieldData((prevState) => ({
        ...prevState,
        recipientId: draggedRecipient[0].id,
        recipientName: draggedRecipient[0].name,
        recipientColor: draggedRecipient[0].color,
        fieldName: draggedRecipient[0].fieldName,
        x: draggedRecipient[0].x,
        y: draggedRecipient[0].y,
        width: draggedRecipient[0].width,
        height: draggedRecipient[0].height,
        currentPageNum: draggedRecipient[0].pageNum,
      }));
    }
  };

  const handleRecipientDrag = (recipientId, newPosition, pageIndex) => {
    if (recipientId) {
      const updatedRecipients = [...draggedData];
      const recipientIndex = updatedRecipients.findIndex(
        (item) => item.id === recipientId
      );

      // if (recipientIndex !== -1) {
      updatedRecipients[recipientIndex].pagePositions[pageIndex].forEach(
        (position) => {
          position.x = newPosition.x;
          position.y = newPosition.y;
        }
      );

      updatedRecipients[recipientIndex].x = newPosition.x;
      updatedRecipients[recipientIndex].y = newPosition.y;

      // console.log("updatedRecipients : ", updatedRecipients);
      setDraggedData(updatedRecipients);
      // handleFieldActivation();
      // console.log("plsss", draggedData);
      //console.log({ selectedFiles: selectedFiles.map(file => ({ name: file.name, size: file.size })) });
      // }
    } else {
      console.log("handleRecipientDrag else");
    }
  };

  const handleRecipientResize = (
    recipientId,
    newWidth,
    newHeight,
    position,
    pageIndex,
    recipient
  ) => {
    if (recipientId) {
      const updatedRecipients = [...draggedData];
      const recipientIndex = updatedRecipients.findIndex(
        (item) => item.id === recipientId
      );
      if (recipientIndex !== -1) {
        console.log("newWidth: ", newWidth);
        console.log("newHeight: ", newHeight);

        updatedRecipients[recipientIndex].size.width = parseInt(newWidth);
        updatedRecipients[recipientIndex].size.height = parseInt(newHeight);
        updatedRecipients[recipientIndex].pagePositions[pageIndex].forEach(
          (pos) => {
            pos.x = position.x;
            pos.y = position.y;
          }
        );

        updatedRecipients[recipientIndex].width = parseInt(newWidth);
        updatedRecipients[recipientIndex].height = parseInt(newHeight);

        setDraggedData(updatedRecipients);
        console.log("recipientttt", recipient);
      }
    }
  };

  const handleDeleteRecipient = (recipientIdToDelete, e) => {
    // e.stopPropagation();
    setIsAnyFieldClicked(false);

    setDraggedData((prevDraggedData) =>
      prevDraggedData.filter(
        (recipient) => recipient.id !== recipientIdToDelete
      )
    );
  };

  useEffect(() => {
    if (screenValue && screenValue === "Document" && tempYEs === "yes") {
      console.log("drageddatatemp:", draggedDataTemp);
      handleSetData(draggedDataTemp);
    } else if (screenValue != "viewDocument") {
      handleSetData(draggedData);
    }
  }, [handleDeleteRecipient]);

  const handleDragDropBoxClicked = (e) => {
    setIsAnyFieldClicked(true);

    setActiveFieldData((prevState) => ({
      ...prevState,
      recipientId: e.id,
      recipientName: e.name,
      recipientColor: e.color,
      fieldName: e.fieldName,
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height,
      currentPageNum: e.pageNum,
    }));
  };

  const copyCurrentBoxToAllPages = (currentBox) => {
    if (activeFieldData) {
      const { x, y, width, height, fieldName } = activeFieldData;
      const updatedDraggedData = [...draggedData];

      // Loop through all pages
      for (let i = 0; i < numPages; i++) {
        // Check if the active field is already present on this page
        // const existingFieldOnPage = updatedDraggedData.find(
        //   (field) => field.pageNum === i
        // );

        const existingFieldOnPage = updatedDraggedData.find(
          (field) =>
            field.pageNum === i &&
            field.fieldName === fieldName &&
            field.x === x &&
            field.y === y &&
            field.width === width &&
            field.height === height
        );

        // If not present, create a copy and add it to the draggedData
        if (!existingFieldOnPage) {
          updatedDraggedData.push({
            // ...activeFieldData,
            id: generateUniqueId(),
            pageNum: i,
            name: activeFieldData.recipientName,
            fileName: selectedFile,
            selectedFiles: selectedFile,
            x: activeFieldData.x,
            y: activeFieldData.y,
            width: activeFieldData.width,
            height: activeFieldData.height,
            size: {
              width: activeFieldData.width,
              height: activeFieldData.height,
            },
            fieldName: activeFieldData.fieldName,
            color: activeFieldData.recipientColor,
            pagePositions: { [i]: [{ x, y }] },
          });
        }
      }

      // Update the state with the new draggedData
      setDraggedData(updatedDraggedData);
    }
  };

  const copyCurrentBoxToBelowPages = (currentBox) => {
    if (activeFieldData) {
      const { x, y, width, height, fieldName, currentPageNum } =
        activeFieldData;
      const updatedDraggedData = [...draggedData];

      for (let i = 0; i < numPages; i++) {
        if (i > currentPageNum) {
          const existingFieldOnPage = updatedDraggedData.find(
            (field) =>
              field.pageNum === i &&
              field.fieldName === fieldName &&
              field.x === x &&
              field.y === y &&
              field.width === width &&
              field.height === height
          );

          // If not present, create a copy and add it to the draggedData
          if (!existingFieldOnPage) {
            updatedDraggedData.push({
              // ...activeFieldData,
              id: generateUniqueId(),
              pageNum: i,
              name: activeFieldData.recipientName,
              fileName: selectedFile,
              selectedFiles: selectedFile,
              x: activeFieldData.x,
              y: activeFieldData.y,
              width: activeFieldData.width,
              height: activeFieldData.height,
              size: {
                width: activeFieldData.width,
                height: activeFieldData.height,
              },
              fieldName: activeFieldData.fieldName,
              color: activeFieldData.recipientColor,
              pagePositions: { [i]: [{ x, y }] },
            });
          }
        }
      }
      setDraggedData(updatedDraggedData);
    }
  };

  const handleBgCLicked = () => {
    console.log("box img");
    if(screenValue!="viewDocument"){
      setIsAnyFieldClicked(false);
    }
  };

  const findSignerByTemplateRec = (templateRec) => {
    return signerOptions.find((signer) => signer.templateRec === templateRec);
  };

  const findRecipientFullName = (templateRecId, createdBy, templateId) => {
    const recipient = recipientTempData.find(
      (rec) =>
        rec.id === templateRecId &&
        rec.role === 1 &&
        rec.created_by === createdBy &&
        rec.template_id === templateId
    );
    return recipient ? recipient.fullName : "Unknown Recipient";
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
    setDownloadDraggedData(updatedDraggedData)
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
    setDownloadDraggedData(updatedDraggedData)
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
    setDownloadDraggedData(updatedDraggedData)
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

    console.log("dateTime", dateTime);

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
        context.font = "12px Inter";
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
    setDownloadDraggedData(updatedDraggedData)
  };

  const handleNameDone = () => {
    const fontStyles = [
      "20px Brush Script MT",
      "20px Inter",
      "20px Arial",
      "20px Times New Roman",
      "20px Lucida Handwriting",
      "20px Pacifico",
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
    setDownloadDraggedData(updatedDraggedData)

  };

  return (
    <>
    {loading ? <LoadPanel visible="true" /> : ""}
      <div
        className="main-container"
        onClick={() => {
          handleBgCLicked();
        }}
      >
        {screenValue && screenValue === "Template" && (
          <>
            <SidebarMainLeft
              fields={fields}
              allrecipients={signerOptions}
              onSelectedSignerChange={handleSelectedSignerChange}
              loggedInUserDetail={loggedInUserDetail}
              setApplySignatureData={setApplySignatureData}
              applySignatureData={applySignatureData}
              setSignatureCanvas={setSignatureCanvas}
              signatureCanvas={signatureCanvas}
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
                          <div className="mainpage " key={index}>
                            <div
                              className="main-pdf-page-container "
                              onDrop={(e) => {
                                e.preventDefault();
                                const pageIndex = index;
                                handleRecipientDrop(
                                  // console.log("draggedRecipient...",draggedRecipient),
                                  draggedRecipient,
                                  { x: e.clientX, y: e.clientY },
                                  pageIndex
                                );
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              {draggedData.map((recipient, i) => {
                                const pagePositions =
                                  recipient.pagePositions[index];
                                if (
                                  recipient.id &&
                                  pagePositions &&
                                  pagePositions.length > 0
                                ) {
                                  return pagePositions.map((position, j) => (
                                    <Rnd
                                      key={`${i}_${j}`}
                                      bounds="parent"
                                      size={recipient.size}
                                      position={{
                                        x: position.x,
                                        y: position.y,
                                      }}
                                      className="drag-box"
                                      style={{
                                        backgroundColor: recipient.color,
                                      }}
                                      minWidth={dimensions.minWidth}
                                      minHeight={dimensions.minHeight}
                                      maxWidth={dimensions.maxWidth}
                                      maxHeight={dimensions.maxHeight}
                                      enableResizing={{
                                        topRight: true,
                                        bottomRight: true,
                                        bottomLeft: true,
                                        topLeft: true,
                                      }}
                                      onDragStop={(e, d) => {
                                        handleRecipientDrag(
                                          recipient.id,
                                          d,
                                          index
                                        );
                                      }}
                                      onResizeStop={(
                                        e,
                                        direction,
                                        ref,
                                        delta,
                                        position
                                      ) => {
                                        handleRecipientResize(
                                          recipient.id,
                                          ref.style.width,
                                          ref.style.height,
                                          position,
                                          index,
                                          recipient
                                        );
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDragDropBoxClicked(recipient);
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
                                      <IconDelete
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteRecipient(
                                            recipient.id,
                                            e
                                          );
                                        }}
                                        className="recipient-box-delete"
                                      />
                                    </Rnd>
                                  ));
                                }
                                return null;
                              })}

                              <img
                                src={mainContentUrls[index]}
                                alt={`Page ${index + 1}`}
                                className="tmpid"
                                draggable="false"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {screenValue && screenValue === "Document" && tempYEs === "yes" && (
          <>
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
                              {draggedDataTemp.map((recipient, i) => {
                                // const pagePositions = recipient.pageNum;
                                // if (
                                //   recipient.id &&
                                //   pageNum &&
                                //   pageNum.length > 0
                                // ) {
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

                                  const fullName = findRecipientFullName(
                                    recipient.templateRec,
                                    recipient.created_by,
                                    recipient.template
                                  );

                                  return (
                                    // pagePositions.map((position, j) =>
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
                                    >
                                      <div className="recipient-box">
                                        <div className="recipient-box-data">
                                          <p className="dropped-box-field-name">
                                            {recipient.fieldName}
                                          </p>
                                          <p className="dropped-box-recipient-name">
                                            {fullName}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
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
          </>
        )}

        {screenValue && screenValue === "Document" && tempYEs === "no" && (
          <>
            <SidebarMainLeft
              fields={fields}
              allrecipients={signerOptions}
              // onFieldActivation={handleFieldActivation}
              onSelectedSignerChange={handleSelectedSignerChange}
              loggedInUserDetail={loggedInUserDetail}
              setApplySignatureData={setApplySignatureData}
              applySignatureData={applySignatureData}
              setSignatureCanvas={setSignatureCanvas}
              signatureCanvas={signatureCanvas}
              handleSignatureDone={handleSignatureDone}
              editPenSignPopupVisible={editPenSignPopupVisible}
              setPopupSignVisible={setPopupSignVisible}
              popupSignVisible={popupSignVisible}
              setInitialsCanvas={setInitialsCanvas}
              initialsCanvas={initialsCanvas}
              setApplyInitialsData={setApplyInitialsData}
              applyInitialsData={applyInitialsData}
              handleInitialsDone={handleInitialsDone}
              applyCompanyStampData={applyCompanyStampData}
              handleCompanyStampDone={handleCompanyStampDone}
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
                          <div className="mainpage " key={index}>
                            <div
                              className="main-pdf-page-container "
                              onDrop={(e) => {
                                e.preventDefault();
                                const pageIndex = index;
                                handleRecipientDrop(
                                  // console.log("draggedRecipient...",draggedRecipient),
                                  draggedRecipient,
                                  { x: e.clientX, y: e.clientY },
                                  pageIndex
                                );
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              {/* {console.log("draggedData -:-  ",draggedData)} */}
                              {draggedData.map((recipient, i) => {
                                const pagePositions =
                                  recipient.pagePositions[index];
                                if (
                                  recipient.id &&
                                  pagePositions &&
                                  pagePositions.length > 0
                                ) {
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

                                  // return pagePositions.map((position, j) => (
                                  //   <Rnd
                                  //     key={`${i}_${j}`}
                                  //     bounds="parent"
                                  //     size={recipient.size}
                                  //     position={{
                                  //       x: position.x,
                                  //       y: position.y,
                                  //     }}
                                  //     className="drag-box"
                                  //     style={{
                                  //       left: adjustedLeft,
                                  //       top: adjustedTop,
                                  //       width: adjustedWidth,
                                  //       height: adjustedHeight,
                                  //       backgroundColor: recipient.color,
                                  //     }}
                                  //     minWidth={dimensions.minWidth}
                                  //     minHeight={dimensions.minHeight}
                                  //     maxWidth={dimensions.maxWidth}
                                  //     maxHeight={dimensions.maxHeight}
                                  //     enableResizing={{
                                  //       topRight: true,
                                  //       bottomRight: true,
                                  //       bottomLeft: true,
                                  //       topLeft: true,
                                  //     }}
                                  //     onDragStop={(e, d) => {
                                  //       handleRecipientDrag(
                                  //         recipient.id,
                                  //         d,
                                  //         index
                                  //       );
                                  //     }}
                                  //     onResizeStop={(
                                  //       e,
                                  //       direction,
                                  //       ref,
                                  //       delta,
                                  //       position
                                  //     ) => {
                                  //       handleRecipientResize(
                                  //         recipient.id,
                                  //         ref.style.width,
                                  //         ref.style.height,
                                  //         position,
                                  //         index
                                  //       );
                                  //     }}
                                  //     onClick={(e) => {
                                  //       e.stopPropagation();
                                  //       handleDragDropBoxClicked(recipient);
                                  //     }}
                                  //   >
                                  //     <div className="recipient-box">
                                  //       <div className="recipient-box-data">
                                  //         <p className="dropped-box-field-name">
                                  //           {recipient.fieldName}
                                  //         </p>
                                  //         <p className="dropped-box-recipient-name">
                                  //           {recipient.name}
                                  //         </p>
                                  //       </div>
                                  //     </div>
                                  //     <IconDelete
                                  //       onClick={(e) => {
                                  //         e.stopPropagation();
                                  //         handleDeleteRecipient(
                                  //           recipient.id,
                                  //           e
                                  //         );
                                  //       }}
                                  //       className="recipient-box-delete"
                                  //     />
                                  //   </Rnd>
                                  // ));

                                  const signatureData = recipient.signatureData;
                                  if (!signatureData) {
                                    return pagePositions.map((position, j) => (
                                      <Rnd
                                        key={`${i}_${j}`}
                                        bounds="parent"
                                        size={recipient.size}
                                        position={{
                                          x: position.x,
                                          y: position.y,
                                        }}
                                        className="drag-box"
                                        style={{
                                          left: adjustedLeft,
                                          top: adjustedTop,
                                          width: adjustedWidth,
                                          height: adjustedHeight,
                                          backgroundColor: recipient.color,
                                        }}
                                        minWidth={dimensions.minWidth}
                                        minHeight={dimensions.minHeight}
                                        maxWidth={dimensions.maxWidth}
                                        maxHeight={dimensions.maxHeight}
                                        enableResizing={{
                                          topRight: true,
                                          bottomRight: true,
                                          bottomLeft: true,
                                          topLeft: true,
                                        }}
                                        onDragStop={(e, d) => {
                                          handleRecipientDrag(
                                            recipient.id,
                                            d,
                                            index
                                          );
                                        }}
                                        onResizeStop={(
                                          e,
                                          direction,
                                          ref,
                                          delta,
                                          position
                                        ) => {
                                          handleRecipientResize(
                                            recipient.id,
                                            ref.style.width,
                                            ref.style.height,
                                            position,
                                            index
                                          );
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDragDropBoxClicked(recipient);
                                          console.log("ddddd",recipient);
                                          if(recipient.fieldName=="Name"){
                                            handleNameDone();
                                          }
                                          else if(recipient.fieldName=="Date"){
                                            handleDateDone();
                                          }
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
                                        <IconDelete
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRecipient(
                                              recipient.id,
                                              e
                                            );
                                          }}
                                          className="recipient-box-delete"
                                        />
                                      </Rnd>
                                    ));
                                  } else {
                                    // Render applied signature/initial if signature data is available
                                    return pagePositions.map((position, j) => (
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
                                        // onClick={(e) => {
                                        //   handleApplySignatureModal(recipient);
                                        // }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDragDropBoxClicked(recipient);
                                          if(recipient.fieldName=="Name"){
                                            handleNameDone();
                                          }
                                          else if(recipient.fieldName=="Date"){
                                            handleDateDone();
                                          }
                                        }}
                                      >
                                        <img
                                          src={signatureData.imageData}
                                          alt={`Value for ${recipient.fieldName} field`}
                                        />
                                      </div>
                                    ));

                                    // Rnd
                                    // return pagePositions.map((position, j) => (
                                    //   <Rnd
                                    //     key={`${i}_${j}`}
                                    //     bounds="parent"
                                    //     size={recipient.size}
                                    //     position={{
                                    //       x: position.x,
                                    //       y: position.y,
                                    //     }}
                                    //     className="drag-box"
                                    //     style={{
                                    //       left: adjustedLeft,
                                    //       top: adjustedTop,
                                    //       width: adjustedWidth,
                                    //       height: adjustedHeight,
                                    //       backgroundColor: recipient.color,
                                    //     }}
                                    //     minWidth={dimensions.minWidth}
                                    //     minHeight={dimensions.minHeight}
                                    //     maxWidth={dimensions.maxWidth}
                                    //     maxHeight={dimensions.maxHeight}
                                    //     enableResizing={{
                                    //       topRight: true,
                                    //       bottomRight: true,
                                    //       bottomLeft: true,
                                    //       topLeft: true,
                                    //     }}
                                    //     onDragStop={(e, d) => {
                                    //       handleRecipientDrag(
                                    //         recipient.id,
                                    //         d,
                                    //         index
                                    //       );
                                    //     }}
                                    //     onResizeStop={(
                                    //       e,
                                    //       direction,
                                    //       ref,
                                    //       delta,
                                    //       position
                                    //     ) => {
                                    //       handleRecipientResize(
                                    //         recipient.id,
                                    //         ref.style.width,
                                    //         ref.style.height,
                                    //         position,
                                    //         index
                                    //       );
                                    //     }}
                                    //     onClick={(e) => {
                                    //       e.stopPropagation();
                                    //       handleDragDropBoxClicked(recipient);
                                    //     }}
                                    //   >
                                    //     <img
                                    //       src={signatureData.imageData}
                                    //       alt={`Value for ${recipient.fieldName} field`}
                                    //     />
                                    //   </Rnd>
                                    // ));
                                  }
                                }
                                return null;
                              })}

                              <img
                                src={mainContentUrls[index]}
                                alt={`Page ${index + 1}`}
                                className="tmpid"
                                draggable="false"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {screenValue && screenValue === "viewDocument" && (
          <>
            <div className="main-pdf-container-viewDetails">
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
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

{screenValue && screenValue === "BulkSigning" && tempYEs === "no" && (
          <>
            <SidebarMainLeft
              fields={fields}
              allrecipients={signerOptions}
              // onFieldActivation={handleFieldActivation}
              onSelectedSignerChange={handleSelectedSignerChange}
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
                          <div className="mainpage " key={index}>
                            <div
                              className="main-pdf-page-container "
                              onDrop={(e) => {
                                e.preventDefault();
                                const pageIndex = index;
                                handleRecipientDrop(
                                  // console.log("draggedRecipient...",draggedRecipient),
                                  draggedRecipient,
                                  { x: e.clientX, y: e.clientY },
                                  pageIndex
                                );
                              }}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              {draggedData.map((recipient, i) => {
                                const pagePositions =
                                  recipient.pagePositions[index];
                                if (
                                  recipient.id &&
                                  pagePositions &&
                                  pagePositions.length > 0
                                ) {
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

                                  return pagePositions.map((position, j) => (
                                    <Rnd
                                      key={`${i}_${j}`}
                                      bounds="parent"
                                      size={recipient.size}
                                      position={{
                                        x: position.x,
                                        y: position.y,
                                      }}
                                      className="drag-box"
                                      style={{
                                        left: adjustedLeft,
                                        top: adjustedTop,
                                        width: adjustedWidth,
                                        height: adjustedHeight,
                                        backgroundColor: recipient.color,
                                      }}
                                      minWidth={dimensions.minWidth}
                                      minHeight={dimensions.minHeight}
                                      maxWidth={dimensions.maxWidth}
                                      maxHeight={dimensions.maxHeight}
                                      enableResizing={{
                                        topRight: true,
                                        bottomRight: true,
                                        bottomLeft: true,
                                        topLeft: true,
                                      }}
                                      onDragStop={(e, d) => {
                                        handleRecipientDrag(
                                          recipient.id,
                                          d,
                                          index
                                        );
                                      }}
                                      onResizeStop={(
                                        e,
                                        direction,
                                        ref,
                                        delta,
                                        position
                                      ) => {
                                        handleRecipientResize(
                                          recipient.id,
                                          ref.style.width,
                                          ref.style.height,
                                          position,
                                          index
                                        );
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDragDropBoxClicked(recipient);
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
                                      <IconDelete
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteRecipient(
                                            recipient.id,
                                            e
                                          );
                                        }}
                                        className="recipient-box-delete"
                                      />
                                    </Rnd>
                                  ));
                                }
                                return null;
                              })}

                              <img
                                src={mainContentUrls[index]}
                                alt={`Page ${index + 1}`}
                                className="tmpid"
                                draggable="false"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        

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
          // onFieldActivation={handleFieldActivation}
          pdfFile={selectedFile}
          activeFieldId={activeFieldId}
          pdfFileName={pdfFileName}
          isAnyFieldClicked={isAnyFieldClicked}
          // activeFieldName={activeFieldName}
          // activeRecipientName={activeRecipientName}
          activeFieldData={activeFieldData}
          title={title}
          handleDeleteRecipient={handleDeleteRecipient}
          copyCurrentBoxToAllPages={copyCurrentBoxToAllPages}
          copyCurrentBoxToBelowPages={copyCurrentBoxToBelowPages}
        />
      </div>
    </>
  );
}

export default DocumentMain;

