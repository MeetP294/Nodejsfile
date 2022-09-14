/* --------------------------------- IMPORTS -------------------------------- */

import React, { useEffect,useState } from "react";
import "./package.template.less";
import { getSinglePackage } from "../../store/slices/packages";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unwrapResult } from "@reduxjs/toolkit";
import { NavLink } from "react-router-dom";
import axios from "axios";


/* -------------------------------------------------------------------------- */

/**
 * Package Template
 * @export
 * @class PackageTemplate
 * @extends {Component}
 */
 function PackageTemplate(props) {
   const userid=props.location.state
console.log(userid);
   const[pdfData,setPdfData]=useState()
   const[data,setData]=useState()
   const dispatch=useDispatch()
   const user=useSelector(state=>state?.user)
   const current_package=useSelector(state=>state?.packages?.data?.current_package)
   const subscriber = current_package?.field_subscriber_reference?.label
   const subscriber_url = subscriber !== "" ? subscriber?.toLowerCase().replace(/ /g, "-") : "qualtim"
   const package_url = `/package/${subscriber_url}/${current_package.nid}`
   useEffect(()=>{
    (async () => {
        const resultAction = await dispatch(getSinglePackage(userid?.nid));
        const originalPromiseResult = unwrapResult(resultAction);
        const pdf_ref=originalPromiseResult?.[0]?.field_pdf_reference
        const pdf_data= pdf_ref !== undefined &&  Object.values(pdf_ref).map((key) => key.field_pdf);
console.log(originalPromiseResult);
        setPdfData(pdf_data)
      
          // function compareFunction(a, b) {
          //   return a.id - b.id;
          // }
          const NotesString=(originalPromiseResult?.field_notes?.[0]?.value)===undefined?"":originalPromiseResult?.field_notes?.[0]?.value
          const customerNamestring=(originalPromiseResult?.field_custumer_namoriginalPromiseResult?.[0]?.value)===undefined?"":originalPromiseResult?.field_custumer_namoriginalPromiseResult?.[0]?.value
          const data1= {
            jobNumber: originalPromiseResult?.field_job_number?.[0]?.value,
            ExpirationDate: "2022-10-06",
            Notes:NotesString ,
            PackageDetails: pdf_data,
            Address: originalPromiseResult?.field_address?.[0]?.administrative_area,
            customerName: customerNamestring,
          };
          setData(data1)

        })();
      },[userid?.nid,dispatch])
console.log(data);
   const handleClick=()=>{
     pdfData ?  axios.post(process.env.REACT_APP_API_URLQ,data).then(res=>{let x=res.data.path; setTimeout(()=>window.open(x),3000)}):alert("Pdf is not there")

   }

   return (
    <div className="main-wrapper">

    { user.isLoggedIn && Object.keys(current_package).length > 0 &&
      <div className="package--wrapper">
        <h1 className="page-header">{current_package.title}</h1>
        <ul className="nav-tabs">
          <li className="active"><NavLink to={{ pathname: package_url }}>View</NavLink></li>
          <li>
            <NavLink to={{ pathname: `/package/edit`, state: {id:current_package.nid,title:current_package.title}}}>
              Edit
            </NavLink>
          </li>
        </ul>
        <div className="package--location-ref">
          <label>Location Reference:&nbsp;</label>
          <span>{current_package.field_location_reference && current_package.field_location_reference.label}</span>
        </div>
        <div className="package--locid">
          <label>LOCID:&nbsp;</label>
          <span>{current_package.field_locid_package.length > 0 && current_package.field_locid_package[0].value}</span>
        </div>
        <div className="package--updated">
          <label>Last Modified:&nbsp;</label>
          <span>{current_package.updated}</span>
        </div>
        { current_package.field_qr_code_image && 
          <div className="package--barcode"
          dangerouslySetInnerHTML={{ __html: current_package.field_qr_code_image }} />
        }
        { current_package.field_pdf &&
          <div className="package--btn-links">
            <button className="btn btn-danger" onClick={handleClick}>PDF&nbsp; <FontAwesomeIcon icon={['far', 'file-pdf']} /></button>
          </div>	
        }
        </div>
      }
    </div>
  );
}



 export default PackageTemplate