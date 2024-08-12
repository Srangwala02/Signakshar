import React, { useEffect, useState } from "react";
import MyHeader from "./MyHeader";
import "./CreateOrSignDocument.scss";
import TitlePanel from "./TitlePanel";
import DetailPanel from "./DetailPanel";
import Header from "../../header/Header";
import DocumentMain from "./DocumentMain";
import { useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../../../../src/contexts/auth";
import axios from "axios";

function CreateOrSignDocument() {
  const { user } = useAuth();
  const location = useLocation();
  const mystatus = location.state?.status;

  const scheduledDate = location.state?.scheduledDate;

  const selectedFile = location.state?.selectedFile;
  const emailAction = location.state?.emailAction;
  const emailTitle = location.state?.emailTitle;
  const emailMessage = location.state?.emailMessage;
  const Expiration = location.state?.Expiration;
  const reminderDays = location.state?.reminderDays;
  const creatorid = location.state?.creatorid;
  const signOpt = location.state?.signOpt;
  const recipientTempData = location.state?.recipientTempData;

  const [screenValue, setScreenValue] = useState("");
  const [tid, settid] = useState();
  const [did, setdid] = useState();
  const [tempYEs, setTempYes] = useState();
  const [isAnyFieldClicked, setIsAnyFieldClicked] = useState(false);
  const [downloadDraggedData, setDownloadDraggedData] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const templateValue = queryParams.get("template");
    if (templateValue) {
      setScreenValue(templateValue);
    }
    const templateid = queryParams.get("tid");
    settid(templateid);
    const docid = queryParams.get("did");
    setdid(docid);
    const tempYes = queryParams.get("tempYes");
    setTempYes(tempYes);
  }, [location.search]);

  const [templateDraggedData, setTemplateDraggedData] = useState([]);
  const [templateapiData, setTemplateapiData] = useState([]);
  const [docapiData, setdocapiData] = useState([]);
  const [signerOptions, setsignerOptions] = useState([]);
  const [updateRecData, setupdateRecData] = useState([]);
  const [draggedDataTemp, setDraggedDataTemp] = useState([]);

  // Clear states when screenValue, tid, or did changes
  useEffect(() => {
    setTemplateDraggedData([]);
    setTemplateapiData([]);
    setdocapiData([]);
    setsignerOptions([]);
    setupdateRecData([]);
    setDraggedDataTemp([]);
  }, [screenValue, tid, did]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempYesValue = queryParams.get("tempYes");
    const did = queryParams.get("did");

    const fetchTemplateDraggedData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const header = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const response = await axios.get(
          `http://localhost:8000/api/TemplateRecipientByTemplateId/${tid}`,
          {
            headers: header,
          }
        );
        setTemplateDraggedData(response.data);
      } catch (error) {
        console.error("Error fetching template dragged data:", error);
      }
    };

    const fetchTemplateData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const header = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const response = await axios.get(
          `http://localhost:8000/api/TemplateByTemplateId/${tid}`
        );
        setTemplateapiData(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching template data:", error);
        return null;
      }
    };

    const fetchDoc = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/DocumentByDocId/${did}`
        );
        setdocapiData(response.data);
      } catch (error) {}
    };

    if (screenValue === "Template") {
      if (tid) {
        fetchTemplateData();
        fetchTemplateDraggedData();
      }
    } else if (screenValue === "Document" && tempYesValue === "yes") {
      fetchDoc();
    } else if (screenValue === "BulkSigning" && tempYesValue === "no") {
      fetchDoc();
    }

    const fetchDocRecipientData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const header = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const response = await axios.get(
          `http://localhost:8000/api/DocAllRecipientById/${did}`,
          {
            headers: header,
          }
        );
        setTemplateDraggedData(response.data);
      } catch (error) {
        console.error("Error fetching template dragged data:", error);
      }
    };
    if (screenValue === "Document" && tempYesValue === "no") {
      fetchDoc();
      fetchDocRecipientData();
    }
  }, [screenValue, tid]);

//   const [signerOptions, setsignerOptions] = useState([]);
//   const [updateRecData, setupdateRecData] = useState([]);
//   const [draggedDataTemp, setDraggedDataTemp] = useState([]);

  useEffect(() => {
    if (screenValue === "Template") {
      if (templateDraggedData.length > 0) {
        const processedData = templateDraggedData.map((data) => ({
          id: data.id,
          name: data.name,
          role: data.role,
          color: "",
          email: "vivek@gmail.com",
        }));
        console.log("pppppp:", processedData);
        setsignerOptions(processedData);
      }
    }
  }, [screenValue, templateDraggedData]);


//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const tempYesValue = queryParams.get("tempYes");

//     const fetchData = async () => {
//       {
//         try {
//           const jwtToken = localStorage.getItem("jwt");
//           const header = {
//             Authorization: `Bearer ${jwtToken}`,
//           };
//           if (did) {
//             const response = await axios.get(
//               `http://localhost:8000/api/DocAllRecipientById/${did}`,
//               {
//                 headers: header,
//               }
//             );

//             if (response.data.length > 0) {
//               const processedData = response.data.map((data) => ({
//                 id: data.id,
//                 name: data.name,
//                 role: data.roleId,
//                 color: "",
//                 email: data.email,
//               }));
//               setsignerOptions(processedData);

//               if (screenValue === "Document" && tempYesValue === "yes") {
//                 const matchAndUpdateDraggedData = async () => {
//                   try {
//                     const jwtToken = localStorage.getItem("jwt");
//                     const header = {
//                       Authorization: `Bearer ${jwtToken}`,
//                     };
//                     const templateresponse = await axios.get(
//                       `http://localhost:8000/api/TemplateRecipientByTemplateId/${tid}`,
//                       {
//                         headers: header,
//                       }
//                     );
//                     setTemplateDraggedData(templateresponse.data);

//                     if (templateresponse.data.length > 0) {
//                       templateresponse.data.map(async (res) => {
//                         if (res.id && res.role === 1) {
//                           const dragResponse = await axios.get(
//                             `http://localhost:8000/api/getDraggedDataByTempRec/${res.id}`
//                           );
                 
//                           const prodata = dragResponse.data.map((item) => {
                            

//                             let transformedItem = item; // Start with the original item

//                             processedData.forEach((signer) => {
//                               recipientTempData.forEach((index) => {
//                                 if (
//                                   signer.email === index.emailId &&
//                                   item.templateRec === index.id
//                                 ) {
//                                   console.log(
//                                     "Data :    ",
//                                     signer.email,
//                                     " \nindex.emailId : ",
//                                     index.emailId
//                                   );
//                                   transformedItem = {
//                                     ...item,
//                                     name: signer.name,
//                                     signerId: signer.id,
//                                   };
//                                 }
//                               });
//                             });

//                             return transformedItem;
//                           });

//                           console.log("prodata : ", prodata);
//                           setDraggedDataTemp((prevData) => [
//                             ...prevData,
//                             ...prodata,
//                           ]);
//                         }
//                       });
//                       setTemplateDraggedData(recipientTempData);
//                     }
//                   } catch (error) {
//                     console.error(
//                       "Error fetching and matching dragged data:",
//                       error
//                     );
//                   }
//                 };
//                 matchAndUpdateDraggedData();
//               }
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching document recipient data:", error);
//         }

    
//       }
//     };

//     fetchData();
//   }, [screenValue]);
//   const handleSetData = (data) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempYesValue = queryParams.get("tempYes");

    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        const header = {
          Authorization: `Bearer ${jwtToken}`,
        };
        if (did) {
          const response = await axios.get(
            `http://localhost:8000/api/DocAllRecipientById/${did}`,
            {
              headers: header,
            }
          );

          if (response.data.length > 0) {
            const processedData = response.data.map((data) => ({
              id: data.id,
              name: data.name,
              role: data.roleId,
              color: "",
              email: data.email,
            }));
            setsignerOptions(processedData);

            if (screenValue === "Document" && tempYesValue === "yes") {
              const matchAndUpdateDraggedData = async () => {
                try {
                  const jwtToken = localStorage.getItem("jwt");
                  const header = {
                    Authorization: `Bearer ${jwtToken}`,
                  };
                  const templateresponse = await axios.get(
                    `http://localhost:8000/api/TemplateRecipientByTemplateId/${tid}`,
                    {
                      headers: header,
                    }
                  );
                  setTemplateDraggedData(templateresponse.data);

                  if (templateresponse.data.length > 0) {
                    templateresponse.data.map(async (res) => {
                      if (res.id && res.role === 1) {
                        const dragResponse = await axios.get(
                          `http://localhost:8000/api/getDraggedDataByTempRec/${res.id}`
                        );

                        console.log("recipientTempData:", recipientTempData);

                        const prodata = dragResponse.data.map((item) => {
                          console.log("dragResponse : ", dragResponse.data);

                          let transformedItem = item; // Start with the original item

                          processedData.forEach((signer) => {
                            recipientTempData.forEach((index) => {
                              if (
                                signer.email === index.emailId &&
                                item.templateRec === index.id
                              ) {
                                console.log(
                                  "Data :    ",
                                  signer.email,
                                  " \nindex.emailId : ",
                                  index.emailId
                                );

                                // Update the transformed item with the signer data
                                transformedItem = {
                                  ...item,
                                  name: signer.name,
                                  signerId: signer.id,
                                };
                              }
                            });
                          });

                          return transformedItem;
                        });

                        console.log("prodata : ", prodata);
                        setDraggedDataTemp((prevData) => [
                          ...prevData,
                          ...prodata,
                        ]);
                      }
                    });
                    setTemplateDraggedData(recipientTempData);
                  }
                } catch (error) {
                  console.error(
                    "Error fetching and matching dragged data:",
                    error
                  );
                }
              };
              matchAndUpdateDraggedData();
            }
          }
        }
      } catch (error) {
        console.error("Error fetching document recipient data:", error);
      }
    };

    fetchData();
  }, [screenValue]);

  const handleSetData = (data) => {

    setupdateRecData(data);
  };

  return (
    <>
      <div className="my-container">
        <MyHeader title={"Sign-akshar"} screenValue={screenValue} docId={did} />
        <div className="my-main-container">
          {screenValue && screenValue === "Template" && (
            <TitlePanel
              title={templateapiData.templateName}
              tid={tid}
              templateDraggedData={templateDraggedData}
              updateRecData={updateRecData}
              signStatus={mystatus}
              screenValue={screenValue}
              signerOptions={signerOptions}
            />
          )}
          {screenValue && screenValue === "Document" && (
            <TitlePanel
              title={docapiData.name}
              creatorid={creatorid}
              did={did}
              signerOptions={signerOptions}
              selectedFile={selectedFile}
              tid={tid}
              tempYEs={tempYEs}
              templateDraggedData={templateDraggedData}
              updateRecData={updateRecData}
              signStatus={mystatus}
              screenValue={screenValue}
              emailAction={emailAction}
              Expiration={Expiration}
              docapiData={docapiData}
              setDownloadDraggedData={setDownloadDraggedData}
              downloadDraggedData={downloadDraggedData}
            />
          )}
          {screenValue && screenValue === "BulkSigning" && (
            <TitlePanel
              title={docapiData.name}
              creatorid={creatorid}
              did={did}
              signerOptions={signerOptions}
              selectedFile={selectedFile}
              tid={tid}
              tempYEs={tempYEs}
              templateDraggedData={templateDraggedData}
              updateRecData={updateRecData}
              signStatus={mystatus}
              screenValue={screenValue}
              emailAction={emailAction}
              Expiration={Expiration}
              docapiData={docapiData}
            />
          )}
          <DetailPanel
            tempYEs={tempYEs}
            did={did}
            tid={tid}
            signOpt={signOpt}
            scheduledDate={scheduledDate}
            Expiration={Expiration}
            emailTitle={emailTitle}
            emailMessage={emailMessage}
            docapiData={docapiData}
            reminderDays={reminderDays}
            templateapiData={templateapiData}
            templateDraggedData={templateDraggedData}
            signerOptions={signerOptions}
            setIsAnyFieldClicked={setIsAnyFieldClicked}
            isAnyFieldClicked={isAnyFieldClicked}
            screenValue={screenValue}
            selectedFile={selectedFile}
            recipientTempData={recipientTempData}
            draggedDataTemp={draggedDataTemp}
          />
        </div>
        <DocumentMain
          selectedFile={selectedFile}
          screenValue={screenValue}
          tempYEs={tempYEs}
          signerOptions={signerOptions}
          updateRecData={updateRecData}
          setupdateRecData={setupdateRecData}
          handleSetData={handleSetData}
          draggedDataTemp={draggedDataTemp}
          recipientTempData={recipientTempData}
          setIsAnyFieldClicked={setIsAnyFieldClicked}
          isAnyFieldClicked={isAnyFieldClicked}
          title={docapiData.name}
          setDownloadDraggedData={setDownloadDraggedData}
          downloadDraggedData={downloadDraggedData}
        />
      </div>
    </>
  );
}

export default CreateOrSignDocument;

