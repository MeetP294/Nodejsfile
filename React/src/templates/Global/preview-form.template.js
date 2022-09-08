import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getDocuCollection } from "../../store/slices/documents";
import "./default.template.less";
import { useHistory } from "react-router";
import { unwrapResult } from "@reduxjs/toolkit";
import { addPackages } from "../../store/slices/packages";
import { NavLink } from "react-router-dom";

const PreviewForm = (props) => {
  const data = props.location.state;
  const history = useHistory();
  const dispatch = useDispatch();
  const uid = data?.field_documents;
  const [packageData, setPackageData] = useState([]);

  useEffect(()=>{
   
     data !== null && data !== undefined && (async() => {
        const PackageList = await dispatch(getDocuCollection(uid));
        const list = unwrapResult(PackageList)?.[0]?.field_documents;
        const arr= typeof(list)=="object" && Object.values(list);
        // const finalList = Object.values(list);
       
        setPackageData(arr);
      })();
    
  }, [uid,data,dispatch]);

  const handleClick = () => {
    dispatch(addPackages({ val: data }));
    history.push({ pathname: "/my-packages" });
  };
  return (
    <>
    {!data?history.push("/packages/add"):<> 
        <div className="table-responsive">
          <table className="PreviewTable">
            <tbody>
              <tr>
                <td className="head">Job Number</td>
                <td>{data?.field_job_number}</td>
              </tr>
              <tr>
                <td className="head">Expiration Date</td>
                <td>{data?.field_expDate}</td>
              </tr>
              <tr>
                <td className="head">Notes</td>
                <td>{data?.field_notes}</td>
              </tr>
              <tr>
                <td className="head">Package Details</td>
                <td>
                  <p>The Jobsite Package includes the following documents:</p>


                  {
              packageData.length>0 && <> <ul>
              {packageData?.map((key, id) => {
                      return (
                        <li key={id}>
                          <NavLink to={`/document/${key.id}`}>{key.label}</NavLink>
                        </li>
                      );
                    })}
            </ul></>
             }
                </td>
              </tr>
              <tr>
                <td className="head">Address</td>
                <td>
                  {data?.address_line1}
                  <br />
                  {data?.address_line2}
                  <br />
                  {data?.locality}, {data?.administrative_area} {data?.postal_code}
                </td>
              </tr>
              <tr>
                <td className="head">Customer Name</td>
                <td>{data?.field_customer_name}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          className="btn btn-danger btn-md"
          onClick={() => history.push({pathname:"/packages/add",state:data})}
        >
          Previous
        </button>
        <button className="btn btn-danger btn-md" onClick={handleClick}>
          Publish
        </button>
      </>}
    </>
  );
};

export default PreviewForm;
