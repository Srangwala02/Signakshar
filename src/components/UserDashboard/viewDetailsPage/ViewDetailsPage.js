// import React from "react";
// import Header from "../../dashBoard/Header2/Header";
// // import "../../../layouts/side-nav-outer-toolbar/side-nav-outer-toolbar.scss";
// import "./ViewDetailsPage.scss";
// import { useLocation } from "react-router-dom";

// function ViewDetailsPage({ status }) {
//   const location = useLocation();
//   const mystatus = location.state?.status;

//   const recipientDataStatic = [
//     {
//       id: 1,
//       FullName: "Rani Patel",
//       EmailId: "rani@gmail.com",
//       Role: "Signer",
//       Fields: 3,
//       Status: "Pending",
//     },
//     {
//       id: 2,
//       FullName: "Raj Patel",
//       EmailId: "raj@gmail.com",
//       Role: "Viewer",
//       Fields: 2,
//       Status: "Completed",
//     },
//     {
//       id: 3,
//       FullName: "Rajvi Gajjar",
//       EmailId: "rajvigajjar2003@gmail.com",
//       Role: "Signer",
//       Fields: 1,
//       Status: "Lapsed",
//     },
//   ];

//   return (
//     <>
//       <div className="viewInfoMain">
//         <Header title={"Sign-akshar"} />
//         <div className="viewinfo">
//           <div className="docDetailInfo">
//             <div className="docImg">
//               {/* <img height="197" width="158" src='C:\Users\rajvi\OneDrive\Desktop\react\Hastakshar\hastakshar\1 2.png' /> */}
//             </div>
//             <div className="docDetail">
//               <div class="statusDetails">
//                 <div class="statusBtn" statustype={mystatus}>
//                   <div class="statusCircle" statustype={mystatus}></div>
//                   <div class="statusText" statustype={mystatus}>
//                     {mystatus}
//                   </div>
//                 </div>
//               </div>

//               <p className="filenameClass">QIT DEMO.pdf</p>
//               <p className="expiresClass">Expires on 20th April</p>
//               <p className="recClass">5 Recipients</p>
//             </div>
//           </div>

//           <div className="divider"></div>

//           <div className="recipientDet">
//             <p className="recText">RecipientDetails</p>

//             {recipientDataStatic.map((r) => (
//               <div key={r.id} className="recinfo">
//                 <div className="recidClass">{r.id}</div>
//                 <div className="subrecInfo">
//                   <div className="headText">Full Name</div>
//                   <div className="recTxt">{r.FullName}</div>
//                 </div>
//                 <div className="subrecInfo">
//                   <div className="headText">Email</div>
//                   <div className="recTxt">{r.EmailId}</div>
//                 </div>
//                 <div className="subrecInfo">
//                   <div className="headText">Role</div>
//                   <div className="recTxt">{r.Role}</div>
//                 </div>
//                 <div className="subrecInfo">
//                   <div className="headText">Fields</div>
//                   <div className="recTxt">{r.Fields}</div>
//                 </div>
//                 <div className="subrecInfo">
//                   <div class="statusDetails">
//                     <div class="statusBtn" statustype={r.Status}>
//                       <div class="statusCircle" statustype={r.Status}></div>
//                       <div class="statusText" statustype={r.Status}>
//                         {r.Status}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="divider"></div>

//           <div className="signOrderClass">
//             <div className="recText">Signing Order</div>
//             <div className="orderText">Send after the first user action</div>
//           </div>

//           <div className="divider"></div>

//           <div className="emMsgClass">
//             <div className="recText">Email Message</div>
//             <div className="emSubClass">
//               <div className="orderText">Title</div>
//               <div className="emSubText">Enter Email Address</div>
//             </div>
//             <div className="emSubClass">
//               <div className="orderText">Description</div>
//               <div className="emSubText">Enter Email Address</div>
//             </div>
//           </div>

//           <div className="divider"></div>

//           <div className="emMsgClass">
//             <div className="recText">Other Details</div>
//             <div className="emSubClass">
//               <div className="orderText">Expiration Date</div>
//               <div className="emSubText">29/11/2024</div>
//             </div>
//             <div className="emSubClass">
//               <div className="orderText">Reminder</div>
//               <div className="emSubText">Every 2 days</div>
//             </div>
//           </div>

//           <div className="divider"></div>

//           <div className="trackClass">
//             <div className="recText">Tracking History</div>
//             <div className="trackBox">
//               <div className="trackGraphic">
//                 <div className="trackCircle"></div>
//                 <div className="trackLine"></div>
//               </div>
//               <div className="trackInfo">
//                 <div className="orderText">Rani Patel - Signer</div>
//                 <div className="trackText">3:08 p.m. | 11 April 2023</div>
//               </div>

//             </div>
//             <div className="trackBox">
//               <div className="trackGraphic">
//                 <div className="trackCircle"></div>
//                 <div className="trackLine"></div>
//               </div>
//               <div className="trackInfo">
//                 <div className="orderText">Rani Patel - Signer</div>
//                 <div className="trackText">3:08 p.m. | 11 April 2023</div>
//               </div>
              
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// export default ViewDetailsPage;

import React, { useEffect, useState } from "react";
import Header from "../../dashBoard/Header2/Header";
import "./ViewDetailsPage.scss";
import { useLocation } from "react-router-dom";

function ViewDetailsPage() {
  const location = useLocation();
  const { details } = location.state || {};
  const [recipientCount, setRecipientCount] = useState(0);
  const [recipientDetails, setRecipientDetails] = useState(null);
  const [recipientStatus, setRecipientStatus] = useState([]);
  let totalRecipients;
  const expiryDate = new Date(details.expirationDateTime);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/getRecipientCount/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docid: details.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipientCount(data.recipient_count);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    fetch("http://127.0.0.1:8000/api/getRecipientDetails/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docid: details.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("rec details : ", data);

        setRecipientDetails(data);
        data.map((recipient) => {
          fetch("http://127.0.0.1:8000/api/getStatus/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              docid: recipient.docId,
              email: recipient.email,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("status :", data);
              setRecipientStatus(data);
              if (
                data[0].status == "sent" ||
                data[0].status == "Pending" ||
                data[0].status == "Pending" ||
                data[0].status == "Sent"
              ) {
                document.getElementById("status" + data[0].emails).innerHTML =
                  "Pending";
                document
                  .getElementById("status" + data[0].emails)
                  .setAttribute("statusType", "Pending");
                document
                  .getElementById("stype" + data[0].emails)
                  .setAttribute("statusType", "Pending");
                document
                  .getElementById("sbtn" + data[0].emails)
                  .setAttribute("statusType", "Pending");
              } else {
                document.getElementById("status" + data[0].emails).innerHTML =
                  data[0].status;
                document
                  .getElementById("status" + data[0].emails)
                  .setAttribute("statusType", data[0].status);
                document
                  .getElementById("stype" + data[0].emails)
                  .setAttribute("statusType", data[0].status);
                document
                  .getElementById("sbtn" + data[0].emails)
                  .setAttribute("statusType", data[0].status);
              }
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  let last_modified = new Date(details.last_modified_date_time);
  let hours = last_modified.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  let month;
  switch (last_modified.getMonth() + 1) {
    case 1:
      month = "January";
      break;
    case 2:
      month = "February";
      break;
    case 3:
      month = "March";
      break;
    case 4:
      month = "April";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "June";
      break;
    case 7:
      month = "July";
      break;
    case 8:
      month = "August";
      break;
    case 9:
      month = "September";
      break;
    case 10:
      month = "October";
      break;
    case 11:
      month = "November";
      break;
    case 12:
      month = "December";
      break;
  }

  return (
    <>
      <div className="viewInfoMain">
        <Header title={"Sign-akshar"} />
        <div className="viewinfo">
          <div className="docDetailInfo">
            <div className="docImg">
              {/* <img height="197" width="158" src='C:\Users\rajvi\OneDrive\Desktop\react\Hastakshar\hastakshar\1 2.png' /> */}
            </div>
            <div className="docDetail">
              <div class="statusDetails">
                <div class="statusBtn" statustype={details.status}>
                  <div class="statusCircle" statustype={details.status}></div>
                  <div class="statusText" statustype={details.status}>
                    {details.status}
                  </div>
                </div>
              </div>

              <p className="filenameClass">{details.name}</p>
              <p className="expiresClass">
                Expires on {expiryDate.getDate()}-{expiryDate.getMonth()}-
                {expiryDate.getFullYear()}
              </p>
              <p className="recClass">{recipientCount} Recipients</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="recipientDet">
            <p className="recText">RecipientDetails</p>

            {recipientDetails ? (
              recipientDetails.map((r) => (
                <div key={r.id} className="recinfo">
                  <div className="recidClass">{r.id}</div>
                  <div className="subrecInfo">
                    <div className="headText">Full Name</div>
                    <div className="recTxt">{r.name}</div>
                  </div>
                  <div className="subrecInfo">
                    <div className="headText">Role</div>
                    <div className="recTxt">
                      {r.roleId == 1 ? "Signer" : "Viewer"}
                    </div>
                  </div>
                  <div className="subrecInfo">
                    <div class="statusDetails">
                      <div
                        class="statusBtn"
                        id={"sbtn" + r.email}
                        statustype=""
                      >
                        <div
                          class="statusCircle"
                          id={"stype" + r.email}
                          statustype=""
                        ></div>
                        <div
                          class="statusText"
                          id={"status" + r.email}
                          statustype=""
                        >
                          {r.Status}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="subrecInfo">
                    <div className="headText">Email</div>
                    <div className="recTxt">{r.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>Loading recipient details...</div>
            )}
          </div>

          <div className="divider"></div>

          <div className="emMsgClass">
            <div className="recText">Email Message</div>
            <div className="emSubClass">
              <div className="orderText">Title</div>
              <div className="emSubText">{details.email_title}</div>
            </div>
            <div className="emSubClass">
              <div className="orderText">Description</div>
              <div className="emSubText">{details.email_msg}</div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="emMsgClass">
            <div className="recText">Other Details</div>
            <div className="emSubClass">
              <div className="orderText">Expiration Date</div>
              <div className="emSubText">
                {expiryDate.getDate()}-{expiryDate.getMonth()}-
                {expiryDate.getFullYear()}
              </div>
            </div>
            <div className="emSubClass">
              <div className="orderText">Reminder</div>
              <div className="emSubText">Every 2 days</div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="trackClass">
            <div className="recText">Tracking History</div>
            <div className="trackBox">
              <div className="trackGraphic">
                <div className="trackCircle"></div>
                <div className="trackLine"></div>
              </div>
              <div className="trackInfo">
                <div className="orderText">
                  {details.last_modified_by.full_name}
                </div>
                <div className="trackText">
                  {hours}:{last_modified.getMinutes()} {ampm} |{" "}
                  {last_modified.getDate()} {month}{" "}
                  {last_modified.getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewDetailsPage;
