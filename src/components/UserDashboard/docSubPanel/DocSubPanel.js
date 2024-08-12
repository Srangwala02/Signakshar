// import React from "react";
// import "./DocSubPanel.scss";
// import TabPanel from "devextreme-react/tab-panel";
// import { Item } from "devextreme-react/tabs";
// import   MySplitBtn   from "../mySplitBtn/MySplitBtn";
// import DocTabs from "./docTabs/DocTabs";

// function DocSubPanel() {
  
//   return (
//     <>
//       <div className="docHead">
//         <p className="doctext">Documents</p>
//         <div className="mainSplit">
//         <MySplitBtn/>
//         </div>
//       </div>

//       <div className="docTabs">
//         <TabPanel>
        
//           <Item title="Total">
//             <DocTabs itemName="total" />
//           </Item>
//           <Item title="Draft">
//             <DocTabs itemName="draft" />
//           </Item>
//           <Item title="Pending">
//             <div className="demo">Draw tab content</div>
//           </Item>
//           <Item title="Completed">
//             <div className="demo">Draw tab content</div>
//           </Item>
//           <Item title="Void">
//             <div className="demo">Draw tab content</div>
//           </Item>
//         </TabPanel>
//       </div>
//     </>
//   );
// }

// export default DocSubPanel;
import React,{ useState, useCallback, useEffect } from 'react';
import "./DocSubPanel.scss";
import TabPanel from "devextreme-react/tab-panel";
import { Item } from "devextreme-react/tabs";
import   MySplitBtn   from "../mySplitBtn/MySplitBtn";
import DocTabs from "./docTabs/DocTabs";
import axios from 'axios';
import { useAuth } from '../../../contexts/auth';

function DocSubPanel() {
  const [selectedTabIndex, setSelectedTabIndex] = useState("Total");
  // const onTabSelectionChanged = useCallback((e) => {
  //   setSelectedTabIndex(index);
  // }, []);
  const onTabSelectionChanged = useCallback((index) => {
    console.log("index title ", index.addedItems[0].title)
    // console.log("index ",index)
    setSelectedTabIndex(index.addedItems[0].title);
  }, []);

  // new changes
  const [dataSource1, setdataSource1] = useState([]);
  const [dataSource, setdataSource] = useState([]);
  const [noOfDoc, setNoOfDoc] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState([]);
  const [loggedInEmail, setLoggedInEmail] = useState([]);

  const { user } = useAuth();
  useEffect(() => {
    // const getLoggedInUser = async () => {
        const response = axios
            .get("http://localhost:8000/api/user/", {
                headers: {
                    Authorization: `Bearer ${user}`,
                },
            })
            .then((response) => {
                console.log("setting user id",response.data.id);
                setLoggedInUserId(response.data.user.id);
                console.log("response.data : ",response.data);
                setLoggedInEmail(response.data.user.email);
                // loggedInUserId = response.data.id;
                let reqObj = {
                    createdByYou: true,
                    createdByOthers: true,
                    userid: response.data.user.id,
                    email: response.data.user.email
                };
                console.log(reqObj);
                console.log(loggedInUserId)
                fetch("http://127.0.0.1:8000/api/getDocuments/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reqObj),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setNoOfDoc(data.length);
                        // dataSource1 = data;
                        console.log("data : ", data);
                        setdataSource(data);
                        
                        setdataSource1(data);
                        // refreshDataGrid();
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            });
    // };

    // getLoggedInUser();
    
}, []);
  // const newArray = ["Total", "Draft", "Pending", "Completed", "Lapsed"];
  const newArray = ["Total","Pending", "Completed"];
  return (
    <>
      <div className="docHead">
        <p className="doctext">Documents</p>
        <div className="mainSplit">
        <MySplitBtn/>
        </div>
      </div>

      <div className="docTabs">
        <TabPanel 
                onSelectionChanged={onTabSelectionChanged}>
          {newArray.map((item) => { 
            return (<Item title={item}>
              <DocTabs itemName={item} selectedTabIndex={selectedTabIndex} dataSource={dataSource} setdataSource={setdataSource} dataSource1={dataSource1} setdataSource1={setdataSource1} noOfDoc={noOfDoc} setNoOfDoc={setNoOfDoc} loggedInUserId={loggedInUserId} loggedInEmail={loggedInEmail} />
            </Item>);
          })}
          {/* <Item title="Total">
            <DocTabs itemName="Total" selectedTabIndex={selectedTabIndex} dataSource={dataSource} setdataSource={setdataSource} dataSource1={dataSource1} setdataSource1={setdataSource1} noOfDoc={noOfDoc} setNoOfDoc={setNoOfDoc} loggedInUserId={loggedInUserId} loggedInEmail={loggedInEmail} />
          </Item>
          <Item title="Draft">
            <DocTabs itemName="Draft" selectedTabIndex={selectedTabIndex} dataSource={dataSource} setdataSource={setdataSource} dataSource1={dataSource1} setdataSource1={setdataSource1} noOfDoc={noOfDoc} setNoOfDoc={setNoOfDoc} loggedInUserId={loggedInUserId} loggedInEmail={loggedInEmail} />
          </Item>
          <Item title="Pending">
            <DocTabs itemName="Pending" selectedTabIndex={selectedTabIndex} dataSource={dataSource} setdataSource={setdataSource} dataSource1={dataSource1} setdataSource1={setdataSource1} noOfDoc={noOfDoc} setNoOfDoc={setNoOfDoc} loggedInUserId={loggedInUserId} loggedInEmail={loggedInEmail} />
          </Item>
          <Item title="Completed">
            <DocTabs itemName="Completed" selectedTabIndex={selectedTabIndex} dataSource={dataSource} setdataSource={setdataSource} dataSource1={dataSource1} setdataSource1={setdataSource1} noOfDoc={noOfDoc} setNoOfDoc={setNoOfDoc} loggedInUserId={loggedInUserId} loggedInEmail={loggedInEmail} />
          </Item>
          <Item title="Void">
            <div className="demo">Draw tab content</div>
          </Item> */}
        </TabPanel>
      </div>
    </>
  );
}

export default DocSubPanel;
