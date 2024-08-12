//Sign is stored & fetched from db for respected user in popup
import React, { useState, useEffect, useRef } from "react";
import { Button } from "devextreme-react/button";
import TabPanel from "devextreme-react/tab-panel";
import { Item } from "devextreme-react/tabs";
import SignatureCanvas from "react-signature-canvas";
import { ReactComponent as IconImageFile } from "../../../icons/image-file-icon.svg";
import { ReactComponent as IconDelete } from "../../../icons/delete-icon.svg";
import drawingPenRed from "../../../icons/drawing-pen-red.svg";
import drawingPenBlack from "../../../icons/drawing-pen-black.svg";
import drawingPenGreen from "../../../icons/drawing-pen-green.svg";
import btnDeleteSign from "../../../icons/delete-bin-icon.svg";
import { getCroppingRect, getNonEmptyPixels, processImage } from "./PdfUtils.js";
import { useAuth } from "../../../contexts/auth.js";
import axios from "axios";


function SignSubPanel({
  signString,
  setSignString,
  setSignatureDrawingData,
  signatureDrawingData,
  setSignatureImageData,
  signatureImageData,
  source,
  setApplySignatureData,
  applySignatureData,
  setSignatureCanvas,
  signatureCanvas,
  loggedInUserDetail,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [storedImageURL, setStoredImageURL] = useState(null);
  const modalRef = useRef(null);
  const [selectedPenColor, setSelectedPenColor] = useState("black");
  const [signatureData, setSignatureData] = useState(null);

  const [penColors, setPenColors] = useState([
    {
      color: "#910000",
      selected: false,
      icon: drawingPenRed,
      text: "Red",
      width: 94,
    },
    {
      color: "#142129",
      selected: true,
      icon: drawingPenBlack,
      text: "Black",
      width: 105,
    },
    {
      color: "#0C6230",
      selected: false,
      icon: drawingPenGreen,
      text: "Green",
      width: 110,
    },
  ]);
  const [mySignatureCanvas, setMySignatureCanvas] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [base64SignatureImage, setBase64SignatureImage] = useState(null);
  // const [loggedInUserDetail, setLoggedInUserdetail] = useState([]);
  const { user } = useAuth();
  const signatureCanvasRef = useRef(null);

  useEffect(() => {

    if (loggedInUserDetail && loggedInUserDetail.signature_details) {
      // console.log("object");
      const image = new Image();
      image.src = loggedInUserDetail.signature_details.draw_img_name;
      // console.log("img src", image.src);
      image.onload = () => {
        if (signatureCanvas) {
          // console.log("1234");
          const canvas = signatureCanvas.getCanvas();
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
      };
    }

  },[signatureCanvas])

  useEffect(() => {
    if (source === "signingPopup" && loggedInUserDetail && loggedInUserDetail.signature_details) {
      // console.log("IMG ",loggedInUserDetail.signature_details.img_name)
      const base64Data = loggedInUserDetail.signature_details.img_name;
      if (base64Data){

      
        const binaryString = atob(base64Data.split(",")[1]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const imageBlob = new Blob([bytes], { type: "image/png" });
        const imageUrl = URL.createObjectURL(imageBlob);
        const formattedSize = (bytes.byteLength / (1024 * 1024)).toFixed(2) + " MB";

        setSelectedImage(imageBlob);
        setImageDetails({ name: "SignatureImage.jpeg", size: formattedSize });
        setStoredImageURL(imageUrl);
        // setCompanyStampImageData(base64Data);
      
      }
    }
  }, [source, loggedInUserDetail]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log("file1:", file);
    if (!file) {
      // setErrorMessage("Please select a file.");
      return;
    }
    const fileType = file.type.split("/")[0];
    if (fileType !== "image") {
      setErrorMessage("Please upload an image file.");
      return;
    }
    const maxSizeInBytes = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Image size must be less than 25MB.");
      return;
    }

    if (source === "registrationform") {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("e : ", e);
        const base64Data = e.target.result;
        setBase64SignatureImage(base64Data);
        setSignatureImageData(base64Data);
      };
      reader.readAsDataURL(file);
  
      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetails({ name, size: formattedSize });
      setErrorMessage(null);
    }
    else if (source === "signingPopup") {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("e : ", e);
        const base64Data = e.target.result;
        setBase64SignatureImage(base64Data);
        setApplySignatureData(base64Data);
      };
      reader.readAsDataURL(file);
  
      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      setImageDetails({ name, size: formattedSize });
      setErrorMessage(null);
    }
  };

  const handleDrawingDone = () => {
    console.log("Source is", source);
  
    if (source === "registrationform" && signatureCanvas) {
      const dataURL = signatureCanvas.toDataURL();
      console.log("Inside handleDrawingDone dataURL 1: ", dataURL);
  
      const signatureImage = new Image();
      signatureImage.onload = () => {
        console.log("Image loaded");
  
        const canvas = document.createElement("canvas");
        canvas.width = signatureImage.width;
        canvas.height = signatureImage.height;
        const context = canvas.getContext("2d");
        context.drawImage(signatureImage, 0, 0);
        const uncroppedDataURL = canvas.toDataURL();
  
        localStorage.setItem("uncroppedSignatureData", uncroppedDataURL);
        setSignatureData(uncroppedDataURL);
        setStoredImageURL(uncroppedDataURL);
        console.log("uncroppedDataURL: ", uncroppedDataURL);
        setSignatureDrawingData(uncroppedDataURL);
      };
  
      signatureImage.src = dataURL;
    } else if (source === "signingPopup" && signatureCanvas) {
      const dataURL = signatureCanvas.toDataURL();
      // setApplySignatureData(null);
      // console.log("dataURL ----",dataURL);
      // console.log("object ------- ",applySignatureData);
  
      processImage(dataURL, (croppedDataURL) => {
        if (croppedDataURL) {
          console.log("croppedDataURL: ", croppedDataURL);
          localStorage.setItem("croppedSignatureData", croppedDataURL);
          setSignatureData(croppedDataURL);
          setStoredImageURL(croppedDataURL);
          setApplySignatureData(croppedDataURL);
  
          if (typeof setApplySignatureData === 'function') {
            setApplySignatureData(croppedDataURL);
          } else {
            console.error("setApplySignatureData is not a function");
          }
        } else {
          console.error("Failed to process image for signingPopup");
        }
      });
    } else {
      console.log("Other source", source);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageDetails(null);
    setApplySignatureData(null);
  };

  const handleClearCanvas = () => {
    if (signatureCanvas) {
      signatureCanvas.clear();
    }
  };

  const handleDeleteCanvas = () => {
    handleClearCanvas();
    setSelectedImage(null);
    setImageDetails(null);
    setCroppedImage(null);
    setApplySignatureData(null);
  };

  const handlePenColorChange = (color) => {
    const updatedPenColors = penColors.map((penColor) => ({
      ...penColor,
      selected: false,
    }));
    const updatedPenColorsWithSelected = updatedPenColors.map((penColor) =>
      penColor.color === color ? { ...penColor, selected: true } : penColor
    );
    setPenColors(updatedPenColorsWithSelected);
    setSelectedPenColor(color);
  };

  useEffect(() => {
    const buttons = document.querySelectorAll(".btn-pen-color");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        buttons.forEach((btn) => {
          btn.classList.remove("selected");
        });
        this.classList.add("selected");
      });
    });
  }, [modalRef]);

  return (
    <TabPanel>
      <Item title="Text">
        <div className="demo">Text tab content</div>
      </Item>

      <Item title="Draw">
        <div className="demo-draw-tab">
          <div className="pen-color-selection">
            {penColors.map((penColor, index) => (
              <Button
                key={index}
                // className={`btn-pen-color ${penColor.selected ? "selected" : ""}`}
                className={`btn-pen-color ${
                  penColor.selected ? "selected" : ""
                } pen-${penColor.text.toLowerCase()}`}
                icon={penColor.icon}
                text={penColor.text}
                onClick={() => handlePenColorChange(penColor.color)}
                // style={{ width: penColor.width }}
              />
            ))}
          </div>
          <div className="drawing-pad-area">
            <Button
              className="icon-button"
              icon={btnDeleteSign}
              onClick={handleDeleteCanvas}
            />
            <SignatureCanvas
              ref={(ref) => setSignatureCanvas(ref)}
              // ref={(ref) => setMySignatureCanvas(ref)}
              penColor={selectedPenColor}
              canvasProps={{ className: "signature-canvas" }}
              onEnd={handleDrawingDone}
            />
            {/* <img src={storedImageURL} alt="Signature" /> */}
          </div>
        </div>
      </Item>

      <Item title="Image">
        <div className="demo">
          {selectedImage && errorMessage ? (
            <>
              <div
                className="image-upload-area"
                onClick={() =>
                  document.getElementById("fileInputSIgnature").click()
                }
              >
                <div className="img-box">
                  <span className="drag-img">Drag an image here or</span>
                  <span className="upload-img"> Upload</span>
                </div>
                <input
                  id="fileInputSIgnature"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div
                className={
                  errorMessage
                    ? "file-validation-error-msg"
                    : "file-validation-info"
                }
              >
                {errorMessage
                  ? errorMessage
                  : "You can upload an image up to 25MB"}
              </div>
            </>
          ) : (
            <>
              <div
                className="image-upload-area"
                onClick={() =>
                  document.getElementById("fileInputSIgnature").click()
                }
              >
                <div className="img-box">
                  <span className="drag-img">Drag an image here or</span>
                  <span className="upload-img"> Upload</span>
                </div>
                <input
                  id="fileInputSIgnature"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div
                className={
                  errorMessage
                    ? "file-validation-error-msg"
                    : "file-validation-info"
                }
              >
                {errorMessage
                  ? errorMessage
                  : "You can upload an image up to 25MB"}
              </div>

              {selectedImage && (
                <div className="image-details">
                  <a
                    href={selectedImage && URL.createObjectURL(selectedImage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="details-section img-link"
                  >
                    <div className="file-icon">
                      <span className="image-icon">
                        <IconImageFile />
                      </span>
                    </div>
                    <div className="file-info">
                      <div className="image-info">
                        <span className="name">{imageDetails.name}</span>
                        <p className="size">{imageDetails.size}</p>
                      </div>
                    </div>
                  </a>
                  <span className="remove-icon" onClick={handleRemoveImage}>
                    <IconDelete />
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </Item>
    </TabPanel>
  );
}

export default SignSubPanel;
