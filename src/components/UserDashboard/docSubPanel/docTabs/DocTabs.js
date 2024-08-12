// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./DocTabs.scss";
// import dataSource1 from "devextreme/data/data_source";

// import { Button } from "devextreme-react";
// import { DropDownButton } from "devextreme-react/drop-down-button";
// import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
// import SelectBoxInstance from "devextreme/ui/select_box";
// import { useNavigate } from "react-router-dom";
// import { toastDisplayer } from "../../../toastDisplay/toastDisplayer";
// import {
//     Toolbar,
//     Item,
//     DataGrid,
//     Column,
//     Selection,
//     Paging,
//     SearchPanel,
// } from "devextreme-react/data-grid";
// import moreIcon from "../../../../SVG/more-2-fill.svg";
// import arrowdownicon from "../../../../SVG/arrow-down-s-line.svg";
// import ContextMenu from "devextreme-react/context-menu";
// import List from "devextreme-react/list";
// import { useAuth } from "../../../../contexts/auth";

// var selectedRowData = "";
// let selectBoxVal = 1;

// function DocTabs({ itemName }) {

//     const { user } = useAuth();

//     const gridContainerRef = useRef();
//     const navigate = useNavigate();

//     const [documents, setDocuments] = useState([]);
//     const [dataSource1, setdataSource1] = useState([]);
//     const [dataSource, setdataSource] = useState([]);
//     const [noOfDoc, setNoOfDoc] = useState([]);
//     const [loggedInUserId, setLoggedInUserId] = useState([]);

//     // let dataSource1 = null,
//     // let loggedInUserId = null;
//     const fetchDocumentFunc = (reqObj) => {
//         fetch("http://127.0.0.1:8000/api/getDocuments/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(reqObj),
//         })
//         .then((response) => response.json())
//         .then((data) => {
//             // setNoOfDoc(data.length);
//             // dataSource1 = data;
//             setdataSource1(data);
//             refreshDataGrid();
//             fetch("http://127.0.0.1:8000/api/getDocuments/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     createdByYou: true,
//                     createdByOthers: true,
//                     userid: loggedInUserId,
//                 }),
//             })
//             .then((response) => response.json())
//             .then((data) => {
//                 setNoOfDoc(data.length);
//                 // dataSource1 = data;
//                 setdataSource(data);
//                 // refreshDataGrid();
//             })
//             .catch((error) => {
//                 console.error("Error fetching data:", error);
//             });
//         })
//         .catch((error) => {
//             console.error("Error fetching data:", error);
//         });
//     };
//     useEffect(() => {
//         const getLoggedInUser = async () => {
//             const response = await axios
//                 .get("http://localhost:8000/api/user/", {
//                     headers: {
//                         Authorization: `Bearer ${user}`,
//                     },
//                 })
//                 .then((response) => {
//                     setLoggedInUserId(response.data.id);
//                     // loggedInUserId = response.data.id;
//                 });
//         };

//         getLoggedInUser();
//         let reqObj = {
//             createdByYou: true,
//             createdByOthers: true,
//             userid: loggedInUserId,
//         };
//         fetch("http://127.0.0.1:8000/api/getDocuments/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(reqObj),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 setNoOfDoc(data.length);
//                 // dataSource1 = data;
//                 setdataSource(data);
//                 setdataSource1(data);
//                 refreshDataGrid();
//             })
//             .catch((error) => {
//                 console.error("Error fetching data:", error);
//             });
//     }, []);

//     function refreshDataGrid() {
//         if (gridContainerRef.current) {
//             gridContainerRef.current.instance.option("dataSource", dataSource1);
//         }
//     }

//     const handleDelete = (id) => {
//         const updatedDocuments = documents.filter((item) => item.id !== id);
//         setDocuments(updatedDocuments);

//         handleAddedFilterChange(getSelectBoxValueById("filterDocs"));
//     };

//     const getSelectBoxValueById = (id) => {
//         const selectBox = SelectBoxInstance.getInstance(
//             document.getElementById(id)
//         );
//         if (selectBox) {
//             return selectBox.option("value");
//         }
//         return null;
//     };

//     const createddataSource1 = [
//         {
//             value: 1,
//             text: "All Documents",
//         },
//         {
//             value: 2,
//             text: "Created By You",
//         },
//         {
//             value: 3,
//             text: "Created By Others",
//         },
//     ];

//     const docCellTemplate = (container, options) => {
//         const { data } = options;
//         const documentName = data.name;
//         let createdBy;
//         if (data.creator_id.id == loggedInUserId) {
//             createdBy = "You";
//             const noofrec = data.noOfRec;

//             container.innerHTML = `
//       <div class="document-details">
//         <div class="document-name">${documentName}</div>
//         <span class="document-status">Created by ${createdBy}</span> ,
//           <span class="document-status"> ${noofrec} Recipients</span>
//       </div>
//     `;
//         } else {
//             // fetch("http://127.0.0.1:8000/api/getUserDetails/", {
//             //     method: "POST",
//             //     headers: {
//             //         "Content-Type": "application/json",
//             //     },
//             //     body: JSON.stringify({ userid: data.creator_id }),
//             // })
//             //     .then((response) => response.json())
//             //     .then((data) => {
//             // console.log("created by ", data[0].full_name);
//             createdBy = data.creator_id.full_name;
//             const noofrec = data.noOfRec;
//             container.innerHTML = `
//             <div class="document-details">
//               <div class="document-name">${documentName}</div>
//               <span class="document-status">Created by ${createdBy}</span> ,
//                 <span class="document-status"> ${noofrec} Recipients</span>
//             </div>
//           `;
//             // })
//             // .catch((error) => {
//             //     console.error("Error fetching data:", error);
//             // });
//         }
//     };

//     const statusCellTemplate = (container, options) => {
//         const { data } = options;
//         const statusName = data.status;
//         let unsignedRec = data.UnSignedRec;

//         container.innerHTML = `
//         <div class="statusDetails" >
//           <div class="statusBtn" statustype="${statusName}">
//             <div class="statusCircle" statustype="${statusName}" ></div>
//             <div class="statusText" statustype="${statusName}" >${statusName}</div>
//           </div>
//           <div class="subtext">${unsignedRec} people haven't signed</div>
//         </div>
//     `;
//     };

//     const expdateCellTemplate = (container, options) => {
//         const { data } = options;
//         const expDate = new Date(data.expirationDateTime);
//         const currentDate = new Date(); // Get the current date

//         // Calculate the difference in milliseconds between the expiration date and the current date
//         const timeDiff = expDate.getTime() - currentDate.getTime();

//         // Calculate the difference in days
//         const remDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
//         // const remDays = data.RemDays;

//         container.innerHTML = `
//       <div class="document-details">
//         <div class="document-name">${expDate}</div>
//         <div class="document-status">${remDays} days remaining</div>
//       </div>
//     `;
//     };

//     const modDateCellTemplate = (container, options) => {
//         const { data } = options;
//         console.log("for last modified ", data);
//         const moddate = data.last_modified_date_time;
//         let viewer = "";
//         // fetch("http://127.0.0.1:8000/api/getUserDetails/", {
//         //     method: "POST",
//         //     headers: {
//         //         "Content-Type": "application/json",
//         //     },
//         //     body: JSON.stringify({ userid: data.last_modified_by }),
//         // })
//         //     .then((response) => response.json())
//         //     .then((data) => {
//         //         console.log("last modified", data);
//         viewer = data.last_modified_by.full_name;
//         container.innerHTML = `
//     <div class="document-details">
//       <div class="document-name">${moddate}</div>
//       <div class="document-status">${viewer} has viewed the document </div>
//     </div>
//     `;
//     };

//     const handleClick = (cell) => {
//         console.log(cell);
//     };

//     const handleAddedFilterChange = (val) => {
//         selectBoxVal = val;
//         if (val == 1) {
//             setdataSource1(dataSource);

//         } else if (val == 2) {
//             // created by you
//             // creator_id=loggedInUserId
//             console.log(
//                 "loggedInUserId",
//                 loggedInUserId,
//                 " dataSource1 : ",
//                 dataSource1
//             );
//             const newData = dataSource.filter(
//                 (data) => data.creator_id.id == loggedInUserId
//             );
//             // console.log("newData", newData);
//             setdataSource1(newData);
//         } else {
//             const newData = dataSource.filter(
//                 (data) => data.creator_id.id != loggedInUserId
//             );
//             // console.log("newData", newData);
//             setdataSource1(newData);

//         }
//     };

//     const [selectedQrRowData, setSelectedQrRowData] = useState(null);

//     const onCloneIconClick = (e) => {
//         selectedRowData = e.data;
//     };

//     const actionTemplate = (rowData) => {
//         const actionMenuItems = [
//             {
//                 text: "View Details",
//                 onClick: () => {
//                     console.log("view");
//                     navigate("/ViewDetailsPage", {
//                         state: { status: selectedRowData.Status },
//                     });
//                 },
//             },
//             {
//                 text: "View Document",
//                 onClick: () => {
//                     navigate("/createorsigndocument", {
//                         state: { status: selectedRowData.Status },
//                     });
//                 },
//             },
//             {
//                 text: "Delete",
//                 onClick: () => {
//                     console.log("delete clicked", selectedRowData);
//                     fetch("http://127.0.0.1:8000/api/deleteDocument/", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                         body: JSON.stringify({ docid: selectedRowData.id }),
//                     })
//                         .then((response) => response.json())
//                         .then((data) => {
//                             if (data.status == 200) {
//                                 toastDisplayer(
//                                     "success",
//                                     "Document deleted successfully"
//                                 );

//                                 let reqObj;
//                                 console.log("selected box val ", selectBoxVal);
//                                 switch (selectBoxVal) {
//                                     case 1:
//                                         reqObj = {
//                                             createdByYou: true,
//                                             createdByOthers: true,
//                                             userid: loggedInUserId,
//                                         };

//                                         break;
//                                     case 2:
//                                         reqObj = {
//                                             createdByYou: true,
//                                             createdByOthers: false,
//                                             userid: loggedInUserId,
//                                         };
//                                         break;
//                                     case 3:
//                                         reqObj = {
//                                             createdByYou: false,
//                                             createdByOthers: true,
//                                             userid: loggedInUserId,
//                                         };
//                                         break;
//                                 }

//                                 fetchDocumentFunc(reqObj);
//                             } else {
//                                 toastDisplayer(
//                                     "error",
//                                     "Document can't be deleted"
//                                 );
//                             }
//                             // refreshDataGrid();
//                         })
//                         .catch((error) => {
//                             console.error("Error fetching data:", error);
//                         });
//                 },
//             },
//             {
//                 text: "Download",
//             },
//         ];

//         const actionMenuMode = "context1";

//         return (
//             <>
//                 <div className="actionDetails">
//                     <Button
//                         icon={moreIcon}
//                         className={"actionbtn"}
//                         onClick={() => onCloneIconClick(rowData)}
//                     />
//                 </div>
//                 {actionMenuMode === "context1" && (
//                     <ContextMenu
//                         items={actionMenuItems}
//                         target={".actionbtn"}
//                         showEvent={"dxclick"}
//                         cssClass={"actionMenu"}
//                     />
//                 )}
//             </>
//         );
//     };
//     const handleSearch = (e) => {
//         const searchTerm = e.value;
//         console.log(searchTerm);
//     };

//     return (
//         <>
//             <div className="dashboardData">
//                 <DataGrid
//                     ref={gridContainerRef}
//                     id="gridContainer"
//                     dataSource={dataSource1}
//                     onSelectionChanged={(e) => {
//                         console.log(e.selectedRowKeys); // Handle the selected row keys
//                     }}
//                     // showBorders={true}
//                     width={"100%"}
//                     keyExpr={"id"}
//                 >
//                     {/* <Scrolling columnRenderingMode="virtual" /> */}

//                     <Selection mode="multiple" showCheckBoxesMode="always" />
//                     <Paging enabled={true} defaultPageSize={5} />

//                     <Toolbar>
//                         <Item location="before">
//                             <div className="infoText">
//                                 In {itemName}, you have {noOfDoc} documents
//                             </div>
//                         </Item>
//                         <Item
//                             location="after"
//                             name="searchPanel"
//                             stylingMode="outlined"
//                         />
//                         <Item location="after">
//                             <SelectBox
//                                 id="filterDocs"
//                                 width={"100%"}
//                                 height="44px"
//                                 className="selectbox-right"
//                                 valueExpr="value"
//                                 displayExpr="text"
//                                 stylingMode="outlined"
//                                 // placeholder="Created By"
//                                 // useSelectMode={true}
//                                 value={selectBoxVal}
//                                 items={createddataSource1}
//                                 onValueChanged={(e) =>
//                                     handleAddedFilterChange(e.value)
//                                 }
//                             />
//                         </Item>
//                     </Toolbar>

//                     <SearchPanel
//                         visible={true}
//                         highlightCaseSensitive={true}
//                         width={300}
//                         stylingMode="outlined"
//                         placeholder="Search Documents"
//                     />
//                     <Column
//                         dataField="pdfName"
//                         cellTemplate={docCellTemplate}
//                         caption="DOCUMENT NAME"
//                         allowSorting={false}
//                         width={"30%"}
//                     />
//                     <Column
//                         dataField="Status"
//                         cellTemplate={statusCellTemplate}
//                         caption="STATUS"
//                         allowSorting={false}
//                         width={"15%"}
//                     />
//                     <Column
//                         dataField="ExpirationDate"
//                         cellTemplate={expdateCellTemplate}
//                         caption="EXPIRATION DATE"
//                         allowSorting={false}
//                         width={"15%"}
//                     />
//                     <Column
//                         dataField="LASTMODIFIED"
//                         cellTemplate={modDateCellTemplate}
//                         caption="LAST MODIFIED"
//                         allowSorting={false}
//                         width={"25%"}
//                     />
//                     <Column
//                         dataField="ACTIONS"
//                         cellRender={actionTemplate}
//                         // cellRender={actionTemplate}
//                         caption="ACTIONS"
//                         allowSorting={false}
//                         width={"10%"}
//                     />
//                 </DataGrid>
//             </div>
//         </>
//     );
// }

// export default DocTabs;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DocTabs.scss";
import dataSource1 from "devextreme/data/data_source";

import { Button } from "devextreme-react";
import { DropDownButton } from "devextreme-react/drop-down-button";
import SelectBox, { SelectBoxTypes } from "devextreme-react/select-box";
import SelectBoxInstance from "devextreme/ui/select_box";
import { useNavigate } from "react-router-dom";
import { toastDisplayer } from "../../../toastDisplay/toastDisplayer";
import {
  Toolbar,
  Item,
  DataGrid,
  Column,
  Selection,
  Paging,
  SearchPanel,
  Pager,
} from "devextreme-react/data-grid";
import moreIcon from "../../../../SVG/more-2-fill.svg";
import arrowdownicon from "../../../../SVG/arrow-down-s-line.svg";
import ContextMenu from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import { useAuth } from "../../../../contexts/auth";
import { generateBucketName } from "../../../manageUser/signatureSetup/PdfUtils";

var selectedRowData = "";
let selectBoxVal = 1;

function DocTabs({
  itemName,
  selectedTabIndex,
  dataSource,
  setdataSource,
  dataSource1,
  setdataSource1,
  noOfDoc,
  setNoOfDoc,
  loggedInUserId,
  loggedInEmail,
}) {
  const { user } = useAuth();

  const gridContainerRef = useRef();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const fetchDocumentFunc = (reqObj) => {
    fetch("http://127.0.0.1:8000/api/getDocuments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqObj),
    })
      .then((response) => response.json())
      .then((data) => {
        // setNoOfDoc(data.length);
        // dataSource1 = data;
        setdataSource1(data);
        console.log("data", data);
        // refreshDataGrid();
        fetch("http://127.0.0.1:8000/api/getDocuments/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            createdByYou: true,
            createdByOthers: true,
            userid: loggedInUserId,
            email: loggedInEmail,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setNoOfDoc(data.length);
            // dataSource1 = data;
            // setdataSource(data);
            // refreshDataGrid();
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    console.log("itemName : ", itemName);
    console.log("Data : ", dataSource);
    console.log("selectedTabIndex : ", selectedTabIndex);

    if (selectedTabIndex === "Total") {
      setdataSource1(dataSource);
    } else {
      const newData = dataSource.filter(
        (data) => data.status == selectedTabIndex
      );
      console.log("newData : ", newData);
      setdataSource1(newData);
    }
  }, [selectedTabIndex]);

  function refreshDataGrid() {
    console.log("itemName : ", itemName);
    console.log("dataSource : ", dataSource1);
  }

  const handleDelete = (id) => {
    const updatedDocuments = documents.filter((item) => item.id !== id);
    setDocuments(updatedDocuments);

    handleAddedFilterChange(getSelectBoxValueById("filterDocs"));
  };

  const getSelectBoxValueById = (id) => {
    const selectBox = SelectBoxInstance.getInstance(
      document.getElementById(id)
    );
    if (selectBox) {
      return selectBox.option("value");
    }
    return null;
  };

  const createddataSource1 = [
    {
      value: 1,
      text: "All Documents",
    },
    {
      value: 2,
      text: "Created By You",
    },
    {
      value: 3,
      text: "Created By Others",
    },
  ];

  const [pendingCount, setPendingCount] = useState([]);
  // var pendingCount = [];
  const docCellTemplate = (container, options) => {
    const { data } = options;
    const documentName = data.name;
    const docid = data.id;
    let createdBy;
    if (data.creator_id.id == loggedInUserId) {
      createdBy = "You";
    } else {
      createdBy = data.creator_id.full_name;
    }
    fetch("http://127.0.0.1:8000/api/getRecipientCount/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docid: data.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newItem = { id: docid, pending_count: data.pending_count };
        container.innerHTML = `
                    <div class="document-details">
                        <div class="document-name">${documentName}</div>
                        <span class="document-status">Created by ${createdBy}</span> , 
                        <span class="document-status">Total ${data.recipient_count} Recipients</span>
                    </div>
                    `;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const statusCellTemplate = (container, options) => {
    const { data } = options;
    const statusName = data.status;
    let unsignedRec = data.UnSignedRec;
    fetch("http://127.0.0.1:8000/api/getPendingRecipientCount/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docid: data.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        container.innerHTML = `
                    <div class="statusDetails" >
                    <div class="statusBtn" statustype="${statusName}">
                        <div class="statusCircle" statustype="${statusName}" ></div>
                        <div class="statusText" statustype="${statusName}" >${statusName}</div>
                    </div>
                    <div class="subtext" id=${"pending" + data.id}}>${
          data.pending_count
        } people haven't signed</div>
                    </div>`;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const expdateCellTemplate = (container, options) => {
    const { data } = options;
    const expDate = new Date(data.expirationDateTime);
    const currentDate = new Date(); // Get the current date

    // Calculate the difference in milliseconds between the expiration date and the current date
    const timeDiff = expDate.getTime() - currentDate.getTime();

    // Calculate the difference in days
    const remDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // const remDays = data.RemDays;
    let hours = expDate.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    container.innerHTML = `
      <div class="document-details">
        <div class="document-name">${expDate.getDate()}-${expDate.getMonth()}-${expDate.getFullYear()} ${hours}:${expDate.getMinutes()}:${expDate.getSeconds()} ${ampm}</div>
        <div class="document-status">${remDays} days remaining</div>
      </div>
    `;
  };

  const modDateCellTemplate = (container, options) => {
    const { data } = options;
    // console.log("for last modified ", data);
    const moddate = data.last_modified_date_time;
    const dt = new Date(moddate);
    let hours = dt.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    let viewer = "";
    viewer = data.last_modified_by.full_name;
    container.innerHTML = `
    <div class="document-details">
      <div class="document-name">${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()} ${hours}:${dt.getMinutes()}:${dt.getSeconds()} ${ampm}</div>
      <div class="document-status">${viewer} has viewed the document </div>
    </div>
    `;
  };

  const handleClick = (cell) => {
    console.log(cell);
  };

  const handleAddedFilterChange = (val) => {
    selectBoxVal = val;
    if (val == 1) {
      setdataSource1(dataSource);
    } else if (val == 2) {
      // created by you
      // creator_id=loggedInUserId
      console.log(
        "loggedInUserId",
        loggedInUserId,
        " dataSource1 : ",
        dataSource1
      );
      const newData = dataSource.filter(
        (data) => data.creator_id.id == loggedInUserId
      );
      // console.log("newData", newData);
      setdataSource1(newData);
    } else {
      const newData = dataSource.filter(
        (data) => data.creator_id.id != loggedInUserId
      );
      // console.log("newData", newData);
      setdataSource1(newData);
    }
  };

  const [selectedQrRowData, setSelectedQrRowData] = useState(null);

  const onCloneIconClick = (e) => {
    selectedRowData = e.data;
  };

  const actionTemplate = (rowData) => {
    const actionMenuItems = [
      {
        text: "View Details",
        onClick: () => {
          console.log("view : ", selectedRowData);
          navigate("/ViewDetailsPage", {
            state: { details: selectedRowData },
          });
        },
      },
      {
        text: "View Document",
        onClick: () => {
          navigate(`/ViewDocumentPage?docStatus=${selectedRowData.status}`, {
            state: { docData: selectedRowData },
          });
        },
      },
      {
        text: "Delete",
        onClick:  () => {
          const bucketName = generateBucketName(
            selectedRowData.creator_id.id,
            selectedRowData.creator_id.email
          );
          const fileName = selectedRowData.name + ".pdf";
          console.log(fileName);
          axios.delete(`http://localhost:8000/api/delete_file_from_s3/`, {
            data:{
                bucket_name: bucketName,
                file_name: fileName,}
            }).then(response => {
              fetch("http://127.0.0.1:8000/api/deleteDocument/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ docid: selectedRowData.id }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status == 200) {
                toastDisplayer("success", "Document deleted successfully");

                let reqObj;
                switch (selectBoxVal) {
                  case 1:
                    reqObj = {
                      createdByYou: true,
                      createdByOthers: true,
                      userid: loggedInUserId,
                      email: loggedInEmail,
                    };

                    break;
                  case 2:
                    reqObj = {
                      createdByYou: true,
                      createdByOthers: false,
                      userid: loggedInUserId,
                      email: loggedInEmail,
                    };
                    break;
                  case 3:
                    reqObj = {
                      createdByYou: false,
                      createdByOthers: true,
                      userid: loggedInUserId,
                      email: loggedInEmail,
                    };
                    break;
                }

                fetchDocumentFunc(reqObj);
              } else {
                toastDisplayer("error", "Document can't be deleted");
              }
              // refreshDataGrid();
            })
            .catch((error) => {
              console.error("Error fetching database:", error);
            });
          })
          .catch(error => {
              console.error(error.response.data);
          });

          
        },
      },
      {
        text: "Download",
        onClick: () => {
          const bucketName = generateBucketName(
            selectedRowData.creator_id.id,
            selectedRowData.creator_id.email
          );
          const fileName = selectedRowData.name + ".pdf";

          fetch(
            `http://127.0.0.1:8000/api/generate_presigned_url/${bucketName}/${fileName}/`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                const link = document.createElement("a");
                link.href = data.url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                console.error("Error generating pre-signed URL:", data.error);
              }
            })
            .catch((error) => {
              console.error("Error fetching pre-signed URL:", error);
            });
        },
      },
    ];

    const actionMenuMode = "context1";
    return (
      <>
        <div className="actionDetails">
          <Button
            icon={moreIcon}
            className={"actionbtn"}
            onClick={() => onCloneIconClick(rowData)}
          />
        </div>
        {actionMenuMode === "context1" && (
          <ContextMenu
            items={actionMenuItems}
            target={".actionbtn"}
            showEvent={"dxclick"}
            cssClass={"actionMenu"}
          />
        )}
      </>
    );
  };
  const handleSearch = (e) => {
    const searchTerm = e.value;
    console.log(searchTerm);
  };

  ////rajvi changes
  const handleRowClick = (e) => {
    const dataGrid = e.component;
    const keys = dataGrid.getSelectedRowKeys();
    const isSelected = keys.includes(e.key);
    if (isSelected) {
      dataGrid.deselectRows([e.key]);
    } else {
      dataGrid.selectRows([e.key], true);
    }
  };

  return (
    <>
      <div className="dashboardData">
        <DataGrid
          ref={gridContainerRef}
          id="gridContainer"
          dataSource={dataSource1}
          ////rajvi changes
          onRowClick={handleRowClick}
          onSelectionChanged={(e) => {
            console.log(e.selectedRowKeys); // Handle the selected row keys
          }}
          // showBorders={true}
          width={"100%"}
          keyExpr={"id"}
        >
          {/* <Scrolling columnRenderingMode="virtual" /> */}

          <Selection mode="multiple" showCheckBoxesMode="always" />
          <Paging defaultPageSize={5} />
          <Pager displayMode={"compact"} />

          <Toolbar>
            <Item location="before">
              <div className="infoText">
                In {itemName}, you have {noOfDoc} documents
              </div>
            </Item>
            <Item location="after" name="searchPanel" stylingMode="outlined" />
            <Item location="after">
              <SelectBox
                id="filterDocs"
                width={"100%"}
                height="44px"
                className="selectbox-right"
                valueExpr="value"
                displayExpr="text"
                stylingMode="outlined"
                // placeholder="Created By"
                // useSelectMode={true}
                value={selectBoxVal}
                items={createddataSource1}
                onValueChanged={(e) => handleAddedFilterChange(e.value)}
              />
            </Item>
          </Toolbar>

          <SearchPanel
            visible={true}
            highlightCaseSensitive={true}
            width={300}
            stylingMode="outlined"
            placeholder="Search Documents"
          />
          <Column
            dataField="pdfName"
            cellTemplate={docCellTemplate}
            caption="DOCUMENT NAME"
            allowSorting={false}
            width={"30%"}
          />
          <Column
            dataField="Status"
            cellTemplate={statusCellTemplate}
            caption="STATUS"
            allowSorting={false}
            width={"15%"}
          />
          <Column
            dataField="ExpirationDate"
            cellTemplate={expdateCellTemplate}
            caption="EXPIRATION DATE"
            allowSorting={false}
            width={"15%"}
          />
          <Column
            dataField="LASTMODIFIED"
            cellTemplate={modDateCellTemplate}
            caption="LAST MODIFIED"
            allowSorting={false}
            width={"25%"}
          />
          <Column
            dataField="ACTIONS"
            cellRender={actionTemplate}
            // cellRender={actionTemplate}
            caption="ACTIONS"
            allowSorting={false}
            width={"10%"}
          />
        </DataGrid>
      </div>
    </>
  );
}

export default DocTabs;
