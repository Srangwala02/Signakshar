import Header from "../Header2/Header";
import React, { useState, useRef, useEffect } from "react";
import "./dashUI.scss";
import Button from "devextreme-react/button";
import DocumentUpload from "./DocumentUpload";
import EmailMessageSection from "./EmailMessageSection";
import ExpirationDateSection from "./ExpirationDateSection";
import DocumentNameSection from "./DocumentNameSection";
import TemplateSelectionSection from "./TemplateSelectionSection";
import List, { ItemDragging } from "devextreme-react/list";
import RecipientItem from "./RecipientItem";
import ApplyTemplateRecipientItem from "./ApplyTemplateRecipientItem";
import { useLocation } from "react-router-dom";
import fileIcon from "../../../SVG/file-3-line.svg";
import axios from "axios";
import { getNumberOfPages } from "../../manageUser/signatureSetup/PdfUtils";
import { toastDisplayer } from "../../toastDisplay/toastDisplayer";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CheckboxLine } from "../../../icons/checkbox-line page-2.svg";
import { ReactComponent as Checkboxblankline } from "../../../icons/checkbox-blank-line_page-2.svg";
import MultipleDocumentUpload from "./MultipleDocumentUpload";

function DashUI() {
  /////sakshi changes
  const [multipleErrorMessage, setMultipleErrorMessage] = useState([]);
  const [multipleImageDetails, setMultipleImageDetails] = useState([]);
  const [multipleSelectedImage, setMultipleSelectedImage] = useState([]);
  const [multipleNumberOfPages, setMultipleNumberOfPages] = useState([]);
  const [multipleDocName, setMultipleDocName] = useState();
  /////
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTemplateOptionsSelected, setIsTemplateOptionsSelected] =
    useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [screenValue, setScreenValue] = useState("");
  const [firstCheckboxChecked, setFirstCheckboxChecked] = useState(false);
  const [secondCheckboxChecked, setSecondCheckboxChecked] = useState(false);
  const location = useLocation();
  const [documentData, setDocumentData] = useState(null);
  const docId = location.state?.docId;

  useEffect(() => {
    if (docId) {
      console.log("====================");
      fetch("http://localhost:8000/api/get_doc/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docId: docId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          console.log("================", response);
          return response.json();
        })
        .then((data) => {
          setDocumentData(data);
          if (data && data.name) {
            setDocName(data.name);
          }
          if (data && data.email_message) {
            setEmailMessage(data.email_message);
          }
          console.log(data.email_title);
          if (data && data.email_title) {
            setEmailTitle(data.email_title);
          }
          if (data && data.expirationDateTime) {
            const expirationDate = new Date(data.expirationDateTime);
            const currentDate = new Date();
            const timeDifference = expirationDate - currentDate;
            const daysDifference = Math.ceil(
              timeDifference / (1000 * 3600 * 24)
            ); // Convert milliseconds to days
            setExpirationDays(daysDifference);
            setScheduledDate(data.expirationDateTime); // Update expirationDays state
          }

          if (data && data.reminderDays) {
            setReminderDays(data.reminderDays);
          }
          console.log("data.recipients : ", data.recipients);
          if (data && data.recipients) {
            const transformedRecipients = data.recipients.map(
              (recipient, index) => ({
                id: index + 1,
                fullName: recipient.RecipientName,
                emailId: recipient.RecipientEmail,
                role: recipient.role,
                testID: index + 1,
              })
            );
            console.log("transformedRecipients :", transformedRecipients);
            setRecipientData(transformedRecipients);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [docId]);

  const selectedRowData = location.state?.selectedRowData;

  const handleFirstCheckboxChange = () => {
    if (firstCheckboxChecked) {
      setEmailAction(""); // Clear action or set to a default value
      setFirstCheckboxChecked(false); // Uncheck the first checkbox
    } else {
      setEmailAction("C");
      setFirstCheckboxChecked(true); // Set the first checkbox to checked
      setSecondCheckboxChecked(false); // Uncheck the second checkbox
    }
  };

  const handleSecondCheckboxChange = () => {
    if (secondCheckboxChecked) {
      setEmailAction(""); // Clear action or set to a default value
      setFirstCheckboxChecked(false); // Uncheck the first checkbox
      setSecondCheckboxChecked(false); // Uncheck the second checkbox
    } else {
      setEmailAction("S");
      setFirstCheckboxChecked(false); // Uncheck the first checkbox
      setSecondCheckboxChecked(true); // Set the second checkbox to checked
    }
  };
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageDetails(null);
    return toastDisplayer("success", "Pdf File Removed");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      // setErrorMessage("Please select a file.");
      return;
    }

    // // const fileType = file.type;
    if (file.type != "application/pdf") {
      setErrorMessage("Invalid File Type, only pdf are allowed!");
      return;
    }

    const maxSizeInBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMessage("Pdf size must be less than 25MB.");
      return;
    }

    setSelectedImage(file);
    toastDisplayer("success", "Pdf File Uploaded");

    const { name, size } = file;
    const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
    setImageDetails({ name, size: formattedSize });
    setErrorMessage(null);
  };

  const documentOptions = ["Signer", "Viewer"];

  const [templateOption, setTemplateOption] = useState([]);
  const [recipientTempData, setRecipientTempData] = useState([]);

  const [recipientData, setRecipientData] = useState([
    {
      id: 1,
      fullName: "",
      emailId: "",
      role: "",
      testID: 1,
    },
  ]);

  // for document
  const [emailTitle, setEmailTitle] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const handleemailTitle = (e) => {
    // console.log("emailtitle",e.value);
    setEmailTitle(e.value);
  };

  const handleEmailMessage = (e) => {
    // console.log("emailtitle",e.value);
    setEmailMessage(e.value);
  };

  useEffect(() => {
    const fetchTemplateOptions = async () => {
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
        const templatesWithData = await Promise.all(
          response.data.map(async (template) => {
            const recipientResponse = await axios.get(
              `http://localhost:8000/api/TemplateRecipientByTemplateId/${template.template_id}/`,
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              }
            );
            template.recipientData = recipientResponse.data;
            return template;
          })
        );
        setTemplateOption(templatesWithData);

        if (selectedTemplate) {
          setRecipientData([]);
          var tempData = selectedTemplate.recData;
          tempData.map((e, index) => {
            var data = {
              created_by: e.created_by,
              name: e.name,
              role: e.role,
              template_id: e.template,
              id: e.id,
              fullName: "",
              emailId: "",
              testID: index + 1,
            };
            setRecipientData((prevData) => [...prevData, data]);
          });
        }
      } catch (error) {
        console.error("Error fetching template options:", error);
      }
    };
    fetchTemplateOptions();
  }, [selectedTemplate]);

  const handleAddRecipient = () => {
    const newId = recipientData.length + 1;
    var newRecipient = {
      id: newId,
      fullName: "",
      emailId: "",
      role: "",
      testID: newId,
    };

    setRecipientData((prevData) => [...prevData, newRecipient]);
  };

  const handleDeleteRecipient = (id) => {
    if (recipientData.length === 1) {
      return;
    }
    setRecipientData((prevData) => {
      const newData = prevData.filter((recipient) => recipient.id !== id);
      newData.forEach((recipient, index) => {
        recipient.testID = index + 1;
        recipient.id = index + 1;
      });

      return newData;
    });
  };

  const handleRecipientChange = (id, field, value) => {
    setRecipientData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleChangeItemDragging = (e) => {
    rearrange(e.fromIndex, e.toIndex);
  };

  function rearrange(fromIndex, toIndex) {
    if (
      fromIndex < 0 ||
      fromIndex >= recipientData.length ||
      toIndex < 0 ||
      toIndex >= recipientData.length
    ) {
      setRecipientData(recipientData);
      return;
    }

    setRecipientData((prevData) => {
      const newData = [...prevData];
      const elementToMove = newData[fromIndex];
      newData.splice(fromIndex, 1);
      newData.splice(toIndex, 0, elementToMove);
      newData.forEach((recipient, index) => {
        recipient.testID = index + 1;
      });

      return newData;
    });
  }

  var templateValue;
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const templateValue = queryParams.get("template");
    if (templateValue) {
      setScreenValue(templateValue);
    }
  }, [location.search]);

  const [templateName, settemplateName] = useState();
  const navigate = useNavigate();
  const [creatorid, setCreatorid] = useState();

  useEffect(() => {
    const fetchuserData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const response = await axios.get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setCreatorid(response.data.user.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchuserData();
  }, []);
  const handleProceed = async () => {
    if (screenValue === "Template") {
      if (selectedImage === null) {
        return toastDisplayer("error", "Upload pdf");
      }

      if (templateName === "") {
        return toastDisplayer("error", "Enter Template Name!");
      }

      if (recipientData.length <= 0) {
        return toastDisplayer("error", "Add default Recipient...!!");
      }

      const allRecipientsFilled = recipientData.every(
        (recipient) => recipient.fullName.trim() !== "" && recipient.role !== ""
      );

      if (!allRecipientsFilled) {
        return toastDisplayer(
          "error",
          "Please fill out all recipient details."
        );
      }
      const hasSigner = recipientData.some(
        (recipient) => recipient.role === "Signer"
      );
      if (!hasSigner) {
        return toastDisplayer(
          "error",
          "At least one recipient must have the role of 'Signer'."
        );
      }

      if (
        templateName &&
        selectedImage &&
        creatorid &&
        recipientData &&
        allRecipientsFilled &&
        hasSigner
      ) {
        try {
          const tempNumPages = await getNumberOfPages(selectedImage);
          const jwtToken = localStorage.getItem("jwt");
          const tempResponse = await axios.post(
            "http://localhost:8000/api/templateapi/",
            {
              templateName: templateName,
              createTempfile: selectedImage.name,
              templateNumPages: tempNumPages,
              created_by: creatorid,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          if (
            tempResponse.data.error ===
            "Template with the same name already exists for this user."
          ) {
            toastDisplayer("error", "This template name already exists!");
            return;
          }

          for (const rec of recipientData) {
            var roleid;
            if (rec.role === "Signer") {
              roleid = 1;
            } else if (rec.role === "Viewer") {
              roleid = 2;
            }
            await axios.post(
              "http://127.0.0.1:8000/api/TemplateRecipient/",
              {
                name: rec.fullName,
                created_by: creatorid,
                role: roleid,
                template: tempResponse.data.template_id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }

          navigate(
            `/createorsigndocument?template=Template&tid=${tempResponse.data.template_id}`,
            { state: { selectedFile: selectedImage } }
          );
        } catch (error) {
          console.error(
            "Error fetching user data or posting template data:",
            error
          );
        }
      } else {
        return toastDisplayer("error", "Fill all the fields");
      }
    }
  };

  const [numberOfPages, setNumberOfPages] = useState(null);
  const fetchNumberOfPages = async () => {
    if (selectedImage) {
      try {
        const pages = await getNumberOfPages(selectedImage);
        setNumberOfPages(pages);
      } catch (error) {
        console.error("Error calculating number of pages:", error);
        setNumberOfPages(null);
      }
    } else {
      setNumberOfPages(null);
    }
  };
  const [OnceClicked, setOnceClicked] = useState(true);

  const [docName, setDocName] = useState();
  // N = NONE
  // S = Sequence
  // C = Conccurent + Sequencial
  const [getEmailAction, setEmailAction] = useState("N");

  const handleProceedDocument = async () => {
    const currentDate = new Date();
    const diffTime = new Date(scheduledDate) - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if(selectedImage==null)
    {
        return toastDisplayer("error","Please upload the pdf!!!")
    }

    if (docName == null) {
      return toastDisplayer("error", "Please set document name...!!");
    }
    const allRecipientsFilled = recipientData.every(
      (recipient) =>
        recipient.fullName.trim() !== "" &&
        recipient.emailId.trim() !== "" &&
        recipient.role !== ""
    );

    // If all recipients are not filled out, display an error message
    if (!allRecipientsFilled) {
      return toastDisplayer("error", "Please fill out all recipient details.");
    }
    if (!emailTitle) {
      return toastDisplayer("error", "Please fill the email tittle");
    }
    // if (!emailMessage) {
    //   return toastDisplayer("error", "pls fill the email message");
    // }
    if (recipientData.length <= 0) {
      return toastDisplayer("error", "Add Recipient...!!");
    }
    if(expirationDays===0)
    {
      return toastDisplayer("error", "Set Expiration date...!!");
    }
    // if (expirationDays >= 2 && reminderDays <= 0) {
    //   return toastDisplayer("error", "Select reminder days...!!");
    // }

    try {
      console.log("recipientData:", recipientData);

      const recDataToSend = recipientData.map((recipient) => ({
        RecipientName: recipient.fullName,
        RecipientEmail: recipient.emailId,
        role:
          recipient.role === 1 || recipient.role === "Signer"
            ? "Signer"
            : "Viewer",
      }));
      const payload = {
        name: docName,
        pdfName: selectedImage.name,
        size: selectedImage.size,
        s3Key: selectedImage.name,
        creator_id: creatorid,
        status: "Pending",
        receipientData: recDataToSend,
        email_title: emailTitle,
        email_message: emailMessage,
        emailAction: getEmailAction,
        scheduledDate: scheduledDate,
        expirationDays: expirationDays,
        reminderDays: reminderDays,
      };

      const response = await axios.post(
        "http://localhost:8000/api/save_doc/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        toastDisplayer(
          "error",
          "Error in recipient data" + response.data.error
        );
        return;
      } else {
        if (isTemplateOptionsSelected != null) {
          navigate(
            `/createorsigndocument?template=Document&tempYes=yes&did=${response?.data?.doc_id}&tid=${recipientData[0].template_id}`,
            {
              state: {
                selectedFile: selectedImage,
                creatorid: creatorid,
                emailTitle: emailTitle,
                emailMessage: emailMessage,
                scheduledDate: scheduledDate,
                reminderDays: reminderDays,
                recipientTempData: recipientData,
                Expiration: {
                  expirationDays: expirationDays,
                  scheduledDate: scheduledDate,
                  reminderDays: reminderDays,
                },
              },
            }
          );
        } else {
          navigate(
            `/createorsigndocument?template=Document&tempYes=no&did=${response?.data?.doc_id}`,
            {
              state: {
                selectedFile: selectedImage,
                creatorid: creatorid,
                emailAction: getEmailAction,
                Expiration: {
                  expirationDays: expirationDays,
                  scheduledDate: scheduledDate,
                  reminderDays: reminderDays,
                },
              },
            }
          );
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.error ===
          "Document with the same name already exists for this user."
      ) {
        return toastDisplayer(
          "error",
          "Document with the same name already exists for this user."
        );
      } else if (
        error.response &&
        error.response.data.RecipientEmail &&
        error.response.data.RecipientEmail[0] === "Enter a valid email address."
      ) {
        toastDisplayer("error", "Enter a valid email address.");
        return;
      } else {
        return toastDisplayer("error", "Fill Details!");
      }
    }
  };

  // =======================================================
  const disabledLabel = { "aria-label": "Disabled" };
  const maxAndMinLabel = { "aria-label": "Min And Max" };
  const [recipientEmail, setRecipientEmail] = useState("");
  const [expirationDays, setExpirationDays] = useState(0);
  const [scheduledDate, setScheduledDate] = useState("");
  const [reminderDays, setReminderDays] = useState(0); // Default reminder days

  useEffect(() => {
    // Calculate scheduled date based on expiration days when expirationDays changes
    const currentDate = new Date();
    const scheduledDate = new Date(
      currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000
    );
    setScheduledDate(scheduledDate.toISOString().slice(0, 10)); // Format the date as per date input
  }, [expirationDays]);

  const [reminderOptions, setReminderOptions] = useState(["Select days"]);

  useEffect(() => {
    // Calculate reminder options based on the difference between current date and scheduled date
    const currentDate = new Date();
    const diffTime = new Date(scheduledDate) - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setReminderDays(0);
    if (diffDays < 2) {
      // setReminderDays(-1);
      setReminderOptions([{ text: "Select days", value: 0 }]);
    } else if (diffDays < 4) {
      // setReminderDays(2);
      setReminderOptions([{ text: "2 days", value: 2 }]);
    } else if (diffDays >= 4 && diffDays <= 5) {
      // setReminderDays(4);
      setReminderOptions([
        { text: "2 days", value: 2 },
        { text: "4 days", value: 4 },
      ]);
    } else if (diffDays >= 6 && diffDays <= 7) {
      // setReminderDays(6);
      setReminderOptions([
        { text: "2 days", value: 2 },
        { text: "4 days", value: 4 },
        { text: "6 days", value: 6 },
      ]);
    } else if (diffDays >= 8) {
      // setReminderDays(8);
      setReminderOptions([
        { text: "2 days", value: 2 },
        { text: "4 days", value: 4 },
        { text: "6 days", value: 6 },
        { text: "8 days", value: 8 },
      ]);
    }
  }, [scheduledDate]);

  const handleExpirationChange = (e) => {
    console.log(e.value);
    setExpirationDays(e.value);
  };

  const handleScheduledDateChange = (value) => {
    console.log(value);
    // Calculate expiration days based on scheduled date when scheduledDate changes
    const currentDate = new Date();
    const scheduledDate = new Date(value);
    const diffTime = scheduledDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setExpirationDays(diffDays);
    setScheduledDate(value);
  };

  const handleReminderChange = (e) => {
    setReminderDays(parseInt(e));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/schedule_email/",
        {
          email: recipientEmail,
          scheduledDate: scheduledDate,
          reminderDays: reminderDays, // Include reminder days in the request data
        }
      );
      if (response.status === 200) {
        console.log("Email scheduled successfully");
      } else {
        console.error("Error scheduling email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDocumnetProceed = async (e) => {
    const currentDate = new Date();
    const diffTime = new Date(scheduledDate) - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (recipientData.length <= 0) {
      return toastDisplayer("error", "Add Recipient...!!");
    }
    if (expirationDays >= 2 && reminderDays <= 0) {
      return toastDisplayer("error", "Select reminder days...!!");
    }
  };

  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        console.log(jwtToken);
        const response = await axios.get(
          "http://localhost:8000/api/current-user/",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const onTemplateSelect = (selectedTemplate) => {
    setIsTemplateOptionsSelected(selectedTemplate);
  };

  /////sakshi changes
  const handleMultipleRemoveImage = (index) => {
    setMultipleSelectedImage((prevImages) =>
      prevImages.map((innerArray) => innerArray.filter((_, i) => i != index))
    );
    setMultipleImageDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  const handleMultipleImageUpload = (event) => {
    const files = event.target.files; // This will be a FileList object

    if (!files) {
      // setErrorMessage("Please select a file.");
      return;
    }

    const fileArray = Array.from(files); // Convert FileList to an array if needed
    const maxSizeInBytes = 25 * 1024 * 1024;

    setMultipleSelectedImage((prevData) => [...prevData, fileArray]);

    fileArray.forEach((file) => {
      console.log(file.name); // Process each file
      // Add your file processing logic here
      if (file.type != "application/pdf") {
        setMultipleErrorMessage((prevErrors) => [
          ...prevErrors,
          "Invalid File Type, only pdf are allowed!",
        ]);
        return;
      }

      if (file.size > maxSizeInBytes) {
        setMultipleErrorMessage((prevErrors) => [
          ...prevErrors,
          "Pdf size must be less than 25MB.",
        ]);
        return;
      }

      toastDisplayer("success", "Pdf File Uploaded");

      const { name, size } = file;
      const formattedSize = (size / (1024 * 1024)).toFixed(2) + " MB";
      // setMultipleImageDetails();
      setMultipleImageDetails((prevImageDetails) => [
        ...prevImageDetails,
        { name, size: formattedSize },
      ]);
      setMultipleErrorMessage((prevErrors) => [...prevErrors, null]);
    });
  };

  const fetchMultipleNumberOfPages = async () => {
    console.log("multiple selected image", multipleSelectedImage);

    if (multipleSelectedImage && multipleSelectedImage.length > 0) {
      try {
        // Process each image in the multipleSelectedImage array
        // const pagesPromises = multipleSelectedImage.map(image =>
        //   image.map(img => getNumberOfPages(img))
        // );
        // console.log("pagesPromises : ", pagesPromises);
        // const pages = await Promise.all(pagesPromises);
        // console.log("pages : ", pages);
        // Get an array of promises
        const pagesPromises = multipleSelectedImage.flatMap((image) =>
          image.map((img) => getNumberOfPages(img))
        );
        console.log("pagesPromises : ", pagesPromises);

        // Wait for all promises to resolve
        const pages = await Promise.all(pagesPromises);
        console.log("pages : ", pages);

        // Update the state with the results for all images
        // setMultipleNumberOfPages((prevPages) => [...prevPages, pages]);
        setMultipleNumberOfPages(pages);
      } catch (error) {
        console.error("Error calculating number of pages:", error);
        // Update the state with null for each image in case of an error
        setMultipleNumberOfPages((prevPages) => [...prevPages, 0]);
      }
    } else {
      // If there are no images, add null to the state
      setMultipleNumberOfPages((prevPages) => [...prevPages, 0]);
    }
  };

  const handleProceedMultipleDocument = async () => {
    try {
      const recDataToSend = recipientData.map((recipient) => ({
        RecipientName: recipient.fullName,
        RecipientEmail: recipient.emailId,
        role:
          recipient.role === 1 || recipient.role === "Signer"
            ? "Signer"
            : "Viewer",
      }));
      let pdfDetails = [];
      multipleImageDetails.map((image) => {
        let data = {
          name: image.name,
          size: image.size,
        };
        pdfDetails.push(data);
        console.log(pdfDetails);
      });
      console.log("docName : ", multipleDocName);
      const payload = {
        name: multipleDocName,
        selectedPdfs: pdfDetails,
        s3Key: multipleDocName,
        creator_id: creatorid,
        status: "Pending",
        receipientData: recDataToSend,
        email_title: emailTitle,
        email_message: emailMessage,
        emailAction: getEmailAction,
        scheduledDate: scheduledDate,
        expirationDays: expirationDays,
        reminderDays: reminderDays,
      };

      const response = await axios.post(
        "http://localhost:8000/api/save_multiple_doc/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      if (response.data.error) {
        toastDisplayer(
          "error",
          "Error in recipient data" + response.data.error
        );
        return;
      } else {
        // if (isTemplateOptionsSelected != null) {
        //   navigate(
        //     `/createorsigndocument?template=BulkSigning&tempYes=yes&did=${response?.data?.doc_id}&tid=${recipientData[0].template_id}`,
        //     {
        //       state: {
        //         selectedFile: multipleSelectedImage[0],
        //         creatorid: creatorid,
        //         emailTitle: emailTitle,
        //         emailMessage: emailMessage,
        //         scheduledDate: scheduledDate,
        //         reminderDays: reminderDays,
        //         recipientTempData: recipientData,
        //         Expiration: {
        //           expirationDays: expirationDays,
        //           scheduledDate: scheduledDate,
        //           reminderDays: reminderDays,
        //         },
        //       },
        //     }
        //   );
        // } else {
          navigate(
            ` /createorsigndocument?template=BulkSigning&tempYes=no&did=${response?.data?.doc_id}`,
            {
              state: {
                selectedFile: multipleSelectedImage[0],
                creatorid: creatorid,
                emailAction: getEmailAction,
                Expiration: {
                  expirationDays: expirationDays,
                  scheduledDate: scheduledDate,
                  reminderDays: reminderDays,
                },
              },
            }
          );
        }
      // }
    } catch (error) {
      console.error("Error while calling DocumentTable API:", error);
      console.log("errr:", error);
      if (
        error.response.data.error ===
        "Document with the same name already exists for this user."
      ) {
        return toastDisplayer(
          "error",
          "Document with the same name already exists for this user."
        );
      }
      if (
        error.response.data.RecipientEmail[0] === "Enter a valid email address."
      ) {
        toastDisplayer("error", "Enter a valid email address.");
        return;
      }
    }
  };
  //////

  return (
    <>
      <div className="my-container">
        <Header title={"Sign-akshar"} />
        <div className="first-container">
          <div className="inner-container">
            <div className="section1">
              {screenValue && screenValue === "Template" && (
                <>
                  <div className="prepare">
                    Prepare the template for signature position
                  </div>
                  <Button
                    text="Proceed"
                    onClick={handleProceed}
                    className="process-btn"
                  />
                  
                  
                </>
              )}

              {screenValue && screenValue === "Document" && (
                <>
                  <div className="prepare">
                    Prepare the Document for signature
                  </div>
                  <Button
                    text="Proceed"
                    onClick={handleProceedDocument}
                    className="process-btn"
                  />
                </>
              )}

              {screenValue && screenValue === "Bulk Signing" && (
                <>
                  <div className="prepare">
                    Prepare the Document for signature
                  </div>
                  <Button
                    text="Proceed"
                    onClick={handleProceedMultipleDocument}
                    className="process-btn"
                  />
                </>
              )}
            </div>

            <div className="space"></div>
            {screenValue && screenValue ==="Template" && (
                <>
                  <DocumentUpload
              selectedImage={selectedImage}
              errorMessage={errorMessage}
              imageDetails={imageDetails}
              fetchNumberOfPages={fetchNumberOfPages}
              handleImageUpload={handleImageUpload}
              numberOfPages={numberOfPages}
              handleRemoveImage={handleRemoveImage}
            />
            <div className="space"></div>

            <DocumentNameSection
              screenValue={screenValue}
              templateName={templateName}
              settemplateName={settemplateName}
              docName={docName}
              setDocName={setDocName}
            /> 
                </>
            )}
            {/* <DocumentUpload
              selectedImage={selectedImage}
              errorMessage={errorMessage}
              imageDetails={imageDetails}
              fetchNumberOfPages={fetchNumberOfPages}
              handleImageUpload={handleImageUpload}
              numberOfPages={numberOfPages}
              handleRemoveImage={handleRemoveImage}
            />
            <div className="space"></div>

            <DocumentNameSection
              screenValue={screenValue}
              templateName={templateName}
              settemplateName={settemplateName}
              docName={docName}
              setDocName={setDocName}
            /> */}

            {/* sakshi changes */}
            {screenValue && screenValue === "Document" && (
                            <>
                                <DocumentUpload
                                    selectedImage={selectedImage}
                                    errorMessage={errorMessage}
                                    imageDetails={imageDetails}
                                    fetchNumberOfPages={fetchNumberOfPages}
                                    handleImageUpload={handleImageUpload}
                                    numberOfPages={numberOfPages}
                                    handleRemoveImage={handleRemoveImage}
                                />
                                <div className="space"></div>
                                <DocumentNameSection
                                    screenValue={screenValue}
                                    templateName={templateName}
                                    settemplateName={settemplateName}
                                    docName={docName}
                                    setDocName={setDocName}
                                />
                            </>
                        )}
                        {screenValue && screenValue === "Bulk Signing" && (
                            <>
                                {console.log(multipleNumberOfPages)}
                                <MultipleDocumentUpload
                                    selectedImage={multipleSelectedImage}
                                    errorMessage={multipleErrorMessage}
                                    imageDetails={multipleImageDetails}
                                    fetchNumberOfPages={
                                        fetchMultipleNumberOfPages
                                    }
                                    handleImageUpload={
                                        handleMultipleImageUpload
                                    }
                                    numberOfPages={multipleNumberOfPages}
                                    handleRemoveImage={
                                        handleMultipleRemoveImage
                                    }
                                />
                                <div className="space"></div>
                                <DocumentNameSection
                                    screenValue={screenValue}
                                    templateName={templateName}
                                    settemplateName={settemplateName}
                                    docName={multipleDocName}
                                    setDocName={setMultipleDocName}
                                />
                            </>
                        )}

            {/*  */}

            <div className="space"></div>
            {screenValue && screenValue === "Document" && (
              <>
                {/* <TemplateSelectionSection TemplateOptions={TemplateOptions} /> */}
                <TemplateSelectionSection
                  onTemplateSelect={onTemplateSelect}
                  handleTemplateClear={() => {
                    setSelectedTemplate(null);
                    onTemplateSelect(null);
                  }}
                  selectedRowData={selectedRowData}
                  // TemplateOptions={TemplateOptions}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  templateOption={templateOption}
                  setTemplateOption={setTemplateOption}
                />
                <div className="space"></div>
              </>
            )}

            <div className="section3">
              {screenValue && screenValue === "Document" && (
                <div className="Add-Recipients">
                  Add Recipients
                  {selectedTemplate ? (
                    <button className="Add-Recipients-disabled" disabled={true}>
                      Add Recipients
                    </button>
                  ) : (
                    <button
                      className="Add-Recipients-pink"
                      onClick={handleAddRecipient}
                    >
                      Add Recipients
                    </button>
                  )}
                  {/* <button
                    className="Add-Recipients-pink"
                    onClick={handleAddRecipient}
                  >
                    Add Recipients
                  </button> */}
                </div>
              )}
              {screenValue && screenValue === "Bulk Signing" && (
                <div className="Add-Recipients">
                  Add Recipients
                  <button
                    className="Add-Recipients-pink"
                    onClick={handleAddRecipient}
                  >
                    Add Recipients
                  </button>
                </div>
              )}
              {screenValue && screenValue === "Template" && (
                <div className="Add-Recipients">
                  Add Default Recipients
                  <button
                    className="Add-Recipients-pink"
                    onClick={handleAddRecipient}
                  >
                    Add Default Recipients
                  </button>
                </div>
              )}

              <div className="recipients-section">
                {recipientData && (
                  <>
                    <List
                      dataSource={recipientData}
                      onItemReordered={handleChangeItemDragging}
                      itemRender={(id, index) => (
                        <>
                          {isTemplateOptionsSelected != null ? (
                            <>
                              <ApplyTemplateRecipientItem
                                recipient={recipientData[index]}
                                handleDeleteRecipient={handleDeleteRecipient}
                                handleRecipientChange={handleRecipientChange}
                                currentUser={currentUser}
                                setOnceClicked={setOnceClicked}
                                OnceClicked={OnceClicked}
                              />
                            </>
                          ) : (
                            <>
                              <RecipientItem
                                recipient={recipientData[index]}
                                handleRecipientChange={handleRecipientChange}
                                handleDeleteRecipient={handleDeleteRecipient}
                                screenValue={screenValue}
                                currentUser={currentUser}
                                setOnceClicked={setOnceClicked}
                                OnceClicked={OnceClicked}
                              />
                            </>
                          )}
                        </>
                      )}
                      height={354}
                    >
                      <ItemDragging
                        allowReordering={true}
                        group="tasks"
                        data="plannedTasks"
                        showDragIcons={true}
                      />
                    </List>
                  </>
                )}
              </div>
              {screenValue && screenValue === "Document" && (
                <>
                  <div className="checkbox-mycontainer">
                    <div
                      className="checkbox-item"
                      onClick={handleFirstCheckboxChange}
                    >
                      {firstCheckboxChecked ? (
                        <CheckboxLine />
                      ) : (
                        <Checkboxblankline />
                      )}
                      <span className="checkbox-text">
                        Send after the first user action
                      </span>
                    </div>

                    <div
                      className="checkbox-item2"
                      onClick={handleSecondCheckboxChange}
                    >
                      {secondCheckboxChecked ? (
                        <CheckboxLine />
                      ) : (
                        <Checkboxblankline />
                      )}
                      <span className="checkbox-text">Set signing order</span>
                    </div>
                  </div>
                </>
              )}
              {screenValue && screenValue === "Bulk Signing" && (
                <>
                  <div className="checkbox-mycontainer">
                    <div
                      className="checkbox-item"
                      onClick={handleFirstCheckboxChange}
                    >
                      {firstCheckboxChecked ? (
                        <CheckboxLine />
                      ) : (
                        <Checkboxblankline />
                      )}
                      <span className="checkbox-text">
                        Send after the first user action
                      </span>
                    </div>

                    <div
                      className="checkbox-item2"
                      onClick={handleSecondCheckboxChange}
                    >
                      {secondCheckboxChecked ? (
                        <CheckboxLine />
                      ) : (
                        <Checkboxblankline />
                      )}
                      <span className="checkbox-text">Set signing order</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space"></div>

            {screenValue === "Document" && (
              <>
                <EmailMessageSection
                  emailTitle={handleemailTitle}
                  emailMessage={handleEmailMessage}
                  // get the data when click on go back button
                  gemailTitle={emailTitle}
                  gemailMessage={emailMessage}
                />
                <div className="space"></div>
                <ExpirationDateSection
                  scheduledDate={scheduledDate}
                  handleScheduledDateChange={handleScheduledDateChange}
                  maxAndMinLabel={maxAndMinLabel}
                  expirationDays={expirationDays}
                  handleReminderChange={handleReminderChange}
                  reminderDays={reminderDays}
                  reminderOptions={reminderOptions}
                  handleExpirationChange={handleExpirationChange}
                  greminderDays={reminderDays}
                  gexpirationDays={expirationDays}
                />
              </>
            )}
            {screenValue === "Bulk Signing" && (
              <>
                <EmailMessageSection emailTitle={handleemailTitle}
                                    emailMessage={handleEmailMessage}
                                    gemailTitle={emailTitle}
                                    gemailMessage={emailMessage}/>
                <div className="space"></div>
                <ExpirationDateSection
                  scheduledDate={scheduledDate}
                  handleScheduledDateChange={handleScheduledDateChange}
                  maxAndMinLabel={maxAndMinLabel}
                  expirationDays={expirationDays}
                  handleReminderChange={handleReminderChange}
                  reminderDays={reminderDays}
                  reminderOptions={reminderOptions}
                  handleExpirationChange={handleExpirationChange}
                />
              </>
            )}

            <div className="space"></div>

            <div className="lastspace"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashUI;
