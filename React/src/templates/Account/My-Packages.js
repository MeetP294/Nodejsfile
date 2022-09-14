import React, { useEffect, useState } from "react";

import {getMyPackages} from "../../store/slices/packages";
import { useSelector, useDispatch } from "react-redux";
import "../Global/default.template.less";
import Pagination from "react-js-pagination";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios"
import { message } from "antd";
import { getSinglePackage } from "../../store/slices/packages";

const MyPackages = () => {
  const uid = localStorage.getItem("SBCA__user");
  const [number, SetNumber] = useState(1);
  const dispatch = useDispatch();
  const Joblist = useSelector((state) => state?.packages?.data?.my_packages);
  const list = Joblist?.slice((number - 1) * 10, (number - 1) * 10 + 10);
  const total = Joblist?.length;
  const id = JSON?.parse(uid).uid;
  useEffect(() => {
    dispatch(getMyPackages(id)); 
  }, [id,dispatch]);
  const handlePageChange = (e) => {
    SetNumber(e);
  };

  const handleClick =  (e) => {
    message.info("Please wait for a few minutes while we are generating your PR");

    (async () => {
    //   const collectionOfPdf = await dispatch(getMyPackages(id));
    const resultAction = await dispatch(getSinglePackage(e.nid));
    const originalPromiseResult = unwrapResult(resultAction);
    const pdf_ref=originalPromiseResult?.[0]?.field_pdf_reference
    const pdf_data= pdf_ref !== undefined &&  Object.values(pdf_ref).map((key) => key.field_pdf);

    console.log(pdf_data ,pdf_ref);
    //   const list1 = unwrapResult(collectionOfPdf)?.[0]?.field_documents;
  
    //   const pdf = Object.values(list1).map((key) => key.field_pdf);
    //  const finalPdf=pdf_data?.sort(compareFunction);
      // compare function
      // function compareFunction(a, b) {
      //   return a.id - b.id;
      // }
      const NotesString=(e?.field_notes?.[0]?.value)===undefined?"":e?.field_notes?.[0]?.value
      const customerNamestring=(e?.field_custumer_name?.[0]?.value)===undefined?"":e?.field_custumer_name?.[0]?.value
      const data = {
        jobNumber: e?.field_job_number?.[0]?.value,
        ExpirationDate: "2022-10-06",
        Notes:NotesString ,
        PackageDetails: pdf_data,
        Address: e?.field_address?.[0]?.administrative_area,
        customerName: customerNamestring,
      };

     
         pdf_data ?  axios.post(process.env.REACT_APP_API_URLQ,data).then((res)=>window.open(res.data.path)):alert("Pdf is not there")
  })();
    
   
  
  };
  return (
    <>
     
        <h1 className="page-header">My Packages</h1>
        <p>
          The table below lists jobsite packages that have been created for your
          location.
        </p>
        <p className="no-mrgn-btm">
          <a className="btn btn-danger" href="/packages/add">
             <FontAwesomeIcon icon={faPlus} /> New Jobsite Package
          </a>
        </p>
        <div className="table-responsive">
          <table className="PreviewTable">
            <thead>
              <tr>
                <th>Job Number</th>
                <th>Updated date</th>
                <th className="txt-center">Published</th>
                <th>Created by</th>
                <th className="txt-center">PDF</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((pack, id) => {
                const published = pack.status === "1" ? "&#10003;" : "&#10006;";
                const subscriber = pack?.field_subscriber_reference?.label;
                // const subscriberID = pack?.field_subscriber_reference?.id;
                const subscriber_url =
                  subscriber !== ""
                    ? subscriber.toLowerCase().replace(/ /g, "-")
                    : "qualtim";
                return (
                  <>
                    <tr id={id} key={id}>
                      <td>
                        <NavLink to={{pathname:`/package/${subscriber_url}/${pack.nid}`,state:pack}}>
                          #
                          {pack.field_job_number &&
                            pack.field_job_number[0].value}
                        </NavLink>
                      </td>
                      <td>{pack?.created}</td>
                      <td>
                        <div
                          className="text-center bold"
                          dangerouslySetInnerHTML={{ __html: published }}
                        />
                      </td>
                      <td>{pack?.created_by?.name[0].value}</td>
                      <td className="txt-center">
                      <button className="btn btn-danger btn-sm" onClick={() => handleClick(pack)}>PDF &nbsp; <FontAwesomeIcon icon={['far', 'file-pdf']} /></button>
                      </td>
                      <td>
                        <NavLink
                          to={{
                            pathname: `/package/edit`,
                            state: {id:pack.nid,title:pack.title},
                          }}
                        >
                          Edit
                        </NavLink>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {list.length > 10 &&
          <div className="text-center">
            <Pagination
              totalItemsCount={total}
              onChange={handlePageChange}
              activePage={number}
              itemsCountPerPage={10}
              pageRangeDisplayed={5}
            />
          </div>
        }
    </>
  );
};

export default MyPackages;
